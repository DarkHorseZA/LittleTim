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
import { colors, layout, radius } from '../theme/colors';
import { tap, pressScale, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { PulsingMark } from '../components/PulsingMark';
import { JournalContent, SavedStitches, TsJournal } from './JournalScreen';
import { PatchworkQuilt } from '../components/PatchworkQuilt';
import { JOURNAL_FEED_URL, hasUrl } from '../config';

type Tab = 'journal' | 'saved' | 'quilt' | 'tjournal';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Journal'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function JournalHistoryScreen({ route }: Props) {
  const showTsJournal = hasUrl(JOURNAL_FEED_URL);
  const initialTab: Tab = route.params?.initialTab ?? 'journal';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.innerWrap}>
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
            label="Saved Stitches"
            active={activeTab === 'saved'}
            onPress={() => { tap(); setActiveTab('saved'); }}
          />
          <SegmentButton
            label="Your Quilt"
            active={activeTab === 'quilt'}
            onPress={() => { tap(); setActiveTab('quilt'); }}
          />
          {showTsJournal ? (
            <SegmentButton
              label="T’s Journal"
              active={activeTab === 'tjournal'}
              onPress={() => { tap(); setActiveTab('tjournal'); }}
            />
          ) : null}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'journal' ? (
            <JournalContent />
          ) : activeTab === 'saved' ? (
            <SavedStitches />
          ) : activeTab === 'tjournal' && showTsJournal ? (
            <TsJournal />
          ) : (
            <PatchworkQuilt />
          )}
        </View>
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
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.segLabel, active && styles.segLabelActive]}
      >
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
  innerWrap: {
    flex: 1,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
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
    paddingHorizontal: 6,
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
    fontSize: 12,
    letterSpacing: 0.2,
    color: colors.inkFaint,
  },
  segLabelActive: {
    color: colors.clayDeep,
  },
  content: {
    flex: 1,
  },
});
