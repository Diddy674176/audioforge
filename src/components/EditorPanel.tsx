import { EffectSlider } from './EffectSlider';
import type { AudioSettings } from '../audio/types';

interface Props {
  settings: AudioSettings;
  duration: number;
  onChange: (p: Partial<AudioSettings>, record?: boolean) => void;
  zoom: number;
  setZoom: (z: number) => void;
}

export function EditorPanel({ settings, duration, onChange, zoom, setZoom }: Props) {
  const s = settings;
  return (
    <div className="panel">
      <section className="card">
        <h3>Quick Controls</h3>
        <EffectSlider label="Speed" value={s.speed} min={0.25} max={2} step={0.01} display={`${s.speed.toFixed(2)}x`} onChange={(v) => onChange({ speed: v }, false)} onReset={() => onChange({ speed: 1 })} />
        <EffectSlider label="Pitch" value={s.pitch} min={-12} max={12} step={1} display={`${s.pitch > 0 ? '+' : ''}${s.pitch}`} onChange={(v) => onChange({ pitch: v }, false)} onReset={() => onChange({ pitch: 0 })} />
        <label className="toggle-row"><span>Preserve Pitch</span><input type="checkbox" checked={s.preservePitch} onChange={(e) => onChange({ preservePitch: e.target.checked })} /></label>
        <EffectSlider label="Reverb" value={s.reverb} min={0} max={100} step={1} display={`${Math.round(s.reverb)}%`} onChange={(v) => onChange({ reverb: v }, false)} onReset={() => onChange({ reverb: 0 })} />
        <EffectSlider label="Bass Boost" value={s.bassBoost} min={0} max={100} step={1} display={`${Math.round(s.bassBoost)}%`} onChange={(v) => onChange({ bassBoost: v }, false)} onReset={() => onChange({ bassBoost: 0 })} />
        <EffectSlider label="Volume" value={s.volume} min={0} max={200} step={1} display={`${Math.round(s.volume)}%`} onChange={(v) => onChange({ volume: v }, false)} onReset={() => onChange({ volume: 100 })} />
        <EffectSlider label="Gain" value={s.gain} min={-12} max={12} step={0.5} display={`${s.gain > 0 ? '+' : ''}${s.gain.toFixed(1)} dB`} onChange={(v) => onChange({ gain: v }, false)} onReset={() => onChange({ gain: 0 })} />
      </section>
      <section className="card">
        <h3>Trim & Loop</h3>
        <EffectSlider label="Trim Start" value={s.trimStart} min={0} max={duration} step={0.01} display={`${s.trimStart.toFixed(2)}s`} onChange={(v) => onChange({ trimStart: Math.min(v, s.trimEnd - 0.05) }, false)} />
        <EffectSlider label="Trim End" value={s.trimEnd || duration} min={0} max={duration} step={0.01} display={`${(s.trimEnd || duration).toFixed(2)}s`} onChange={(v) => onChange({ trimEnd: Math.max(v, s.trimStart + 0.05) }, false)} />
        <label className="toggle-row"><span>Loop</span><input type="checkbox" checked={s.loop} onChange={(e) => onChange({ loop: e.target.checked })} /></label>
        {s.loop && (<><EffectSlider label="Loop Start" value={s.loopStart} min={s.trimStart} max={s.trimEnd || duration} step={0.01} display={`${s.loopStart.toFixed(2)}s`} onChange={(v) => onChange({ loopStart: v }, false)} /><EffectSlider label="Loop End" value={s.loopEnd || duration} min={s.trimStart} max={s.trimEnd || duration} step={0.01} display={`${(s.loopEnd || duration).toFixed(2)}s`} onChange={(v) => onChange({ loopEnd: v }, false)} /></>)}
        <EffectSlider label="Fade In" value={s.fadeIn} min={0} max={30} step={0.1} display={`${s.fadeIn.toFixed(1)}s`} onChange={(v) => onChange({ fadeIn: v }, false)} onReset={() => onChange({ fadeIn: 0 })} />
        <EffectSlider label="Fade Out" value={s.fadeOut} min={0} max={30} step={0.1} display={`${s.fadeOut.toFixed(1)}s`} onChange={(v) => onChange({ fadeOut: v }, false)} onReset={() => onChange({ fadeOut: 0 })} />
        <label className="toggle-row"><span>Reverse</span><input type="checkbox" checked={s.reverse} onChange={(e) => onChange({ reverse: e.target.checked })} /></label>
      </section>
      <section className="card">
        <h3>Waveform Zoom</h3>
        <div className="row-btns">
          <button type="button" className="btn-secondary" onClick={() => setZoom(Math.min(8, zoom + 0.5))}>Zoom In</button>
          <button type="button" className="btn-secondary" onClick={() => setZoom(Math.max(1, zoom - 0.5))}>Zoom Out</button>
          <button type="button" className="btn-secondary" onClick={() => setZoom(1)}>Fit</button>
        </div>
      </section>
    </div>
  );
}
