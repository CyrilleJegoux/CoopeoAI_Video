// Acte VIII · Agir ensemble (1:50 → 1:56)
// La chaîne Donnée → Analyse → Alerte → Recommandation → Action se construit ; une alerte devient une tâche
// partagée avec l'équipe, assignée à Nico, statut « Résolution en cours ».
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { acte8, colors, equipeClient, f } from "../config";
import { ease, hexA, lerp, prog, springAt } from "../lib/anim";
import { AiBg } from "../lib/ai";
import { Finish, Stage } from "../lib/Stage";
import { IconAlert, IconCheck } from "../lib/ui";
import { Avatar } from "./Acte04";

const A = acte8;
const DUR = f(6);

export const Acte08: React.FC = () => {
  const frame = useCurrentFrame();
  const n = A.chaine.length;
  const pillW = [230, 230, 210, 340, 240];
  const gap = 70;
  const total = pillW.reduce((a, b) => a + b, 0) + gap * (n - 1);
  const xs: number[] = [];
  let x = 960 - total / 2;
  pillW.forEach((w) => {
    xs.push(x);
    x += w + gap;
  });
  const Y = 300;
  const task = springAt(frame, f(A.tacheA), { damping: 16, stiffness: 120 });
  const statusT = prog(frame, f(A.statutA), f(A.statutA) + 8, ease.out);
  const statusPop = springAt(frame, f(A.statutA), { damping: 10, stiffness: 220 });
  const cam = 1 + prog(frame, 0, DUR, ease.inOutSine) * 0.04;
  const exit = prog(frame, DUR - 8, DUR, ease.in);
  const T = A.tache;
  return (
    <Stage>
      <AiBg seed={95} />
      <AbsoluteFill style={{ transform: `scale(${cam})`, opacity: 1 - exit * 0.9 }}>
        {/* chaîne */}
        {A.chaine.map((c, i) => {
          const at = f(A.chaineA + i * A.pas);
          const s = springAt(frame, at, { damping: 12, stiffness: 190 });
          const last = i === n - 1;
          const link = prog(frame, at + 4, at + 12, ease.out);
          return (
            <React.Fragment key={c}>
              <div
                style={{
                  position: "absolute",
                  left: xs[i],
                  top: Y,
                  width: pillW[i],
                  height: 84,
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  fontWeight: 800,
                  color: last ? "#04203A" : "#EAF0FF",
                  background: last ? `linear-gradient(180deg,#7FD6FF,${colors.electric})` : "rgba(14,30,78,.86)",
                  border: last ? "none" : "1px solid rgba(143,227,255,.4)",
                  boxShadow: last ? `0 0 ${50 * Math.min(1, s)}px rgba(61,184,255,.75)` : "0 20px 50px rgba(0,0,0,.45)",
                  transform: `scale(${s * (last ? 1.08 : 1)})`,
                  opacity: Math.min(1, s * 2),
                }}
              >
                {c}
              </div>
              {i < n - 1 ? (
                <div
                  style={{
                    position: "absolute",
                    left: xs[i] + pillW[i] + 10,
                    top: Y + 40,
                    width: (gap - 20) * link,
                    height: 4,
                    borderRadius: 2,
                    background: colors.electric,
                    boxShadow: `0 0 12px ${colors.electric}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: -2,
                      top: -7,
                      width: 0,
                      height: 0,
                      borderLeft: "12px solid #3DB8FF",
                      borderTop: "9px solid transparent",
                      borderBottom: "9px solid transparent",
                      opacity: link >= 1 ? 1 : 0,
                    }}
                  />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
        {/* tâche partagée */}
        <div
          className="card"
          style={{
            left: 380,
            top: 510,
            width: 1160,
            padding: "38px 46px",
            opacity: Math.min(1, task * 2),
            // la tâche jaillit de la pastille « Action »
            transformOrigin: `${xs[n - 1] + pillW[n - 1] / 2 - 380}px ${Y + 42 - 510}px`,
            transform: `scale(${lerp(0.15, 1, task)})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <IconAlert size={40} color={colors.orange} />
            <span style={{ fontSize: 46, fontWeight: 800 }}>{T.titre}</span>
            <div style={{ marginLeft: "auto", position: "relative", width: 380, height: 56 }}>
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  whiteSpace: "nowrap",
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontSize: 28,
                  fontWeight: 700,
                  background: "#E9EDF4",
                  color: "#7A85A5",
                  opacity: 1 - statusT,
                }}
              >
                {T.statutAvant}
              </span>
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontSize: 28,
                  fontWeight: 800,
                  background: hexA(colors.green, 0.16),
                  border: `2px solid ${colors.green}`,
                  color: "#0A8F66",
                  opacity: statusT,
                  transform: `scale(${lerp(0.8, 1, statusPop)})`,
                  transformOrigin: "100% 50%",
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    background: colors.green,
                    boxShadow: `0 0 ${8 + 6 * Math.abs(Math.sin(frame * 0.2))}px ${colors.green}`,
                  }}
                />
                {T.statut}
              </span>
            </div>
          </div>
          <div style={{ fontSize: 30, color: "#4A5578", marginTop: 10, paddingLeft: 58 }}>{T.contexte}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 34, paddingTop: 26, borderTop: "1px solid #E1E6EF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: prog(frame, f(A.partageA), f(A.partageA) + 8) }}>
              <span style={{ fontSize: 28, color: "#4A5578" }}>{T.partage}</span>
              <span style={{ display: "flex" }}>
                {equipeClient.map((_, i) => {
                  const s = springAt(frame, f(A.partageA) + i * 2, { damping: 12, stiffness: 200 });
                  return <Avatar key={i} i={i} size={52} style={{ marginLeft: i ? -12 : 0, border: "3px solid #F6F8FF", transform: `scale(${s})` }} />;
                })}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: prog(frame, f(A.assigneA), f(A.assigneA) + 8) }}>
              <span style={{ fontSize: 28, color: "#4A5578" }}>{T.assigneA}</span>
              {(() => {
                const s = springAt(frame, f(A.assigneA), { damping: 10, stiffness: 220 });
                const ring = prog(frame, f(A.assigneA), f(A.assigneA) + 16);
                return (
                  <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar i={T.assigne} size={60} style={{ transform: `scale(${s})` }} />
                    {ring > 0 && ring < 1 ? (
                      <span style={{ position: "absolute", left: -10, top: -10, width: 80, height: 80, borderRadius: 40, border: `3px solid ${equipeClient[T.assigne].couleur}`, transform: `scale(${0.8 + ring * 0.8})`, opacity: 1 - ring }} />
                    ) : null}
                    <b style={{ fontSize: 32 }}>{equipeClient[T.assigne].nom}</b>
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
        {/* petite confirmation d'envoi */}
        <div
          style={{
            position: "absolute",
            left: 1512,
            top: 482,
            width: 56,
            height: 56,
            borderRadius: 28,
            background: colors.green,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 30px ${hexA(colors.green, 0.7)}`,
            transform: `scale(${springAt(frame, f(A.statutA) + 4, { damping: 9, stiffness: 240 })})`,
          }}
        >
          <IconCheck size={34} />
        </div>
      </AbsoluteFill>
      <Finish />
    </Stage>
  );
};
