export type ChapterInfo = {
  id: number; // 0 = Introduction, 1-9 = chapters
  title: string;
  shortTitle: string;
  eyebrow: string;
  part?: 'One' | 'Two';
};

export const chapters: ChapterInfo[] = [
  {
    id: 0,
    title: 'Introduction',
    shortTitle: 'Intro',
    eyebrow: 'Beginning',
  },
  {
    id: 1,
    title: 'How God is Sewn',
    shortTitle: 'Ch. 1',
    eyebrow: 'Epigenetics & Development',
    part: 'One',
  },
  {
    id: 2,
    title: 'How this God Affects my Health',
    shortTitle: 'Ch. 2',
    eyebrow: 'Psychoneuroimmunology',
    part: 'One',
  },
  {
    id: 3,
    title: 'How this God Affects my Life',
    shortTitle: 'Ch. 3',
    eyebrow: 'The Science of Belief',
    part: 'One',
  },
  {
    id: 4,
    title: 'The Curse That Was Never a Curse',
    shortTitle: 'Ch. 4',
    eyebrow: 'A Re-reading',
    part: 'Two',
  },
  {
    id: 5,
    title: 'The God Who is Not Alone',
    shortTitle: 'Ch. 5',
    eyebrow: 'Spirit and Earth in Love',
    part: 'Two',
  },
  {
    id: 6,
    title: 'Made in Their Image',
    shortTitle: 'Ch. 6',
    eyebrow: 'The Aboriginal Blessing',
    part: 'Two',
  },
  {
    id: 7,
    title: 'Sewing with Love',
    shortTitle: 'Ch. 7',
    eyebrow: 'Your Daily Practice',
    part: 'Two',
  },
  {
    id: 8,
    title: 'When the Old Thread Pulls',
    shortTitle: 'Ch. 8',
    eyebrow: 'Sewing Through Fear',
    part: 'Two',
  },
  {
    id: 9,
    title: 'You Are Not Alone',
    shortTitle: 'Ch. 9',
    eyebrow: 'The Divine Matrix is Someone',
    part: 'Two',
  },
];

export function chapterById(id: number): ChapterInfo | undefined {
  return chapters.find((c) => c.id === id);
}

export const CHAPTER_COUNT = chapters.length;
