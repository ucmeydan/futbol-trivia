import type { Metadata } from 'next';
import DifficultySelector from '../components/DifficultySelector';

export const metadata: Metadata = {
  title: 'Listeyi Tamamla | FutbolTrivia',
  description:
    '90 saniyede kaç doğru cevap bulabilirsin? Kolay veya Zor seviyeyi seç. Süper Lig ve Türk futboluna ait günlük listeleri tamamla.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/listeyi-tamamla' },
  openGraph: {
    title: 'Listeyi Tamamla | FutbolTrivia',
    description: '90 saniyede kaç doğru cevap bulabilirsin? Her gün yeni liste, Kolay veya Zor seviye.',
    url: 'https://futboltrivia.com.tr/listeyi-tamamla',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function ListeyiTamamlaPage() {
  return <DifficultySelector gameSlug="listeyi-tamamla" gameTitle="Listeyi Tamamla" />;
}
