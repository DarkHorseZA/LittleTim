import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
import { fonts } from '../theme/type';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

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
          height: 68,
          paddingBottom: 10,
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
        }}
      />
      <Tabs.Screen
        name="Practice"
        component={PracticeScreen as any}
        options={{
          tabBarIcon: tabIcon('leaf', 'leaf-outline'),
        }}
      />
      <Tabs.Screen
        name="History"
        component={HistoryScreen as any}
        options={{
          tabBarIcon: tabIcon('calendar', 'calendar-outline'),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={SettingsScreen as any}
        options={{
          tabBarIcon: tabIcon('settings', 'settings-outline'),
        }}
      />
    </Tabs.Navigator>
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
          options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
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
          options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
