import type { Metadata } from 'next';
import KariyerYoluClient from '../KariyerYoluClient';

export const metadata: Metadata = {
  title: 'Kariyer Yolu — Kolay | FutbolTrivia',
  description: 'Kariyer geçmişinden futbolcuyu bul. Kolay seviye.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/kariyer-yolu/kolay' },
};

export default function KariyerYoluKolayPage() {
  return <KariyerYoluClient difficulty="kolay" />;
}
