// Acte IV · L'équipe à bord (0:40 → 0:52)
// F10 : une alerte devient une action dans le fil d'équipe Coopeo (aucune marque de messagerie).
// F11 : les avatars s'allument un par un, chacun déclenche une micro-action, la jauge globale monte.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { acte4, colors, equipeClient, f } from "../config";
import { ease, hexA, lerp, prog, rng, springAt } from "../lib/anim";
import { NightBg, Stars } from "../lib/Night";
import { Caption, Finish, FrameCanvas, Stage } from "../lib/Stage";
import { IconAlert, IconCheck, Odometer } from "../lib/ui";

const F = acte4.fil;
const E = acte4.equipe;

export const Avatar: React.FC<{
  i: number;
  size: number;
  lit?: number; // 0 → 1
  style?: React.CSSProperties;
  ring?: string;
}> = ({ i, size, lit = 1, style, ring }) => {
  const m = equipeClient[i];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: lit > 0 ? m.couleur : "#2A3768",
        filter: lit < 1 ? `saturate(${lit}) brightness(${0.55 + 0.45 * lit})` : undefined,
        color: "#fff",
        fontWeight: 800,
        fontSize: size * 0.44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
        boxShadow: lit > 0.05 ? `0 0 ${30 * lit}px ${hexA(m.couleur, 0.6 * lit)}${ring ? `,0 0 0 4px ${ring}` : ""}` : ring ? `0 0 0 4px ${ring}` : undefined,
        ...style,
      }}
    >
      {m.initiale}
    </div>
  );
};

/** Bulles grises génériques qui se perdent en arrière-plan (l'info qui se perdait) */
const LostBubbles: React.FC = () => (
  <FrameCanvas
    draw={(ctx, frame) => {
      const r = rng(41);
      for (let i = 0; i < 16; i++) {
        const x0 = r() * 1920,
          y0 = r() * 1080,
          w = 160 + r() * 220,
          sp = 0.4 + r() * 0.8;
        const x = x0 + frame * sp * (r() > 0.5 ? 1 : -1);
        const y = y0 - frame * sp * 0.6;
        ctx.globalAlpha = 0.07 + r() * 0.06;
        ctx.fillStyle = "#AFC3FF";
        ctx.beginPath();
        ctx.roundRect(x, y, w, 46, 23);
        ctx.fill();
      }
    }}
    style={{ filter: "blur(5px)" }}
  />
);

