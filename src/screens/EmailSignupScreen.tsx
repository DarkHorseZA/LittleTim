import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
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
import { colors, gradients, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { APP_NAME, AUTHOR_NAME } from '../config';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailSignup'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailSignupScreen({ navigation, route }: Props) {
  const firstRun = route.params?.firstRun === true;
  const { settings, updateSettings } = useDay();
  const profile = settings.profile ?? {};

  const [name, setName] = useState(profile.displayName ?? '');
  const [email, setEmail] = useState(profile.email ?? '');
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const trimmedEmail = email.trim();
  const valid = EMAIL_RE.test(trimmedEmail);
  const showError = touched && trimmedEmail.length > 0 && !valid;

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise]);

  const proceed = () => {
    if (!settings.hasSeenHowTo) {
      navigation.replace('HowToUse', { firstRun: true });
    } else {
      navigation.replace('Tabs', { screen: 'Today' });
    }
  };

  const register = async () => {
    if (!valid || saving) {
      setTouched(true);
      return;
    }
    setSaving(true);
    await updateSettings({
      registeredEmail: trimmedEmail,
      registeredAt: new Date().toISOString(),
      profile: {
        ...profile,
        displayName: name.trim() || profile.displayName,
        email: trimmedEmail,
      },
    });
    proceed();
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
        showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={{ opacity: fade, transform: [{ translateY: rise }] }}
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="mail-open-outline"
                  size={22}
                  color={colors.clayDeep}
                />
              </View>

              <Text style={styles.eyebrow}>Before we begin</Text>
              <Text style={styles.title}>Stay on the thread</Text>
              <Text style={styles.body}>
                {APP_NAME} is the daily companion to {AUTHOR_NAME}'s book.
                Leave your email and we’ll let you know when new tools, and
                the next book, arrive.
              </Text>

              <View style={styles.card}>
                <Text style={styles.label}>Your name (optional)</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="What shall we call you?"
                  placeholderTextColor={colors.inkFaint}
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="next"
                />

                <View style={styles.divider} />

                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setTouched(true)}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.inkFaint}
                  style={[styles.input, showError && styles.inputError]}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  returnKeyType="go"
                  onSubmitEditing={register}
                />
                {showError ? (
                  <Text style={styles.errorText}>
                    That doesn’t look like an email yet.
                  </Text>
                ) : (
                  <Text style={styles.caption}>
                    Saved on this device for now. No spam, just the
                    occasional note when something new is ready.
                  </Text>
                )}
              </View>

              <View style={{ height: 20 }} />

              <Button
                title={firstRun ? 'Continue' : 'Save'}
                onPress={register}
                size="lg"
                trailingIcon="arrow-forward"
              />

              <View style={styles.reassureRow}>
                <Ionicons
                  name="lock-closed"
                  size={12}
                  color={colors.inkFaint}
                />
                <Text style={styles.reassureText}>
                  Private. Stored locally, never shared.
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    ...StyleSheet.absoluteFillObject,
    height: 300,
    bottom: undefined,
  },
  container: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...shadows.sm,
  },
  eyebrow: {
    ...text.eyebrow,
    marginBottom: 4,
  },
  title: {
    ...text.display,
    marginBottom: 10,
  },
  body: {
    ...text.body,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    ...shadows.sm,
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
  inputError: {
    borderBottomColor: colors.clayDeep,
  },
  divider: { height: 16 },
  caption: {
    ...text.caption,
    marginTop: 6,
  },
  errorText: {
    ...text.caption,
    color: colors.clayDeep,
    marginTop: 6,
  },
  reassureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  reassureText: {
    ...text.caption,
  },
});
