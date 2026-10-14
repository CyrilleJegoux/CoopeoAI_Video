// Acte V · Convergence et 10 bougies (0:52 → 1:02), la surprise
// Portage animé de sources-images/ten.js (MODE 1 connexions, 2 bougies, 3 souffle).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { acte5, colors, f } from "../config";
import { ease, lerp, prog, rng, springAt } from "../lib/anim";
import { drawFlame, strokeTen, TEN, tenPoints } from "../lib/brand";
import { Caption, Finish, FrameCanvas, Stage } from "../lib/Stage";

const C = acte5.connexions;
const B = acte5.bougies;
const S = acte5.souffle;
const COLS = [colors.orange, colors.pink, colors.green, colors.blue];
const CX = 960,
  CY = 545;

// ---------------------------------------------------------------- données précalculées (tirages figés)
const PTS = tenPoints(700);
const colorAt = (i: number) => {
  const t = i / PTS.length;
  return t < 0.25 ? COLS[0] : t < 0.5 ? COLS[1] : t < 0.75 ? COLS[2] : COLS[3];
};
type Seg = { i: number; ax: number; ay: number; bx: number; by: number };
const WEAVE: Seg[] = (() => {
  const r = rng(21);
  const out: Seg[] = [];
  for (let i = 0; i < PTS.length - 9; i++) {
    for (let k = 3; k < 10; k += 3) {
      const a = PTS[i],
        b = PTS[i + k];
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 70) continue;
      const j = () => (r() - 0.5) * 46;
      out.push({ i: i + k, ax: a[0] + j(), ay: a[1] + j(), bx: b[0] + j(), by: b[1] + j() });
    }
  }
  return out;
})();
// fils : 26 par carte, vers un point du « 10 »
type Thread = { card: number; p: number; ox: number; oy: number; alpha: number; w: number; delay: number };
const THREADS: Thread[] = (() => {
  const r = rng(33);
  const out: Thread[] = [];
  C.cartes.forEach((_, card) => {
    for (let n = 0; n < 26; n++) {
      out.push({
        card,
        p: Math.floor(r() * PTS.length),
        ox: (r() - 0.5) * 200,
        oy: (r() - 0.5) * 200,
        alpha: 0.18 + r() * 0.22,
        w: 0.8 + r() * 1.2,
        delay: r(),
      });
    }
  });
  return out;
})();
// ancre (bord de la carte) relative au coin haut-gauche de la carte
const cardAnchor = (i: number) => {
  const c = C.cartes[i];
  return [c.x + 150, c.y + 34] as [number, number];
};
// orbite : les cartes gravitent autour du centre puis se figent
const orbit = (frame: number, i: number): [number, number] => {
  const t = prog(frame, 0, f(3.2), ease.out);
  const ang = (1 - t) * (1.1 + i * 0.06);
  const rad = lerp(0.7, 1, t);
  const [ax, ay] = cardAnchor(i);
  const dx = (ax - CX) * rad,
    dy = (ay - CY) * rad;
  const ca = Math.cos(ang),
    sa = Math.sin(ang);
  return [CX + dx * ca - dy * sa * 0.6, CY + dx * sa * 0.6 + dy * ca];
};

// flammes : rose (haut), orange (gauche), vert (droite), bleu (bas)
const FLAMES: [number, number, string][] = [
  [0, -100, COLS[1]],
  [-92, 0, COLS[0]],
  [92, 0, COLS[2]],
  [0, 100, COLS[3]],
];

const smoothNoise = (x: number, seed: number) => Math.sin(x * 1.7 + seed) * 0.6 + Math.sin(x * 3.1 + seed * 2.3) * 0.3 + Math.sin(x * 7.3 + seed * 0.7) * 0.1;

