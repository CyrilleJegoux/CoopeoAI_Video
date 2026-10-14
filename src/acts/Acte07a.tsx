// Acte VII · première partie : F15 il rejoint l'équipe, F16 la loupe, F16b trois libellés, F16c même produit vrai prix.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { acte7, colors, equipeClient, f } from "../config";
import { ease, hexA, lerp, prog, springAt } from "../lib/anim";
import { AIWord } from "../lib/brand";
import { AiBg, Badge, Chip, dottedWire, strokeBezPartial } from "../lib/ai";
import { Finish, FrameCanvas, Stage } from "../lib/Stage";
import { euroMono } from "../lib/paper";
import { Odometer } from "../lib/ui";
import { Avatar } from "./Acte04";

const P = acte7.plans;
const dur = (p: { start: number; end: number }) => f(p.end - p.start);

// ================================================================ F15 · Il rejoint l'équipe
export const F15Equipe: React.FC = () => {
  const frame = useCurrentFrame();
  const E = acte7.equipe;
  const n = equipeClient.length;
  const size = 124,
    gap = 44;
  const total = (n + 1) * size + n * gap;
  const x0 = 960 - total / 2;
  const y = 400;
  const aiX = x0 + n * (size + gap) + size / 2;
  const slot = prog(frame, f(0.5), f(0.75), ease.out);
  const lit = springAt(frame, f(1.0), { damping: 10, stiffness: 180 });
  const ring = prog(frame, f(1.0), f(1.0) + 24, ease.out);
  const t1 = prog(frame, f(1.2), f(1.2) + 14, ease.out);
  const t2 = prog(frame, f(2.0), f(2.0) + 14, ease.out);
  // plongée vers « AI » pour entrer dans la facture
  const dive = prog(frame, f(3.45), dur(P.equipe), ease.inExpo);
  return (
    <Stage>
      <AiBg seed={71} />
      <AbsoluteFill
        style={{
          transform: `scale(${lerp(1, 7, dive)})`,
          transformOrigin: `${aiX}px ${y}px`,
          filter: dive > 0.05 ? `blur(${dive * 10}px)` : undefined,
          opacity: 1 - prog(frame, dur(P.equipe) - 5, dur(P.equipe)),
        }}
      >
        {equipeClient.map((m, i) => {
          const s = springAt(frame, i * 2, { damping: 16, stiffness: 120 });
          const cx = x0 + i * (size + gap) + size / 2;
          return (
            <React.Fragment key={m.nom}>
              <Avatar i={i} size={size} style={{ position: "absolute", left: cx - size / 2 + lerp(500, 0, s), top: y - size / 2, opacity: Math.min(1, s * 2) }} />
              <div style={{ position: "absolute", left: cx - 100 + lerp(500, 0, s), width: 200, top: y + size / 2 + 14, textAlign: "center", fontSize: 28, fontWeight: 600, color: "#BFD3FF", opacity: Math.min(1, s * 2) }}>
                {m.nom}
              </div>
            </React.Fragment>
          );
        })}
        {/* nouvelle place : s'allume en bleu électrique */}
        <div
          style={{
            position: "absolute",
            left: aiX - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            borderRadius: "50%",
            border: `3px dashed ${hexA(colors.electric, 0.7 * slot * (1 - Math.min(1, lit)))}`,
            opacity: slot,
          }}
        />
        {lit > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: aiX - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "radial-gradient(circle at 40% 35%,#1C3F9A,#0B1A4A)",
              border: `3px solid ${colors.electric}`,
              boxShadow: `0 0 ${50 * Math.min(1, lit)}px ${hexA(colors.electric, 0.8)},inset 0 0 20px rgba(61,184,255,.35)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${lit})`,
            }}
          >
            <AIWord size={58} id="f15ai" glow={0.4} />
          </div>
        ) : null}
        {ring > 0 && ring < 1 ? (
          <div
            style={{
              position: "absolute",
              left: aiX - size,
              top: y - size,
              width: size * 2,
              height: size * 2,
              borderRadius: "50%",
              border: `3px solid ${colors.electric}`,
              transform: `scale(${0.6 + ring * 1.2})`,
              opacity: 1 - ring,
            }}
          />
        ) : null}
        <div style={{ position: "absolute", left: aiX - 100, width: 200, top: y + size / 2 + 14, textAlign: "center", fontSize: 28, fontWeight: 700, color: colors.electricHot, opacity: Math.min(1, lit) }}>
          AI
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 610,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 76,
            letterSpacing: "-.02em",
            opacity: t1,
            transform: `translateY(${(1 - t1) * 30}px)`,
          }}
        >
          {E.titre[0]}
          <span style={{ background: "linear-gradient(180deg,#E6FAFF,#7FD6FF 40%,#3DB8FF 75%,#2A7BFF)", WebkitBackgroundClip: "text", color: "transparent" }}>{E.titre[1]}</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 44, color: "#BFD3FF", opacity: t2, transform: `translateY(${(1 - t2) * 20}px)` }}>
          {E.sousTitre}
        </div>
      </AbsoluteFill>
      <Finish />
    </Stage>
  );
};

