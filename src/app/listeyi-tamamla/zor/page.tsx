import type { Metadata } from 'next';
import ListeyiTamamlaClient from '../ListeyiTamamlaClient';

export const metadata: Metadata = {
  title: 'Listeyi Tamamla — Zor | FutbolTrivia',
  description: '90 saniyede kaç doğru cevap bulabilirsin? Zor seviye — Süper Lig gurmelerine özel.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/listeyi-tamamla/zor' },
};

export default function ListeyiTamamlaZorPage() {
  return <ListeyiTamamlaClient difficulty="zor" />;
}
