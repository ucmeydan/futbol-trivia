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
    </>
  );
}