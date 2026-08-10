import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, gradients, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { CloseButton } from '../components/CloseButton';
import { BackButton } from '../components/BackButton';
import { beliefForDate } from '../data/beliefs';
import { useDay } from '../store/DayContext';
import { useDiscovery } from '../store/DiscoveryContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Belief'>;

export function BeliefScreen({ navigation }: Props) {
  const { today, updateToday, addQuiltEntry, settings } = useDay();
  const discovery = useDiscovery();
  // A completed reader sees the same fresh belief the Today screen drew this
  // open; everyone else follows the current chapter as before.
  const belief = useMemo(
    () => discovery?.belief ?? beliefForDate(new Date(), settings.currentChapter),
    [discovery, settings.currentChapter]
  );

  // Leave the screen. Normally Belief is a modal over Tabs, so goBack() works.
  // But when it is opened cold from a notification deep link it is the only
  // screen in the stack, and goBack() would do nothing, so send the reader into
  // the app instead of a dead end.
  const dismiss = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    }
  };

  const acknowledge = async () => {
    // Completion haptic fired by the Button (haptic="success"). No manual call.
    await updateToday({
      beliefId: belief.id,
      beliefAcknowledged: true,
    });
    await addQuiltEntry({ type: 'belief' });
    dismiss();
  };

  const already = today.beliefAcknowledged && today.beliefId === belief.id;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawnDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.closeRow}>
          <BackButton onPress={dismiss} />
          <CloseButton
            onPress={() => navigation.navigate('Glossary')}
            icon="help-circle-outline"
            accessibilityLabel="Open glossary"
          />
        </View>

        <ScrollView
        showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <View style={styles.mark}>
            <Ionicons name="sparkles" size={20} color={colors.clayDeep} />
          </View>
          <Text style={styles.eyebrow}>Belief reminder</Text>
          <Text style={styles.statement}>{`\u201C${belief.statement}\u201D`}</Text>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="leaf-outline" size={18} color={colors.done} />
              </View>
              <Text style={styles.cardLabel}>Somatic embedding</Text>
            </View>
            <Text style={styles.cardBody}>{belief.embedding}</Text>
          </View>

          <View style={{ height: 20 }} />

          <Button
            title={already ? 'Received' : 'Let it land'}
            icon={already ? 'checkmark-circle' : 'heart'}
            onPress={acknowledge}
            size="lg"
            haptic="success"
          />
          <View style={{ height: 10 }} />
          <Button
            title="Not now"
            variant="ghost"
            onPress={dismiss}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: 28,
    paddingTop: 16,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  eyebrow: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 2.2,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  statement: {
    fontFamily: fonts.serifItalic,
    fontSize: 34,
    lineHeight: 44,
    color: colors.ink,
    marginBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 22,
    ...shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.doneSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardLabel: {
    ...text.eyebrow,
    marginBottom: 0,
  },
  cardBody: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
});
