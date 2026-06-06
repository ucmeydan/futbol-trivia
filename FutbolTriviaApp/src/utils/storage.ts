/**
 * Güvenli AsyncStorage wrapper
 *
 * Tüm okuma/yazma operasyonları try/catch ile sarılıdır.
 * Depolama alanı dolduğunda veya veri bozulduğunda uygulama çökmez,
 * sessizce varsayılan değer döner.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  /** Değer oku — hata durumunda null döner */
  get: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  /** Değer yaz — hata durumunda sessizce geçer */
  set: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Depolama alanı dolu veya başka bir hata — sessizce geç
    }
  },

  /** Değer sil — hata durumunda sessizce geçer */
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Sessizce geç
    }
  },

  /** JSON parse ile oku — hata veya boş değer durumunda null döner */
  getJSON: async <T>(key: string): Promise<T | null> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  /** JSON olarak yaz — hata durumunda sessizce geçer */
  setJSON: async (key: string, value: unknown): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Sessizce geç
    }
  },
};
