import type { Metadata } from 'next';
import Top10Client from '../Top10Client';

export const metadata: Metadata = {
  title: 'Top 10 — Kolay | FutbolTrivia',
  description: 'Süper Lig istatistik listelerini tamamla. Kolay seviye.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/top10/kolay' },
};

export default function Top10KolayPage() {
  return <Top10Client difficulty="kolay" />;
}
