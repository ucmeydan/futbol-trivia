import type { Metadata } from 'next';
import TakimArkadasiClient from './TakimArkadasiClient';

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
      <noscript>
        <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto', color: '#94a3b8', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ffffff', fontWeight: 300, fontSize: '2rem', marginBottom: '1rem' }}>Takım Arkadaşı</h1>
          <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
            Takım Arkadaşı, yolu Türkiye'den geçmiş futbolcuları kulüp veya milli takım
            kariyerindeki eski takım arkadaşlarından bulduğun günlük bilgi yarışması oyunudur.
          </p>
          <p style={{ lineHeight: 1.7 }}>
            Her yanlış tahminde yeni bir takım arkadaşı ipucu açılır. Toplam 5 tahmin hakkın
            vardır. Soru her gün yenilenir.
          </p>
        </div>
      </noscript>
      <TakimArkadasiClient />
    </>
  );
}