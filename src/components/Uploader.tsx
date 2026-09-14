import { useRef, useState } from 'react';

export function Uploader({
  onFile, loading, error,
}: { onFile: (f: File) => void; loading: boolean; error: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handle = (files: FileList | null) => {
    const f = files?.[0];
    if (f) onFile(f);
  };

  return (
    <div
      className={`uploader ${drag ? 'drag' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
        hidden
        onChange={(e) => handle(e.target.files)}
      />
      <div className="uploader-icon">🎧</div>
      <h2>Drop a song here or tap to upload</h2>
      <p>Edit your music directly in the browser.</p>
      <p className="privacy">🔒 Your audio stays on your device. No account required.</p>
      <button type="button" className="btn-primary" disabled={loading}>
        {loading ? 'Loading…' : 'Upload Audio'}
      </button>
      <p className="formats">MP3 · WAV · OGG · M4A · FLAC</p>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
