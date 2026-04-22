import { TriggerGesture } from '../types';

// Trigger-specific gestures, distilled from T's "Gesture Library" (Instagram)
// and kept in the voice of the book. Chapter gates align with the book's arc
// so each gesture is unlocked when the reader has reached that chapter.
//
// Five-gesture pattern (feel, whisper, touch, breathe, bless) is the spine.
// Steps are short, body-led, and paraphrased, never lifted verbatim.
//
// Unlock rule: settings.currentChapter >= chapter. Chapter 0 always unlocked.

export const triggerGestures: TriggerGesture[] = [
  // — Chapter 0: Introduction, always unlocked —
  {
    id: 'tr-alchemy',
    chapter: 0,
    theme: 'Why this works',
    title: 'The Alchemy of Somatic Gesturing',
    trigger: 'When I want to understand why this works',
    durationMin: 2,
    framing:
      'The body learned belief before the mind learned words. A gesture speaks in the body\u2019s first language. You are not \u201Cjust doing a movement,\u201D you are re-sewing a memory.',
    steps: [
      'Sit. Close your eyes. Hand on your heart.',
      'Whisper: \u201CMy body listens. My body remembers.\u201D',
      'Breathe in slowly. Rub one palm over the other. Feel the warmth.',
      'Whisper: \u201CA gesture is a prayer the body can hear.\u201D',
      'Open your eyes. One small action today will be your next stitch.',
    ],
  },

  // — Chapter 1: How God is Sewn —
  {
    id: 'tr-worthiness',
    chapter: 1,
    theme: 'Worthiness',
    title: 'I Am Worthy, Because I Am',
    trigger: 'When I feel unworthy',
    durationMin: 2,
    framing:
      'Worth was sewn into you before you could earn anything. The thread that says \u201Cnot enough\u201D was handed to you. You did not weave it. You can set it down.',
    steps: [
      'Sit. Both hands on your belly, where you were first held.',
      'Whisper: \u201CI am worthy. I was worthy before I did a thing.\u201D',
      'Slow clockwise circle around the navel. Breathe low and full.',
      'Move one hand to your heart. Whisper: \u201CI will worthiness. I let there be worthiness.\u201D',
      'Stay for three breaths. Let the belly warmth travel up to the chest.',
    ],
  },
  {
    id: 'tr-self-acceptance',
    chapter: 1,
    theme: 'Self-Acceptance',
    title: 'The Golden Seamstress',
    trigger: 'When I cannot accept myself',
    durationMin: 3,
    framing:
      'There is a seamstress inside you. Her thread is gold. She does not discard the old cloth, she sews beside it, softening what was once sharp.',
    steps: [
      'Sit. Hands resting open on your lap, palms up.',
      'Picture a gold thread at your fingertips. Whisper: \u201CI am already sewn with Love.\u201D',
      'Draw one hand slowly over the other, as if pulling a thread across cloth.',
      'Whisper: \u201CI accept the me who is here. I accept the me who is becoming.\u201D',
      'Palms together at the heart. Three light claps. \u201CThank you, seamstress.\u201D',
    ],
  },

  // — Chapter 2: How this God Affects my Health —
  {
    id: 'tr-affect-past',
    chapter: 2,
    theme: 'Biography and Biology',
    title: 'I Can Change the Memory',
    trigger: 'When a memory runs my body',
    durationMin: 3,
    framing:
      'Your biography writes your biology. A memory that still pulls on your body is an invitation, not a sentence. You can give the body an other experience.',
    steps: [
      'Sit. Close your eyes. Hand on the part of the body the memory speaks through (chest, throat, belly).',
      'Whisper: \u201CI hear you. Thank you for carrying this.\u201D',
      'Slow breath in. On the out-breath, whisper: \u201CI offer you an other experience.\u201D',
      'Rub the spot gently, palm warm. Whisper: \u201CSafe. Here. Loved.\u201D',
      'One more breath. Open your eyes softly. The memory can stay, the grip softens.',
    ],
  },
  {
    id: 'tr-inner-voice',
    chapter: 2,
    theme: 'Inner voice',
    title: 'Change the Voice, Change the Cell',
    trigger: 'When the inner voice is cruel',
    durationMin: 2,
    framing:
      'The voice in your head is a tenant, not the owner. Your cells listen to whichever tenant speaks loudest. You can change who has the microphone.',
    steps: [
      'Sit. Hand gently over one ear, then the other. Whisper: \u201CI choose what I listen to.\u201D',
      'Hand on your throat. Speak, out loud, one kind sentence you would say to a child you love.',
      'Hand to your heart. Say that same sentence to yourself, using your name.',
      'Three slow breaths. Whisper: \u201CMy cells are listening. Let there be kindness.\u201D',
    ],
  },

  // — Chapter 3: How this God Affects my Life —
  {
    id: 'tr-self-love',
    chapter: 3,
    theme: 'Self-Love',
    title: 'I Am Willing to Be Loved',
    trigger: 'When I cannot feel loved',
    durationMin: 3,
    framing:
      'You were not asked to earn Love. You were asked to receive it. The willing is the door. The willing is enough.',
    steps: [
      'Sit. Close your eyes. Open your hands on your knees, palms up.',
      'Whisper: \u201CI am willing to be loved.\u201D',
      'Lift your hands into a bowl at heart height. Whisper: \u201CI am willing to receive.\u201D',
      'Draw the bowl in to your chest, palms resting over your heart. Whisper: \u201CLove is already here.\u201D',
      'Stay for five slow breaths. Let the warmth under your hands be the proof.',
    ],
  },
  {
    id: 'tr-self-forgiveness',
    chapter: 3,
    theme: 'Self-Forgiveness',
    title: 'I Resew with Love',
    trigger: 'When I cannot forgive myself',
    durationMin: 3,
    framing:
      'Forgiveness is not a verdict. It is a stitch, and then another. You do not have to forget the tear to resew the cloth.',
    steps: [
      'Sit. Both hands on your heart.',
      'Name the thing. One sentence, out loud or whispered. \u201CI did \u2026\u201D or \u201CI did not \u2026\u201D',
      'Open your arms wide, palms forward. Whisper: \u201CI let go of shame. I let go of guilt. I let go of blame.\u201D',
      'Return hands to your heart. Whisper: \u201CI resew with Love.\u201D',
      'Repeat the out-and-in one more time. The stitch is enough for today.',
    ],
  },

  // — Chapter 4: The Curse That Was Never a Curse —
  {
    id: 'tr-grief',
    chapter: 4,
    theme: 'Grief',
    title: 'I Honour the River',
    trigger: 'When grief arrives',
    durationMin: 3,
    framing:
      'Grief is the shape Love takes when the beloved is gone. Do not dam the river. Kneel at its edge and let it pass through you.',
    steps: [
      'Sit or stand. Feet flat. One hand on your heart, one on your belly.',
      'Whisper: \u201CI am not afraid of this feeling. It is Love, still Love.\u201D',
      'Let the breath be uneven if it wants to be. Allow one exhale to be a sigh.',
      'Whisper: \u201CI honour what was. I honour the one I miss.\u201D',
      'Palms together at your chest. Three soft claps. \u201CI am earth, wrapped in light. I am held.\u201D',
    ],
  },
  {
    id: 'tr-betrayal',
    chapter: 4,
    theme: 'Betrayal and Trust',
    title: 'I Re-weave the Cord',
    trigger: 'When betrayal replays',
    durationMin: 3,
    framing:
      'Betrayal breaks a cord. You do not have to tie it back to the same hand. You can weave a new cord, and keep the knot of what you learned.',
    steps: [
      'Sit. Hold one wrist with the opposite hand, firmly but kindly.',
      'Whisper: \u201CI see what happened. I believe me.\u201D',
      'Switch wrists. Whisper: \u201CI keep the lesson. I release the replay.\u201D',
      'Bring both hands to your heart. Whisper: \u201CI choose who I trust, and I start with me.\u201D',
      'Three slow breaths. A small nod. Trust rebuilds in stitches, not leaps.',
    ],
  },
  {
    id: 'tr-willing-change',
    chapter: 4,
    theme: 'Willingness',
    title: 'I Weave My Will',
    trigger: 'When change feels impossible',
    durationMin: 2,
    framing:
      'Will is not force. Will is a weaving. You only need to be willing, and the thread arrives.',
    steps: [
      'Stand or sit tall. Interlace your fingers in front of your belly.',
      'Draw your woven hands up along the centre line, to the heart, to the mouth.',
      'Whisper at the mouth: \u201CI am willing. I am willing. I am willing.\u201D',
      'Release your hands and let them fall open at your sides.',
      'Whisper: \u201CLet there be the next small step.\u201D',
    ],
  },
  {
    id: 'tr-decompose',
    chapter: 4,
    theme: 'De-composing, Re-composing',
    title: 'I Am Being Composted by Love',
    trigger: 'When I am falling apart',
    durationMin: 3,
    framing:
      'What falls apart is not failing. It is composting. The earth that made you knows how to take what is finished and grow the next season from it.',
    steps: [
      'Sit low if you can, closer to the ground.',
      'Both hands on the earth, the floor, the chair, the soil. Whisper: \u201CI am earth. Earth can hold this.\u201D',
      'Breathe in. Allow whatever is falling to fall. Whisper: \u201CI let it fall.\u201D',
      'Hands to the belly. Whisper: \u201CSomething is being composed in me. I do not have to see it yet.\u201D',
      'One hand to the heart. \u201CLet there be the next me.\u201D Rest for a breath.',
    ],
  },

  // — Chapter 5: The God Who is Not Alone —
  {
    id: 'tr-safety',
    chapter: 5,
    theme: 'Safety',
    title: 'I Am Held',
    trigger: 'When I am afraid, unprotected',
    durationMin: 2,
    framing:
      'Your first language is safety. Before words, before thought, the body asked, \u201CAm I held?\u201D You can give that answer now.',
    steps: [
      'Sit. Cross your arms over your chest, each hand on the opposite shoulder, a gentle self-hug.',
      'Slow breath in through the nose. Long breath out through the mouth.',
      'Whisper: \u201CI am safe. I am held. I am not alone.\u201D',
      'Rock gently side to side for three breaths.',
      'Let the arms fall. Hands open on your knees. Whisper once more: \u201CI am safe.\u201D',
    ],
  },
  {
    id: 'tr-unravel-unsafety',
    chapter: 5,
    theme: 'Un-safety',
    title: 'I Unravel the Coarse Black Thread',
    trigger: 'When threat feels everywhere',
    durationMin: 3,
    framing:
      'Un-safety is a thread that tightens across the chest and belly. You do not have to fight it. You loosen it, one pull at a time.',
    steps: [
      'Sit. Place both hands across your chest as if loosening a shirt.',
      'Slowly draw the hands outward, past the shoulders, as if pulling a tight cord off your body.',
      'Whisper: \u201CI unravel what is not mine. I unravel what no longer belongs.\u201D',
      'Shake your hands gently at your sides, letting the thread fall away.',
      'Palms to your heart. Whisper: \u201CI resew with Love. I am safe, now.\u201D',
    ],
  },
  {
    id: 'tr-gatekeeper',
    chapter: 5,
    theme: 'Gatekeeper',
    title: 'The Gatekeeper Says No With Love',
    trigger: 'When I must say no',
    durationMin: 2,
    framing:
      'A gate is not a wall. A gatekeeper is not a warrior. You can say no, and still be made of Love.',
    steps: [
      'Stand if you can. Plant both feet. Place one hand forward, palm out, the other at your heart.',
      'Whisper: \u201CNo. Not today. Not like this.\u201D',
      'Feel the ground through your feet. Breathe low.',
      'Whisper: \u201CI am the gatekeeper. I am still Love.\u201D',
      'Bring the forward hand back to your heart. Both hands resting. The gate is closed, kindly.',
    ],
  },

  // — Chapter 6: Made in Their Image —
  {
    id: 'tr-gratitude',
    chapter: 6,
    theme: 'Gratitude',
    title: 'I Am Blessed, I Bless Back',
    trigger: 'When I want to remember I am blessed',
    durationMin: 2,
    framing:
      'You were blessed before you were asked to bless. Receive first. The blessing back is the natural overflow.',
    steps: [
      'Sit or stand at a window, or near one thing you love.',
      'Hand on your heart. Whisper: \u201CI am blessed.\u201D',
      'Hand on your belly. Whisper: \u201CI may. I can.\u201D',
      'Turn your palm toward one thing in front of you. Whisper: \u201CI bless you.\u201D',
      'Palms together at the heart. Three soft claps. \u201CLet there be more of this.\u201D',
    ],
  },

  // — Chapter 7: Sewing with Love —
  {
    id: 'tr-flexibility',
    chapter: 7,
    theme: 'Flexibility',
    title: 'I Am a Flowing Stitch',
    trigger: 'When I feel rigid',
    durationMin: 2,
    framing:
      'A rigid stitch snaps. A flowing stitch lasts. Softness is not weakness, it is durability in disguise.',
    steps: [
      'Stand or sit. Shake out your hands for three breaths.',
      'Slowly roll your shoulders back, then forward. Let the spine join in.',
      'Whisper: \u201CI soften. I do not break.\u201D',
      'Turn your head gently side to side, saying \u201CI am willing\u201D to one side, \u201Cto change\u201D to the other.',
      'Hand on heart. Whisper: \u201CI am a flowing stitch. I bend, I hold.\u201D',
    ],
  },

  // — Chapter 8: When the Old Thread Pulls —
  {
    id: 'tr-shame',
    chapter: 8,
    theme: 'Shame',
    title: 'I Release Shame, I Resew with Love',
    trigger: 'When shame pulls',
    durationMin: 3,
    framing:
      'Shame says, \u201CYou are the mistake.\u201D The new thread says, \u201CYou made one.\u201D Notice the difference. You are not the feeling, you are the one who feels it.',
    steps: [
      'Sit. Both hands on your heart.',
      'Whisper: \u201CI am not that feeling. I am the one who feels it.\u201D',
      'Open your arms wide. Whisper: \u201CI let go of shame.\u201D',
      'Return hands to your heart. Whisper: \u201CI resew with Love.\u201D',
      'Repeat the out-and-in once more. A final breath. You sewed a stitch.',
    ],
  },
  {
    id: 'tr-anger',
    chapter: 8,
    theme: 'Anger and Resentment',
    title: 'I Honour the Fire',
    trigger: 'When anger grips',
    durationMin: 3,
    framing:
      'Anger is a fire that wants to keep you safe. You do not put it out, you bring it to the hearth and ask what it is guarding.',
    steps: [
      'Stand if you can. Feet planted. Fists loose at your sides.',
      'Take one hard breath in, and release it long. Let a soft sound out if it wants to come.',
      'Hand on your belly, where the fire lives. Whisper: \u201CI hear you. I am here. Thank you for guarding me.\u201D',
      'Ask, quietly: \u201CWhat is under this?\u201D Listen. No answer is also an answer.',
      'Both hands on your heart. Whisper: \u201CI am safe enough to feel this. The fire is mine, and so am I.\u201D',
    ],
  },
  {
    id: 'tr-fear-love',
    chapter: 8,
    theme: 'Fear and Love',
    title: 'Exhale Fear, Inhale Love',
    trigger: 'When Fear is loud',
    durationMin: 3,
    framing:
      'Fear and Love use the same breath. You only change which one you send out, and which one you let in.',
    steps: [
      'Sit. Close your eyes. Hand on your heart.',
      'Long breath out through the mouth. Whisper: \u201CI release Fear.\u201D',
      'Slow breath in through the nose, lifting the chest under your hand. Whisper: \u201CI receive Love.\u201D',
      'Repeat five more times. Let the out-breath be longer than the in-breath.',
      'End with both hands on your heart. Whisper: \u201CI am Love, breathing.\u201D',
    ],
  },

  // — Chapter 9: You Are Not Alone —
  {
    id: 'tr-criticism',
    chapter: 9,
    theme: 'Criticism',
    title: 'I Turn Toward Approval',
    trigger: 'When criticism stings',
    durationMin: 2,
    framing:
      'A criticism lands where the old thread is already loose. The sting is information, not identity. You can turn your face, gently, toward the one who approves.',
    steps: [
      'Sit. Hand on the cheek that still stings.',
      'Whisper: \u201CI see the sting. I do not have to make it my name.\u201D',
      'Slowly turn your face to the other side, as if turning toward light.',
      'Hand over that cheek. Whisper: \u201CI turn toward approval. I am approved.\u201D',
      'Palms together at the heart. Whisper: \u201CI am loved. I am enough. Let the sting pass.\u201D',
    ],
  },
  {
    id: 'tr-i-am',
    chapter: 9,
    theme: 'Sovereign I Am',
    title: 'I Accept My Own I Am',
    trigger: 'When I doubt who I am',
    durationMin: 3,
    framing:
      'Before any label, before any role, there is the quiet \u201CI am.\u201D That is the one They are weaving with. That is the one that is not alone.',
    steps: [
      'Sit or stand tall. Close your eyes. Hand on your heart.',
      'Whisper: \u201CI am.\u201D Stay for one breath.',
      'Whisper: \u201CI am me.\u201D Stay for another breath.',
      'Reach one hand out beside you, palm open. Whisper: \u201CThey are here. They are weaving with me.\u201D',
      'Both hands back to your heart. \u201CI am Love, creating, and I am not alone.\u201D',
    ],
  },
];

export function findTrigger(id?: string): TriggerGesture | undefined {
  if (!id) return undefined;
  return triggerGestures.find((g) => g.id === id);
}

export function triggersForChapter(chapter: number): TriggerGesture[] {
  return triggerGestures.filter((g) => g.chapter === chapter);
}

// A trigger is unlocked when the reader has reached (or passed) its chapter.
// currentChapter undefined means the reader has not set progress yet,
// so only the Introduction (chapter 0) is available.
export function isTriggerUnlocked(
  trigger: TriggerGesture,
  currentChapter: number | null | undefined
): boolean {
  if (trigger.chapter === 0) return true;
  if (currentChapter === undefined || currentChapter === null) return false;
  return currentChapter >= trigger.chapter;
}
