jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  requestReview: jest.fn().mockResolvedValue(undefined),
}));

import { reachedReviewMoment, REVIEW_STITCH_THRESHOLD } from '../review';

const base = {
  ready: true,
  isWeb: false,
  ratingAsked: false,
  grew: true,
  stitches: REVIEW_STITCH_THRESHOLD,
};

describe('reachedReviewMoment (good moment to ask)', () => {
  it('asks when a fresh stitch pushes past the threshold', () => {
    expect(reachedReviewMoment(base)).toBe(true);
  });

  it('never asks on a cold start (quilt did not just grow)', () => {
    expect(reachedReviewMoment({ ...base, grew: false })).toBe(false);
  });

  it('waits until enough stitches have been sewn', () => {
    expect(
      reachedReviewMoment({ ...base, stitches: REVIEW_STITCH_THRESHOLD - 1 })
    ).toBe(false);
  });

  it('asks at most once', () => {
    expect(reachedReviewMoment({ ...base, ratingAsked: true })).toBe(false);
  });

  it('never asks before hydration or on web', () => {
    expect(reachedReviewMoment({ ...base, ready: false })).toBe(false);
    expect(reachedReviewMoment({ ...base, isWeb: true })).toBe(false);
  });
});
