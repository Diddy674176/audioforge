#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(__dirname);
// Prefer checked-in sources when present (avoids stale/corrupt tpart bundles).
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
