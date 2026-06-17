// App-wide config.
//
// All external links are optional. Any URL left empty renders a friendly
// "coming soon" state in the UI. Fill them in as T hands them over.

export const COACHING_URL = '';
export const TALK_BOOKING_URL = ''; // book T for a talk / event
export const READER_COMMUNITY_URL = ''; // Reader Circle — coming soon, will live at theunispienaar.com/circle

export const BOOK_EBOOK_URL = ''; // Kindle / Apple Books / Google Play
export const BOOK_AUDIOBOOK_URL = ''; // Audible / Spotify / Libro.fm
export const BOOK_PAPERBACK_URL = ''; // Amazon / Takealot / author store

export const NEWSLETTER_URL = ''; // opt-in for "new book" announcements

// Public privacy policy. Shown as a link in Settings; blank hides the link.
export const PRIVACY_POLICY_URL = 'https://theunispienaar.com/app-privacy.html';

// T's Journal feed. A JSON list of T's posts, fetched and cached on-device.
// Blank hides the "T's Journal" tab entirely (same pattern as the URLs above).
export const JOURNAL_FEED_URL = 'https://theunispienaar.com/journal.json';

export const APP_NAME = 're-Genesis';
export const APP_NAME_DISPLAY_CAPS = 'RE-GENESIS';
export const APP_TAGLINE = 'Unravel. Resew. Live.';

// The live web address of the app. Used for the QR code printed in the book
// and for embedding on an author website.
export const APP_URL = 'https://darkhorseza.github.io/LittleTim/';

// Book & author attribution
export const BOOK_TITLE = 're-Genesis';
export const AUTHOR_NAME = 'Theunis Pienaar';
export const AUTHOR_SHORT = 'T';
export const ATTRIBUTION = `Companion to ${BOOK_TITLE} by ${AUTHOR_NAME}`;

export function hasCoachingUrl(): boolean {
  return COACHING_URL.trim().length > 0;
}

export function hasUrl(url: string): boolean {
  return url.trim().length > 0;
}
