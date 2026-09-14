import type { ReactNode } from 'react';
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
  hot?: boolean;
  clipPeak?: number;
}

function Icon({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {children}
    </svg>
  );
}

export function Transport({
  playing, currentTime, duration, onToggle, onRestart, onSkip,
  canUndo, canRedo, onUndo, onRedo, bypass, abMode, onBypass, onAB,
  hot = false, clipPeak = 0,
}: Props) {
  return (
    <div className="transport">
      <div className="transport-time">
        <span>{formatTime(currentTime)}</span>
        <span className="dim">/</span>
        <span className="dim">{formatTime(duration)}</span>
        {hot && (
          <span className="clip-indicator" title={'Peak ' + clipPeak.toFixed(2)} role="status">
            CLIP
          </span>
        )}
      </div>
      <div className="transport-btns">
        <button type="button" className="btn-icon" onClick={onUndo} disabled={!canUndo} title="Undo" aria-label="Undo">
          <Icon><path d="M9 14L4 9l5-5v3h7a5 5 0 010 10h-2v-2h2a3 3 0 000-6H9v3z" /></Icon>
        </button>
        <button type="button" className="btn-icon" onClick={onRedo} disabled={!canRedo} title="Redo" aria-label="Redo">
          <Icon><path d="M15 14l5-5-5-5v3H8a5 5 0 000 10h2v-2H8a3 3 0 010-6h7v3z" /></Icon>
        </button>
        <button type="button" className="btn-round" onClick={() => onSkip(-5)} title="-5s" aria-label="Back 5 seconds">
          <Icon><path d="M11 18V6l-8 6 8 6zm1-6l8 6V6l-8 6z" /></Icon>
        </button>
        <button type="button" className="btn-round" onClick={onRestart} title="Restart" aria-label="Restart">
          <Icon><path d="M6 6h2v12H6V6zm3 6l10 6V6L9 12z" /></Icon>
        </button>
        <button type="button" className="btn-play" onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? (
            <Icon size={22}><path d="M7 5h3v14H7V5zm7 0h3v14h-3V5z" /></Icon>
          ) : (
            <Icon size={22}><path d="M8 5v14l12-7L8 5z" /></Icon>
          )}
        </button>
        <button type="button" className="btn-round" onClick={() => onSkip(5)} title="+5s" aria-label="Forward 5 seconds">
          <Icon><path d="M13 6v12l8-6-8-6zM4 6v12l8-6-8-6z" /></Icon>
        </button>
        <button type="button" className={'btn-chip ' + (abMode === 'A' ? 'active' : '')} onClick={onAB} title="A/B compare">
          {abMode}
        </button>
        <button type="button" className={'btn-chip ' + (bypass ? 'active warn' : '')} onClick={onBypass} title="Bypass all">
          BYP
        </button>
      </div>
    </div>
  );
}
