export type TabId = 'editor' | 'effects' | 'eq' | 'presets' | 'export';

export const EQ_FREQS = [60, 120, 250, 500, 1000, 2000, 4000, 8000, 16000] as const;

export interface EqBands {
  60: number;
  120: number;
  250: number;
  500: number;
  1000: number;
  2000: number;
  4000: number;
  8000: number;
  16000: number;
}

export interface AudioSettings {
  volume: number;
  gain: number;
  speed: number;
  pitch: number;
  preservePitch: boolean;
  reverb: number;
  reverbRoomSize: number;
  reverbDecay: number;
  reverbWet: number;
  reverbDry: number;
  reverbPredelay: number;
  bassBoost: number;
  bassFreq: number;
  treble: number;
  mids: number;
  eq: EqBands;
  pan: number;
  stereoWidth: number;
  lowPass: number;
  highPass: number;
  distortion: number;
  saturation: number;
  chorusAmount: number;
  chorusRate: number;
  chorusDepth: number;
  chorusMix: number;
  delayTime: number;
  delayFeedback: number;
  delayMix: number;
  compThreshold: number;
  compRatio: number;
  compAttack: number;
  compRelease: number;
  compKnee: number;
  compMakeup: number;
  autoCompressor: boolean;
  lofi: boolean;
  lofiBitcrush: number;
  lofiSampleRate: number;
  lofiLowpass: number;
  lofiNoise: number;
  lofiSaturation: number;
  vocalBoost: boolean;
  vocalReducer: boolean;
  eightD: boolean;
  eightDSpeed: number;
  eightDDepth: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
  loopStart: number;
  loopEnd: number;
  trimStart: number;
  trimEnd: number;
  reverse: boolean;
  bypass: boolean;
  abMode: 'A' | 'B';
}

export interface AudioMeta {
  name: string;
  duration: number;
  size: number;
  type: string;
}

export interface ProjectData {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  settings: AudioSettings;
  meta: AudioMeta;
  audioBlob?: Blob;
}

export type VisualizerMode = 'off' | 'bars' | 'waveform' | 'circular';
