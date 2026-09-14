# AudioForge

**Real-time, mobile-first music editor** in the browser. Upload MP3/WAV/OGG/M4A, tweak EQ, reverb, speed, bass, and export — all on-device.

🔒 **Your audio stays on your device.** No accounts. No uploads.

## Live demo

**https://diddy674176.github.io/audioforge/**

> First-time setup: open **Settings → Pages → Source: GitHub Actions**, then re-run the **Deploy to GitHub Pages** workflow (or push any commit). CI already builds successfully; only the Pages environment needs enabling once.

## Features

- Upload MP3, WAV, OGG, M4A (browser-supported formats)
- Waveform with seek, zoom, trim, loop, fade, reverse
- Live Web Audio graph: volume, gain, 9-band EQ, bass boost, treble/mids, filters, reverb, delay, chorus, distortion, saturation, compressor, stereo width, pan, 8D
- Speed 0.25×–2× and pitch ±12 semitones with **Preserve Pitch** (SoundTouchJS)
- Presets: Slowed, Slowed+Reverb, Nightcore, Bass Boost, Lo-Fi, 8D, Vocal Boost, and more
- A/B compare, bypass, undo/redo
- Export WAV / MP3 (lamejs) offline with progress
- IndexedDB projects + custom presets
- Installable PWA

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm install
npm run build
npm run preview
```

`base` is set to `/audioforge/` for GitHub Pages.

CI unpacks large sources via `node scripts/unpack-remaining.mjs` before `npm install` / `npm run build`.

## Enable GitHub Pages (one-time)

1. Repo **Settings → Pages**
2. Source: **GitHub Actions**
3. Actions → **Deploy to GitHub Pages** → **Run workflow** (or push to `main`)
4. Open https://diddy674176.github.io/audioforge/

## Privacy

All decoding, effects, and export run in your browser via the Web Audio API. Audio is never sent to a server.
