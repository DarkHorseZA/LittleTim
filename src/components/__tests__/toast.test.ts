// The toast queue pairs a gentle feel with success messages at the moment they
// are raised. These tests pin the rule: success gets a feel (saved by default,
// confirm when asked, none when opted out); errors and info never buzz.
jest.mock('../feedback', () => ({
  savedFeedback: jest.fn(),
  confirmFeedback: jest.fn(),
}));

import { savedFeedback, confirmFeedback } from '../feedback';
import { toast } from '../Toast';

// Fake timers so the auto-dismiss setTimeout each toast schedules doesn't keep
// a handle open past the test.
beforeAll(() => jest.useFakeTimers());
afterAll(() => jest.useRealTimers());
beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.runOnlyPendingTimers());

describe('toast → haptic pairing', () => {
  it('a plain success nods with the saved feel', () => {
    toast('Stitch saved, your quilt grows.', 'success');
    expect(savedFeedback).toHaveBeenCalledTimes(1);
    expect(confirmFeedback).not.toHaveBeenCalled();
  });

  it('a milestone success can ask for the warmer confirm feel', () => {
    toast('Lovely.', 'success', { haptic: 'confirm' });
    expect(confirmFeedback).toHaveBeenCalledTimes(1);
    expect(savedFeedback).not.toHaveBeenCalled();
  });

  it('a success can opt out when the press already gave the feel', () => {
    toast('Beautifully sewn.', 'success', { haptic: 'none' });
    expect(savedFeedback).not.toHaveBeenCalled();
    expect(confirmFeedback).not.toHaveBeenCalled();
  });

  it('errors never buzz', () => {
    toast('Something slipped.', 'error');
    expect(savedFeedback).not.toHaveBeenCalled();
    expect(confirmFeedback).not.toHaveBeenCalled();
  });

  it('info never buzzes', () => {
    toast('Just so you know.', 'info');
    expect(savedFeedback).not.toHaveBeenCalled();
    expect(confirmFeedback).not.toHaveBeenCalled();
  });
});
