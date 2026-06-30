import { useCallback, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import type { GuidedAudio } from '../types';

// expo-audio's documented contract is seconds for currentTime/duration/seekTo,
// and native honours that. Its *web* implementation, however, reports these in
// milliseconds and expects seekTo() in milliseconds. We normalise to seconds
// here so the rest of the app (and our seconds-based transcripts) is uniform.
const MS = Platform.OS === 'web' ? 1000 : 1;

// Centralises all expo-audio specifics so screens never touch the library
// directly. Pass a meditation's optional `audio`; when it is undefined the hook
// is inert (`available: false`) and callers render no control.
//
// Lifecycle handled here:
//   - `useAudioPlayer` releases the native player automatically on unmount, so
//     leaving a meditation stops and frees its audio (one session at a time).
//   - audio plays even when the device is on silent (meditation content).
//   - playback pauses when the app goes to the background; resume is the user's
//     choice (we never auto-resume).
//
// Out of scope (follow-ups): background playback when the app is closed,
// lock-screen controls, remote-audio download management, sleep timer.

let audioModeConfigured = false;

export type GuidedAudioController = {
  available: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekTo: (seconds: number) => void;
  restart: () => void;
};

export function useGuidedAudio(
  audio?: GuidedAudio
): GuidedAudioController {
  // `useAudioPlayer` accepts a null source, so this stays unconditional even
  // when a meditation has no recording. The 100ms update interval gives ~10fps
  // status ticks: smooth enough for synced text highlighting, coarse enough to
  // avoid re-rendering faster than the eye needs.
  const player = useAudioPlayer(audio?.source ?? null, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);

  // Configure the audio session once: play through the silent switch.
  useEffect(() => {
    if (audioModeConfigured) return;
    audioModeConfigured = true;
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // Pause when the app leaves the foreground. The user resumes manually.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        try {
          player.pause();
        } catch {
          // player may already be released
        }
      }
    });
    return () => sub.remove();
  }, [player]);

  const play = useCallback(() => {
    try {
      player.play();
    } catch {}
  }, [player]);

  const pause = useCallback(() => {
    try {
      player.pause();
    } catch {}
  }, [player]);

  const toggle = useCallback(() => {
    try {
      if (status.playing) player.pause();
      else player.play();
    } catch {}
  }, [player, status.playing]);

  const seekTo = useCallback(
    (seconds: number) => {
      try {
        player.seekTo(Math.max(0, seconds) * MS);
      } catch {}
    },
    [player]
  );

  const restart = useCallback(() => {
    try {
      player.seekTo(0);
      player.play();
    } catch {}
  }, [player]);

  return {
    available: !!audio,
    isPlaying: !!status.playing,
    currentTime: (status.currentTime ?? 0) / MS,
    duration: status.duration ? status.duration / MS : audio?.duration || 0,
    play,
    pause,
    toggle,
    seekTo,
    restart,
  };
}

// Given step start markers and the current playhead, returns the index of the
// step that should be active. Returns 0 when there are no markers.
export function stepIndexForTime(
  markers: number[] | undefined,
  time: number
): number {
  if (!markers || markers.length === 0) return 0;
  let idx = 0;
  for (let i = 0; i < markers.length; i++) {
    if (time >= markers[i]) idx = i;
    else break;
  }
  return idx;
}
