// Acte II · Coopeo évolue (0:12 → 0:18)
// Bleu nuit, arcs fins aux 4 couleurs, les pastilles arrivent chacune de leur direction,
// le wordmark se révèle par masque, caméra qui avance lentement.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { acte2, colors, f, logoDots } from "../config";
import { ease, hexA, lerp, prog, springAt } from "../lib/anim";
import { LogoAssemble } from "../lib/brand";
import { NightBg, Stars } from "../lib/Night";
import { Finish, FrameCanvas, Stage } from "../lib/Stage";

const DUR = f(6);
// direction d'arrivée de chaque pastille : rose du haut, orange de la gauche, vert de la droite, bleu du bas
const FROM: [number, number][] = [
  [0, -1100],
  [-1500, 0],
  [1500, 0],
  [0, 1000],
];

/** Grands arcs fins aux quatre couleurs qui traversent l'écran */
const Arcs: React.FC = () => (
  <FrameCanvas
    draw={(ctx, frame) => {
      ctx.globalCompositeOperation = "lighter";
      const arcs = [
        { c: colors.orange, cx: 960, cy: -820, R: 1500, a0: 0.18, sp: 0.0016, w: 2.2, d: 0 },
        { c: colors.blue, cx: 900, cy: 2050, R: 1400, a0: -2.2, sp: -0.0013, w: 2.2, d: 4 },
        { c: colors.pink, cx: 1980, cy: 120, R: 520, a0: 1.2, sp: 0.004, w: 1.8, d: 8 },
        { c: colors.green, cx: -150, cy: 900, R: 760, a0: -0.6, sp: -0.003, w: 1.8, d: 12 },
      ];
      for (const a of arcs) {
        const grow = prog(frame, a.d, a.d + 40, ease.outExpo);
        const span = 2.6 * grow;
        const start = a.a0 + frame * a.sp - span / 2;
        ctx.save();
        ctx.strokeStyle = a.c;
        ctx.lineWidth = a.w;
        ctx.shadowColor = a.c;
        ctx.shadowBlur = 14;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(a.cx, a.cy, a.R, start, start + span);
        ctx.stroke();
        // tête lumineuse
        const hx = a.cx + Math.cos(start + span) * a.R,
          hy = a.cy + Math.sin(start + span) * a.R;
        const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 40);
        g.addColorStop(0, hexA(a.c, 0.6 * (1 - grow * 0.6)));
        g.addColorStop(1, hexA(a.c, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(hx, hy, 40, 0, 7);
        ctx.fill();
        ctx.restore();
      }
    }}
  />
);

/** Onde légère quand le symbole se forme */
const Ring: React.FC<{ at: number; cx: number; cy: number }> = ({ at, cx, cy }) => (
  <FrameCanvas
    draw={(ctx, frame) => {
      const t = prog(frame, at, at + 24, ease.out);
      if (t <= 0 || t >= 1) return;
      ctx.globalCompositeOperation = "lighter";
      logoDots.forEach((c, i) => {
        ctx.strokeStyle = c;
        ctx.globalAlpha = (1 - t) * 0.6;
        ctx.lineWidth = 3 * (1 - t) + 0.5;
        ctx.shadowColor = c;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, 60 + t * (260 + i * 70), 0, Math.PI * 2);
        ctx.stroke();
      });
    }}
  />
);

export const Acte02: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 900; // largeur du logo
  const scaleLogo = W / 1261;
  const slide = prog(frame, f(acte2.wordmark.start) - 4, f(acte2.wordmark.end), ease.inOut);
  // le symbole se forme au centre, puis glisse à gauche pendant la révélation du wordmark
  const logoX = lerp(960 - 161.5 * (W / 1261), 960 - W / 2, slide);
  const logoY = 470 - (324 * scaleLogo) / 2;
  // centre du symbole à l'écran (pour l'onde)
  const symCx = logoX + 161.5 * scaleLogo,
    symCy = logoY + 161.5 * scaleLogo;

  const dots = acte2.pastilles.map((t, i) => {
    const s = springAt(frame, f(t), { damping: 19, stiffness: 120 });
    return { dx: FROM[i][0] * (1 - s), dy: FROM[i][1] * (1 - s), scale: lerp(0.6, 1, s), opacity: Math.min(1, s * 3) };
  });
  const wordReveal = prog(frame, f(acte2.wordmark.start), f(acte2.wordmark.end), ease.inOut);
  const edgeX = logoX + (380 + (1261 - 380) * wordReveal) * scaleLogo;
  const txt = prog(frame, f(acte2.texteA), f(acte2.texteA) + 14, ease.out);

  // caméra : avance lente, puis plongée vers l'avant pour entrer dans l'espace de l'acte III
  const exit = prog(frame, f(acte2.sortie), DUR, ease.inExpo);
  const cam = lerp(1, 1.07, prog(frame, 0, f(acte2.sortie), ease.inOutSine)) * lerp(1, 3.2, exit);

  return (
    <Stage>
      <NightBg />
      <Stars zoom={exit * 2} />
      <AbsoluteFill style={{ transform: `scale(${lerp(1, 1.05, frame / DUR)})` }}>
        <Arcs />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${cam})`,
          transformOrigin: `960px 520px`,
          opacity: 1 - prog(frame, DUR - 8, DUR),
          filter: exit > 0.05 ? `blur(${exit * 14}px)` : undefined,
        }}
      >
        {/* traînées des pastilles pendant leur arrivée */}
        {dots.map((d, i) =>
          Math.hypot(d.dx, d.dy) > 30 ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: logoX + ([161.5, 62.5, 260.5, 161.5][i] * scaleLogo) + d.dx * scaleLogo,
                top: logoY + ([62.5, 161.5, 161.5, 260.5][i] * scaleLogo) + d.dy * scaleLogo,
                width: Math.hypot(d.dx, d.dy) * scaleLogo * 0.6,
                height: 8,
                transformOrigin: "0 50%",
                transform: `translateY(-4px) rotate(${(Math.atan2(d.dy, d.dx) * 180) / Math.PI}deg)`,
                background: `linear-gradient(90deg,${hexA(logoDots[i], 0.7)},${hexA(logoDots[i], 0)})`,
                filter: "blur(4px)",
                borderRadius: 8,
              }}
            />
          ) : null,
        )}
        <div style={{ position: "absolute", left: logoX, top: logoY }}>
          <LogoAssemble width={W} dots={dots} wordReveal={wordReveal} id="A2" />
        </div>
        {/* liseré lumineux au bord du masque */}
        {wordReveal > 0 && wordReveal < 1 ? (
          <div
            style={{
              position: "absolute",
              left: edgeX - 2,
              top: logoY + 40,
              width: 4,
              height: 324 * scaleLogo - 40,
              background: "linear-gradient(180deg,transparent,#BFE6FF,transparent)",
              boxShadow: "0 0 24px 6px rgba(150,210,255,.6)",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 640,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 64,
            letterSpacing: "-.01em",
            color: "#EAF0FF",
            clipPath: `inset(0 0 ${(1 - txt) * 100}% 0)`,
            transform: `translateY(${(1 - txt) * 30}px)`,
          }}
        >
          {acte2.texte}
        </div>
      </AbsoluteFill>
      <Ring at={f(acte2.pastilles[3]) + 14} cx={symCx} cy={symCy} />
      <Finish />
    </Stage>
  );
};
