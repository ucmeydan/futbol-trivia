import type { Metadata } from 'next';
import TakimArkadasiClient from '../TakimArkadasiClient';

export const metadata: Metadata = {
  title: 'Takım Arkadaşı — Kolay | FutbolTrivia',
  description: 'Takım arkadaşlarından futbolcuyu bul. Kolay seviye.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/takim-arkadasi/kolay' },
};

export default function TakimArkadasiKolayPage() {
  return <TakimArkadasiClient difficulty="kolay" />;
}
