#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(__dirname);
const partsDir = path.join(__dirname, 'srcparts');
const manifestPath = path.join(partsDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const entry of manifest) {
    const dest = path.join(root, entry.path);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const body = entry.parts.map((name) => fs.readFileSync(path.join(partsDir, name), 'utf8')).join('');
    fs.writeFileSync(dest, body);
    console.log('assembled', entry.path, body.length);
  }
  console.log('assembled sources from srcparts');
  process.exit(0);
}
const prefer = [
  'src/audio/AudioEngine.ts',
  'src/audio/exportAudio.ts',
  'src/styles/app.css',
  'src/components/EffectsPanel.tsx',
];
if (prefer.every((f) => fs.existsSync(path.join(root, f)))) {
  console.log('skipping unpack; preferred sources already in repo');
  process.exit(0);
}
const parts = [];
for (let i = 0; ; i++) {
  const f = path.join(__dirname, 'tpart' + i + '.b64');
  if (!fs.existsSync(f)) break;
  parts.push(fs.readFileSync(f, 'utf8').replace(/\s+/g, ''));
}
if (!parts.length) {
  console.log('nothing to unpack');
  process.exit(0);
}
const b64 = parts.join('');
const tarPath = path.join(__dirname, 'remaining.tar.gz');
fs.writeFileSync(tarPath, Buffer.from(b64, 'base64'));
execSync(`tar xzf "${tarPath}" -C "${root}"`, { stdio: 'inherit' });
fs.unlinkSync(tarPath);
console.log('unpacked remaining sources');
