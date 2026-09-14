import { defaultSettings, flatEq } from './defaults';
import type { AudioSettings, EqBands } from './types';

export interface PresetDef {
  id: string;
  name: string;
  description: string;
  apply: (base?: AudioSettings) => AudioSettings;
}

const withBase = (partial: Partial<AudioSettings> & { eq?: Partial<EqBands> }): AudioSettings => {
  const d = defaultSettings();
  const eq = { ...d.eq, ...(partial.eq || {}) };
  return { ...d, ...partial, eq };
};

export const BUILTIN_PRESETS: PresetDef[] = [
  { id: 'original', name: 'Original', description: 'Reset to clean sound', apply: () => defaultSettings() },
  { id: 'slowed', name: 'Slowed', description: '0.8× speed, slight bass', apply: () => withBase({ speed: 0.8, pitch: -2, preservePitch: true, bassBoost: 25, bassFreq: 80 }) },
  { id: 'slowed-reverb', name: 'Slowed + Reverb', description: 'Slow + dreamy space', apply: () => withBase({ speed: 0.75, pitch: -2, preservePitch: true, reverb: 55, reverbDecay: 3, reverbWet: 0.45, reverbDry: 0.55, bassBoost: 20, eq: { ...flatEq(), 60: 2, 120: 1, 8000: -2 } }) },
  { id: 'sped-up', name: 'Sped Up', description: '1.25× brighter', apply: () => withBase({ speed: 1.25, pitch: 2, preservePitch: true, treble: 2 }) },
  { id: 'sped-reverb', name: 'Sped Up + Reverb', description: 'Fast with space', apply: () => withBase({ speed: 1.25, pitch: 2, preservePitch: true, reverb: 40, reverbWet: 0.35 }) },
  { id: 'nightcore', name: 'Nightcore', description: 'Faster + higher pitch', apply: () => withBase({ speed: 1.25, pitch: 4, preservePitch: false, treble: 3, mids: 1, eq: { ...flatEq(), 2000: 2, 4000: 3, 8000: 2 } }) },
  { id: 'bass-boost', name: 'Bass Boost', description: 'Punchy low end', apply: () => withBase({ bassBoost: 55, bassFreq: 80, eq: { ...flatEq(), 60: 6, 120: 4 } }) },
  { id: 'heavy-bass', name: 'Heavy Bass', description: 'Sub-heavy club feel', apply: () => withBase({ bassBoost: 80, bassFreq: 60, eq: { ...flatEq(), 60: 9, 120: 6, 250: 2 }, gain: -2 }) },
  { id: 'concert', name: 'Concert', description: 'Live hall energy', apply: () => withBase({ reverb: 65, reverbDecay: 3.5, reverbRoomSize: 0.85, stereoWidth: 140, bassBoost: 15 }) },
  { id: 'dreamy', name: 'Dreamy', description: 'Soft ambient wash', apply: () => withBase({ reverb: 70, reverbDecay: 4, reverbWet: 0.5, delayMix: 0.25, delayTime: 0.4, delayFeedback: 0.4, lowPass: 8000, chorusAmount: 40, chorusMix: 0.4 }) },
  { id: 'lofi', name: 'Lo-Fi', description: 'Warm dusty vibe', apply: () => withBase({ lofi: true, lofiLowpass: 3200, lofiBitcrush: 10, lofiSaturation: 30, lofiNoise: 0.03, saturation: 35, bassBoost: 20, treble: -4, speed: 0.95, reverb: 20, eq: { ...flatEq(), 60: 3, 250: 2, 4000: -4, 8000: -6, 16000: -8 } }) },
  { id: '8d', name: '8D Audio', description: 'Auto pan L↔R', apply: () => withBase({ eightD: true, eightDSpeed: 0.25, eightDDepth: 0.9, stereoWidth: 160, reverb: 25 }) },
  { id: 'vocal-boost', name: 'Vocal Boost', description: 'Clearer midrange vocals', apply: () => withBase({ vocalBoost: true, mids: 4, eq: { ...flatEq(), 250: -1, 500: 2, 1000: 4, 2000: 5, 4000: 3, 60: -2 }, highPass: 80, autoCompressor: true }) },
  { id: 'car-audio', name: 'Car Audio', description: 'Bass + presence for cars', apply: () => withBase({ bassBoost: 45, bassFreq: 70, treble: 3, eq: { ...flatEq(), 60: 5, 120: 3, 2000: 2, 4000: 3, 8000: 2 } }) },
  { id: 'headphones', name: 'Headphones', description: 'Balanced personal listening', apply: () => withBase({ stereoWidth: 120, eq: { ...flatEq(), 60: 2, 250: 1, 2000: 1, 4000: 2, 8000: 1 }, autoCompressor: true, compMakeup: 1 }) },
  { id: 'deep-reverb', name: 'Deep Reverb', description: 'Cathedral space', apply: () => withBase({ reverb: 85, reverbDecay: 5, reverbRoomSize: 1, reverbWet: 0.55, reverbDry: 0.45, reverbPredelay: 0.04 }) },
];

