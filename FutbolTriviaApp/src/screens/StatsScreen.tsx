import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Switch,
} from 'react-native';
import { storage } from '../utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { scheduleDailyNotification, disableNotifications } from '../utils/notifications';

// ─── Types ────────────────────────────────────────────────────────────────────
type Difficulty = 'kolay' | 'zor';

type GameStats = {
  label: string;
  color: string;
  emoji: string;
  kolay: { played: number; wins: number; extra: string };
  zor:   { played: number; wins: number; extra: string };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const pct = (wins: number, played: number) =>
  played === 0 ? '—' : `%${Math.round((wins / played) * 100)}`;

// ─── Component ───────────────────────────────────────────────────────────────
export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [games, setGames] = useState<GameStats[]>([]);
  const [totalPlayed, setTotalPlayed] = useState(0);
  const [totalWins, setTotalWins] = useState(0);

  const loadStats = useCallback(async () => {
    const [ltK, ltZ, t10K, t10Z, kyK, kyZ, taK, taZ] = await Promise.all([
      storage.get('listeyi_tamamla_kolay_stats'),
      storage.get('listeyi_tamamla_zor_stats'),
      storage.get('top10_kolay_stats_v2'),
      storage.get('top10_zor_stats_v2'),
      storage.get('kariyer_yolu_kolay_stats_v1'),
      storage.get('kariyer_yolu_zor_stats_v1'),
      storage.get('takim_arkadasi_kolay_stats_v2'),
      storage.get('takim_arkadasi_zor_stats_v2'),
    ]);

    const parse = (raw: string | null) => (raw ? JSON.parse(raw) : null);

    const ltKS  = parse(ltK);
    const ltZS  = parse(ltZ);
    const t10KS = parse(t10K);
    const t10ZS = parse(t10Z);
    const kyKS  = parse(kyK);
    const kyZS  = parse(kyZ);
    const taKS  = parse(taK);
    const taZS  = parse(taZ);

    const result: GameStats[] = [
      {
        label: 'Listeyi Tamamla',
        color: '#22c55e',
        emoji: '⏱',
        kolay: {
          played: ltKS?.totalGames ?? 0,
          wins:   ltKS?.wins ?? 0,
          extra:  ltKS ? `En iyi: %${ltKS.highestPercentage}` : '—',
        },
        zor: {
          played: ltZS?.totalGames ?? 0,
          wins:   ltZS?.wins ?? 0,
          extra:  ltZS ? `En iyi: %${ltZS.highestPercentage}` : '—',
        },
      },
      {
        label: 'Top 10',
        color: '#eab308',
        emoji: '🔟',
        kolay: {
          played: t10KS?.totalGames ?? 0,
          wins:   t10KS?.wins ?? 0,
          extra:  t10KS
            ? `Doğru: %${Math.round((t10KS.totalCorrect / ((t10KS.totalGames || 1) * 10)) * 100)}`
            : '—',
        },
        zor: {
          played: t10ZS?.totalGames ?? 0,
          wins:   t10ZS?.wins ?? 0,
          extra:  t10ZS
            ? `Doğru: %${Math.round((t10ZS.totalCorrect / ((t10ZS.totalGames || 1) * 10)) * 100)}`
            : '—',
        },
      },
      {
        label: 'Kariyer Yolu',
        color: '#3b82f6',
        emoji: '🗂',
        kolay: {
          played: kyKS?.totalGames ?? 0,
          wins:   kyKS?.wins ?? 0,
          extra:  kyKS ? `Kazanma: ${pct(kyKS.wins, kyKS.totalGames)}` : '—',
        },
        zor: {
          played: kyZS?.totalGames ?? 0,
          wins:   kyZS?.wins ?? 0,
          extra:  kyZS ? `Kazanma: ${pct(kyZS.wins, kyZS.totalGames)}` : '—',
        },
      },
      {
        label: 'Takım Arkadaşı',
        color: '#dc2626',
        emoji: '👥',
        kolay: {
          played: taKS?.totalGames ?? 0,
          wins:   taKS?.wins ?? 0,
          extra:  taKS ? `Kazanma: ${pct(taKS.wins, taKS.totalGames)}` : '—',
        },
        zor: {
          played: taZS?.totalGames ?? 0,
          wins:   taZS?.wins ?? 0,
          extra:  taZS ? `Kazanma: ${pct(taZS.wins, taZS.totalGames)}` : '—',
        },
      },
    ];

    setGames(result);

    const tp = result.reduce((acc, g) => acc + g.kolay.played + g.zor.played, 0);
    const tw = result.reduce((acc, g) => acc + g.kolay.wins   + g.zor.wins,   0);
    setTotalPlayed(tp);
    setTotalWins(tw);
  }, []);

  // Sekmeye her geçişte yenile + bildirim durumunu kontrol et
  const [notifEnabled, setNotifEnabled] = useState(false);

  useFocusEffect(useCallback(() => {
    loadStats();
    // Bildirim durumunu kontrol et
    Notifications.getPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') { setNotifEnabled(false); return; }
      Notifications.getAllScheduledNotificationsAsync().then(scheduled => {
        setNotifEnabled(scheduled.length > 0);
      });
    });
  }, [loadStats]));

  const handleNotifToggle = async (value: boolean) => {
    setNotifEnabled(value);
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') await scheduleDailyNotification();
      else setNotifEnabled(false);
    } else {
      await disableNotifications();
    }
  };

  const globalWinPct = totalPlayed === 0 ? 0 : Math.round((totalWins / totalPlayed) * 100);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* Başlık */}
        <View style={s.header}>
          <Text style={s.title}>İstatistikler</Text>
          <Text style={s.subtitle}>TÜM OYUNLAR</Text>
        </View>

        {/* Genel özet */}
        <View style={s.summaryCard}>
          <View style={s.summaryItem}>
            <Text style={s.summaryValue}>{totalPlayed}</Text>
            <Text style={s.summaryLabel}>Toplam Oyun</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryItem}>
            <Text style={[s.summaryValue, { color: '#22c55e' }]}>{totalWins}</Text>
            <Text style={s.summaryLabel}>Kazanılan</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryItem}>
            <Text style={[s.summaryValue, { color: '#dc2626' }]}>%{globalWinPct}</Text>
            <Text style={s.summaryLabel}>Kazanma Oranı</Text>
          </View>
        </View>

        {/* Oyun kartları */}
        {games.map((game) => (
          <View key={game.label} style={s.gameCard}>
            {/* Başlık */}
            <View style={s.gameCardHeader}>
              <View style={[s.gameAccent, { backgroundColor: game.color }]} />
              <Text style={s.gameEmoji}>{game.emoji}</Text>
              <Text style={s.gameLabel}>{game.label}</Text>
            </View>

            {/* Kolay / Zor satırları */}
            {(['kolay', 'zor'] as Difficulty[]).map((diff) => {
              const d = game[diff];
              return (
                <View key={diff} style={s.diffRow}>
                  <View style={s.diffBadgeWrap}>
                    <View style={[s.diffBadge, diff === 'kolay' ? s.diffBadgeEasy : s.diffBadgeHard]}>
                      <Text style={[s.diffBadgeText, { color: diff === 'kolay' ? '#22c55e' : '#ef4444' }]}>
                        {diff === 'kolay' ? 'Kolay' : 'Zor'}
                      </Text>
                    </View>
                  </View>

                  <View style={s.diffNumbers}>
                    {d.played === 0 ? (
                      <Text style={s.diffEmpty}>Henüz oynanmadı</Text>
                    ) : (
                      <>
                        <View style={s.diffStat}>
                          <Text style={s.diffStatValue}>{d.played}</Text>
                          <Text style={s.diffStatLabel}>Oyun</Text>
                        </View>
                        <View style={s.diffStat}>
                          <Text style={[s.diffStatValue, { color: '#22c55e' }]}>{d.wins}</Text>
                          <Text style={s.diffStatLabel}>Galibiyet</Text>
                        </View>
                        <View style={s.diffStat}>
                          <Text style={[s.diffStatValue, { color: game.color }]}>
                            {pct(d.wins, d.played)}
                          </Text>
                          <Text style={s.diffStatLabel}>Oran</Text>
                        </View>
                        <View style={s.diffStat}>
                          <Text style={s.diffExtra}>{d.extra}</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {totalPlayed === 0 && (
          <View style={s.emptyWrap}>
            <Text style={s.emptyEmoji}>⚽</Text>
            <Text style={s.emptyTitle}>Henüz oyun yok</Text>
            <Text style={s.emptyDesc}>Oynadıkça istatistiklerin burada görünecek.</Text>
          </View>
        )}

        {/* Bildirim ayarı */}
        <View style={s.notifCard}>
          <View style={s.notifLeft}>
            <Text style={s.notifTitle}>Günlük Hatırlatma</Text>
            <Text style={s.notifDesc}>Her gün 20:00'de bildirim al</Text>
          </View>
          <Switch
            value={notifEnabled}
            onValueChange={handleNotifToggle}
            trackColor={{ false: '#1e293b', true: '#dc2626' }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Uygulama bilgisi */}
        <View style={s.footer}>
          <Text style={s.footerTitle}>Futbol Trivia</Text>
          <Text style={s.footerVersion}>Sürüm 1.0.0</Text>
          <View style={s.footerLinks}>
            <TouchableOpacity onPress={() => Linking.openURL('https://futboltrivia.com.tr/gizlilik')}>
              <Text style={s.footerLink}>Gizlilik Politikası</Text>
            </TouchableOpacity>
            <Text style={s.footerDot}>·</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://futboltrivia.com.tr/iletisim')}>
              <Text style={s.footerLink}>İletişim</Text>
            </TouchableOpacity>
            <Text style={s.footerDot}>·</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://futboltrivia.com.tr')}>
              <Text style={s.footerLink}>Web Sitesi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#dc2626', fontSize: 11, fontWeight: '700', letterSpacing: 2 },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingVertical: 20,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: '#1e293b' },
  summaryValue: { color: '#ffffff', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  summaryLabel: { color: '#475569', fontSize: 10, fontWeight: '600', textAlign: 'center' },

  gameCard: {
    backgroundColor: '#0f172a',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  gameCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 10,
  },
  gameAccent: { width: 3, height: 20, borderRadius: 2 },
  gameEmoji: { fontSize: 16 },
  gameLabel: { color: '#ffffff', fontSize: 15, fontWeight: '700' },

  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
    gap: 12,
  },
  diffBadgeWrap: { width: 52 },
  diffBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  diffBadgeEasy: { backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)' },
  diffBadgeHard: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  diffBadgeText: { fontSize: 10, fontWeight: '700' },

  diffNumbers: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 },
  diffEmpty: { color: '#334155', fontSize: 12 },
  diffStat: { alignItems: 'center' },
  diffStatValue: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  diffStatLabel: { color: '#475569', fontSize: 9, fontWeight: '600', marginTop: 2 },
  diffExtra: { color: '#475569', fontSize: 11 },

  emptyWrap: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyDesc: { color: '#475569', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  notifCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', padding: 16, marginHorizontal: 16, marginTop: 8 },
  notifLeft: { flex: 1, marginRight: 12 },
  notifTitle: { color: '#ffffff', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  notifDesc: { color: '#475569', fontSize: 12 },
  footer: { alignItems: 'center', marginTop: 20, marginBottom: 8, paddingHorizontal: 20 },
  footerTitle: { color: '#1e293b', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  footerVersion: { color: '#1e293b', fontSize: 11, marginBottom: 12 },
  footerLinks: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  footerLink: { color: '#334155', fontSize: 11, textDecorationLine: 'underline' },
  footerDot: { color: '#1e293b', fontSize: 11 },
});
