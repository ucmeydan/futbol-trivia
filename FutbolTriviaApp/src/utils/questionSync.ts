/**
 * Soru Verisi Güncelleme Mekanizması
 *
 * Uygulama her açılışında web sitesinden güncel soru verilerini çekmeye çalışır.
 * Başarısızsa (offline veya hata) bundled (yerel) verilerle devam eder.
 * Başarılıysa yeni veriyi AsyncStorage'a yazar; bir sonraki açılışta hemen kullanılır.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://futboltrivia.com.tr/data';

const QUESTION_FILES = [
  'questions-listeyi-tamamla-kolay',
  'questions-listeyi-tamamla-zor',
  'questions-top10-kolay',
  'questions-top10-zor',
  'questions-kariyer-yolu-kolay',
  'questions-kariyer-yolu-zor',
  'questions-takim-arkadasi-kolay',
  'questions-takim-arkadasi-zor',
] as const;

type QuestionFile = typeof QUESTION_FILES[number];

const STORAGE_KEY_PREFIX = 'synced_questions_';
const SYNC_TIMESTAMP_KEY = 'last_sync_timestamp';
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 saatte bir kontrol et

/**
 * Tek bir soru dosyasını fetch eder ve saklar.
 */
async function fetchAndStoreFile(file: QuestionFile): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/${file}.json`, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(8000), // 8 saniye timeout
    });
    if (!response.ok) return false;
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return false;
    await AsyncStorage.setItem(STORAGE_KEY_PREFIX + file, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/**
 * Tüm soru dosyalarını kontrol eder, gerekirse günceller.
 * Arka planda çalışır — UI'ı bloklamaz.
 */
export async function syncQuestionsInBackground(): Promise<void> {
  try {
    const lastSync = await AsyncStorage.getItem(SYNC_TIMESTAMP_KEY);
    const now = Date.now();

    if (lastSync && now - parseInt(lastSync) < SYNC_INTERVAL_MS) {
      return; // Henüz erken
    }

    const results = await Promise.allSettled(
      QUESTION_FILES.map(file => fetchAndStoreFile(file))
    );

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;

    if (successCount > 0) {
      await AsyncStorage.setItem(SYNC_TIMESTAMP_KEY, String(now));
    }
  } catch {
    // Sessizce geç — offline durumu normal
  }
}

/**
 * Belirli bir soru dosyasının güncel halini döner.
 * Önce sync edilmiş veriyi, yoksa bundled veriyi kullanır.
 */
export async function getQuestions(file: QuestionFile): Promise<any[] | null> {
  try {
    const cached = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + file);
    if (cached) return JSON.parse(cached);
    return null; // Yoksa oyunlar kendi bundled import'larını kullanır
  } catch {
    return null;
  }
}
