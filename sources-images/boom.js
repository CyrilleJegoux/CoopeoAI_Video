// Background + effects for BOOM / signature frames. window.MODE: 1 impact, 2 reveal, 3 stable, 4 signature
(function () {
  const M = window.MODE;
  const ctx = document.getElementById('c').getContext('2d');
  const r = rng(31 + M);
  const cols = ['#E01E6D', '#F48C03', '#0CBF88', '#129BE0'];
  const cx = 960, cy = 540;
  let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1150);
  if (M === 1) { g.addColorStop(0, '#2B4FB8'); g.addColorStop(0.3, '#10235F'); g.addColorStop(1, '#03061A'); }
  else { g.addColorStop(0, '#12307A'); g.addColorStop(0.35, '#0A1A4A'); g.addColorStop(0.75, '#050C26'); g.addColorStop(1, '#02050F'); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  ctx.globalCompositeOperation = 'lighter';

  // dust
  for (let i = 0; i < 300; i++) { ctx.globalAlpha = 0.35 * r(); ctx.fillStyle = '#9FD8FF'; ctx.beginPath(); ctx.arc(r() * 1920, r() * 1080, r() * 1.7, 0, 7); ctx.fill(); }
  ctx.globalAlpha = 1;

  const ring = (rad, col, w, a, blur) => {
    ctx.save(); ctx.filter = `blur(${blur}px)`; ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); ctx.ellipse(cx, cy, rad, rad * 0.94, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  };

  if (M === 1) {
    // rays
    for (let i = 0; i < 160; i++) {
      const a = r() * Math.PI * 2, r0 = 120 + r() * 120, r1 = r0 + 250 + r() * 700, c = cols[i % 4];
      const lg = ctx.createLinearGradient(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      lg.addColorStop(0, 'rgba(255,255,255,.9)'); lg.addColorStop(0.25, c); lg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = lg; ctx.lineWidth = 0.6 + r() * 2.4; ctx.globalAlpha = 0.35 + r() * 0.5;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke();
    }
    // shock rings: pink, orange, green, blue
    [[260, 0], [400, 1], [560, 2], [740, 3]].forEach(([rad, i]) => {
      ring(rad, cols[i], 34, 0.35, 22); ring(rad, cols[i], 10, 0.9, 4); ring(rad, '#ffffff', 2, 0.6, 0);
    });
    // core
    g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 380);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.12, 'rgba(230,248,255,.95)'); g.addColorStop(0.35, 'rgba(110,200,255,.55)'); g.addColorStop(1, 'rgba(61,184,255,0)');
    ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 380, 0, 7); ctx.fill();
    // spiralling smoke turned into light
    ctx.filter = 'blur(2px)';
    cols.forEach((c, k) => {
      for (let s = 0; s < 3; s++) {
        ctx.strokeStyle = c; ctx.globalAlpha = 0.55 - s * 0.15; ctx.lineWidth = 5 - s;
        ctx.beginPath();
        for (let t = 0; t < 1; t += 0.01) {
          const a = k * Math.PI / 2 + t * 4.2 + s * 0.15, rad = 60 + t * 520;
          const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad * 0.94;
          t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    });
    ctx.filter = 'none';
    // sparks
    for (let i = 0; i < 260; i++) {
      const a = r() * Math.PI * 2, d = 200 + r() * 760, c = cols[i % 4];
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.94, L = 6 + r() * 26;
      ctx.strokeStyle = c; ctx.globalAlpha = 0.5 + r() * 0.5; ctx.lineWidth = 1 + r() * 2; ctx.shadowColor = c; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
    }
  }

  if (M === 2) {
    // residual rings far out
    [[900, 0], [1020, 1], [1140, 2], [1260, 3]].forEach(([rad, i]) => ring(rad, cols[i], 8, 0.35, 6));
    // halo behind AI
    g = ctx.createRadialGradient(1460, 540, 0, 1460, 540, 520);
    g.addColorStop(0, 'rgba(120,210,255,.32)'); g.addColorStop(0.4, 'rgba(61,184,255,.12)'); g.addColorStop(1, 'rgba(61,184,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(1460, 540, 520, 0, 7); ctx.fill();
    // anamorphic flare
    for (const [h, a] of [[3, 0.95], [14, 0.35], [44, 0.12]]) {
      const lg = ctx.createLinearGradient(0, 0, 1920, 0);
      lg.addColorStop(0, 'rgba(61,184,255,0)'); lg.addColorStop(0.68, 'rgba(61,184,255,0)'); lg.addColorStop(0.72, `rgba(170,230,255,${a})`); lg.addColorStop(0.76, `rgba(255,255,255,${a})`); lg.addColorStop(0.9, `rgba(170,230,255,${a})`); lg.addColorStop(1, 'rgba(61,184,255,0)');
      ctx.fillStyle = lg; ctx.filter = `blur(${h / 3}px)`; ctx.fillRect(0, 535 - h / 2, 1920, h);
    }
    ctx.filter = 'none';
    // diagonal light sweep
    ctx.save(); ctx.translate(1600, 540); ctx.rotate(0.32);
    const sg = ctx.createLinearGradient(-60, 0, 60, 0);
    sg.addColorStop(0, 'rgba(160,230,255,0)'); sg.addColorStop(0.5, 'rgba(210,245,255,.55)'); sg.addColorStop(1, 'rgba(160,230,255,0)');
    ctx.fillStyle = sg; ctx.fillRect(-60, -700, 120, 1400); ctx.restore();
    // sparks around AI
    for (let i = 0; i < 90; i++) {
      const x = 1300 + r() * 420, y = 380 + r() * 330;
      ctx.globalAlpha = 0.3 + r() * 0.7; ctx.fillStyle = r() > 0.5 ? '#BFF0FF' : '#3DB8FF'; ctx.shadowColor = '#3DB8FF'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(x, y, 0.8 + r() * 2.2, 0, 7); ctx.fill();
    }
  }

  if (M === 3 || M === 4) {
    // calm: soft brand arcs at the edges + gentle electric glow behind logo
    const arc = (x, y, rad, c, a, w) => { ctx.save(); ctx.filter = 'blur(1.5px)'; ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); };
    arc(-260, 1240, 760, cols[1], 0.22, 3); arc(-200, 1300, 880, cols[0], 0.14, 2);
    arc(2200, -260, 780, cols[3], 0.22, 3); arc(2140, -320, 900, cols[2], 0.14, 2);
    g = ctx.createRadialGradient(cx, M === 3 ? 540 : 470, 0, cx, M === 3 ? 540 : 470, 760);
    g.addColorStop(0, 'rgba(61,140,255,.30)'); g.addColorStop(1, 'rgba(61,140,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  }
})();
