/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }
}

declare module '@soundtouchjs/audio-worklet/processor?url' {
  const url: string;
  export default url;
}
