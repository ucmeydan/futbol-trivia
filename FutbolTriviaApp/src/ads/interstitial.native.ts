import { INTERSTITIAL_UNIT_ID } from './ads';

// Very low ad frequency (single-player app): show an interstitial only when a
// game session ends, at most every Nth game AND never more than once per gap.
const SHOW_EVERY = 4; // at most every 4th finished game
const MIN_GAP_MS = 5 * 60 * 1000; // ...and never more often than once / 5 min

let gameCount = 0;
let lastShownAt = 0;
let initialized = false;
let pendingAd: any = null; // preloaded at game start, consumed at game end

async function ensureInit(): Promise<boolean> {
  if (initialized) return true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mobileAds = require('react-native-google-mobile-ads').default;
    await mobileAds().initialize();
    initialized = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * Oyun ekranı açılırken çağır — reklamı arka planda önceden yükler.
 * Oyun bitiminde reklam hazır olduğu için anında gösterilebilir.
 */
export async function preloadInterstitial(): Promise<void> {
  if (!(await ensureInit())) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { InterstitialAd, AdEventType } = require('react-native-google-mobile-ads');
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID);
    ad.addAdEventListener(AdEventType.LOADED, () => { pendingAd = ad; });
    ad.addAdEventListener(AdEventType.ERROR, () => {}); // sessizce geç
    ad.load();
  } catch {
    // ignore
  }
}

/**
 * Oyuncunun oyundan çıkışında çağır. Önceden yüklenmiş reklam varsa gösterir;
 * yoksa (ağ yoktu, frekans limiti) sessizce geçer. Navigasyonu bloklamaz.
 */
export async function maybeShowInterstitialOnGameEnd(): Promise<void> {
  gameCount++;
  if (gameCount % SHOW_EVERY !== 0) return;
  if (Date.now() - lastShownAt < MIN_GAP_MS) return;

  const ad = pendingAd;
  pendingAd = null; // tüket
  if (!ad) return;  // önyükleme başarısızsa reklamı atla

  try {
    await new Promise<void>((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { AdEventType } = require('react-native-google-mobile-ads');
      ad.addAdEventListener(AdEventType.CLOSED, finish);
      ad.addAdEventListener(AdEventType.ERROR, finish);
      setTimeout(finish, 12000); // safety: never hang
      lastShownAt = Date.now();
      ad.show().catch(finish);
    });
  } catch {
    // ignore — ads are best-effort
  }
}
