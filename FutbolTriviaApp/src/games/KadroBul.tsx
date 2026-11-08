import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Share, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import LoadingScreen from '../components/LoadingScreen';
import { getData } from '../utils/questionSync';

// ─── Types ────────────────────────────────────────────────────────────────────
type PlayerData = { number: number; answer: string };
type MatchData = {
  id: number;
  difficulty?: 'kolay' | 'zor';
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
  teamColorSecondary?: string;
  teamColorSplit?: string;
  formation: number[];
  players: PlayerData[];
};
type LetterResult = 'correct' | 'present' | 'absent';
type PlayerState = { guesses: string[]; results: LetterResult[][]; status: 'pending' | 'solved' | 'failed' };

const DIST_KEYS = ['11', '12-15', '16-20', '21-30', '31-40', '41-50', '50+'] as const;
type DistKey = typeof DIST_KEYS[number];
type Stats = { totalGames: number; wins: number; distribution: Record<DistKey, number> };

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_GUESSES = 6;
const DEFAULT_STATS: Stats = {
  totalGames: 0, wins: 0,
  distribution: { '11': 0, '12-15': 0, '16-20': 0, '21-30': 0, '31-40': 0, '41-50': 0, '50+': 0 },
};

const TEAM_COLORS: Record<string, { primary: string }> = {
  'Fenerbahçe':        { primary: '#FFDD00' },
  'Beşiktaş':          { primary: '#1a1a1a' },
  'Galatasaray':       { primary: '#E8211B' },
  'Trabzonspor':       { primary: '#8B1C2E' },
  'Bursaspor':         { primary: '#00862A' },
  'Başakşehir':        { primary: '#E8211B' },
  'Liverpool':         { primary: '#C8102E' },
  'Man City':          { primary: '#6CABDD' },
  'Chelsea':           { primary: '#034694' },
  'Arsenal':           { primary: '#EF0107' },
  'Manchester United': { primary: '#DA291C' },
  'Tottenham':         { primary: '#132257' },
  'Newcastle':         { primary: '#241F20' },
  'Real Madrid':       { primary: '#FEBE10' },
  'Barcelona':         { primary: '#A50044' },
  'Atletico Madrid':   { primary: '#CB3524' },
  'Bayern Munich':     { primary: '#DC052D' },
  'Borussia Dortmund': { primary: '#FDE100' },
  'Juventus':          { primary: '#000000' },
  'AC Milan':          { primary: '#FB090B' },
  'Inter Milan':       { primary: '#010E80' },
  'PSG':               { primary: '#003366' },
};

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
  ['⌫', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', '↵'],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stripSpaces(s: string) { return s.replace(/\s/g, ''); }

function stripForGuess(s: string) { return s.replace(/[\s']/g, ''); }

// Yabancı dil aksanlarını soy (SUÁREZ→SUAREZ, İ→I), Türkçe karakterleri koru (Ş,Ç,Ğ,Ü,Ö)
function normalizeChar(ch: string): string {
  if (ch === 'İ') return 'I';
  // NFD: birleşik işaretleri ayır, sonra aksan işaretlerini sil.
  // Cedilla (0327=Ş,Ç), diaeresis (0308=Ü,Ö), breve (0306=Ğ) KORUNUR.
  return ch.normalize('NFD')
    .replace(/[̀-̅̇̉-̨̦-ͯ]/g, '')
    .normalize('NFC');
}

function evaluateGuess(guess: string, answer: string): LetterResult[] {
  const g = [...stripForGuess(guess)].map(normalizeChar);
  const a = [...stripForGuess(answer)].map(normalizeChar);
  const result: LetterResult[] = Array(g.length).fill('absent');
  const remaining = [...a];
  g.forEach((ch, i) => { if (ch === a[i]) { result[i] = 'correct'; remaining[i] = ''; } });
  g.forEach((ch, i) => {
    if (result[i] === 'correct') return;
    const idx = remaining.indexOf(ch);
    if (idx !== -1) { result[i] = 'present'; remaining[idx] = ''; }
  });
  return result;
}

function buildDisplayMap(answer: string) {
  const out: ({ type: 'letter'; pos: number } | { type: 'space' } | { type: 'apostrophe' })[] = [];
  let pos = 0;
  for (const ch of answer) {
    if (ch === ' ') out.push({ type: 'space' });
    else if (ch === "'") out.push({ type: 'apostrophe' });
    else out.push({ type: 'letter', pos: pos++ });
  }
  return out;
}

function getKeyColors(guesses: string[], results: LetterResult[][]): Record<string, LetterResult> {
  const map: Record<string, LetterResult> = {};
  guesses.forEach((guess, gi) => {
    const res = results[gi];
    if (!res) return;
    [...guess].forEach((ch, li) => {
      const key = normalizeChar(ch);
      const cur = map[key];
      const next = res[li];
      if (cur === 'correct') return;
      if (!cur || next === 'correct' || (next === 'present' && cur === 'absent')) map[key] = next;
    });
  });
  return map;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDistKey(total: number): DistKey {
  if (total <= 11) return '11';
  if (total <= 15) return '12-15';
  if (total <= 20) return '16-20';
  if (total <= 30) return '21-30';
  if (total <= 40) return '31-40';
  if (total <= 50) return '41-50';
  return '50+';
}

function isLightColor(c: string) {
  return ['#ffffff', '#FFFFFF', '#FDE100', '#FFDD00', '#F7A014', '#6CABDD', '#FEBE10'].includes(c);
}

// ─── JerseyView ───────────────────────────────────────────────────────────────
function JerseyView({
  number, primaryColor, size, showNumber = true,
}: {
  number: number; primaryColor: string; size: 'sm' | 'lg'; showNumber?: boolean;
}) {
  const w = size === 'lg' ? 64 : 46;
  const h = size === 'lg' ? 70 : 50;
  const bodyW = Math.round(w * 0.8);
  const bodyH = Math.round(h * 0.72);
  const collarH = Math.round(h * 0.2);
  const collarW = Math.round(w * 0.3);
  const shoulderW = Math.round((w - bodyW) / 2) + 2;
  const numSize = size === 'lg' ? 16 : 13;
  const numColor = isLightColor(primaryColor) ? '#000000' : '#ffffff';

  return (
    <View style={{ width: w, height: h, alignItems: 'center' }}>
      {/* Shoulders */}
      <View style={{
        position: 'absolute', top: 0, left: 0,
        width: shoulderW, height: collarH + 4,
        backgroundColor: primaryColor,
        borderBottomLeftRadius: 3,
      }} />
      <View style={{
        position: 'absolute', top: 0, right: 0,
        width: shoulderW, height: collarH + 4,
        backgroundColor: primaryColor,
        borderBottomRightRadius: 3,
      }} />
      {/* Collar */}
      <View style={{
        width: collarW, height: collarH,
        backgroundColor: primaryColor,
        borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
        zIndex: 2,
      }} />
      {/* Body */}
      <View style={{
        width: bodyW, height: bodyH, borderRadius: 5,
        overflow: 'hidden', marginTop: -2,
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)',
      }}>
        <View style={{ flex: 1, backgroundColor: primaryColor }} />
      </View>
      {showNumber && (
        <Text style={{
          position: 'absolute',
          bottom: Math.round(bodyH * 0.18),
          width: w, textAlign: 'center',
          fontSize: numSize, fontWeight: '900', color: numColor,
        }}>
          {number}
        </Text>
      )}
    </View>
  );
}

// ─── PlayerJersey ─────────────────────────────────────────────────────────────
function PlayerJersey({
  number, primaryColor, status, isActive, onPress, showNumber,
}: {
  number: number; primaryColor: string;
  status: 'pending' | 'solved' | 'failed'; isActive: boolean; onPress: () => void; showNumber?: boolean;
}) {
  const fillPrimary = status === 'solved' ? '#16a34a' : status === 'failed' ? '#374151' : primaryColor;
  const borderColor = isActive ? 'rgba(255,255,255,0.9)' : status === 'solved' ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.08)';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        alignItems: 'center', borderRadius: 8, padding: 2,
        borderWidth: isActive ? 2 : 1, borderColor,
        transform: [{ scale: isActive ? 1.1 : 1.0 }],
      }}
    >
      <JerseyView number={number} primaryColor={fillPrimary} size="sm" showNumber={showNumber} />
    </TouchableOpacity>
  );
}

