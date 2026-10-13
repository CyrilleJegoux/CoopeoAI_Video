// Shared helpers for key frames
// Grain overlay (SVG turbulence)
function grain(seed = 3, freq = 0.85) {
  return `<svg class="grain" width="1920" height="1080"><filter id="g${seed}"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g${seed})"/></svg>`;
}

// Official logo (white wordmark PNG, untouched shapes) + "AI" set on the wordmark baseline.
// Geometry of logo PNG: 1261x324, x-height 96..232, baseline y=232.
function logoAI({ width = 1100, ai = true, aiOpacity = 1, chroma = 0, glow = 1, id = 'L', logoSrc = 'logo-coopeo-white.png' } = {}) {
  const gap = 64, aiW = 250;
  const vbW = ai ? 1261 + gap + aiW : 1261;
  const h = width * 324 / vbW;
  const x = 1261 + gap;
  const fs = 214; // cap height ≈ 154 (~1.13 × x-height)
  const chromaLayers = chroma ? `
    <text x="${x - chroma}" y="232" font-family="Manrope" font-weight="800" font-size="${fs}" letter-spacing="-6" fill="#FF2E88" opacity=".8">AI</text>
    <text x="${x + chroma}" y="232" font-family="Manrope" font-weight="800" font-size="${fs}" letter-spacing="-6" fill="#19F0C0" opacity=".75">AI</text>` : '';
  return `<svg width="${width}" height="${h}" viewBox="0 0 ${vbW} 324" style="overflow:visible;display:block">
    <defs>
      <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E6FAFF"/><stop offset=".38" stop-color="#7FD6FF"/><stop offset=".72" stop-color="#3DB8FF"/><stop offset="1" stop-color="#2A7BFF"/>
      </linearGradient>
      <filter id="${id}glow" x="-50%" y="-80%" width="200%" height="260%">
        <feGaussianBlur stdDeviation="${18 * glow}" result="b1"/><feGaussianBlur in="SourceGraphic" stdDeviation="${55 * glow}" result="b2"/>
        <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <image href="${logoSrc}" x="0" y="0" width="1261" height="324"/>
    ${ai ? `<g opacity="${aiOpacity}">${chromaLayers}
      <text x="${x}" y="232" font-family="Manrope" font-weight="800" font-size="${fs}" letter-spacing="-6" fill="url(#${id}g)" filter="url(#${id}glow)">AI</text></g>` : ''}
  </svg>`;
}

