import type { Metadata } from 'next';
import DifficultySelector from '../components/DifficultySelector';

export const metadata: Metadata = {
  title: 'Top 10 | FutbolTrivia',
  description:
    'Süper Lig ve Türk futboluna ait istatistik listelerini tamamla. Belirli bir kategorideki 10 ismi bul, 3 yanlış hakkın var. Her gün yeni soru.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/top10' },
  openGraph: {
    title: 'Top 10 | FutbolTrivia',
    description:
      'Süper Lig istatistik listelerini tamamla. Her gün yeni soru, 3 yanlış hakkın var.',
    url: 'https://futboltrivia.com.tr/top10',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Top 10',
  url: 'https://futboltrivia.com.tr/top10',
  description:
    'Süper Lig ve Türk futboluna ait istatistik listelerini tamamlayan günlük bilgi yarışması oyunu.',
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
      { '@type': 'ListItem', position: 2, name: 'Top 10', item: 'https://futboltrivia.com.tr/top10' },
    ],
  },
};

export default function Top10Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DifficultySelector gameSlug="top10" gameTitle="Top 10" />
    </>
  );
}