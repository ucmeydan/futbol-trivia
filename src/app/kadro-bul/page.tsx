export const dynamic = 'force-static';

import type { Metadata } from 'next';
import DifficultySelector from '../components/DifficultySelector';

export const metadata: Metadata = {
  title: 'Kadro Bul | Futbol Trivia',
  description: 'Tarihin ünlü maçlarında forma giyen 11 futbolcuyu tahmin et. Wordle tarzı kadro bulma oyunu.',
};

export default function KadroBulPage() {
  return <DifficultySelector gameSlug="kadro-bul" gameTitle="Kadro Bul" />;
}
