import { INTERSTITIAL_UNIT_ID } from './ads';

// Very low ad frequency (single-player app): show an interstitial only when a
// game session ends, at most every Nth game AND never more than once per gap.
const SHOW_EVERY = 4; // at most every 4th finished game
const MIN_GAP_MS = 5 * 60 * 1000; // ...and never more often than once / 5 min

let gameCount = 0;
let lastShownAt = 0;
let initialized = false;

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
 * Call when the player leaves a game. Occasionally shows an interstitial; the
 * frequency caps above keep it rare and unobtrusive. Never blocks navigation.
 */
export async function maybeShowInterstitialOnGameEnd(): Promise<void> {
  gameCount++;
  if (gameCount % SHOW_EVERY !== 0) return;
  if (Date.now() - lastShownAt < MIN_GAP_MS) return;
  if (!(await ensureInit())) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ads = require('react-native-google-mobile-ads');
    const { InterstitialAd, AdEventType } = ads;
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID);

    await new Promise<void>((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      ad.addAdEventListener(AdEventType.LOADED, () => {
        lastShownAt = Date.now(); // start the cooldown from this display
        ad.show().catch(finish);
      });
      ad.addAdEventListener(AdEventType.CLOSED, finish);
      ad.addAdEventListener(AdEventType.ERROR, finish);
      setTimeout(finish, 12000); // safety: never hang
      ad.load();
    });
  } catch {
    // ignore — ads are best-effort
  }
}