// Flame drawn on canvas: teardrop with layered gradients
function drawFlame(ctx, x, y, h, color, { lean = 0, stretch = 1, alpha = 1 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean);
  ctx.globalAlpha = alpha;
  const H = h * 1.25 * stretch, w = h * 0.24;
  ctx.globalCompositeOperation = 'lighter';
  // halo
  let g = ctx.createRadialGradient(0, -H * 0.3, 0, 0, -H * 0.3, H * 1.5);
  g.addColorStop(0, hexA(color, 0.5)); g.addColorStop(0.3, hexA(color, 0.16)); g.addColorStop(1, hexA(color, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -H * 0.3, H * 1.5, 0, Math.PI * 2); ctx.fill();
  // candle flame silhouette: round base, widest low, long curved tip
  const shape = (s, tipBend) => {
    ctx.beginPath();
    ctx.moveTo(tipBend * s, -H * s);
    ctx.bezierCurveTo(w * 0.2 * s + tipBend * 0.6 * s, -H * 0.7 * s, w * 1.05 * s, -H * 0.38 * s, w * 0.95 * s, -H * 0.1 * s);
    ctx.bezierCurveTo(w * 0.9 * s, H * 0.06 * s, w * 0.5 * s, H * 0.14 * s, 0, H * 0.14 * s);
    ctx.bezierCurveTo(-w * 0.5 * s, H * 0.14 * s, -w * 0.9 * s, H * 0.06 * s, -w * 0.95 * s, -H * 0.1 * s);
    ctx.bezierCurveTo(-w * 1.05 * s, -H * 0.38 * s, -w * 0.2 * s + tipBend * 0.6 * s, -H * 0.7 * s, tipBend * s, -H * s);
    ctx.closePath();
  };
  const bend = w * 0.35;
  ctx.shadowColor = color; ctx.shadowBlur = h * 0.6;
  g = ctx.createLinearGradient(0, -H, 0, H * 0.14);
  g.addColorStop(0, hexA(color, 0)); g.addColorStop(0.18, hexA(color, 0.55)); g.addColorStop(0.55, color); g.addColorStop(0.85, hexA(color, 0.85)); g.addColorStop(1, 'rgba(60,90,255,.55)');
  ctx.fillStyle = g; shape(1, bend); ctx.fill();
  // bright inner core, low in the flame
  ctx.shadowBlur = h * 0.3; ctx.shadowColor = 'rgba(255,255,255,.9)';
  g = ctx.createLinearGradient(0, -H * 0.62, 0, H * 0.1);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.35, 'rgba(255,252,240,.95)'); g.addColorStop(0.8, 'rgba(255,248,225,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.save(); ctx.translate(0, -H * 0.04); shape(0.56, bend * 0.6); ctx.fill(); ctx.restore();
  // dark blue root near the wick
  ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
  g = ctx.createRadialGradient(0, H * 0.06, 0, 0, H * 0.06, w * 0.55);
  g.addColorStop(0, 'rgba(40,60,160,.55)'); g.addColorStop(1, 'rgba(40,60,160,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, H * 0.06, w * 0.55, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
// deterministic random
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// The "10" outline paths (in 1920x1080 space)
const TEN = {
  one: [[740, 360], [820, 300], [820, 790]],
  zero: { cx: 1080, cy: 545, rx: 175, ry: 245 },
};
function tenPoints(n = 400) {
  // sample points along the "10" outline for string-art
  const pts = [];
  const [a, b, c] = TEN.one;
  for (let i = 0; i < n * 0.12; i++) { const t = i / (n * 0.12); pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  for (let i = 0; i < n * 0.38; i++) { const t = i / (n * 0.38); pts.push([b[0], b[1] + (c[1] - b[1]) * t]); }
  const z = TEN.zero;
  for (let i = 0; i < n * 0.5; i++) { const t = (i / (n * 0.5)) * Math.PI * 2; pts.push([z.cx + Math.cos(t) * z.rx, z.cy + Math.sin(t) * z.ry]); }
  return pts;
}
function strokeTen(ctx, { width = 10, colors = ['#F48C03', '#E01E6D', '#0CBF88', '#129BE0'], glow = 30, alpha = 1, offset = 0 } = {}) {
  const [a, b, c] = TEN.one; const z = TEN.zero;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = alpha;
  const draw = (col, w, blur, dx = 0) => {
    ctx.strokeStyle = col; ctx.lineWidth = w; ctx.shadowColor = col; ctx.shadowBlur = blur;
    ctx.beginPath(); ctx.moveTo(a[0] + dx, a[1]); ctx.lineTo(b[0] + dx, b[1]); ctx.lineTo(c[0] + dx, c[1]); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(z.cx + dx, z.cy, z.rx, z.ry, 0, 0, Math.PI * 2); ctx.stroke();
  };
  const g1 = ctx.createLinearGradient(700, 300, 1260, 790);
  g1.addColorStop(0, colors[0]); g1.addColorStop(0.35, colors[1]); g1.addColorStop(0.65, colors[2]); g1.addColorStop(1, colors[3]);
  draw(g1, width * 2.2, glow * 2.2);
  ctx.globalAlpha = alpha * 0.55; draw(g1, width * 1.25, glow);
  ctx.globalAlpha = alpha; draw(g1, width, glow * 0.6);
  draw('rgba(255,255,255,.55)', width * 0.45, 8);
  draw('rgba(255,255,255,.95)', width * 0.16, 4);
  ctx.restore();
}

// Typography: in monospace (JBM) numbers, replace the wide mono space before "€" by a thin gap
document.addEventListener('DOMContentLoaded', () => {
  // large display figures read better in the brand face than in monospace (wide comma)
  document.querySelectorAll('body *').forEach(el => { const cs = getComputedStyle(el); if (/JBM/.test(cs.fontFamily) && parseFloat(cs.fontSize) >= 26) { el.style.fontFamily = 'Manrope,sans-serif'; el.style.fontWeight = el.style.fontWeight || '600'; el.style.fontVariantNumeric = 'tabular-nums'; } });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) { const n = walker.currentNode; if (/[\s ]€/.test(n.nodeValue)) nodes.push(n); }
  nodes.forEach(n => {
    const el = n.parentElement; if (!el) return;
    if (!/JBM/.test(getComputedStyle(el).fontFamily)) return;
    const parts = n.nodeValue.split(/[\s ]€/);
    const frag = document.createDocumentFragment();
    parts.forEach((p, i) => {
      frag.appendChild(document.createTextNode(p));
      if (i < parts.length - 1) { const s = document.createElement('span'); s.textContent = '€'; s.style.cssText = 'font-family:Manrope,sans-serif;margin-left:.14em'; frag.appendChild(s); }
    });
    n.replaceWith(frag);
  });
});
