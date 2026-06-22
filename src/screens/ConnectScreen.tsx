import React, { useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, gradients, layout, radius, shadows } from '../theme/colors';
import { nav, pressScale, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { PulsingMark } from '../components/PulsingMark';
import {
  AUTHOR_NAME,
  BOOK_AUDIOBOOK_URL,
  BOOK_EBOOK_URL,
  BOOK_PAPERBACK_URL,
  BOOK_TITLE,
  COACHING_URL,
  NEWSLETTER_URL,
  READER_COMMUNITY_URL,
  SOCIAL_LINKS,
  TALK_BOOKING_URL,
  WEBSITE_URL,
  hasUrl,
} from '../config';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Connect'>;

type IconName = keyof typeof Ionicons.glyphMap;

export function ConnectScreen({ navigation }: Props) {
  const { settings, updateSettings } = useDay();
  const notify = settings.notifyOnNewBook === true;
  const [saving, setSaving] = useState(false);

  // When a destination URL isn't wired yet, the button is already visually
  // disabled (persistent "Coming soon" / "Soon" label), so tapping is a no-op.
  // No alert, no dead-end.
  const open = (url: string) => {
    if (!hasUrl(url)) return;
    Linking.openURL(url);
  };

  // Open an always-present external link (website / socials). On native this
  // deep-links into an installed app for free; we still guard with canOpenURL
  // and swallow any failure so a tap never throws.
  const openExternal = async (url: string) => {
    nav();
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url); // try anyway; web + most https always open
      }
    } catch {
      // nothing we can do if the OS refuses to open it
    }
  };

  const toggleNotify = async (next: boolean) => {
    setSaving(true);
    await updateSettings({
      notifyOnNewBook: next,
      hasSeenNewBookPrompt: true,
    });
    setSaving(false);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawnDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.topRow}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <ScrollView
        showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <Text style={text.eyebrow}>Connect</Text>
            <PulsingMark size={56} />
          </View>
          <Text style={styles.title}>Stay with the thread</Text>
          <Text style={styles.intro}>
            A quiet way to work with {AUTHOR_NAME}, find the book, and hear
            when the next one lands. All optional, always on your terms.
          </Text>

          <SectionLabel>Find Theunis online</SectionLabel>

          <WebsiteCard onPress={() => openExternal(WEBSITE_URL)} />

          <SocialRow onPress={openExternal} />

          <SectionLabel>Work with {AUTHOR_NAME}</SectionLabel>

          <ActionCard
            icon="calendar-outline"
            title="Book a coaching session"
            body="One-on-one work. A session to sit with what the book opens."
            cta={hasUrl(COACHING_URL) ? 'Book a session' : 'Coming soon'}
            disabled={!hasUrl(COACHING_URL)}
            onPress={() => open(COACHING_URL)}
          />

          <ActionCard
            icon="mic-outline"
            title="Invite T to speak"
            body="Bring re-Genesis to your group, retreat, or event."
            cta={hasUrl(TALK_BOOKING_URL) ? 'Enquire' : 'Coming soon'}
            disabled={!hasUrl(TALK_BOOKING_URL)}
            onPress={() => open(TALK_BOOKING_URL)}
          />

          <ActionCard
            icon="people-outline"
            title="Reader circle"
            body="Meet others walking the same thread. A gentle place to share stitches."
            cta={hasUrl(READER_COMMUNITY_URL) ? 'Join' : 'Coming soon'}
            disabled={!hasUrl(READER_COMMUNITY_URL)}
            onPress={() => open(READER_COMMUNITY_URL)}
          />

          <SectionLabel>Get the book</SectionLabel>

          <View style={styles.bookCard}>
            <View style={styles.bookHead}>
              <Image
                source={require('../../assets/brand/logo-portrait.png')}
                style={styles.bookCover}
                resizeMode="contain"
                accessibilityLabel={`${BOOK_TITLE} book cover`}
              />
              <View style={styles.bookMeta}>
                <Text style={styles.bookTitle}>{BOOK_TITLE}</Text>
                <Text style={styles.bookAuthor}>by {AUTHOR_NAME}</Text>
                <Text style={styles.bookBlurb}>
                  The thread this app is the needle for. Pick the format
                  that fits your rhythm.
                </Text>
              </View>
            </View>

            <View style={{ height: 14 }} />

            <BookFormatRow
              icon="tablet-portrait-outline"
              label="E-book"
              sub="Read on phone, tablet, or Kindle."
              hasLink={hasUrl(BOOK_EBOOK_URL)}
              onPress={() => open(BOOK_EBOOK_URL)}
            />
            <BookFormatRow
              icon="headset-outline"
              label="Audiobook"
              sub="Listen in T’s voice."
              hasLink={hasUrl(BOOK_AUDIOBOOK_URL)}
              onPress={() => open(BOOK_AUDIOBOOK_URL)}
            />
            <BookFormatRow
              icon="book-outline"
              label="Paperback"
              sub="The quilt you can hold."
              hasLink={hasUrl(BOOK_PAPERBACK_URL)}
              onPress={() => open(BOOK_PAPERBACK_URL)}
              last
            />
          </View>

          <SectionLabel>When the next book lands</SectionLabel>

          <View style={styles.notifyCard}>
            <View style={styles.notifyHead}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="sparkles-outline"
                  size={16}
                  color={colors.clay}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifyTitle}>
                  Tell me about a new book
                </Text>
                <Text style={styles.notifySub}>
                  We’ll let you know once, quietly, when the next one is ready.
                </Text>
              </View>
              <Switch
                value={notify}
                onValueChange={toggleNotify}
                disabled={saving}
                trackColor={{ false: colors.lineSoft, true: colors.clay }}
                thumbColor={colors.white}
              />
            </View>

            {notify ? (
              <View style={styles.notifyConfirm}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.done}
                />
                <Text style={styles.notifyConfirmText}>
                  You’re on the list. No noise, just the news.
                </Text>
              </View>
            ) : null}

            {hasUrl(NEWSLETTER_URL) ? (
              <View style={{ marginTop: 14 }}>
                <Button
                  title="Or join the newsletter"
                  variant="ghost"
                  icon="mail-outline"
                  onPress={() => open(NEWSLETTER_URL)}
                />
              </View>
            ) : null}
          </View>

          <View style={{ height: 30 }} />
          <Text style={styles.footer}>
            {`\u201CSmall stitches become the quilt.\u201D`}
          </Text>
          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

