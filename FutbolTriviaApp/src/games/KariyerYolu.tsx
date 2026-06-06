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
import kolayQuestions from '../data/questions-kariyer-yolu-kolay.json';
import zorQuestions from '../data/questions-kariyer-yolu-zor.json';

const allQuestions = [...(kolayQuestions as any[]), ...(zorQuestions as any[])];

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const normalizeText = (text: string) => {
  if (!text) return '';
  return text.trim()
    .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

type DistKey = '1' | '2' | '3' | '4' | '5' | '6' | '7+';
type Stats = { totalGames: number; wins: number; distribution: Record<DistKey, number> };
type Props = { difficulty: 'kolay' | 'zor'; navigation: any };

const defaultStats = (): Stats => ({
  totalGames: 0, wins: 0,
  distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7+': 0 },
});

export default function KariyerYolu({ difficulty, navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [visibleRows, setVisibleRows] = useState(1);
  const [finalAttempt, setFinalAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [isError, setIsError] = useState(false);
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
        q.game === 'kariyer-yolu' && q.activeDate <= dateStr && q.difficulty === difficulty
      );
      setGameQuestions(filtered);
      await Promise.all([
        filtered.length > 0 ? loadQuestion(filtered.length - 1, filtered) : Promise.resolve(),
        storage.get(`kariyer_yolu_${difficulty}_stats_v1`).then(raw => { try { if (raw) setStats(JSON.parse(raw)); } catch { /* bozuk veri */ } }),
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
    const session = await storage.get(`kariyer_yolu_${difficulty}_session_${q.activeDate}`);
    if (session) {
      const data = JSON.parse(session);
      setVisibleRows(data.visibleRows || q.career.length);
      setIsGameOver(true);
      setIsWin(data.isWin || false);
      setFinalAttempt(data.finalAttempt || 0);
    } else {
      setVisibleRows(1);
      setIsGameOver(false);
      setIsWin(false);
      setFinalAttempt(0);
    }
    setQuery('');
    setSuggestions([]);
  };

  const currentQ = gameQuestions[currentIndex];

  const updateStats = async (win: boolean, attempt: number) => {
    if (!currentQ) return;
    const raw = await storage.get(`kariyer_yolu_${difficulty}_stats_v1`);
    const base: Stats = raw ? JSON.parse(raw) : defaultStats();
    const newStats = { ...base, distribution: { ...base.distribution } };
    newStats.totalGames += 1;
    if (win) {
      newStats.wins += 1;
      const key: DistKey = attempt >= 7 ? '7+' : String(attempt) as DistKey;
      newStats.distribution[key] = (newStats.distribution[key] || 0) + 1;
    }
    setStats(newStats);
    await storage.set(`kariyer_yolu_${difficulty}_stats_v1`, JSON.stringify(newStats));
    await storage.set(`kariyer_yolu_${difficulty}_session_${currentQ.activeDate}`,
      JSON.stringify({ visibleRows: win ? attempt : currentQ.career.length, isWin: win, finalAttempt: win ? attempt : 0 }));
  };

  const handleGuess = (guess: string) => {
    if (isGameOver || !currentQ) return;
    const norm = normalizeText(guess);
    const correct = normalizeText(currentQ.correctPlayer);

    if (norm === correct) {
      setFinalAttempt(visibleRows);
      setIsWin(true);
      setIsGameOver(true);
      setShowConfetti(true);
      setVisibleRows(currentQ.career.length);
      updateStats(true, visibleRows);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setShowStatsModal(true), 1500);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      if (visibleRows < currentQ.career.length) {
        setVisibleRows(prev => prev + 1);
      } else {
        setIsGameOver(true);
        setIsWin(false);
        setFinalAttempt(0);
        updateStats(false, 0);
        setTimeout(() => setShowStatsModal(true), 1500);
      }
    }
    setQuery('');
    setSuggestions([]);
  };

  const handleShare = async () => {
    if (!currentQ) return;
    let scoreText: string;
    if (isWin) {
      const boxes = Array(finalAttempt).fill('⬛');
      boxes[finalAttempt - 1] = '🟩';
      scoreText = `${boxes.join('')}  ${finalAttempt}. denemede buldum!`;
    } else {
      scoreText = 'Maalesef bilemedim.';
    }
    const text = [
      `⚽ FutbolTrivia — Kariyer Yolu #${currentQ.id}`,
      '', scoreText, '',
      'Bugün sen de dene 👇',
      'futboltrivia.com.tr/kariyer-yolu',
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
  const distKeys: DistKey[] = ['1', '2', '3', '4', '5', '6', '7+'];

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
            <Text style={s.modalTitle}>İstatistik</Text>

            <View style={s.statsRow}>
              <View style={s.statBox}>
                <Text style={s.statValueWhite}>{stats.totalGames}</Text>
                <Text style={s.statLabel}>Oynanan oyun</Text>
              </View>
              <View style={[s.statBox, s.statBoxBorder]}>
                <Text style={[s.statValueWhite, { color: '#4ade80' }]}>{winPct}%</Text>
                <Text style={s.statLabel}>Kazanma yüzdesi</Text>
              </View>
              <View style={s.statBox}>
                <Text style={[s.statValueWhite, { color: '#38bdf8' }]}>{stats.wins}</Text>
                <Text style={s.statLabel}>Toplam galibiyet</Text>
              </View>
            </View>

            <View style={{ gap: 6, marginBottom: 16 }}>
              {distKeys.map(key => {
                const count = stats.distribution[key] || 0;
                const isActive = isWin && (key === String(finalAttempt) || (key === '7+' && finalAttempt >= 7));
                return (
                  <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={s.distLabel}>{key}</Text>
                    <View style={s.distBg}>
                      <View style={[s.distBar, { width: `${(count / maxDist) * 100 || 5}%` }, isActive && { backgroundColor: '#dc2626' }]}>
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
      </View>

      {/* Question nav */}
      <View style={s.questionNav}>
        <TouchableOpacity
          style={[s.navBtn, currentIndex <= 0 && s.navBtnDisabled]}
          onPress={() => loadQuestion(currentIndex - 1, gameQuestions)}
          disabled={currentIndex <= 0}
        >
          <Text style={s.navBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.questionId}>#{currentQ.id}</Text>
        <TouchableOpacity
          style={[s.navBtn, currentIndex >= gameQuestions.length - 1 && s.navBtnDisabled]}
          onPress={() => loadQuestion(currentIndex + 1, gameQuestions)}
          disabled={currentIndex >= gameQuestions.length - 1}
        >
          <Text style={s.navBtnText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Career table */}
      <View style={s.tableWrap}>
        {/* Header */}
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderCell, { flex: 2 }]}>SEZON</Text>
          <Text style={[s.tableHeaderCell, { flex: 4 }]}>TAKIM</Text>
          <Text style={[s.tableHeaderCell, { flex: 1.5, textAlign: 'center' }]}>MAÇ</Text>
          <Text style={[s.tableHeaderCell, { flex: 1.5, textAlign: 'center' }]}>GOL</Text>
        </View>
        <ScrollView style={s.tableBody} keyboardDismissMode="on-drag">
          {currentQ.career.map((step: any, i: number) => {
            const visible = i < visibleRows;
            return (
              <View key={i} style={[s.tableRow, i % 2 !== 0 && s.tableRowAlt]}>
                <Text style={[s.tableCellMono, { flex: 2 }]}>{visible ? step.season : '····'}</Text>
                <Text style={[s.tableCellBold, { flex: 4 }]}>{visible ? step.team : '····'}</Text>
                <Text style={[s.tableCellMono, { flex: 1.5, textAlign: 'center' }]}>{visible ? step.apps : '··'}</Text>
                <Text style={[s.tableCellMono, { flex: 1.5, textAlign: 'center' }]}>{visible ? `(${step.goals})` : '(··)'}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

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
                    <Text style={s.suggestionText}>{toTitleCase(sug)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              style={[s.input, isError && s.inputError]}
              value={query}
              onChangeText={setQuery}
              placeholder="Futbolcu ara..."
              placeholderTextColor="#475569"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <View style={s.pasRow}>
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
                <Text style={s.resultPlayer}>{toTitleCase(currentQ.correctPlayer)}</Text>
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
  modalCard: { width: '100%', backgroundColor: '#0f172a', borderRadius: 24, padding: 24, borderWidth: 2, borderColor: '#1e293b' },
  modalCloseBtn: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
  modalCloseText: { color: '#475569', fontSize: 18 },
  modalTitle: { color: '#ffffff', fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  statsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b', marginBottom: 16, paddingBottom: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#1e293b' },
  statValueWhite: { color: '#ffffff', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  statLabel: { color: '#475569', fontSize: 9, fontWeight: '600', textAlign: 'center' },
  distLabel: { color: '#475569', fontSize: 10, fontWeight: '700', width: 20, textAlign: 'right' },
  distBg: { flex: 1, backgroundColor: 'rgba(2,6,23,0.5)', height: 20, borderRadius: 4, overflow: 'hidden' },
  distBar: { height: '100%', backgroundColor: '#475569', borderRadius: 4, justifyContent: 'center', paddingHorizontal: 6, minWidth: '5%' },
  distCount: { color: '#ffffff', fontSize: 9, fontWeight: '700' },
  shareBtn: { backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  shareBtnText: { color: '#000000', fontSize: 14, fontWeight: '700' },
  closeBtn: { backgroundColor: '#1e293b', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  closeBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },

  topBar: { paddingHorizontal: 16, paddingBottom: 8 },
  backText: { color: '#475569', fontSize: 13, fontWeight: '700' },
  questionNav: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 16, paddingHorizontal: 16 },
  navBtn: { width: 36, height: 36, backgroundColor: '#1e293b', borderRadius: 10, borderWidth: 1, borderColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  navBtnDisabled: { opacity: 0.25 },
  navBtnText: { color: '#cbd5e1', fontSize: 20, fontWeight: '700', lineHeight: 24 },
  questionId: { color: '#dc2626', fontSize: 22, fontWeight: '800' },

  tableWrap: { flex: 1, marginHorizontal: 16, backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 20, borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden', marginBottom: 8 },
  tableHeader: { flexDirection: 'row', backgroundColor: 'rgba(30,41,59,0.5)', paddingHorizontal: 12, paddingVertical: 10 },
  tableHeaderCell: { color: '#64748b', fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  tableBody: { flex: 1 },
  tableRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(30,41,59,0.4)' },
  tableRowAlt: { backgroundColor: 'rgba(15,23,42,0.3)' },
  tableCellMono: { color: '#94a3b8', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  tableCellBold: { color: '#f1f5f9', fontSize: 13, fontWeight: '600' },

  inputArea: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#020617' },
  suggestionsBox: { backgroundColor: '#1e293b', borderRadius: 14, borderWidth: 1, borderColor: '#334155', overflow: 'hidden', marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  suggestionItem: { paddingHorizontal: 16, paddingVertical: 14 },
  suggestionBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(51,65,85,0.6)' },
  suggestionText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '700', color: '#ffffff' },
  inputError: { borderColor: '#dc2626' },
  pasRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, paddingRight: 4 },
  pasText: { color: '#fbbf24', fontSize: 12, fontWeight: '700', textDecorationLine: 'underline', letterSpacing: 1 },
  gameOverBox: { backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#1e293b', padding: 14 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2,6,23,0.5)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#1e293b', marginBottom: 10 },
  resultVerdict: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  resultPlayer: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  statsBtn: { backgroundColor: '#1e293b', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  statsBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
});
