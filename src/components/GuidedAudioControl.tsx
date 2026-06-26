import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows } from '../theme/colors';
import { fonts } from '../theme/type';
import { pressScale, tap, webFocus } from '../theme/interactions';

// A content-subordinate guided-audio control: a circular play/pause button with
// a label, plus an optional replay button and a section-aware scrubber.
//
// Backward compatible: when `onSeek`/`duration`/`markers` are omitted it renders
// the simple play control (with an optional thin progress line). When they are
// supplied it renders the richer layout used by MSG meditations:
//
//   [slider with section ticks]
//   [section numbers: 1 2 3 …]
//   [replay] [play/pause]  Playing guided meditation
type Props = {
  isPlaying: boolean;
  onToggle: () => void;
  progress?: number; // 0-1; renders a thin progress line when provided (simple mode)
  label?: string; // the noun after Play/Playing; defaults to "guided meditation"
  // rich mode (all optional):
  onReplay?: () => void;
  onSeek?: (seconds: number) => void;
  currentTime?: number;
  duration?: number;
  markers?: number[]; // section start times in seconds; rendered as ticks + numbers
};

const THUMB = 16; // approx half-thumb inset so ticks line up with the track

export function GuidedAudioControl({
  isPlaying,
  onToggle,
  progress,
  label = 'guided meditation',
  onReplay,
  onSeek,
  currentTime = 0,
  duration = 0,
  markers,
}: Props) {
  const hasScrubber = !!onSeek && duration > 0;
  const hasTicks = hasScrubber && !!markers && markers.length > 0;

  const [dragging, setDragging] = useState(false);
  const [dragVal, setDragVal] = useState(0);

  const value = dragging ? dragVal : Math.min(currentTime, duration);

  // current section (1-based) for the a11y announcement + tick emphasis
  const sectionOf = (t: number) => {
    if (!markers || markers.length === 0) return 1;
    let i = 0;
    for (let k = 0; k < markers.length; k++) {
      if (t >= markers[k] - 0.001) i = k;
      else break;
    }
    return i + 1;
  };
  const section = sectionOf(value);
  const total = markers?.length ?? 1;

  // snap to the nearest section marker on release when close enough, else free
  const SNAP_TOL = 6; // seconds
  const onComplete = (v: number) => {
    let target = v;
    if (markers && markers.length) {
      let nearest = markers[0];
      for (const m of markers) {
        if (Math.abs(m - v) < Math.abs(nearest - v)) nearest = m;
      }
      if (Math.abs(nearest - v) <= SNAP_TOL) target = nearest;
    }
    setDragging(false);
    onSeek?.(target);
  };

  // tick/number positions as a percentage of the thumb's travel (the overlays
  // are inset by THUMB on both sides, so percentages line up with the thumb).
  const pct = (t: number): `${number}%` =>
    `${(duration > 0 ? Math.min(t / duration, 1) : 0) * 100}%`;

  const PlayButton = (
    <Pressable
      onPress={() => {
        tap();
        onToggle();
      }}
      accessibilityRole="button"
      accessibilityLabel={isPlaying ? `Pause ${label}` : `Play ${label}`}
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
        style={isPlaying ? undefined : { marginLeft: 2 }}
      />
    </Pressable>
  );

  const ReplayButton = onReplay ? (
    <Pressable
      onPress={() => {
        tap();
        onReplay();
      }}
      accessibilityRole="button"
      accessibilityLabel={`Restart ${label} from the beginning`}
      hitSlop={8}
      style={({ pressed, focused }: any) => [
        styles.replayBtn,
        pressed && pressScale,
        focused && webFocus,
      ]}
    >
      <Ionicons name="refresh" size={18} color={colors.clayDeep} />
    </Pressable>
  ) : null;

  // ---- simple mode (no scrubber) ----
  if (!hasScrubber) {
    return (
      <View style={styles.wrap}>
        <View style={styles.row}>
          {ReplayButton}
          {PlayButton}
          <Text style={styles.label}>
            {isPlaying ? `Playing ${label}` : `Play ${label}`}
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

  // ---- rich mode (scrubber + replay) ----
  return (
    <View style={styles.wrap}>
      <View style={styles.sliderWrap}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={value}
          minimumTrackTintColor={colors.clay}
          maximumTrackTintColor={colors.lineSoft}
          thumbTintColor={colors.clayDeep}
          onSlidingStart={() => {
            setDragVal(value);
            setDragging(true);
          }}
          onValueChange={(v) => setDragVal(v)}
          onSlidingComplete={onComplete}
          accessibilityLabel="Seek through meditation"
          accessibilityValue={{ text: `Section ${section} of ${total}` }}
        />
        {hasTicks ? (
          <View style={styles.tickOverlay} pointerEvents="none">
            {markers!.map((m, i) => (
              <View
                key={i}
                style={[
                  styles.tick,
                  { left: pct(m) },
                  i + 1 === section && styles.tickActive,
                ]}
              />
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.controlsRow}>
        {ReplayButton}
        {PlayButton}
        <Text style={styles.label}>
          {isPlaying ? `Playing ${label}` : `Play ${label}`}
        </Text>
      </View>
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
  // rich mode
  sliderWrap: {
    width: '100%',
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 36,
  },
  tickOverlay: {
    position: 'absolute',
    left: THUMB,
    right: THUMB,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  tick: {
    position: 'absolute',
    top: '50%',
    marginTop: -3,
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.clayDeep,
    opacity: 0.4,
  },
  tickActive: {
    opacity: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  replayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
