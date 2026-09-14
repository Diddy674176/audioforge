import { EffectSlider } from './EffectSlider';
import type { AudioSettings, EqBands } from '../audio/types';
import { EQ_FREQS } from '../audio/types';
import { EQ_PRESETS } from '../audio/presets';
import { flatEq } from '../audio/defaults';

interface Props {
  settings: AudioSettings;
  onChange: (p: Partial<AudioSettings>, record?: boolean) => void;
}

function freqLabel(f: number) {
  return f >= 1000 ? `${f / 1000}k` : `${f}`;
}

export function EQPanel({ settings: s, onChange }: Props) {
  const setBand = (freq: keyof EqBands, value: number) => {
    onChange({ eq: { ...s.eq, [freq]: value } }, false);
  };

  return (
    <div className="panel">
      <section className="card">
        <h3>9-Band Equalizer</h3>
        <p className="hint">−12 dB to +12 dB · live</p>
        <div className="eq-grid">
          {EQ_FREQS.map((freq) => (
            <div key={freq} className="eq-band">
              <span className="eq-val">{s.eq[freq] > 0 ? '+' : ''}{s.eq[freq].toFixed(0)}</span>
              <input type="range" className="eq-slider" min={-12} max={12} step={0.5} value={s.eq[freq]}
                onChange={(e) => setBand(freq, Number(e.target.value))} aria-label={`${freqLabel(freq)} Hz`} />
              <span className="eq-freq">{freqLabel(freq)}</span>
            </div>
          ))}
        </div>
        <button type="button" className="btn-secondary full" onClick={() => onChange({ eq: flatEq() })}>Reset EQ</button>
      </section>
      <section className="card">
        <h3>EQ Presets</h3>
        <div className="chip-row wrap">
          {Object.entries(EQ_PRESETS).map(([name, eq]) => (
            <button key={name} type="button" className="btn-chip" onClick={() => onChange({ eq })}>{name}</button>
          ))}
        </div>
      </section>
      <section className="card">
        <h3>Quick Tone</h3>
        <EffectSlider label="Bass Boost" value={s.bassBoost} min={0} max={100} step={1}
          display={`${Math.round(s.bassBoost)}%`} onChange={(v) => onChange({ bassBoost: v }, false)} />
        <EffectSlider label="Mids" value={s.mids} min={-12} max={12} step={0.5}
          display={`${s.mids.toFixed(1)} dB`} onChange={(v) => onChange({ mids: v }, false)} />
        <EffectSlider label="Treble" value={s.treble} min={-12} max={12} step={0.5}
          display={`${s.treble.toFixed(1)} dB`} onChange={(v) => onChange({ treble: v }, false)} />
      </section>
    </div>
  );
}
