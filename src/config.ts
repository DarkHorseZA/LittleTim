// App-wide config.
//
// COACHING_URL: set this to your real booking link (Calendly, Cal.com, Acuity, etc.)
// when you're ready. While it's empty, the "Book a coaching session" button shows
// a friendly "coming soon" message instead of opening anything.
export const COACHING_URL = '';

export const APP_NAME = 'LittleTim';
export const APP_TAGLINE = 'Soul technologies, one small practice at a time';

export function hasCoachingUrl(): boolean {
  return COACHING_URL.trim().length > 0;
}
