import { useEffect, useRef } from 'react';
import type { VisualizerMode } from '../audio/types';
import type { AudioEngine } from '../audio/AudioEngine';

export function Visualizer({
  engine, mode, playing,
}: { engine: AudioEngine; mode: VisualizerMode; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === 'off') return;
    let raf = 0;
    let last = 0;
    const targetFps = 30;
    const frameMs = 1000 / targetFps;
    const data = new Uint8Array(1024);

    const draw = (ts: number) => {
      raf = requestAnimationFrame(draw);
      if (!playing) return;
      if (ts - last < frameMs) return;
      last = ts;
      const analyser = engine.getAnalyser();
      const canvas = canvasRef.current;
      if (!analyser || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width = canvas.clientWidth * 2;
      const h = canvas.height = canvas.clientHeight * 2;
      ctx.clearRect(0, 0, w, h);

      if (mode === 'bars' || mode === 'circular') {
        analyser.getByteFrequencyData(data);
      } else {
        analyser.getByteTimeDomainData(data);
      }

      if (mode === 'bars') {
        const bars = 48;
        const step = Math.floor(data.length / bars);
        const bw = w / bars;
        for (let i = 0; i < bars; i++) {
          const v = data[i * step] / 255;
          const bh = v * h * 0.9;
          const g = ctx.createLinearGradient(0, h, 0, h - bh);
          g.addColorStop(0, '#7c5cff');
          g.addColorStop(1, '#3dd6ff');
          ctx.fillStyle = g;
          ctx.fillRect(i * bw + 2, h - bh, bw - 4, bh);
        }
      } else if (mode === 'waveform') {
        ctx.strokeStyle = '#3dd6ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
          const x = (i / data.length) * w;
          const y = (data[i] / 255) * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (mode === 'circular') {
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) * 0.25;
        ctx.strokeStyle = '#7c5cff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const n = 64;
        for (let i = 0; i < n; i++) {
          const v = data[i * 4] / 255;
          const ang = (i / n) * Math.PI * 2;
          const r = radius + v * radius;
          const x = cx + Math.cos(ang) * r;
          const y = cy + Math.sin(ang) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [engine, mode, playing]);

  if (mode === 'off') return null;
  return <canvas ref={canvasRef} className="visualizer" aria-hidden />;
}
