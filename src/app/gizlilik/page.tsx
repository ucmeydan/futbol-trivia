import type { Metadata } from 'next';
import GizlilikClient from './GizlilikClient';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | FutbolTrivia',
  description:
    "FutbolTrivia'nın gizlilik politikası: veri toplama, çerez kullanımı, Google AdSense reklamları ve kullanıcı hakları hakkında kapsamlı bilgi.",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/gizlilik' },
  openGraph: {
    title: 'Gizlilik Politikası | FutbolTrivia',
    description: 'FutbolTrivia gizlilik politikası ve kullanıcı veri hakları.',
    url: 'https://futboltrivia.com.tr/gizlilik',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Gizlilik Politikası',
  url: 'https://futboltrivia.com.tr/gizlilik',
  description: 'FutbolTrivia gizlilik politikası ve kullanıcı veri hakları.',
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
      { '@type': 'ListItem', position: 2, name: 'Gizlilik Politikası', item: 'https://futboltrivia.com.tr/gizlilik' },
    ],
  },
};

export default function GizlilikPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GizlilikClient />
    </>
  );
}
