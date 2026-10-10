import type { Settings } from './store/storage';

// The canonical first-run cascade, onboarding BEFORE the account ask. Welcome
// resumes from here on every launch, so a reader who closed the app mid-flow
// picks up at the right step, and a fully set-up reader goes straight to Tabs.
//
// The in-session skip-to-tour nicety (tour before account) is threaded through
// explicit navigation params in the screens; this cascade is the stable
// fallback order and never forces the tour (it is offered, and always
// re-takeable from More).
export type FirstRunRoute = 'HowToUse' | 'EmailSignup' | 'Tracker' | 'Tabs';

export function firstRunRoute(
  s: Pick<Settings, 'hasSeenHowTo' | 'registeredEmail' | 'lastCheckInDate'>
): FirstRunRoute {
  if (!s.hasSeenHowTo) return 'HowToUse'; // value before the email ask
  if (!s.registeredEmail) return 'EmailSignup'; // account, after onboarding
  if (!s.lastCheckInDate) return 'Tracker'; // first gentle baseline
  return 'Tabs';
}
