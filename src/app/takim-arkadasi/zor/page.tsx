import type { Metadata } from 'next';
import TakimArkadasiClient from '../TakimArkadasiClient';

export const metadata: Metadata = {
  title: 'Takım Arkadaşı — Zor | FutbolTrivia',
  description: 'Takım arkadaşlarından futbolcuyu bul. Zor seviye — Süper Lig gurmelerine özel.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/takim-arkadasi/zor' },
};

export default function TakimArkadasiZorPage() {
  return <TakimArkadasiClient difficulty="zor" />;
}