// ---------------------------------------------------------------- F10 · Une alerte devient une action
const F10Fil: React.FC = () => {
  const frame = useCurrentFrame();
  const panel = springAt(frame, 0, { damping: 18, stiffness: 100 });
  // la caméra suit le fil vers le bas
  const camY = lerp(60, -70, prog(frame, f(1.2), f(3.6), ease.inOut));
  const cap = prog(frame, f(F.texteA), f(F.texteA) + 14, ease.out);
  const ind = springAt(frame, f(F.indicateur.at), { damping: 14, stiffness: 140 });
  const pct = prog(frame, f(F.indicateur.at) + 4, f(F.indicateur.at) + 30, ease.out) * F.indicateur.valeur;
  const exit = prog(frame, f(5.6), f(6), ease.in);
  return (
    <Stage>
      <NightBg cx={45} />
      <Stars />
      <LostBubbles />
      <AbsoluteFill
        style={{
          transform: `translateY(${camY}px) scale(${lerp(1, 0.9, exit)})`,
          opacity: 1 - exit,
          filter: exit > 0.02 ? `blur(${exit * 8}px)` : undefined,
        }}
      >
        {/* panneau « Fil de l'équipe » */}
        <div
          className="card"
          style={{
            left: 330,
            top: 150,
            width: 1060,
            height: 650,
            padding: 0,
            overflow: "hidden",
            transform: `perspective(1800px) rotateX(${lerp(25, 0, panel)}deg) translateY(${lerp(200, 0, panel)}px)`,
            opacity: Math.min(1, panel * 2),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "26px 40px", borderBottom: "1px solid #E1E6EF", background: "#EEF2FA" }}>
            <span style={{ width: 16, height: 16, borderRadius: 8, background: colors.blue }} />
            <span style={{ fontSize: 34, fontWeight: 800, color: "#0B1430" }}>{F.titre}</span>
            <span style={{ fontSize: 30, color: "#7A85A5" }}>· {F.sousTitre}</span>
            <span style={{ marginLeft: "auto", display: "flex" }}>
              {equipeClient.map((_, i) => (
                <Avatar key={i} i={i} size={40} style={{ marginLeft: -8, border: "3px solid #EEF2FA" }} />
              ))}
            </span>
          </div>
          {F.messages.map((m, k) => {
            const s = springAt(frame, f(m.at), { damping: 15, stiffness: 150 });
            const who = equipeClient[m.qui];
            const right = k === 1;
            const check = prog(frame, f(m.at) + 20, f(m.at) + 32, ease.out);
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  top: 140 + k * 170,
                  left: right ? undefined : 40,
                  right: right ? 40 : undefined,
                  display: "flex",
                  flexDirection: right ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: 20,
                  opacity: Math.min(1, s * 2),
                  transform: `translateX(${lerp(right ? 300 : -300, 0, s)}px)`,
                }}
              >
                <Avatar i={m.qui} size={74} />
                <div
                  style={{
                    background: right ? "#E8F8F1" : "#fff",
                    border: `2px solid ${m.alerte ? hexA(colors.pink, 0.5) : hexA(colors.green, 0.45)}`,
                    borderRadius: 24,
                    padding: "18px 28px",
                    boxShadow: "0 12px 30px rgba(11,20,48,.12)",
                    minWidth: 520,
                  }}
                >
                  <div style={{ fontSize: 26, color: "#7A85A5", display: "flex", gap: 12 }}>
                    <b style={{ color: "#26304f" }}>{who.nom}</b> {who.role ? `· ${who.role}` : ""}
                    <span style={{ marginLeft: "auto", fontFamily: "JBM", fontSize: 22 }}>{m.heure}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, fontSize: 42, fontWeight: 700, color: m.alerte ? colors.pink : "#0B1430" }}>
                    {m.alerte ? <IconAlert size={40} /> : null}
                    {m.texte}
                    {m.fait ? (
                      <span
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 23,
                          background: colors.green,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transform: `scale(${check})`,
                          marginLeft: 6,
                        }}
                      >
                        <IconCheck size={30} />
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
          {/* indicateur « Pertes du jour −12 % » */}
          <div
            style={{
              position: "absolute",
              left: 40,
              bottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "22px 34px",
              borderRadius: 22,
              background: "#0E1E4E",
              color: "#fff",
              transform: `scale(${ind})`,
              transformOrigin: "0 100%",
              boxShadow: "0 20px 40px rgba(11,20,48,.35)",
            }}
          >
            <span style={{ fontSize: 34, color: "#BFD3FF" }}>{F.indicateur.label}</span>
            <span className="num" style={{ fontSize: 84, color: "#4BE0B0", display: "flex", alignItems: "baseline" }}>
              −<Odometer value={pct} digits={2} />
              <span style={{ marginLeft: "0.14em" }}>%</span>
            </span>
            <svg width={44} height={44} viewBox="0 0 24 24">
              <path d="M4 7l7 7 4-4 6 7" stroke="#4BE0B0" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
      <div className="abs" style={{ left: 0, right: 0, bottom: 0, height: 260, background: "linear-gradient(transparent,rgba(3,7,20,.85))", zIndex: 39 }} />
      <Caption opacity={cap * (1 - exit)} y={(1 - cap) * 24} style={{ color: "#EAF0FF", bottom: 70 }}>
        {F.texte}
      </Caption>
      <Finish />
    </Stage>
  );
};

