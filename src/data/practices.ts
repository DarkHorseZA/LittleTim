import { Practice } from '../types';
import { msgTranscripts, msgPageMarkers } from './meditationTranscripts';

// 10 MSGs and 10 SEEs, one of each per chapter (Introduction + Chapters 1-9).
// Titles and step copy are distilled from the manuscript's practice sections.
// Short, app-sized cues. Attribution lives in Settings.

export const msgPractices: Practice[] = [
  {
    id: 'msg-intro',
    chapter: 0,
    kind: 'MSG',
    title: 'Six Words, Six Gestures',
    durationMin: 5,
    cue: 'Your first gesture of the re-Genesis process.',
    steps: [
      'Sit comfortably in a safe space. Close your eyes. Breathe.',
      'Hands on your knees, palms down. Whisper: “Safe. I am safe.”',
      'Hands to your belly. Whisper: “Worthy. I am worthy.”',
      'Hands to your heart, one on top of the other. Tap lightly. Whisper: “Love. I am Love.”',
      'Raise arms high. Move them gently. Whisper: “Spirit. I am spirit.”',
      'Hands to your face, covering your eyes. Rub softly to your cheeks. Whisper: “Earth. I am earth.”',
      'Palms together at the heart. Three light claps. Whisper: “Let there be me.”',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-intro.mp3'),
      duration: 194,
    },
  },
  {
    id: 'msg-ch1',
    chapter: 1,
    kind: 'MSG',
    title: 'I Am. I Will. Let There Be.',
    durationMin: 6,
    cue: 'The six words of the Introduction, expanded with three power-codes.',
    steps: [
      'Sit. Hands on knees, palms down. Rub from knee up along thigh. Whisper: “I am safe. I will safety. I let there be safety.”',
      'Hands to your belly. Slow clockwise circle around the navel. Whisper: “I am worthy. I will worthiness. I let there be worthiness.”',
      'Hands to heart, one on the other. Feel the beat. Whisper: “I am Love. I will Love. I let there be Love.”',
      'Arms high. Palms together above your head. Three claps. Whisper: “I am spirit. I will spirit. I let there be spirit.”',
      'Hands to face. Rub from eyes to chin. Bring palms together at the heart. Three claps. Whisper: “I am earth. I will earth. I let there be earth.”',
      'Open hands into a bowl and lift to eye height, receiving. Whisper: “I agree. I accept. I allow Love. I welcome Love.”',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-ch1.mp3'),
      duration: 314,
    },
  },
  {
    id: 'msg-ch2',
    chapter: 2,
    kind: 'MSG',
    title: 'I Am Willing Love',
    durationMin: 5,
    cue: 'One word. Seven gestures. Love becomes the instruction to your body.',
    steps: [
      'Sit. Close your eyes. Hands open on your knees, palms up. Focus on your heart.',
      'Non-dominant hand on your heart. Whisper: “I am willing Love.”',
      'Rub from heart down over your belly. Whisper: “I am willing Love.”',
      'Switch hands. Rub from heart to belly again. Whisper again.',
      'Non-dominant hand on the opposite shoulder. Rub down the arm to the fingertips, like rubbing on an ointment of Love. Whisper.',
      'Repeat with the other hand and arm.',
      'A palm on each cheek. Feel the temperature. Whisper.',
      'Palms together at the heart. Deep breath. Whisper one final time.',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-ch2.mp3'),
      duration: 264,
    },
  },
  {
    id: 'msg-ch3',
    chapter: 3,
    kind: 'MSG',
    title: 'Remember Creating from Love',
    durationMin: 4,
    cue: 'Breath and memory, meeting behind your eyes.',
    steps: [
      'Sit comfortably. Hands open on your legs, palms up. Slow your breath.',
      'Breathe in through your nose, up to the space just behind your eyes. Hold there a moment, gaze gently in that direction.',
      'Release through your mouth, opening wide. Let the breath fall to the space between your hips.',
      'Keep this rhythm. Whisper: “I am willing to remember creating from Love.”',
      'Each time the breath gathers behind your eyes, look. Notice a picture, a word, a colour, a texture.',
      'Feel your body relax. If nothing comes, no worry. Repetition is how we resew.',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-ch3.mp3'),
      duration: 218,
    },
  },
  {
    id: 'msg-ch4',
    chapter: 4,
    kind: 'MSG',
    title: 'I Am Earth, Wrapped in Light',
    durationMin: 3,
    cue: 'Returning to earth is homecoming, not punishment.',
    steps: [
      'Sit comfortably. Close your eyes.',
      'Both hands on your belly, where you were first held as earth. Breathe in through your nose, out through your mouth.',
      'Whisper: “I am earth.”',
      'Feel the ground under you, floor, soil, foundation. Whisper: “I came from earth. I return to earth. It is not a curse. She is home. I recognize my Self.”',
      'One hand moves to your heart. Whisper: “The breath in me is the breath of lives. I have always been. I will always be.”',
      'Breathe once more. Whisper: “I am wrapped in light.” Stay for a few breaths.',
      'Through your day, when you eat, whisper quietly: “It is awesome to be Earth.”',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-ch4.mp3'),
      duration: 280,
    },
  },
  {
    id: 'msg-ch5',
    chapter: 5,
    kind: 'MSG',
    title: 'I Let Go. I Resew with Love.',
    durationMin: 3,
    cue: 'One gesture, repeated, unraveling shame, guilt, blame.',
    steps: [
      'Sit. Close your eyes. Both hands on your heart.',
      'Open your arms out wide, as if letting something out. Whisper: “I let go of shame.”',
      'Return hands to your heart. Whisper: “I resew with Love.”',
      'Repeat with “guilt”. Out, then back in. Resew with Love.',
      'Repeat with “blame”. Out, then back in. Resew with Love.',
      'Feel the sensations. Feel the emotion shift. You are already writing a new story.',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-ch5.mp3'),
      duration: 290,
    },
  },
  {
    id: 'msg-ch6',
    chapter: 6,
    kind: 'MSG',
    title: 'I Am Not Alone',
    durationMin: 2,
    cue: 'The Aboriginal Blessing, received, not earned.',
    steps: [
      'Sit. Close your eyes.',
      'Hands on your heart. Whisper: “I am not alone. I am from Love.”',
      'Hands on your belly. Whisper: “I am male and female, both, whole.”',
      'Hands on your face. Whisper: “I am blessed. I am very good.”',
      'Breathe. Stay. Remember.',
      'Through your day, touch your face and let the cool of your hand remind you: “I am blessed, infused with permission and power.”',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-ch6.mp3'),
      duration: 272,
    },
  },
  {
    id: 'msg-ch7',
    chapter: 7,
    kind: 'MSG',
    title: 'The Five Gestures',
    durationMin: 1,
    cue: 'The re-Genesis daily practice, feel, whisper, touch, breathe, bless.',
    steps: [
      'Hand on heart. Whisper: “I feel.” Let whatever is there, be there.',
      'Whisper: “Let there be…” and name whatever you feel.',
      'Touch your hands together, one small action, a touch of emotion.',
      'Three breaths. Whisper: “I breathe the breath of Lives.”',
      'Hand on heart. Whisper: “I am blessed. I may. I can.”',
      'Open your eyes. Go sew your day.',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-ch7.mp3'),
      duration: 292,
    },
  },
  {
    id: 'msg-ch8',
    chapter: 8,
    kind: 'MSG',
    title: 'I Sew When It Is Hard',
    durationMin: 2,
    cue: 'For moments the old thread pulls.',
    steps: [
      'Sit. Close your eyes. Hand on your heart.',
      'Whisper: “I am safe. I am earth. I am wrapped in light.” Take one breath.',
      'Recall a moment today when fear, shame, or forgetting pulled at you. Don’t judge. Just let it be present.',
      'Whisper: “I am not that feeling. I am the one who feels it.” Take another breath.',
      'Whisper: “I sew one stitch, right here, right now.”',
      'Other hand on your belly. Feel Love, feel Love’s warmth. See Love in that moment. A final breath. That was a stitch.',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-ch8.mp3'),
      duration: 378,
    },
  },
  {
    id: 'msg-ch9',
    chapter: 9,
    kind: 'MSG',
    title: 'I Am Love, Creating, Not Alone',
    durationMin: 2,
    cue: 'The Divine Matrix is Someone, weaving with you.',
    steps: [
      'Sit. Close your eyes.',
      'Hands on your heart. Whisper: “I am not alone.”',
      'Hands on your belly. Whisper: “Earth is my mother. I am held.”',
      'Hands on your chest, over your lungs. Whisper: “Spirit breathes with me. I am not alone.”',
      'Reach one hand out beside you, as if touching Someone there. Whisper: “They are here. They are weaving with me.”',
      'Both hands back to your heart. Whisper: “I am Love, creating, and I am not alone.”',
    ],
    audio: {
      source: require('../../assets/audio/meditations/msg-ch9.mp3'),
      duration: 322,
    },
  },
];

