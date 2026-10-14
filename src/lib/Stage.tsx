import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { AI_CSS, BASE_CSS, CARD_CSS, PAPER_CSS } from "./styles";

const ALL_CSS = BASE_CSS + AI_CSS + PAPER_CSS + CARD_CSS;

/** Scène 1920×1080 avec les feuilles de style communes */
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill className="stage" style={{ background: "#000", ...style }}>
    <style>{ALL_CSS}</style>
    {children}
  </AbsoluteFill>
);

/**
 * Grain léger (équivalent de grain() dans lib.js : bruit gris en mode « overlay »).
 * Les textures sont pré-calculées (public/grain) pour un rendu rapide ; elles changent toutes les 2 images.
 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.1 }) => {
  const frame = useCurrentFrame();
  const k = Math.floor(frame / 2) % 6;
  return <Img className="grain" src={staticFile(`grain/grain_${k}.jpg`)} style={{ opacity, width: 1920, height: 1080 }} />;
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <div
    className="vignette"
    style={{
      background: `radial-gradient(ellipse 75% 70% at 50% 50%,transparent 55%,rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Grain + vignettage, à poser en dernier dans chaque plan */
export const Finish: React.FC<{ grain?: number; vignette?: number }> = ({ grain = 0.1, vignette = 0.55 }) => (
  <>
    <Vignette strength={vignette} />
    <Grain opacity={grain} />
  </>
);

/** Insère du HTML produit par les fonctions portées de sources-images */
export const Html: React.FC<{ html: string; style?: React.CSSProperties; className?: string }> = ({
  html,
  style,
  className,
}) => <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;

/** Canvas 1920×1080 redessiné à chaque image */
export const FrameCanvas: React.FC<{
  draw: (ctx: CanvasRenderingContext2D, frame: number) => void;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}> = ({ draw, style, width = 1920, height = 1080 }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.filter = "none";
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    ctx.save();
    draw(ctx, frame);
    ctx.restore();
  });
  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", left: 0, top: 0, ...style }} />;
};

/** Légende en bas d'écran (classe .caption des sources) */
export const Caption: React.FC<{
  children: React.ReactNode;
  opacity?: number;
  y?: number;
  style?: React.CSSProperties;
}> = ({ children, opacity = 1, y = 0, style }) => (
  <div className="caption" style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
    {children}
  </div>
);
