import type { Metadata } from 'next';
import KariyerYoluClient from '../KariyerYoluClient';

export const metadata: Metadata = {
  title: 'Kariyer Yolu — Zor | FutbolTrivia',
  description: 'Kariyer geçmişinden futbolcuyu bul. Zor seviye — Süper Lig gurmelerine özel.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/kariyer-yolu/zor' },
};

export default function KariyerYoluZorPage() {
  return <KariyerYoluClient difficulty="zor" />;
}
