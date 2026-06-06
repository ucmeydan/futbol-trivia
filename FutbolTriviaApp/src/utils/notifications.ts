/**
 * Günlük Bildirim Yöneticisi
 *
 * Her gün saat 20:00'de "Bugünkü sorular seni bekliyor" bildirimi gönderir.
 * İzin zaten alınmışsa yeniden sormaz.
 * Uygulama her açılışta zamanlamayı taze tutar (eski schedule iptal → yeni schedule).
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const PERMISSION_KEY = 'notification_permission_asked';
const SCHEDULE_KEY = 'notification_scheduled_date';

// Bildirim gösterim davranışı: uygulama açıkken de banner çıksın
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * İzin iste (daha önce sorulmadıysa)
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      // Android 13+ için izin gerekli
      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Günlük Hatırlatma',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const already = await AsyncStorage.getItem(PERMISSION_KEY);
    if (already === 'denied') return false;

    const { status } = await Notifications.requestPermissionsAsync();
    await AsyncStorage.setItem(PERMISSION_KEY, status === 'granted' ? 'granted' : 'denied');
    return status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Günlük bildirimi zamanla (saat 20:00)
 * Her çağrıda eskisini iptal edip yenisini kurar.
 */
export async function scheduleDailyNotification(): Promise<void> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    // Aynı gün zaten zamanlandıysa tekrar kurma
    const today = new Date().toDateString();
    const lastScheduled = await AsyncStorage.getItem(SCHEDULE_KEY);
    if (lastScheduled === today) return;

    // Mevcut tüm bildirimleri iptal et
    await Notifications.cancelAllScheduledNotificationsAsync();

    const messages = [
      { title: '⚽ Futbol Trivia', body: 'Bugünkü sorular seni bekliyor!' },
      { title: '⚽ Futbol Trivia', body: 'Günlük futbol bilgi testi hazır — kaç doğru yaparsın?' },
      { title: '⚽ Futbol Trivia', body: 'Bugünkü Kariyer Yolu sorusunu çözdün mü?' },
      { title: '⚽ Futbol Trivia', body: 'Top 10\'u tamamlayabilir misin?' },
      { title: '⚽ Futbol Trivia', body: 'Seriyi kaybetme! Bugünkü sorular seni bekliyor.' },
    ];

    // Bugünkü gün sayısına göre mesaj seç (değişkenlik için)
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
    );
    const msg = messages[dayOfYear % messages.length];

    // Her gün saat 20:00'de tekrarlayan bildirim
    await Notifications.scheduleNotificationAsync({
      content: {
        title: msg.title,
        body: msg.body,
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'daily-reminder' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });

    await AsyncStorage.setItem(SCHEDULE_KEY, today);
  } catch {
    // Sessizce geç
  }
}

/**
 * Bildirimleri tamamen kapat
 */
export async function disableNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.setItem(PERMISSION_KEY, 'denied');
  } catch {
    // Sessizce geç
  }
}