// ---------------------------------------------------------------- dessin principal
const drawScene = (ctx: CanvasRenderingContext2D, frame: number) => {
  const tOf = (s: number) => f(s);
  // fonds (MODE 1 → 2 → 3)
  const m2 = prog(frame, tOf(B.start), tOf(B.start) + 20);
  const m3 = prog(frame, tOf(S.debut), tOf(S.debut) + 30);
  const bg = (c0: string, c1: string, c2: string, a: number) => {
    const g = ctx.createRadialGradient(960, 545, 0, 960, 545, 1100);
    g.addColorStop(0, c0);
    g.addColorStop(0.45, c1);
    g.addColorStop(1, c2);
    ctx.globalAlpha = a;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1920, 1080);
  };
  bg("#16296A", "#0B1640", "#040817", 1);
  if (m2 > 0) bg("#121E50", "#080F2E", "#02040C", m2);
  if (m3 > 0) bg("#0A1236", "#050A20", "#010208", m3);
  ctx.globalAlpha = 1;
  // poussière d'étoiles
  const r = rng(21);
  ctx.fillStyle = "#9FD8FF";
  for (let i = 0; i < 260; i++) {
    ctx.globalAlpha = lerp(0.5, 0.3, m2) * r();
    ctx.beginPath();
    ctx.arc(r() * 1920 - frame * 0.08, r() * 1080, r() * 1.8, 0, 7);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // progression du tracé
  const trace = prog(frame, tOf(C.traceDebut), tOf(4.0), ease.inOut) * 0.86 + prog(frame, tOf(4.0), tOf(C.traceFin), ease.out) * 0.14;
  const limit = Math.floor(PTS.length * trace);
  const conn = 1 - prog(frame, tOf(B.start) - 4, tOf(B.start) + 10, ease.in); // phase connexions

  // tissage (string-art)
  ctx.globalCompositeOperation = "lighter";
  const weaveAlpha = conn > 0 ? lerp(0.2, 0.16, conn) : lerp(0.2, 0.07, m3);
  ctx.lineWidth = 1;
  ctx.globalAlpha = weaveAlpha;
  const wl = Math.max(limit, conn < 1 ? PTS.length : 0);
  for (const col of COLS) {
    ctx.strokeStyle = col;
    ctx.beginPath();
    for (const s of WEAVE) {
      if (s.i >= wl || colorAt(s.i) !== col) continue;
      ctx.moveTo(s.ax, s.ay);
      ctx.lineTo(s.bx, s.by);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // fils lumineux depuis les cartes
  if (conn > 0) {
    for (const th of THREADS) {
      const start = tOf(0.4) + th.delay * tOf(2.6);
      const grow = prog(frame, start, start + 18, ease.out);
      if (grow <= 0) continue;
      const [x, y] = orbit(frame, th.card);
      const p = PTS[th.p];
      const c = C.cartes[th.card].couleur;
      const mx = (x + p[0]) / 2 + th.ox,
        my = (y + p[1]) / 2 + th.oy;
      // point final partiel le long de la courbe quadratique
      const u = grow;
      const ex = (1 - u) * (1 - u) * x + 2 * (1 - u) * u * mx + u * u * p[0];
      const ey = (1 - u) * (1 - u) * y + 2 * (1 - u) * u * my + u * u * p[1];
      const qx = (1 - u) * x + u * mx,
        qy = (1 - u) * y + u * my;
      const lg = ctx.createLinearGradient(x, y, p[0], p[1]);
      lg.addColorStop(0, c);
      lg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = lg;
      ctx.globalAlpha = th.alpha * conn;
      ctx.lineWidth = th.w;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(qx, qy, ex, ey);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // trait principal brillant, tracé progressivement
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const [w, blur, a] of [
      [70, 50, 0.22],
      [44, 36, 0.3],
      [26, 18, 0.85],
      [8, 6, 1],
    ] as [number, number, number][]) {
      ctx.globalAlpha = a * conn;
      ctx.lineWidth = w;
      ctx.shadowBlur = blur;
      // un seul tracé par couleur (au lieu d'un segment à la fois)
      for (const col of COLS) {
        ctx.strokeStyle = w === 8 ? "#FFFFFF" : col;
        ctx.shadowColor = col;
        ctx.beginPath();
        let open = false;
        for (let i = 1; i < limit; i++) {
          const jump = Math.hypot(PTS[i][0] - PTS[i - 1][0], PTS[i][1] - PTS[i - 1][1]) > 40;
          if (jump || colorAt(i) !== col) {
            open = false;
            continue;
          }
          if (!open) {
            ctx.moveTo(PTS[i - 1][0], PTS[i - 1][1]);
            open = true;
          }
          ctx.lineTo(PTS[i][0], PTS[i][1]);
        }
        ctx.stroke();
      }
    }
    ctx.shadowBlur = 0;
    // étincelle à la tête du tracé
    if (limit > 1 && trace < 1) {
      const h = PTS[limit - 1];
      const flick = 0.85 + 0.15 * Math.sin(frame * 1.7);
      const sg = ctx.createRadialGradient(h[0], h[1], 0, h[0], h[1], 90 * flick);
      sg.addColorStop(0, "rgba(255,255,255,1)");
      sg.addColorStop(0.15, "rgba(150,230,255,.8)");
      sg.addColorStop(1, "rgba(61,184,255,0)");
      ctx.globalAlpha = conn;
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(h[0], h[1], 90, 0, 7);
      ctx.fill();
      // petites étincelles
      const rs = rng(frame + 7);
      ctx.fillStyle = "#DFF6FF";
      for (let k = 0; k < 10; k++) {
        ctx.globalAlpha = conn * rs();
        ctx.beginPath();
        ctx.arc(h[0] + (rs() - 0.5) * 70, h[1] + (rs() - 0.5) * 70, 1 + rs() * 2, 0, 7);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ------------------------------------------------ bougies et souffle
  if (m2 > 0) {
    const dim = lerp(1, 0.28, prog(frame, tOf(S.debut) + 2, tOf(S.debut) + 14, ease.out));
    strokeTen(ctx, { width: 24, glow: lerp(34, 16, m3), alpha: m2 * dim });
    const z = TEN.zero;
    const litN = B.allumage.reduce((a, t) => a + prog(frame, tOf(t), tOf(t) + 8), 0);
    // lumière chaude intérieure
    const warm = (litN / 4) * (1 - m3 * 0.8);
    if (warm > 0) {
      const ig = ctx.createRadialGradient(z.cx, z.cy, 0, z.cx, z.cy, 260);
      ig.addColorStop(0, `rgba(255,220,180,${0.2 * warm})`);
      ig.addColorStop(1, "rgba(255,200,150,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = ig;
      ctx.beginPath();
      ctx.arc(z.cx, z.cy, 260, 0, 7);
      ctx.fill();
    }
    // front du souffle (x), de gauche à droite
    const breath = prog(frame, tOf(S.debut), tOf(S.debut) + 26, ease.inOut);
    const frontX = lerp(-300, 2200, breath);
    FLAMES.forEach(([dx, dy, c], i) => {
      const x = z.cx + dx,
        y = z.cy + dy + 30;
      const out = frame >= tOf(S.extinction[i]);
      const blown = prog(frame, tOf(S.debut) + 2, tOf(S.debut) + 9, ease.out); // poussée du souffle
      // mèche
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = m2;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#1a1410";
      ctx.lineWidth = 3.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y + 14);
      ctx.quadraticCurveTo(x + 1 + blown * 5, y + 4, x + 2 + blown * 3, y - 4);
      ctx.stroke();
      const ign = prog(frame, tOf(B.allumage[i]), tOf(B.allumage[i]) + 8, ease.out);
      // braise
      const emberA = out ? 1 - prog(frame, tOf(S.extinction[i]), tOf(S.extinction[i]) + 30) : ign;
      if (emberA > 0) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = emberA;
        const eg = ctx.createRadialGradient(x + 2, y - 4, 0, x + 2, y - 4, 7);
        eg.addColorStop(0, "rgba(255,170,90,1)");
        eg.addColorStop(1, "rgba(255,90,40,0)");
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.arc(x + 2, y - 4, 7, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!out && ign > 0) {
        // flamme vivante qui vacille ; allumage = petit embrasement
        const tt = frame / 30;
        const flare = ign < 1 ? 1 + (1 - ign) * 0.6 : 1;
        const lean = (i - 1.5) * 0.03 + smoothNoise(tt * 2, i) * 0.06 + blown * 1.15;
        const stretch = (1 + smoothNoise(tt * 3, i + 5) * 0.06) * (1 + blown * 0.25) * flare;
        drawFlame(ctx, x + blown * 4, y - 6 + blown * 2, lerp(10, 74, ign) * (1 - blown * 0.2), c, {
          lean,
          stretch,
          alpha: lerp(1, 0.85, blown),
        });
        // étincelle d'allumette à l'allumage
        if (ign < 1) {
          ctx.globalCompositeOperation = "lighter";
          const sg = ctx.createRadialGradient(x, y - 20, 0, x, y - 20, 70);
          sg.addColorStop(0, `rgba(255,240,210,${1 - ign})`);
          sg.addColorStop(1, "rgba(255,200,120,0)");
          ctx.fillStyle = sg;
          ctx.beginPath();
          ctx.arc(x, y - 20, 70, 0, 7);
          ctx.fill();
        }
      }
      // fumée colorée qui s'enroule vers le centre
      if (out) {
        const age = (frame - tOf(S.extinction[i])) / 30; // secondes
        const len = Math.min(1, age * 1.3);
        const fade = 1 - prog(frame, tOf(S.extinction[i]) + 30, f(10), ease.in) * 0.6;
        ctx.globalCompositeOperation = "lighter";
        ctx.filter = "blur(5px)";
        for (let s = 0; s < 5; s++) {
          ctx.strokeStyle = c;
          ctx.globalAlpha = (0.36 - s * 0.06) * fade;
          ctx.lineWidth = 5 - s * 0.7;
          ctx.beginPath();
          const steps = 40;
          const r0 = Math.hypot(x + 3 - z.cx, y - 6 - z.cy);
          const a0 = Math.atan2(y - 6 - z.cy, x + 3 - z.cx);
          for (let k = 0; k <= steps; k++) {
            const u = (k / steps) * len;
            // d'abord poussée vers la droite par le souffle, puis spirale vers le centre
            const push = Math.sin(Math.min(1, u / Math.max(len, 0.01)) * Math.PI) * (40 + s * 12) * len;
            const rad = r0 * (1 - 0.45 * u) + s * 7 * u;
            const ang = a0 + u * (1.6 + s * 0.12) + age * 0.25;
            const px = z.cx + Math.cos(ang) * rad + push + smoothNoise(u * 3 + age, s + i) * 5;
            const py = z.cy + Math.sin(ang) * rad - u * 40 + smoothNoise(u * 3 + age, s * 2 + i) * 4;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        ctx.filter = "none";
      }
    });
    // souffle : traînées translucides qui traversent l'écran
    if (breath > 0 && breath < 1.0001 && frame < tOf(S.debut) + 40) {
      const rb = rng(14);
      const fadeB = 1 - prog(frame, tOf(S.debut) + 24, tOf(S.debut) + 40);
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = "blur(6px)";
      for (let i = 0; i < 26; i++) {
        const y = 380 + rb() * 330,
          len = 700 + rb() * 600;
        const x1 = frontX + rb() * 200,
          x0 = x1 - len;
        const g = ctx.createLinearGradient(x0, 0, x1, 0);
        g.addColorStop(0, "rgba(180,225,255,0)");
        g.addColorStop(0.7, "rgba(190,230,255,.28)");
        g.addColorStop(1, "rgba(190,230,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 2 + rb() * 8;
        ctx.globalAlpha = fadeB;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.bezierCurveTo(x0 + 400, y, x1 - 300, y - 30 - rb() * 60, x1, y - 60 - rb() * 80);
        ctx.stroke();
      }
      ctx.filter = "none";
    }
    // braises qui dérivent
    if (frame > tOf(S.extinction[0])) {
      const re = rng(55);
      const age = (frame - tOf(S.extinction[0])) / 30;
      for (let i = 0; i < 70; i++) {
        const x = 1040 + re() * 520 + age * (30 + re() * 60) - 120,
          y = 300 + re() * 360 - age * 25;
        ctx.globalAlpha = (0.3 + re() * 0.6) * Math.min(1, age * 3) * (1 - prog(frame, f(9.6), f(10)) * 0.5);
        ctx.fillStyle = COLS[i % 4];
        ctx.shadowColor = COLS[i % 4];
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 1 + re() * 2, 0, 7);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
};

// ---------------------------------------------------------------- cartes (HTML) qui gravitent
const Cards: React.FC<{ frame: number }> = ({ frame }) => {
  const out = prog(frame, f(B.start) - 6, f(B.start) + 8, ease.in);
  if (out >= 1) return null;
  return (
    <>
      {C.cartes.map((c, i) => {
        const [ax, ay] = orbit(frame, i);
        const [fx, fy] = cardAnchor(i);
        const appear = springAt(frame, i * 2, { damping: 15, stiffness: 140 });
        // les cartes partent vers l'extérieur en disparaissant
        const dirx = fx - CX,
          diry = fy - CY;
        return (
          <div
            key={c.titre}
            style={{
              position: "absolute",
              left: ax - 150 + dirx * out * 0.6,
              top: ay - 34 + diry * out * 0.6,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "18px 24px",
              borderRadius: 20,
              background: "rgba(246,248,255,.96)",
              color: "#0B1430",
              boxShadow: "0 30px 70px rgba(0,0,0,.55)",
              fontSize: 28,
              whiteSpace: "nowrap",
              transform: `scale(${appear * (c.flou ? 0.85 : 1)})`,
              transformOrigin: "50% 50%",
              filter: c.flou ? `blur(${c.flou}px)` : undefined,
              opacity: (c.flou ? 0.85 : 1) * (1 - out) * Math.min(1, appear * 2),
            }}
          >
            <span style={{ width: 32, height: 32, borderRadius: 9, background: c.couleur }} />
            <b style={{ fontWeight: 800 }}>{c.titre}</b>
            {c.valeur ? <span style={{ fontFamily: "JBM", fontSize: 26, color: "#4A5578" }}>{c.valeur}</span> : null}
          </div>
        );
      })}
    </>
  );
};

export const Acte05: React.FC = () => {
  const frame = useCurrentFrame();
  const cap1 = prog(frame, f(C.texteA), f(C.texteA) + 14, ease.out) * (1 - prog(frame, f(B.start) - 8, f(B.start)));
  const cap2 = prog(frame, f(B.texteA), f(B.texteA) + 12, ease.out) * (1 - prog(frame, f(S.start), f(S.start) + 8));
  // caméra : orbite qui ralentit et se fige de face, puis lente avancée sur les bougies
  const rotY = lerp(14, 0, prog(frame, 0, f(3.4), ease.out));
  const zoom = 1 + prog(frame, f(B.start), f(S.debut), ease.inOut) * 0.06 + prog(frame, f(S.start), f(S.debut)) * 0.02;
  return (
    <Stage>
      <AbsoluteFill style={{ transform: `perspective(2400px) rotateY(${rotY}deg) scale(${zoom})`, transformOrigin: "1000px 545px" }}>
        <FrameCanvas draw={drawScene} />
        <Cards frame={frame} />
      </AbsoluteFill>
      <Caption opacity={cap1} y={(1 - cap1) * 20} style={{ bottom: 56, fontSize: 54, textShadow: "0 4px 30px rgba(0,0,0,.9)" }}>
        {C.texte}
      </Caption>
      <Caption opacity={cap2} y={(1 - cap2) * 16} style={{ bottom: 120, fontSize: 62, fontWeight: 700, textShadow: "0 4px 40px rgba(0,0,0,.9)" }}>
        {B.texte}
      </Caption>
      <Finish />
    </Stage>
  );
};

