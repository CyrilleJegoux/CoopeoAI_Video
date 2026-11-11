// Filme demo.html pour obtenir un aperçu vidéo de l'écran de chargement.
//   node render.js            -> export/apercu-chargement.mp4 (8 s)
//   node render.js 0.5 1.2 3  -> seulement des images fixes à ces instants (contrôle)
// Les animations CSS sont mises en pause puis placées image par image : le rendu est exact.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'export');
const FRAMES = path.join(ROOT, '.frames');
const W = 1280, H = 800, FPS = 30, DURATION = 8;

(async () => {
  const stills = process.argv.slice(2).map(Number);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + path.join(ROOT, 'demo.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const seek = t => page.evaluate(ms => document.getAnimations().forEach(a => {
    a.pause();
    a.currentTime = ms;
  }), t * 1000);
  fs.mkdirSync(OUT, { recursive: true });

  if (stills.length) {
    for (const t of stills) {
      await seek(t);
      await page.screenshot({ path: path.join(OUT, `still-${t}s.png`) });
    }
    await browser.close();
    return;
  }

  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES);
  for (let f = 0; f < FPS * DURATION; f++) {
    await seek(f / FPS);
    await page.screenshot({ path: path.join(FRAMES, `f${String(f).padStart(4, '0')}.png`) });
  }
  await browser.close();

  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(FPS),
    '-i', path.join(FRAMES, 'f%04d.png'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '22',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(OUT, 'apercu-chargement.mp4')],
    { stdio: 'inherit' });
  fs.rmSync(FRAMES, { recursive: true, force: true });
  console.log('apercu-chargement.mp4', (fs.statSync(path.join(OUT, 'apercu-chargement.mp4')).size / 1024).toFixed(0) + ' Ko');
})();
