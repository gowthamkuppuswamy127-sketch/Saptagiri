/**
 * Turns the 16 MB source clip into something a phone on mobile data can
 * actually load, plus poster frames for the first paint.
 *
 * The source is a 2560×1440 landscape shot with the bus sitting right-of-
 * centre in frame. A landscape encode cropped by CSS `object-cover` on a
 * narrow phone screen ends up showing a thin vertical sliver centred on the
 * MIDDLE of the frame — which is mostly hillside, not the bus. So mobile
 * gets its own dedicated portrait crop, composed on the windscreen and both
 * mirrors, encoded at a resolution suited to a phone screen — rather than a
 * landscape file stretched and cropped by CSS until it goes soft.
 *
 * Run once: npm run encode:hero
 */

import { execFile } from 'node:child_process';
import { mkdir, stat, unlink } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const run = promisify(execFile);

const SOURCE = 'Main Sapta.mp4';
const OUT_DIR = path.join('public', 'media');

/**
 * The source footage was shot on a misty, overcast morning in the ghats, so it
 * carries a strong blue cast — measured at roughly +23 blue over red across the
 * sky. This trims red up and blue down to neutralise most of that while leaving
 * the mist looking like mist. Raise `bb` toward 1.0 for a cooler picture, lower
 * it for a warmer one.
 */
const COLOUR = 'colorchannelmixer=rr=1.05:gg=1.0:bb=0.93';

/**
 * Portrait crop window in source pixels (2560×1440): a 900-wide slice at
 * x=1092, full height, centred on the windscreen so both mirrors and the
 * "SAPTHAGIRI" lettering stay fully in frame. Scaled down to 810×1296 for
 * encoding — still sharp at typical phone widths, without shipping 900px of
 * source detail nobody's screen needs.
 */
const PORTRAIT_CROP = 'crop=900:1440:1092:0';
const PORTRAIT_SCALE = 'scale=720:1152';

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
    '-vf', `scale=1280:-2,${COLOUR}`,
    '-c:v', 'libx264',
    '-profile:v', 'main',
    '-crf', '25',
    '-preset', 'slow',
    '-pix_fmt', 'yuv420p',
    // Puts the index at the front so playback can start before the full download.
    '-movflags', '+faststart',
    path.join(OUT_DIR, 'hero-1280.mp4'),
  ]);

  // Phones: a dedicated portrait crop, not a cropped-down landscape file.
  // Displayed narrower than the desktop cut, so a higher CRF here costs
  // little visible quality for a real drop in bytes on mobile data.
  await encode('hero-portrait.mp4', [
    '-i', SOURCE,
    '-an',
    '-vf', `${PORTRAIT_CROP},${PORTRAIT_SCALE},${COLOUR}`,
    '-c:v', 'libx264',
    '-profile:v', 'main',
    '-crf', '29',
    '-preset', 'slower',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    path.join(OUT_DIR, 'hero-portrait.mp4'),
  ]);

  // Poster frames, taken a couple of seconds in to avoid a black opening frame.
  await encode('poster frame (desktop)', [
    '-ss', '2',
    '-i', SOURCE,
    '-frames:v', '1',
    '-vf', `scale=1280:-2,${COLOUR}`,
    path.join(OUT_DIR, 'hero-poster.png'),
  ]);

  await encode('poster frame (portrait)', [
    '-ss', '2',
    '-i', SOURCE,
    '-frames:v', '1',
    '-vf', `${PORTRAIT_CROP},${PORTRAIT_SCALE},${COLOUR}`,
    path.join(OUT_DIR, 'hero-poster-portrait.png'),
  ]);

  for (const [png, webp] of [
    ['hero-poster.png', 'hero-poster.webp'],
    ['hero-poster-portrait.png', 'hero-poster-portrait.webp'],
  ]) {
    process.stdout.write(`  ${webp}… `);
    await sharp(path.join(OUT_DIR, png))
      .webp({ quality: 78 })
      .toFile(path.join(OUT_DIR, webp));
    await unlink(path.join(OUT_DIR, png));
    console.log('done');
  }

  // The bus photo, resized for the about section.
  process.stdout.write('  coach.webp… ');
  await sharp('Sapta.png')
    .resize(1400, null, { withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(OUT_DIR, 'coach.webp'));
  console.log('done\n');

  for (const file of [
    'hero-1280.mp4',
    'hero-portrait.mp4',
    'hero-poster.webp',
    'hero-poster-portrait.webp',
    'coach.webp',
  ]) {
    const s = await stat(path.join(OUT_DIR, file));
    console.log(`  ${file.padEnd(24)} ${kb(s.size)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