// Attach the generated timed transcripts + section markers to each MSG that has
// a recording. Kept out-of-line (in meditationTranscripts.ts) because the data
// is auto-generated and bulky; this keeps the practice definitions readable.
for (const p of msgPractices) {
  if (p.audio) {
    p.audio.pageMarkers = msgPageMarkers[p.id];
    p.audio.transcript = msgTranscripts[p.id];
  }
}

export const seePractices: Practice[] = [
  {
    id: 'see-intro',
    chapter: 0,
    kind: 'SEE',
    title: 'Two-Colour Dialogue',
    durationMin: 8,
    cue: 'Your earth has answers. Invite your body to reply.',
    steps: [
      'Gather paper and two pens of different colours.',
      'With your dominant hand, in one colour, write: “Are we safe?”',
      'Switch pens and hands. With your non-dominant hand, in the other colour, write whatever answer arrives. Nod your head. Acknowledge.',
      'Repeat: “Are we worthy?” Write, switch, answer, nod.',
      'Repeat: “Are we willing to unravel the coarse black thread?” Answer, nod.',
      'If the answer was yes, write “thank you.” If no, write “I invite us. I want at-one-ment.” Allow a second reply.',
      'Jot down any sensations or emotions you noticed. Don’t analyse.',
    ],
  },
  {
    id: 'see-ch1',
    chapter: 1,
    kind: 'SEE',
    title: 'The Five Senses',
    durationMin: 10,
    cue: 'Engage your five senses to wake your sixth.',
    steps: [
      'Gather: a box of matches, a candle, an uncut fruit, a facecloth, a bowl of cold water.',
      'In private, pick up the matchbox. Feel its texture. Smell it. Shake it, listen. Slide it open slowly.',
      'Take a match. Feel the stick and head. Strike it. Watch the flame. Light the candle. Watch the wax pool.',
      'Put your hand on your heart. Say: “I am willing to feel.” Note what you felt.',
      'Repeat with the uncut fruit, pick up, smell, touch, bite or peel, taste, hear.',
      'Repeat with the facecloth and cold water, dunk, wring, wipe your face gently, repeat.',
      'Note what you felt. What reactions arose. Any memories.',
    ],
  },
  {
    id: 'see-ch2',
    chapter: 2,
    kind: 'SEE',
    title: 'Two Photographs',
    durationMin: 8,
    cue: 'Meet the little you, and the you of now.',
    steps: [
      'Print two portraits of yourself: one recent, one from when you were 4 to 7 years old.',
      'Place them face-down side by side. Turn the childhood photo up. Look softly.',
      'Remember the clothes, sounds, smells, feelings of that time. Notice your body’s response.',
      'Thank the little you, for keeping you, so you could be here now.',
      'Turn that photo over. Turn the recent one up. Look at your own eyes. Ask: “What’s different? What do I long for?” Don’t filter.',
      'Turn both photos face up. Look between them slowly. Feel.',
      'Ask them: “What do we have in common?” If nothing arrives, whisper: “Earth. We have our earth in common.”',
      'Thank both, for bringing you to this moment. Make notes.',
    ],
  },
  {
    id: 'see-ch3',
    chapter: 3,
    kind: 'SEE',
    title: 'Draw Yourself, Circled',
    durationMin: 6,
    cue: 'Simple, childlike, powerful.',
    steps: [
      'Gather a piece of white paper, a pencil, and a few coloured crayons.',
      'In the middle, draw yourself, a stick figure is perfect.',
      'Look at the face you drew. Smiling or frowning? Ask softly: why?',
      'Choose a crayon. Draw a thick circle around yourself. Feel the texture and smell.',
      'At the bottom of the circle, in another colour, write SAFE. Say: “I am safe.” Smile.',
      'At the top, in a third colour, write LOVE. Say: “I am loved.”',
      'On the right, write REST. Say: “It is safe to rest.”',
      'On the left, write BE ME. Say: “I am loved for me. I will rest. I will be me.”',
      'Note any emotion shift, memory, or image.',
    ],
  },
  {
    id: 'see-ch4',
    chapter: 4,
    kind: 'SEE',
    title: 'Barefoot, Outside',
    durationMin: 10,
    cue: '“You are earth, I am earth, we are earth, we are home.”',
    steps: [
      'Set aside daytime, before work, a lunch break, or a weekend morning.',
      'Go outside: park, garden, forest. Take off your shoes and socks. Be willing to get your hands dirty.',
      'Feel the sun on your face. Say quietly to the sun: “You are earth. I am earth. We are home.”',
      'Feel the grass or soil under your feet. Wiggle your toes. Say it to the grass.',
      'Find a tree. See. Touch. Smell. Listen. Say it to the tree.',
      'A flower. A bug. A breeze. Water. Say it to each.',
      'Before you leave, kneel. Grab a handful of soil. Rub it between your hands. Whisper: “I come from you. I always return to you. I am earth, from earth.”',
      'When you eat today, remember: “It is awesome to be Earth.”',
    ],
  },
  {
    id: 'see-ch5',
    chapter: 5,
    kind: 'SEE',
    title: 'Love Letter to Yourself',
    durationMin: 20,
    cue: 'Write only beautiful, adoring things.',
    steps: [
      'Find writing paper and a pen. Give yourself uninterrupted time.',
      'Begin a letter to yourself. Only beautiful things. Your grace, kindness, beauty. Moments of joy. Pride. Honour.',
      'Write at least two pages. Hear the pen on paper. Smell the ink. Let any grief, warmth, or sadness arrive.',
      'Sign off: “With the deepest Love, [your name]” and today’s date.',
      'Read the whole letter aloud to yourself. Feel.',
      'Through the day, when a shaming word rises, remember the signature. Whisper it to yourself.',
    ],
  },
  {
    id: 'see-ch6',
    chapter: 6,
    kind: 'SEE',
    title: 'Bless the Room',
    durationMin: 6,
    cue: 'Permission and ability, given freely.',
    steps: [
      'Choose a place where you feel at ease, your home, office, a park.',
      'Move slowly through it. At every thing, phone, chair, cup, pet, person, this book, kneel or pause.',
      'Touch it gently. Say: “I am blessed. I bless you.”',
      'Fill the words with permission and ability to be exactly who they are, like the waters in the beginning, like the sky.',
      'When you are done, note what you felt on your body and in your heart. Note any emotion shift.',
    ],
  },
  {
    id: 'see-ch7',
    chapter: 7,
    kind: 'SEE',
    title: 'Today I Will Sew',
    durationMin: 3,
    cue: 'One sentence a day, for a week.',
    steps: [
      'Each morning, after the Five Gestures, write one sentence: “Today I will sew with love when I…”',
      'Examples: “…speak kindly to myself”, “…listen without interrupting”, “…take a deep breath before I answer.”',
      'At the end of the day, tick it if you did it. No judgement if you didn’t, just notice.',
      'After seven days, look back. A new pattern will already be showing.',
    ],
  },
  {
    id: 'see-ch8',
    chapter: 8,
    kind: 'SEE',
    title: 'The Patchwork Journal',
    durationMin: 4,
    cue: 'Two sentences, every night.',
    steps: [
      'Each evening, before sleep, write two short sentences.',
      '1. “Today I sewed with love when I…”',
      '2. “Today, when the old thread pulled, I…”',
      'Keep them honest. Don’t try to be eloquent.',
      'At the end of the week, read them aloud. Whisper: “I am learning. I am stitching. I am not alone.”',
    ],
  },
  {
    id: 'see-ch9',
    chapter: 9,
    kind: 'SEE',
    title: 'Visible and Invisible Squares',
    durationMin: 8,
    cue: 'You sew some squares. They sew the rest.',
    steps: [
      'On paper, draw a simple patchwork quilt, a grid of squares.',
      'In the centre squares (visible), write things you have consciously created with love this week.',
      'Around the edges (out of sight), write things that have happened to you or for you, unexpected kindnesses, synchronicities, healings, doors that opened.',
      'Look at the whole quilt. Notice how visible and invisible squares are woven together.',
      'Whisper: “I sewed some of these. They sewed the others. Together, we made this.” Thank Them.',
    ],
  },
];

export function allPractices(): Practice[] {
  return [...msgPractices, ...seePractices];
}

export function findPractice(id?: string): Practice | undefined {
  if (!id) return undefined;
  return allPractices().find((p) => p.id === id);
}

export function practiceForChapter(
  kind: 'MSG' | 'SEE',
  chapter: number
): Practice | undefined {
  const list = kind === 'MSG' ? msgPractices : seePractices;
  return list.find((p) => p.chapter === chapter);
}
