import type { Metadata } from 'next';
import IletisimClient from './IletisimClient';

export const metadata: Metadata = {
  title: 'İletişim | FutbolTrivia',
  description:
    'FutbolTrivia ile iletişime geç. Soru önerileri, yeni oyun fikirleri veya diğer konular için bize ulaşabilirsiniz.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/iletisim' },
  openGraph: {
    title: 'İletişim | FutbolTrivia',
    description: 'FutbolTrivia ekibiyle iletişime geçin.',
    url: 'https://futboltrivia.com.tr/iletisim',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'İletişim',
  url: 'https://futboltrivia.com.tr/iletisim',
  description: 'FutbolTrivia iletişim sayfası.',
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
      { '@type': 'ListItem', position: 2, name: 'İletişim', item: 'https://futboltrivia.com.tr/iletisim' },
    ],
  },
};

export default function IletisimPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IletisimClient />
    </>
  );
}