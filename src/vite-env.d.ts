/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }
}

declare module 'soundtouchjs' {
  export class PitchShifter {
    constructor(context: AudioContext, buffer: AudioBuffer, bufferSize: number, onEnd?: () => void);
    tempo: number;
    rate: number;
    pitch: number;
    pitchSemitones: number;
    percentagePlayed: number;
    duration: number;
    connect(node: AudioNode): void;
    disconnect(): void;
    on(event: string, cb: (detail: unknown) => void): void;
    off(event?: string): void;
  }
}
