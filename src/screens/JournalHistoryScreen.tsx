import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabsParamList } from '../navigation/types';
import { colors, radius } from '../theme/colors';
import { tap, pressScale, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { PulsingMark } from '../components/PulsingMark';
import { JournalContent } from './JournalScreen';
import { PatchworkQuilt } from '../components/PatchworkQuilt';

type Tab = 'journal' | 'quilt';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Journal'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function JournalHistoryScreen({ route }: Props) {
  const initialTab: Tab = route.params?.initialTab ?? 'journal';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={text.eyebrow}>Journal</Text>
        <PulsingMark size={56} accessibilityLabel="re-Genesis mark" />
      </View>

      {/* Segment tab bar */}
      <View style={styles.segment}>
        <SegmentButton
          label="Today's Stitches"
          active={activeTab === 'journal'}
          onPress={() => { tap(); setActiveTab('journal'); }}
        />
        <SegmentButton
          label="Your Quilt"
          active={activeTab === 'quilt'}
          onPress={() => { tap(); setActiveTab('quilt'); }}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'journal' ? <JournalContent /> : <PatchworkQuilt />}
      </View>
    </SafeAreaView>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={({ pressed, focused }: any) => [
        styles.segBtn,
        active && styles.segBtnActive,
        pressed && pressScale,
        focused && webFocus,
      ]}
    >
      <Text style={[styles.segLabel, active && styles.segLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.bg,
  },
  segment: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 4,
    backgroundColor: colors.bgDeep,
    borderRadius: radius.pill,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  segBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: '#2B1F0F',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  segLabel: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    letterSpacing: 0.3,
    color: colors.inkFaint,
  },
  segLabelActive: {
    color: colors.clayDeep,
  },
  content: {
    flex: 1,
  },
});