// ================================================================ F16 · La loupe (12-loupe)
const LOUPE_CSS = `
.cinv{position:absolute;left:0;top:0;width:780px;background:#F6F8FC;color:#1a2238;border-radius:6px;padding:38px 42px 34px;font-family:Manrope}
.cinv .ih{display:flex;justify-content:space-between;height:110px;margin-bottom:18px}
.cinv .sn{font-weight:800;font-size:28px;color:#1F5C8C}
.cinv .ad{height:7px;background:#d3dae6;border-radius:4px;margin-top:9px}
.cinv .ft{text-align:right;font-size:15px;color:#5d6780;line-height:1.5}
.cinv .ft b{display:block;font-size:22px;letter-spacing:.14em;color:#1a2238}
.cinv table{width:100%;border-collapse:collapse;font-size:14.5px;table-layout:fixed}
.cinv td{height:34px;padding:0 6px;border-bottom:1px solid #e1e6ef;white-space:nowrap;overflow:hidden}
.cinv tr.th td{height:30px;font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6a7591;border-bottom:2px solid #9aa6c0}
.cinv td.n{font-family:JBM;font-size:13.5px;text-align:right}
.cinv td.no{font-family:JBM;font-size:12px;color:#8a94ab}
.cinv .tot{display:flex;flex-direction:column;align-items:flex-end;gap:4px;margin-top:16px;font-size:15px}
.cinv .tot div{display:flex;gap:30px}.cinv .tot b{font-family:JBM;min-width:120px;text-align:right}
`;
const ROW0 = 38 + 110 + 18 + 30; // haut de la première ligne (repère facture)
const ROW_H = 34;
const PU_X = 42 + 40 + 300 + 60 + 70 + 55; // centre de la colonne P.U.
const INV = { left: 250, top: 46, w: 780, h: 856, rot: -2.5 };