export const EQ_PRESETS: Record<string, EqBands> = {
  Flat: flatEq(),
  'Bass Boost': { ...flatEq(), 60: 7, 120: 5, 250: 2 },
  'Treble Boost': { ...flatEq(), 4000: 4, 8000: 6, 16000: 5 },
  Vocal: { ...flatEq(), 250: -1, 500: 2, 1000: 4, 2000: 5, 4000: 3 },
  'Hip-Hop': { ...flatEq(), 60: 6, 120: 4, 500: -1, 2000: 2, 8000: 3 },
  Rap: { ...flatEq(), 60: 5, 120: 3, 250: 1, 1000: 3, 2000: 4, 4000: 2 },
  Pop: { ...flatEq(), 60: 2, 250: 1, 1000: 2, 4000: 3, 8000: 2 },
  Rock: { ...flatEq(), 60: 3, 250: -1, 2000: 3, 4000: 4, 8000: 2 },
  'Lo-Fi': { ...flatEq(), 60: 3, 250: 2, 4000: -4, 8000: -6, 16000: -8 },
  'Car Speakers': { ...flatEq(), 60: 5, 120: 3, 2000: 2, 4000: 3 },
  Headphones: { ...flatEq(), 60: 2, 250: 1, 4000: 2, 8000: 1 },
};

export const REVERB_PRESETS: Record<string, Partial<AudioSettings>> = {
  'Small Room': { reverbRoomSize: 0.25, reverbDecay: 0.8, reverbWet: 0.25, reverbDry: 0.75, reverbPredelay: 0.01 },
  Studio: { reverbRoomSize: 0.35, reverbDecay: 1.2, reverbWet: 0.2, reverbDry: 0.8, reverbPredelay: 0.015 },
  Hall: { reverbRoomSize: 0.65, reverbDecay: 2.5, reverbWet: 0.35, reverbDry: 0.65, reverbPredelay: 0.025 },
  'Large Hall': { reverbRoomSize: 0.85, reverbDecay: 3.5, reverbWet: 0.4, reverbDry: 0.6, reverbPredelay: 0.03 },
  Cathedral: { reverbRoomSize: 1, reverbDecay: 5, reverbWet: 0.5, reverbDry: 0.5, reverbPredelay: 0.05 },
  Dreamy: { reverbRoomSize: 0.8, reverbDecay: 4, reverbWet: 0.55, reverbDry: 0.45, reverbPredelay: 0.04 },
  Ambient: { reverbRoomSize: 0.9, reverbDecay: 6, reverbWet: 0.6, reverbDry: 0.4, reverbPredelay: 0.06 },
};

export const BASS_PRESETS: Record<string, Partial<AudioSettings>> = {
  'Light Bass': { bassBoost: 25, bassFreq: 100 },
  'Bass Boost': { bassBoost: 55, bassFreq: 80 },
  'Heavy Bass': { bassBoost: 80, bassFreq: 60 },
  'Sub Bass': { bassBoost: 70, bassFreq: 60 },
};
