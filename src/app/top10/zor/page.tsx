import type { Metadata } from 'next';
import Top10Client from '../Top10Client';

export const metadata: Metadata = {
  title: 'Top 10 — Zor | FutbolTrivia',
  description: 'Süper Lig istatistik listelerini tamamla. Zor seviye — Süper Lig gurmelerine özel.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/top10/zor' },
};

export default function Top10ZorPage() {
  return <Top10Client difficulty="zor" />;
}
