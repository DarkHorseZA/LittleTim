/**
 * TrackerScreen — somatic reflection experience.
 * Four sections on one gentle scroll: word, body zones, warmth bar, reflection.
 * All fields optional. Saves to littletim:reflection:v1.
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackActions } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { blend, colors, layout, radius, shadows } from '../theme/colors';
import { tap, pressScale, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { BackButton } from '../components/BackButton';
import { PulsingMark } from '../components/PulsingMark';
import { LegsIcon } from '../components/LegsIcon';
import { BodyZone, ReflectionEntry } from '../types';
import {
  getTodayReflection,
  saveReflection,
  todayKey,
} from '../store/storage';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Tracker'>;

// ─── Constants ────────────────────────────────────────────────────────────────

const COOL_COLOR = colors.warmthCold;

type ZoneDef = {
  key: BodyZone;
  label: string;
  ionicon?: keyof typeof Ionicons.glyphMap;
  legs?: boolean; // custom SVG pair-of-legs icon
};

const BODY_ZONES: ZoneDef[] = [
  { key: 'mind',  label: 'Head',         ionicon: 'happy-outline'   },
  { key: 'heart', label: 'Heart',        ionicon: 'heart-outline'   },
  { key: 'belly', label: 'Belly',        ionicon: 'ellipse-outline' },
  { key: 'whole', label: 'Legs',         legs: true                 },
];

const PROMPTS = [
  'One thing I noticed today…',
  'Today, Love looked like…',
  'Today, when the old thread pulled, I…',
] as const;

type Prompt = typeof PROMPTS[number];

// ─── WarmthBar ────────────────────────────────────────────────────────────────

const THUMB_SIZE = 30;

function warmthColor(v: number): string {
  const t = v / 100;
  const r = Math.round(138 + (176 - 138) * t);
  const g = Math.round(160 + (84  - 160) * t);
  const b = Math.round(176 + (47  - 176) * t);
  return `rgb(${r},${g},${b})`;
}

function WarmthBar({
  value,
  onFirstTouch,
  onChange,
  onDragStateChange,
}: {
  value: number;
  onFirstTouch: () => void;
  onChange: (v: number) => void;
  // Fires true while a drag is in flight, false when it ends. The screen uses
  // this to freeze the parent ScrollView, since on iOS the native scroll
  // recogniser keeps running alongside this JS PanResponder and a slightly
  // diagonal drag would otherwise scroll the page mid-adjust.
  onDragStateChange?: (dragging: boolean) => void;
}) {
  const barWidthRef = useRef(0);
  const touchedRef  = useRef(false);
  const onFirstRef  = useRef(onFirstTouch);
  const onChangeRef = useRef(onChange);
  const onDragRef   = useRef(onDragStateChange);
  useEffect(() => { onFirstRef.current  = onFirstTouch; }, [onFirstTouch]);
  useEffect(() => { onChangeRef.current = onChange;    }, [onChange]);
  useEffect(() => { onDragRef.current   = onDragStateChange; }, [onDragStateChange]);

  const clampedX = (raw: number) =>
    Math.min(Math.max(raw - THUMB_SIZE / 2, 0), barWidthRef.current - THUMB_SIZE);

  const panResponder = useRef(
    PanResponder.create({
      // Claim the touch in the capture phase so the parent ScrollView doesn't
      // get first refusal. (The stack's swipe-back gesture is disabled for this
      // screen in the navigator, so the drag can't pop the screen.)
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture:  () => true,
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      // Never surrender the responder mid-drag (the vertical ScrollView asks
      // for it as soon as the finger wanders a few points off-axis).
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (e) => {
        onDragRef.current?.(true);
        if (!touchedRef.current) {
          touchedRef.current = true;
          onFirstRef.current();
        }
        const w = barWidthRef.current - THUMB_SIZE;
        if (w <= 0) return;
        const x = clampedX(e.nativeEvent.locationX);
        onChangeRef.current(Math.round((x / w) * 100));
      },
      onPanResponderMove: (e) => {
        const w = barWidthRef.current - THUMB_SIZE;
        if (w <= 0) return;
        const x = clampedX(e.nativeEvent.locationX);
        onChangeRef.current(Math.round((x / w) * 100));
      },
      onPanResponderRelease:   () => onDragRef.current?.(false),
      onPanResponderTerminate: () => onDragRef.current?.(false),
    })
  ).current;

  // Derive thumb position from value prop (re-renders on parent state change)
  const [layout, setLayout] = useState(0);
  const thumbLeft =
    layout > 0
      ? Math.round((value / 100) * (layout - THUMB_SIZE))
      : 0;

  return (
    <View style={warmStyles.root}>
      <View
        style={warmStyles.trackArea}
        onLayout={(e) => {
          barWidthRef.current = e.nativeEvent.layout.width;
          setLayout(e.nativeEvent.layout.width);
        }}
        {...panResponder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel="Warmth dial"
        accessibilityValue={{ min: 0, max: 100, now: value }}
      >
        <LinearGradient
          colors={[COOL_COLOR, blend(COOL_COLOR, colors.clay, 0.5), colors.clay]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={warmStyles.track}
          pointerEvents="none"
        />
        <View
          pointerEvents="none"
          style={[
            warmStyles.thumb,
            {
              left: thumbLeft,
              backgroundColor: warmthColor(value),
            },
          ]}
        />
      </View>

      <View style={warmStyles.labels}>
        <Text style={warmStyles.labelL}>cold</Text>
        <Text style={warmStyles.labelR}>warm</Text>
      </View>
    </View>
  );
}

const warmStyles = StyleSheet.create({
  root: { marginTop: 8 },
  trackArea: {
    height: 56,
    justifyContent: 'center',
  },
  track: {
    height: 10,
    borderRadius: 5,
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    marginTop: -THUMB_SIZE / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.thumbRing,
    ...shadows.md,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  labelL: {
    fontFamily: fonts.sansMed,
    fontSize: 12,
    color: COOL_COLOR,
    letterSpacing: 0.4,
  },
  labelR: {
    fontFamily: fonts.sansMed,
    fontSize: 12,
    color: colors.clay,
    letterSpacing: 0.4,
  },
});

// ─── BodyZone button ──────────────────────────────────────────────────────────

function ZoneButton({
  zone,
  selected,
  variant,
  onPress,
}: {
  zone: ZoneDef;
  selected: boolean;
  variant: 'aliveness' | 'tension';
  onPress: () => void;
}) {
  const bg = selected
    ? variant === 'aliveness'
      ? colors.clay
      : colors.inkSoft
    : colors.bgDeep;
  const fg = selected ? colors.white : colors.inkSoft;

  return (
    <Pressable
      onPress={() => { tap(); onPress(); }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={zone.label}
      style={({ pressed, focused }: any) => [
        zoneStyles.btn,
        { backgroundColor: bg },
        pressed && pressScale,
        focused && webFocus,
      ]}
    >
      {zone.legs ? (
        <LegsIcon size={24} color={fg} />
      ) : (
        <Ionicons name={zone.ionicon!} size={20} color={fg} />
      )}
      <Text style={[zoneStyles.label, { color: fg }]}>{zone.label}</Text>
    </Pressable>
  );
}

const zoneStyles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: radius.lg,
    minWidth: 0,
  },
  label: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    letterSpacing: 0.2,
  },
});

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  step,
  prompt,
  subtext,
  onSkip,
  children,
}: {
  step: number;
  prompt: string;
  subtext?: string;
  onSkip?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={sectionStyles.root}>
      <View style={sectionStyles.header}>
        <Text style={sectionStyles.step}>0{step}</Text>
        <Text style={sectionStyles.prompt}>{prompt}</Text>
        {subtext ? (
          <Text style={sectionStyles.subtext}>{subtext}</Text>
        ) : null}
      </View>
      {children}
      {onSkip ? (
        <Pressable
          onPress={onSkip}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Skip this step"
          style={({ pressed }: any) => [
            sectionStyles.skipWrap,
            pressed && { opacity: 0.5 },
          ]}
        >
          <Text style={sectionStyles.skip}>skip this</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  root: {
    marginBottom: 32,
  },
  header: {
    marginBottom: 14,
  },
  step: {
    fontFamily: fonts.serifBold,
    fontSize: 12,
    color: colors.clay,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  prompt: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
  },
  subtext: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
    marginTop: 4,
  },
  skipWrap: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 4,
  },
  skip: {
    fontFamily: fonts.sansMed,
    fontSize: 13,
    color: colors.inkFaint,
    letterSpacing: 0.2,
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export function TrackerScreen({ navigation }: Props) {
  const { updateSettings } = useDay();
  const today = todayKey();

  // Step 1 — word
  const [word, setWord]               = useState('');
  // Step 2 — body zones
  const [aliveness, setAliveness]     = useState<BodyZone | null>(null);
  const [tension, setTension]         = useState<BodyZone[]>([]);
  // Step 3 — warmth
  const [warmth, setWarmth]           = useState(50);
  const [warmthTouched, setWarmthTouched] = useState(false);
  // Freezes the scroll while the warmth dial is being dragged, so a diagonal
  // pull adjusts the value instead of scrolling the page.
  const [warmthDragging, setWarmthDragging] = useState(false);
  // Step 4 — reflection
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt>(PROMPTS[0]);
  const [reflection, setReflection]   = useState('');
  // Sharing opt-in
  const [shareWithT, setShareWithT]   = useState(false);
  // Save state
  const [saved, setSaved]             = useState(false);

  // Pre-fill from any earlier entry today
  useEffect(() => {
    getTodayReflection(today).then((prev) => {
      if (!prev) return;
      if (prev.word)             setWord(prev.word);
      if (prev.aliveness)        setAliveness(prev.aliveness);
      if (prev.tension)          setTension(prev.tension);
      if (prev.warmth !== undefined) { setWarmth(prev.warmth); setWarmthTouched(true); }
      if (prev.reflection)       setReflection(prev.reflection);
      if (prev.reflectionPrompt) {
        const p = PROMPTS.find((x) => x === prev.reflectionPrompt);
        if (p) setSelectedPrompt(p);
      }
      if (prev.sharedWithAuthor) setShareWithT(prev.sharedWithAuthor);
    });
  }, [today]);

  const hasAnyInput =
    word.trim().length > 0 ||
    aliveness !== null ||
    tension.length > 0 ||
    warmthTouched ||
    reflection.trim().length > 0;

  const toggleTension = useCallback((zone: BodyZone) => {
    setTension((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  }, []);

  // Reset (not navigate) so Tabs/Today becomes the fresh root. On first run the
  // stack is [Welcome, EmailSignup, HowToUse, Tracker] with no Tabs beneath, so
  // navigate('Tabs') would PUSH a plain card on top of this fullScreenModal —
  // which native-stack renders BEHIND the modal, leaving Tracker covering the
  // screen (the buttons appear to do nothing). Reset tears the modal down and
  // lands cleanly on Today. Works identically when reached via Settings.
  const goToToday = () =>
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs', params: { screen: 'Today' } }],
    });

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!hasAnyInput) {
      goToToday();
      return;
    }
    const entry: ReflectionEntry = {
      date: today,
      word:             word.trim() || undefined,
      aliveness:        aliveness   ?? undefined,
      tension:          tension.length > 0 ? tension : undefined,
      warmth:           warmthTouched ? warmth : undefined,
      reflection:       reflection.trim() || undefined,
      reflectionPrompt: reflection.trim() ? selectedPrompt : undefined,
      sharedWithAuthor: shareWithT,
    };
    await saveReflection(entry);
    await updateSettings({ lastCheckInDate: today });
    setSaved(true);
    setTimeout(goToToday, 600);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        scrollEnabled={!warmthDragging}
      >
          {/* Back button */}
          <View style={styles.navRow}>
            <BackButton
              onPress={() => navigation.dispatch(StackActions.pop(1))}
              variant="solid"
            />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={text.eyebrow}>How are we sewing?</Text>
            <PulsingMark size={56} />
          </View>
          <Text style={styles.title}>How was your day, really?</Text>
          <Text style={styles.intro}>
            No need to measure or rate. Just notice. Every field is optional,
            take what feels right and leave the rest.
          </Text>

          {/* ── Step 1: One word ── */}
          <Section
            step={1}
            prompt="How do you feel right now, in one word?"
            onSkip={() => setWord('')}
          >
            <TextInput
              value={word}
              onChangeText={(t) => setWord(t.slice(0, 24))}
              placeholder="tired, open, tender, heavy, grateful…"
              placeholderTextColor={colors.inkFaint}
              maxLength={24}
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              style={styles.wordInput}
              accessibilityLabel="How do you feel right now"
            />
          </Section>

          {/* ── Step 2: Body map ── */}
          <Section
            step={2}
            prompt="Where do you feel the most aliveness right now?"
            subtext="Tap the area that draws your attention."
            onSkip={() => { setAliveness(null); setTension([]); }}
          >
            {/* Aliveness — single select */}
            <View style={styles.zoneGrid}>
              {BODY_ZONES.map((z) => (
                <ZoneButton
                  key={z.key}
                  zone={z}
                  selected={aliveness === z.key}
                  variant="aliveness"
                  onPress={() =>
                    setAliveness((prev) => (prev === z.key ? null : z.key))
                  }
                />
              ))}
            </View>

            {/* Tension — multi select */}
            <Text style={styles.tensionLabel}>
              Is there tension sitting somewhere?
            </Text>
            <View style={styles.zoneGrid}>
              {BODY_ZONES.map((z) => (
                <ZoneButton
                  key={z.key}
                  zone={z}
                  selected={tension.includes(z.key)}
                  variant="tension"
                  onPress={() => toggleTension(z.key)}
                />
              ))}
            </View>
          </Section>

          {/* ── Step 3: Warmth dial ── */}
          <Section
            step={3}
            prompt="How warm does your life feel today?"
            onSkip={() => { setWarmth(50); setWarmthTouched(false); }}
          >
            <View style={styles.card}>
              <WarmthBar
                value={warmth}
                onFirstTouch={() => setWarmthTouched(true)}
                onChange={setWarmth}
                onDragStateChange={setWarmthDragging}
              />
            </View>
          </Section>

          {/* ── Step 4: Reflection sentence ── */}
          <Section
            step={4}
            prompt="A sentence, if you have one."
            onSkip={() => setReflection('')}
          >
            {/* Prompt chooser */}
            <ScrollView
        showsVerticalScrollIndicator={false}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.promptScroll}
              contentContainerStyle={styles.promptScrollContent}
            >
              {PROMPTS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => { tap(); setSelectedPrompt(p); }}
                  style={({ pressed, focused }: any) => [
                    styles.promptChip,
                    selectedPrompt === p && styles.promptChipActive,
                    pressed && pressScale,
                    focused && webFocus,
                  ]}
                >
                  <Text
                    style={[
                      styles.promptChipText,
                      selectedPrompt === p && styles.promptChipTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <TextInput
              value={reflection}
              onChangeText={(t) => setReflection(t.slice(0, 280))}
              placeholder="no need to be eloquent. just honest."
              placeholderTextColor={colors.inkFaint}
              multiline
              maxLength={280}
              textAlignVertical="top"
              style={styles.reflectionInput}
              accessibilityLabel="Your reflection"
            />

            {/* Char count */}
            {reflection.length > 220 ? (
              <Text style={styles.charCount}>
                {280 - reflection.length} left
              </Text>
            ) : null}

            {/* Sharing opt-in */}
            <View style={styles.sharingCard}>
              <View style={styles.sharingTextWrap}>
                <Text style={styles.sharingHeading}>
                  Help Theunis understand how re-Genesis lands.
                </Text>
                <Text style={styles.sharingBody}>
                  Share this reflection anonymously with T, not your name,
                  just your experience. You’re a collaborator in the
                  work, not a subject.
                </Text>
              </View>
              <View style={styles.sharingToggleRow}>
                <Text style={styles.sharingToggleLabel}>
                  {shareWithT ? 'Yes, share anonymously' : 'Keep it private'}
                </Text>
                <Switch
                  value={shareWithT}
                  onValueChange={setShareWithT}
                  trackColor={{ false: colors.lineSoft, true: colors.claySoft }}
                  thumbColor={shareWithT ? colors.clay : colors.inkHush}
                  accessibilityLabel="Share this reflection with T anonymously"
                />
              </View>
            </View>
          </Section>

          {/* Save */}
          <Pressable
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel={hasAnyInput ? 'Save reflection' : 'Maybe later'}
            style={({ pressed, focused }: any) => [
              styles.saveBtn,
              hasAnyInput
                ? { backgroundColor: saved ? colors.done : colors.clay }
                : styles.saveBtnEmpty,
              pressed && pressScale,
              focused && webFocus,
            ]}
          >
            <Text
              style={[
                styles.saveBtnText,
                !hasAnyInput && styles.saveBtnTextEmpty,
              ]}
            >
              {saved
                ? 'Saved ✔'
                : hasAnyInput
                ? 'Save reflection'
                : 'Maybe later'}
            </Text>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  navRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
    paddingBottom: 4,
  },
  container: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 48,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    ...text.h1,
    marginBottom: 8,
  },
  intro: {
    ...text.body,
    marginBottom: 32,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    ...shadows.sm,
  },
  wordInput: {
    fontFamily: fonts.serifItalic,
    fontSize: 22,
    color: colors.ink,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 18,
    paddingVertical: 16,
    ...shadows.sm,
  },
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tensionLabel: {
    fontFamily: fonts.serifItalic,
    fontSize: 15,
    color: colors.inkSoft,
    marginBottom: 10,
    marginTop: 4,
  },
  promptScroll: {
    marginBottom: 12,
    marginHorizontal: -4,
  },
  promptScrollContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bgDeep,
  },
  promptChipActive: {
    backgroundColor: colors.clayWash,
  },
  promptChipText: {
    fontFamily: fonts.sansMed,
    fontSize: 13,
    color: colors.inkSoft,
  },
  promptChipTextActive: {
    color: colors.clayDeep,
    fontFamily: fonts.sansSemi,
  },
  reflectionInput: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    minHeight: 100,
    ...shadows.sm,
  },
  charCount: {
    fontFamily: fonts.sansMed,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: 'right',
    marginTop: 6,
  },
  sharingCard: {
    marginTop: 16,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    padding: 18,
    ...shadows.sm,
  },
  sharingTextWrap: {
    marginBottom: 14,
  },
  sharingHeading: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 6,
    lineHeight: 22,
  },
  sharingBody: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
  },
  sharingToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sharingToggleLabel: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    color: colors.ink,
    flex: 1,
    marginRight: 12,
  },
  saveBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: radius.pill,
    marginTop: 8,
  },
  saveBtnEmpty: {
    backgroundColor: colors.bgDeep,
  },
  saveBtnText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    letterSpacing: 1,
    color: colors.white,
    textTransform: 'uppercase',
  },
  saveBtnTextEmpty: {
    color: colors.inkFaint,
  },
});
