import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// ── Auth ──────────────────────────────────────────────────────────────────────
const ADMIN_KEY = process.env.ADMIN_KEY ?? '';

function isAuthed(cookieKey: string | undefined, paramKey: string | null): boolean {
  if (!ADMIN_KEY) return true; // geliştirme: key tanımlı değilse açık
  return cookieKey === ADMIN_KEY || paramKey === ADMIN_KEY;
}

// ── Vercel Analytics API ───────────────────────────────────────────────────────
interface VercelStat { value: number; pctChange: number }
interface VercelStats {
  visitors: VercelStat;
  pageviews: VercelStat;
  bounceRate?: VercelStat;
  avgDuration?: VercelStat;
}

async function fetchVercelStats(from: number, to: number): Promise<VercelStats | null> {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return null;
  try {
    const url = `https://vercel.com/api/web/insights/stats?projectId=${projectId}&from=${from}&to=${to}&granularity=day`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchTopPages(from: number, to: number): Promise<{ key: string; total: number }[]> {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return [];
  try {
    const url = `https://vercel.com/api/web/insights/top/pages?projectId=${projectId}&from=${from}&to=${to}&limit=8`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

// ── Soru İstatistikleri ────────────────────────────────────────────────────────
interface GameStats {
  key: string;
  label: string;
  count: number;
  first: string;
  last: string;
  remaining: number;
}

function getQuestionStats(): GameStats[] {
  const today = new Date().toISOString().slice(0, 10);
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const games = [
    { key: 'questions-kariyer-yolu-kolay',       label: 'Kariyer Yolu — Kolay' },
    { key: 'questions-kariyer-yolu-zor',          label: 'Kariyer Yolu — Zor' },
    { key: 'questions-listeyi-tamamla-kolay',     label: 'Listeyi Tamamla — Kolay' },
    { key: 'questions-listeyi-tamamla-zor',       label: 'Listeyi Tamamla — Zor' },
    { key: 'questions-takim-arkadasi-kolay',      label: 'Takım Arkadaşı — Kolay' },
    { key: 'questions-takim-arkadasi-zor',        label: 'Takım Arkadaşı — Zor' },
    { key: 'questions-top10-kolay',               label: 'Top 10 — Kolay' },
    { key: 'questions-top10-zor',                 label: 'Top 10 — Zor' },
  ];

  return games.map(({ key, label }) => {
    try {
      const raw = fs.readFileSync(path.join(dataDir, `${key}.json`), 'utf8');
      const data: { activeDate?: string }[] = JSON.parse(raw);
      const dates = data.map(q => q.activeDate ?? '').filter(Boolean).sort();
      const remaining = dates.filter(d => d > today).length;
      return { key, label, count: dates.length, first: dates[0] ?? '', last: dates[dates.length - 1] ?? '', remaining };
    } catch {
      return { key, label, count: 0, first: '', last: '', remaining: 0 };
    }
  });
}

// ── Yardımcı ──────────────────────────────────────────────────────────────────
function fmtDate(d: string) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}.${m}.${y}`;
}

function fmtNum(n: number) {
  return n.toLocaleString('tr-TR');
}

function pctBadge(pct: number) {
  const up = pct >= 0;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
      background: up ? '#14532d' : '#7f1d1d',
      color: up ? '#86efac' : '#fca5a5',
    }}>
      {up ? '▲' : '▼'} {Math.abs(Math.round(pct))}%
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function IstatistikPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const cookieStore = await cookies();
  const sp = await searchParams;
  const paramKey = sp['k'] ?? null;
  const cookieKey = cookieStore.get('admin_key')?.value;

  if (!isAuthed(cookieKey, paramKey)) {
    redirect('/istatistik/giris');
  }

  const now = Date.now();
  const day   = now - 1  * 24 * 60 * 60 * 1000;
  const week  = now - 7  * 24 * 60 * 60 * 1000;
  const month = now - 30 * 24 * 60 * 60 * 1000;

  const [dayStats, weekStats, monthStats, topPages, questions] = await Promise.all([
    fetchVercelStats(day, now),
    fetchVercelStats(week, now),
    fetchVercelStats(month, now),
    fetchTopPages(week, now),
    Promise.resolve(getQuestionStats()),
  ]);

  const hasAnalytics = !!dayStats;
  const totalQuestions = questions.reduce((s, g) => s + g.count, 0);
  const totalRemaining = questions.reduce((s, g) => s + g.remaining, 0);

  const card = (label: string, value: string | number, sub?: React.ReactNode) => (
    <div style={{
      background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12,
      padding: '20px 24px', minWidth: 140,
    }}>
      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{typeof value === 'number' ? fmtNum(value) : value}</div>
      {sub && <div style={{ marginTop: 6 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', fontFamily: 'system-ui, sans-serif', padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>⚽ Futbol Trivia — İstatistikler</h1>
          <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Vercel Analytics */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
            🌐 Website Trafiği
          </h2>
          {!hasAnalytics ? (
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 24, color: '#475569' }}>
              <p style={{ margin: 0 }}>Analytics verisi için <code>VERCEL_TOKEN</code> ve <code>VERCEL_PROJECT_ID</code> environment variable'larını tanımla.</p>
              <p style={{ margin: '8px 0 0', fontSize: 13 }}>Vercel Dashboard → Settings → Tokens → Create Token</p>
            </div>
          ) : (
            <>
              {/* Period cards */}
              {[
                { label: 'Son 24 Saat', stats: dayStats },
                { label: 'Son 7 Gün',   stats: weekStats },
                { label: 'Son 30 Gün',  stats: monthStats },
              ].map(({ label, stats }) => stats && (
                <div key={label} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: '#475569', marginBottom: 10, fontWeight: 600 }}>{label}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {card('Ziyaretçi', stats.visitors.value, pctBadge(stats.visitors.pctChange))}
                    {card('Sayfa Görüntüleme', stats.pageviews.value, pctBadge(stats.pageviews.pctChange))}
                    {stats.bounceRate && card('Bounce Rate', `${Math.round(stats.bounceRate.value)}%`, pctBadge(-stats.bounceRate.pctChange))}
                    {stats.avgDuration && card('Ort. Süre', `${Math.round((stats.avgDuration.value ?? 0) / 1000)}s`, pctBadge(stats.avgDuration.pctChange))}
                  </div>
                </div>
              ))}

              {/* Top pages */}
              {topPages.length > 0 && (
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 24, marginTop: 8 }}>
                  <div style={{ fontSize: 13, color: '#475569', fontWeight: 600, marginBottom: 16 }}>EN ÇOK ZİYARET EDİLEN SAYFALAR (7 gün)</div>
                  {topPages.map((p, i) => (
                    <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < topPages.length - 1 ? '1px solid #1e293b' : 'none' }}>
                      <span style={{ color: '#cbd5e1', fontSize: 14 }}>{p.key || '/'}</span>
                      <span style={{ color: '#dc2626', fontWeight: 700, fontSize: 14 }}>{fmtNum(p.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Soru İstatistikleri */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
            📋 Soru Veritabanı
          </h2>

          {/* Özet */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            {card('Toplam Soru', totalQuestions)}
            {card('Kalan (Gelecek)', totalRemaining)}
            {card('Oyun Modu', questions.length)}
          </div>

          {/* Detay tablosu */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#1e293b' }}>
                  <th style={{ textAlign: 'left', padding: '12px 20px', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Oyun</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Toplam</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Kalan</th>
                  <th style={{ textAlign: 'right', padding: '12px 20px', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Son Tarih</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((g, i) => (
                  <tr key={g.key} style={{ borderTop: i > 0 ? '1px solid #1e293b' : 'none' }}>
                    <td style={{ padding: '14px 20px', color: '#e2e8f0' }}>{g.label}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', color: '#94a3b8', fontWeight: 600 }}>{g.count}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <span style={{
                        color: g.remaining <= 3 ? '#f87171' : g.remaining <= 7 ? '#fbbf24' : '#4ade80',
                        fontWeight: 700,
                      }}>
                        {g.remaining}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', color: '#64748b' }}>{fmtDate(g.last)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ color: '#334155', fontSize: 12, marginTop: 12 }}>
            * "Kalan" = aktif tarihi bugünden sonra olan sorular. 0'a yaklaşınca yeni soru eklemeyi unutma.
          </p>
        </section>

      </div>
    </div>
  );
}
