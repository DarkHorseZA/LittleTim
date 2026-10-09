jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  performAndroidHapticsAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Rigid: 'rigid' },
  NotificationFeedbackType: { Success: 'success' },
  AndroidHaptics: { Clock_Tick: 'clock', Confirm: 'confirm', Virtual_Key: 'vkey', Toggle_On: 'toggle' },
}));

import * as Haptics from 'expo-haptics';
import { tapFeedback, confirmFeedback, savedFeedback, setHapticsEnabled } from '../feedback';

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

beforeEach(() => jest.clearAllMocks());

describe('feedback (iOS under jest)', () => {
  it('ticks on tap when enabled', async () => {
    setHapticsEnabled(true);
    tapFeedback();
    await flush();
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
  });

  it('is fully silent when disabled', async () => {
    setHapticsEnabled(false);
    tapFeedback();
    confirmFeedback();
    savedFeedback();
    await flush();
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('confirm uses the success notification', async () => {
    setHapticsEnabled(true);
    confirmFeedback();
    await flush();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('never throws even if the engine rejects', async () => {
    setHapticsEnabled(true);
    (Haptics.selectionAsync as jest.Mock).mockRejectedValueOnce(new Error('no engine'));
    expect(() => tapFeedback()).not.toThrow();
    await flush();
  });
});
