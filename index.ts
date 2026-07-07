import { Dimensions, Platform, StyleSheet } from 'react-native';

// Monkey-patch StyleSheet.create at the entrypoint (before any screen module
// runs) so every hard-coded fontSize / lineHeight in the app auto-scales on
// tablet-sized launches. Baking the scale here is the one place we can lift
// every screen's local StyleSheet.create typography without hunting individual
// files. Only fontSize + lineHeight get touched; spacing, widths, and colors
// pass through untouched. Threshold + factor tuned so phone stays identical
// and iPad reads at the proper canvas size.
const IPAD_TYPE_SCALE = 1.28;
const LAUNCH_WIDTH = Dimensions.get('window').width;
if (LAUNCH_WIDTH >= 700) {
  const originalCreate = StyleSheet.create.bind(StyleSheet);
  (StyleSheet as any).create = (styles: any) => {
    const scaled: any = {};
    for (const key in styles) {
      const s = styles[key];
      if (s && typeof s === 'object' && !Array.isArray(s)) {
        const patched: any = { ...s };
        if (typeof patched.fontSize === 'number') {
          patched.fontSize = Math.round(patched.fontSize * IPAD_TYPE_SCALE);
        }
        if (typeof patched.lineHeight === 'number') {
          patched.lineHeight = Math.round(patched.lineHeight * IPAD_TYPE_SCALE);
        }
        scaled[key] = patched;
      } else {
        scaled[key] = s;
      }
    }
    return originalCreate(scaled);
  };
}

import { registerRootComponent } from 'expo';
import App from './App';

if (Platform.OS === 'web') {
  require('@expo/metro-runtime');

  // Hide native-looking scrollbars on the web build. React Native Web renders
  // scroll containers as divs with overflow:scroll; the bars look out of place
  // in a touch-app aesthetic. Scrolling itself is unaffected.
  const style = document.createElement('style');
  style.textContent = `
    * {
      scrollbar-width: none;        /* Firefox */
      -ms-overflow-style: none;     /* IE / Edge legacy */
    }
    *::-webkit-scrollbar {
      display: none;                /* Chrome / Safari / Chromium */
    }
  `;
  document.head.appendChild(style);
}

registerRootComponent(App);
