import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, layout, shadows } from '../theme/colors';
import { text } from '../theme/type';
import { BackButton } from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'JournalPost'>;

export function JournalPostScreen({ navigation, route }: Props) {
  const { url, title } = route.params;
  const [loading, setLoading] = useState(true);

  // On web, react-native-webview becomes an iframe. Many sites disallow being
  // framed, so the iframe renders blank. There we open the post in a new tab and
  // close the modal instead. This is a genuinely platform-specific API.
  useEffect(() => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      navigation.goBack();
    }
  }, [url, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <BackButton
          variant="solid"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Close post"
        />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.spacer} />
      </View>

      {Platform.OS === 'web' ? (
        <View style={styles.center}>
          <Text style={styles.fallback}>Opening in a new tab…</Text>
        </View>
      ) : (
        <View style={styles.webWrap}>
          <WebView
            source={{ uri: url }}
            onLoadEnd={() => setLoading(false)}
            startInLoadingState
            style={styles.web}
          />
          {loading ? (
            <View style={styles.center} pointerEvents="none">
              <ActivityIndicator color={colors.clay} />
            </View>
          ) : null}
        </View>
      )}
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 12,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  title: {
    ...text.h2,
    flex: 1,
    marginBottom: 0,
  },
  // Balances the BackButton so the title centres optically with room to spare.
  spacer: {
    width: 44,
    height: 44,
  },
  webWrap: {
    flex: 1,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    ...shadows.sm,
  },
  web: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    ...text.body,
    color: colors.inkFaint,
  },
});
