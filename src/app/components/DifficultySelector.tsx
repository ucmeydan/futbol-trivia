'use client';

import Link from 'next/link';

interface Props {
  gameSlug: string;
  gameTitle: string;
}

export default function DifficultySelector({ gameSlug, gameTitle }: Props) {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Arka plan ışık efekti */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-red-600/6 blur-[140px] pointer-events-none" aria-hidden="true" />

      {/* Geri linki */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <Link href="/" className="text-slate-500 text-xs font-bold hover:text-white transition-colors tracking-wide">
          ← Ana Sayfa
        </Link>
      </div>

      {/* Başlık */}
      <div className="text-center mb-14 relative z-10">
        <p className="text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-3">Futbol Trivia</p>
        <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-white mb-4 leading-none">
          {gameTitle}
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Zorluk Seviyesi Seç</span>
        </div>
      </div>

      {/* Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl relative z-10">

        {/* Kolay Kartı */}
        <Link
          href={`/${gameSlug}/kolay`}
          className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-green-500/40 hover:shadow-[0_0_50px_-10px_rgba(34,197,94,0.15)] rounded-3xl p-7 md:p-8 transition-all duration-500 overflow-hidden flex flex-col"
        >
          {/* Dekor sayı */}
          <div className="absolute -right-3 -bottom-3 font-bebas text-[6rem] text-white/[0.03] pointer-events-none select-none leading-none" aria-hidden="true">
            K
          </div>

          {/* Ikon */}
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5 group-hover:bg-green-500/15 transition-colors">
            <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm3.7-10.7-4.2 4.2-1.7-1.7a1 1 0 0 0-1.4 1.4l2.4 2.4a1 1 0 0 0 1.4 0l4.9-4.9a1 1 0 0 0-1.4-1.4Z" fill="currentColor" stroke="none"/>
            </svg>
          </div>

          {/* İçerik */}
          <div className="flex-1">
            <h2 className="font-bebas text-4xl text-green-400 tracking-wide mb-1 group-hover:text-green-300 transition-colors">
              Kolay
            </h2>
            <div className="w-8 h-0.5 bg-green-500/40 mb-5 group-hover:w-12 transition-all duration-500" />
            <p className="text-slate-400 text-sm leading-relaxed">
              <span className="text-slate-300 italic">"Futbolu ve Süper Lig'i severim ancak çok sıkı bir takipçi değilim"</span>
              {' '}diyorsan bu seviye tam sana göre.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-7 text-xs font-bold tracking-widest text-green-500" aria-hidden="true">
            OYNA
            <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
          </div>
        </Link>

        {/* Zor Kartı */}
        <Link
          href={`/${gameSlug}/zor`}
          className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-red-500/40 hover:shadow-[0_0_50px_-10px_rgba(239,68,68,0.15)] rounded-3xl p-7 md:p-8 transition-all duration-500 overflow-hidden flex flex-col"
        >
          {/* Dekor sayı */}
          <div className="absolute -right-3 -bottom-3 font-bebas text-[6rem] text-white/[0.03] pointer-events-none select-none leading-none" aria-hidden="true">
            Z
          </div>

          {/* Ikon */}
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 group-hover:bg-red-500/15 transition-colors">
            <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" stroke="none"/>
            </svg>
          </div>

          {/* İçerik */}
          <div className="flex-1">
            <h2 className="font-bebas text-4xl text-red-400 tracking-wide mb-1 group-hover:text-red-300 transition-colors">
              Zor
            </h2>
            <div className="w-8 h-0.5 bg-red-500/40 mb-5 group-hover:w-12 transition-all duration-500" />
            <p className="text-slate-400 text-sm leading-relaxed">
              <span className="text-slate-300 italic">"Ben Süper Lig gurmesiyim."</span>
              {' '}diyorsan bu seviye tam sana göre.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-7 text-xs font-bold tracking-widest text-red-500" aria-hidden="true">
            OYNA
            <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
