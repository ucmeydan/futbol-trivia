import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'FutbolTrivia | Türkiye\'nin Futbol Bilgi Yarışması',
  description:
    'Takım Arkadaşı, Kariyer Yolu, Top 10 ve Listeyi Tamamla oyunlarıyla her gün Süper Lig ve Türk futbolu bilgini test et. Ücretsiz, kayıtsız, her gün yenilenen sorular.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr' },
  openGraph: {
    title: 'FutbolTrivia | Türkiye\'nin Futbol Bilgi Yarışması',
    description:
      'Her gün yenilenen sorularla Süper Lig ve Türk futbolu bilgini test et.',
    url: 'https://futboltrivia.com.tr',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FutbolTrivia',
  url: 'https://futboltrivia.com.tr',
  description:
    "Türkiye'nin futbol bilgi yarışması platformu. Süper Lig odaklı günlük oyunlar.",
  inLanguage: 'tr',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://futboltrivia.com.tr/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeClient />
    </>
  );
}