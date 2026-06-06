import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEffect } from 'react';
import DifficultyScreen from './src/screens/DifficultyScreen';
import GameScreen from './src/screens/GameScreen';
import StatsScreen from './src/screens/StatsScreen';
import type { RootStackParamList } from './src/types/navigation';
import { syncQuestionsInBackground } from './src/utils/questionSync';
import { requestNotificationPermission, scheduleDailyNotification } from './src/utils/notifications';
import ErrorBoundary from './src/components/ErrorBoundary';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const GAMES = [
  { key: 'listeyi-tamamla', title: 'Listeyi Tamamla', desc: '90 saniyede listeyi tamamla. Her doğru cevap +5 saniye.', color: '#22c55e' },
  { key: 'top10',           title: 'Top 10',           desc: 'Belirli bir kategoriye ait 10 ismi bul. 3 yanlış hakkın var.', color: '#eab308' },
  { key: 'kariyer-yolu',    title: 'Kariyer Yolu',     desc: 'Kariyer tablosundan futbolcuyu tahmin et.', color: '#3b82f6' },
  { key: 'takim-arkadasi',  title: 'Takım Arkadaşı',  desc: '7 tahmin hakkınla gizlenen futbolcuyu bul.', color: '#dc2626' },
];

function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
          <Text style={styles.headerTitle}>Futbol Trivia</Text>
          <Text style={styles.headerSub}>SÜPER LİG ÖZEL</Text>
          <Text style={styles.headerDesc}>Her gün yenilenen sorularla futbol bilgini test et.</Text>
        </View>

        {GAMES.map((game) => (
          <TouchableOpacity
            key={game.key}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('Difficulty', {
                game: game.key,
                title: game.title,
                color: game.color,
              })
            }
          >
            <View style={{ width: 4, backgroundColor: game.color, borderRadius: 2 }} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{game.title}</Text>
              <Text style={styles.cardDesc}>{game.desc}</Text>
              <Text style={[styles.cardPlay, { color: game.color }]}>HEMEN OYNA</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Tab icon bileşeni (emoji) ─────────────────────────────────────────────
function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#dc2626',
        tabBarInactiveTintColor: '#475569',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
      }}
    >
      <Tab.Screen
        name="Oyunlar"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚽" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="İstatistik"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // Arka planda soru verilerini güncelle — UI'ı bloklamaz
    syncQuestionsInBackground();

    // Bildirim izni al ve günlük 20:00 bildirimini zamanla
    requestNotificationPermission().then(granted => {
      if (granted) scheduleDailyNotification();
    });
  }, []);

  // Deep link URL → navigation state eşlemesi
  const linking = {
    prefixes: ['futboltrivia://', 'https://futboltrivia.com.tr'],
    config: {
      screens: {
        Home: '',
        Difficulty: {
          path: ':game',
          parse: { game: (g: string) => g },
        },
        Game: {
          path: ':game/:difficulty',
          parse: {
            game: (g: string) => g,
            difficulty: (d: string) => d as 'kolay' | 'zor',
          },
        },
      },
    },
  };

  return (
    <ErrorBoundary>
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeTabs} />
          <Stack.Screen name="Difficulty" component={DifficultyScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#ffffff' },
  headerSub: { fontSize: 12, color: '#dc2626', marginTop: 6, fontWeight: '600', letterSpacing: 2 },
  headerDesc: { fontSize: 14, color: '#94a3b8', marginTop: 8, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  cardContent: { flex: 1, padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#94a3b8', lineHeight: 18, marginBottom: 10 },
  cardPlay: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
});
