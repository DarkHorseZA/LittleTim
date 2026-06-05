import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme/colors';
import { tap, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { chapters } from '../data/chapters';

// The chapter selector used in Settings and the launch chapter check-in.
// `value` is the stored chapter id (0 = Introduction, 1-9 = chapters, or
// undefined = Auto / day rotation). Single source of truth lives in
// settings.currentChapter, the caller wires `onChange` to persist it.
export function ChapterPicker({
  value,
  onChange,
  includeAuto = true,
}: {
  value: number | undefined;
  onChange: (id: number | undefined) => void;
  includeAuto?: boolean;
}) {
  const partOne = chapters.filter((ch) => ch.part === 'One');
  const partTwo = chapters.filter((ch) => ch.part === 'Two');
  const topLevel = chapters.filter((ch) => ch.part === undefined);

  return (
    <View>
      <View style={styles.chapters}>
        {includeAuto && (
          <Chip
            label="Auto"
            selected={value === undefined}
            onPress={() => onChange(undefined)}
            accessibilityLabel="Auto chapter, rotate through all chapters"
          />
        )}
        {topLevel.map((ch) => (
          <Chip
            key={ch.id}
            label={ch.shortTitle}
            selected={value === ch.id}
            onPress={() => onChange(ch.id)}
            accessibilityLabel={`Chapter: ${ch.shortTitle}`}
          />
        ))}
      </View>

      <Text style={styles.partLabel}>Part One</Text>
      <View style={styles.chapters}>
        {partOne.map((ch) => (
          <Chip
            key={ch.id}
            label={ch.shortTitle}
            selected={value === ch.id}
            onPress={() => onChange(ch.id)}
            accessibilityLabel={`Chapter: ${ch.shortTitle}`}
          />
        ))}
      </View>

      <Text style={styles.partLabel}>Part Two</Text>
      <View style={styles.chapters}>
        {partTwo.map((ch) => (
          <Chip
            key={ch.id}
            label={ch.shortTitle}
            selected={value === ch.id}
            onPress={() => onChange(ch.id)}
            accessibilityLabel={`Chapter: ${ch.shortTitle}`}
          />
        ))}
      </View>
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed, focused }: any) => [
        styles.chapterChip,
        selected && styles.chapterChipOn,
        pressed && { transform: [{ scale: 0.97 }] },
        focused && webFocus,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text
        style={[styles.chapterChipText, selected && styles.chapterChipTextOn]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chapters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  partLabel: {
    ...text.eyebrow,
    marginTop: 14,
    marginBottom: 10,
  },
  chapterChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.lineSoft,
  },
  chapterChipOn: {
    backgroundColor: colors.clay,
  },
  chapterChipText: {
    color: colors.inkSoft,
    fontFamily: fonts.sansSemi,
    fontSize: 13,
  },
  chapterChipTextOn: {
    color: colors.white,
  },
});
