/**
 * Turns the 16 MB source clip into something a phone on mobile data can
 * actually load, plus a poster frame for the first paint.
 *
 * Run once: npm run encode:hero
 */

import { execFile } from 'node:child_process';
import { mkdir, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const run = promisify(execFile);

const SOURCE = 'Main Sapta.mp4';
const OUT_DIR = path.join('public', 'media');

const kb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

async function encode(label, args) {
  process.stdout.write(`  ${label}… `);
  await run(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    maxBuffer: 1024 * 1024 * 32,
  });
  console.log('done');
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const source = await stat(SOURCE);
  console.log(`Source: ${SOURCE} (${kb(source.size)})\n`);

  // Desktop: 1280px wide, silent (it autoplays, so audio would be dropped anyway).
  await encode('hero-1280.mp4', [
    '-i', SOURCE,
    '-an',
    '-vf', 'scale=1280:-2',
    '-c:v', 'libx264',
    '-profile:v', 'main',
    '-crf', '25',
    '-preset', 'slow',
    '-pix_fmt', 'yuv420p',
    // Puts the index at the front so playback can start before the full download.
    '-movflags', '+faststart',
    path.join(OUT_DIR, 'hero-1280.mp4'),
  ]);

  // Phones: 720px is plenty behind an overlay, at roughly a third the weight.
  await encode('hero-720.mp4', [
    '-i', SOURCE,
    '-an',
    '-vf', 'scale=720:-2',
    '-c:v', 'libx264',
    '-profile:v', 'main',
    '-crf', '28',
    '-preset', 'slow',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    path.join(OUT_DIR, 'hero-720.mp4'),
  ]);

  // Poster frame, taken a couple of seconds in to avoid a black opening frame.
  await encode('poster frame', [
    '-ss', '2',
    '-i', SOURCE,
    '-frames:v', '1',
    '-vf', 'scale=1280:-2',
    path.join(OUT_DIR, 'hero-poster.png'),
  ]);

  process.stdout.write('  hero-poster.webp… ');
  await sharp(path.join(OUT_DIR, 'hero-poster.png'))
    .webp({ quality: 72 })
    .toFile(path.join(OUT_DIR, 'hero-poster.webp'));
  console.log('done');

  // The bus photo, resized for the about section.
  process.stdout.write('  coach.webp… ');
  await sharp('Sapta.png')
    .resize(1400, null, { withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(OUT_DIR, 'coach.webp'));
  console.log('done\n');

  for (const file of ['hero-1280.mp4', 'hero-720.mp4', 'hero-poster.webp', 'coach.webp']) {
    const s = await stat(path.join(OUT_DIR, file));
    console.log(`  ${file.padEnd(20)} ${kb(s.size)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
