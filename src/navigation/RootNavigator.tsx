import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  LinkingOptions,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, TabsParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { PracticeDetailScreen } from '../screens/PracticeDetailScreen';
import { TriggerDetailScreen } from '../screens/TriggerDetailScreen';
import { BeliefScreen } from '../screens/BeliefScreen';
import { TrackerScreen } from '../screens/TrackerScreen';
import { FocusAreaScreen } from '../screens/FocusAreaScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { EmailSignupScreen } from '../screens/EmailSignupScreen';
import { HowToUseScreen } from '../screens/HowToUseScreen';
import { MorningRitualScreen } from '../screens/MorningRitualScreen';
import { JournalHistoryScreen } from '../screens/JournalHistoryScreen';
import { JournalPostScreen } from '../screens/JournalPostScreen';
import { GlossaryScreen } from '../screens/GlossaryScreen';
import { ConnectScreen } from '../screens/ConnectScreen';
import { NotFoundScreen } from '../screens/NotFoundScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { ChapterCheckInGate } from '../components/ChapterCheckInGate';
import { colors, layout } from '../theme/colors';
import { fonts } from '../theme/type';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

// Deep-link config. Paths mirror the in-app IA so screens are shareable via URL
// on the web deploy at /LittleTim/v2/.
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['littletim://', 'https://darkhorseza.github.io/LittleTim/v2/'],
  config: {
    screens: {
      Welcome: '',
      HowToUse: 'how-to-use',
      Tabs: {
        path: 'app',
        screens: {
          Today: 'today',
          Practice: 'practice',
          Journal: {
            path: 'journal',
            screens: {
              // initialTab param is carried via the URL query string automatically
            },
          },
          More: 'more',
        },
      },
      Belief: 'belief',
      PracticeDetail: 'practice/:practiceId',
      TriggerDetail: 'when/:triggerId',
      Tracker: 'tracker',
      FocusArea: 'focus/:focusArea',
      Account: 'account',
      MorningRitual: 'ritual',
      Glossary: 'glossary',
      Connect: 'connect',
      Settings: 'settings',
      // NotFound is programmatically navigable (no public path). Leaving
      // it unwired from the URL map keeps the root path '' reserved for
      // Welcome. Unrecognised URLs fall back to Welcome via initialRouteName.
      NotFound: 'not-found',
    },
  },
};

type IconName = keyof typeof Ionicons.glyphMap;

const tabIcon =
  (active: IconName, inactive: IconName) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) =>
    (
      <Ionicons
        name={focused ? active : inactive}
        size={size - 2}
        color={color}
      />
    );

function TabsNavigator() {
  // Respect the bottom safe-area inset so the tab bar clears the Android system
  // nav (gesture pill / 3-button) and the iPhone home indicator. Edge-to-edge
  // (Expo SDK 52 / Android 15) draws content under the system bars, so a fixed
  // tabBarStyle height would otherwise let the system nav overlap the labels.
  const insets = useSafeAreaInsets();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.clayDeep,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.lineSoft,
          paddingTop: 6,
          height: 68 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansSemi,
          fontSize: 11,
          letterSpacing: 0.6,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="Today"
        component={HomeScreen as any}
        options={{
          tabBarIcon: tabIcon('sunny', 'sunny-outline'),
          tabBarAccessibilityLabel: 'Today, ritual and daily practices',
        }}
      />
      <Tabs.Screen
        name="Practice"
        component={PracticeScreen as any}
        options={{
          tabBarIcon: tabIcon('leaf', 'leaf-outline'),
          tabBarAccessibilityLabel: 'Practice, MSG, SEE, and WHEN gestures',
        }}
      />
      <Tabs.Screen
        name="Journal"
        component={JournalHistoryScreen as any}
        options={{
          tabBarLabel: 'Journal',
          tabBarIcon: tabIcon('create', 'create-outline'),
          tabBarAccessibilityLabel: 'Journal, tonight’s stitch and your quilt',
        }}
      />
      <Tabs.Screen
        name="More"
        component={MoreScreen as any}
        options={{
          tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
            <Ionicons
              name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'}
              size={size + 4}
              color={color}
            />
          ),
          tabBarLabel: () => null,
          tabBarAccessibilityLabel: 'More, settings, glossary and connect',
        }}
      />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const navRef = useNavigationContainerRef<RootStackParamList>();
  const [topRoute, setTopRoute] = useState<string | undefined>(undefined);

  // Track the top-level stack route so the chapter check-in only fires once the
  // reader is inside the app (Tabs), not over the Welcome splash.
  const syncRoute = useCallback(() => {
    const state = navRef.getRootState?.();
    if (state && typeof state.index === 'number') {
      setTopRoute(state.routes[state.index]?.name);
    }
  }, [navRef]);

  const content = (
    <NavigationContainer
      ref={navRef}
      linking={linking}
      onReady={syncRoute}
      onStateChange={syncRoute}
    >
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="EmailSignup"
          component={EmailSignupScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="HowToUse"
          component={HowToUseScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="Tabs" component={TabsNavigator} />
        <Stack.Screen
          name="Belief"
          component={BeliefScreen}
          options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="PracticeDetail"
          component={PracticeDetailScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="TriggerDetail"
          component={TriggerDetailScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="Tracker"
          component={TrackerScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="FocusArea"
          component={FocusAreaScreen}
          options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="MorningRitual"
          component={MorningRitualScreen}
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="Glossary"
          component={GlossaryScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="Connect"
          component={ConnectScreen}
          options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ presentation: 'modal', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="JournalPost"
          component={JournalPostScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  const gate = <ChapterCheckInGate active={topRoute === 'Tabs'} />;

  // On web, center a phone-sized viewport so the app feels like an app, not a
  // stretched web page. On native, this wrapper is transparent. The gate sits
  // above the navigation tree so it overlays the whole phone frame.
  if (Platform.OS === 'web') {
    return (
      <View style={webStyles.outer}>
        <View style={webStyles.inner}>
          {content}
          {gate}
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      {content}
      {gate}
    </View>
  );
}

const webStyles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxWidth,
    backgroundColor: colors.bg,
    // Soft vertical edge so the phone viewport sits on the oat background.
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
});
