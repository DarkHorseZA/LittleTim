// jest-expo gives us the Expo/React Native transform + environment. We keep
// tests alongside the code they cover, in __tests__ folders or *.test.ts(x).
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
};
