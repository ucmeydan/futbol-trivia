import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Share, Modal, Keyboard, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { storage } from '../utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import LoadingScreen from '../components/LoadingScreen';

import playersData from '../data/players.json';
import kolayQuestions from '../data/questions-takim-arkadasi-kolay.json';
import zorQuestions from '../data/questions-takim-arkadasi-zor.json';

const allQuestions = [...(kolayQuestions as any[]), ...(zorQuestions as any[])];

const formatName = (name: string) => {
  if (!name) return '';
  return name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const normalizeText = (text: string) => {
  if (!text) return '';
  return text.trim()
    .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const MAX_ATTEMPTS = 7;
const MAX_TEAMMATES = 5;

type Stats = {
  totalGames: number;
  wins: number;
  distribution: Record<number, number>;
};
type Props = { difficulty: 'kolay' | 'zor'; navigation: any };

const defaultStats = (): Stats => ({
  totalGames: 0, wins: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
});

export default function TakimArkadasi({ difficulty, navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showError, setShowError] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [stats, setStats] = useState<Stats>(defaultStats());
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // ─── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const d = new Date();
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const filtered = allQuestions.filter((q: any) =>
        q.game === 'takim-arkadasi' && q.activeDate <= dateStr && q.difficulty === difficulty
      );
      setGameQuestions(filtered);
      await Promise.all([
        filtered.length > 0 ? loadQuestion(filtered.length - 1, filtered) : Promise.resolve(),
        storage.get(`takim_arkadasi_${difficulty}_stats_v2`).then(raw => { try { if (raw) setStats(JSON.parse(raw)); } catch { /* bozuk veri */ } }),
      ]);
      setIsLoading(false);
    })();
  }, []);

  // ─── Suggestions ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const norm = normalizeText(query);
    const filtered = Array.from(new Set(playersData as string[]))
      .filter(p => normalizeText(p).includes(norm))
      .slice(0, 5);
    setSuggestions(filtered);
  }, [query]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const loadQuestion = async (index: number, ql: any[]) => {
    if (index < 0 || index >= ql.length) return;
    const q = ql[index];
    setCurrentIndex(index);
    setQuery('');
    setSuggestions([]);
    const saved = await storage.get(`takim_arkadasi_${difficulty}_session_${q.activeDate}`);
    if (saved) {
      const data = JSON.parse(saved);
      setAttempts(data.attempts ?? 1);
      setIsWin(data.isWin ?? false);
      setIsGameOver(true);
    } else {
      setAttempts(1);
      setIsWin(false);
      setIsGameOver(false);
    }
  };

  const currentQ = gameQuestions[currentIndex];

  const getTeammateName = (t: any) => (typeof t === 'string' ? t : t.name || '');
  const getTeammateInfo = (t: any) => (typeof t === 'object' && t.info ? t.info : '');

  const updateStats = async (won: boolean, attemptCount: number) => {
    if (!currentQ) return;
    const existing = await storage.get(`takim_arkadasi_${difficulty}_session_${currentQ.activeDate}`);
    if (existing) return;

    const raw = await storage.get(`takim_arkadasi_${difficulty}_stats_v2`);
    const base: Stats = raw ? JSON.parse(raw) : defaultStats();
    const newStats: Stats = { ...base, distribution: { ...base.distribution } };
    newStats.totalGames += 1;
    if (won && attemptCount >= 1 && attemptCount <= 7) {
      newStats.wins += 1;
      newStats.distribution[attemptCount] = (newStats.distribution[attemptCount] ?? 0) + 1;
    }
    await storage.set(`takim_arkadasi_${difficulty}_session_${currentQ.activeDate}`,
      JSON.stringify({ attempts: won ? attemptCount : MAX_ATTEMPTS, isWin: won }));
    await storage.set(`takim_arkadasi_${difficulty}_stats_v2`, JSON.stringify(newStats));
    setStats(newStats);
  };

  const handleGuess = (guess: string) => {
    if (isGameOver || !currentQ) return;
    const norm = normalizeText(guess);
    const correct = normalizeText(currentQ.correctPlayer);

    if (norm === correct) {
      setIsWin(true);
      setIsGameOver(true);
      setShowConfetti(true);
      updateStats(true, attempts);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setShowStatsModal(true), 1500);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setShowError(true);
      setTimeout(() => setShowError(false), 800);
      if (attempts < MAX_ATTEMPTS) {
        setAttempts(prev => prev + 1);
      } else {
        setIsGameOver(true);
        updateStats(false, 0);
        setTimeout(() => setShowStatsModal(true), 1500);
      }
    }
    setQuery('');
    setSuggestions([]);
  };

  const handleShare = async () => {
    if (!currentQ) return;
    const preview = currentQ.teammates.slice(0, 3).map((t: any) => getTeammateName(t)).join(' · ');
    let scoreText: string;
    if (isWin) {
      const boxes = Array(attempts).fill('⬛');
      boxes[attempts - 1] = '🟩';
      scoreText = `${boxes.join('')}  ${attempts}. denemede buldum!`;
    } else {
      scoreText = 'Maalesef bilemedim.';
    }
    const text = [
      `⚽ FutbolTrivia — Takım Arkadaşı #${currentQ.id}`,
      '', `👥 ${preview}...`, '', scoreText, '',
      'Bugün sen de dene 👇', 'futboltrivia.com.tr/takim-arkadasi',
    ].join('\n');
    await Share.share({ message: text });
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

  const winPct = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
  const maxDist = Math.max(...Object.values(stats.distribution), 1);
  const visibleCount = Math.min(attempts, MAX_TEAMMATES);
  const remaining = MAX_ATTEMPTS - attempts + 1;

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
          <View style={s.modalCard}>
            <TouchableOpacity style={s.modalCloseBtn} onPress={() => setShowStatsModal(false)}>
              <Text style={s.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>İstatistikler</Text>

            <View style={s.statsRow}>
              <View style={s.statBox}>
                <Text style={s.statValueWhite}>{stats.totalGames}</Text>
                <Text style={s.statLabel}>Oynanan oyun</Text>
              </View>
              <View style={[s.statBox, s.statBoxBorder]}>
                <Text style={[s.statValueWhite, { color: '#dc2626' }]}>{winPct}%</Text>
                <Text style={s.statLabel}>Galibiyet</Text>
              </View>
              <View style={s.statBox}>
                <Text style={[s.statValueWhite, { color: '#4ade80' }]}>{stats.wins}</Text>
                <Text style={s.statLabel}>Kazanılan</Text>
              </View>
            </View>

            <Text style={s.distTitle}>Tahmin dağılımı</Text>
            <View style={{ gap: 8, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5, 6, 7].map(num => {
                const count = stats.distribution[num] || 0;
                return (
                  <View key={num} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={s.distLabel}>{num}</Text>
                    <View style={s.distBg}>
                      <View style={[s.distBar, { width: `${(count / maxDist) * 100 || 5}%` }, isWin && num === attempts && { backgroundColor: '#dc2626' }]}>
                        <Text style={s.distCount}>{count}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
              <Text style={s.shareBtnText}>Skoru Paylaş</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.closeBtn} onPress={() => setShowStatsModal(false)}>
              <Text style={s.closeBtnText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Top bar */}
      <View style={[s.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Geri Dön</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <TouchableOpacity
            style={[s.navBtn, currentIndex === 0 && s.navBtnDisabled]}
            onPress={() => loadQuestion(currentIndex - 1, gameQuestions)}
            disabled={currentIndex === 0}
          >
            <Text style={s.navBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.questionId}>#{currentQ.id}</Text>
          <TouchableOpacity
            style={[s.navBtn, currentIndex === gameQuestions.length - 1 && s.navBtnDisabled]}
            onPress={() => loadQuestion(currentIndex + 1, gameQuestions)}
            disabled={currentIndex === gameQuestions.length - 1}
          >
            <Text style={s.navBtnText}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* Player reveal box */}
      <View style={[s.revealBox, isGameOver && (isWin ? s.revealBoxWin : s.revealBoxLose)]}>
        <Text style={[s.revealText, isGameOver && s.revealTextVisible]}>
          {isGameOver ? currentQ.correctPlayer : '?'}
        </Text>
      </View>
      <Text style={s.prompt}>Bu 5 futbolcuyla aynı takımda oynamış olan oyuncu kim?</Text>

      {/* Error overlay */}
      {showError && (
        <View style={s.errorOverlay} pointerEvents="none">
          <Text style={s.errorX}>✕</Text>
        </View>
      )}

      {/* Teammates */}
      <View style={{ flex: 1, paddingHorizontal: 16, gap: 8, marginBottom: 8 }}>
        {currentQ.teammates.map((teammate: any, i: number) => {
          const name = getTeammateName(teammate);
          const info = getTeammateInfo(teammate);
          const opened = i < visibleCount || isGameOver;
          return (
            <View key={i} style={[s.teammateCard, opened ? s.teammateCardOpen : s.teammateCardClosed]}>
              {opened ? (
                <>
                  <View style={s.teammateBadge}>
                    <Text style={s.teammateBadgeText}>{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.teammateName}>{formatName(name)}</Text>
                    {isGameOver && info ? <Text style={s.teammateInfo}>{info}</Text> : null}
                  </View>
                </>
              ) : (
                <Text style={s.teammateClosed}>{i + 1}</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Attempt dots */}
      {!isGameOver && (
        <View style={s.dotsRow}>
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <View key={i} style={[s.dot,
              i < attempts - 1 ? s.dotUsed : i === attempts - 1 ? s.dotActive : s.dotEmpty,
            ]} />
          ))}
        </View>
      )}

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
              style={s.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Futbolcu ismini yazın..."
              placeholderTextColor="#475569"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <View style={s.pasRow}>
              <Text style={s.remainingText}>{remaining} tahmin hakkın kaldı</Text>
              <TouchableOpacity onPress={() => handleGuess('pas')}>
                <Text style={s.pasText}>Pas Geç</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={s.gameOverBox}>
            <View style={s.resultRow}>
              <View>
                <Text style={[s.resultVerdict, { color: isWin ? '#4ade80' : '#f87171' }]}>
                  {isWin ? 'Tebrikler!' : 'Maalesef!'}
                </Text>
                <Text style={s.resultPlayer}>{formatName(currentQ.correctPlayer)}</Text>
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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.92)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: '#0f172a', borderRadius: 28, padding: 28, borderWidth: 2, borderColor: '#1e293b' },
  modalCloseBtn: { position: 'absolute', top: 20, right: 20, zIndex: 1 },
  modalCloseText: { color: '#475569', fontSize: 18 },
  modalTitle: { color: '#ffffff', fontSize: 17, fontWeight: '700', textAlign: 'center', fontStyle: 'italic', marginBottom: 24 },
  statsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b', marginBottom: 20, paddingBottom: 20 },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#1e293b' },
  statValueWhite: { color: '#ffffff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: '#475569', fontSize: 9, fontWeight: '700', textAlign: 'center' },
  distTitle: { color: '#475569', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  distLabel: { color: '#475569', fontSize: 11, fontWeight: '700', width: 16, textAlign: 'right' },
  distBg: { flex: 1, backgroundColor: '#020617', height: 20, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  distBar: { height: '100%', backgroundColor: '#334155', borderRadius: 12, justifyContent: 'center', paddingHorizontal: 8, minWidth: '5%' },
  distCount: { color: '#ffffff', fontSize: 10, fontWeight: '700' },
  shareBtn: { backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  shareBtnText: { color: '#000000', fontSize: 14, fontWeight: '700' },
  closeBtn: { backgroundColor: '#1e293b', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  closeBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backText: { color: '#475569', fontSize: 13, fontWeight: '700' },
  navBtn: { width: 36, height: 36, backgroundColor: '#1e293b', borderRadius: 10, borderWidth: 1, borderColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  navBtnDisabled: { opacity: 0.25 },
  navBtnText: { color: '#cbd5e1', fontSize: 20, fontWeight: '700', lineHeight: 24 },
  questionId: { color: '#dc2626', fontSize: 22, fontWeight: '800' },

  revealBox: { marginHorizontal: 16, height: 72, borderRadius: 16, borderWidth: 2, borderColor: '#1e293b', backgroundColor: 'rgba(15,23,42,0.5)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  revealBoxWin: { borderColor: '#22c55e', backgroundColor: '#16a34a' },
  revealBoxLose: { borderColor: '#dc2626', backgroundColor: '#dc2626' },
  revealText: { color: '#334155', fontSize: 36, fontWeight: '800' },
  revealTextVisible: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  prompt: { color: '#94a3b8', fontSize: 13, textAlign: 'center', paddingHorizontal: 24, marginBottom: 16, lineHeight: 20 },

  errorOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  errorX: { color: '#dc2626', fontSize: 96, fontWeight: '900', opacity: 0.8 },

  teammateCard: { borderRadius: 14, borderWidth: 1 },
  teammateCardOpen: { flexDirection: 'row', alignItems: 'center', borderColor: 'rgba(51,65,85,0.8)', backgroundColor: '#0f172a', paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  teammateCardClosed: { height: 44, justifyContent: 'center', alignItems: 'center', borderColor: '#0f172a', backgroundColor: 'rgba(2,6,23,0.6)' },
  teammateBadge: { width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(220,38,38,0.1)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.2)', justifyContent: 'center', alignItems: 'center' },
  teammateBadgeText: { color: '#dc2626', fontSize: 10, fontWeight: '700' },
  teammateName: { color: '#f1f5f9', fontSize: 13, fontWeight: '700' },
  teammateInfo: { color: '#475569', fontSize: 11, marginTop: 2 },
  teammateClosed: { color: '#1e293b', fontSize: 13, fontWeight: '700' },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotUsed: { backgroundColor: '#7f1d1d' },
  dotActive: { backgroundColor: '#dc2626' },
  dotEmpty: { backgroundColor: '#334155' },

  inputArea: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#020617' },
  suggestionsBox: { backgroundColor: '#1e293b', borderRadius: 16, borderWidth: 1, borderColor: '#334155', overflow: 'hidden', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  suggestionItem: { paddingHorizontal: 16, paddingVertical: 16 },
  suggestionBorder: { borderBottomWidth: 1, borderBottomColor: '#334155' },
  suggestionText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '700', color: '#ffffff' },
  pasRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingHorizontal: 4 },
  remainingText: { color: '#475569', fontSize: 11 },
  pasText: { color: '#fbbf24', fontSize: 12, fontWeight: '700', textDecorationLine: 'underline', letterSpacing: 1 },
  gameOverBox: { backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#1e293b', padding: 14 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2,6,23,0.5)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#1e293b', marginBottom: 10 },
  resultVerdict: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  resultPlayer: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  statsBtn: { backgroundColor: '#1e293b', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  statsBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
});