// Social handles, in display order. All icons come from FontAwesome6 brands
// (Ionicons has no Threads logo and only the old Twitter bird), so the row
// stays visually consistent. `x-twitter` is the proper X mark.
type FA6Name = React.ComponentProps<typeof FontAwesome6>['name'];
const SOCIALS: { key: string; label: string; icon: FA6Name; url: string }[] = [
  { key: 'instagram', label: 'Instagram', icon: 'instagram', url: SOCIAL_LINKS.instagram },
  { key: 'facebook', label: 'Facebook', icon: 'facebook', url: SOCIAL_LINKS.facebook },
  { key: 'threads', label: 'Threads', icon: 'threads', url: SOCIAL_LINKS.threads },
  { key: 'youtube', label: 'YouTube', icon: 'youtube', url: SOCIAL_LINKS.youtube },
  { key: 'tiktok', label: 'TikTok', icon: 'tiktok', url: SOCIAL_LINKS.tiktok },
  { key: 'x', label: 'X', icon: 'x-twitter', url: SOCIAL_LINKS.x },
];

function WebsiteCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel="Visit theunispienaar.com, the website"
      style={({ pressed, focused }: any) => [
        pressed && pressScale,
        focused && webFocus,
      ]}
    >
      <LinearGradient
        colors={gradients.clay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.webCard}
      >
        <View style={styles.webTop}>
          <Text style={styles.webEyebrow}>The website</Text>
          <View style={styles.webBadge}>
            <Ionicons name="globe-outline" size={18} color={colors.white} />
          </View>
        </View>
        <Text style={styles.webTitle}>theunispienaar.com</Text>
        <Text style={styles.webBody}>
          Books, news, and writing from {AUTHOR_NAME}.
        </Text>
        <View style={styles.webCta}>
          <Text style={styles.webCtaText}>Visit the website</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function SocialRow({ onPress }: { onPress: (url: string) => void }) {
  return (
    <View style={styles.socialRow}>
      {SOCIALS.map((s) => (
        <Pressable
          key={s.key}
          onPress={() => onPress(s.url)}
          accessibilityRole="link"
          accessibilityLabel={`Follow on ${s.label}`}
          style={({ pressed, focused }: any) => [
            styles.socialBtn,
            pressed && pressScale,
            focused && webFocus,
          ]}
        >
          <FontAwesome6 name={s.icon} iconStyle="brand" size={20} color={colors.ink} />
        </Pressable>
      ))}
    </View>
  );
}

