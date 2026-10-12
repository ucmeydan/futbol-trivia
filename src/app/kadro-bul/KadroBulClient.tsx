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

function Jersey({
  number,
  color,
  status,
  isActive,
  onClick,
}: {
  number: number;
  color: string;
  status: 'pending' | 'solved' | 'failed';
  isActive: boolean;
  onClick: () => void;
}) {
  const fill = status === 'solved' ? '#16a34a' : status === 'failed' ? '#374151' : color;
  const borderClass =
    isActive
      ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent'
      : status === 'solved'
      ? 'ring-1 ring-green-500/60'
      : status === 'failed'
      ? 'ring-1 ring-slate-600/60'
      : 'ring-1 ring-white/10';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 rounded-xl p-1 transition-all active:scale-95 ${borderClass}`}
      aria-label={`Oyuncu #${number}`}
    >
      <svg viewBox="0 0 50 52" width="40" height="42" className="drop-shadow-md">
        <path
          d="M14,6 L3,19 L14,23 L14,48 L36,48 L36,23 L47,19 L36,6 Q30,2 25,5 Q20,2 14,6Z"
          fill={fill}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <text
          x="25"
          y="33"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {number}
        </text>
      </svg>
    </button>
  );
}

type TileState = 'correct' | 'present' | 'absent' | 'active' | 'empty';

function LetterTile({ letter, state, size = 'md' }: { letter: string; state: TileState; size?: 'sm' | 'md' }) {
  const bg: Record<TileState, string> = {
    correct: 'bg-green-600 border-green-600 text-white',
    present: 'bg-amber-500 border-amber-500 text-white',
    absent: 'bg-slate-700 border-slate-700 text-white',
    active: 'bg-slate-900 border-slate-400 text-white',
    empty: 'bg-slate-900 border-slate-700 text-transparent',
  };
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div
      className={`${sz} flex items-center justify-center font-black border-2 rounded transition-all duration-200 ${bg[state]}`}
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
  const bg =
    color === 'correct'
      ? 'bg-green-600 text-white'
      : color === 'present'
      ? 'bg-amber-500 text-white'
      : color === 'absent'
      ? 'bg-slate-700 text-slate-400'
      : 'bg-slate-600 text-white';

  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); onPress(label); }}
      className={`${isWide ? 'px-2 min-w-[40px]' : 'w-8'} h-10 rounded-lg font-bold text-xs flex items-center justify-center transition-all active:scale-90 select-none touch-manipulation ${bg}`}
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
            <svg viewBox="0 0 50 52" width="64" height="68" className="drop-shadow-xl">
              <path
                d="M14,6 L3,19 L14,23 L14,48 L36,48 L36,23 L47,19 L36,6 Q30,2 25,5 Q20,2 14,6Z"
                fill={currentMatch.teamColor}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <text x="25" y="33" textAnchor="middle" fill="white" fontSize="16" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">
                {player.number}
              </text>
            </svg>
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
        style={{ background: 'linear-gradient(180deg, #1a5e28 0%, #1e6b2f 50%, #1a5e28 100%)', minHeight: 340 }}>

        {/* Pitch markings */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Center line */}
          <div className="absolute left-4 right-4 border-t border-white/10" style={{ top: '50%' }} />
          {/* Center circle */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/10" />
          {/* Top penalty box */}
          <div className="absolute left-1/2 -translate-x-1/2 top-3 border border-white/10 rounded-sm" style={{ width: '50%', height: '16%' }} />
          {/* Bottom penalty box */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 border border-white/10 rounded-sm" style={{ width: '50%', height: '16%' }} />
        </div>

        {/* Players on pitch */}
        <div className="relative h-full flex flex-col justify-around py-4 px-2">
          {pitchRows.map((row, ri) => (
            <div key={ri} className="flex justify-around items-center">
              {row.map((player) => {
                const idx = playerIndexInMatch(player, currentMatch);
                const ps = playerStates[idx];
                if (!ps) return null;
                return (
                  <div key={player.number} className="flex flex-col items-center gap-0.5">
                    <Jersey
                      number={player.number}
                      color={currentMatch.teamColor}
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
