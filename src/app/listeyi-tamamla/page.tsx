import type { Metadata } from 'next';
import DifficultySelector from '../components/DifficultySelector';

export const metadata: Metadata = {
  title: 'Listeyi Tamamla | FutbolTrivia',
  description:
    '90 saniyede kaç doğru cevap bulabilirsin? Kolay veya Zor seviyeyi seç. Süper Lig ve Türk futboluna ait günlük listeleri tamamla.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/listeyi-tamamla' },
  openGraph: {
    title: 'Listeyi Tamamla | FutbolTrivia',
    description: '90 saniyede kaç doğru cevap bulabilirsin? Her gün yeni liste, Kolay veya Zor seviye.',
    url: 'https://futboltrivia.com.tr/listeyi-tamamla',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function ListeyiTamamlaPage() {
  return (
    <>
      <DifficultySelector gameSlug="listeyi-tamamla" gameTitle="Listeyi Tamamla" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Listeyi Tamamla hakkında</h2>

        <p>
          Listeyi Tamamla, 90 saniye içinde Süper Lig ve Türk futboluna ait bir listeyi tamamlamaya dayanan günlük bir bilgi yarışmasıdır.
          Konu her gün değişir; bir sezonda şampiyon olan takımlar, belirli bir kulüpte oynayan yabancı futbolcular veya milli takımın
          önemli kadroları gibi farklı kategoriler seni karşılar.
        </p>

        <p>
          Sayaç, ilk harfi yazdığın anda geri saymaya başlar. Her doğru cevap süreye 5 saniye ekler, bu yüzden hızlı düşünmek
          kadar doğru düşünmek de önemlidir. Yanlış tahminler süreyi etkilemez ama ekranda görünür kalır; dikkatini dağıtmamak
          için temkinli olmak işine yarar.
        </p>

        <p>
          Kolay seviyede listelerin büyük çoğunluğunu tamamlamak mümkündür; Süper Lig'i takip eden biri için tanıdık isimler
          ve takımlar ağırlıktadır. Zor seviyede ise Türk futbol tarihinin daha eski dönemlerine ve daha az bilinen isimlere
          inmek gerekebilir.
        </p>

        <p>
          Listeyi Tamamla'da soru tipleri çeşitlidir: futbolcu listeleri, Türk kulüpleri, Avrupa takımları ve teknik direktörler
          gibi farklı kategoriler yer alır. Otomatik tamamlama özelliği sayesinde aklındaki ismi hızlıca bulabilirsin.
        </p>

        <p>
          Her gün yeni bir liste yayınlanır. Arşiv navigasyonuyla önceki günlerin listelerine de ulaşabilirsin.
          Sonuçlarını paylaşarak kaç isim bulduğunu arkadaşlarınla kıyaslayabilirsin.
        </p>
      </section>
    </>
  );
}
