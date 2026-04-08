import type { Metadata } from 'next';
import KariyerYoluClient from './KariyerYoluClient';

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
      <noscript>
        <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto', color: '#94a3b8', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ffffff', fontWeight: 300, fontSize: '2rem', marginBottom: '1rem' }}>Kariyer Yolu</h1>
          <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
            Kariyer Yolu, yolu Türkiye'den geçmiş futbolcuları sezon sezon açılan kariyer
            tablosundan bulduğun günlük bilgi yarışması oyunudur.
          </p>
          <p style={{ lineHeight: 1.7 }}>
            Her yanlış tahminde bir sonraki sezon açılır. Kariyer tablosundaki takımları, maç
            ve gol sayılarını ipucu olarak kullanarak doğru oyuncuyu bulmaya çalış.
            Soru her gün yenilenir.
          </p>
        </div>
      </noscript>
      <KariyerYoluClient />
    </>
  );
}