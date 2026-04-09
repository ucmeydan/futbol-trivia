import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-static';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e0a0a 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Arka plan ışık efektleri */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(220,38,38,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            right: '-50px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(220,38,38,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Dekoratif büyük "10" arka plan */}
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-40px',
            fontSize: '400px',
            fontWeight: '900',
            color: 'rgba(255,255,255,0.02)',
            lineHeight: 1,
            letterSpacing: '-0.05em',
          }}
        >
          FT
        </div>

        {/* Kupa ikonu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'rgba(220,38,38,0.15)',
            border: '2px solid rgba(220,38,38,0.3)',
            borderRadius: '20px',
            marginBottom: '28px',
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17M14 14.66V17M18 4H6v7a6 6 0 0 0 12 0V4Z" />
          </svg>
        </div>

        {/* Başlık */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: '700',
            letterSpacing: '-0.04em',
            color: 'white',
            marginBottom: '16px',
            lineHeight: 1,
          }}
        >
          Futbol Trivia
        </div>

        {/* Süper Lig badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 20px',
            background: 'rgba(220,38,38,0.12)',
            border: '1px solid rgba(220,38,38,0.25)',
            borderRadius: '100px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#ef4444',
              borderRadius: '50%',
            }}
          />
          <span style={{ color: '#ef4444', fontSize: '18px', fontWeight: '700', letterSpacing: '0.1em' }}>
            SÜPER LİG ÖZEL
          </span>
        </div>

        {/* Alt açıklama */}
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(148,163,184,0.9)',
            fontWeight: '300',
            letterSpacing: '0.01em',
            marginBottom: '48px',
          }}
        >
          Her gün yenilenen sorularla futbol bilgini test et
        </div>

        {/* 4 oyun kartı */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
          }}
        >
          {[
            { label: 'Listeyi Tamamla', color: '#22c55e' },
            { label: 'Top 10', color: '#f59e0b' },
            { label: 'Kariyer Yolu', color: '#38bdf8' },
            { label: 'Takım Arkadaşı', color: '#ef4444' },
          ].map((game) => (
            <div
              key={game.label}
              style={{
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${game.color}33`,
                borderRadius: '12px',
                color: game.color,
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '0.02em',
              }}
            >
              {game.label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            color: 'rgba(100,116,139,0.7)',
            fontSize: '16px',
            letterSpacing: '0.05em',
          }}
        >
          futboltrivia.com.tr
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
