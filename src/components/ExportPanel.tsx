import { useEffect, useState } from 'react';
import type { AudioSettings, AudioMeta, ProjectData } from '../audio/types';
import { exportAudio, downloadBlob, type ExportFormat, type Mp3Bitrate } from '../audio/exportAudio';
import { audioEngine } from '../audio/AudioEngine';
import { saveProject, listProjects, getProject, deleteProject } from '../utils/db';
import { formatBytes } from '../utils/format';

interface Props {
  settings: AudioSettings;
  meta: AudioMeta | null;
  fileBlob: Blob | null;
}

export function ExportPanel({ settings, meta, fileBlob }: Props) {
  const [format, setFormat] = useState<ExportFormat>('wav');
  const [bitrate, setBitrate] = useState<Mp3Bitrate>(192);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const refreshProjects = async () => setProjects(await listProjects());

  useEffect(() => { void refreshProjects(); }, []);

  const doExport = async () => {
    if (!audioEngine.buffer || !meta) { setMsg('Load audio first.'); return; }
    setBusy(true); setProgress(0); setMsg(null);
    try {
      const blob = await exportAudio(audioEngine.buffer, settings, format, bitrate, setProgress);
      const base = meta.name.replace(/\.[^.]+$/, '');
      downloadBlob(blob, `${base}-audioforge.${format === 'mp3' ? 'mp3' : 'wav'}`);
      setMsg('Download started — processed offline on your device.');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Export failed');
    } finally { setBusy(false); }
  };

  const saveProj = async () => {
    if (!meta || !fileBlob) { setMsg('Load audio first.'); return; }
    await saveProject({
      id: `p-${Date.now()}`, name: meta.name, createdAt: Date.now(), updatedAt: Date.now(),
      settings: { ...settings, eq: { ...settings.eq } }, meta, audioBlob: fileBlob,
    });
    setMsg('Project saved locally (IndexedDB).');
    await refreshProjects();
  };

  const loadProj = async (id: string) => {
    const p = await getProject(id);
    if (!p?.audioBlob) return;
    const file = new File([p.audioBlob], p.meta.name, { type: p.meta.type });
    window.dispatchEvent(new CustomEvent('audioforge-load-project', { detail: { file, settings: p.settings } }));
  };

  return (
    <div className="panel">
      <section className="card">
        <h3>Export Audio</h3>
        <p className="privacy">🔒 Rendering stays on your device. Nothing is uploaded.</p>
        <div className="row-btns">
          <button type="button" className={`btn-chip ${format === 'wav' ? 'active' : ''}`} onClick={() => setFormat('wav')}>WAV</button>
          <button type="button" className={`btn-chip ${format === 'mp3' ? 'active' : ''}`} onClick={() => setFormat('mp3')}>MP3</button>
        </div>
        {format === 'mp3' && (
          <div className="chip-row">
            {([128, 192, 256, 320] as Mp3Bitrate[]).map((b) => (
              <button key={b} type="button" className={`btn-chip ${bitrate === b ? 'active' : ''}`} onClick={() => setBitrate(b)}>{b} kbps</button>
            ))}
          </div>
        )}
        {busy && (<div className="progress-wrap"><div className="progress-bar" style={{ width: `${progress}%` }} /><span>{progress}%</span></div>)}
        <button type="button" className="btn-primary full" disabled={busy || !meta} onClick={() => void doExport()}>{busy ? 'Rendering…' : 'Export Audio'}</button>
        {msg && <p className="hint">{msg}</p>}
      </section>
      <section className="card">
        <h3>Projects</h3>
        <button type="button" className="btn-secondary full" onClick={() => void saveProj()}>Save Project</button>
        <button type="button" className="btn-secondary full" onClick={() => void refreshProjects()}>Refresh List</button>
        <div className="project-list">
          {projects.length === 0 && <p className="hint">No saved projects yet.</p>}
          {projects.map((p) => (
            <div key={p.id} className="project-row">
              <div><strong>{p.name}</strong><span className="dim"> {formatBytes(p.meta.size)} · {new Date(p.updatedAt).toLocaleString()}</span></div>
              <div className="row-btns">
                <button type="button" className="btn-chip" onClick={() => void loadProj(p.id)}>Open</button>
                <button type="button" className="btn-chip warn" onClick={() => void deleteProject(p.id).then(refreshProjects)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
