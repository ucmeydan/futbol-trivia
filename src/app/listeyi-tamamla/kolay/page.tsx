import type { Metadata } from 'next';
import ListeyiTamamlaClient from '../ListeyiTamamlaClient';

export const metadata: Metadata = {
  title: 'Listeyi Tamamla — Kolay | FutbolTrivia',
  description: '90 saniyede kaç doğru cevap bulabilirsin? Kolay seviye.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/listeyi-tamamla/kolay' },
};

export default function ListeyiTamamlaKolayPage() {
  return <ListeyiTamamlaClient difficulty="kolay" />;
}
