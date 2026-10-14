// Acte VI · BOOM Coopeo AI (1:02 → 1:06), moment signature
// Portage animé de sources-images/boom.js (MODE 1 impact, 2 révélation, 3 stabilisé).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { acte6, colors, f } from "../config";
import { ease, lerp, prog, rng, springAt } from "../lib/anim";
import { LogoAI } from "../lib/brand";
import { Finish, FrameCanvas, Stage } from "../lib/Stage";

const COLS = [colors.pink, colors.orange, colors.green, colors.blue];
const CX = 960,
  CY = 540;
const T_LOGO = f(acte6.logo);
const T_AI = f(acte6.ai);
const T_STAB = f(acte6.stabilisation);

// tirages figés
const RAYS = (() => {
  const r = rng(32);
  return Array.from({ length: 160 }, (_, i) => ({ a: r() * Math.PI * 2, r0: 120 + r() * 120, len: 250 + r() * 700, c: COLS[i % 4], w: 0.6 + r() * 2.4, al: 0.35 + r() * 0.5 }));
})();
const SPARKS = (() => {
  const r = rng(33);
  return Array.from({ length: 260 }, (_, i) => ({ a: r() * Math.PI * 2, d: 200 + r() * 760, c: COLS[i % 4], L: 6 + r() * 26, al: 0.5 + r() * 0.5, w: 1 + r() * 2 }));
})();
const AI_SPARKS = (() => {
  const r = rng(34);
  return Array.from({ length: 90 }, () => ({ x: 1300 + r() * 420, y: 380 + r() * 330, al: 0.3 + r() * 0.7, c: r() > 0.5 ? "#BFF0FF" : "#3DB8FF", s: 0.8 + r() * 2.2, vx: (r() - 0.5) * 3, vy: (r() - 0.5) * 3 }));
})();

