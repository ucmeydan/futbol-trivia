import { AppState } from 'react-native';

// Request App Tracking Transparency exactly once per launch. Must run early
// (on app start), NOT only inside an ad flow, so the prompt is discoverable on
// a fresh install — required by App Review Guideline 2.1.

let requested = false;

/**
 * Show the ATT permission prompt once, as soon as the app is active. iOS only
 * presents the dialog while the app is in the `active` state, so on a cold
 * launch we wait for that state before asking. Safe no-op on web / when the
 * native module or an older OS makes it unavailable.
 */
export async function ensureTrackingPermission(): Promise<void> {
  if (requested) return;
  requested = true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const att = require('expo-tracking-transparency');

    const { status } = await att.getTrackingPermissionsAsync();
    if (status !== 'undetermined') return; // already decided — don't re-ask

    if (AppState.currentState !== 'active') {
      await new Promise<void>((resolve) => {
        const sub = AppState.addEventListener('change', (s) => {
          if (s === 'active') {
            sub.remove();
            resolve();
          }
        });
      });
    }

    await att.requestTrackingPermissionsAsync();
  } catch {
    requested = false; // module not ready yet — allow a later retry
  }
}
