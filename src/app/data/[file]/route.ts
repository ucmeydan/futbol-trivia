// Serves the game data JSON files so the mobile app (Futbol Trivia) can pull
// fresh content without an app-store rebuild. Single source of truth: src/data.
// Update src/data + deploy the site → the app picks it up on its next sync.

import allTeams from '../../../data/all_teams.json';
import cities from '../../../data/cities.json';
import countries from '../../../data/countries.json';
import europeanTeams from '../../../data/european_teams.json';
import players from '../../../data/players.json';
import qKariyerKolay from '../../../data/questions-kariyer-yolu-kolay.json';
import qKariyerZor from '../../../data/questions-kariyer-yolu-zor.json';
import qListeyiKolay from '../../../data/questions-listeyi-tamamla-kolay.json';
import qListeyiZor from '../../../data/questions-listeyi-tamamla-zor.json';
import qTakimKolay from '../../../data/questions-takim-arkadasi-kolay.json';
import qTakimZor from '../../../data/questions-takim-arkadasi-zor.json';
import qTop10Kolay from '../../../data/questions-top10-kolay.json';
import qTop10Zor from '../../../data/questions-top10-zor.json';
import td from '../../../data/td.json';
import teams from '../../../data/teams.json';

const FILES: Record<string, unknown> = {
  'all_teams': allTeams,
  'cities': cities,
  'countries': countries,
  'european_teams': europeanTeams,
  'players': players,
  'questions-kariyer-yolu-kolay': qKariyerKolay,
  'questions-kariyer-yolu-zor': qKariyerZor,
  'questions-listeyi-tamamla-kolay': qListeyiKolay,
  'questions-listeyi-tamamla-zor': qListeyiZor,
  'questions-takim-arkadasi-kolay': qTakimKolay,
  'questions-takim-arkadasi-zor': qTakimZor,
  'questions-top10-kolay': qTop10Kolay,
  'questions-top10-zor': qTop10Zor,
  'td': td,
  'teams': teams,
};

export const dynamic = 'force-static';

export function generateStaticParams() {
  return Object.keys(FILES).map((f) => ({ file: `${f}.json` }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const key = file.replace(/\.json$/i, '');
  const data = FILES[key];
  if (!data) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
