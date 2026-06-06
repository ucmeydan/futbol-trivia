import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Difficulty'>;

export default function DifficultyScreen({ route, navigation }: Props) {
  const { game, title, color } = route.params;
  const insets = useSafeAreaInsets();

  const handleSelect = (difficulty: 'kolay' | 'zor') => {
    navigation.navigate('Game', { game, difficulty });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={[styles.accent, { backgroundColor: color }]} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Zorluk seviyesi seç</Text>

        <TouchableOpacity
          style={[styles.card, styles.cardEasy]}
          activeOpacity={0.7}
          onPress={() => handleSelect('kolay')}
        >
          <Text style={styles.cardEmoji}>🟢</Text>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: '#22c55e' }]}>Kolay</Text>
            <Text style={styles.cardDesc}>"Futbolu ve Süper Lig'i severim ancak çok sıkı bir takipçi değilim" diyorsan bu seviye tam sana göre.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardHard]}
          activeOpacity={0.7}
          onPress={() => handleSelect('zor')}
        >
          <Text style={styles.cardEmoji}>🔴</Text>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: '#ef4444' }]}>Zor</Text>
            <Text style={styles.cardDesc}>"Ben Süper Lig gurmesiyim." diyorsan bu seviye tam sana göre.</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 32,
  },
  backText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accent: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 40,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 16,
  },
  cardEasy: {
    backgroundColor: '#0f172a',
    borderColor: '#22c55e30',
  },
  cardHard: {
    backgroundColor: '#0f172a',
    borderColor: '#ef444430',
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
});
