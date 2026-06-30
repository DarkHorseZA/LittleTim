import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';

// Shared bottom-sheet shell: a dimmed scrim that dismisses on tap, plus a
// rounded surface anchored to the bottom with a grab handle. Callers provide
// the content and the dismiss handler; the look (scrim, radius, shadow, safe-
// area padding) is unified here so every sheet in the app matches.
type Props = {
  onDismiss: () => void;
  children: React.ReactNode;
  // Accessibility label for the dimmed backdrop button.
  dismissLabel?: string;
};

export function BottomSheet({
  onDismiss,
  children,
  dismissLabel = 'Dismiss',
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable
        style={styles.backdrop}
        accessibilityRole="button"
        accessibilityLabel={dismissLabel}
        onPress={onDismiss}
      />
      <View style={styles.wrap} pointerEvents="box-none">
        <View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}
        >
          <View style={styles.handle} />
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.scrim,
  },
  wrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    maxHeight: '90%',
    ...shadows.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
