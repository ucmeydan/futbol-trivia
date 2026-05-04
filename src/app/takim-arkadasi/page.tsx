import type { Metadata } from 'next';
import DifficultySelector from '../components/DifficultySelector';

export const metadata: Metadata = {
  title: 'Takım Arkadaşı | FutbolTrivia',
  description:
    'Yolu Türkiye\'den geçmiş futbolcuları eski takım arkadaşlarından bul. 5 ipucu, 5 tahmin hakkı. Her gün yeni oyuncu, ücretsiz ve kayıtsız.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/takim-arkadasi' },
  openGraph: {
    title: 'Takım Arkadaşı | FutbolTrivia',
    description:
      'Eski takım arkadaşlarından yola çıkarak gizlenen futbolcuyu bul. Her gün yeni soru.',
    url: 'https://futboltrivia.com.tr/takim-arkadasi',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Takım Arkadaşı',
  url: 'https://futboltrivia.com.tr/takim-arkadasi',
  description:
    'Yolu Türkiye\'den geçmiş futbolcuları kulüp veya milli takım kariyerindeki eski takım arkadaşlarından bulan günlük bilgi yarışması oyunu.',
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
      { '@type': 'ListItem', position: 2, name: 'Takım Arkadaşı', item: 'https://futboltrivia.com.tr/takim-arkadasi' },
    ],
  },
};

export default function TakimArkadasiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DifficultySelector gameSlug="takim-arkadasi" gameTitle="Takım Arkadaşı" />
    </>
  );
}