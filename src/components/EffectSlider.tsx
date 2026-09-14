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
  defaultValue?: number;
  unit?: string;
}

export const EffectSlider = memo(function EffectSlider({
  label, value, min, max, step = 0.01, display, onChange, onReset, defaultValue, unit = '',
}: Props) {
  const dirty =
    defaultValue !== undefined
      ? Math.abs(value - defaultValue) > (step || 0.001) * 0.5
      : Boolean(onReset);
  const showReset = Boolean(onReset) && (defaultValue === undefined || dirty);
  const rowClass = dirty ? 'slider-row is-dirty' : 'slider-row';
  const resetClass = dirty ? 'btn-reset visible' : 'btn-reset';

  return (
    <div className={rowClass}>
      <div className="slider-head">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{display ?? (String(value) + unit)}</span>
        {showReset && (
          <button
            type="button"
            className={resetClass}
            onClick={onReset}
            title={'Reset ' + label}
            aria-label={'Reset ' + label}
          >
            Reset
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
