import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JOURNAL_FEED_URL, hasUrl } from '../config';

// One of T's journal posts, as it arrives from the feed.
export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  published_at: string; // ISO 8601
  updated_at: string;   // ISO 8601
  url: string;
};

// Namespaced + versioned, following the littletim:*:v1 convention. This is a
// read-through cache of remote content, not user data, but it shares the scheme
// so all on-device keys stay consistent.
const KEY_JOURNAL_FEED = 'littletim:journalFeed:v1';

async function loadCached(): Promise<JournalPost[]> {
  const raw = await AsyncStorage.getItem(KEY_JOURNAL_FEED);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JournalPost[];
  } catch {
    return [];
  }
}

async function saveCached(posts: JournalPost[]): Promise<void> {
  await AsyncStorage.setItem(KEY_JOURNAL_FEED, JSON.stringify(posts));
}

// The site serves a wrapped feed: { generated_at, posts: [...] }. We also accept
// a bare array, so the app keeps working if the feed shape is ever simplified.
type FeedShape = JournalPost[] | { posts?: JournalPost[] };

function extractPosts(data: FeedShape): JournalPost[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.posts)) return data.posts;
  throw new Error('Feed has no posts');
}

// Fetches T's posts from JOURNAL_FEED_URL, caches them, and returns them.
// On any failure (offline, bad response) it falls back to the last good cache.
// On a cold start with no cache, it returns an empty list.
export async function fetchJournal(): Promise<JournalPost[]> {
  if (!hasUrl(JOURNAL_FEED_URL)) return [];

  try {
    const res = await fetch(JOURNAL_FEED_URL);
    if (!res.ok) throw new Error(`Feed responded ${res.status}`);
    const posts = extractPosts((await res.json()) as FeedShape);
    await saveCached(posts);
    return posts;
  } catch {
    return loadCached();
  }
}

type JournalFeedState = {
  posts: JournalPost[];
  loading: boolean;
};

// Small self-contained hook for the T's Journal tab. Independent of DayContext:
// it loads the cache immediately for a fast first paint, then refreshes from the
// network in the background.
export function useJournalFeed(): JournalFeedState {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const cached = await loadCached();
      if (active && cached.length > 0) setPosts(cached);
      const fresh = await fetchJournal();
      if (active) {
        setPosts(fresh);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { posts, loading };
}
