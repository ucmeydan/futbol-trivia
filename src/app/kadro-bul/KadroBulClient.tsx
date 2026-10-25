'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import questionsRaw from '@/data/questions-kadro-bul.json';

const safeGetItem = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSetItem = (key: string, value: string): void => {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
};

// ─── Types ───────────────────────────────────────────────────────────────────

type PlayerData = {
  number: number;
  answer: string; // e.g. "TORRES" or "BARIŞ ALPER"
};

type MatchData = {
  id: number;
  activeDate: string;
  league: string;
  season: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchDate: string;
  targetTeam: string;
  teamColor: string;
  formation: number[]; // [1,4,4,2] → GK, DEF, MID, FWD
  players: PlayerData[]; // ordered GK first
};

type LetterResult = 'correct' | 'present' | 'absent';

type PlayerState = {
  guesses: string[]; // letters only, no spaces
  results: LetterResult[][];
  status: 'pending' | 'solved' | 'failed';
};

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_GUESSES = 6;

const TEAM_COLORS: Record<string, { primary: string; secondary?: string }> = {
  // Türk takımları
  'Fenerbahçe':         { primary: '#FFDD00', secondary: '#003399' },
  'Beşiktaş':           { primary: '#1a1a1a', secondary: '#ffffff' },
  'Galatasaray':        { primary: '#E8211B', secondary: '#F7A014' },
  'Trabzonspor':        { primary: '#8B1C2E', secondary: '#1B4CA1' },
  'Bursaspor':          { primary: '#00862A' },
  'Başakşehir':         { primary: '#E8211B', secondary: '#1A3A5C' },
  // İngiltere
  'Liverpool':          { primary: '#C8102E' },
  'Man City':           { primary: '#6CABDD' },
  'Chelsea':            { primary: '#034694' },
  'Arsenal':            { primary: '#EF0107' },
  'Manchester United':  { primary: '#DA291C' },
  'Tottenham':          { primary: '#132257' },
  'Newcastle':          { primary: '#241F20', secondary: '#ffffff' },
  // İspanya
  'Real Madrid':        { primary: '#FEBE10', secondary: '#ffffff' },
  'Barcelona':          { primary: '#A50044', secondary: '#004D98' },
  'Atletico Madrid':    { primary: '#CB3524', secondary: '#2D4B8E' },
  'Sevilla':            { primary: '#D4AF37', secondary: '#ffffff' },
  // Almanya
  'Bayern Munich':      { primary: '#DC052D' },
  'Borussia Dortmund':  { primary: '#FDE100', secondary: '#000000' },
  // İtalya
  'Juventus':           { primary: '#000000', secondary: '#ffffff' },
  'AC Milan':           { primary: '#FB090B', secondary: '#000000' },
  'Inter Milan':        { primary: '#010E80', secondary: '#000000' },
  // Fransa
  'PSG':                { primary: '#003366', secondary: '#DA020E' },
};

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'İ', 'O', 'P', 'Ğ', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'Ö'],
  ['⌫', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ç', '↵'],
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripSpaces(s: string) {
  return s.replace(/\s/g, '');
}

function evaluateGuess(guess: string, answer: string): LetterResult[] {
  const g = guess.split('');
  const a = answer.split('');
  const result: LetterResult[] = Array(g.length).fill('absent');
  const remaining = [...a];

  // First pass: exact matches
  g.forEach((ch, i) => {
    if (ch === a[i]) {
      result[i] = 'correct';
      remaining[i] = '';
    }
  });

  // Second pass: wrong position
  g.forEach((ch, i) => {
    if (result[i] === 'correct') return;
    const idx = remaining.indexOf(ch);
    if (idx !== -1) {
      result[i] = 'present';
      remaining[idx] = '';
    }
  });

  return result;
}

// Build display map: [{type:'letter',pos}|{type:'space'}]
function buildDisplayMap(answer: string) {
  const out: ({ type: 'letter'; pos: number } | { type: 'space' })[] = [];
  let pos = 0;
  for (const ch of answer) {
    if (ch === ' ') out.push({ type: 'space' });
    else out.push({ type: 'letter', pos: pos++ });
  }
  return out;
}

function getKeyColors(
  guesses: string[],
  results: LetterResult[][]
): Record<string, LetterResult> {
  const map: Record<string, LetterResult> = {};
  guesses.forEach((guess, gi) => {
    const res = results[gi];
    if (!res) return;
    [...guess].forEach((ch, li) => {
      const cur = map[ch];
      const next = res[li];
      if (cur === 'correct') return;
      if (!cur || next === 'correct' || (next === 'present' && cur === 'absent')) {
        map[ch] = next;
      }
    });
  });
  return map;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function JerseySvg({
  number,
  fill,
  secondaryFill,
  size,
}: {
  number: number;
  fill: string;
  secondaryFill?: string;
  size: 'sm' | 'lg';
}) {
  const [w, h] = size === 'lg' ? [80, 84] : [44, 46];
  const patternId = `stripes-${number}-${size}`;
  const bodyPath = "M22,5 L11,9 L2,24 L2,35 L12,31 L13,52 L43,52 L44,31 L54,35 L54,24 L45,9 L34,5 Q28,15 22,5Z";
  const numColor = fill === '#ffffff' || fill === '#FFFFFF' || fill === '#FDE100' || fill === '#FFDD00' ? '#000000' : 'white';

  return (
    <svg viewBox="0 0 56 58" width={w} height={h}>
      {secondaryFill && (
        <defs>
          <pattern id={patternId} width="8" height="58" patternUnits="userSpaceOnUse">
            <rect width="4" height="58" fill={fill} />
            <rect x="4" width="4" height="58" fill={secondaryFill} />
          </pattern>
          <clipPath id={`clip-${patternId}`}>
            <path d={bodyPath} />
          </clipPath>
        </defs>
      )}
      {/* Body + sleeves */}
      <path
        d={bodyPath}
        fill={secondaryFill ? `url(#${patternId})` : fill}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* Upper highlight */}
      <path
        d="M22,5 L11,9 L2,24 L2,31 L12,28 L13,38 L43,38 L44,28 L54,31 L54,24 L45,9 L34,5 Q28,15 22,5Z"
        fill="rgba(255,255,255,0.07)"
      />
      {/* V-neck collar */}
      <path
        d="M22,5 Q28,16 34,5"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Number */}
      <text
        x="28"
        y="37"
        textAnchor="middle"
        fill={numColor}
        fontSize={size === 'lg' ? 17 : 15}
        fontWeight="900"
        fontFamily="system-ui,-apple-system,sans-serif"
        opacity="0.95"
      >
        {number}
      </text>
    </svg>
  );
}

