// Draws the "10" sequence frames. window.MODE = 1 (connections), 2 (candles), 3 (blow)
(function () {
  const M = window.MODE;
  const cv = document.getElementById('c');
  const ctx = cv.getContext('2d');
  const r = rng(21);
  const cols = ['#F48C03', '#E01E6D', '#0CBF88', '#129BE0'];
  // background
  let g = ctx.createRadialGradient(960, 545, 0, 960, 545, 1100);
  if (M === 1) { g.addColorStop(0, '#16296A'); g.addColorStop(0.45, '#0B1640'); g.addColorStop(1, '#040817'); }
  else if (M === 2) { g.addColorStop(0, '#121E50'); g.addColorStop(0.4, '#080F2E'); g.addColorStop(1, '#02040C'); }
  else { g.addColorStop(0, '#0A1236'); g.addColorStop(0.4, '#050A20'); g.addColorStop(1, '#010208'); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);

  // star dust
  for (let i = 0; i < 260; i++) {
    ctx.globalAlpha = (M === 1 ? 0.5 : 0.3) * r(); ctx.fillStyle = '#9FD8FF';
    ctx.beginPath(); ctx.arc(r() * 1920, r() * 1080, r() * 1.8, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;

  const pts = tenPoints(700);
  const colorAt = (i) => { const t = i / pts.length; return t < 0.25 ? cols[0] : t < 0.5 ? cols[1] : t < 0.75 ? cols[2] : cols[3]; };
  const limit = M === 1 ? Math.floor(pts.length * 0.86) : pts.length;

  // string-art weave along the outline
  ctx.globalCompositeOperation = 'lighter';
  const weaveAlpha = M === 1 ? 0.16 : M === 2 ? 0.2 : 0.07;
  for (let i = 0; i < limit - 9; i++) {
    for (let k = 3; k < 10; k += 3) {
      const a = pts[i], b = pts[i + k];
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 70) continue;
      const j = () => (r() - 0.5) * 46;
      ctx.strokeStyle = colorAt(i); ctx.globalAlpha = weaveAlpha; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(a[0] + j(), a[1] + j()); ctx.lineTo(b[0] + j(), b[1] + j()); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  if (M === 1) {
    // connections from data cards to the outline
    const anchors = window.ANCHORS || [];
    anchors.forEach(([x, y, c], ai) => {
      for (let n = 0; n < 26; n++) {
        const p = pts[Math.floor(r() * limit)];
        const lg = ctx.createLinearGradient(x, y, p[0], p[1]);
        lg.addColorStop(0, c); lg.addColorStop(1, 'rgba(255,255,255,.0)');
        ctx.strokeStyle = lg; ctx.globalAlpha = 0.18 + r() * 0.22; ctx.lineWidth = 0.8 + r() * 1.2;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.quadraticCurveTo((x + p[0]) / 2 + (r() - 0.5) * 200, (y + p[1]) / 2 + (r() - 0.5) * 200, p[0], p[1]); ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
    // partially traced bright line
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [w, blur, a] of [[44, 36, 0.10], [22, 14, 0.5], [6, 4, 0.85]]) {
      ctx.globalAlpha = a; ctx.lineWidth = w; ctx.shadowBlur = blur;
      for (let i = 1; i < limit; i++) {
        if (Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) > 40) continue;
        const c = w === 6 ? '#FFFFFF' : colorAt(i); ctx.strokeStyle = c; ctx.shadowColor = colorAt(i);
        ctx.beginPath(); ctx.moveTo(...pts[i - 1]); ctx.lineTo(...pts[i]); ctx.stroke();
      }
    }
    // spark head
    const h = pts[limit - 1];
    let sg = ctx.createRadialGradient(h[0], h[1], 0, h[0], h[1], 90);
    sg.addColorStop(0, 'rgba(255,255,255,1)'); sg.addColorStop(0.15, 'rgba(150,230,255,.8)'); sg.addColorStop(1, 'rgba(61,184,255,0)');
    ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(h[0], h[1], 90, 0, 7); ctx.fill();
  }

  if (M === 2 || M === 3) {
    strokeTen(ctx, { width: 24, glow: M === 2 ? 34 : 16, alpha: M === 2 ? 1 : 0.28 });
    const z = TEN.zero;
    const F = [[0, -100, cols[1]], [-92, 0, cols[0]], [92, 0, cols[2]], [0, 100, cols[3]]];
    // warm inner light from flames
    if (M === 2) {
      const ig = ctx.createRadialGradient(z.cx, z.cy, 0, z.cx, z.cy, 260);
      ig.addColorStop(0, 'rgba(255,220,180,.20)'); ig.addColorStop(1, 'rgba(255,200,150,0)');
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(z.cx, z.cy, 260, 0, 7); ctx.fill();
    }
    F.forEach(([dx, dy, c], i) => {
      const x = z.cx + dx, y = z.cy + dy + 30;
      // wick
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y + 14); ctx.quadraticCurveTo(x + (M === 3 ? 6 : 1), y + 4, x + (M === 3 ? 5 : 2), y - 4); ctx.stroke();
      // ember
      ctx.globalCompositeOperation = 'lighter';
      const eg = ctx.createRadialGradient(x + 2, y - 4, 0, x + 2, y - 4, 7);
      eg.addColorStop(0, 'rgba(255,170,90,1)'); eg.addColorStop(1, 'rgba(255,90,40,0)');
      ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(x + 2, y - 4, 7, 0, 7); ctx.fill();
      if (M === 2) {
        drawFlame(ctx, x, y - 6, 74, c, { lean: (i - 1.5) * 0.03 });
      } else {
        if (i === 1 || i === 3) {
          // still burning, pushed by the breath
          drawFlame(ctx, x + 4, y - 4, 58, c, { lean: 1.15, stretch: 1.25, alpha: 0.85 });
        } else {
          // blown out: coloured smoke ribbons drifting right and up
          ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(3px)';
          for (let s = 0; s < 5; s++) {
            ctx.strokeStyle = c; ctx.globalAlpha = 0.5 - s * 0.08; ctx.lineWidth = 6 - s;
            ctx.beginPath(); ctx.moveTo(x + 3, y - 6);
            ctx.bezierCurveTo(x + 60 + s * 12, y - 40 - s * 6, x + 40 + s * 30, y - 120 - s * 10, x + 150 + s * 40, y - 160 - s * 30);
            ctx.stroke();
          }
          ctx.filter = 'none';
        }
      }
    });
    if (M === 3) {
      // breath: translucent streaks from the left
      ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(6px)';
      for (let i = 0; i < 26; i++) {
        const y = 380 + r() * 330, x0 = -100 + r() * 300, x1 = 900 + r() * 500;
        const bg = ctx.createLinearGradient(x0, 0, x1, 0);
        bg.addColorStop(0, 'rgba(180,225,255,0)'); bg.addColorStop(0.7, 'rgba(190,230,255,.28)'); bg.addColorStop(1, 'rgba(190,230,255,0)');
        ctx.strokeStyle = bg; ctx.lineWidth = 2 + r() * 8; ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.bezierCurveTo(x0 + 400, y, x1 - 300, y - 30 - r() * 60, x1, y - 60 - r() * 80); ctx.stroke();
      }
      ctx.filter = 'none';
      // drifting embers
      for (let i = 0; i < 70; i++) {
        const x = 1040 + r() * 520, y = 300 + r() * 360;
        ctx.globalAlpha = 0.3 + r() * 0.6; ctx.fillStyle = cols[i % 4]; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, 1 + r() * 2, 0, 7); ctx.fill();
      }
    }
  }
})();
