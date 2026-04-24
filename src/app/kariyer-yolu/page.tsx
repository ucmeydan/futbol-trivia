import type { Metadata } from 'next';
import DifficultySelector from '../components/DifficultySelector';

export const metadata: Metadata = {
  title: 'Kariyer Yolu | FutbolTrivia',
  description:
    'Yolu Türkiye\'den geçmiş futbolcuları sezon sezon kariyer geçmişlerinden bul. Her tahminde yeni bir takım açılır. Her gün yeni soru, ücretsiz ve kayıtsız.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/kariyer-yolu' },
  openGraph: {
    title: 'Kariyer Yolu | FutbolTrivia',
    description:
      'Sezon sezon açılan kariyer tablosundan futbolcuyu bul. Her gün yeni soru.',
    url: 'https://futboltrivia.com.tr/kariyer-yolu',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Kariyer Yolu',
  url: 'https://futboltrivia.com.tr/kariyer-yolu',
  description:
    'Yolu Türkiye\'den geçmiş futbolcuları sezon sezon açılan kariyer tablosundan bulan günlük bilgi yarışması oyunu.',
  inLanguage: 'tr',
  isPartOf: {
    '@type': 'WebSite',
    name: 'FutbolTrivia',
    url: 'https://futboltrivia.com.tr',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://futboltrivia.com.tr' },
      { '@type': 'ListItem', position: 2, name: 'Kariyer Yolu', item: 'https://futboltrivia.com.tr/kariyer-yolu' },
    ],
  },
};

export default function KariyerYoluPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DifficultySelector gameSlug="kariyer-yolu" gameTitle="Kariyer Yolu" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Kariyer Yolu hakkında</h2>

        <p>
          Kariyer Yolu, yolu Türkiye'den geçmiş futbolcuları kariyer geçmişlerinden tahmin etmeye dayanan günlük bir bilgi yarışmasıdır.
          Her gün yeni bir futbolcunun kariyer tablosu takım takım açılır; hangi takımlarda oynadığını, kaç maça çıktığını
          ve kaç gol attığını görürken kim olduğunu bulmaya çalışırsın.
        </p>

        <p>
          Oyun, her yanlış tahminde oyuncunun oynadığı bir sonraki takımı açar. Ne kadar az tahminde bilirsen
          o kadar yüksek puan alırsın. Kolay seviyede Türkiye'de uzun süre oynamış tanınan isimler sorulurken,
          Zor seviyede daha kısa süre kalmış ya da alt liglerde oynamış isimler karşına çıkabilir.
        </p>

        <p>
          Kariyer Yolu'nda yer alan futbolcular yalnızca Türk oyunculardan oluşmaz. Türkiye'de en az bir sezon
          geçirmiş yabancı futbolcular da dahil edilir; bu sayede hem Süper Lig'in tarihini hem de yabancı
          futbolcuların Türkiye maceralarını keşfedebilirsin.
        </p>

        <p>
          Tahmin yazarken otomatik tamamlama seni yönlendirir. Pas Geç seçeneğiyle bir ipucu daha açarak
          zorlu sorularda kendine avantaj sağlayabilirsin. Her gün yeni bir futbolcu eklenir ve arşiv
          sayesinde geçmiş soruları da oynayabilirsin.
        </p>

        <p>
          İstatistik ekranında kaç soruda ilk tahminde doğru bulduğunu, ortalama tahmin sayını ve toplam
          oynadığın gün sayısını görebilirsin. Sonuçlarını paylaşarak futbol bilgini arkadaşlarınla ölçebilirsin.
        </p>
      </section>
    </>
  );
}