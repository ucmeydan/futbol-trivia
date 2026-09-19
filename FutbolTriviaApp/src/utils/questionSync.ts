/**
 * Oyun Verisi — build'siz güncelleme
 *
 * Oyunlar veriyi `getData(key)` ile okur: önce siteden senkronlanan (AsyncStorage)
 * veri, yoksa uygulamayla gelen (bundled) veri. Böylece siteyi güncelleyip deploy
 * edince (futboltrivia.com.tr/data/<key>.json) uygulama bir sonraki açılışta yeni
 * içeriği alır — App Store'a yeni build göndermeye gerek kalmaz.
 *
 * Akış: açılışta hydrateData() cache'i belleğe yükler; syncQuestionsInBackground()
 * arka planda siteden tazesini çeker (6 saatte bir), belleği ve cache'i günceller.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import all_teams from '../data/all_teams.json';
import cities from '../data/cities.json';
import countries from '../data/countries.json';
import european_teams from '../data/european_teams.json';
import players from '../data/players.json';
import qKariyerKolay from '../data/questions-kariyer-yolu-kolay.json';
import qKariyerZor from '../data/questions-kariyer-yolu-zor.json';
import qListeyiKolay from '../data/questions-listeyi-tamamla-kolay.json';
import qListeyiZor from '../data/questions-listeyi-tamamla-zor.json';
import qTakimKolay from '../data/questions-takim-arkadasi-kolay.json';
import qTakimZor from '../data/questions-takim-arkadasi-zor.json';
import qTop10Kolay from '../data/questions-top10-kolay.json';
import qTop10Zor from '../data/questions-top10-zor.json';
import td from '../data/td.json';
import teams from '../data/teams.json';

const BASE_URL = 'https://futboltrivia.com.tr/data';

export type DataKey =
  | 'all_teams' | 'cities' | 'countries' | 'european_teams' | 'players' | 'td' | 'teams'
  | 'questions-kariyer-yolu-kolay' | 'questions-kariyer-yolu-zor'
  | 'questions-listeyi-tamamla-kolay' | 'questions-listeyi-tamamla-zor'
  | 'questions-takim-arkadasi-kolay' | 'questions-takim-arkadasi-zor'
  | 'questions-top10-kolay' | 'questions-top10-zor';

const BUNDLED: Record<DataKey, any[]> = {
  'all_teams': all_teams as any[],
  'cities': cities as any[],
  'countries': countries as any[],
  'european_teams': european_teams as any[],
  'players': players as any[],
  'td': td as any[],
  'teams': teams as any[],
  'questions-kariyer-yolu-kolay': qKariyerKolay as any[],
  'questions-kariyer-yolu-zor': qKariyerZor as any[],
  'questions-listeyi-tamamla-kolay': qListeyiKolay as any[],
  'questions-listeyi-tamamla-zor': qListeyiZor as any[],
  'questions-takim-arkadasi-kolay': qTakimKolay as any[],
  'questions-takim-arkadasi-zor': qTakimZor as any[],
  'questions-top10-kolay': qTop10Kolay as any[],
  'questions-top10-zor': qTop10Zor as any[],
};

const KEYS = Object.keys(BUNDLED) as DataKey[];
const STORAGE_PREFIX = 'synced_v2_';
const SYNC_TS_KEY = 'last_sync_v2';
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 saat

// Bellekteki güncel veri — bundled ile başlar, hydrate/sync ile yükseltilir.
const current: Record<DataKey, any[]> = { ...BUNDLED };

/** Bir veri dosyasının güncel halini döner (senkron; her zaman en az bundled). */
export function getData(key: DataKey): any[] {
  return current[key] ?? BUNDLED[key];
}

/** Daha önce senkronlanan veriyi cache'ten belleğe yükler. Açılışta bir kez çağır. */
export async function hydrateData(): Promise<void> {
  await Promise.all(
    KEYS.map(async (k) => {
      try {
        const cached = await AsyncStorage.getItem(STORAGE_PREFIX + k);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) current[k] = parsed;
        }
      } catch {
        // cache okunamadı — bundled ile devam
      }
    }),
  );
}

async function fetchAndStore(key: DataKey): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/${key}.json`, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return false;
    await AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    current[key] = data; // belleği de hemen güncelle
    return true;
  } catch {
    return false;
  }
}

/** Siteden tazesini arka planda çeker (6 saatte bir). UI'ı bloklamaz. */
export async function syncQuestionsInBackground(): Promise<void> {
  try {
    const last = await AsyncStorage.getItem(SYNC_TS_KEY);
    const now = Date.now();
    if (last && now - parseInt(last) < SYNC_INTERVAL_MS) return;

    const results = await Promise.allSettled(KEYS.map((k) => fetchAndStore(k)));
    if (results.some((r) => r.status === 'fulfilled' && r.value)) {
      await AsyncStorage.setItem(SYNC_TS_KEY, String(now));
    }
  } catch {
    // offline normal
  }
}
