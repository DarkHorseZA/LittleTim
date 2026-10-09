/**
 * The calm fallback shown when a screen (ErrorBoundary) or the app itself
 * (global handler) can't draw. Deliberately self-contained: it uses only core
 * React Native, hardcoded colours and the system font, because the theme
 * provider or the custom fonts may be exactly what failed.
 */
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { buildErrorReport, sendErrorReport, ReportContext } from '../lib/errorReport';

const C = {
  bg: '#F6F0E6',
  surface: '#FFFDF9',
  ink: '#211A13',
  inkSoft: '#5E554B',
  clay: '#C0623A',
  clayDeep: '#8E3F1F',
  line: '#E4DAC9',
  white: '#FFFFFF',
};
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export function ErrorScreen({
  error,
  onRetry,
  context,
}: {
  error: unknown;
  onRetry: () => void;
  context?: ReportContext;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const report = buildErrorReport(error, context);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.center}>
        <View style={styles.mark}>
          <View style={styles.sprout} />
        </View>

        <Text style={styles.title}>Something came loose.</Text>
        <Text style={styles.body}>
          Your practice is safe, nothing was lost. Let&rsquo;s pick the thread back up.
        </Text>

        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Try again"
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        >
          <Text style={styles.primaryText}>Try again</Text>
        </Pressable>

        <Pressable
          onPress={() => sendErrorReport(error, context)}
          accessibilityRole="button"
          accessibilityLabel="Send this report to us"
          style={({ pressed }) => [styles.ghost, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.ghostText}>Send this to us</Text>
        </Pressable>

        <Pressable
          onPress={() => setShowDetails((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: showDetails }}
          hitSlop={10}
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <Text style={styles.detailsToggle}>
            {showDetails ? 'Hide details' : 'Show details'}
          </Text>
        </Pressable>

        {showDetails ? (
          <ScrollView style={styles.detailsBox} contentContainerStyle={{ padding: 14 }}>
            <Text style={styles.detailsText} selectable>
              {report}
            </Text>
          </ScrollView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: C.clay,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  sprout: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#6F8D5C' },
  title: {
    fontFamily: SERIF,
    fontSize: 26,
    fontWeight: '600',
    color: C.ink,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    color: C.inkSoft,
    textAlign: 'center',
    maxWidth: 340,
    marginBottom: 26,
  },
  primary: {
    backgroundColor: C.clay,
    paddingVertical: 15,
    paddingHorizontal: 44,
    borderRadius: 999,
    minHeight: 48,
    justifyContent: 'center',
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  primaryText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  ghost: { marginTop: 14, paddingVertical: 10, paddingHorizontal: 16, minHeight: 44, justifyContent: 'center' },
  ghostText: { color: C.clayDeep, fontSize: 15, fontWeight: '600' },
  detailsToggle: { color: C.inkSoft, fontSize: 13, marginTop: 10, textDecorationLine: 'underline' },
  detailsBox: {
    marginTop: 16,
    maxHeight: 220,
    alignSelf: 'stretch',
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.line,
  },
  detailsText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11.5,
    lineHeight: 17,
    color: C.inkSoft,
  },
});
