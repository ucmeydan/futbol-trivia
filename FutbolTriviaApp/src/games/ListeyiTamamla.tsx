import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Share, Modal, Keyboard, Animated, KeyboardAvoidingView, Platform, Dimensions,
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
import kolayQuestions from '../data/questions-listeyi-tamamla-kolay.json';
import zorQuestions from '../data/questions-listeyi-tamamla-zor.json';

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

type Stats = { totalGames: number; wins: number; bestScore: number; highestPercentage: number };

type Props = { difficulty: 'kolay' | 'zor'; navigation: any };

export default function ListeyiTamamla({ difficulty, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [today, setToday] = useState('');
  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [nextGameTime, setNextGameTime] = useState('');
  const [giveUpConfirm, setGiveUpConfirm] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalGames: 0, wins: 0, bestScore: 0, highestPercentage: 0 });

  const bonusOpacity = useRef(new Animated.Value(0)).current;
  const bonusTranslateY = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // ─── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const d = new Date();
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      setToday(dateStr);

      const filtered = allQuestions.filter((q: any) =>
        q.game === 'listeyi-tamamla' && q.activeDate <= dateStr && q.difficulty === difficulty
      );
      setGameQuestions(filtered);

      await Promise.all([
        filtered.length > 0
          ? (setCurrentIndex(filtered.length - 1), loadQuestion(filtered[filtered.length - 1], dateStr))
          : Promise.resolve(),
        storage.get(`listeyi_tamamla_${difficulty}_stats`).then(raw => { try { if (raw) setStats(JSON.parse(raw)); } catch { /* bozuk veri */ } }),
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
      const s = Math.floor((diff % 60_000) / 1000);
      setNextGameTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Game timer ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) { finishGame(false); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // ─── Suggestions ────────────────────────────────────────────────────────────
  useEffect(() => {
    const currentQ = gameQuestions[currentIndex];
    if (query.length < 2 || !currentQ) { setSuggestions([]); return; }

    let src: string[] = [];
    if (currentQ.type === 'player') src = playersData as string[];
    else if (currentQ.type === 'team-tr' || currentQ.type === 'team') src = teamsData as string[];
    else if (currentQ.type === 'team-eu') src = europeanTeamsData as string[];
    else if (currentQ.type === 'td') src = tdData as string[];
    else if (currentQ.type === 'country') src = countriesData as string[];
    else if (currentQ.type === 'city') src = citiesData as string[];
    else if (currentQ.type === 'team-all') src = allTeamsData as string[];

    const norm = normalizeText(query);
    const filtered = Array.from(new Set(src))
      .filter(item => normalizeText(item).includes(norm))
      .filter(item => !foundItems.some(f => normalizeText(f) === normalizeText(item)))
      .filter(item => !wrongGuesses.some(w => normalizeText(w) === normalizeText(item)))
      .slice(0, 5);
    setSuggestions(filtered);
  }, [query, foundItems, wrongGuesses, gameQuestions, currentIndex]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const loadQuestion = async (q: any, dateStr: string) => {
    const lastPlayed = await storage.get(`listeyi_tamamla_${difficulty}_last_played_${q.activeDate}`);
    if (lastPlayed === dateStr) {
      const session = await storage.get(`listeyi_tamamla_${difficulty}_session_${q.activeDate}`);
      if (session) {
        const data = JSON.parse(session);
        setFoundItems(data.found || []);
        setIsWin(data.won || false);
      }
      setIsGameOver(true);
    } else {
      setFoundItems([]);
      setIsWin(false);
      setIsGameOver(false);
    }
    setWrongGuesses([]);
    setTimeLeft(90);
    setIsActive(false);
    setShowAll(false);
    setQuery('');
    setSuggestions([]);
  };

  const navigateQuestion = async (newIdx: number) => {
    if (newIdx < 0 || newIdx >= gameQuestions.length || isActive) return;
    const q = gameQuestions[newIdx];
    setCurrentIndex(newIdx);
    const session = await storage.get(`listeyi_tamamla_${difficulty}_session_${q.activeDate}`);
    setWrongGuesses([]);
    setTimeLeft(90);
    setIsActive(false);
    setShowAll(false);
    setQuery('');
    setSuggestions([]);
    if (session) {
      const data = JSON.parse(session);
      setFoundItems(data.found || []);
      setIsWin(data.won || false);
      setIsGameOver(true);
    } else {
      setFoundItems([]);
      setIsWin(false);
      setIsGameOver(false);
    }
  };

  const currentQ = gameQuestions[currentIndex];

  const finishGame = async (won: boolean, effectiveFoundItems?: string[]) => {
    if (isGameOver) return;
    const itemsToSave = effectiveFoundItems ?? foundItems;
    setIsGameOver(true);
    setIsActive(false);
    setIsWin(won);
    if (won) setShowConfetti(true);

    if (!currentQ) return;
    const finalScore = won ? currentQ.targets.length : itemsToSave.length;
    await storage.set(`listeyi_tamamla_${difficulty}_last_played_${currentQ.activeDate}`, today);
    await storage.set(`listeyi_tamamla_${difficulty}_session_${currentQ.activeDate}`,
      JSON.stringify({ found: itemsToSave, won }));

    const rawStats = await storage.get(`listeyi_tamamla_${difficulty}_stats`);
    const base: Stats = rawStats ? JSON.parse(rawStats) : { totalGames: 0, wins: 0, bestScore: 0, highestPercentage: 0 };
    const pct = Math.round((finalScore / currentQ.targets.length) * 100);
    const updated: Stats = {
      totalGames: base.totalGames + 1,
      wins: won ? base.wins + 1 : base.wins,
      bestScore: Math.max(base.bestScore, finalScore),
      highestPercentage: Math.max(base.highestPercentage, pct),
    };
    setStats(updated);
    await storage.set(`listeyi_tamamla_${difficulty}_stats`, JSON.stringify(updated));
    setTimeout(() => setShowStatsModal(true), 1000);
  };

  const handleGuess = (guess: string) => {
    if (isGameOver || !currentQ) return;
    setGiveUpConfirm(false);
    const norm = normalizeText(guess);
    const isCorrect = currentQ.targets.some((t: string) => normalizeText(t) === norm);

    if (isCorrect) {
      const actualName = currentQ.targets.find((t: string) => normalizeText(t) === norm)!;
      const newFound = [...foundItems, actualName];
      setFoundItems(newFound);
      setTimeLeft(prev => prev + 5);

      bonusOpacity.setValue(1);
      bonusTranslateY.setValue(0);
      Animated.parallel([
        Animated.timing(bonusOpacity, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.timing(bonusTranslateY, { toValue: -30, duration: 800, useNativeDriver: true }),
      ]).start();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (newFound.length === currentQ.targets.length) finishGame(true, newFound);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      if (!wrongGuesses.some(w => normalizeText(w) === normalizeText(guess))) {
        setWrongGuesses(prev => [...prev, guess]);
      }
    }
    setQuery('');
    setSuggestions([]);
  };

  const handleShare = async () => {
    if (!currentQ) return;
    const found = foundItems.length;
    const total = currentQ.targets.length;
    const text = [
      `⚽ FutbolTrivia — Listeyi Tamamla #${currentQ.id}`,
      '',
      currentQ.title,
      '',
      `${found === total ? '🏆' : '⚡'} 90 saniyede ${found}/${total} buldum!`,
      '',
      'Bugün sen de dene 👇',
      'futboltrivia.com.tr/listeyi-tamamla',
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

  // ─── Empty state ─────────────────────────────────────────────────────────────
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

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
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
          <View style={s.modalCard}>
            <TouchableOpacity style={s.modalCloseBtn} onPress={() => setShowStatsModal(false)}>
              <Text style={s.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>İstatistikler</Text>

            <View style={s.statsGrid}>
              {[
                { value: String(stats.totalGames), label: 'Toplam oyun', color: '#ffffff' },
                { value: String(stats.wins), label: 'Tamamlanan liste', color: '#22c55e' },
                { value: String(stats.bestScore), label: 'Doğru cevap rekoru', color: '#dc2626' },
                { value: `%${stats.highestPercentage}`, label: 'En iyi yüzde', color: '#38bdf8' },
              ].map(({ value, label, color }) => (
                <View key={label} style={s.statItem}>
                  <Text style={[s.statValue, { color }]}>{value}</Text>
                  <Text style={s.statLabel}>{label}</Text>
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
              <Text style={s.shareBtnText}>Paylaş</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Top bar */}
      <View style={[s.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Geri Dön</Text>
        </TouchableOpacity>
        {!isGameOver && isActive && (
          <TouchableOpacity
            style={[s.giveUpBtn, giveUpConfirm && s.giveUpBtnActive]}
            onPress={() => {
              if (giveUpConfirm) { finishGame(false); }
              else { setGiveUpConfirm(true); setTimeout(() => setGiveUpConfirm(false), 3000); }
            }}
          >
            <Text style={[s.giveUpText, giveUpConfirm && s.giveUpTextActive]}>
              {giveUpConfirm ? 'Emin misin?' : 'Pes Et'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Question nav + title */}
      <View style={s.questionArea}>
        <View style={s.questionNav}>
          <TouchableOpacity
            style={[s.navBtn, (currentIndex === 0 || isActive) && s.navBtnDisabled]}
            onPress={() => navigateQuestion(currentIndex - 1)}
            disabled={currentIndex === 0 || isActive}
          >
            <Text style={s.navBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.questionId}>#{currentQ.id}</Text>
          <TouchableOpacity
            style={[s.navBtn, (currentIndex === gameQuestions.length - 1 || isActive) && s.navBtnDisabled]}
            onPress={() => navigateQuestion(currentIndex + 1)}
            disabled={currentIndex === gameQuestions.length - 1 || isActive}
          >
            <Text style={s.navBtnText}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.questionTitle}>{currentQ.title}</Text>
        {currentQ.note ? <Text style={s.questionNote}>{currentQ.note}</Text> : null}

        {/* Score + timer row */}
        <View style={s.scoreRow}>
          <View>
            <Text style={s.scoreLabel}>BULUNAN</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={s.scoreFound}>{foundItems.length}</Text>
              <Text style={s.scoreTotal}>/{currentQ.targets.length}</Text>
            </View>
          </View>

          <View style={s.timerWrap}>
            <Animated.Text style={[s.bonusText, { opacity: bonusOpacity, transform: [{ translateY: bonusTranslateY }] }]}>
              +5
            </Animated.Text>
            <View style={[s.timerCircle, {
              borderColor: isGameOver ? '#22c55e' : timeLeft <= 10 ? '#ef4444' : '#22c55e',
            }]}>
              <Text style={[s.timerNumber, {
                color: isGameOver ? '#22c55e' : timeLeft <= 10 ? '#ef4444' : '#ffffff',
              }]}>
                {isGameOver ? '✓' : timeLeft}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Found + wrong items */}
      <ScrollView style={s.itemsArea} contentContainerStyle={s.itemsContent} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={s.chipWrap}>
          {foundItems.map((p, i) => (
            <View key={i} style={s.foundChip}>
              <Text style={s.foundChipText}>{formatName(p)}</Text>
            </View>
          ))}
          {showAll && currentQ.targets
            .filter((t: string) => !foundItems.some(f => normalizeText(f) === normalizeText(t)))
            .map((t: string, i: number) => (
              <View key={`r${i}`} style={s.revealChip}>
                <Text style={s.revealChipText}>{formatName(t)}</Text>
              </View>
            ))
          }
        </View>
        {!isGameOver && wrongGuesses.length > 0 && (
          <View style={[s.chipWrap, s.wrongSection]}>
            {wrongGuesses.map((w, i) => (
              <View key={i} style={s.wrongChip}>
                <Text style={s.wrongChipText}>{formatName(w)}</Text>
              </View>
            ))}
          </View>
        )}
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
              ref={inputRef}
              style={s.input}
              value={query}
              onChangeText={text => { setQuery(text); if (text.length > 0 && !isActive) setIsActive(true); }}
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
              <Text style={s.shareBtnText}>PAYLAŞ</Text>
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

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.92)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: '#0f172a', borderRadius: 24, padding: 24, borderWidth: 2, borderColor: '#1e293b' },
  modalCloseBtn: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
  modalCloseText: { color: '#475569', fontSize: 18 },
  modalTitle: { color: '#ffffff', fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statItem: { flex: 1, minWidth: '45%', backgroundColor: 'rgba(2,6,23,0.5)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1e293b', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  statLabel: { color: '#475569', fontSize: 10, fontWeight: '600', textAlign: 'center' },
  nextGameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2,6,23,0.5)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 },
  nextGameRow2: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2,6,23,0.5)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#1e293b', marginBottom: 10 },
  nextGameLabel: { color: '#475569', fontSize: 10, fontWeight: '600', marginBottom: 4 },
  nextGameTime: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  showAllBtn: { backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  showAllBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  shareBtn: { backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  shareBtnText: { color: '#000000', fontSize: 14, fontWeight: '700' },

  // Top bar
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backText: { color: '#475569', fontSize: 13, fontWeight: '700' },
  giveUpBtn: { borderWidth: 1, borderColor: 'rgba(185,28,28,0.3)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  giveUpBtnActive: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  giveUpText: { color: '#dc2626', fontSize: 12, fontWeight: '700' },
  giveUpTextActive: { color: '#ffffff' },

  // Question
  questionArea: { paddingHorizontal: 16, paddingBottom: 8 },
  questionNav: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 8 },
  navBtn: { width: 36, height: 36, backgroundColor: '#1e293b', borderRadius: 10, borderWidth: 1, borderColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  navBtnDisabled: { opacity: 0.25 },
  navBtnText: { color: '#cbd5e1', fontSize: 20, fontWeight: '700', lineHeight: 24 },
  questionId: { color: '#dc2626', fontSize: 22, fontWeight: '800' },
  questionTitle: { color: '#f1f5f9', fontSize: 15, fontWeight: '700', textAlign: 'center', lineHeight: 22, marginBottom: 4 },
  questionNote: { color: '#475569', fontSize: 12, textAlign: 'center', fontStyle: 'italic', marginBottom: 8 },

  // Score row
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginTop: 8 },
  scoreLabel: { color: '#475569', fontSize: 10, fontWeight: '600', letterSpacing: 1 },
  scoreFound: { color: '#ffffff', fontSize: 40, fontWeight: '800', lineHeight: 44 },
  scoreTotal: { color: '#334155', fontSize: 22, fontWeight: '700' },
  timerWrap: { alignItems: 'center', justifyContent: 'center', width: 80, height: 80 },
  bonusText: { position: 'absolute', top: -8, right: -4, color: '#22c55e', fontSize: 18, fontWeight: '800', zIndex: 10 },
  timerCircle: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  timerNumber: { fontSize: 26, fontWeight: '800' },

  // Items
  itemsArea: { flex: 1, paddingHorizontal: 16 },
  itemsContent: { paddingVertical: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wrongSection: { borderTopWidth: 1, borderTopColor: '#0f172a', paddingTop: 12, marginTop: 8 },
  foundChip: { backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  foundChipText: { color: '#4ade80', fontSize: 12, fontWeight: '600' },
  revealChip: { backgroundColor: 'rgba(14,165,233,0.1)', borderWidth: 1, borderColor: 'rgba(14,165,233,0.2)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  revealChipText: { color: '#38bdf8', fontSize: 12, fontWeight: '600' },
  wrongChip: { backgroundColor: 'rgba(127,29,29,0.15)', borderWidth: 1, borderColor: 'rgba(153,27,27,0.25)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  wrongChipText: { color: 'rgba(239,68,68,0.7)', fontSize: 12, fontWeight: '500' },

  // Input area
  inputArea: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#020617' },
  suggestionsBox: { backgroundColor: '#1e293b', borderRadius: 14, borderWidth: 1, borderColor: '#334155', overflow: 'hidden', marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  suggestionItem: { paddingHorizontal: 16, paddingVertical: 14 },
  suggestionBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(51,65,85,0.6)' },
  suggestionText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '700', color: '#ffffff' },
  gameOverBox: { backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#1e293b', padding: 14 },
  statsBtn: { backgroundColor: '#1e293b', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  statsBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
});
