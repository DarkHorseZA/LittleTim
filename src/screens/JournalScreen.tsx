import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows } from '../theme/colors';
import { tap, pressScale, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { useDay } from '../store/DayContext';
import { appendStitch, loadStitches, todayKey } from '../store/storage';
import { JournalStitch } from '../types';
import { RootStackParamList } from '../navigation/types';
import { JournalPost, useJournalFeed } from '../data/journalFeed';
import { toast } from '../components/Toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function prettyDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// Turns an ISO timestamp into a gentle relative phrase, e.g. "3 days ago".
function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return days === 1 ? 'yesterday' : `${days} days ago`;
  const weeks = Math.round(days / 7);
  if (days < 30) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  const months = Math.round(days / 30);
  if (days < 365) return months === 1 ? '1 month ago' : `${months} months ago`;
  const years = Math.round(days / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

// ─── Saved stitch card ────────────────────────────────────────────────────────

function StitchCard({ stitch }: { stitch: JournalStitch }) {
  return (
    <View style={styles.stitchCard}>
      <Text style={styles.stitchDate}>{prettyDate(stitch.date)}</Text>
      {stitch.sewedWithLove ? (
        <View style={styles.stitchSection}>
          <Text style={styles.stitchLabel}>SEWED WITH LOVE</Text>
          <Text style={styles.stitchBody}>{stitch.sewedWithLove}</Text>
        </View>
      ) : null}
      {stitch.oldThreadPulled ? (
        <View style={styles.stitchSection}>
          <Text style={styles.stitchLabel}>WHEN THE OLD THREAD PULLED</Text>
          <Text style={styles.stitchBody}>{stitch.oldThreadPulled}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Today’s Stitches tab (inputs only) ──────────────────────────────────────

export function JournalContent() {
  const { addQuiltEntry } = useDay();
  const today = todayKey();

  const [sewedWithLove, setSewedWithLove] = useState('');
  const [oldThread, setOldThread]         = useState('');

  const hasInput =
    sewedWithLove.trim().length > 0 || oldThread.trim().length > 0;

  const handleSave = async () => {
    if (!hasInput) return;
    Keyboard.dismiss();

    const stitch: JournalStitch = {
      id: Date.now().toString(),
      date: today,
      sewedWithLove:   sewedWithLove.trim()  || undefined,
      oldThreadPulled: oldThread.trim()      || undefined,
      savedAt: new Date().toISOString(),
    };

    await appendStitch(stitch);
    await addQuiltEntry({ type: 'journal' });
    setSewedWithLove('');
    setOldThread('');
    toast("Stitch saved, your quilt grows.", "success");
  };

  // The multiline inputs offer no return-key dismissal (return = newline), so
  // the keyboard needs two exits: drag the scroll, or tap any empty space
  // (the wrapping Pressable catches taps that no child claims).
  return (
    <ScrollView
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={Keyboard.dismiss}
        accessible={false}
        style={styles.inputSection}
      >
        <Text style={styles.title}>Today’s Stitches</Text>
        <Text style={styles.body}>
          Two sentences. Don’t try to be eloquent. Just be honest.
        </Text>

        <View style={styles.card}>
          {/* Prompt 1 */}
          <View style={styles.promptHead}>
            <View style={styles.promptIcon}>
              <Ionicons name="heart" size={14} color={colors.done} />
            </View>
            <Text style={styles.promptLabel}>Sewed with love</Text>
          </View>
          <TextInput
            value={sewedWithLove}
            onChangeText={setSewedWithLove}
            placeholder="Today I sewed with love when I..."
            placeholderTextColor={colors.placeholder}
            multiline
            scrollEnabled={false}
            style={styles.input}
            accessibilityLabel="Sewed with love"
          />

          <View style={styles.divider} />

          {/* Prompt 2 */}
          <View style={styles.promptHead}>
            <View style={[styles.promptIcon, { backgroundColor: colors.clayWash }]}>
              <Ionicons name="pulse" size={14} color={colors.clayDeep} />
            </View>
            <Text style={styles.promptLabel}>When the old thread pulled</Text>
          </View>
          <TextInput
            value={oldThread}
            onChangeText={setOldThread}
            placeholder="Today, when the old thread pulled, I..."
            placeholderTextColor={colors.placeholder}
            multiline
            scrollEnabled={false}
            style={styles.input}
            accessibilityLabel="When the old thread pulled"
          />
        </View>

        {/* Save button */}
        <Pressable
          onPress={hasInput ? handleSave : undefined}
          accessibilityRole="button"
          accessibilityLabel={hasInput ? 'Save stitch' : 'Maybe later'}
          style={({ pressed, focused }: any) => [
            styles.saveBtn,
            { backgroundColor: hasInput ? colors.clay : colors.lineSoft },
            pressed && { opacity: 0.88 },
            focused && hasInput && webFocus,
          ]}
        >
          <Ionicons
            name="save-outline"
            size={16}
            color={hasInput ? colors.white : colors.inkFaint}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.saveText, { color: hasInput ? colors.white : colors.inkFaint }]}>
            {hasInput ? 'Save Stitch' : 'Maybe later'}
          </Text>
        </Pressable>
      </Pressable>
    </ScrollView>
  );
}

// ─── Saved Stitches tab (review only) ────────────────────────────────────────

export function SavedStitches() {
  const [stitches, setStitches] = useState<JournalStitch[]>([]);

  // Reload on focus so a stitch saved on the Today’s Stitches tab shows up the
  // moment the user switches to this tab (the component mounts fresh).
  useFocusEffect(
    useCallback(() => {
      loadStitches().then(setStitches);
    }, [])
  );

  const sorted = [...stitches].sort((a, b) =>
    a.savedAt > b.savedAt ? -1 : 1
  );

  return (
    <ScrollView
      style={styles.listScroll}
      contentContainerStyle={styles.listContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pastHeader}>
        <Text style={text.eyebrow}>Saved Stitches</Text>
        <Text style={styles.pastSub}>Your thread, recorded.</Text>
      </View>

      {sorted.length === 0 ? (
        <Text style={styles.emptyState}>
          Your first stitch is waiting to be sewn.
        </Text>
      ) : (
        sorted.map((s) => <StitchCard key={s.id} stitch={s} />)
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── T’s Journal tab (T’s posts, fetched from the feed) ──────────────────────

function PostCard({
  post,
  onPress,
}: {
  post: JournalPost;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Read ${post.title}`}
      style={({ pressed, focused }: any) => [
        styles.postCard,
        pressed && pressScale,
        focused && webFocus,
      ]}
    >
      <Text style={styles.postTitle}>{post.title}</Text>
      {post.excerpt ? (
        <Text style={styles.postExcerpt} numberOfLines={3}>
          {post.excerpt}
        </Text>
      ) : null}
      <Text style={styles.postMeta}>{relativeDate(post.published_at)}</Text>
    </Pressable>
  );
}

export function TsJournal() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { posts, loading } = useJournalFeed();

  const open = (post: JournalPost) => {
    tap();
    navigation.navigate('JournalPost', { url: post.url, title: post.title });
  };

  return (
    <ScrollView
      style={styles.listScroll}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pastHeader}>
        <Text style={styles.pastSub}>Words from Theunis, as they arrive.</Text>
      </View>

      {posts.length === 0 ? (
        <Text style={styles.emptyState}>
          {loading
            ? 'Gathering T’s latest threads…'
            : 'No entries yet, check back soon.'}
        </Text>
      ) : (
        posts.map((p) => (
          <PostCard key={p.slug} post={p} onPress={() => open(p)} />
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  inputSection: {
    padding: 20,
    paddingBottom: 8,
  },
  title: { ...text.h1, marginTop: 8, marginBottom: 6 },
  body:  { ...text.body, marginBottom: 18 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    ...shadows.sm,
  },
  promptHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.doneSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  promptLabel: {
    ...text.eyebrow,
    marginBottom: 0,
  },
  input: {
    fontSize: 16,
    color: colors.ink,
    minHeight: 72,
    paddingTop: 4,
    fontFamily: fonts.sans,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 14,
  },
  saveBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
    alignSelf: 'flex-end',
  },
  saveText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  listScroll: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pastHeader: {
    marginBottom: 14,
  },
  pastSub: {
    ...text.body,
    marginTop: 4,
  },
  emptyState: {
    fontFamily: fonts.serifItalic,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: 8,
  },
  stitchCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.sm,
  },
  stitchDate: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.ink,
    marginBottom: 10,
  },
  stitchSection: {
    marginBottom: 8,
  },
  stitchLabel: {
    ...text.eyebrow,
    fontSize: 10,
    marginBottom: 4,
  },
  stitchBody: {
    ...text.body,
    color: colors.ink,
    lineHeight: 21,
  },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 12,
    ...shadows.sm,
  },
  postTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 8,
  },
  postExcerpt: {
    ...text.body,
    color: colors.ink,
    lineHeight: 22,
    marginBottom: 10,
  },
  postMeta: {
    ...text.eyebrow,
    fontSize: 10,
    color: colors.inkFaint,
  },
});
