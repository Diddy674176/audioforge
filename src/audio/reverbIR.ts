/** Procedural impulse responses for ConvolverNode (no external assets). */
export function createReverbIR(
  ctx: AudioContext | OfflineAudioContext,
  seconds = 2,
  decay = 2,
  reverse = false,
): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.max(1, Math.floor(rate * seconds));
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const n = reverse ? length - i : i;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
  }
  return impulse;
}
