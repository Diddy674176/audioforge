import { formatTime } from '../utils/format';

interface Props {
  playing: boolean;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onRestart: () => void;
  onSkip: (d: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  bypass: boolean;
  abMode: 'A' | 'B';
  onBypass: () => void;
  onAB: () => void;
}

export function Transport({
  playing, currentTime, duration, onToggle, onRestart, onSkip,
  canUndo, canRedo, onUndo, onRedo, bypass, abMode, onBypass, onAB,
}: Props) {
  return (
    <div className="transport">
      <div className="transport-time">
        <span>{formatTime(currentTime)}</span>
        <span className="dim">/</span>
        <span className="dim">{formatTime(duration)}</span>
      </div>
      <div className="transport-btns">
        <button type="button" className="btn-icon" onClick={onUndo} disabled={!canUndo} title="Undo">↶</button>
        <button type="button" className="btn-icon" onClick={onRedo} disabled={!canRedo} title="Redo">↷</button>
        <button type="button" className="btn-round" onClick={() => onSkip(-5)} title="-5s">⏪</button>
        <button type="button" className="btn-round" onClick={onRestart} title="Restart">⏮</button>
        <button type="button" className="btn-play" onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? '⏸' : '▶'}
        </button>
        <button type="button" className="btn-round" onClick={() => onSkip(5)} title="+5s">⏩</button>
        <button type="button" className={`btn-chip ${abMode === 'A' ? 'active' : ''}`} onClick={onAB} title="A/B compare">
          {abMode}
        </button>
        <button type="button" className={`btn-chip ${bypass ? 'active warn' : ''}`} onClick={onBypass} title="Bypass all">
          BYP
        </button>
      </div>
    </div>
  );
}
