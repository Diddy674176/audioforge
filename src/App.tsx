import { useEffect, useState } from 'react';
import { useAudioForge } from './hooks/useAudioForge';
import { Uploader } from './components/Uploader';
import { Waveform } from './components/Waveform';
import { Transport } from './components/Transport';
import { MobileNav } from './components/MobileNav';
import { EditorPanel } from './components/EditorPanel';
import { EffectsPanel } from './components/EffectsPanel';
import { EQPanel } from './components/EQPanel';
import { PresetsPanel } from './components/PresetsPanel';
import { ExportPanel } from './components/ExportPanel';
import { Visualizer } from './components/Visualizer';
import { formatBytes } from './utils/format';
import type { AudioSettings } from './audio/types';
import './styles/app.css';

export default function App() {
  const af = useAudioForge();

  const [hot, setHot] = useState(false);
  const [clipPeak, setClipPeak] = useState(0);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      setHot(af.engine.isHot());
      setClipPeak(af.engine.getClipPeak());
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [af.engine]);


  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent).detail as { file: File; settings: AudioSettings };
      await af.loadFile(detail.file);
      af.updateSettings(detail.settings);
    };
    window.addEventListener('audioforge-load-project', handler);
    return () => window.removeEventListener('audioforge-load-project', handler);
  }, [af]);

  const duration = af.meta?.duration ?? 0;

  return (
    <div className="app has-transport">
      <header className="top-bar">
        <div className="brand">
          <span className="logo" aria-hidden>AF</span>
          <div>
            <h1>AudioForge</h1>
            <p className="tag">Real-time music editor · on-device</p>
          </div>
        </div>
        {af.meta && (
          <button type="button" className="btn-chip warn" onClick={af.resetAll}>Reset All</button>
        )}
      </header>

      {!af.meta ? (
        <main className="main empty">
          <Uploader onFile={af.loadFile} loading={af.loading} error={af.error} />
        </main>
      ) : (
        <>
          <div className="sticky-player transport-dock">
            <div className="track-meta">
              <strong className="track-name">{af.meta.name}</strong>
              <span className="dim">{formatBytes(af.meta.size)}</span>
            </div>
            <Waveform
              peaks={af.peaks}
              duration={duration}
              currentTime={af.currentTime}
              trimStart={af.settings.trimStart}
              trimEnd={af.settings.trimEnd || duration}
              fadeIn={af.settings.fadeIn}
              fadeOut={af.settings.fadeOut}
              loop={af.settings.loop}
              loopStart={af.settings.loopStart}
              loopEnd={af.settings.loopEnd || duration}
              zoom={af.zoom}
              onSeek={(t) => void af.seek(t)}
            />
            <Visualizer engine={af.engine} mode={af.visualizer} playing={af.playing} />
            <div className="viz-row">
              {(['off', 'bars', 'waveform', 'circular'] as const).map((m) => (
                <button key={m} type="button" className={`btn-chip ${af.visualizer === m ? 'active' : ''}`}
                  onClick={() => af.setVisualizer(m)}>{m}</button>
              ))}
            </div>
          </div>

          <div className="fixed-transport" aria-label="Playback controls">
            <Transport
              playing={af.playing}
              currentTime={af.currentTime}
              duration={duration}
              onToggle={() => void af.toggle()}
              onRestart={() => void af.restart()}
              onSkip={(d) => void af.skip(d)}
              canUndo={af.canUndo}
              canRedo={af.canRedo}
              onUndo={af.undo}
              onRedo={af.redo}
              bypass={af.settings.bypass}
              abMode={af.settings.abMode}
              onBypass={() => af.updateSettings({ bypass: !af.settings.bypass })}
              onAB={() => af.updateSettings({ abMode: af.settings.abMode === 'A' ? 'B' : 'A' })}
              hot={hot}
              clipPeak={clipPeak}
            />
          </div>

          <main className="main">
            {af.tab === 'editor' && (
              <EditorPanel
                settings={af.settings}
                duration={duration}
                onChange={af.updateSettings}
                zoom={af.zoom}
                setZoom={af.setZoom}
              />
            )}
            {af.tab === 'effects' && (
              <EffectsPanel settings={af.settings} onChange={af.updateSettings} />
            )}
            {af.tab === 'eq' && (
              <EQPanel settings={af.settings} onChange={af.updateSettings} />
            )}
            {af.tab === 'presets' && (
              <PresetsPanel
                settings={af.settings}
                onApply={(s) => af.updateSettings(s)}
              />
            )}
            {af.tab === 'export' && (
              <ExportPanel
                settings={af.settings}
                meta={af.meta}
                fileBlob={af.fileBlobRef.current}
              />
            )}
          </main>
        </>
      )}

      <MobileNav tab={af.tab} onChange={af.setTab} />
    </div>
  );
}