function Jersey({
  number,
  color,
  secondaryColor,
  status,
  isActive,
  onClick,
}: {
  number: number;
  color: string;
  secondaryColor?: string;
  status: 'pending' | 'solved' | 'failed';
  isActive: boolean;
  onClick: () => void;
}) {
  const fill = status === 'solved' ? '#16a34a' : status === 'failed' ? '#374151' : color;
  const secondary = status === 'pending' ? secondaryColor : undefined;
  const ringClass = isActive
    ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent scale-110'
    : status === 'solved'
    ? 'ring-1 ring-green-500/50'
    : status === 'failed'
    ? 'ring-1 ring-slate-600/50'
    : 'ring-1 ring-white/10 hover:ring-white/25';
  const shadowStyle = isActive
    ? { filter: 'drop-shadow(0 0 7px rgba(255,255,255,0.65))' }
    : { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.55))' };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 rounded-xl p-0.5 transition-all active:scale-95 ${ringClass}`}
      aria-label={`Oyuncu #${number}`}
      style={shadowStyle}
    >
      <JerseySvg number={number} fill={fill} secondaryFill={secondary} size="sm" />
    </button>
  );
}

type TileState = 'correct' | 'present' | 'absent' | 'active' | 'empty';

const TILE_STYLES: Record<TileState, React.CSSProperties> = {
  correct: { backgroundColor: '#16a34a', borderColor: '#16a34a', color: 'white' },
  present: { backgroundColor: '#d97706', borderColor: '#d97706', color: 'white' },
  absent:  { backgroundColor: '#374151', borderColor: '#374151', color: 'white' },
  active:  { backgroundColor: '#0f172a', borderColor: '#94a3b8', color: 'white' },
  empty:   { backgroundColor: '#0f172a', borderColor: '#334155', color: 'transparent' },
};

