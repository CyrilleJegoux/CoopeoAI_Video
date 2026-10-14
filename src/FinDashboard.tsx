// Fin alternative : le logo glisse en haut à gauche et devient l'en-tête d'un tableau de bord clair
// (logo couleur), les blocs se posent pour enchaîner sur une vraie capture produit.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, finDashboard, signature } from "./config";
import { ease, lerp, prog, springAt } from "./lib/anim";
import { LOGO_COLOR, LogoAI } from "./lib/brand";
import { AiBg } from "./lib/ai";
import { Finish, Stage } from "./lib/Stage";

export const FinDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const D = finDashboard;
  const move = prog(frame, 24, 54, ease.inOut);
  const light = prog(frame, 26, 50, ease.inOut);
  const sigOut = 1 - prog(frame, 14, 26);
  // logo : centre (largeur 1080) → en-tête (largeur 300, en haut à gauche)
  const w = lerp(1080, 300, move);
  const h = (w * 324) / (1261 + 64 + 250);
  const x = lerp(960 - 540, 48, move);
  const y = lerp(330, 34, move);
  return (
    <Stage>
      <AiBg seed={99} />
      {/* fond clair qui s'ouvre en cercle depuis le haut à gauche */}
      <div className="fill" style={{ background: "#F4F6FB", clipPath: `circle(${light * 2400}px at 120px 60px)` }} />
      <AbsoluteFill>
        {/* barre latérale et en-tête */}
        <div style={{ position: "absolute", left: 0, top: 110, bottom: 0, width: 300, background: "#FFFFFF", borderRight: "1px solid #E3E8F2", opacity: prog(frame, 50, 62), transform: `translateX(${lerp(-300, 0, prog(frame, 50, 64, ease.out))}px)` }}>
          {D.menu.map((m, i) => (
            <div key={m} style={{ padding: "18px 48px", fontSize: 28, fontWeight: i === 0 ? 800 : 500, color: i === 0 ? "#0B1430" : "#5A6688", background: i === 0 ? "#EEF3FF" : undefined }}>
              {m}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 300, right: 0, top: 0, height: 110, borderBottom: "1px solid #E3E8F2", opacity: prog(frame, 50, 60) }} />
        <div style={{ position: "absolute", left: 360, top: 150, fontSize: 48, fontWeight: 800, color: "#0B1430", opacity: prog(frame, 56, 68, ease.out) }}>{D.titre}</div>
        {D.kpis.map((k, i) => {
          const s = springAt(frame, 62 + i * 5, { damping: 15, stiffness: 150 });
          return (
            <div
              key={k.titre}
              className="card"
              style={{
                left: 360 + i * 385,
                top: 240,
                width: 360,
                padding: "26px 30px",
                boxShadow: "0 18px 40px rgba(11,20,48,.12),0 0 0 1px #E3E8F2",
                opacity: Math.min(1, s * 2),
                transform: `translateY(${lerp(60, 0, s)}px)`,
              }}
            >
              <div className="k" style={{ fontSize: 26 }}>
                <span className="ic" style={{ background: k.couleur, width: 30, height: 30, borderRadius: 8 }} />
                {k.titre}
              </div>
              <div className="num" style={{ fontSize: 64, marginTop: 16 }}>
                {k.valeur}
              </div>
            </div>
          );
        })}
        {[0, 1].map((i) => {
          const s = springAt(frame, 84 + i * 6, { damping: 16, stiffness: 130 });
          return (
            <div
              key={i}
              className="card"
              style={{
                left: 360 + i * 785,
                top: 470,
                width: i ? 720 : 760,
                height: 520,
                boxShadow: "0 18px 40px rgba(11,20,48,.12),0 0 0 1px #E3E8F2",
                opacity: Math.min(1, s * 2),
                transform: `translateY(${lerp(80, 0, s)}px)`,
                background: "#fff",
              }}
            >
              <div style={{ height: 22, width: 260, borderRadius: 11, background: "#E3E8F2" }} />
              {[0, 1, 2, 3, 4].map((r) => (
                <div key={r} style={{ height: 16, width: `${90 - r * 12}%`, borderRadius: 8, background: "#EEF2F8", marginTop: 34 }} />
              ))}
            </div>
          );
        })}
      </AbsoluteFill>
      {/* logo : blanc sur fond nuit, puis couleur sur fond clair */}
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - light }}>
          <LogoAI width={w} glow={0.7} id="FD1" />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: light }}>
          <LogoAI width={w} glow={0.25} id="FD2" logoSrc={LOGO_COLOR} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center", fontWeight: 600, fontSize: 58, color: "#fff", opacity: sigOut }}>{signature}</div>
      <Finish grain={0.06} vignette={0.25} />
    </Stage>
  );
};
