// Rend le film de démonstration de la transition connexion → dashboard.
//   node render.js            -> ../export/transition-connexion-dashboard.mp4
//   node render.js 0.5 1.2 3  -> seulement des images fixes à ces instants (contrôle)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const OUT = path.join(__dirname, '..', 'export');
const FRAMES = path.join(__dirname, '.frames');

(async () => {
  const stills = process.argv.slice(2).map(Number);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1904, height: 896 } });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?render');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const { FPS, DURATION } = await page.evaluate(() => window.META);
  const shoot = async (t, file) => {
    await page.evaluate(t => window.seek(t), t);
    await page.screenshot({ path: file });
  };
  fs.mkdirSync(OUT, { recursive: true });

  if (stills.length) {
    for (const t of stills) await shoot(t, path.join(OUT, `still-${t}s.png`));
    await browser.close();
    return;
  }

  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES);
  for (let f = 0; f < FPS * DURATION; f++) {
    await shoot(f / FPS, path.join(FRAMES, `f${String(f).padStart(4, '0')}.png`));
  }
  await browser.close();

  const mp4 = path.join(OUT, 'transition-connexion-dashboard.mp4');
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(FPS),
    '-i', path.join(FRAMES, 'f%04d.png'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4], { stdio: 'inherit' });
  fs.rmSync(FRAMES, { recursive: true, force: true });
  console.log(path.basename(mp4), (fs.statSync(mp4).size / 1024).toFixed(0) + ' Ko');
})();
