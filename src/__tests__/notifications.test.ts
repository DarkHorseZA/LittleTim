// The module calls Notifications.setNotificationHandler at import, so the
// native module needs a stub even though shouldOfferReminder itself is pure.
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

import { shouldOfferReminder } from '../notifications';

const base = {
  ready: true,
  isWeb: false,
  status: 'undetermined',
  notifyOffered: false,
  stitches: 1,
};

describe('shouldOfferReminder (earned moment)', () => {
  it('offers once the reader has sewn a stitch and the OS has not been asked', () => {
    expect(shouldOfferReminder(base)).toBe(true);
  });

  it('waits until at least one stitch exists', () => {
    expect(shouldOfferReminder({ ...base, stitches: 0 })).toBe(false);
  });

  it('never offers before hydration', () => {
    expect(shouldOfferReminder({ ...base, ready: false })).toBe(false);
  });

  it('never offers on web', () => {
    expect(shouldOfferReminder({ ...base, isWeb: true })).toBe(false);
  });

  it('never offers twice', () => {
    expect(shouldOfferReminder({ ...base, notifyOffered: true })).toBe(false);
  });

  it('never offers once the OS has already decided (granted or denied)', () => {
    expect(shouldOfferReminder({ ...base, status: 'granted' })).toBe(false);
    expect(shouldOfferReminder({ ...base, status: 'denied' })).toBe(false);
  });
});
