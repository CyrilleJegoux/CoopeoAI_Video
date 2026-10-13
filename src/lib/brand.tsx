// Portage de sources-images/lib.js : logo + « AI », flammes, « 10 ».
import React from "react";
import { Img, staticFile } from "remotion";
import { colors } from "../config";
import { hexA } from "./anim";

export const LOGO_WHITE = "assets/logo-coopeo-blanc-hd.png"; // 1261 × 324
export const LOGO_COLOR = "assets/logo-coopeo-couleur.png"; // 1261 × 324
export const SYMBOL = "assets/symbole-coopeo.png"; // 600 × 600

/**
 * Logo officiel (PNG blanc, formes intactes) + « AI » posé sur la ligne de base du wordmark.
 * Géométrie du PNG : 1261×324, minuscules de y=96 à y=232, ligne de base y=232.
 * Paramètres identiques à logoAI() de lib.js (gap 64, font-size 214, letter-spacing -6).
 */
export const LogoAI: React.FC<{
  width?: number;
  ai?: boolean;
  aiOpacity?: number;
  aiDx?: number;
  aiScale?: number;
  chroma?: number;
  glow?: number;
  id?: string;
  logoSrc?: string;
  logoOpacity?: number;
  /** réserve la place du AI même s'il est masqué (pour garder le logo au même endroit) */
  reserveAI?: boolean;
  sweep?: number; // -1 = pas de balayage, 0..1 = position du reflet sur « AI »
  style?: React.CSSProperties;
}> = ({
  width = 1100,
  ai = true,
  aiOpacity = 1,
  aiDx = 0,
  aiScale = 1,
  chroma = 0,
  glow = 1,
  id = "L",
  logoSrc = LOGO_WHITE,
  logoOpacity = 1,
  reserveAI,
  sweep = -1,
  style,
}) => {
  const gap = 64;
  const aiW = 250;
  const withAI = reserveAI ?? ai;
  const vbW = withAI ? 1261 + gap + aiW : 1261;
  const h = (width * 324) / vbW;
  const x = 1261 + gap;
  const fs = 214; // hauteur de capitale ≈ 154 (~1,13 × hauteur des minuscules)
  const aiCx = x + aiW / 2;
  const t = `translate(${aiDx} 0) translate(${aiCx} 232) scale(${aiScale}) translate(${-aiCx} -232)`;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${vbW} 324`} style={{ overflow: "visible", display: "block", ...style }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.aiGradient[0]} />
          <stop offset=".38" stopColor={colors.aiGradient[1]} />
          <stop offset=".72" stopColor={colors.aiGradient[2]} />
          <stop offset="1" stopColor={colors.aiGradient[3]} />
        </linearGradient>
        <filter id={`${id}glow`} x="-50%" y="-80%" width="200%" height="260%">
          <feGaussianBlur stdDeviation={18 * glow} result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation={55 * glow} result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${id}sw`} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset={Math.max(0, sweep - 0.12)} stopColor="#fff" stopOpacity="0" />
          <stop offset={Math.max(0, Math.min(1, sweep))} stopColor="#fff" stopOpacity="0.95" />
          <stop offset={Math.min(1, sweep + 0.12)} stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <image href={staticFile(logoSrc)} x="0" y="0" width="1261" height="324" opacity={logoOpacity} />
      {ai ? (
        <g opacity={aiOpacity} transform={t}>
          {chroma ? (
            <>
              <text x={x - chroma} y="232" fontFamily="Manrope" fontWeight={800} fontSize={fs} letterSpacing={-6} fill="#FF2E88" opacity=".8">
                AI
              </text>
              <text x={x + chroma} y="232" fontFamily="Manrope" fontWeight={800} fontSize={fs} letterSpacing={-6} fill="#19F0C0" opacity=".75">
                AI
              </text>
            </>
          ) : null}
          <text x={x} y="232" fontFamily="Manrope" fontWeight={800} fontSize={fs} letterSpacing={-6} fill={`url(#${id}g)`} filter={`url(#${id}glow)`}>
            AI
          </text>
          {sweep >= 0 && sweep <= 1.2 ? (
            <text x={x} y="232" fontFamily="Manrope" fontWeight={800} fontSize={fs} letterSpacing={-6} fill={`url(#${id}sw)`} style={{ mixBlendMode: "screen" }}>
              AI
            </text>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};

/** Les quatre pastilles seules (PNG officiel) */
export const Symbole: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile(SYMBOL)} style={{ width: size, height: size, display: "block", ...style }} />
);

/** « AI » seul, avec le même lettrage que logoAI() */
export const AIWord: React.FC<{ size: number; id?: string; glow?: number; style?: React.CSSProperties }> = ({
  size,
  id = "aiw",
  glow = 0.5,
  style,
}) => {
  const w = size * 1.3;
  return (
    <svg width={w} height={size * 1.1} viewBox="0 0 280 240" style={{ overflow: "visible", display: "block", ...style }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.aiGradient[0]} />
          <stop offset=".38" stopColor={colors.aiGradient[1]} />
          <stop offset=".72" stopColor={colors.aiGradient[2]} />
          <stop offset="1" stopColor={colors.aiGradient[3]} />
        </linearGradient>
        <filter id={`${id}glow`} x="-50%" y="-80%" width="200%" height="260%">
          <feGaussianBlur stdDeviation={18 * glow} result="b1" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text x="140" y="200" textAnchor="middle" fontFamily="Manrope" fontWeight={800} fontSize={214} letterSpacing={-6} fill={`url(#${id}g)`} filter={`url(#${id}glow)`}>
        AI
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------- Flamme (drawFlame de lib.js)
export function drawFlame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  color: string,
  { lean = 0, stretch = 1, alpha = 1 } = {},
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean);
  ctx.globalAlpha = alpha;
  const H = h * 1.25 * stretch,
    w = h * 0.24;
  ctx.globalCompositeOperation = "lighter";
  let g: CanvasGradient = ctx.createRadialGradient(0, -H * 0.3, 0, 0, -H * 0.3, H * 1.5);
  g.addColorStop(0, hexA(color, 0.5));
  g.addColorStop(0.3, hexA(color, 0.16));
  g.addColorStop(1, hexA(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, -H * 0.3, H * 1.5, 0, Math.PI * 2);
  ctx.fill();
  const shape = (s: number, tipBend: number) => {
    ctx.beginPath();
    ctx.moveTo(tipBend * s, -H * s);
    ctx.bezierCurveTo(w * 0.2 * s + tipBend * 0.6 * s, -H * 0.7 * s, w * 1.05 * s, -H * 0.38 * s, w * 0.95 * s, -H * 0.1 * s);
    ctx.bezierCurveTo(w * 0.9 * s, H * 0.06 * s, w * 0.5 * s, H * 0.14 * s, 0, H * 0.14 * s);
    ctx.bezierCurveTo(-w * 0.5 * s, H * 0.14 * s, -w * 0.9 * s, H * 0.06 * s, -w * 0.95 * s, -H * 0.1 * s);
    ctx.bezierCurveTo(-w * 1.05 * s, -H * 0.38 * s, -w * 0.2 * s + tipBend * 0.6 * s, -H * 0.7 * s, tipBend * s, -H * s);
    ctx.closePath();
  };
  const bend = w * 0.35;
  ctx.shadowColor = color;
  ctx.shadowBlur = h * 0.6;
  g = ctx.createLinearGradient(0, -H, 0, H * 0.14);
  g.addColorStop(0, hexA(color, 0));
  g.addColorStop(0.18, hexA(color, 0.55));
  g.addColorStop(0.55, color);
  g.addColorStop(0.85, hexA(color, 0.85));
  g.addColorStop(1, "rgba(60,90,255,.55)");
  ctx.fillStyle = g;
  shape(1, bend);
  ctx.fill();
  ctx.shadowBlur = h * 0.3;
  ctx.shadowColor = "rgba(255,255,255,.9)";
  g = ctx.createLinearGradient(0, -H * 0.62, 0, H * 0.1);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.35, "rgba(255,252,240,.95)");
  g.addColorStop(0.8, "rgba(255,248,225,.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.save();
  ctx.translate(0, -H * 0.04);
  shape(0.56, bend * 0.6);
  ctx.fill();
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
  ctx.shadowBlur = 0;
  g = ctx.createRadialGradient(0, H * 0.06, 0, 0, H * 0.06, w * 0.55);
  g.addColorStop(0, "rgba(40,60,160,.55)");
  g.addColorStop(1, "rgba(40,60,160,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, H * 0.06, w * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- Le « 10 » (TEN, tenPoints, strokeTen)
export const TEN = {
  one: [
    [740, 360],
    [820, 300],
    [820, 790],
  ] as [number, number][],
  zero: { cx: 1080, cy: 545, rx: 175, ry: 245 },
};

export function tenPoints(n = 400): [number, number][] {
  const pts: [number, number][] = [];
  const [a, b, c] = TEN.one;
  for (let i = 0; i < n * 0.12; i++) {
    const t = i / (n * 0.12);
    pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  for (let i = 0; i < n * 0.38; i++) {
    const t = i / (n * 0.38);
    pts.push([b[0], b[1] + (c[1] - b[1]) * t]);
  }
  const z = TEN.zero;
  for (let i = 0; i < n * 0.5; i++) {
    const t = (i / (n * 0.5)) * Math.PI * 2;
    pts.push([z.cx + Math.cos(t) * z.rx, z.cy + Math.sin(t) * z.ry]);
  }
  return pts;
}

export function strokeTen(
  ctx: CanvasRenderingContext2D,
  {
    width = 10,
    cols = [colors.orange, colors.pink, colors.green, colors.blue],
    glow = 30,
    alpha = 1,
    dx = 0,
  }: { width?: number; cols?: string[]; glow?: number; alpha?: number; dx?: number } = {},
) {
  const [a, b, c] = TEN.one;
  const z = TEN.zero;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = alpha;
  const draw = (col: string | CanvasGradient, w: number, blur: number) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.shadowColor = typeof col === "string" ? col : cols[1];
    ctx.shadowBlur = blur;
    ctx.beginPath();
    ctx.moveTo(a[0] + dx, a[1]);
    ctx.lineTo(b[0] + dx, b[1]);
    ctx.lineTo(c[0] + dx, c[1]);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(z.cx + dx, z.cy, z.rx, z.ry, 0, 0, Math.PI * 2);
    ctx.stroke();
  };
  const g1 = ctx.createLinearGradient(700, 300, 1260, 790);
  g1.addColorStop(0, cols[0]);
  g1.addColorStop(0.35, cols[1]);
  g1.addColorStop(0.65, cols[2]);
  g1.addColorStop(1, cols[3]);
  draw(g1, width * 2.2, glow * 2.2);
  ctx.globalAlpha = alpha * 0.55;
  draw(g1, width * 1.25, glow);
  ctx.globalAlpha = alpha;
  draw(g1, width, glow * 0.6);
  draw("rgba(255,255,255,.55)", width * 0.45, 8);
  draw("rgba(255,255,255,.95)", width * 0.16, 4);
  ctx.restore();
}

/** Étoile « ✦ » des badges Coopeo AI */
export const Spark: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "#8FE3FF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none", display: "inline-block" }}>
    <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" fill={color} />
  </svg>
);