// ---------------------------------------------------------------- F11 · Toute l'équipe à bord
const F11Equipe: React.FC = () => {
  const frame = useCurrentFrame();
  const n = equipeClient.length;
  const size = 132,
    gap = 150;
  const rowW = n * size + (n - 1) * gap;
  const x0 = 960 - rowW / 2;
  const cam = lerp(1.12, 1, prog(frame, 0, f(6), ease.out));
  const cap = prog(frame, f(E.texteA), f(E.texteA) + 14, ease.out);
  const litAt = (i: number) => f(0.3 + i * E.pas);
  const gauge = prog(frame, litAt(0), litAt(n - 1) + 24, ease.inOut) * E.jauge.valeur;
  return (
    <Stage>
      <NightBg cy={42} />
      <Stars />
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        {/* fils entre avatars */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {equipeClient.slice(0, -1).map((_, i) => {
            const t = prog(frame, litAt(i + 1) - 6, litAt(i + 1) + 4);
            const xa = x0 + i * (size + gap) + size,
              xb = x0 + (i + 1) * (size + gap);
            return <line key={i} x1={xa} x2={lerp(xa, xb, t)} y1={330} y2={330} stroke={hexA("#8FE3FF", 0.45)} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" />;
          })}
        </svg>
        {equipeClient.map((m, i) => {
          const lit = prog(frame, litAt(i), litAt(i) + 6, ease.out);
          const pop = springAt(frame, litAt(i), { damping: 9, stiffness: 200 });
          const chip = springAt(frame, litAt(i) + 4, { damping: 14, stiffness: 160 });
          const ringT = prog(frame, litAt(i), litAt(i) + 20, ease.out);
          const cx = x0 + i * (size + gap) + size / 2;
          return (
            <React.Fragment key={m.nom}>
              {ringT > 0 && ringT < 1 ? (
                <div
                  style={{
                    position: "absolute",
                    left: cx - size,
                    top: 330 - size,
                    width: size * 2,
                    height: size * 2,
                    borderRadius: "50%",
                    border: `3px solid ${m.couleur}`,
                    transform: `scale(${0.5 + ringT * 0.9})`,
                    opacity: 1 - ringT,
                  }}
                />
              ) : null}
              <Avatar i={i} size={size} lit={lit} style={{ position: "absolute", left: cx - size / 2, top: 330 - size / 2, transform: `scale(${lerp(0.86, 1, pop)})` }} />
              <div style={{ position: "absolute", left: cx - 120, width: 240, top: 420, textAlign: "center", fontSize: 36, fontWeight: 700, color: lit > 0.5 ? "#fff" : "#6F7DA8" }}>
                {m.nom}
              </div>
              {/* micro-action */}
              <div
                style={{
                  position: "absolute",
                  left: cx - 220,
                  width: 440,
                  top: i % 2 === 0 ? 492 : 160,
                  display: "flex",
                  justifyContent: "center",
                  opacity: Math.min(1, chip * 2),
                  transform: `translateY(${lerp(i % 2 === 0 ? 30 : -30, 0, chip)}px)`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 22px",
                    borderRadius: 18,
                    background: "rgba(246,248,255,.97)",
                    color: "#0B1430",
                    fontSize: 32,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    boxShadow: `0 14px 30px rgba(0,0,0,.4),0 0 0 2px ${hexA(m.couleur, 0.6)}`,
                  }}
                >
                  <span style={{ width: 36, height: 36, borderRadius: 18, background: m.couleur, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconCheck size={24} />
                  </span>
                  {E.actions[i]}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        {/* jauge globale */}
        <div style={{ position: "absolute", left: 360, width: 1200, top: 650 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 36, color: "#BFD3FF", fontWeight: 600 }}>
            <span>{E.jauge.label}</span>
            <span className="num" style={{ fontSize: 80, color: "#fff" }}>
              {Math.round(gauge)} %
            </span>
          </div>
          <div style={{ height: 22, borderRadius: 12, background: "rgba(255,255,255,.1)", marginTop: 14, overflow: "hidden" }}>
            <div
              style={{
                width: `${gauge}%`,
                height: "100%",
                borderRadius: 12,
                background: `linear-gradient(90deg,${colors.pink},${colors.orange},${colors.green},${colors.blue})`,
                boxShadow: "0 0 24px rgba(18,155,224,.6)",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
      <Caption opacity={cap} y={(1 - cap) * 24} style={{ color: "#EAF0FF", bottom: 90 }}>
        {E.texte}
      </Caption>
      <Finish />
    </Stage>
  );
};

export const Acte04: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={f(E.start)} name="F10 Une alerte devient une action">
      <F10Fil />
    </Sequence>
    <Sequence from={f(E.start)} durationInFrames={f(12 - E.start)} name="F11 Toute l'équipe à bord">
      <F11Equipe />
    </Sequence>
  </AbsoluteFill>
);
