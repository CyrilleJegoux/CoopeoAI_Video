// Vicious -> virtuous circle. window.MODE: 1 vicious (counter-clockwise), 2 reversing, 3 virtuous (clockwise)
(function () {
  const M = window.MODE;
  const cx = 960, cy = 535, R = 372;
  const cols = ['#0CBF88', '#F48C03', '#E01E6D', '#129BE0', '#3DB8FF'];
  // positions clockwise from top. good chain reads clockwise, bad chain reads counter-clockwise
  const N = [
    { a: -90, bad: "Travail dans l'urgence", good: 'Qualité de travail' },
    { a: -18, bad: 'Pertes', good: 'Moins de pertes' },
    { a: 54, bad: 'Baisse de marge', good: 'Marge' },
    { a: 126, bad: "Baisse du chiffre d'affaires", good: 'Rentabilité' },
    { a: 198, bad: 'Turn-over', good: "Cohésion d'équipe" },
  ];
  const cv = document.getElementById('c'), ctx = cv.getContext('2d');
  const r = rng(70 + M);
  let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1150);
  if (M === 1) { g.addColorStop(0, '#1E1A33'); g.addColorStop(0.5, '#0E0C1C'); g.addColorStop(1, '#05040A'); }
  else if (M === 2) { g.addColorStop(0, '#16285E'); g.addColorStop(0.5, '#0A1236'); g.addColorStop(1, '#03060F'); }
  else { g.addColorStop(0, '#15357F'); g.addColorStop(0.45, '#0A1A4A'); g.addColorStop(1, '#030714'); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 260; i++) { ctx.globalAlpha = (M === 1 ? 0.15 : 0.35) * r(); ctx.fillStyle = '#9FD8FF'; ctx.beginPath(); ctx.arc(r() * 1920, r() * 1080, r() * 1.6, 0, 7); ctx.fill(); }
  ctx.globalAlpha = 1;
  const rad = d => d * Math.PI / 180;
  const pt = d => [cx + Math.cos(rad(d)) * R, cy + Math.sin(rad(d)) * R];

  // arcs between nodes
  const gap = 21; // degrees left free around each node
  ctx.lineCap = 'round';
  N.forEach((n, i) => {
    const a0 = n.a + gap, a1 = N[(i + 1) % 5].a + (i === 4 ? 360 : 0) - gap;
    if (M === 1) {
      ctx.strokeStyle = 'rgba(150,90,110,.55)'; ctx.lineWidth = 7; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(cx, cy, R, rad(a0), rad(a1)); ctx.stroke();
      // arrow head pointing counter-clockwise (at a0)
      arrow(a0, -1, 'rgba(170,100,120,.8)');
    } else {
      const c = cols[i % 4];
      ctx.globalCompositeOperation = 'lighter';
      const blurPasses = M === 2 ? [[26, 0.10, 16], [14, 0.25, 8], [7, 0.9, 0]] : [[30, 0.15, 30], [12, 0.45, 14], [7, 1, 0]];
      blurPasses.forEach(([w, a, b]) => { ctx.strokeStyle = c; ctx.globalAlpha = a; ctx.lineWidth = w; ctx.shadowColor = c; ctx.shadowBlur = b; ctx.beginPath(); ctx.arc(cx, cy, R, rad(a0), rad(a1)); ctx.stroke(); });
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      arrow(a1, +1, c);
      if (M === 2) {
        // motion trails showing the clockwise spin-up
        ctx.globalCompositeOperation = 'lighter';
        for (let k = 1; k < 7; k++) { ctx.strokeStyle = c; ctx.globalAlpha = 0.12 / k * 3; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R + k * 14, rad(a1 - 40 - k * 6), rad(a1 - 4)); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, R - k * 14, rad(a1 - 40 - k * 6), rad(a1 - 4)); ctx.stroke(); }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      }
    }
  });
  function arrow(deg, dir, c) {
    const [x, y] = pt(deg); const t = rad(deg) + dir * Math.PI / 2; // tangent
    ctx.save(); ctx.translate(x, y); ctx.rotate(t); ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = M === 1 ? 0 : 16;
    ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-12, -14); ctx.lineTo(-6, 0); ctx.lineTo(-12, 14); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  // center glow
  if (M !== 1) {
    g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 260);
    g.addColorStop(0, M === 3 ? 'rgba(61,184,255,.40)' : 'rgba(61,184,255,.25)'); g.addColorStop(1, 'rgba(61,184,255,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 260, 0, 7); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
  }

  // node labels
  const L = document.getElementById('labels');
  const switched = M === 2 ? [0, 1] : [];
  N.forEach((n, i) => {
    const [x, y] = pt(n.a);
    let html;
    if (M === 1) html = `<div class="pill bad">${n.bad}</div>`;
    else if (M === 3) html = `<div class="pill good" style="--c:${cols[i % 4]}">${n.good}</div>`;
    else if (switched.includes(i)) html = `<div class="pill good" style="--c:${cols[i % 4]}">${n.good}</div>`;
    else html = `<div class="pill bad fading">${n.bad}</div><div class="pill good rising" style="--c:${cols[i % 4]}">${n.good}</div>`;
    L.insertAdjacentHTML('beforeend', `<div class="node" style="left:${x}px;top:${y}px">${html}</div>`);
  });
  if (M === 2) {
    // particles from dissolving bad labels
    ctx.globalCompositeOperation = 'lighter';
    N.forEach((n, i) => { if (switched.includes(i)) return; const [x, y] = pt(n.a);
      for (let k = 0; k < 60; k++) { const a = r() * 6.28, d = 40 + r() * 140; ctx.globalAlpha = 0.25 + r() * 0.5; ctx.fillStyle = r() > 0.5 ? '#C68FA3' : cols[i % 4]; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d * 1.4, y + Math.sin(a) * d * 0.6, 1 + r() * 2, 0, 7); ctx.fill(); } });
  }
})();
