#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parts = [];
for (let i = 0; ; i++) {
  const f = path.join(__dirname, 'pack' + i + '.b64.txt');
  if (!fs.existsSync(f)) break;
  parts.push(fs.readFileSync(f, 'utf8'));
}
if (!parts.length) { console.log('no packs'); process.exit(0); }
const files = JSON.parse(parts.join(''));
for (const [p, b64] of Object.entries(files)) {
  const out = path.join(path.dirname(__dirname), p);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(b64, 'base64'));
  console.log('wrote', p);
}
