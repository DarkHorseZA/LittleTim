import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, gradients, layout, radius, shadows } from '../theme/colors';
import { pressScale, tap, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { PulsingMark } from '../components/PulsingMark';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Account'>;

// Returns initials or null. Callers render a neutral icon when null to avoid
// ever showing a glyph fallback (no emojis in product chrome).
function initials(name?: string): string | null {
  if (!name) return null;
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const joined = parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
  return joined.length > 0 ? joined : null;
}

export function AccountScreen({ navigation }: Props) {
  const { settings, updateSettings } = useDay();
  const profile = settings.profile ?? {};
  const [name, setName] = useState(profile.displayName ?? '');
  const [email, setEmail] = useState(profile.email ?? '');
  const signedIn = !!profile.displayName;

  const save = async () => {
    await updateSettings({
      profile: {
        displayName: name.trim() || undefined,
        email: email.trim() || undefined,
      },
    });
    navigation.goBack();
  };

  const comingSoon = (method: string) =>
    Alert.alert(
      'Coming soon',
      `${method} sign-in is on the roadmap. For now your progress is saved on this device, add a display name to personalize your experience.`
    );

  const signOut = () => {
    Alert.alert(
      'Sign out',
      'This clears your local display name and email. Your practice history stays on the device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            setName('');
            setEmail('');
            await updateSettings({ profile: {} });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawnDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topRow}>
          <BackButton
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          />
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              {initials(name) ? (
                <Text style={styles.avatarText}>{initials(name)}</Text>
              ) : (
                <PulsingMark size={72} accessibilityLabel="re-Genesis mark" />
              )}
            </View>
          </View>

          <Text style={styles.eyebrow}>Account</Text>
          <Text style={styles.title}>
            {signedIn ? `Hello, ${profile.displayName}` : 'You, on re-Genesis'}
          </Text>
          <Text style={styles.body}>
            Set a display name so the app feels like yours. Cloud sign-in and
            progress sync across devices are coming soon.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Display name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="What shall we call you?"
              placeholderTextColor={colors.inkFaint}
              style={styles.input}
              autoCapitalize="words"
              returnKeyType="next"
              accessibilityLabel="Display name"
            />

            <View style={styles.divider} />

            <Text style={styles.label}>Email (optional)</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.inkFaint}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              accessibilityLabel="Email address, optional"
            />
            <Text style={styles.caption}>
              Saved locally only. We'll use it when cloud sync ships.
            </Text>
          </View>

          <Text style={[text.eyebrow, styles.sectionEyebrow]}>Sign in</Text>

          <ProviderButton
            icon="logo-apple"
            label="Continue with Apple"
            onPress={() => comingSoon('Apple')}
          />
          <ProviderButton
            icon="logo-google"
            label="Continue with Google"
            onPress={() => comingSoon('Google')}
          />
          <ProviderButton
            icon="mail-outline"
            label="Continue with email"
            onPress={() => comingSoon('Email')}
          />

          <View style={styles.soonRow}>
            <Ionicons name="lock-closed" size={12} color={colors.inkFaint} />
            <Text style={styles.soonText}>
              Cloud sign-in coming soon, local for now.
            </Text>
          </View>

          <View style={{ height: 20 }} />

          <Button title="Save" onPress={save} size="lg" icon="checkmark" />
          <View style={{ height: 10 }} />
          {signedIn ? (
            <Button title="Sign out" variant="ghost" onPress={signOut} />
          ) : (
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => navigation.goBack()}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ProviderButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => { tap(); onPress(); }}
      accessibilityRole="button"
      accessibilityLabel={`${label}, coming soon`}
      style={({ pressed, focused }: any) => [
        styles.provider,
        pressed && pressScale,
        focused && webFocus,
      ]}
    >
      <View style={styles.providerLeft}>
        <Ionicons name={icon} size={20} color={colors.ink} />
        <Text style={styles.providerLabel}>{label}</Text>
      </View>
      <View style={styles.soonPill}>
        <Text style={styles.soonPillText}>Soon</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    ...StyleSheet.absoluteFillObject,
    height: 280,
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
    padding: layout.screen,
    paddingTop: 10,
    paddingBottom: 40,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  avatarText: {
    fontFamily: fonts.serifBold,
    fontSize: 36,
    color: colors.white,
  },
  eyebrow: {
    ...text.eyebrow,
    textAlign: 'center',
  },
  title: {
    ...text.h1,
    textAlign: 'center',
    marginTop: 6,
  },
  body: {
    ...text.body,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    ...shadows.sm,
    marginBottom: 24,
  },
  label: {
    ...text.eyebrow,
    marginBottom: 8,
  },
  input: {
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  divider: {
    height: 16,
  },
  caption: {
    ...text.caption,
    marginTop: 6,
  },
  sectionEyebrow: {
    marginBottom: 10,
  },
  provider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    marginBottom: 10,
  },
  providerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerLabel: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.ink,
    marginLeft: 12,
  },
  soonPill: {
    backgroundColor: colors.lineSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  soonPillText: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.inkFaint,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  soonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    gap: 6,
  },
  soonText: {
    ...text.caption,
  },
});
