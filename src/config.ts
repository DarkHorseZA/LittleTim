// App-wide config.
//
// COACHING_URL: set this to your real booking link (Calendly, Cal.com, Acuity, etc.)
// when you're ready. While it's empty, the "Book a coaching session" button shows
// a friendly "coming soon" message instead of opening anything.
export const COACHING_URL = '';

export const APP_NAME = 're-Genesis';
export const APP_NAME_DISPLAY_CAPS = 'RE-GENESIS';
export const APP_TAGLINE = 'Unravel. Resew. Live.';

// Book & author attribution
export const BOOK_TITLE = 're-Genesis';
export const AUTHOR_NAME = 'Theunis Pienaar';
export const AUTHOR_SHORT = 'T';
export const ATTRIBUTION = `Companion to ${BOOK_TITLE} by ${AUTHOR_NAME}`;

export function hasCoachingUrl(): boolean {
  return COACHING_URL.trim().length > 0;
}
