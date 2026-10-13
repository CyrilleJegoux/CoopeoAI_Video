import React from "react";
import { FrameCanvas } from "./Stage";
import { rng } from "./anim";

/** Fond bleu nuit (dégradé radial vers #13306F au centre) */
export const NightBg: React.FC<{ cx?: number; cy?: number; glow?: number; children?: React.ReactNode }> = ({
  cx = 50,
  cy = 45,
  glow = 1,
}) => (
  <div
    className="fill"
    style={{
      background: `radial-gradient(ellipse 1300px 900px at ${cx}% ${cy}%,rgba(19,48,111,${glow}) 0%,#0A1844 45%,#030714 100%),#030714`,
    }}
  />
);

/** Poussière d'étoiles qui dérive doucement (parallaxe) */
export const Stars: React.FC<{ count?: number; seed?: number; speed?: number; alpha?: number; zoom?: number }> = ({
  count = 260,
  seed = 21,
  speed = 0.15,
  alpha = 0.45,
  zoom = 0,
}) => (
  <FrameCanvas
    draw={(ctx, frame) => {
      const r = rng(seed);
      ctx.fillStyle = "#9FD8FF";
      for (let i = 0; i < count; i++) {
        const depth = 0.3 + r() * 0.7;
        let x = r() * 1920 - frame * speed * depth;
        let y = r() * 1080;
        x = ((x % 1920) + 1920) % 1920;
        if (zoom) {
          const k = 1 + zoom * depth;
          x = 960 + (x - 960) * k;
          y = 540 + (y - 540) * k;
        }
        const s = r() * 1.8 * (1 + zoom * depth * 0.5);
        ctx.globalAlpha = alpha * r() * (0.6 + 0.4 * Math.sin(frame * 0.07 + i));
        ctx.beginPath();
        ctx.arc(x, y, s, 0, 7);
        ctx.fill();
      }
    }}
  />
);