const drawBoom = (ctx: CanvasRenderingContext2D, frame: number) => {
  const m1 = 1 - prog(frame, T_LOGO - 8, T_LOGO + 3, ease.in); // impact
  const m3 = prog(frame, T_STAB - 10, T_STAB + 20, ease.inOut); // stabilisé
  // fond
  const bg = (stops: [number, string][], a: number) => {
    const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, 1150);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    ctx.globalAlpha = a;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1920, 1080);
  };
  bg([[0, "#12307A"], [0.35, "#0A1A4A"], [0.75, "#050C26"], [1, "#02050F"]], 1);
  if (m1 > 0) bg([[0, "#2B4FB8"], [0.3, "#10235F"], [1, "#03061A"]], m1);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "lighter";
  // poussière
  const rd = rng(31);
  ctx.fillStyle = "#9FD8FF";
  for (let i = 0; i < 300; i++) {
    ctx.globalAlpha = 0.35 * rd();
    ctx.beginPath();
    ctx.arc(rd() * 1920, rd() * 1080, rd() * 1.7, 0, 7);
    ctx.fill();
  }
  const ring = (rad: number, col: string, w: number, a: number, blur: number) => {
    ctx.save();
    ctx.filter = blur ? `blur(${blur}px)` : "none";
    ctx.globalAlpha = a;
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.ellipse(CX, CY, rad, rad * 0.94, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  // ------------------------------------------ MODE 1 : impact
  if (m1 > 0) {
    const burst = prog(frame, 0, 12, ease.outExpo); // expansion principale
    const drift = prog(frame, 12, T_AI + 4); // continue de s'étendre en s'estompant
    const k = burst * (1 + drift * 0.6);
    // rayons fins
    for (const ry of RAYS) {
      const r0 = ry.r0 * k,
        r1 = (ry.r0 + ry.len) * k;
      const x0 = CX + Math.cos(ry.a) * r0,
        y0 = CY + Math.sin(ry.a) * r0,
        x1 = CX + Math.cos(ry.a) * r1,
        y1 = CY + Math.sin(ry.a) * r1;
      const lg = ctx.createLinearGradient(x0, y0, x1, y1);
      lg.addColorStop(0, "rgba(255,255,255,.9)");
      lg.addColorStop(0.25, ry.c);
      lg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = lg;
      ctx.lineWidth = ry.w;
      ctx.globalAlpha = ry.al * m1;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
    // 4 anneaux d'onde de choc : rose, orange, vert, bleu
    [
      [260, 0],
      [400, 1],
      [560, 2],
      [740, 3],
    ].forEach(([rad, i]) => {
      const rr = rad * k;
      ring(rr, COLS[i], 34, 0.35 * m1, 22);
      ring(rr, COLS[i], 10, 0.9 * m1, 4);
      ring(rr, "#ffffff", 2, 0.6 * m1, 0);
    });
    // cœur lumineux blanc-bleu (jamais de blanc plein écran)
    const coreR = 380 * lerp(0.6, 1, burst) * (1 - drift * 0.5);
    const core = ctx.createRadialGradient(CX, CY, 0, CX, CY, coreR);
    core.addColorStop(0, "rgba(255,255,255,1)");
    core.addColorStop(0.12, "rgba(230,248,255,.95)");
    core.addColorStop(0.35, "rgba(110,200,255,.55)");
    core.addColorStop(1, "rgba(61,184,255,0)");
    ctx.globalAlpha = m1;
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(CX, CY, coreR, 0, 7);
    ctx.fill();
    // la fumée s'embrase : spirales aux 4 couleurs
    ctx.filter = "blur(2px)";
    const spin = frame * 0.05;
    COLS.forEach((c, kk) => {
      for (let s = 0; s < 3; s++) {
        ctx.strokeStyle = c;
        ctx.globalAlpha = (0.55 - s * 0.15) * m1;
        ctx.lineWidth = 5 - s;
        ctx.beginPath();
        for (let t = 0; t < 1; t += 0.01) {
          const a = (kk * Math.PI) / 2 + t * 4.2 + s * 0.15 + spin;
          const rad = (60 + t * 520) * lerp(0.3, 1, burst) * (1 + drift * 0.3);
          const x = CX + Math.cos(a) * rad,
            y = CY + Math.sin(a) * rad * 0.94;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    });
    ctx.filter = "none";
    // étincelles projetées
    for (const sp of SPARKS) {
      const d = sp.d * lerp(0.2, 1, burst) * (1 + drift * 0.8);
      const x = CX + Math.cos(sp.a) * d,
        y = CY + Math.sin(sp.a) * d * 0.94;
      ctx.strokeStyle = sp.c;
      ctx.globalAlpha = sp.al * m1;
      ctx.lineWidth = sp.w;
      ctx.shadowColor = sp.c;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(sp.a) * sp.L * (1 + burst), y + Math.sin(sp.a) * sp.L * (1 + burst));
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  // ------------------------------------------ MODE 2 : « AI » surgit
  const m2 = prog(frame, T_AI - 4, T_AI + 2) * (1 - m3);
  if (m2 > 0) {
    // anneaux résiduels au loin
    [
      [900, 0],
      [1020, 1],
      [1140, 2],
      [1260, 3],
    ].forEach(([rad, i]) => ring(rad * (1 + prog(frame, T_AI, T_STAB) * 0.15), COLS[i], 8, 0.35 * m2, 6));
    // halo derrière AI
    const g = ctx.createRadialGradient(1460, 540, 0, 1460, 540, 520);
    g.addColorStop(0, "rgba(120,210,255,.32)");
    g.addColorStop(0.4, "rgba(61,184,255,.12)");
    g.addColorStop(1, "rgba(61,184,255,0)");
    ctx.globalAlpha = m2;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(1460, 540, 520, 0, 7);
    ctx.fill();
    // reflet horizontal (flare anamorphique)
    const fl = 1 - prog(frame, T_AI + 4, T_AI + 30, ease.out);
    if (fl > 0) {
      for (const [h, a] of [
        [3, 0.95],
        [14, 0.35],
        [44, 0.12],
      ] as [number, number][]) {
        const lg = ctx.createLinearGradient(0, 0, 1920, 0);
        lg.addColorStop(0, "rgba(61,184,255,0)");
        lg.addColorStop(0.68, "rgba(61,184,255,0)");
        lg.addColorStop(0.72, `rgba(170,230,255,${a})`);
        lg.addColorStop(0.76, `rgba(255,255,255,${a})`);
        lg.addColorStop(0.9, `rgba(170,230,255,${a})`);
        lg.addColorStop(1, "rgba(61,184,255,0)");
        ctx.fillStyle = lg;
        ctx.globalAlpha = m2 * fl;
        ctx.filter = `blur(${h / 3}px)`;
        ctx.fillRect(0, 535 - h / 2, 1920, h);
      }
      ctx.filter = "none";
    }
    // balayage lumineux en diagonale
    const sw = prog(frame, T_AI, T_AI + 22, ease.inOut);
    if (sw > 0 && sw < 1) {
      ctx.save();
      ctx.translate(lerp(1250, 1900, sw), 540);
      ctx.rotate(0.32);
      const sg = ctx.createLinearGradient(-60, 0, 60, 0);
      sg.addColorStop(0, "rgba(160,230,255,0)");
      sg.addColorStop(0.5, "rgba(210,245,255,.55)");
      sg.addColorStop(1, "rgba(160,230,255,0)");
      ctx.globalAlpha = m2 * Math.sin(sw * Math.PI);
      ctx.fillStyle = sg;
      ctx.fillRect(-60, -700, 120, 1400);
      ctx.restore();
    }
    // scintillement électrique autour de AI
    const age = frame - T_AI;
    for (const s of AI_SPARKS) {
      ctx.globalAlpha = s.al * m2 * (1 - prog(frame, T_AI + 10, T_STAB)) * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.4 + s.x)));
      ctx.fillStyle = s.c;
      ctx.shadowColor = "#3DB8FF";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(s.x + s.vx * age, s.y + s.vy * age, s.s, 0, 7);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  // ------------------------------------------ MODE 3 : stabilisé (arcs discrets aux 4 couleurs)
  if (m3 > 0) {
    const arc = (x: number, y: number, rad: number, c: string, a: number, w: number) => {
      ctx.save();
      ctx.filter = "blur(1.5px)";
      ctx.globalAlpha = a * m3;
      ctx.strokeStyle = c;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
    const d = (1 - m3) * 120;
    arc(-260 - d, 1240 + d, 760, COLS[1], 0.22, 3);
    arc(-200 - d, 1300 + d, 880, COLS[0], 0.14, 2);
    arc(2200 + d, -260 - d, 780, COLS[3], 0.22, 3);
    arc(2140 + d, -320 - d, 900, COLS[2], 0.14, 2);
    const g = ctx.createRadialGradient(CX, 540, 0, CX, 540, 760);
    g.addColorStop(0, "rgba(61,140,255,.30)");
    g.addColorStop(1, "rgba(61,140,255,0)");
    ctx.globalAlpha = m3;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1920, 1080);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
};

export const Acte06: React.FC = () => {
  const frame = useCurrentFrame();
  // tremblement de caméra (4 à 6 images)
  const sh = frame < acte6.tremblement ? (1 - frame / acte6.tremblement) * 14 : 0;
  const r = rng(frame + 3);
  const shx = (r() - 0.5) * 2 * sh,
    shy = (r() - 0.5) * 2 * sh;
  // logo : déjà en place, net (apparaît dans la lumière du cœur)
  const logoIn = prog(frame, T_LOGO - 2, T_LOGO + 2, ease.out);
  // « AI » : arrive à droite, rebond court, aberration chromatique pendant 3 images
  const aiS = springAt(frame, T_AI, { damping: 9, stiffness: 260, mass: 0.6 });
  const chroma = frame >= T_AI && frame < T_AI + 3 ? 10 : 0;
  const sweep = prog(frame, T_AI + 2, T_AI + 20);
  // stabilisation : micro-zoom arrière (largeur 1380 → 1320, comme 08 → 09)
  const stab = prog(frame, T_AI, T_STAB + 10, ease.inOut);
  const width = lerp(1380 * 1.03, 1320, stab);
  return (
    <Stage>
      <AbsoluteFill style={{ transform: `translate(${shx}px,${shy}px)` }}>
        <FrameCanvas draw={drawBoom} />
        {logoIn > 0 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%) scale(${lerp(1.06, 1, prog(frame, T_LOGO - 2, T_LOGO + 8, ease.out))})`,
              opacity: logoIn,
            }}
          >
            <LogoAI
              width={width}
              id="B6"
              ai={frame >= T_AI}
              reserveAI
              aiOpacity={Math.min(1, aiS * 3)}
              aiDx={lerp(160, 0, aiS)}
              aiScale={lerp(1.25, 1, aiS)}
              chroma={chroma}
              glow={lerp(1.1, 0.8, stab)}
              sweep={sweep > 0 && sweep < 1 ? lerp(-0.2, 1.2, sweep) : -1}
            />
          </div>
        ) : null}
      </AbsoluteFill>
      <Finish />
    </Stage>
  );
};
