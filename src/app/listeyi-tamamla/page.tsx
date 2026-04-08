import type { Metadata } from 'next';
import ListeyiTamamlaClient from './ListeyiTamamlaClient';

export const metadata: Metadata = {
  title: 'Listeyi Tamamla | FutbolTrivia',
  description:
    '90 saniyede kaç doğru cevap bulabilirsin? Süper Lig ve Türk futboluna ait günlük listeleri tamamla. Her doğru cevap +5 saniye kazandırır.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/listeyi-tamamla' },
  openGraph: {
    title: 'Listeyi Tamamla | FutbolTrivia',
    description:
      '90 saniyede kaç doğru cevap bulabilirsin? Her gün yeni liste, her doğru cevap +5 saniye.',
    url: 'https://futboltrivia.com.tr/listeyi-tamamla',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Listeyi Tamamla',
  url: 'https://futboltrivia.com.tr/listeyi-tamamla',
  description:
    'Süper Lig ve Türk futboluna ait günlük listeleri 90 saniyede tamamlayan bilgi yarışması oyunu.',
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
      { '@type': 'ListItem', position: 2, name: 'Listeyi Tamamla', item: 'https://futboltrivia.com.tr/listeyi-tamamla' },
    ],
  },
};

export default function ListeyiTamamlaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <noscript>
        <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto', color: '#94a3b8', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ffffff', fontWeight: 300, fontSize: '2rem', marginBottom: '1rem' }}>Listeyi Tamamla</h1>
          <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
            Listeyi Tamamla, Süper Lig ve Türk futboluna ait günlük listeleri 90 saniye içinde
            tamamlamaya çalıştığın bir bilgi yarışması oyunudur.
          </p>
          <p style={{ lineHeight: 1.7 }}>
            Tahmin yapmaya başladığında geri sayım başlar. Her doğru cevap süreye 5 saniye ekler.
            Süre dolmadan listedeki tüm isimleri bulmaya çalış. Sorular her gün yenilenir.
          </p>
        </div>
      </noscript>
      <ListeyiTamamlaClient />
    </>
  );
}