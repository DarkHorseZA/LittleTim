import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, gradients, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { glossary } from '../data/glossary';
import { BackButton } from '../components/BackButton';
import { PulsingMark } from '../components/PulsingMark';

type Props = NativeStackScreenProps<RootStackParamList, 'Glossary'>;

export function GlossaryScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawn}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
          <View style={styles.headerRow}>
            <Text style={text.eyebrow}>Glossary</Text>
            <PulsingMark size={56} />
          </View>
          <Text style={styles.title}>Words from the book</Text>
          <Text style={styles.subtitle}>
            Short definitions, in T's voice. Tap away anytime you need a
            reminder.
          </Text>

          {glossary.map((g) => (
            <View key={g.id} style={styles.card}>
              <View style={styles.termRow}>
                <Text style={styles.term}>{g.term}</Text>
                {g.origin ? (
                  <View style={styles.originPill}>
                    <Text style={styles.originText}>{g.origin}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.definition}>{g.definition}</Text>
            </View>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    ...StyleSheet.absoluteFillObject,
    height: 260,
    bottom: undefined,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...text.h1,
    marginTop: 8,
    marginBottom: 6,
  },
  subtitle: {
    ...text.body,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 10,
    ...shadows.sm,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  term: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.ink,
    marginRight: 8,
  },
  originPill: {
    backgroundColor: colors.clayWash,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  originText: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.clayDeep,
    textTransform: 'uppercase',
  },
  definition: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
  },
});
