import { memo } from 'react';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display?: string;
  onChange: (v: number) => void;
  onReset?: () => void;
  unit?: string;
}

export const EffectSlider = memo(function EffectSlider({
  label, value, min, max, step = 0.01, display, onChange, onReset, unit = '',
}: Props) {
  return (
    <div className="slider-row">
      <div className="slider-head">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{display ?? `${value}${unit}`}</span>
        {onReset && (
          <button type="button" className="btn-icon reset" onClick={onReset} title="Reset" aria-label={`Reset ${label}`}>
            ↺
          </button>
        )}
      </div>
      <input
        type="range"
        className="thumb-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
});
