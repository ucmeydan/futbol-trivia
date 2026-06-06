export type RootStackParamList = {
  Home: undefined;
  Difficulty: { game: string; title: string; color: string };
  Game: { game: string; difficulty: 'kolay' | 'zor' };
};
