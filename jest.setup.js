// AsyncStorage's native module isn't present under jest, and importing it throws.
// Use the package's official in-memory mock so modules that import it can load.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
