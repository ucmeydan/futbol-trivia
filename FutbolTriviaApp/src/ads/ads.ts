import { Platform } from 'react-native';

// Google's official TEST interstitial ad unit IDs — safe to ship while testing.
const TEST_INTERSTITIAL = {
  ios: 'ca-app-pub-3940256099942544/4411468910',
  android: 'ca-app-pub-3940256099942544/1033173712',
};

// TODO(release): create the "Futbol Trivia" app in the AdMob console, then paste
// its REAL interstitial ad unit IDs here AND the real iosAppId in app.json
// (react-native-google-mobile-ads plugin) before submitting to the App Store.
const PROD_INTERSTITIAL = {
  ios: TEST_INTERSTITIAL.ios, // TODO: real iOS interstitial unit id
  android: TEST_INTERSTITIAL.android, // TODO: real Android interstitial unit id
};

const ids = __DEV__ ? TEST_INTERSTITIAL : PROD_INTERSTITIAL;
export const INTERSTITIAL_UNIT_ID = Platform.OS === 'ios' ? ids.ios : ids.android;
