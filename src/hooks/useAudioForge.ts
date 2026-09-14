import { useCallback, useEffect, useRef, useState } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { defaultSettings } from '../audio/defaults';
import type { AudioMeta, AudioSettings, TabId, VisualizerMode } from '../audio/types';
import { formatBytes } from '../utils/format';

const MAX_HISTORY = 40;

export function useAudioForge() {
  const [settings, setSettings] = useState<AudioSettings>(defaultSettings());
  const [meta, setMeta] = useState<AudioMeta | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [peaks, setPeaks] = useState<Float32Array | null>(null);
  const [tab, setTab] = useState<TabId>('editor');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visualizer, setVisualizer] = useState<VisualizerMode>('bars');
  const [zoom, setZoom] = useState(1);
  const history = useRef<AudioSettings[]>([defaultSettings()]);
  const histIndex = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const fileRef = useRef<ArrayBuffer | null>(null);
  const fileBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    return audioEngine.subscribe(() => {
      setPlaying(audioEngine.isPlaying());
      setSettings({ ...audioEngine.getSettings() });
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setCurrentTime(audioEngine.getCurrentTime());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pushHistory = useCallback((next: AudioSettings) => {
    const slice = history.current.slice(0, histIndex.current + 1);
    slice.push(next);
    if (slice.length > MAX_HISTORY) slice.shift();
    history.current = slice;
    histIndex.current = slice.length - 1;
    setCanUndo(histIndex.current > 0);
    setCanRedo(false);
  }, []);

  const updateSettings = useCallback((partial: Partial<AudioSettings>, record = true) => {
    audioEngine.applySettings(partial);
    const next = audioEngine.getSettings();
    setSettings({ ...next });
    if (record) pushHistory({ ...next });
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (histIndex.current <= 0) return;
    histIndex.current -= 1;
    const s = history.current[histIndex.current];
    audioEngine.applySettings(s, true);
    setSettings({ ...s });
    setCanUndo(histIndex.current > 0);
    setCanRedo(histIndex.current < history.current.length - 1);
  }, []);

  const redo = useCallback(() => {
    if (histIndex.current >= history.current.length - 1) return;
    histIndex.current += 1;
    const s = history.current[histIndex.current];
    audioEngine.applySettings(s, true);
    setSettings({ ...s });
    setCanUndo(histIndex.current > 0);
    setCanRedo(histIndex.current < history.current.length - 1);
  }, []);

  const loadFile = useCallback(async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const ok = /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(file.name) ||
        file.type.startsWith('audio/');
      if (!ok) throw new Error('Unsupported file type. Try MP3, WAV, OGG, or M4A.');
      if (file.size > 200 * 1024 * 1024) throw new Error('File too large (max ~200 MB).');
      const ab = await file.arrayBuffer();
      fileRef.current = ab;
      fileBlobRef.current = file;
      audioEngine.pause();
      const buf = await audioEngine.loadArrayBuffer(ab);
      audioEngine.applySettings(defaultSettings(), true);
      const m: AudioMeta = {
        name: file.name,
        duration: buf.duration,
        size: file.size,
        type: file.type || 'audio',
      };
      setMeta(m);
      setPeaks(audioEngine.getWaveformPeaks(500));
      setSettings(audioEngine.getSettings());
      history.current = [defaultSettings()];
      histIndex.current = 0;
      setCanUndo(false);
      setCanRedo(false);
      setTab('editor');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load audio');
    } finally {
      setLoading(false);
    }
  }, []);

  const play = useCallback(() => audioEngine.play(), []);
  const pause = useCallback(() => audioEngine.pause(), []);
  const toggle = useCallback(() => audioEngine.toggle(), []);
  const seek = useCallback((t: number) => audioEngine.seek(t), []);
  const skip = useCallback((d: number) => audioEngine.skip(d), []);
  const restart = useCallback(() => audioEngine.restart(), []);

  const resetAll = useCallback(() => {
    if (!confirm('Reset all effects to default?')) return;
    updateSettings(defaultSettings());
  }, [updateSettings]);

  return {
    settings, meta, playing, currentTime, peaks, tab, setTab, error, setError, loading,
    visualizer, setVisualizer, zoom, setZoom, canUndo, canRedo, undo, redo,
    updateSettings, loadFile, play, pause, toggle, seek, skip, restart, resetAll,
    engine: audioEngine, fileBlobRef, formatBytes,
  };
}

export type AudioForgeState = ReturnType<typeof useAudioForge>;
