import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

import ListeyiTamamla from '../games/ListeyiTamamla';
import Top10 from '../games/Top10';
import KariyerYolu from '../games/KariyerYolu';
import TakimArkadasi from '../games/TakimArkadasi';

import { View, Text, StyleSheet } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen({ route, navigation }: Props) {
  const { game, difficulty } = route.params;

  if (game === 'listeyi-tamamla') return <ListeyiTamamla difficulty={difficulty} navigation={navigation} />;
  if (game === 'top10') return <Top10 difficulty={difficulty} navigation={navigation} />;
  if (game === 'kariyer-yolu') return <KariyerYolu difficulty={difficulty} navigation={navigation} />;
  if (game === 'takim-arkadasi') return <TakimArkadasi difficulty={difficulty} navigation={navigation} />;

  return (
    <View style={s.container}>
      <Text style={s.text}>Bilinmeyen oyun: {game}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#475569', fontSize: 14 },
});
