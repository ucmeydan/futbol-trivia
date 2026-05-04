import type { Metadata } from 'next';
import KariyerYoluClient from '../KariyerYoluClient';

export const metadata: Metadata = {
  title: 'Kariyer Yolu — Zor | FutbolTrivia',
  description: 'Kariyer geçmişinden futbolcuyu bul. Zor seviye — karmaşık kariyer yolları, az bilinen isimler.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/kariyer-yolu/zor' },
};

export default function KariyerYoluZorPage() {
  return (
    <>
      <KariyerYoluClient difficulty="zor" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4 border-t border-slate-900 mt-8">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Kariyer Yolu Zor — Nasıl Oynanır?</h2>

        <p>
          Kariyer Yolu Zor seviyesinde çok daha karmaşık kariyer yolculukları seni bekler. Türkiye'de yalnızca
          bir sezon oynamış yabancı oyuncular, kısa süreli kiralık transferler yaşayan genç yetenekler veya
          kariyerinin büyük bölümünü farklı ülkelerde geçirdikten sonra Süper Lig'e uğrayan isimler bu
          seviyenin temel profilini oluşturur.
        </p>

        <p>
          Zor seviyede kariyer tablosu birçok farklı ülkeyi kapsayabilir. Örneğin bir futbolcu Güney Amerika'dan
          Avrupa'ya, oradan da Türkiye'ye uzanan bir güzergah izlemiş olabilir. Tabloda gördüğün kulüplerin
          hiçbiri tanıdık gelmese bile Türkiye bağlantısını aramaya devam et; cevap mutlaka Süper Lig geçmişi
          olan bir oyuncudur.
        </p>

        <p>
          Her yanlış tahminde kariyer tablosuna bir satır eklenir. Zor seviyede bu ek satırlar bazen ipucunu
          netleştirir, bazen ise kafanı daha da karıştırabilir. Pas Geç seçeneğini stratejik olarak kullanmak
          burada çok daha kritik bir rol oynar; doğru anda doğru kariyer durağının açılması her şeyi değiştirebilir.
        </p>

        <p>
          Futbolcunun hangi dönemde Türkiye'de oynadığını saptamak zorlu bir analiz gerektirir. 1990'ların
          ortasında birkaç sezon Süper Lig'de oynayan Brezilyalı bir orta saha, 2010'ların başında kısa süreli
          kiralık gelen Afrikalı bir forvet veya Türkiye'de emekli olan eski bir Doğu Avrupalı oyuncu bu
          seviyenin tipik sorularıdır.
        </p>

        <p>
          Zor seviyede başarılı olmak için dünya futboluna genel bir hakimiyet şarttır. Transfermarkt verilerini
          takip edenler ve farklı ligleri izleyenler önemli avantaj elde eder. Arşiv navigasyonuyla önceki
          günlerin zor sorularını çözmeye çalışmak bilgini sınamanın en iyi yollarından biridir.
        </p>

        <p>
          Her gün yeni bir futbolcu eklenir. Zor soruyu az tahminde çözmek, futbol bilginin uluslararası
          düzeyde ne kadar güçlü olduğunu kanıtlar. Sonucu paylaş ve arkadaşlarının skoru ile kıyasla.
        </p>
      </section>
    </>
  );
}
