export const dynamic = 'force-static';

import KadroBulClient from '../KadroBulClient';

export function generateStaticParams() {
  return [{ difficulty: 'kolay' }, { difficulty: 'zor' }];
}

export default async function KadroBulDifficultyPage({
  params,
}: {
  params: Promise<{ difficulty: string }>;
}) {
  const { difficulty } = await params;
  const diff = difficulty === 'kolay' ? 'kolay' : 'zor';
  return <KadroBulClient difficulty={diff} />;
}