function LetterTile({ letter, state, size = 'md' }: { letter: string; state: TileState; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 28 : 36;
  return (
    <div
      style={{
        width: dim, height: dim,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: size === 'sm' ? 11 : 13,
        border: '2px solid', borderRadius: 4,
        transition: 'all 0.2s',
        ...TILE_STYLES[state],
      }}
    >
      {letter}
    </div>
  );
}

function GuessRow({
  guess,
  answer,
  result,
  isCurrent,
  tileSize,
}: {
  guess: string;
  answer: string;
  result: LetterResult[] | null;
  isCurrent: boolean;
  tileSize?: 'sm' | 'md';
}) {
  const displayMap = buildDisplayMap(answer);
  return (
    <div className="flex items-center gap-1 justify-center">
      {displayMap.map((cell, i) => {
        if (cell.type === 'space') {
          return <div key={i} className="w-2" />;
        }
        const pos = cell.pos;
        const letter = guess[pos] || '';
        let state: TileState;
        if (result) {
          state = result[pos] as TileState;
        } else if (isCurrent) {
          state = letter ? 'active' : 'empty';
        } else {
          state = 'empty';
        }
        return <LetterTile key={i} letter={letter} state={state} size={tileSize} />;
      })}
    </div>
  );
}

function KeyboardKey({
  label,
  color,
  onPress,
}: {
  label: string;
  color?: LetterResult;
  onPress: (k: string) => void;
}) {
  const isWide = label === '⌫' || label === '↵';
  const keyStyle: React.CSSProperties =
    color === 'correct' ? { backgroundColor: '#16a34a', color: 'white' }
    : color === 'present' ? { backgroundColor: '#d97706', color: 'white' }
    : color === 'absent'  ? { backgroundColor: '#374151', color: '#9ca3af' }
    : { backgroundColor: '#475569', color: 'white' };

  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); onPress(label); }}
      className={`${isWide ? 'px-2 min-w-[40px]' : 'w-8'} h-10 rounded-lg font-bold text-xs flex items-center justify-center transition-all active:scale-90 select-none touch-manipulation`}
      style={keyStyle}
    >
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KadroBulClient() {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<'intro' | 'pitch' | 'guessing'>('intro');
  const [playerStates, setPlayerStates] = useState<PlayerState[]>([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load questions
  useEffect(() => {
    setMounted(true);
    const all = questionsRaw as unknown as MatchData[];
    const today = todayStr();
    const available = all.filter((m) => m.activeDate <= today);
    setMatches(available);
    if (available.length > 0) {
      const idx = available.length - 1;
      setCurrentIndex(idx);
      loadMatch(idx, available);
    }
    setLoaded(true);
  }, []);

  function initPlayerStates(match: MatchData): PlayerState[] {
    return match.players.map(() => ({ guesses: [], results: [], status: 'pending' }));
  }

  function loadMatch(idx: number, matchList: MatchData[]) {
    const match = matchList[idx];
    setCurrentIndex(idx);
    setView('intro');
    setActivePlayerIdx(null);
    setInput('');

    const saved = safeGetItem(`kadro_bul_session_${match.activeDate}`);
    if (saved) {
      const data = JSON.parse(saved);
      setPlayerStates(data.playerStates);
      setView('pitch');
    } else {
      setPlayerStates(initPlayerStates(match));
    }
  }

  const currentMatch = matches[currentIndex];

  const isAllDone =
    playerStates.length > 0 &&
    playerStates.every((ps) => ps.status !== 'pending');

  const solvedCount = playerStates.filter((ps) => ps.status === 'solved').length;

  // Persist state whenever it changes (after intro screen is left)
  useEffect(() => {
    if (!currentMatch || playerStates.length === 0 || view === 'intro') return;
    safeSetItem(
      `kadro_bul_session_${currentMatch.activeDate}`,
      JSON.stringify({ playerStates })
    );
  }, [playerStates, currentMatch, view]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (activePlayerIdx === null || !currentMatch) return;
      const ps = playerStates[activePlayerIdx];
      if (ps.status !== 'pending') return;

      const answer = stripSpaces(currentMatch.players[activePlayerIdx].answer);

      if (key === '⌫') {
        setInput((prev) => prev.slice(0, -1));
        return;
      }

      if (key === '↵') {
        if (input.length !== answer.length) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          return;
        }

        const result = evaluateGuess(input, answer);
        const newGuesses = [...ps.guesses, input];
        const newResults = [...ps.results, result];
        const solved = result.every((r) => r === 'correct');
        const failed = !solved && newGuesses.length >= MAX_GUESSES;

        const newState: PlayerState = {
          guesses: newGuesses,
          results: newResults,
          status: solved ? 'solved' : failed ? 'failed' : 'pending',
        };

        const newPlayerStates = [...playerStates];
        newPlayerStates[activePlayerIdx] = newState;
        setPlayerStates(newPlayerStates);
        setInput('');

        if (solved || failed) {
          setTimeout(() => {
            setView('pitch');
            setActivePlayerIdx(null);
          }, 800);
        }
        return;
      }

      const answer2 = stripSpaces(currentMatch.players[activePlayerIdx].answer);
      if (input.length < answer2.length) {
        setInput((prev) => prev + key);
      }
    },
    [activePlayerIdx, currentMatch, playerStates, input]
  );

  // Physical keyboard support
  useEffect(() => {
    if (view !== 'guessing') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Backspace') { handleKeyPress('⌫'); return; }
      if (e.key === 'Enter') { handleKeyPress('↵'); return; }
      const ch = e.key.toUpperCase();
      if (/^[A-ZÇŞİĞÜÖ]$/.test(ch)) handleKeyPress(ch);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, handleKeyPress]);

  function handleSelectPlayer(idx: number) {
    const ps = playerStates[idx];
    if (ps.status !== 'pending') return; // already done
    setActivePlayerIdx(idx);
    setInput('');
    setView('guessing');
  }

  function handleGiveUp() {
    if (activePlayerIdx === null) return;
    const newPlayerStates = [...playerStates];
    newPlayerStates[activePlayerIdx] = {
      ...playerStates[activePlayerIdx],
      status: 'failed',
    };
    setPlayerStates(newPlayerStates);
    setView('pitch');
    setActivePlayerIdx(null);
    setInput('');
  }

  function shareScore() {
    if (!currentMatch) return;
    const emojiRows = playerStates.map((ps) => {
      if (ps.status === 'failed') return '⬛';
      const g = ps.guesses.length;
      if (g <= 2) return '🟩';
      if (g <= 4) return '🟨';
      return '🟧';
    });

    const text = [
      `⚽ Futbol Trivia — Kadro Bul #${currentMatch.id}`,
      ``,
      `${currentMatch.homeTeam} ${currentMatch.homeScore}–${currentMatch.awayScore} ${currentMatch.awayTeam}`,
      `${currentMatch.league} · ${currentMatch.season}`,
      ``,
      emojiRows.join(''),
      `${solvedCount}/11 oyuncu bulundu`,
      ``,
      `futboltrivia.com.tr/kadro-bul`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  }

  // ─── Pitch layout ────────────────────────────────────────────────────────

  function buildPitchRows(match: MatchData): PlayerData[][] {
    const rows: PlayerData[][] = [];
    let offset = 0;
    for (const count of match.formation) {
      rows.push(match.players.slice(offset, offset + count));
      offset += count;
    }
    return rows.reverse(); // attackers at top
  }

  function playerIndexInMatch(player: PlayerData, match: MatchData) {
    return match.players.findIndex((p) => p.number === player.number);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  if (!currentMatch) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col items-center justify-center p-4 text-white bg-slate-950 text-center">
        {!loaded ? (
          <>
            <div className="w-10 h-10 border-b-2 border-red-600 rounded-full mb-4 animate-spin" />
            <p className="text-slate-500 text-sm">Yükleniyor…</p>
          </>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-4">Henüz oynanacak bir maç yok.</p>
            <Link href="/" className="text-red-500 font-bold text-sm hover:underline">← Ana sayfaya dön</Link>
          </>
        )}
      </div>
    );
  }

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (view === 'intro') {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col game-container text-white bg-slate-950 font-sans">
        <div className="w-full flex justify-between items-center mb-6">
          <Link href="/" className="text-slate-400 font-semibold text-sm hover:text-white transition-colors py-2 pr-3 -ml-1">← Geri dön</Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadMatch(currentIndex - 1, matches)}
              disabled={currentIndex === 0}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-lg font-bold"
            >‹</button>
            <span className="font-bebas text-2xl text-red-600 leading-none">#{currentMatch.id}</span>
            <button
              onClick={() => loadMatch(currentIndex + 1, matches)}
              disabled={currentIndex === matches.length - 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-lg font-bold"
            >›</button>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-bold text-white tracking-tight">Kadro Bul</h1>
          <p className="text-slate-400 text-sm text-center max-w-xs leading-relaxed">
            Maçta oynayan 11 futbolcuyu bul. Her oyuncu için 6 tahmin hakkın var.
          </p>

          {/* Match card */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="text-center mb-5">
              <p className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-1">{currentMatch.league}</p>
              <p className="text-xs text-slate-600">{currentMatch.season} · {currentMatch.matchDate}</p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 text-right">
                <p className="font-bold text-white text-lg leading-tight">{currentMatch.homeTeam}</p>
                <p className="text-xs text-slate-500 mt-0.5">Ev sahibi</p>
              </div>

              <div className="shrink-0 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-center">
                <span className="font-bebas text-3xl text-white tracking-wider leading-none">
                  {currentMatch.homeScore}–{currentMatch.awayScore}
                </span>
              </div>

              <div className="flex-1 text-left">
                <p className="font-bold text-white text-lg leading-tight">{currentMatch.awayTeam}</p>
                <p className="text-xs text-slate-500 mt-0.5">Deplasman</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                <span className="text-slate-300 font-semibold">{currentMatch.targetTeam}</span> kadrosunu bul
              </p>
            </div>
          </div>

          <button
            onClick={() => setView('pitch')}
            className="w-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold py-4 rounded-2xl text-base transition-all"
          >
            Kadroyu Bul
          </button>
        </div>
      </div>
    );
  }

  // ── Guessing (Wordle for one player) ────────────────────────────────────────
  if (view === 'guessing' && activePlayerIdx !== null) {
    const ps = playerStates[activePlayerIdx];
    const player = currentMatch.players[activePlayerIdx];
    const answer = stripSpaces(player.answer);
    const keyColors = getKeyColors(ps.guesses, ps.results);
    const currentGuessIdx = ps.guesses.length;
    const guessingTeamColors = TEAM_COLORS[currentMatch.targetTeam] ?? { primary: currentMatch.teamColor };

    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col game-container text-white bg-slate-950 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => { setView('pitch'); setInput(''); setActivePlayerIdx(null); }}
            className="text-slate-400 font-semibold text-sm hover:text-white transition-colors py-2 pr-3 -ml-1"
          >
            ← Sahaya Dön
          </button>
          <div className="flex flex-col items-center">
            <p className="text-xs text-slate-500 tracking-wide">{currentMatch.homeTeam} vs {currentMatch.awayTeam}</p>
            <p className="text-[11px] text-slate-600">{currentMatch.league} · {currentMatch.season}</p>
          </div>
          <button
            onClick={handleGiveUp}
            className="text-slate-500 hover:text-red-400 text-sm font-semibold transition-colors py-2 pl-3 -mr-1"
          >
            Pes Et
          </button>
        </div>

        {/* Jersey + number */}
        <div className="flex justify-center mb-5">
          <div className="flex flex-col items-center gap-1">
            <div style={{ filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.65))' }}>
              <JerseySvg number={player.number} fill={guessingTeamColors.primary} secondaryFill={guessingTeamColors.secondary} size="lg" />
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              {currentGuessIdx}/{MAX_GUESSES} tahmin · {answer.length} harf
            </p>
          </div>
        </div>

        {/* Wordle grid */}
        <div className={`flex flex-col gap-1.5 mb-6 transition-all ${shake ? 'animate-[wiggle_0.4s_ease]' : ''}`}>
          {Array.from({ length: MAX_GUESSES }).map((_, gi) => {
            const isPast = gi < ps.guesses.length;
            const isCurrent = gi === ps.guesses.length && ps.status === 'pending';
            const guess = isPast ? ps.guesses[gi] : isCurrent ? input : '';
            const result = isPast ? ps.results[gi] : null;
            return (
              <GuessRow
                key={gi}
                guess={guess}
                answer={player.answer}
                result={result}
                isCurrent={isCurrent}
              />
            );
          })}
        </div>

        {/* Solved/failed banner */}
        {ps.status !== 'pending' && (
          <div className={`text-center py-2 mb-4 rounded-xl font-bold text-sm ${ps.status === 'solved' ? 'bg-green-600/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
            {ps.status === 'solved' ? `🎉 ${player.answer}` : `Cevap: ${player.answer}`}
          </div>
        )}

        {/* Keyboard */}
        <div className="mt-auto space-y-1.5">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1">
              {row.map((key) => (
                <KeyboardKey
                  key={key}
                  label={key}
                  color={keyColors[key]}
                  onPress={handleKeyPress}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Pitch view ─────────────────────────────────────────────────────────────
  const pitchRows = buildPitchRows(currentMatch);
  const teamColors = TEAM_COLORS[currentMatch.targetTeam] ?? { primary: currentMatch.teamColor };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col game-container text-white bg-slate-950 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setView('intro')}
          className="text-slate-400 font-semibold text-sm hover:text-white transition-colors py-2 pr-3 -ml-1"
        >
          ← Geri dön
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadMatch(currentIndex - 1, matches)}
            disabled={currentIndex === 0}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-lg font-bold"
          >‹</button>
          <h1 className="text-base font-bold text-white">
            <span className="text-red-500">Kadro Bul</span>
            <span className="text-slate-600 font-normal ml-1.5 text-xs">#{currentMatch.id}</span>
          </h1>
          <button
            onClick={() => loadMatch(currentIndex + 1, matches)}
            disabled={currentIndex === matches.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-lg font-bold"
          >›</button>
        </div>
        <div className="text-xs text-slate-500 font-semibold">{solvedCount}/11</div>
      </div>

      {/* Match info strip */}
      <div className="flex items-center justify-center gap-3 mb-3 bg-slate-900/50 border border-slate-800/50 rounded-xl px-4 py-2">
        <span className="text-sm font-bold text-white">{currentMatch.homeTeam}</span>
        <div className="shrink-0 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-0.5">
          <span className="font-bebas text-lg text-white tracking-wide leading-none">
            {currentMatch.homeScore}–{currentMatch.awayScore}
          </span>
        </div>
        <span className="text-sm font-bold text-white">{currentMatch.awayTeam}</span>
      </div>

      {/* Pitch */}
      <div className="relative w-full flex-1 rounded-2xl overflow-hidden mb-3"
        style={{
          background: 'repeating-linear-gradient(180deg, #1b6229 0px, #1b6229 24px, #1d6e2e 24px, #1d6e2e 48px)',
          minHeight: 340,
          maxHeight: 500,
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.35)',
        }}>

        {/* Pitch markings */}
        <div className="absolute pointer-events-none"
          style={{ inset: 7, border: '1.5px solid rgba(255,255,255,0.22)', borderRadius: 4 }}>

          {/* Center line */}
          <div className="absolute left-0 right-0"
            style={{ top: '50%', height: '1.5px', background: 'rgba(255,255,255,0.22)' }} />

          {/* Center circle */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 76, height: 76, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.22)' }} />

          {/* Center spot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />

          {/* Top penalty box */}
          <div className="absolute left-1/2 -translate-x-1/2"
            style={{ top: 0, width: '56%', height: '20%', borderBottom: '1.5px solid rgba(255,255,255,0.22)', borderLeft: '1.5px solid rgba(255,255,255,0.22)', borderRight: '1.5px solid rgba(255,255,255,0.22)' }} />

          {/* Top goal area */}
          <div className="absolute left-1/2 -translate-x-1/2"
            style={{ top: 0, width: '28%', height: '9%', borderBottom: '1.5px solid rgba(255,255,255,0.18)', borderLeft: '1.5px solid rgba(255,255,255,0.18)', borderRight: '1.5px solid rgba(255,255,255,0.18)' }} />

          {/* Bottom penalty box */}
          <div className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: 0, width: '56%', height: '20%', borderTop: '1.5px solid rgba(255,255,255,0.22)', borderLeft: '1.5px solid rgba(255,255,255,0.22)', borderRight: '1.5px solid rgba(255,255,255,0.22)' }} />

          {/* Bottom goal area */}
          <div className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: 0, width: '28%', height: '9%', borderTop: '1.5px solid rgba(255,255,255,0.18)', borderLeft: '1.5px solid rgba(255,255,255,0.18)', borderRight: '1.5px solid rgba(255,255,255,0.18)' }} />

          {/* Bottom penalty spot */}
          <div className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: '13%', marginBottom: -2, width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.32)' }} />

          {/* Corner arcs */}
          <div className="absolute top-0 left-0" style={{ width: 14, height: 14, borderRight: '1.5px solid rgba(255,255,255,0.16)', borderBottom: '1.5px solid rgba(255,255,255,0.16)', borderBottomRightRadius: '100%' }} />
          <div className="absolute top-0 right-0" style={{ width: 14, height: 14, borderLeft: '1.5px solid rgba(255,255,255,0.16)', borderBottom: '1.5px solid rgba(255,255,255,0.16)', borderBottomLeftRadius: '100%' }} />
          <div className="absolute bottom-0 left-0" style={{ width: 14, height: 14, borderRight: '1.5px solid rgba(255,255,255,0.16)', borderTop: '1.5px solid rgba(255,255,255,0.16)', borderTopRightRadius: '100%' }} />
          <div className="absolute bottom-0 right-0" style={{ width: 14, height: 14, borderLeft: '1.5px solid rgba(255,255,255,0.16)', borderTop: '1.5px solid rgba(255,255,255,0.16)', borderTopLeftRadius: '100%' }} />
        </div>

        {/* Players on pitch */}
        <div className="absolute inset-0 flex flex-col py-5 px-2" style={{ zIndex: 10, justifyContent: 'space-around' }}>
          {pitchRows.map((row, ri) => (
            <div key={ri} className="flex w-full items-center" style={{ justifyContent: 'space-around' }}>
              {row.map((player) => {
                const idx = playerIndexInMatch(player, currentMatch);
                const ps = playerStates[idx];
                if (!ps) return null;
                return (
                  <div key={player.number} className="flex flex-col items-center gap-0.5">
                    <Jersey
                      number={player.number}
                      color={teamColors.primary}
                      secondaryColor={teamColors.secondary}
                      status={ps.status}
                      isActive={activePlayerIdx === idx}
                      onClick={() => ps.status === 'pending' ? handleSelectPlayer(idx) : undefined}
                    />
                    <div className="text-center" style={{ minWidth: 40 }}>
                      {ps.status === 'solved' ? (
                        <span className="text-green-400 font-bold leading-none" style={{ fontSize: 9 }}>{player.answer}</span>
                      ) : ps.status === 'failed' ? (
                        <span className="text-slate-500 font-semibold leading-none" style={{ fontSize: 9 }}>{player.answer}</span>
                      ) : (
                        <span className="text-white/20 tracking-[2px] text-[8px]">
                          {'·'.repeat(stripSpaces(player.answer).length)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tap hint or completion */}
      {isAllDone ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="font-bold text-white mb-1">{solvedCount === 11 ? '🏆 Kadroyu tamamladın!' : `${solvedCount}/11 oyuncu bulundu`}</p>
          <p className="text-slate-500 text-xs mb-3">{currentMatch.targetTeam} · {currentMatch.league} {currentMatch.season}</p>
          <button
            onClick={shareScore}
            className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-slate-200 active:scale-95 transition-all"
          >
            {copySuccess ? 'Kopyalandı!' : 'Skoru Paylaş'}
          </button>
        </div>
      ) : (
        <p className="text-center text-slate-600 text-xs pb-1">Tahmin yapmak için bir forma dokun</p>
      )}
    </div>
  );
}
