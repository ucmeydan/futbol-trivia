import type { Metadata } from 'next';
import TakimArkadasiClient from '../TakimArkadasiClient';

export const metadata: Metadata = {
  title: 'Takım Arkadaşı — Zor | FutbolTrivia',
  description: 'Eski takım arkadaşlarından gizlenen futbolcuyu bul. Zor seviye — az bilinen isimler, yanıltıcı ipuçları.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/takim-arkadasi/zor' },
};

export default function TakimArkadasiZorPage() {
  return (
    <>
      <TakimArkadasiClient difficulty="zor" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4 border-t border-slate-900 mt-8">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Takım Arkadaşı Zor — Nasıl Oynanır?</h2>

        <p>
          Takım Arkadaşı Zor seviyesi, Süper Lig'in sadece popüler isimlerini değil, daha geniş kadrosunu da
          takip eden futbol meraklıları için tasarlanmıştır. Kariyer boyunca birden fazla ülkede oynamış,
          Türkiye'de yalnızca kısa bir dönem geçirmiş ya da Süper Lig dışındaki liglerde uzun yıllar mücadele
          etmiş isimler bu seviyede sıklıkla karşına çıkar.
        </p>

        <p>
          İpuçları zor seviyede daha geniş bir coğrafyaya yayılır. Gizlenen futbolcu Brezilya ligi, Belçika
          1. Ligi veya Uzak Doğu futbolunda oynamış olabileceğinden ipuçlarındaki takım arkadaşları tanıdık
          gelmeyebilir. Bu durum tahmin alanını önemli ölçüde genişletir ve oyunun zorluk eğrisini artırır.
        </p>

        <p>
          Oyun kuralları kolay seviyeyle aynıdır: 5 ipucu, 5 tahmin hakkı. Ancak zor seviyede ipuçları
          arasındaki bağlantıyı kurmak çok daha fazla dikkat ve futbol bilgisi gerektirir. İpuçlarında
          geçen takım arkadaşı isimlerini araştırarak hedef oyuncuyu daraltmaya çalışabilirsin.
        </p>

        <p>
          Pas Geç seçeneğini kullanarak bir tahmin hakkı harcamadan bir sonraki ipucunu açabilirsin. Zor
          seviyede bu özellik stratejik açıdan önemlidir; tanımadığın ipuçlarını geçerek daha tanıdık
          takım arkadaşlarının gelmesini bekleyebilirsin.
        </p>

        <p>
          Zor seviyede başarılı olmak için Transfermarkt gibi kariyer veri tabanlarına aşina olmak büyük
          avantaj sağlar. Dünya futbolunun farklı liglerini takip edenler, Türkiye ile bağlantı noktalarını
          daha hızlı tespit edebilir.
        </p>

        <p>
          Her gün yeni bir futbolcu eklenir. Zor soruyu birinci ya da ikinci ipucunda çözmek, gerçek anlamda
          futbol bilgisinin doruk noktasına ulaştığının göstergesidir. Günlük sonucunu paylaş ve kaçıncı
          ipucunda bulduğunu arkadaşlarınla kıyasla.
        </p>
      </section>
    </>
  );
}
