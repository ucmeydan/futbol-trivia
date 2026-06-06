import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Share, Modal, Keyboard, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { storage } from '../utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import LoadingScreen from '../components/LoadingScreen';

import playersData from '../data/players.json';
import teamsData from '../data/teams.json';
import europeanTeamsData from '../data/european_teams.json';
import tdData from '../data/td.json';
import countriesData from '../data/countries.json';
import citiesData from '../data/cities.json';
import allTeamsData from '../data/all_teams.json';
import kolayQuestions from '../data/questions-top10-kolay.json';
import zorQuestions from '../data/questions-top10-zor.json';

const allQuestions = [...(kolayQuestions as any[]), ...(zorQuestions as any[])];

const formatName = (name: string) =>
  name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const normalizeText = (text: string) => {
  if (!text) return '';
  return text.trim()
    .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const getLetterHint = (name: string) =>
  name.split('').map(c => (c === ' ' ? '  ' : '_')).join(' ');

type Stats = { totalGames: number; wins: number; totalCorrect: number; distribution: number[] };
type Props = { difficulty: 'kolay' | 'zor'; navigation: any };

export default function Top10({ difficulty, navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hintMode, setHintMode] = useState<'easy' | 'hard' | null>(null);
  const [query, setQuery] = useState('');
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [lives, setLives] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [nextGameTime, setNextGameTime] = useState('');
  const [isError, setIsError] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalGames: 0, wins: 0, totalCorrect: 0, distribution: Array(11).fill(0) });
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // ─── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const d = new Date();
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const filtered = allQuestions.filter((q: any) =>
        q.game === 'top10' && q.activeDate <= dateStr && q.difficulty === difficulty
      );
      setGameQuestions(filtered);
      await Promise.all([
        filtered.length > 0 ? checkAndLoadQuestion(filtered.length - 1, filtered) : Promise.resolve(),
        storage.get(`top10_${difficulty}_stats_v2`).then(raw => { try { if (raw) setStats(JSON.parse(raw)); } catch { /* bozuk veri */ } }),
      ]);
      setIsLoading(false);
    })();
  }, []);

  // ─── Next-game countdown ────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const sc = Math.floor((diff % 60_000) / 1000);
      setNextGameTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Suggestions ────────────────────────────────────────────────────────────
  useEffect(() => {
    const q = gameQuestions[currentIndex];
    if (query.length < 2 || !q) { setSuggestions([]); return; }
    let src: string[] = [];
    if (q.type === 'player') src = playersData as string[];
    else if (q.type === 'team' || q.type === 'team-tr') src = teamsData as string[];
    else if (q.type === 'team-eu') src = europeanTeamsData as string[];
    else if (q.type === 'td') src = tdData as string[];
    else if (q.type === 'country') src = countriesData as string[];
    else if (q.type === 'city') src = citiesData as string[];
    else if (q.type === 'team-all') src = allTeamsData as string[];
    const norm = normalizeText(query);
    const filtered = Array.from(new Set(src))
      .filter(item => normalizeText(item).includes(norm))
      .filter(item => !foundIndices.some(idx => normalizeText(q.targets[idx]) === normalizeText(item)))
      .slice(0, 5);
    setSuggestions(filtered);
  }, [query, foundIndices, gameQuestions, currentIndex]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const checkAndLoadQuestion = async (index: number, ql: any[]) => {
    if (index < 0 || index >= ql.length) return;
    setCurrentIndex(index);
    const q = ql[index];
    const session = await storage.get(`top10_${difficulty}_session_${q.activeDate}`);
    if (session) {
      const data = JSON.parse(session);
      setFoundIndices(data.foundIndices || []);
      setIsWin(data.isWin || false);
      setLives(data.lives ?? 3);
      setHintMode(data.hintMode || 'hard');
      setIsGameOver(true);
    } else {
      setFoundIndices([]);
      setLives(3);
      setIsGameOver(false);
      setIsWin(false);
      setHintMode(null);
    }
    setQuery('');
    setShowAll(false);
    setSuggestions([]);
  };

  const currentQ = gameQuestions[currentIndex];

  const finishGame = async (winStatus: boolean, latestFoundIndices?: number[]) => {
    const toSave = latestFoundIndices ?? foundIndices;
    setIsGameOver(true);
    setIsActive(false);
    setIsWin(winStatus);
    if (winStatus) setShowConfetti(true);
    const finalScore = winStatus ? 10 : toSave.length;

    if (!currentQ) return;
    await storage.set(`top10_${difficulty}_session_${currentQ.activeDate}`,
      JSON.stringify({ foundIndices: toSave, isWin: winStatus, lives, hintMode }));

    const rawStats = await storage.get(`top10_${difficulty}_stats_v2`);
    const base: Stats = rawStats ? JSON.parse(rawStats) : { totalGames: 0, wins: 0, totalCorrect: 0, distribution: Array(11).fill(0) };
    const dist = [...base.distribution];
    dist[finalScore] = (dist[finalScore] || 0) + 1;
    const updated: Stats = {
      totalGames: base.totalGames + 1,
      wins: winStatus ? base.wins + 1 : base.wins,
      totalCorrect: base.totalCorrect + finalScore,
      distribution: dist,
    };
    setStats(updated);
    await storage.set(`top10_${difficulty}_stats_v2`, JSON.stringify(updated));
    setShowStatsModal(true);
  };

  const handleGuess = (guess: string) => {
    if (isGameOver || !currentQ) return;
    const norm = normalizeText(guess);
    const idx = currentQ.targets.findIndex((t: string) => normalizeText(t) === norm);
    if (idx !== -1 && !foundIndices.includes(idx)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newFound = [...foundIndices, idx];
      setFoundIndices(newFound);
      if (newFound.length === currentQ.targets.length) finishGame(true, newFound);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) finishGame(false);
    }
    setQuery('');
    setSuggestions([]);
  };

  const handleShare = async () => {
    if (!currentQ) return;
    const grid = currentQ.targets.map((_: any, i: number) => foundIndices.includes(i) ? '🟩' : '⬛').join('');
    const text = [
      `⚽ FutbolTrivia — Top 10 #${currentQ.id}`,
      '',
      currentQ.title,
      '',
      `${grid}  ${foundIndices.length}/${currentQ.targets.length}`,
      '',
      'Bugün sen de dene 👇',
      'futboltrivia.com.tr/top10',
    ].join('\n');
    await Share.share({ message: text });
  };

  const getPlaceholder = () => {
    if (!currentQ) return 'Ara...';
    if (currentQ.type.startsWith('team')) return 'Takım ara...';
    if (currentQ.type === 'td') return 'Teknik direktör ara...';
    if (currentQ.type === 'country') return 'Ülke ara...';
    if (currentQ.type === 'city') return 'Şehir ara...';
    return 'Futbolcu ara...';
  };

  if (isLoading) return <LoadingScreen />;

  if (!currentQ) {
    return (
      <View style={[s.container, { paddingTop: insets.top + 20 }]}>
        <Text style={s.emptyText}>Bu zorluk seviyesi için henüz soru eklenmedi.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backLink}>← Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const maxDist = Math.max(...stats.distribution, 1);
  const correctRate = Math.round((stats.totalCorrect / (stats.totalGames * 10 || 1)) * 100);

  // ─── Hint mode selection ─────────────────────────────────────────────────────
  if (hintMode === null && !isGameOver) {
    return (
      <View style={[s.container, { paddingTop: insets.top + 12 }]}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={s.backText}>← Geri Dön</Text>
          </TouchableOpacity>
        </View>

        <View style={s.questionNav}>
          <TouchableOpacity
            style={[s.navBtn, currentIndex === 0 && s.navBtnDisabled]}
            onPress={() => checkAndLoadQuestion(currentIndex - 1, gameQuestions)}
            disabled={currentIndex === 0}
          >
            <Text style={s.navBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.questionId}>#{currentQ.id}</Text>
          <TouchableOpacity
            style={[s.navBtn, currentIndex === gameQuestions.length - 1 && s.navBtnDisabled]}
            onPress={() => checkAndLoadQuestion(currentIndex + 1, gameQuestions)}
            disabled={currentIndex === gameQuestions.length - 1}
          >
            <Text style={s.navBtnText}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.hintTitle}>"{currentQ.title}"</Text>
        <Text style={s.hintSubtitle}>İPUCU TERCİHİ</Text>

        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          <TouchableOpacity style={s.hintCard} onPress={() => setHintMode('easy')}>
            <Text style={s.hintEmoji}>👁</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.hintCardTitle, { color: '#22c55e' }]}>İpucu Açık</Text>
              <Text style={s.hintCardDesc}>Her cevabın kaç harften oluştuğunu görebilirsin.</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={s.hintCard} onPress={() => setHintMode('hard')}>
            <Text style={s.hintEmoji}>🚫</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.hintCardTitle, { color: '#ef4444' }]}>İpucu Kapalı</Text>
              <Text style={s.hintCardDesc}>Hiçbir ipucu yok. Tamamen hafızana güvenmelisin!</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {showConfetti && (
        <ConfettiCannon
          count={150}
          origin={{ x: Dimensions.get('window').width / 2, y: 0 }}
          autoStart
          fadeOut
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
      {/* Stats Modal */}
      <Modal visible={showStatsModal} transparent animationType="fade" onRequestClose={() => setShowStatsModal(false)}>
        <View style={s.modalOverlay}>
          <ScrollView>
            <View style={s.modalCard}>
              <TouchableOpacity style={s.modalCloseBtn} onPress={() => setShowStatsModal(false)}>
                <Text style={s.modalCloseText}>✕</Text>
              </TouchableOpacity>
              <Text style={s.modalTitle}>İstatistik</Text>

              <View style={s.statsRow}>
                <View style={s.statBox}>
                  <Text style={s.statValueWhite}>{stats.totalGames}</Text>
                  <Text style={s.statLabel}>Oynanan oyun</Text>
                </View>
                <View style={[s.statBox, s.statBoxBorder]}>
                  <Text style={[s.statValueWhite, { color: '#4ade80' }]}>
                    {Math.round((stats.wins / (stats.totalGames || 1)) * 100)}%
                  </Text>
                  <Text style={s.statLabel}>Kazanma</Text>
                </View>
                <View style={s.statBox}>
                  <Text style={[s.statValueWhite, { color: '#38bdf8' }]}>{correctRate}%</Text>
                  <Text style={s.statLabel}>Doğru cevap</Text>
                </View>
              </View>

              <View style={{ gap: 6, marginBottom: 16 }}>
                {stats.distribution.map((count, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={s.distLabel}>{i}</Text>
                    <View style={s.distBg}>
                      <View style={[s.distBar,
                        { width: `${(count / maxDist) * 100 || 5}%` },
                        i === (isWin ? 10 : foundIndices.length) && { backgroundColor: '#dc2626' },
                      ]}>
                        <Text style={s.distCount}>{count}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View style={s.nextGameRow}>
                <View>
                  <Text style={s.nextGameLabel}>Sıradaki soru</Text>
                  <Text style={s.nextGameTime}>{nextGameTime}</Text>
                </View>
                {!isWin && !showAll && (
                  <TouchableOpacity style={s.showAllBtn} onPress={() => { setShowAll(true); setShowStatsModal(false); }}>
                    <Text style={s.showAllBtnText}>Cevapları Gör</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
                <Text style={s.shareBtnText}>Skoru Paylaş</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Top bar */}
      <View style={[s.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Geri Dön</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {[...Array(3)].map((_, i) => (
            <Text key={i} style={{ fontSize: 18, opacity: i < lives ? 1 : 0.2 }}>❤️</Text>
          ))}
        </View>
      </View>

      {/* Question nav */}
      <View style={s.questionNav}>
        <TouchableOpacity
          style={[s.navBtn, (currentIndex === 0 || isActive) && s.navBtnDisabled]}
          onPress={() => checkAndLoadQuestion(currentIndex - 1, gameQuestions)}
          disabled={currentIndex === 0 || isActive}
        >
          <Text style={s.navBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.questionId}>#{currentQ.id}</Text>
        <TouchableOpacity
          style={[s.navBtn, (currentIndex === gameQuestions.length - 1 || isActive) && s.navBtnDisabled]}
          onPress={() => checkAndLoadQuestion(currentIndex + 1, gameQuestions)}
          disabled={currentIndex === gameQuestions.length - 1 || isActive}
        >
          <Text style={s.navBtnText}>›</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.questionTitle}>{currentQ.title}</Text>

      {/* 10-item list */}
      <ScrollView style={s.listArea} contentContainerStyle={{ gap: 6 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        {currentQ.targets.map((name: string, i: number) => {
          const isFound = foundIndices.includes(i);
          return (
            <View key={i} style={[s.listItem,
              isFound ? s.listItemFound : showAll ? s.listItemRevealed : s.listItemHidden,
            ]}>
              {isFound || showAll ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Text style={s.listNum}>{i + 1}.</Text>
                  <Text style={s.listName}>{formatName(name)}</Text>
                  <Text style={[s.listTick, { color: isFound ? '#4ade80' : '#f87171' }]}>
                    {isFound ? '✓' : '✕'}
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={s.listNumHidden}>{i + 1}</Text>
                  {hintMode === 'easy' && (
                    <Text style={s.hintLetters}>{getLetterHint(name)}</Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Input area */}
      <View style={[s.inputArea, { paddingBottom: insets.bottom + 12 }]}>
        {!isGameOver ? (
          <View>
            {suggestions.length > 0 && (
              <View style={s.suggestionsBox}>
                {suggestions.map((sug, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[s.suggestionItem, i < suggestions.length - 1 && s.suggestionBorder]}
                    onPress={() => handleGuess(sug)}
                  >
                    <Text style={s.suggestionText}>{formatName(sug)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              style={[s.input, isError && s.inputError]}
              value={query}
              onChangeText={text => { setQuery(text); if (text.length > 0) setIsActive(true); }}
              placeholder={getPlaceholder()}
              placeholderTextColor="#475569"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        ) : (
          <View style={s.gameOverBox}>
            <View style={s.nextGameRow2}>
              <View>
                <Text style={s.nextGameLabel}>Sıradaki soru</Text>
                <Text style={s.nextGameTime}>{nextGameTime}</Text>
              </View>
              <TouchableOpacity style={s.statsBtn} onPress={() => setShowStatsModal(true)}>
                <Text style={s.statsBtnText}>İstatistik</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
              <Text style={s.shareBtnText}>SKORU PAYLAŞ</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  emptyText: { color: '#475569', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  backLink: { color: '#dc2626', fontWeight: '700', fontSize: 13 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.92)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0f172a', borderRadius: 24, padding: 24, borderWidth: 2, borderColor: '#1e293b' },
  modalCloseBtn: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
  modalCloseText: { color: '#475569', fontSize: 18 },
  modalTitle: { color: '#ffffff', fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  statsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b', marginBottom: 16, paddingBottom: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#1e293b' },
  statValueWhite: { color: '#ffffff', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  statLabel: { color: '#475569', fontSize: 9, fontWeight: '600', textAlign: 'center' },
  distLabel: { color: '#475569', fontSize: 10, fontWeight: '700', width: 16, textAlign: 'right' },
  distBg: { flex: 1, backgroundColor: 'rgba(2,6,23,0.5)', height: 20, borderRadius: 4, overflow: 'hidden' },
  distBar: { height: '100%', backgroundColor: '#475569', borderRadius: 4, justifyContent: 'center', paddingHorizontal: 6, minWidth: '5%' },
  distCount: { color: '#ffffff', fontSize: 9, fontWeight: '700' },
  nextGameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2,6,23,0.5)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 },
  nextGameRow2: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2,6,23,0.5)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#1e293b', marginBottom: 10 },
  nextGameLabel: { color: '#475569', fontSize: 10, fontWeight: '600', marginBottom: 4 },
  nextGameTime: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  showAllBtn: { backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  showAllBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  shareBtn: { backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  shareBtnText: { color: '#000000', fontSize: 14, fontWeight: '700' },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backText: { color: '#475569', fontSize: 13, fontWeight: '700' },

  questionNav: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 4, paddingHorizontal: 16 },
  navBtn: { width: 36, height: 36, backgroundColor: '#1e293b', borderRadius: 10, borderWidth: 1, borderColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  navBtnDisabled: { opacity: 0.25 },
  navBtnText: { color: '#cbd5e1', fontSize: 20, fontWeight: '700', lineHeight: 24 },
  questionId: { color: '#dc2626', fontSize: 22, fontWeight: '800' },
  questionTitle: { color: '#f1f5f9', fontSize: 14, fontWeight: '700', textAlign: 'center', paddingHorizontal: 16, marginBottom: 12, lineHeight: 20 },

  // Hint selection
  hintTitle: { color: '#f1f5f9', fontSize: 16, fontWeight: '700', textAlign: 'center', paddingHorizontal: 20, marginBottom: 32, marginTop: 8, lineHeight: 24 },
  hintSubtitle: { color: '#475569', fontSize: 11, fontWeight: '600', letterSpacing: 2, textAlign: 'center', marginBottom: 20 },
  hintCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, padding: 18, gap: 14 },
  hintEmoji: { fontSize: 24, width: 36, textAlign: 'center' },
  hintCardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  hintCardDesc: { color: '#94a3b8', fontSize: 12, lineHeight: 18 },

  // List
  listArea: { flex: 1, paddingHorizontal: 16 },
  listItem: { height: 36, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, justifyContent: 'center' },
  listItemFound: { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)' },
  listItemRevealed: { backgroundColor: 'rgba(220,38,38,0.1)', borderColor: 'rgba(220,38,38,0.3)' },
  listItemHidden: { backgroundColor: 'rgba(15,23,42,0.4)', borderColor: '#0f172a' },
  listNum: { color: '#dc2626', fontSize: 11, fontWeight: '700', width: 20 },
  listName: { color: '#ffffff', fontSize: 12, fontWeight: '600', flex: 1 },
  listTick: { fontSize: 10, marginLeft: 'auto' },
  listNumHidden: { color: '#334155', fontSize: 12, fontWeight: '700' },
  hintLetters: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'monospace', letterSpacing: -0.5 },

  // Input
  inputArea: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#020617' },
  suggestionsBox: { backgroundColor: '#1e293b', borderRadius: 14, borderWidth: 1, borderColor: '#334155', overflow: 'hidden', marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  suggestionItem: { paddingHorizontal: 16, paddingVertical: 14 },
  suggestionBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(51,65,85,0.6)' },
  suggestionText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '700', color: '#ffffff' },
  inputError: { borderColor: '#dc2626' },
  gameOverBox: { backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#1e293b', padding: 14 },
  statsBtn: { backgroundColor: '#1e293b', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  statsBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
});