function ActionCard({
  icon,
  title,
  body,
  cta,
  onPress,
  disabled,
}: {
  icon: IconName;
  title: string;
  body: string;
  cta: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        nav();
        onPress();
      }}
      disabled={disabled}
      style={({ pressed, focused }: any) => [
        styles.actionCard,
        disabled && styles.actionCardDisabled,
        pressed && !disabled && pressScale,
        focused && !disabled && webFocus,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${cta}`}
      accessibilityHint={body}
      accessibilityState={{ disabled: !!disabled }}
    >
      <View
        style={[
          styles.iconCircle,
          disabled && { backgroundColor: colors.lineSoft },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={disabled ? colors.inkFaint : colors.clay}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.actionTitle,
            disabled && { color: colors.inkSoft },
          ]}
        >
          {title}
        </Text>
        <Text style={styles.actionBody}>{body}</Text>
        <View style={styles.actionCtaRow}>
          <Text
            style={[
              styles.actionCta,
              disabled && { color: colors.inkFaint },
            ]}
          >
            {cta}
          </Text>
          {!disabled ? (
            <Text style={styles.actionCta}>{'\u2192'}</Text>
          ) : (
            <View style={styles.soonPill}>
              <Text style={styles.soonPillText}>Soon</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function BookFormatRow({
  icon,
  label,
  sub,
  hasLink,
  onPress,
  last,
}: {
  icon: IconName;
  label: string;
  sub: string;
  hasLink: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        if (!hasLink) return;
        nav();
        onPress();
      }}
      disabled={!hasLink}
      style={({ pressed, focused }: any) => [
        styles.formatRow,
        !last && styles.formatRowDivider,
        pressed && hasLink && pressScale,
        focused && hasLink && webFocus,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${sub}. ${hasLink ? 'Open' : 'Coming soon'}`}
      accessibilityState={{ disabled: !hasLink }}
    >
      <View style={styles.iconCircleSmall}>
        <Ionicons name={icon} size={14} color={colors.clay} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.formatLabel}>{label}</Text>
        <Text style={styles.formatSub}>{sub}</Text>
      </View>
      <Text
        style={[
          styles.formatCta,
          !hasLink && { color: colors.inkFaint },
        ]}
      >
        {hasLink ? 'Open' : 'Soon'}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={hasLink ? colors.clay : colors.inkFaint}
        style={{ marginLeft: 4 }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    ...StyleSheet.absoluteFillObject,
    height: 260,
    bottom: undefined,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: layout.screen,
    paddingTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: layout.screenLoose,
    paddingTop: 10,
    paddingBottom: 40,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...text.display,
    marginTop: 4,
  },
  intro: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionLabel: {
    ...text.eyebrow,
    marginTop: 18,
    marginBottom: 10,
  },
  webCard: {
    borderRadius: radius.xl,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadows.md,
  },
  webTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  webEyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2.2,
    color: colors.onClaySoft,
    textTransform: 'uppercase',
  },
  webBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.onClayChip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.white,
    marginTop: 12,
  },
  webBody: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.onClayStrong,
    marginTop: 8,
  },
  webCta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  webCtaText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    letterSpacing: 1.2,
    color: colors.white,
    marginRight: 6,
    textTransform: 'uppercase',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 8,
  },
  socialBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 10,
    ...shadows.sm,
  },
  actionCardDisabled: {
    backgroundColor: colors.surfaceSoft,
    opacity: 0.9,
  },
  actionCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  soonPill: {
    backgroundColor: colors.lineSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  soonPillText: {
    fontFamily: fonts.sansSemi,
    fontSize: 10,
    color: colors.inkFaint,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  iconCircleSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.ink,
    marginBottom: 4,
  },
  actionBody: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
    marginBottom: 8,
  },
  actionCta: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.clayDeep,
  },
  bookCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    ...shadows.sm,
  },
  bookHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  bookCover: {
    width: 88,
    height: 132, // 1024x1536 ratio (2:3) kept
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
  },
  bookMeta: {
    flex: 1,
  },
  bookTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.ink,
  },
  bookAuthor: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 2,
  },
  bookBlurb: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
    marginTop: 10,
  },
  formatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  formatRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  formatLabel: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.ink,
  },
  formatSub: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
  },
  formatCta: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.clayDeep,
  },
  notifyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    ...shadows.sm,
  },
  notifyHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifyTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.ink,
  },
  notifySub: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkSoft,
    marginTop: 2,
    marginRight: 10,
  },
  notifyConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
  },
  notifyConfirmText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    marginLeft: 8,
  },
  footer: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: 'center',
  },
});