const CremerieInvoice: React.FC<{ hit: number; pinkPrice: boolean }> = ({ hit, pinkPrice }) => {
  const L = acte7.loupe;
  return (
    <div className="cinv">
      <div className="ih">
        <div style={{ width: "52%" }}>
          <div className="sn">{L.fournisseur}</div>
          <div className="ad" style={{ width: "80%" }} />
          <div className="ad" style={{ width: "55%" }} />
        </div>
        <div className="ft">
          <b>FACTURE</b>N° {L.numero}
          <br />
          {L.date}
          <br />
          Client : {L.client}
        </div>
      </div>
      <table>
        <colgroup>
          <col style={{ width: 40 }} />
          <col style={{ width: 300 }} />
          <col style={{ width: 60 }} />
          <col style={{ width: 70 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 116 }} />
        </colgroup>
        <tbody>
          <tr className="th">
            <td>N°</td>
            <td>Désignation</td>
            <td className="n">Qté</td>
            <td>Unité</td>
            <td className="n">P.U. HT</td>
            <td className="n">Montant HT</td>
          </tr>
          {L.lignes.map((l, i) => {
            const isHit = i === L.ligneErreur && hit > 0;
            const bgc = isHit ? `rgba(224,30,109,${0.12 * hit})` : undefined;
            return (
              <tr key={i}>
                <td className="no" style={{ background: bgc }}>
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td style={{ background: bgc }}>{l[0]}</td>
                <td className="n" style={{ background: bgc }}>
                  {l[1]}
                </td>
                <td style={{ background: bgc }}>{l[2]}</td>
                <td
                  className="n"
                  style={{ background: bgc, color: isHit && pinkPrice ? colors.pink : undefined, fontWeight: isHit && pinkPrice ? 700 : undefined }}
                  dangerouslySetInnerHTML={{ __html: euroMono(`${l[3]} €`) }}
                />
                <td className="n" style={{ background: bgc }} dangerouslySetInnerHTML={{ __html: euroMono(`${l[4]} €`) }} />
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="tot">
        {L.totaux.map(([k, v], i) => (
          <div key={k} style={i === 2 ? { fontWeight: 800, fontSize: 18 } : undefined}>
            <span>{k}</span>
            <b dangerouslySetInnerHTML={{ __html: euroMono(v) }} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** repère facture → écran (rotation autour du centre de la facture) */
const invToScreen = (x: number, y: number): [number, number] => {
  const cx = INV.w / 2,
    cy = INV.h / 2;
  const a = (INV.rot * Math.PI) / 180;
  const dx = x - cx,
    dy = y - cy;
  return [INV.left + cx + dx * Math.cos(a) - dy * Math.sin(a), INV.top + cy + dx * Math.sin(a) + dy * Math.cos(a)];
};

export const F16Loupe: React.FC = () => {
  const frame = useCurrentFrame();
  const L = acte7.loupe;
  const R = 200,
    Z = 2.3;
  const scanStart = 12,
    perRow = 6;
  const target = L.ligneErreur;
  const rowF = Math.min(target, Math.max(0, (frame - scanStart) / perRow));
  const arrive = scanStart + target * perRow; // ≈ 1:13
  const cy = ROW0 + rowF * ROW_H + ROW_H / 2;
  const cx = PU_X;
  const lensIn = springAt(frame, 4, { damping: 14, stiffness: 140 });
  const hit = prog(frame, arrive, arrive + 6);
  const settle = frame >= arrive ? 1 + 0.04 * Math.sin((frame - arrive) * 0.5) * Math.exp(-(frame - arrive) / 10) : 1;
  const card = springAt(frame, arrive + 8, { damping: 16, stiffness: 120 });
  const wire = prog(frame, arrive + 2, arrive + 14, ease.out);
  const cents = prog(frame, arrive + 14, arrive + 36, ease.out) * 1250;
  const cap = prog(frame, arrive + 12, arrive + 24, ease.out);
  const enter = prog(frame, 0, 18, ease.out);
  const [sx, sy] = invToScreen(cx + R + 6, cy);
  const C = L.carte;
  return (
    <Stage>
      <style>{LOUPE_CSS}</style>
      <AiBg seed={51} cx={36} cy={48} />
      <AbsoluteFill style={{ transform: `scale(${lerp(1.25, 1, enter)})`, transformOrigin: "640px 480px" }}>
        <div
          style={{
            position: "absolute",
            left: INV.left,
            top: INV.top,
            width: INV.w,
            height: INV.h,
            transform: `rotate(${INV.rot}deg)`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, boxShadow: "0 40px 100px rgba(0,0,0,.6),0 0 0 1px rgba(143,227,255,.2)", borderRadius: 6 }}>
            <CremerieInvoice hit={hit} pinkPrice={hit > 0.5} />
            {/* teinte froide sur la facture de base */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(180deg,rgba(10,30,90,.30),rgba(10,30,90,.42))" }} />
          </div>
          {/* lignes vérifiées : balayage + ✓ bleu */}
          {L.lignes.map((_, i) => {
            const done = prog(frame, scanStart + i * perRow + 3, scanStart + i * perRow + 7);
            if (i >= target || done <= 0) return null;
            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: "absolute",
                    left: 42,
                    width: 696,
                    top: ROW0 + i * ROW_H,
                    height: ROW_H,
                    background: `linear-gradient(90deg,rgba(61,184,255,0),rgba(61,184,255,${0.06 + i * 0.012}),rgba(61,184,255,0))`,
                    opacity: done,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: INV.w - 30,
                    top: ROW0 + i * ROW_H + 6,
                    fontSize: 18,
                    fontWeight: 800,
                    color: colors.electric,
                    textShadow: `0 0 8px ${colors.electric}`,
                    transform: `scale(${done})`,
                  }}
                >
                  ✓
                </div>
              </React.Fragment>
            );
          })}
          {/* faisceau au-dessus de la loupe */}
          <div
            style={{
              position: "absolute",
              left: cx - R * 0.8,
              top: ROW0,
              width: R * 1.6,
              height: Math.max(0, cy - ROW0),
              background: "linear-gradient(180deg,rgba(61,184,255,0),rgba(61,184,255,.32))",
              filter: "blur(20px)",
              opacity: lensIn,
            }}
          />
          {/* copie grossie, découpée par la loupe */}
          <div style={{ position: "absolute", inset: -400, clipPath: `circle(${R * lensIn * settle}px at ${cx + 400}px ${cy + 400}px)` }}>
            <div style={{ position: "absolute", left: 400, top: 400, width: INV.w, height: INV.h, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${Z})` }}>
              <CremerieInvoice hit={hit} pinkPrice={hit > 0.5} />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle ${R}px at ${cx + 400}px ${cy + 400}px,rgba(61,184,255,0) 70%,rgba(61,184,255,.28) 100%)`,
              }}
            />
          </div>
          {/* monture de la loupe */}
          <div
            style={{
              position: "absolute",
              left: cx - R,
              top: cy - R,
              width: 2 * R,
              height: 2 * R,
              borderRadius: "50%",
              border: `7px solid ${colors.electric}`,
              boxShadow: "0 0 0 2px rgba(191,240,255,.8) inset,0 0 40px 8px rgba(61,184,255,.65),0 0 120px 30px rgba(61,184,255,.25)",
              transform: `scale(${lensIn * settle})`,
            }}
          >
            <div style={{ position: "absolute", left: "18%", top: "9%", width: "34%", height: "14%", borderRadius: "50%", background: "linear-gradient(180deg,rgba(255,255,255,.45),rgba(255,255,255,0))", transform: "rotate(-24deg)", filter: "blur(2px)" }} />
          </div>
        </div>
        {/* fil loupe → carte */}
        <FrameCanvas draw={(ctx) => dottedWire(ctx, wire, [sx, sy], [sx + 120, sy], [1100, 420], [1190, 420])} />
      </AbsoluteFill>
      {/* carte Coopeo AI */}
      <div
        className="glass"
        style={{
          left: 1190,
          top: 250,
          width: 600,
          padding: "34px 38px",
          opacity: Math.min(1, card * 2),
          transform: `translateX(${lerp(160, 0, card)}px)`,
        }}
      >
        <Badge size={22}>{C.badge}</Badge>
        <div style={{ fontSize: 20, color: "#A9B4D6", marginTop: 16 }}>{C.contexte}</div>
        <div style={{ fontWeight: 800, fontSize: 34, margin: "6px 0 14px" }}>{C.produit}</div>
        {C.lignes.map(([k, v], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 24, padding: "12px 0", borderBottom: i < 2 ? "1px solid rgba(143,227,255,.15)" : "none" }}>
            <span style={{ color: "#A9B4D6" }}>{k}</span>
            <span style={{ fontFamily: "JBM", color: i === 0 ? "#FF7BB0" : undefined, fontWeight: i === 0 ? 600 : undefined }}>{v}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 18 }}>
          <span className="num" style={{ fontSize: 76, color: "#fff", textShadow: "0 0 30px rgba(61,184,255,.6)", display: "flex", alignItems: "baseline" }}>
            +<Odometer value={cents} digits={4} decimals={2} />
            <span style={{ marginLeft: "0.14em" }}>€</span>
          </span>
          <span style={{ color: "#A9B4D6", fontSize: 21 }}>{C.montantLegende}</span>
        </div>
        <div style={{ marginTop: 26, display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 24px", borderRadius: 14, background: colors.electric, color: "#04203A", fontWeight: 800, fontSize: 21 }}>{C.bouton}</div>
      </div>
      <div className="capt" style={{ left: 1190, top: 910, width: 640, opacity: cap, transform: `translateY(${(1 - cap) * 20}px)` }}>
        {L.texte}
      </div>
      <Finish />
    </Stage>
  );
};

// ================================================================ F16b · Trois libellés, un seul produit (13a-libelles)
const DOCS = [
  { x: 90, y: 90, r: -3 },
  { x: 690, y: 60, r: 1.5 },
  { x: 1290, y: 100, r: 3 },
];
const DOC_HD = 84,
  DOC_TH = 34,
  DOC_ROW = 42;
const STREAM_COLS = [colors.orange, colors.pink, colors.green];
const TARGET: [number, number] = [960, 760];

export const F16bLibelles: React.FC = () => {
  const frame = useCurrentFrame();
  const B = acte7.libelles;
  const conv = prog(frame, 44, 74, ease.inOut);
  const node = prog(frame, 64, 80, ease.out);
  const cap = prog(frame, 16, 30, ease.out);
  const geo = B.factures.map((d, i) => {
    const g = DOCS[i];
    const rowCy = g.y + DOC_HD + DOC_TH + DOC_ROW * d.ligne + DOC_ROW / 2;
    const cx = g.x + 270;
    const rowBottom = rowCy + DOC_ROW / 2;
    const chipY = rowBottom + 150;
    return { cx, rowBottom, chipY };
  });
  return (
    <Stage>
      <AiBg seed={61} />
      <FrameCanvas
        draw={(ctx) => {
          ctx.globalCompositeOperation = "lighter";
          geo.forEach((g, i) => {
            const link = prog(frame, 24 + i * 6, 34 + i * 6);
            dottedWire(ctx, link, [g.cx, g.rowBottom + 4], [g.cx, g.rowBottom + 50], [g.cx, g.chipY - 50], [g.cx, g.chipY], false);
            const sy = g.chipY + 64;
            for (let s = 0; s < 14; s++) {
              const off = (s - 7) * 3;
              const lg = ctx.createLinearGradient(g.cx, sy, TARGET[0], TARGET[1]);
              lg.addColorStop(0, STREAM_COLS[i]);
              lg.addColorStop(1, "rgba(61,184,255,.9)");
              ctx.strokeStyle = lg;
              ctx.globalAlpha = 0.14 + 0.05 * (s % 3);
              ctx.lineWidth = 1.4;
              ctx.shadowBlur = 10;
              ctx.shadowColor = STREAM_COLS[i];
              strokeBezPartial(ctx, conv, [g.cx + off, sy], [g.cx + off, sy + 120], [TARGET[0] + off * 2, TARGET[1] - 140], [TARGET[0] + off * 0.4, TARGET[1]]);
            }
            ctx.globalAlpha = 1;
          });
          if (node > 0) {
            const pulse = 1 + 0.08 * Math.sin(frame * 0.35);
            const g = ctx.createRadialGradient(TARGET[0], TARGET[1], 0, TARGET[0], TARGET[1], 120 * node * pulse);
            g.addColorStop(0, "rgba(255,255,255,1)");
            g.addColorStop(0.15, "rgba(160,230,255,.9)");
            g.addColorStop(1, "rgba(61,184,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(TARGET[0], TARGET[1], 120 * node * pulse, 0, 7);
            ctx.fill();
          }
        }}
      />
      {B.factures.map((d, i) => {
        const g = DOCS[i];
        const s = springAt(frame, i * 5, { damping: 16, stiffness: 110 });
        const hit = prog(frame, 18 + i * 6, 24 + i * 6);
        return (
          <div
            key={d.fournisseur}
            className="doc"
            style={{ left: g.x, top: g.y, width: 540, transform: `translateY(${lerp(-700, 0, s)}px) rotate(${g.r}deg)` }}
          >
            <div className="hd" style={{ height: DOC_HD }}>
              <div>
                <div className="sup">{d.fournisseur}</div>
                <div style={{ height: 6, width: 180, background: "#d3dae6", borderRadius: 3, marginTop: 9 }} />
              </div>
              <div className="meta">
                <b style={{ color: "#1a2238", letterSpacing: ".12em" }}>FACTURE</b>
                <br />N° {d.numero}
              </div>
            </div>
            <table>
              <tbody>
                <tr className="th">
                  <td style={{ height: DOC_TH }}>Désignation</td>
                  <td className="n">Qté</td>
                  <td>Unité</td>
                  <td className="n">P.U. HT</td>
                </tr>
                {d.lignes.map((l, k) => {
                  const isHit = k === d.ligne;
                  return (
                    <tr
                      key={k}
                      className={isHit ? "" : "dim"}
                      style={
                        isHit
                          ? { background: `rgba(61,184,255,${0.13 * hit})`, outline: `3px solid ${hexA(colors.electric, hit)}`, outlineOffset: -2 }
                          : undefined
                      }
                    >
                      <td style={{ height: DOC_ROW, color: isHit ? "#1a2238" : undefined }}>{l[0]}</td>
                      <td className="n">{l[1]}</td>
                      <td>{l[2]}</td>
                      <td className="n" dangerouslySetInnerHTML={{ __html: euroMono(`${l[3]} €`) }} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ height: 50 }} />
          </div>
        );
      })}
      {B.factures.map((d, i) => {
        const g = geo[i];
        const s = springAt(frame, 30 + i * 6, { damping: 13, stiffness: 160 });
        return (
          <Chip
            key={i}
            k={d.pastille[0]}
            m={d.pastille[1]}
            style={{ left: g.cx, top: g.chipY, transform: `translateX(-50%) scale(${s})`, opacity: Math.min(1, s * 2), fontSize: 24 }}
          />
        );
      })}
      <div className="capt" style={{ left: 0, right: 0, textAlign: "center", bottom: 70, opacity: cap, transform: `translateY(${(1 - cap) * 20}px)` }}>
        {B.texte}
      </div>
      <Finish />
    </Stage>
  );
};

// ================================================================ F16c · Même produit, vrai prix (13b-fusion)
const BAR_COLS: Record<string, [string, string, string]> = {
  green: ["#0CBF88", "#3FE0AE", "#7EF0C7"],
  neutre: ["#3B5A9E", "#5C7CC4", "#EAF0FF"],
  pink: ["#B0185A", "#E01E6D", "#FF7BB0"],
};

export const F16cFusion: React.FC = () => {
  const frame = useCurrentFrame();
  const F = acte7.fusion;
  const card = springAt(frame, 4, { damping: 17, stiffness: 110 });
  const streams = prog(frame, 0, 18, ease.out);
  const big = springAt(frame, 60, { damping: 11, stiffness: 180 }); // +13 % sur l'accent (≈1:21)
  const cap = prog(frame, 26, 40, ease.out);
  const maxP = 2.26;
  return (
    <Stage>
      <AiBg seed={62} />
      <FrameCanvas
        draw={(ctx) => {
          ctx.globalCompositeOperation = "lighter";
          (
            [
              [260, colors.orange],
              [960, colors.pink],
              [1660, colors.green],
            ] as [number, string][]
          ).forEach(([x, c]) => {
            for (let s = 0; s < 12; s++) {
              ctx.globalAlpha = 0.16;
              ctx.strokeStyle = c;
              ctx.shadowColor = c;
              ctx.shadowBlur = 10;
              ctx.lineWidth = 1.4;
              strokeBezPartial(ctx, streams, [x + (s - 6) * 4, -10], [x, 60], [960 + (s - 6) * 6, 40], [960 + (s - 6) * 3, 122]);
            }
          });
        }}
      />
      <div className="glass" style={{ left: 330, top: 120, width: 1260, opacity: Math.min(1, card * 2), transform: `translateY(${lerp(80, 0, card)}px)` }}>
        <Badge size={22}>{F.badge}</Badge>
        <div style={{ fontWeight: 800, fontSize: 46, letterSpacing: "-.02em", marginTop: 14 }}>{F.produit}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <span style={{ color: "#8FA0C8", fontSize: 19, alignSelf: "center", marginRight: 4 }}>{F.libellesReconnus}</span>
          {F.libelles.map((l, i) => {
            const s = springAt(frame, 12 + i * 4, { damping: 13, stiffness: 180 });
            return (
              <span
                key={l}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,.07)",
                  border: "1px solid rgba(143,227,255,.22)",
                  fontFamily: "JBM",
                  fontSize: 17,
                  color: "#C9D6F5",
                  transform: `scale(${s})`,
                  opacity: Math.min(1, s * 2),
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 34, fontSize: 19, color: "#8FA0C8", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>{F.titreBarres}</div>
        {F.barres.map((b, i) => {
          const t = prog(frame, 24 + i * 6, 46 + i * 6, ease.out);
          const [c0, c1, tc] = BAR_COLS[b.couleur];
          return (
            <div key={b.fournisseur} style={{ display: "grid", gridTemplateColumns: "260px 1fr 150px", alignItems: "center", gap: 22, marginTop: 22 }}>
              <span style={{ fontSize: 22, color: "#C9D6F5" }}>{b.fournisseur}</span>
              <div style={{ height: 42, borderRadius: 12, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 12, width: `${(b.prix / maxP) * 100 * t}%`, background: `linear-gradient(90deg,${c0},${c1})` }} />
              </div>
              <span className="num" style={{ fontSize: 30, textAlign: "right", color: tc, fontWeight: 600, opacity: t }}>
                {b.texte.replace(" €", "")}
                <span style={{ marginLeft: "0.14em" }}>€</span>
              </span>
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 36, paddingTop: 26, borderTop: "1px solid rgba(143,227,255,.18)" }}>
          <span className="num" style={{ fontSize: 72, color: "#fff", textShadow: "0 0 30px rgba(61,184,255,.6)", transform: `scale(${big})`, transformOrigin: "0 60%", display: "inline-block", minWidth: 210 }}>
            {F.ecart}
          </span>
          <span style={{ fontSize: 26, color: "#C9D6F5", lineHeight: 1.35, opacity: prog(frame, 64, 74) }}>
            {F.ecartTexte[0]}
            <br />
            {F.ecartTexte[1]}
          </span>
        </div>
      </div>
      <div className="capt" style={{ left: 0, right: 0, textAlign: "center", bottom: 64, opacity: cap, transform: `translateY(${(1 - cap) * 20}px)` }}>
        {F.texte}
      </div>
      <Finish />
    </Stage>
  );
};

