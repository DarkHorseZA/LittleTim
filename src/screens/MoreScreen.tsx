import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabsParamList } from '../navigation/types';
import { colors, radius, shadows } from '../theme/colors';
import { tap, pressScale, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'More'>,
  NativeStackScreenProps<RootStackParamList>
>;

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: keyof RootStackParamList;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'How to use re-Genesis', icon: 'book-outline', screen: 'HowToUse' },
  { label: 'Glossary', icon: 'list-outline', screen: 'Glossary' },
  { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
  { label: 'Connect with T', icon: 'heart-outline', screen: 'Connect' },
];

export function MoreScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        alwaysBounceVertical={false}
      >
        <View style={styles.card}>
          {MENU_ITEMS.map((item, index) => (
            <View key={item.screen}>
              <Pressable
                onPress={() => {
                  tap();
                  navigation.navigate(item.screen as any);
                }}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                style={({ pressed, focused }: any) => [
                  styles.row,
                  pressed && pressScale,
                  focused && webFocus,
                ]}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name={item.icon} size={22} color={colors.clay} />
                  <Text style={styles.rowLabel}>{item.label}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.inkFaint}
                />
              </Pressable>
              {index < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    ...text.h1,
    marginBottom: 24,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadows.sm,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowLabel: {
    ...text.body,
    color: colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: colors.bgDeep,
    marginLeft: 18 + 22 + 14, // align with text, past icon + gap
  },
});
