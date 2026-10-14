// Acte X · Merci (2:12 → 2:15) — réf. 11-merci
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { acte10, anthonyInitiales, colors, equipeCoopeo, f } from "../config";
import { ease, prog, rng, springAt } from "../lib/anim";
import { Symbole } from "../lib/brand";
import { Finish, FrameCanvas, Stage } from "../lib/Stage";

const COLS = [colors.pink, colors.orange, colors.green, colors.blue];
const P = acte10.positions;
const litAt = (i: number) => f(acte10.allumageA) + Math.round(i * acte10.pas * 30);

// prénoms : possibilité de distinguer les deux « Anthony »
const NOMS = (() => {
  let k = 0;
  return equipeCoopeo.map((n) => {
    if (n === "Anthony") {
      const alt = anthonyInitiales[k++];
      return alt || n;
    }
    return n;
  });
})();

const draw = (ctx: CanvasRenderingContext2D, frame: number) => {
  const g = ctx.createRadialGradient(960, 560, 0, 960, 560, 1150);
  g.addColorStop(0, "#10286A");
  g.addColorStop(0.45, "#081540");
  g.addColorStop(1, "#020611");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1920, 1080);
  const r = rng(41);
  ctx.fillStyle = "#9FD8FF";
  for (let i = 0; i < 300; i++) {
    ctx.globalAlpha = 0.35 * r();
    ctx.beginPath();
    ctx.arc(r() * 1920, r() * 1080, r() * 1.6, 0, 7);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "lighter";
  // fils entre voisins proches, qui se tissent quand les deux prénoms sont allumés
  for (let a = 0; a < P.length; a++)
    for (let b = a + 1; b < P.length; b++) {
      const d = Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1]);
      if (d > 320) continue;
      const t = prog(frame, Math.max(litAt(a), litAt(b)), Math.max(litAt(a), litAt(b)) + 8, ease.out);
      if (t <= 0) continue;
      const lg = ctx.createLinearGradient(P[a][0], P[a][1] - 16, P[b][0], P[b][1] - 16);
      lg.addColorStop(0, COLS[a % 4]);
      lg.addColorStop(1, COLS[b % 4]);
      ctx.strokeStyle = lg;
      ctx.globalAlpha = 0.32 * (1 - d / 320) + 0.06;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(P[a][0], P[a][1] - 16);
      ctx.lineTo(P[a][0] + (P[b][0] - P[a][0]) * t, P[a][1] - 16 + (P[b][1] - P[a][1]) * t);
      ctx.stroke();
    }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
};

export const Acte10: React.FC = () => {
  const frame = useCurrentFrame();
  const head = springAt(frame, 0, { damping: 18, stiffness: 110 });
  const end = prog(frame, f(3) - 8, f(3), ease.in);
  return (
    <Stage>
      <FrameCanvas draw={draw} />
      <AbsoluteFill style={{ opacity: 1 - end * 0.85 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: Math.min(1, head * 2), transform: `translateY(${(1 - head) * 20}px)` }}>
          <Symbole size={64} style={{ margin: "0 auto 26px" }} />
          <div style={{ fontWeight: 700, fontSize: 54, letterSpacing: "-.015em", lineHeight: 1.25 }}>
            {acte10.titre[0]}
            <br />
            {acte10.titre[1]}
          </div>
        </div>
        {NOMS.map((n, i) => {
          const s = springAt(frame, litAt(i), { damping: 12, stiffness: 220 });
          const c = COLS[i % 4];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: P[i][0],
                top: P[i][1] + 12,
                transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * Math.min(1, s)})`,
                fontWeight: 600,
                fontSize: 38,
                letterSpacing: "-.01em",
                color: "#EEF2FF",
                whiteSpace: "nowrap",
                textShadow: "0 0 18px rgba(120,190,255,.45)",
                opacity: Math.min(1, s * 1.5),
              }}
            >
              <i style={{ position: "absolute", left: "50%", top: -16, width: 8, height: 8, marginLeft: -4, borderRadius: "50%", background: c, boxShadow: `0 0 ${12 + 10 * Math.max(0, 1 - (frame - litAt(i)) / 10)}px 3px ${c}` }} />
              {n}
            </div>
          );
        })}
      </AbsoluteFill>
      <Finish />
    </Stage>
  );
};
