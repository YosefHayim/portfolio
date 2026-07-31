#!/usr/bin/env node
/**
 * Sync clientV4/public media (webp + svg logos) to R2 portfolio-assets under v4/.
 * Usage: node scripts/dev/uploadV4MediaToR2.mjs
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const publicDir = path.join(root, 'clientV4/public');
const BUCKET = 'portfolio-assets';
const PREFIX = 'v4';
// Raw row example: "hero.webp" or "logo.svg" should match uploadable media.
const MEDIA = /\.(webp|svg)$/i;
const SKIP = new Set(['favicon']);

const contentType = (file) => {
  if (file.endsWith('.webp')) return 'image/webp';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
};

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP.has(entry.name)) continue;
      files.push(...(await walk(full)));
    } else if (MEDIA.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
};

const main = async () => {
  const files = await walk(publicDir);
  let ok = 0;
  for (const file of files) {
    const rel = path.relative(publicDir, file).split(path.sep).join('/');
    const key = `${PREFIX}/${rel}`;
    const result = spawnSync(
      'wrangler',
      [
        'r2',
        'object',
        'put',
        `${BUCKET}/${key}`,
        `--file=${file}`,
        `--content-type=${contentType(file)}`,
        '--remote',
      ],
      { encoding: 'utf8' },
    );
    if (result.status !== 0) {
      console.error(`✗ ${key}\n${result.stderr || result.stdout}`);
      process.exitCode = 1;
      continue;
    }
    const size = (await stat(file)).size;
    console.log(`✓ ${key} (${size} bytes)`);
    ok += 1;
  }
  console.log(`\nUploaded ${ok}/${files.length} objects to r2://${BUCKET}/${PREFIX}/`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
