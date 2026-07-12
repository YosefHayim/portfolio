#!/usr/bin/env node
/**
 * Convert clientV4 public raster images to high-quality WebP.
 * Resizes oversized assets to sensible display maxima, keeps alpha.
 * Removes unused *-with-bg design masters from public after conversion.
 */
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const publicDir = path.join(root, 'clientV4/public');

const RASTER = /\.(png|jpe?g)$/i;
const SKIP_DIRS = new Set(['favicon']);

/** Max edge (px) by path segment heuristics — sized for real CSS display ×2. */
const maxEdgeFor = (rel) => {
  if (rel.includes('stack-') || rel.includes('stat-') || rel.includes('github-3d')) return 256;
  if (rel.includes('float-') || rel.includes('jts-badge') || rel.includes('ship-era')) return 512;
  if (rel.includes('hero-3d-constellation')) return 480;
  if (rel.includes('hero-') || rel.includes('linkedin')) return 800;
  if (rel.includes('blog/')) return 900;
  if (rel.includes('screenshots/')) return 800;
  if (rel.includes('logos/')) return 256;
  return 900;
};

const walk = async (dir, base = dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...(await walk(full, base)));
    } else if (RASTER.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
};

const formatBytes = (n) => {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
  return `${(n / (1024 * 1024)).toFixed(2)}MB`;
};

const main = async () => {
  const files = await walk(publicDir);
  let before = 0;
  let after = 0;
  let converted = 0;
  let removedBg = 0;

  for (const file of files) {
    const rel = path.relative(publicDir, file);
    const isWithBg = rel.includes('-with-bg.');
    const beforeStat = await stat(file);
    before += beforeStat.size;

    // Drop design-only with-bg masters from the public tree (not referenced in app).
    if (isWithBg) {
      await rm(file, { force: true });
      removedBg += 1;
      continue;
    }

    const out = file.replace(RASTER, '.webp');
    const maxEdge = maxEdgeFor(rel);
    const image = sharp(file, { failOn: 'none' });
    const meta = await image.metadata();
    const width = meta.width ?? maxEdge;
    const height = meta.height ?? maxEdge;
    const needsResize = width > maxEdge || height > maxEdge;

    let pipeline = image.rotate();
    if (needsResize) {
      pipeline = pipeline.resize({
        width: maxEdge,
        height: maxEdge,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const buffer = await pipeline
      .webp({
        quality: 88,
        alphaQuality: 90,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();

    await writeFile(out, buffer);
    await rm(file, { force: true });
    after += buffer.length;
    converted += 1;
    const ratio = ((1 - buffer.length / beforeStat.size) * 100).toFixed(0);
    console.log(
      `✓ ${rel} → ${path.basename(out)}  ${formatBytes(beforeStat.size)} → ${formatBytes(buffer.length)} (−${ratio}%)`,
    );
  }

  // Also compress existing webp if any large ones exist
  console.log(
    `\nDone: ${converted} converted, ${removedBg} with-bg removed.\n` +
      `Raster payload: ${formatBytes(before)} → ${formatBytes(after)}`,
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
