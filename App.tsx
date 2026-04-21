import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { DayProvider } from './src/store/DayContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <DayProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </DayProvider>
    </SafeAreaProvider>
  );
}
