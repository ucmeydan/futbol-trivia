import type { Metadata } from 'next';
import KariyerYoluClient from '../KariyerYoluClient';

export const metadata: Metadata = {
  title: 'Kariyer Yolu — Kolay | FutbolTrivia',
  description: 'Kariyer geçmişinden futbolcuyu bul. Kolay seviye — Türkiye\'de uzun süre oynamış tanıdık isimler.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/kariyer-yolu/kolay' },
};

export default function KariyerYoluKolayPage() {
  return (
    <>
      <KariyerYoluClient difficulty="kolay" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4 border-t border-slate-900 mt-8">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Kariyer Yolu Kolay — Nasıl Oynanır?</h2>

        <p>
          Kariyer Yolu Kolay seviyesinde Türkiye'de birden fazla sezon oynamış, taraftarların büyük çoğunluğunun
          adını duyduğu futbolcular yer alır. Süper Lig'in köklü kulüplerinde uzun yıllar forma giymiş, milli
          takımın vazgeçilmez isimleri haline gelmiş ya da transfer dönemlerinde gündem yaratan oyuncular bu
          seviyenin temel profilini oluşturur.
        </p>

        <p>
          Oyun başladığında sana futbolcunun kariyer tablosu takım takım açılır. Her satırda bir sezon, o sezon
          oynadığı takım, maç sayısı ve gol sayısı gösterilir. Başta yalnızca birkaç satır görünür; her yanlış
          tahminde veya Pas Geç seçeneğinde bir sonraki kariyer durağı tabloya eklenir.
        </p>

        <p>
          Kolay seviyede futbolcular genellikle Türkiye'ye bağlı net bir kariyer çizgisi izler. Süper Lig takımları
          arasında geçişler yapar, uzun süreli sözleşmeler imzalar ve Türk futbolunda iz bırakırlar. Bu nedenle
          kariyer tablosu ortaya çıktıkça kim olduğu görece hızlı netleşir.
        </p>

        <p>
          Tahmin yaparken otomatik tamamlama devreye girer. Oyuncunun isminin bir kısmını yazmak yeterlidir;
          sistem uygun adayları önerin olarak listeler. Pas Geç seçeneğiyle tahmin hakkı harcamadan ek kariyer
          bilgisi alabilir ve tahminini daha sağlam bir zemine oturtabilirsin.
        </p>

        <p>
          İstatistik ekranında ortalama kaçıncı tahminde doğru bulduğunu görebilirsin. 1. tahminde doğru bulmak
          her zaman ayrıca tatmin edicidir. Günlük soruyu tamamladıktan sonra arşiv navigasyonuyla önceki
          günlerin futbolcularını da keşfedebilirsin.
        </p>

        <p>
          Her gün yeni bir futbolcu eklenir. Kolay seviyede art arda doğru tahmin etmek hem Süper Lig bilgini
          pekiştirir hem de yeni oyuncuları tanımak için eğlenceli bir yol sunar.
        </p>
      </section>
    </>
  );
}
