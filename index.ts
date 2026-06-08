import { Platform } from 'react-native';
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
