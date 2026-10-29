// Rend l'animation src/index.html en vidéo légère pour la popup « Nouveauté ».
//   node render.js            -> export/coopeo-nouveaute.mp4 + .webm + poster
//   node render.js 0.5 1.5 3  -> seulement des images fixes à ces instants (contrôle)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'export');
const FRAMES = path.join(ROOT, '.frames');

(async () => {
  const stills = process.argv.slice(2).map(Number);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 560, height: 700 } });
  await page.goto('file://' + path.join(ROOT, 'src/index.html') + '?render');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const { FPS, DURATION } = await page.evaluate(() => window.META);
  fs.mkdirSync(OUT, { recursive: true });

  if (stills.length) {
    for (const t of stills) {
      await page.evaluate(t => window.seek(t), t);
      await page.screenshot({ path: path.join(OUT, `still-${t}s.png`) });
    }
    await browser.close();
    return;
  }

  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES);
  const total = Math.round(FPS * DURATION);
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.seek(t), f / FPS);
    await page.screenshot({ path: path.join(FRAMES, `f${String(f).padStart(4, '0')}.png`) });
  }
  // Dernière image = image d'attente (poster) et image finale figée
  await page.evaluate(t => window.seek(t), DURATION);
  await page.screenshot({ path: path.join(FRAMES, 'poster.png') });
  await browser.close();

  const input = ['-y', '-framerate', String(FPS), '-i', path.join(FRAMES, 'f%04d.png')];
  const run = args => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' });
  run([...input, '-c:v', 'libx264', '-preset', 'veryslow', '-crf', '24', '-tune', 'animation',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(OUT, 'coopeo-nouveaute.mp4')]);
  run([...input, '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-row-mt', '1', '-deadline', 'good',
    '-cpu-used', '1', '-pix_fmt', 'yuv420p', '-an', path.join(OUT, 'coopeo-nouveaute.webm')]);
  run(['-y', '-i', path.join(FRAMES, 'poster.png'), '-q:v', '82',
    path.join(OUT, 'coopeo-nouveaute-poster.webp')]);
  fs.rmSync(FRAMES, { recursive: true, force: true });
  for (const f of fs.readdirSync(OUT)) {
    console.log(f.padEnd(32), (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0) + ' Ko');
  }
})();
