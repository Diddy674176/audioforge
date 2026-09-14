import { useCallback, useEffect, useRef } from 'react';
import { formatTime } from '../utils/format';

interface Props {
  peaks: Float32Array | null;
  duration: number;
  currentTime: number;
  trimStart: number;
  trimEnd: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
  loopStart: number;
  loopEnd: number;
  zoom: number;
  onSeek: (t: number) => void;
}

export function Waveform({
  peaks, duration, currentTime, trimStart, trimEnd, fadeIn, fadeOut,
  loop, loopStart, loopEnd, zoom, onSeek,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !peaks || !duration) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);

    const mid = cssH / 2;
    const grad = ctx.createLinearGradient(0, 0, cssW, 0);
    grad.addColorStop(0, '#7c5cff');
    grad.addColorStop(1, '#3dd6ff');
    ctx.fillStyle = '#1a1a24';
    ctx.fillRect(0, 0, cssW, cssH);

    const t0 = (trimStart / duration) * cssW;
    const t1 = (trimEnd / duration) * cssW;
    ctx.fillStyle = 'rgba(124,92,255,0.12)';
    ctx.fillRect(t0, 0, t1 - t0, cssH);

    if (loop) {
      const ls = (loopStart / duration) * cssW;
      const le = (loopEnd / duration) * cssW;
      ctx.fillStyle = 'rgba(61,214,255,0.1)';
      ctx.fillRect(ls, 0, le - ls, cssH);
    }

    const n = peaks.length;
    const barW = cssW / n;
    ctx.fillStyle = grad;
    for (let i = 0; i < n; i++) {
      const h = peaks[i] * (cssH * 0.85);
      const x = i * barW;
      ctx.fillRect(x, mid - h / 2, Math.max(1, barW * 0.7), h);
    }

    if (fadeIn > 0) {
      const fw = (fadeIn / duration) * cssW;
      const g = ctx.createLinearGradient(t0, 0, t0 + fw, 0);
      g.addColorStop(0, 'rgba(0,0,0,0.55)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(t0, 0, fw, cssH);
    }
    if (fadeOut > 0) {
      const fw = (fadeOut / duration) * cssW;
      const g = ctx.createLinearGradient(t1 - fw, 0, t1, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = g;
      ctx.fillRect(t1 - fw, 0, fw, cssH);
    }

    const px = (currentTime / duration) * cssW;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, cssH);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px system-ui';
    ctx.fillText(formatTime(0), 4, cssH - 4);
    ctx.fillText(formatTime(duration), cssW - 36, cssH - 4);
  }, [peaks, duration, currentTime, trimStart, trimEnd, fadeIn, fadeOut, loop, loopStart, loopEnd]);

  useEffect(() => { draw(); }, [draw]);

  const onPointer = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !duration) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSeek((x / rect.width) * duration);
  };

  const widthPct = `${zoom * 100}%`;

  return (
    <div className="waveform-wrap" ref={scrollRef}>
      <div className="waveform-inner" style={{ width: widthPct, minWidth: '100%' }}>
        <canvas
          ref={canvasRef}
          className="waveform-canvas"
          onPointerDown={onPointer}
          role="slider"
          aria-label="Seek waveform"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
        />
      </div>
    </div>
  );
}
