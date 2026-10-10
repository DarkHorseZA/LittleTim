import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts as useFraunces,
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { RootNavigator } from './src/navigation/RootNavigator';
import { DayProvider } from './src/store/DayContext';
import { DiscoveryProvider } from './src/store/DiscoveryContext';
import { colors } from './src/theme/colors';
import { ToastHost } from './src/components/Toast';
import { UnsavedNotice } from './src/components/UnsavedNotice';
import { NotificationsManager } from './src/components/NotificationsManager';
import { ReviewManager } from './src/components/ReviewManager';
import { HapticsSync } from './src/components/HapticsSync';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { FatalErrorHandler } from './src/components/FatalErrorHandler';
import { PulsingMark } from './src/components/PulsingMark';

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
      {/* Catches non-render crashes (taps, timers) in production and shows the
          same calm screen instead of closing the app. */}
      <FatalErrorHandler />
    </SafeAreaProvider>
  );
}

function AppInner() {
  const [loaded] = useFraunces({
    Fraunces_400Regular,
    Fraunces_400Regular_Italic,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!loaded) {
    // Calm branded hold while fonts load, never a spinner. PulsingMark is an
    // image, so it needs no font and respects Reduce Motion.
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PulsingMark size={72} accessibilityLabel="Loading re-Genesis" />
      </View>
    );
  }

  return (
    <DayProvider>
      <DiscoveryProvider>
        <StatusBar style="dark" />
        <RootNavigator />
        <ToastHost />
        <UnsavedNotice />
        <NotificationsManager />
        <ReviewManager />
        <HapticsSync />
      </DiscoveryProvider>
    </DayProvider>
  );
}
