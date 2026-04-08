import type { Metadata } from 'next';
import Top10Client from './Top10Client';

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
      {/* SEO içerik bloğu — Googlebot okur, kullanıcı oyun alanının altında görür */}
      <noscript>
        <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto', color: '#94a3b8', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ffffff', fontWeight: 300, fontSize: '2rem', marginBottom: '1rem' }}>Top 10</h1>
          <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
            Top 10, Süper Lig ve Türk futboluna ait istatistik listelerini tamamladığın günlük bir bilgi yarışması oyunudur.
            Her soruda belirli bir kategoriye ait 10 ismi bulmaya çalışırsın.
          </p>
          <p style={{ lineHeight: 1.7 }}>
            Süreli olmayan bu modda toplam 3 yanlış tahmin hakkın bulunur. Kolay modda her ismin kaç harften
            oluştuğunu görebilirsin; zor modda tamamen hafızana güvenmen gerekir. Sorular her gün yenilenir.
          </p>
        </div>
      </noscript>
      <Top10Client />
    </>
  );
}