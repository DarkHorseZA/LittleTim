import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabsParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { PracticeDetailScreen } from '../screens/PracticeDetailScreen';
import { BeliefScreen } from '../screens/BeliefScreen';
import { TrackerScreen } from '../screens/TrackerScreen';
import { FocusAreaScreen } from '../screens/FocusAreaScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

function TabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.line,
          paddingTop: 4,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen
        name="Today"
        component={HomeScreen as any}
        options={{ tabBarIcon: iconFor('☀︎') }}
      />
      <Tabs.Screen
        name="Practice"
        component={PracticeScreen as any}
        options={{ tabBarIcon: iconFor('◉') }}
      />
      <Tabs.Screen
        name="History"
        component={HistoryScreen as any}
        options={{ tabBarIcon: iconFor('☰') }}
      />
      <Tabs.Screen
        name="Settings"
        component={SettingsScreen as any}
        options={{ tabBarIcon: iconFor('⚙︎') }}
      />
    </Tabs.Navigator>
  );
}

function iconFor(symbol: string) {
  return ({ color }: { color: string }) => (
    <Text style={{ color, fontSize: 18 }}>{symbol}</Text>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Tabs" component={TabsNavigator} />
        <Stack.Screen
          name="Belief"
          component={BeliefScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="PracticeDetail"
          component={PracticeDetailScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="Tracker"
          component={TrackerScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="FocusArea"
          component={FocusAreaScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
