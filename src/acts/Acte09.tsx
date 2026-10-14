// Acte IX · Signature (2:04 → 2:12) — réf. 10-signature (boom.js MODE 4)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { acte9, colors, f, ligneAnniversaire, mentionPrudence, signature, texteMentionPrudence } from "../config";
import { ease, lerp, prog, rng, springAt } from "../lib/anim";
import { LogoAI } from "../lib/brand";
import { Finish, FrameCanvas, Stage } from "../lib/Stage";

const COLS = [colors.pink, colors.orange, colors.green, colors.blue];
const DUR = f(8);

const drawCalm = (ctx: CanvasRenderingContext2D, frame: number) => {
  const g0 = ctx.createRadialGradient(960, 540, 0, 960, 540, 1150);
  g0.addColorStop(0, "#12307A");
  g0.addColorStop(0.35, "#0A1A4A");
  g0.addColorStop(0.75, "#050C26");
  g0.addColorStop(1, "#02050F");
  ctx.fillStyle = g0;
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.globalCompositeOperation = "lighter";
  const r = rng(35);
  ctx.fillStyle = "#9FD8FF";
  for (let i = 0; i < 300; i++) {
    ctx.globalAlpha = 0.35 * r() * (0.7 + 0.3 * Math.sin(frame * 0.05 + i));
    ctx.beginPath();
    ctx.arc(r() * 1920, r() * 1080, r() * 1.7, 0, 7);
    ctx.fill();
  }
  // arcs discrets aux 4 couleurs, qui glissent doucement
  const appear = prog(frame, 0, 30, ease.out);
  const d = (1 - appear) * 140 - frame * 0.15;
  const arc = (x: number, y: number, rad: number, c: string, a: number, w: number) => {
    ctx.save();
    ctx.filter = "blur(1.5px)";
    ctx.globalAlpha = a * appear;
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };
  arc(-260 - d, 1240 + d, 760, COLS[1], 0.22, 3);
  arc(-200 - d, 1300 + d, 880, COLS[0], 0.14, 2);
  arc(2200 + d, -260 - d, 780, COLS[3], 0.22, 3);
  arc(2140 + d, -320 - d, 900, COLS[2], 0.14, 2);
  const g = ctx.createRadialGradient(960, 470, 0, 960, 470, 760);
  g.addColorStop(0, "rgba(61,140,255,.30)");
  g.addColorStop(1, "rgba(61,140,255,0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.globalCompositeOperation = "source-over";
};

export const Acte09: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = springAt(frame, f(acte9.logoA), { damping: 20, stiffness: 80 });
  const line = ligneAnniversaire.toUpperCase();
  const nLetters = Math.floor(prog(frame, f(acte9.ligneA), f(acte9.ligneA) + 22) * line.length);
  const sig = prog(frame, f(acte9.signatureA), f(acte9.signatureA) + 16, ease.out);
  const pru = prog(frame, f(acte9.prudenceA), f(acte9.prudenceA) + 20, ease.out);
  // respiration : une seule, sur le dernier temps
  const b = prog(frame, f(acte9.respiration), f(acte9.respiration) + 15, ease.inOutSine);
  const breath = 1 + Math.sin(b * Math.PI) * 0.035;
  const exit = prog(frame, DUR - 8, DUR, ease.in);
  return (
    <Stage>
      <FrameCanvas draw={drawCalm} />
      <AbsoluteFill style={{ opacity: 1 - exit }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ transform: `scale(${lerp(0.94, 1, logo) * breath})`, opacity: Math.min(1, logo * 1.6), filter: logo < 0.6 ? `blur(${(0.6 - logo) * 10}px)` : undefined }}>
            <LogoAI width={1080} glow={0.7 * (1 + (breath - 1) * 8)} id="C9" />
          </div>
          <div style={{ fontFamily: "JBM", fontSize: 24, letterSpacing: ".32em", color: "#9DB0DA", marginTop: 56, height: 30, whiteSpace: "pre" }}>
            <span>{line.slice(0, nLetters)}</span>
            <span style={{ opacity: 0 }}>{line.slice(nLetters)}</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: 58, letterSpacing: "-.01em", marginTop: 22, opacity: sig, transform: `translateY(${(1 - sig) * 24}px)` }}>{signature}</div>
        </div>
        {mentionPrudence ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontSize: 24, color: "#7F90B8", opacity: pru * 0.9 }}>{texteMentionPrudence}</div>
        ) : null}
      </AbsoluteFill>
      <Finish />
    </Stage>
  );
};
