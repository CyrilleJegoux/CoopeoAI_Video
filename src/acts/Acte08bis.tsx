// Acte VIII bis · Le cercle vertueux (1:56 → 2:04)
// Portage animé de sources-images/circle.js (MODE 1 vicieux, 2 inversion, 3 vertueux).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { acte8bis, colors, f } from "../config";
import { ease, hexA, lerp, prog, rng, springAt } from "../lib/anim";
import { Symbole } from "../lib/brand";
import { Finish, FrameCanvas, Stage } from "../lib/Stage";

const C = acte8bis;
const CX = 960,
  CY = 535,
  R = 372;
const COLS = [colors.green, colors.orange, colors.pink, colors.blue];
const GAP = 21;
const DUR = f(8);
const T_INV = f(C.inversion),
  T_STOP = f(C.arret),
  T_SW = f(C.bascule),
  T_VERT = f(C.vertueux);
const rad = (d: number) => (d * Math.PI) / 180;
const pt = (d: number) => [CX + Math.cos(rad(d)) * R, CY + Math.sin(rad(d)) * R];
const swapAt = (i: number) => T_SW + i * 6;

// vitesse angulaire (degrés / image) : antihoraire qui ralentit, arrêt, puis horaire de plus en plus vite
const vel = (fr: number) => {
  if (fr < T_INV) return -lerp(2.2, 1.4, fr / T_INV);
  if (fr < T_STOP) return -1.4 * (1 - prog(fr, T_INV, T_STOP, ease.out));
  return lerp(0, 7.5, prog(fr, T_STOP, T_VERT + 10, ease.in));
};
const ANG: number[] = (() => {
  const a = [-90];
  for (let i = 1; i <= DUR + 2; i++) a.push(a[i - 1] + vel(i));
  return a;
})();

