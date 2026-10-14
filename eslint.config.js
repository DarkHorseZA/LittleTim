// Flat config, built on Expo's recommended rules.
const expo = require('eslint-config-expo/flat');

module.exports = [
  ...expo,
  {
    rules: {
      // The newest eslint-plugin-react-hooks ships three rules that are very
      // aggressive and false-flag valid React Native patterns (Animated values,
      // PanResponder refs, reading a measured width in render, prefill-from-store
      // effects). We keep them on as warnings so genuine cases stay visible, but
      // they do not block the build.
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react/display-name': 'warn',
    },
  },
  {
    // Build/tooling scripts run in Node, so give them the Node globals rather
    // than linting them as browser code (otherwise `__dirname` etc. are undef).
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
  {
    ignores: [
      'dist/*',
      'web-build/*',
      '.expo/*',
      'node_modules/*',
      'ios/*',
      'android/*',
      'backend/*', // PHP, not JS
      'plugins/*', // config plugins
      'babel.config.js',
      'metro.config.js',
      'jest.config.js',
      'jest.setup.js',
      'eslint.config.js',
      'knip.json',
    ],
  },
];
