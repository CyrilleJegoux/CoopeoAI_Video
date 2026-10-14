// Éléments de l'univers « intelligence » (à partir du BOOM) : fond, badge, pastilles, fils lumineux.
// Reprend sources-images/ai.css (classes .bgAI, .glass, .chip, .badge, .doc).
import React from "react";
import { Spark } from "./brand";
import { FrameCanvas } from "./Stage";
import { rng } from "./anim";

export const AiBg: React.FC<{ seed?: number; cx?: number; cy?: number }> = ({ seed = 61, cx = 50, cy = 45 }) => (
  <>
    <div
      className="fill"
      style={{ background: `radial-gradient(ellipse 1300px 900px at ${cx}% ${cy}%,#13306F 0%,#0A1844 45%,#030714 100%)` }}
    />
    <FrameCanvas
      draw={(ctx, frame) => {
        const r = rng(seed);
        ctx.fillStyle = "#9FD8FF";
        for (let i = 0; i < 260; i++) {
          ctx.globalAlpha = 0.35 * r() * (0.7 + 0.3 * Math.sin(frame * 0.06 + i));
          ctx.beginPath();
          ctx.arc(r() * 1920 - frame * 0.1, r() * 1080, r() * 1.6, 0, 7);
          ctx.fill();
        }
      }}
    />
  </>
);

export const Badge: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 24, style }) => (
  <div className="badge" style={{ fontSize: size, ...style }}>
    <Spark size={size + 4} />
    {children}
  </div>
);

/** Point sur une courbe de Bézier cubique */
export const bez = (t: number, p0: number[], p1: number[], p2: number[], p3: number[]) => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

/** Trace une Bézier cubique jusqu'à la fraction `t` (fil qui se dessine) */
export const strokeBezPartial = (
  ctx: CanvasRenderingContext2D,
  t: number,
  p0: number[],
  p1: number[],
  p2: number[],
  p3: number[],
  steps = 48,
) => {
  if (t <= 0) return;
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1]);
  const n = Math.max(2, Math.ceil(steps * t));
  for (let k = 1; k <= n; k++) {
    const [x, y] = bez((k / n) * t, p0, p1, p2, p3);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
};

/** Fil pointillé bleu électrique (connexion IA) */
export const dottedWire = (ctx: CanvasRenderingContext2D, t: number, p0: number[], p1: number[], p2: number[], p3: number[], dot = true) => {
  ctx.save();
  ctx.strokeStyle = "#3DB8FF";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#3DB8FF";
  ctx.shadowBlur = 16;
  ctx.setLineDash([2, 10]);
  ctx.lineCap = "round";
  strokeBezPartial(ctx, t, p0, p1, p2, p3);
  ctx.setLineDash([]);
  if (dot && t >= 1) {
    ctx.fillStyle = "#BFF0FF";
    ctx.beginPath();
    ctx.arc(p3[0], p3[1], 6, 0, 7);
    ctx.fill();
  }
  ctx.restore();
};

/** Pastille IA (classe .chip) */
export const Chip: React.FC<{
  k: string;
  m?: string;
  column?: boolean;
  style?: React.CSSProperties;
  dot?: string;
}> = ({ k, m, column, style, dot }) => (
  <div
    className="chip"
    style={column ? { flexDirection: "column", alignItems: "flex-start", gap: 6, padding: "16px 22px", ...style } : style}
  >
    {column ? (
      <>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Spark size={22} />
          <span className="k">{k}</span>
        </div>
        {m ? (
          <span className="m" style={{ color: "#EAF0FF", paddingLeft: 32 }}>
            {m}
          </span>
        ) : null}
      </>
    ) : (
      <>
        {dot ? <span style={{ width: 14, height: 14, borderRadius: 4, background: dot, boxShadow: `0 0 10px ${dot}`, flex: "none" }} /> : <Spark size={22} />}
        <span className="k" style={dot ? { color: "#fff" } : undefined}>
          {k}
        </span>
        {m ? <span className="m">{m}</span> : null}
      </>
    )}
  </div>
);
