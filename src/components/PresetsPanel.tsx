import { useEffect, useState } from 'react';
import { BUILTIN_PRESETS } from '../audio/presets';
import type { AudioSettings } from '../audio/types';
import { listCustomPresets, saveCustomPreset, deleteCustomPreset, type CustomPreset } from '../utils/db';

interface Props {
  settings: AudioSettings;
  onApply: (s: AudioSettings) => void;
}

export function PresetsPanel({ settings, onApply }: Props) {
  const [custom, setCustom] = useState<CustomPreset[]>([]);
  const [name, setName] = useState('');

  const refresh = async () => setCustom(await listCustomPresets());
  useEffect(() => { void refresh(); }, []);

  const save = async () => {
    const n = name.trim() || `Preset ${new Date().toLocaleString()}`;
    await saveCustomPreset({
      id: `c-${Date.now()}`,
      name: n,
      settings: { ...settings, eq: { ...settings.eq } },
      createdAt: Date.now(),
    });
    setName('');
    await refresh();
  };

  return (
    <div className="panel">
      <section className="card">
        <h3>Built-in Presets</h3>
        <div className="preset-grid">
          {BUILTIN_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="preset-card"
              onClick={() => onApply(p.apply())}
            >
              <strong>{p.name}</strong>
              <span>{p.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Save Current as Preset</h3>
        <input
          className="text-input"
          placeholder="Preset name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="button" className="btn-primary full" onClick={() => void save()}>Save Preset</button>
      </section>

      {custom.length > 0 && (
        <section className="card">
          <h3>Your Presets</h3>
          <div className="preset-grid">
            {custom.map((p) => (
              <div key={p.id} className="preset-card custom">
                <button type="button" className="preset-apply" onClick={() => onApply(p.settings)}>
                  <strong>{p.name}</strong>
                </button>
                <button type="button" className="btn-icon" onClick={() => void deleteCustomPreset(p.id).then(refresh)} aria-label="Delete">🗑</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
