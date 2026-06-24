import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows } from '../theme/colors';
import { fonts } from '../theme/type';
import { pressScale, tap, webFocus } from '../theme/interactions';

// A small, content-subordinate guided-audio control: a circular play/pause
// button with a label and an optional thin progress line. No full scrubber yet.
type Props = {
  isPlaying: boolean;
  onToggle: () => void;
  progress?: number; // 0-1; renders a thin progress line when provided
};

export function MeditationAudioControl({ isPlaying, onToggle, progress }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          onPress={() => {
            tap();
            onToggle();
          }}
          accessibilityRole="button"
          accessibilityLabel={
            isPlaying ? 'Pause guided meditation' : 'Play guided meditation'
          }
          accessibilityState={{ selected: isPlaying }}
          hitSlop={8}
          style={({ pressed, focused }: any) => [
            styles.btn,
            pressed && pressScale,
            focused && webFocus,
          ]}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color={colors.white}
            // nudge the play triangle to look optically centred
            style={isPlaying ? undefined : { marginLeft: 2 }}
          />
        </Pressable>
        <Text style={styles.label}>
          {isPlaying ? 'Playing guided meditation' : 'Play guided meditation'}
        </Text>
      </View>

      {progress !== undefined ? (
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${Math.min(Math.max(progress, 0), 1) * 100}%` },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...shadows.sm,
  },
  label: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    letterSpacing: 0.3,
    color: colors.clayDeep,
  },
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.lineSoft,
    marginTop: 12,
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.clay,
  },
});
