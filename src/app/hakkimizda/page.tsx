import type { Metadata } from 'next';
import HakkimizdaClient from './HakkimizdaClient';

export const metadata: Metadata = {
  title: 'Hakkımızda | FutbolTrivia',
  description:
    'FutbolTrivia, Türkiye\'nin futbol bilgi yarışması platformudur. Takım Arkadaşı, Kariyer Yolu ve Top 10 oyunlarıyla her gün futbol kültürünü test et.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/hakkimizda' },
  openGraph: {
    title: 'Hakkımızda | FutbolTrivia',
    description:
      'FutbolTrivia hakkında: misyonumuz, oyunlarımız ve Türk futbol kültürüne katkımız.',
    url: 'https://futboltrivia.com.tr/hakkimizda',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Hakkımızda',
  url: 'https://futboltrivia.com.tr/hakkimizda',
  description:
    'FutbolTrivia, Türk futbol severlere yönelik günlük bilgi yarışması platformudur.',
  inLanguage: 'tr',
  isPartOf: {
    '@type': 'WebSite',
    name: 'FutbolTrivia',
    url: 'https://futboltrivia.com.tr',
    description:
      'Türkiye\'nin futbol bilgi yarışması platformu. Süper Lig, Avrupa ligleri ve dünya futbolunu kapsayan günlük oyunlar.',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: 'https://futboltrivia.com.tr',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Hakkımızda',
        item: 'https://futboltrivia.com.tr/hakkimizda',
      },
    ],
  },
};

export default function HakkimizdaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HakkimizdaClient />
    </>
  );
}