const draw = (ctx: CanvasRenderingContext2D, frame: number) => {
  const m2 = prog(frame, T_INV, T_INV + 24);
  const m3 = prog(frame, T_VERT, T_VERT + 20);
  const bg = (stops: [number, string][], a: number) => {
    const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, 1150);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    ctx.globalAlpha = a;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1920, 1080);
  };
  bg([[0, "#1E1A33"], [0.5, "#0E0C1C"], [1, "#05040A"]], 1);
  if (m2 > 0) bg([[0, "#16285E"], [0.5, "#0A1236"], [1, "#03060F"]], m2);
  if (m3 > 0) bg([[0, "#15357F"], [0.45, "#0A1A4A"], [1, "#030714"]], m3);
  const r = rng(70);
  ctx.fillStyle = "#9FD8FF";
  for (let i = 0; i < 260; i++) {
    ctx.globalAlpha = lerp(0.15, 0.35, m2) * r();
    ctx.beginPath();
    ctx.arc(r() * 1920, r() * 1080, r() * 1.6, 0, 7);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.lineCap = "round";

  const arrow = (deg: number, dir: number, c: string, a: number, glow: boolean) => {
    if (a <= 0) return;
    const [x, y] = pt(deg);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(x, y);
    ctx.rotate(rad(deg) + (dir * Math.PI) / 2);
    ctx.fillStyle = c;
    ctx.shadowColor = c;
    ctx.shadowBlur = glow ? 16 : 0;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-12, -14);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-12, 14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  C.noeuds.forEach((n, i) => {
    const a0 = n.angle + GAP,
      a1 = C.noeuds[(i + 1) % 5].angle + (i === 4 ? 360 : 0) - GAP;
    // apparition (le cercle vicieux se dessine dans le sens antihoraire)
    const grow = prog(frame, 6 + (4 - i) * 5, 22 + (4 - i) * 5, ease.out);
    if (grow <= 0) return;
    const sw = prog(frame, swapAt(i), swapAt(i) + 10, ease.inOut); // passage au positif
    const c = COLS[i % 4];
    // terne
    if (sw < 1) {
      ctx.globalAlpha = 1 - sw;
      ctx.strokeStyle = "rgba(150,90,110,.55)";
      ctx.lineWidth = 7;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(CX, CY, R, rad(a1 - (a1 - a0) * grow), rad(a1));
      ctx.stroke();
      if (grow >= 1) arrow(a0, -1, "rgba(170,100,120,.8)", 1 - sw, false);
    }
    // lumineux
    if (sw > 0) {
      ctx.globalCompositeOperation = "lighter";
      const passes: [number, number, number][] = [
        [lerp(26, 30, m3), lerp(0.1, 0.15, m3), lerp(16, 30, m3)],
        [lerp(14, 12, m3), lerp(0.25, 0.45, m3), lerp(8, 14, m3)],
        [7, lerp(0.9, 1, m3), 0],
      ];
      passes.forEach(([w, a, b]) => {
        ctx.strokeStyle = c;
        ctx.globalAlpha = a * sw;
        ctx.lineWidth = w;
        ctx.shadowColor = c;
        ctx.shadowBlur = b;
        ctx.beginPath();
        ctx.arc(CX, CY, R, rad(a0), rad(a0 + (a1 - a0) * sw));
        ctx.stroke();
      });
      ctx.globalCompositeOperation = "source-over";
      arrow(a1, 1, c, sw >= 1 ? 1 : 0, true);
    }
  });

  // comètes qui suivent le sens de rotation
  const v = vel(frame);
  const ang = ANG[Math.min(frame, ANG.length - 1)];
  const nC = frame >= T_SW ? 4 : 1;
  ctx.globalCompositeOperation = "lighter";
  for (let k = 0; k < nC; k++) {
    const a = ang + k * 90;
    const col = frame >= T_SW ? COLS[k] : "#C68FA3";
    const trail = Math.min(70, Math.abs(v) * 9 + 4);
    const dir = v >= 0 ? 1 : -1;
    for (let s = 0; s < 6; s++) {
      ctx.strokeStyle = col;
      ctx.globalAlpha = (frame >= T_SW ? 0.9 : 0.55) * (1 - s / 6);
      ctx.lineWidth = 6 - s * 0.8;
      ctx.shadowColor = col;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      const t0 = a - dir * trail * (s / 6),
        t1 = a - dir * trail * ((s + 1) / 6);
      ctx.arc(CX, CY, R, rad(Math.min(t0, t1)), rad(Math.max(t0, t1)));
      ctx.stroke();
    }
    const [x, y] = pt(a);
    const g = ctx.createRadialGradient(x, y, 0, x, y, 22);
    g.addColorStop(0, "rgba(255,255,255,.95)");
    g.addColorStop(1, hexA(frame >= T_SW ? COLS[k] : "#C68FA3", 0));
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, 7);
    ctx.fill();
  }
  // traînées de mise en rotation (horaire)
  if (frame > T_STOP && frame < T_VERT + 30) {
    const spin = prog(frame, T_STOP, T_VERT) * (1 - prog(frame, T_VERT, T_VERT + 30));
    COLS.forEach((c, k) => {
      const a1 = ang + k * 90;
      for (let j = 1; j < 7; j++) {
        ctx.strokeStyle = c;
        ctx.globalAlpha = ((0.12 / j) * 3) * spin;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(CX, CY, R + j * 14, rad(a1 - 40 - j * 6), rad(a1 - 4));
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(CX, CY, R - j * 14, rad(a1 - 40 - j * 6), rad(a1 - 4));
        ctx.stroke();
      }
    });
  }
  // lueur centrale
  if (m2 > 0) {
    const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, 260);
    g.addColorStop(0, `rgba(61,184,255,${lerp(0.25, 0.4, m3) * m2})`);
    g.addColorStop(1, "rgba(61,184,255,0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(CX, CY, 260, 0, 7);
    ctx.fill();
  }
  // particules des termes négatifs qui se dissolvent
  C.noeuds.forEach((n, i) => {
    const t = prog(frame, swapAt(i), swapAt(i) + 24);
    if (t <= 0 || t >= 1) return;
    const [x, y] = pt(n.angle);
    const rp = rng(90 + i);
    for (let k = 0; k < 60; k++) {
      const a = rp() * 6.28,
        d = (40 + rp() * 140) * (0.3 + t);
      ctx.globalAlpha = (0.25 + rp() * 0.5) * (1 - t);
      ctx.fillStyle = rp() > 0.5 ? "#C68FA3" : COLS[i % 4];
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * d * 1.4, y - 40 * t + Math.sin(a) * d * 0.6, 1 + rp() * 2, 0, 7);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
};

export const Acte08bis: React.FC = () => {
  const frame = useCurrentFrame();
  const center1 = prog(frame, 24, 40, ease.out) * (1 - prog(frame, T_INV - 4, T_INV + 4));
  const sym = springAt(frame, T_INV, { damping: 12, stiffness: 150 });
  const symGrow = lerp(90, 110, prog(frame, T_VERT, T_VERT + 20, ease.out));
  const caps = [
    prog(frame, 14, 28, ease.out) * (1 - prog(frame, T_INV - 4, T_INV + 2)),
    prog(frame, T_INV + 2, T_INV + 14, ease.out) * (1 - prog(frame, T_VERT - 4, T_VERT + 2)),
    prog(frame, T_VERT + 2, T_VERT + 14, ease.out),
  ];
  const exit = prog(frame, DUR - 8, DUR, ease.in);
  return (
    <Stage>
      <FrameCanvas draw={draw} />
      <AbsoluteFill style={{ opacity: 1 - exit }}>
        {C.noeuds.map((n, i) => {
          const [x, y] = pt(n.angle);
          const appear = springAt(frame, 4 + (4 - i) * 5, { damping: 16, stiffness: 150 });
          const sw = prog(frame, swapAt(i), swapAt(i) + 14, ease.inOut);
          const strike = prog(frame, swapAt(i) - 6, swapAt(i) + 2, ease.out);
          const goodIn = springAt(frame, swapAt(i) + 4, { damping: 13, stiffness: 170 });
          const c = COLS[i % 4];
          const glow = lerp(0.55, 0.7, prog(frame, T_VERT, T_VERT + 20));
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>
              {sw < 1 ? (
                <div
                  style={{
                    position: "relative",
                    padding: "18px 30px",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 30,
                    whiteSpace: "nowrap",
                    background: "rgba(60,40,60,.85)",
                    color: "#C9B9CC",
                    border: "1.5px solid rgba(170,110,130,.5)",
                    opacity: Math.min(1, appear * 2) * lerp(1, 0, sw),
                    transform: `translateY(${lerp(0, -70, sw)}%) scale(${lerp(1, 0.92, sw) * appear})`,
                    filter: sw > 0 ? `blur(${sw * 3}px)` : undefined,
                  }}
                >
                  {n.negatif}
                  <span style={{ position: "absolute", left: 24, right: 24, top: "50%", height: 3, background: "#C9B9CC", transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} />
                </div>
              ) : null}
              {goodIn > 0.01 ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    padding: "18px 30px",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 30,
                    whiteSpace: "nowrap",
                    background: "rgba(10,24,64,.88)",
                    color: "#fff",
                    border: `2px solid ${c}`,
                    boxShadow: `0 0 30px ${hexA(c, glow)},inset 0 0 18px ${hexA(c, 0.25)}`,
                    transform: `translate(-50%,-50%) scale(${goodIn})`,
                    opacity: Math.min(1, goodIn * 2),
                  }}
                >
                  {n.positif}
                </div>
              ) : null}
            </div>
          );
        })}
        {/* centre : texte du cercle vicieux, puis symbole Coopeo AI */}
        <div style={{ position: "absolute", left: CX, top: CY, transform: "translate(-50%,-50%)", textAlign: "center", color: "#8C7F9C", fontSize: 30, fontWeight: 600, lineHeight: 1.2, opacity: center1 }}>
          {C.centreVicieux[0]}
          <br />
          {C.centreVicieux[1]}
        </div>
        {sym > 0.01 ? (
          <div style={{ position: "absolute", left: CX, top: CY, transform: `translate(-50%,-50%) scale(${sym})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Symbole size={symGrow} />
            <div
              style={{
                fontWeight: 800,
                fontSize: symGrow * 0.45,
                marginTop: 10,
                background: "linear-gradient(180deg,#E6FAFF,#3DB8FF 70%,#2A7BFF)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 0 14px rgba(61,184,255,.7))",
              }}
            >
              AI
            </div>
          </div>
        ) : null}
        {C.textes.map((t, i) => (
          <div
            key={t}
            className="capt"
            style={{
              left: 0,
              right: 0,
              textAlign: "center",
              bottom: 46,
              fontSize: i === 2 ? 52 : 48,
              color: i === 0 ? "#B9AFC6" : "#fff",
              opacity: caps[i],
              transform: `translateY(${(1 - caps[i]) * 18}px)`,
            }}
          >
            {t}
          </div>
        ))}
      </AbsoluteFill>
      <Finish />
    </Stage>
  );
};
