export const dynamic = 'force-static';
import KadroBulClient from './KadroBulClient';

export default function KadroBulPage() {
  return <KadroBulClient />;
}

export const metadata = {
  title: 'Kadro Bul | Futbol Trivia',
  description: "Tarihin ünlü maçlarında forma giyen 11 futbolcuyu tahmin et. Wordle tarzı kadro bulma oyunu.",
};
