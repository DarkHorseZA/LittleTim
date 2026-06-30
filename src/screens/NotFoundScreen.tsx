import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, gradients, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { PulsingMark } from '../components/PulsingMark';
import { BackButton } from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'NotFound'>;

// Dead-link landing. React Navigation routes any unmatched deep link here
// via the `'*'` path in linking.config. Keeps the tone warm: the user
// followed a link that no longer works, we welcome them home rather than
// scold them with a cold 404.
export function NotFoundScreen({ navigation }: Props) {
  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawnDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.navRow}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.content}>
          <View style={styles.markWrap}>
            <PulsingMark size={96} accessibilityLabel="re-Genesis mark" />
          </View>

          <Text style={styles.eyebrow}>Link expired</Text>
          <Text style={styles.title}>{`This page isn\u2019t here anymore.`}</Text>
          <Text style={styles.body}>
            Maybe it moved while you were away, maybe the link was only ever a
            seed. Either way, there is a way home.
          </Text>

          <View style={styles.buttonRow}>
            <Button title="Back to the start" onPress={goHome} size="lg" icon="home" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 320,
    bottom: undefined,
  },
  safe: { flex: 1 },
  navRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screen,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  markWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    ...shadows.md,
  },
  eyebrow: {
    ...text.eyebrow,
    textAlign: 'center',
  },
  title: {
    ...text.h1,
    textAlign: 'center',
    marginTop: 8,
  },
  body: {
    ...text.body,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 28,
  },
  buttonRow: {
    width: '100%',
    alignItems: 'stretch',
  },
});