// ─── LetterTile ───────────────────────────────────────────────────────────────
type TileState = 'correct' | 'present' | 'absent' | 'active' | 'empty';

function LetterTile({ letter, state }: { letter: string; state: TileState }) {
  const bg =
    state === 'correct' ? '#16a34a' :
    state === 'present' ? '#d97706' :
    state === 'absent'  ? '#374151' : '#0f172a';
  const border =
    state === 'active' ? '#94a3b8' :
    state === 'empty'  ? '#334155' : bg;
  return (
    <View style={{ width: 32, height: 32, backgroundColor: bg, borderWidth: 2, borderColor: border, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: 'white', fontWeight: '900', fontSize: 12 }}>{letter}</Text>
    </View>
  );
}

// ─── GuessRow ─────────────────────────────────────────────────────────────────
function GuessRow({ guess, answer, result, isCurrent }: {
  guess: string; answer: string; result: LetterResult[] | null; isCurrent: boolean;
}) {
  const displayMap = buildDisplayMap(answer);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      {displayMap.map((cell, i) => {
        if (cell.type === 'space') return <View key={i} style={{ width: 8 }} />;
        if (cell.type === 'apostrophe') {
          return (
            <View key={i} style={{ width: 14, height: 32, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#94a3b8', fontWeight: '900', fontSize: 14 }}>'</Text>
            </View>
          );
        }
        const pos = cell.pos;
        const letter = guess[pos] || '';
        let state: TileState;
        if (result) state = result[pos] as TileState;
        else if (isCurrent) state = letter ? 'active' : 'empty';
        else state = 'empty';
        return <LetterTile key={i} letter={letter} state={state} />;
      })}
    </View>
  );
}

// ─── KeyboardKey ──────────────────────────────────────────────────────────────
function KeyboardKey({ label, color, onPress }: {
  label: string; color?: LetterResult; onPress: (k: string) => void;
}) {
  const isWide = label === '⌫' || label === '↵';
  const bg =
    color === 'correct' ? '#16a34a' :
    color === 'present' ? '#d97706' :
    color === 'absent'  ? '#374151' : '#475569';
  const textColor = color === 'absent' ? '#9ca3af' : 'white';
  return (
    <TouchableOpacity
      onPress={() => onPress(label)}
      activeOpacity={0.6}
      style={{ width: isWide ? 36 : 26, height: 40, backgroundColor: bg, borderRadius: 6, alignItems: 'center', justifyContent: 'center', margin: 1.5 }}
    >
      <Text style={{ color: textColor, fontWeight: '700', fontSize: 11 }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type Props = { difficulty: 'kolay' | 'zor'; navigation: any };

export default function KadroBul({ difficulty, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');

  const [matches, setMatches] = useState<MatchData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<'intro' | 'pitch' | 'guessing' | 'result'>('intro');
  const [playerStates, setPlayerStates] = useState<PlayerState[]>([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<Stats>({ ...DEFAULT_STATS, distribution: { ...DEFAULT_STATS.distribution } });
  const [gameRecorded, setGameRecorded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const statsKey = `kadro_bul_${difficulty}_stats_v1`;

  // ─── Init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const today = todayStr();
      const raw = [
        ...getData('questions-kadro-bul-kolay'),
        ...getData('questions-kadro-bul-zor'),
      ] as MatchData[];
      const available = raw
        .filter((m) => m.difficulty === difficulty && m.activeDate <= today)
        .sort((a, b) => a.activeDate.localeCompare(b.activeDate));
      setMatches(available);

      try {
        const savedStats = await AsyncStorage.getItem(statsKey);
        if (savedStats) setStats(JSON.parse(savedStats));
      } catch { /* ignore */ }

      if (available.length > 0) {
        const idx = available.length - 1;
        setCurrentIndex(idx);
        await _loadMatch(idx, available);
      }
      setIsLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  function initPlayerStates(match: MatchData): PlayerState[] {
    return match.players.map(() => ({ guesses: [], results: [], status: 'pending' }));
  }

  async function _loadMatch(idx: number, matchList: MatchData[]) {
    const match = matchList[idx];
    setCurrentIndex(idx);
    setView('intro');
    setActivePlayerIdx(null);
    setInput('');
    setGameRecorded(false);
    try {
      const saved = await AsyncStorage.getItem(`kadro_bul_${difficulty}_session_${match.activeDate}`);
      if (saved) {
        const data = JSON.parse(saved);
        setPlayerStates(data.playerStates);
        setGameRecorded(data.gameRecorded ?? false);
        setView('pitch');
        return;
      }
    } catch { /* ignore */ }
    setPlayerStates(initPlayerStates(match));
  }

  function loadMatch(idx: number) {
    _loadMatch(idx, matches);
  }

  const currentMatch = matches[currentIndex];
  const isAllDone = playerStates.length > 0 && playerStates.every((ps) => ps.status !== 'pending');
  const isWin = isAllDone && playerStates.every((ps) => ps.status === 'solved');
  const solvedCount = playerStates.filter((ps) => ps.status === 'solved').length;
  const totalGuesses = playerStates.reduce((sum, ps) => sum + ps.guesses.length, 0);

  // Record stats when game ends
  useEffect(() => {
    if (!isAllDone || gameRecorded || !currentMatch || playerStates.length === 0) return;
    (async () => {
      const win = playerStates.every((ps) => ps.status === 'solved');
      const total = playerStates.reduce((sum, ps) => sum + ps.guesses.length, 0);
      let newStats: Stats;
      try {
        const s = await AsyncStorage.getItem(statsKey);
        newStats = s ? JSON.parse(s) : { ...DEFAULT_STATS, distribution: { ...DEFAULT_STATS.distribution } };
      } catch {
        newStats = { ...DEFAULT_STATS, distribution: { ...DEFAULT_STATS.distribution } };
      }
      newStats.totalGames += 1;
      if (win) { newStats.wins += 1; newStats.distribution[getDistKey(total)] += 1; }
      await AsyncStorage.setItem(statsKey, JSON.stringify(newStats));
      setStats(newStats);
      setGameRecorded(true);
      await AsyncStorage.setItem(
        `kadro_bul_${difficulty}_session_${currentMatch.activeDate}`,
        JSON.stringify({ playerStates, gameRecorded: true })
      );
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllDone, gameRecorded]);

  // Persist session state
  useEffect(() => {
    if (!currentMatch || playerStates.length === 0 || view === 'intro') return;
    AsyncStorage.setItem(
      `kadro_bul_${difficulty}_session_${currentMatch.activeDate}`,
      JSON.stringify({ playerStates, gameRecorded })
    ).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerStates, gameRecorded]);

  const handleKeyPress = useCallback((key: string) => {
    if (activePlayerIdx === null || !currentMatch) return;
    const ps = playerStates[activePlayerIdx];
    if (ps.status !== 'pending') return;
    const answer = stripForGuess(currentMatch.players[activePlayerIdx].answer);

    if (key === '⌫') { setInput((prev) => prev.slice(0, -1)); return; }
    if (key === '↵') {
      if (input.length !== answer.length) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }
      const result = evaluateGuess(input, answer);
      const newGuesses = [...ps.guesses, input];
      const newResults = [...ps.results, result];
      const solved = result.every((r) => r === 'correct');
      const failed = !solved && newGuesses.length >= MAX_GUESSES;
      const newState: PlayerState = { guesses: newGuesses, results: newResults, status: solved ? 'solved' : failed ? 'failed' : 'pending' };
      const newPlayerStates = [...playerStates];
      newPlayerStates[activePlayerIdx] = newState;
      setPlayerStates(newPlayerStates);
      setInput('');
      if (solved) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (failed) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (solved || failed) {
        setTimeout(() => { setView('pitch'); setActivePlayerIdx(null); }, 800);
      }
      return;
    }
    if (input.length < answer.length) setInput((prev) => prev + key);
  }, [activePlayerIdx, currentMatch, playerStates, input]);

  function handleSelectPlayer(idx: number) {
    const ps = playerStates[idx];
    if (ps.status !== 'pending') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActivePlayerIdx(idx);
    setInput('');
    setView('guessing');
  }

  function handleGiveUp() {
    if (activePlayerIdx === null) return;
    const newPlayerStates = [...playerStates];
    newPlayerStates[activePlayerIdx] = { ...playerStates[activePlayerIdx], status: 'failed' };
    setPlayerStates(newPlayerStates);
    setView('pitch');
    setActivePlayerIdx(null);
    setInput('');
  }

  async function shareScore() {
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
      '',
      `${currentMatch.homeTeam} ${currentMatch.homeScore}–${currentMatch.awayScore} ${currentMatch.awayTeam}`,
      `${currentMatch.league} · ${currentMatch.season}`,
      '',
      emojiRows.join(''),
      isWin ? `✅ ${solvedCount}/11 · ${totalGuesses} toplam tahmin` : `❌ ${solvedCount}/11 oyuncu bulundu`,
      '',
      'futboltrivia.com.tr/kadro-bul',
    ].join('\n');
    try { await Share.share({ message: text }); } catch { /* ignore */ }
  }

  // ─── Pitch layout ──────────────────────────────────────────────────────────
  function buildPitchRows(match: MatchData): PlayerData[][] {
    const rows: PlayerData[][] = [];
    let offset = 0;
    for (const count of match.formation) {
      rows.push(match.players.slice(offset, offset + count));
      offset += count;
    }
    return rows.reverse();
  }

  function playerIndexInMatch(player: PlayerData, match: MatchData) {
    return match.players.findIndex((p) => p.number === player.number);
  }

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) return <LoadingScreen />;

  if (!currentMatch) {
    return (
      <View style={[s.container, { paddingTop: insets.top + 16, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>Henüz oynanacak bir maç yok.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 14 }}>← Geri dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const teamColors = TEAM_COLORS[currentMatch.targetTeam] ?? { primary: currentMatch.teamColor };

  // ── Result ───────────────────────────────────────────────────────────────
  if (view === 'result') {
    const winPct = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
    const maxDist = Math.max(...Object.values(stats.distribution), 1);
    const myDistKey = isWin ? getDistKey(totalGuesses) : null;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: insets.top + 12 }}>
        {isWin && (
          <ConfettiCannon count={200} origin={{ x: screenWidth / 2, y: -20 }} autoStart fadeOut />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => setView('pitch')}>
            <Text style={{ color: '#94a3b8', fontWeight: '600', fontSize: 14 }}>← Sahaya Dön</Text>
          </TouchableOpacity>
          <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 16 }}>Kadro Bul</Text>
          <View style={{ width: 80 }} />
        </View>
        <View style={{ backgroundColor: '#0f172a', borderWidth: 2, borderColor: '#1e293b', borderRadius: 24, padding: 24 }}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>{isWin ? '🏆' : '😔'}</Text>
            <Text style={{ fontWeight: '700', fontSize: 20, color: isWin ? '#22c55e' : '#ef4444', marginBottom: 4 }}>
              {isWin ? 'Tebrikler!' : 'Maalesef!'}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>
              {currentMatch.homeTeam} {currentMatch.homeScore}–{currentMatch.awayScore} {currentMatch.awayTeam}
            </Text>
            <Text style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>
              {currentMatch.matchDate} · {currentMatch.league}
            </Text>
            {!isWin && (
              <Text style={{ color: '#64748b', fontSize: 11, marginTop: 8 }}>{solvedCount}/11 oyuncu bulundu</Text>
            )}
            {isWin && (
              <Text style={{ color: '#4ade80', fontSize: 11, fontWeight: '600', marginTop: 8 }}>
                {totalGuesses} toplam tahmin ile tamamlandı
              </Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 20, marginBottom: 20 }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>{stats.totalGames}</Text>
              <Text style={{ color: '#475569', fontSize: 9, fontWeight: '600', marginTop: 4 }}>Oynanan oyun</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#1e293b' }}>
              <Text style={{ color: '#22c55e', fontSize: 24, fontWeight: '700' }}>{winPct}%</Text>
              <Text style={{ color: '#475569', fontSize: 9, fontWeight: '600', marginTop: 4 }}>Kazanma yüzdesi</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#38bdf8', fontSize: 24, fontWeight: '700' }}>{stats.wins}</Text>
              <Text style={{ color: '#475569', fontSize: 9, fontWeight: '600', marginTop: 4 }}>Toplam galibiyet</Text>
            </View>
          </View>
          <Text style={{ color: '#475569', fontSize: 10, fontWeight: '700', marginBottom: 12, letterSpacing: 1 }}>TOPLAM TAHMİN DAĞILIMI</Text>
          {DIST_KEYS.map((key) => (
            <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ color: '#475569', fontSize: 10, fontWeight: '700', width: 40 }}>{key}</Text>
              <View style={{ flex: 1, height: 20, backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: 3, overflow: 'hidden' }}>
                <View style={{
                  width: `${(stats.distribution[key] / maxDist) * 100 || 5}%`,
                  height: '100%', borderRadius: 3,
                  backgroundColor: myDistKey === key ? '#dc2626' : '#334155',
                  alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 6,
                }}>
                  <Text style={{ color: 'white', fontSize: 9, fontWeight: '700' }}>{stats.distribution[key]}</Text>
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity
            onPress={shareScore}
            style={{ backgroundColor: 'white', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 8 }}
          >
            <Text style={{ color: 'black', fontWeight: '700', fontSize: 14 }}>Skoru Paylaş</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setView('pitch')}
            style={{ backgroundColor: '#1e293b', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>Sahayı Gör</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  if (view === 'intro') {
    return (
      <View style={[s.container, { paddingTop: insets.top + 8 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#94a3b8', fontWeight: '600', fontSize: 14 }}>← Geri dön</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => loadMatch(currentIndex - 1)}
              disabled={currentIndex === 0}
              style={{ width: 36, height: 36, backgroundColor: '#1e293b', borderRadius: 10, alignItems: 'center', justifyContent: 'center', opacity: currentIndex === 0 ? 0.2 : 1 }}
            >
              <Text style={{ color: '#cbd5e1', fontSize: 18, fontWeight: '700' }}>‹</Text>
            </TouchableOpacity>
            <Text style={{ color: '#dc2626', fontWeight: '700', fontSize: 22 }}>#{currentMatch.id}</Text>
            <TouchableOpacity
              onPress={() => loadMatch(currentIndex + 1)}
              disabled={currentIndex === matches.length - 1}
              style={{ width: 36, height: 36, backgroundColor: '#1e293b', borderRadius: 10, alignItems: 'center', justifyContent: 'center', opacity: currentIndex === matches.length - 1 ? 0.2 : 1 }}
            >
              <Text style={{ color: '#cbd5e1', fontSize: 18, fontWeight: '700' }}>›</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}>
          <Text style={{ color: 'white', fontSize: 32, fontWeight: '700', marginBottom: 8 }}>Kadro Bul</Text>
          <Text style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginBottom: 24, lineHeight: 20, maxWidth: 280 }}>
            Maçta oynayan 11 futbolcuyu bul. Her oyuncu için 6 tahmin hakkın var.
          </Text>
          <View style={{ width: '100%', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 24, padding: 24, marginBottom: 24 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: '#475569', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 4 }}>{currentMatch.league}</Text>
              <Text style={{ color: '#334155', fontSize: 11 }}>{currentMatch.season} · {currentMatch.matchDate}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>{currentMatch.homeTeam}</Text>
                <Text style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>Ev sahibi</Text>
              </View>
              <View style={{ marginHorizontal: 12, backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 24 }}>
                  {currentMatch.homeScore}–{currentMatch.awayScore}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>{currentMatch.awayTeam}</Text>
                <Text style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>Deplasman</Text>
              </View>
            </View>
            <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1e293b', alignItems: 'center' }}>
              <Text style={{ color: '#64748b', fontSize: 12 }}>
                <Text style={{ color: '#cbd5e1', fontWeight: '600' }}>{currentMatch.targetTeam}</Text>{' '}kadrosunu bul
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setView('pitch')}
            style={{ width: '100%', backgroundColor: '#dc2626', borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Kadroyu Bul</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ── Guessing ─────────────────────────────────────────────────────────────
  if (view === 'guessing' && activePlayerIdx !== null) {
    const ps = playerStates[activePlayerIdx];
    const player = currentMatch.players[activePlayerIdx];
    const answer = stripForGuess(player.answer);
    const keyColors = getKeyColors(ps.guesses, ps.results);
    return (
      <View style={[s.container, { paddingTop: insets.top + 8 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 }}>
          <TouchableOpacity onPress={() => { setView('pitch'); setInput(''); setActivePlayerIdx(null); }}>
            <Text style={{ color: '#94a3b8', fontWeight: '600', fontSize: 14 }}>← Sahaya Dön</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#94a3b8', fontSize: 11 }}>{currentMatch.homeTeam} vs {currentMatch.awayTeam}</Text>
            <Text style={{ color: '#475569', fontSize: 10 }}>{currentMatch.league} · {currentMatch.season}</Text>
          </View>
          <TouchableOpacity onPress={handleGiveUp}>
            <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 14 }}>Pes Et</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <JerseyView number={player.number} primaryColor={teamColors.primary} size="lg" showNumber />
          <Text style={{ color: '#64748b', fontSize: 12, fontWeight: '600', marginTop: 6 }}>
            {ps.guesses.length}/{MAX_GUESSES} tahmin · {answer.length} harf
          </Text>
        </View>
        <View style={{ paddingHorizontal: 16, marginBottom: 8, gap: 6 }}>
          {Array.from({ length: MAX_GUESSES }).map((_, gi) => {
            const isPast = gi < ps.guesses.length;
            const isCurrent = gi === ps.guesses.length && ps.status === 'pending';
            const guess = isPast ? ps.guesses[gi] : isCurrent ? input : '';
            const result = isPast ? ps.results[gi] : null;
            return <GuessRow key={gi} guess={guess} answer={player.answer} result={result} isCurrent={isCurrent} />;
          })}
        </View>
        {ps.status !== 'pending' && (
          <View style={{
            marginHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginBottom: 8,
            backgroundColor: ps.status === 'solved' ? 'rgba(22,163,74,0.2)' : 'rgba(51,65,85,0.5)',
          }}>
            <Text style={{ fontWeight: '700', fontSize: 14, color: ps.status === 'solved' ? '#4ade80' : '#94a3b8' }}>
              {ps.status === 'solved' ? `🎉 ${player.answer}` : `Cevap: ${player.answer}`}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
        <View style={{ paddingHorizontal: 4, paddingBottom: insets.bottom + 8, gap: 3 }}>
          {KEYBOARD_ROWS.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              {row.map((key) => (
                <KeyboardKey key={key} label={key} color={keyColors[normalizeChar(key)]} onPress={handleKeyPress} />
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }

  // ── Pitch ─────────────────────────────────────────────────────────────────
  const pitchRows = buildPitchRows(currentMatch);
  return (
    <View style={[s.container, { paddingTop: insets.top + 8 }]}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 6 }}>
        <TouchableOpacity onPress={() => setView('intro')}>
          <Text style={{ color: '#94a3b8', fontWeight: '600', fontSize: 14 }}>← Geri dön</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            onPress={() => loadMatch(currentIndex - 1)}
            disabled={currentIndex === 0}
            style={{ width: 32, height: 32, backgroundColor: '#1e293b', borderRadius: 8, alignItems: 'center', justifyContent: 'center', opacity: currentIndex === 0 ? 0.2 : 1 }}
          >
            <Text style={{ color: '#cbd5e1', fontSize: 16, fontWeight: '700' }}>‹</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 15 }}>Kadro Bul</Text>
            <Text style={{ color: '#475569', fontSize: 11 }}>#{currentMatch.id}</Text>
          </View>
          <TouchableOpacity
            onPress={() => loadMatch(currentIndex + 1)}
            disabled={currentIndex === matches.length - 1}
            style={{ width: 32, height: 32, backgroundColor: '#1e293b', borderRadius: 8, alignItems: 'center', justifyContent: 'center', opacity: currentIndex === matches.length - 1 ? 0.2 : 1 }}
          >
            <Text style={{ color: '#cbd5e1', fontSize: 16, fontWeight: '700' }}>›</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#64748b', fontSize: 12, fontWeight: '600' }}>{solvedCount}/11</Text>
      </View>

      {/* Match strip */}
      <View style={{ marginHorizontal: 16, backgroundColor: 'rgba(15,23,42,0.5)', borderWidth: 1, borderColor: 'rgba(30,41,59,0.5)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>{currentMatch.homeTeam}</Text>
        <View style={{ backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>{currentMatch.homeScore}–{currentMatch.awayScore}</Text>
        </View>
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>{currentMatch.awayTeam}</Text>
      </View>
      <Text style={{ color: '#475569', fontSize: 10, textAlign: 'center', marginBottom: 6 }}>
        {currentMatch.matchDate} · {currentMatch.league}
      </Text>

      {/* Pitch */}
      <View style={{ flex: 1, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', marginBottom: 6 }}>
        {/* Grass stripes */}
        <View style={StyleSheet.absoluteFillObject}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <View key={i} style={{ flex: 1, backgroundColor: i % 2 === 0 ? '#1a6128' : '#1e6e2d' }} />
          ))}
        </View>
        {/* Pitch markings */}
        <View style={{ ...StyleSheet.absoluteFillObject, margin: 6 }}>
          <View style={{ flex: 1, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.22)', borderRadius: 3 }}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1.5, backgroundColor: 'rgba(255,255,255,0.22)' }} />
            <View style={{ position: 'absolute', left: '50%', top: '50%', width: 56, height: 56, marginLeft: -28, marginTop: -28, borderRadius: 28, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.22)' }} />
            <View style={{ position: 'absolute', left: '22%', right: '22%', top: 0, height: '18%', borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderRightWidth: 1.5, borderColor: 'rgba(255,255,255,0.22)' }} />
            <View style={{ position: 'absolute', left: '22%', right: '22%', bottom: 0, height: '18%', borderTopWidth: 1.5, borderLeftWidth: 1.5, borderRightWidth: 1.5, borderColor: 'rgba(255,255,255,0.22)' }} />
          </View>
        </View>
        {/* Players */}
        <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 10, paddingVertical: 10, paddingHorizontal: 4, justifyContent: 'space-around' }}>
          {pitchRows.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              {row.map((player) => {
                const idx = playerIndexInMatch(player, currentMatch);
                const ps = playerStates[idx];
                if (!ps) return null;
                return (
                  <View key={player.number} style={{ alignItems: 'center', gap: 2 }}>
                    <PlayerJersey
                      number={player.number}
                      primaryColor={teamColors.primary}
                      status={ps.status}
                      isActive={activePlayerIdx === idx}
                      onPress={() => ps.status === 'pending' ? handleSelectPlayer(idx) : undefined}
                      showNumber
                    />
                    <View style={{ alignItems: 'center', minWidth: 40 }}>
                      {ps.status === 'solved' ? (
                        <Text style={{ fontSize: 8, color: '#4ade80', fontWeight: '700', lineHeight: 11 }}>{player.answer}</Text>
                      ) : ps.status === 'failed' ? (
                        <Text style={{ fontSize: 8, color: '#64748b', fontWeight: '600', lineHeight: 11 }}>{player.answer}</Text>
                      ) : (
                        <Text style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: 2, fontSize: 7 }}>
                          {'·'.repeat(stripForGuess(player.answer).length)}
                        </Text>
                      )}
                      {ps.guesses.length > 0 && (
                        <View style={{
                          paddingHorizontal: 3, paddingVertical: 1, borderRadius: 3,
                          backgroundColor: ps.status === 'solved' ? 'rgba(74,222,128,0.15)' : 'rgba(71,85,105,0.4)',
                          borderWidth: 1, borderColor: ps.status === 'solved' ? 'rgba(74,222,128,0.3)' : 'rgba(71,85,105,0.5)',
                        }}>
                          <Text style={{ fontSize: 7, fontWeight: '700', color: ps.status === 'solved' ? '#4ade80' : '#64748b' }}>
                            {ps.guesses.length}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Bottom bar */}
      {isAllDone ? (
        <View style={{ marginHorizontal: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, padding: 14, alignItems: 'center', marginBottom: insets.bottom + 8 }}>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 15, marginBottom: 4 }}>
            {isWin ? '🏆 Kadroyu tamamladın!' : `${solvedCount}/11 oyuncu bulundu`}
          </Text>
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 10 }}>
            {currentMatch.targetTeam} · {currentMatch.league} {currentMatch.season}
          </Text>
          <TouchableOpacity
            onPress={() => setView('result')}
            style={{ width: '100%', backgroundColor: '#dc2626', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Sonuçları Gör</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={{ color: '#475569', fontSize: 12, textAlign: 'center', paddingBottom: insets.bottom + 8 }}>
          Tahmin yapmak için bir formaya dokun.
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
});
