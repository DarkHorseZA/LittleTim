import { isChapterUnlocked } from '../chapters';

describe('isChapterUnlocked', () => {
  it('always unlocks the Introduction (chapter 0)', () => {
    expect(isChapterUnlocked(0, null)).toBe(true);
    expect(isChapterUnlocked(0, undefined)).toBe(true);
    expect(isChapterUnlocked(0, 5)).toBe(true);
  });

  it('unlocks everything once the book is completed', () => {
    expect(isChapterUnlocked(9, 1, true)).toBe(true);
    expect(isChapterUnlocked(5, null, true)).toBe(true);
  });

  it('locks chapters when no current chapter is set', () => {
    expect(isChapterUnlocked(1, null)).toBe(false);
    expect(isChapterUnlocked(1, undefined)).toBe(false);
  });

  it('unlocks chapters at or below the current chapter', () => {
    expect(isChapterUnlocked(3, 3)).toBe(true);
    expect(isChapterUnlocked(2, 3)).toBe(true);
    expect(isChapterUnlocked(4, 3)).toBe(false);
  });
});
