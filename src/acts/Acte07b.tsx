// Acte VII · seconde partie : F16d boissons, F16e coût réel, F16f taxes en bas de facture,
// F16g taxes ventilées, F17 scénarios, F18 alertes, F19 ce qui le rend unique.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { acte7, colors } from "../config";
import { ease, hexA, lerp, prog, springAt } from "../lib/anim";
import { AIWord, Symbole } from "../lib/brand";
import { AiBg, Badge, Chip, dottedWire, strokeBezPartial } from "../lib/ai";
import { Finish, FrameCanvas, Stage } from "../lib/Stage";
import { IconAlert, Odometer } from "../lib/ui";

const Capt: React.FC<{ t: number; style: React.CSSProperties; children: React.ReactNode }> = ({ t, style, children }) => (
  <div className="capt" style={{ opacity: t, transform: `translateY(${(1 - t) * 20}px)`, ...style }}>
    {children}
  </div>
);

// ================================================================ F16d · Lire ce qui n'est pas écrit (14a)
const PDF_CSS = `
.pdf{position:absolute;background:#fff;color:#111;font-family:Arial,"Liberation Sans",Helvetica,sans-serif;box-shadow:0 40px 90px rgba(0,0,0,.55);transform-origin:left center}
.pdf table{border-collapse:collapse;width:100%}
.pdf .hdr td{border:1px solid #222;padding:0 6px;height:24px;text-align:center;font-size:13px}
.pdf .lines td{border-left:1px solid #222;border-right:1px solid #222;padding:2px 6px;vertical-align:top;line-height:19px;font-size:13.5px}
.pdf .lines tr.colh td{border:1px solid #222;font-size:12px;text-align:center;height:52px;padding:0 4px;line-height:1.1;vertical-align:middle}
.pdf .r{text-align:right;font-variant-numeric:tabular-nums}
.pdf .sp td{height:10px;padding:0;line-height:0}
`;
const B_TOP = 70,
  B_LEFT = 60,
  B_W = 1230;
const B_LINES_TOP = 22 + 166 + 52; // haut de la première ligne d'article (repère facture)
const rowLayout = () => {
  const rows = acte7.boissons.lignes;
  let y = B_LINES_TOP;
  return rows.map((l) => {
    const h = l[0].length * 19 + 4;
    const top = y + 10;
    y = top + h;
    return { top, h };
  });
};

export const F16dBoissons: React.FC = () => {
  const frame = useCurrentFrame();
  const B = acte7.boissons;
  const enter = springAt(frame, 0, { damping: 18, stiffness: 90 });
  const lay = rowLayout();
  const hits = B.lignes.map((l, i) => (l[7] ? i : -1)).filter((i) => i >= 0);
  const fTop = lay[hits[0]].top - 4,
    fBot = lay[hits[hits.length - 1]].top + lay[hits[hits.length - 1]].h + 4;
  const frameT = prog(frame, 22, 32, ease.out);
  const cap = prog(frame, 8, 22, ease.out);
  const midY = B_TOP + (fTop + fBot) / 2;
  const chipY = [300, 420, 540];
  return (
    <Stage>
      <style>{PDF_CSS}</style>
      <AiBg seed={63} />
      <div
        className="pdf"
        style={{
          left: B_LEFT,
          top: B_TOP,
          width: B_W,
          padding: "22px 24px 26px",
          transform: `perspective(2400px) translateX(${lerp(-200, 0, enter)}px) rotateY(${lerp(28, 4, enter)}deg)`,
          opacity: Math.min(1, enter * 2),
        }}
      >
        <div style={{ height: 166, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 24 }}>FACTURE</div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#444" }}>{B.fournisseur}</div>
            </div>
            <div style={{ textAlign: "right", fontWeight: 700, fontSize: 14, marginTop: 14 }}>
              COMMUNAUTE EUROPEENNE
              <div style={{ fontWeight: 400, fontSize: 12.5, color: "#444", marginTop: 4 }}>{B.client}</div>
            </div>
          </div>
          <table className="hdr" style={{ marginTop: 12 }}>
            <tbody>
              <tr>
                {B.entete.map((h) => (
                  <td key={h} style={{ fontWeight: 700 }}>
                    {h}
                  </td>
                ))}
              </tr>
              <tr>
                {B.enteteValeurs.map((h, i) => (
                  <td key={i} style={{ fontWeight: i === 0 ? 700 : 400 }}>
                    {h}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <div style={{ fontSize: 12.5, margin: "6px 0 0 4px" }}>
            <b>Paiement :</b>&nbsp;&nbsp; {B.paiement}
          </div>
        </div>
        <table className="lines" style={{ border: "1.5px solid #222" }}>
          <tbody>
            <tr className="colh">
              {B.colonnes.map((c, i) => (
                <td key={c} style={i === 0 ? { textAlign: "left", width: "34%" } : undefined}>
                  {c}
                </td>
              ))}
            </tr>
            {B.lignes.map((l, i) => {
              const n = l[0].length;
              const at = (v: string, k: number) => Array.from({ length: n }, (_, j) => (j === k ? v : " "));
              const lines = (arr: string[]) => arr.map((v, j) => <div key={j}>{v || " "}</div>);
              const hit = l[7] ? `rgba(61,184,255,${0.16 * frameT})` : undefined;
              return (
                <React.Fragment key={i}>
                  <tr className="sp">
                    {B.colonnes.map((c) => (
                      <td key={c} />
                    ))}
                  </tr>
                  <tr style={{ background: hit }}>
                    <td>{lines(l[0])}</td>
                    <td />
                    <td className="r">{l[1]}</td>
                    <td className="r">{lines(l[2])}</td>
                    <td className="r">{l[3] ? lines(at(l[3], 1)) : null}</td>
                    <td className="r">{l[4] ? lines(at(l[4], 1)) : null}</td>
                    <td className="r">{lines(at(l[5], n - 1))}</td>
                    <td className="r">{lines(at(l[6], n - 1))}</td>
                    <td />
                    <td />
                    <td className="r">{lines(at("3", n - 1))}</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {/* cadre lumineux autour des deux lignes whisky */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: fTop,
            width: B_W - 40,
            height: fBot - fTop,
            border: `4px solid ${colors.electric}`,
            boxShadow: `0 0 24px ${colors.electric},inset 0 0 18px rgba(61,184,255,.3)`,
            opacity: frameT,
            transform: `scale(${lerp(1.04, 1, frameT)})`,
          }}
        />
      </div>
      <FrameCanvas
        draw={(ctx) => {
          chipY.forEach((y, i) => {
            const t = prog(frame, 34 + i * 10, 44 + i * 10, ease.out);
            dottedWire(ctx, t, [1238, midY], [1290, midY], [1260, y + 48], [1328, y + 48], false);
          });
        }}
      />
      {B.pastilles.map(([k, m], i) => {
        const s = springAt(frame, 40 + i * 10, { damping: 14, stiffness: 160 });
        return <Chip key={k} column k={k} m={m} style={{ left: 1330, top: chipY[i], opacity: Math.min(1, s * 2), transform: `translateX(${lerp(60, 0, s)}px)` }} />;
      })}
      <Capt t={cap} style={{ left: 1330, top: 84, width: 560, fontSize: 52, lineHeight: 1.08 }}>
        {B.texte[0]}
        <br />
        {B.texte[1]}
      </Capt>
      <Finish />
    </Stage>
  );
};

// ================================================================ F16e · Le vrai prix, au centime près (14b)
const SEG_COL: Record<string, string> = { blue: colors.blue, orange: colors.orange, pink: colors.pink };

export const F16eCoutReel: React.FC = () => {
  const frame = useCurrentFrame();
  const C = acte7.coutReel;
  const card = springAt(frame, 0, { damping: 17, stiffness: 110 });
  const totalT = prog(frame, 52, 66, ease.out); // 26,49 € sur l'accent (≈1:29)
  const totalPop = springAt(frame, 60, { damping: 12, stiffness: 180 });
  const m1 = springAt(frame, 66, { damping: 15, stiffness: 140 });
  const m2 = springAt(frame, 78, { damping: 15, stiffness: 140 });
  const cap = prog(frame, 18, 32, ease.out);
  return (
    <Stage>
      <AiBg seed={64} />
      <div className="glass" style={{ left: 120, top: 110, width: 1020, opacity: Math.min(1, card * 2), transform: `translateY(${lerp(80, 0, card)}px)` }}>
        <Badge size={22}>{C.badge}</Badge>
        <div style={{ fontWeight: 800, fontSize: 44, letterSpacing: "-.02em", marginTop: 12 }}>{C.produit}</div>
        <div style={{ display: "flex", height: 38, borderRadius: 12, overflow: "hidden", margin: "26px 0 8px", background: "rgba(255,255,255,.05)" }}>
          {C.lignes.map((l, i) => {
            const t = prog(frame, 10 + i * 16, 26 + i * 16, ease.out);
            return <div key={i} style={{ width: `${l.part * t}%`, background: SEG_COL[l.couleur] }} />;
          })}
        </div>
        {C.lignes.map((l, i) => {
          const t = prog(frame, 8 + i * 16, 18 + i * 16, ease.out);
          return (
            <div
              key={l.label}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "baseline",
                padding: "16px 0",
                borderBottom: "1px solid rgba(143,227,255,.15)",
                fontSize: 27,
                opacity: t,
                transform: `translateX(${(1 - t) * -30}px)`,
              }}
            >
              <span>
                {l.label}
                {l.detail ? <small style={{ display: "block", fontSize: 18, color: "#8FA0C8", marginTop: 4 }}>{l.detail}</small> : null}
              </span>
              <span className="num" style={{ fontSize: 32, fontWeight: 600, color: l.texte }}>
                {l.valeur.replace(" €", "")}
                <span style={{ marginLeft: "0.14em" }}>€</span>
              </span>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 26 }}>
          <span style={{ fontSize: 27, color: "#C9D6F5" }}>{C.totalLabel}</span>
          <span
            className="num"
            style={{
              fontSize: 96,
              textShadow: "0 0 34px rgba(61,184,255,.6)",
              opacity: totalT,
              transform: `scale(${lerp(0.8, 1, totalPop)})`,
              transformOrigin: "100% 60%",
              display: "inline-flex",
              alignItems: "baseline",
            }}
          >
            <Odometer value={totalT * 2649} digits={4} decimals={2} />
            <span style={{ marginLeft: "0.14em" }}>€</span>
          </span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1220,
          top: 170,
          width: 580,
          borderRadius: 22,
          padding: "26px 32px",
          background: "rgba(14,30,78,.80)",
          border: "1px solid rgba(143,227,255,.3)",
          color: "#EAF0FF",
          boxShadow: "0 30px 70px rgba(0,0,0,.5)",
          opacity: Math.min(1, m1 * 2),
          transform: `translateX(${lerp(120, 0, m1)}px)`,
        }}
      >
        <div style={{ fontSize: 19, color: "#8FA0C8", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>{C.encart1.titre}</div>
        <div className="num" style={{ fontSize: 48, marginTop: 8, fontWeight: 600 }}>
          {C.encart1.valeur.replace(" €", "")}
          <span style={{ marginLeft: "0.14em" }}>€</span>
        </div>
        <div style={{ fontSize: 26, marginTop: 14, color: "#FF7BB0", fontWeight: 700 }}>{C.encart1.note}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1220,
          top: 420,
          width: 580,
          borderRadius: 22,
          padding: "26px 32px",
          background: "rgba(14,30,78,.80)",
          border: "1px solid rgba(143,227,255,.3)",
          color: "#EAF0FF",
          boxShadow: "0 30px 70px rgba(0,0,0,.5)",
          opacity: Math.min(1, m2 * 2),
          transform: `translateX(${lerp(120, 0, m2)}px)`,
        }}
      >
        <div style={{ fontSize: 19, color: "#8FA0C8", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>{C.encart2.titre}</div>
        <div style={{ fontSize: 24, color: "#C9D6F5", marginTop: 10 }}>
          {C.encart2.texte[0]}
          <br />
          {C.encart2.texte[1]}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 12 }}>
          <span className="num" style={{ fontSize: 52, color: "#7EF0C7", fontWeight: 600 }}>
            {C.encart2.valeur.replace(" €", "")}
            <span style={{ marginLeft: "0.14em" }}>€</span>
          </span>
          <span style={{ color: "#8FA0C8", fontSize: 22 }}>{C.encart2.legende}</span>
        </div>
      </div>
      <Capt t={cap} style={{ left: 1220, top: 760, width: 640, lineHeight: 1.08, fontSize: 56 }}>
        {C.texte[0]}
        <br />
        {C.texte[1]}
      </Capt>
      <Finish />
    </Stage>
  );
};

// ================================================================ F16f · Les taxes en bas de facture (16a)
const T_LEFT = 70,
  T_TOP = 120,
  T_W = 1180;
const T_PROD0 = 22 + 44 + 28 + 30; // haut du premier produit (repère facture)
const T_PROD_H = 42;
const T_TAX0 = T_PROD0 + 6 * T_PROD_H + 34;
const T_TAX_H = 26;
const PDF2_CSS = `
.pdf2 table{border-collapse:collapse;width:100%;table-layout:fixed}
.pdf2 td{padding:0 6px;vertical-align:top;white-space:nowrap;overflow:hidden;font-size:14px}
.pdf2 .h td{font-weight:700;border-bottom:1.5px solid #222;height:28px;vertical-align:middle}
.pdf2 .bl td{height:30px;font-weight:700;vertical-align:bottom;padding-bottom:4px}
.pdf2 .prod td{height:42px;line-height:20px;padding-top:1px}
.pdf2 .sub{color:#333;font-size:13px}
.pdf2 .tax td{height:26px;vertical-align:middle}
.pdf2 .r{text-align:right}
.pdf2 .box td{border:1px solid #222;padding:4px 8px;height:auto}
`;

export const F16fTaxesFacture: React.FC = () => {
  const frame = useCurrentFrame();
  const T = acte7.taxesFacture;
  const enter = springAt(frame, 0, { damping: 18, stiffness: 90 });
  const boxT = prog(frame, 18, 28, ease.out);
  const cap = prog(frame, 6, 20, ease.out);
  const sub = prog(frame, 74, 88, ease.out);
  const fam = T.produits.map((p) => p[7]);
  return (
    <Stage>
      <style>{PDF_CSS + PDF2_CSS}</style>
      <AiBg seed={81} />
      <div
        className="pdf pdf2"
        style={{
          left: T_LEFT,
          top: T_TOP,
          width: T_W,
          padding: "22px 26px",
          transform: `perspective(2400px) translateX(${lerp(-200, 0, enter)}px) rotateY(${lerp(28, 4, enter)}deg)`,
          opacity: Math.min(1, enter * 2),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", height: 44 }}>
          <div style={{ fontWeight: 700, fontSize: 20 }}>{T.fournisseur}</div>
          <div style={{ fontSize: 13, color: "#444", textAlign: "right" }}>
            {T.client[0]}
            <br />
            {T.client[1]}
          </div>
        </div>
        <table>
          <colgroup>
            <col style={{ width: 90 }} />
            <col style={{ width: 500 }} />
            <col style={{ width: 70 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 120 }} />
            <col />
          </colgroup>
          <tbody>
            <tr className="h">
              {T.colonnes.map((c, i) => (
                <td key={c} className={i >= 2 ? "r" : undefined}>
                  {c}
                </td>
              ))}
            </tr>
            <tr className="bl">
              <td colSpan={7}>{T.bon}</td>
            </tr>
            {T.produits.map((p) => (
              <tr key={p[0]} className="prod">
                <td>{p[0]}</td>
                <td>
                  {p[1]}
                  <div className="sub">{p[2]}</div>
                </td>
                <td className="r">{p[3]}</td>
                <td className="r">{p[4]}</td>
                <td className="r">{p[5]}</td>
                <td className="r">{p[5]}</td>
                <td className="r">{p[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontWeight: 700, height: 34, paddingTop: 10 }}>Taxe</div>
        <table className="tax">
          <colgroup>
            <col style={{ width: 70 }} />
            <col style={{ width: 380 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 200 }} />
            <col />
          </colgroup>
          <tbody>
            {T.taxes.map((x) => (
              <tr key={x[0]}>
                <td />
                <td>{x[0]}</td>
                <td className="r">{x[1]}</td>
                <td className="r">{x[2]}</td>
                <td className="r">{x[3]}</td>
                <td className="r">{x[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <table className="box" style={{ width: 420 }}>
            <tbody>
              {T.totaux.map(([k, v]) => (
                <tr key={k}>
                  <td style={{ fontWeight: 700 }}>{k}</td>
                  <td className="r">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* cadre autour du bloc taxe */}
        <div
          style={{
            position: "absolute",
            left: 18,
            top: T_TAX0 - 6,
            width: T_W - 36,
            height: 4 * T_TAX_H + 12,
            border: `4px solid ${colors.electric}`,
            boxShadow: `0 0 22px ${colors.electric}`,
            opacity: boxT,
            transform: `scale(${lerp(1.03, 1, boxT)})`,
          }}
        />
        {/* fils : chaque taxe vers ses lignes produit */}
        <svg width={T_W + 200} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {T.taxes.map((x, j) => {
            const sx = T_W - 22,
              sy = T_TAX0 + j * T_TAX_H + T_TAX_H / 2;
            const targets = fam.map((k, i) => ({ k, i })).filter(({ k }) => (x[6] === "r" ? k === "c" || k === "p" : k === x[6]));
            return targets.map(({ i }, k) => {
              const tx = T_W - 22,
                ty = T_PROD0 + i * T_PROD_H + 12;
              const t = prog(frame, 30 + j * 8 + k * 3, 50 + j * 8 + k * 3, ease.inOut);
              const d = `M ${sx} ${sy} C ${sx + 60 + k * 10} ${sy - 30}, ${tx + 70 + k * 8} ${ty + 30}, ${tx} ${ty}`;
              return (
                <g key={`${j}-${k}`} style={{ filter: `drop-shadow(0 0 6px ${x[5]})` }}>
                  <path d={d} fill="none" stroke={x[5]} strokeWidth={6} strokeOpacity={0.25} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - t} />
                  <path d={d} fill="none" stroke={x[5]} strokeWidth={2.4} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - t} />
                  {t >= 1 ? <circle cx={tx} cy={ty} r={5} fill={x[5]} /> : null}
                </g>
              );
            });
          })}
        </svg>
      </div>
      {T.pastilles.map(([k, m, c], i) => {
        const s = springAt(frame, 40 + i * 8, { damping: 14, stiffness: 160 });
        return (
          <Chip
            key={k}
            k={k}
            m={m}
            dot={c}
            style={{ left: 1330, top: 320 + i * 110, borderColor: c, opacity: Math.min(1, s * 2), transform: `translateX(${lerp(60, 0, s)}px)` }}
          />
        );
      })}
      <Capt t={cap} style={{ left: 1330, top: 70, width: 560, fontSize: 52, lineHeight: 1.08 }}>
        {T.texte[0]}
        <br />
        {T.texte[1]}
      </Capt>
      <div style={{ position: "absolute", left: 1330, top: 770, width: 540, fontSize: 28, color: "#C9D6F5", lineHeight: 1.35, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)` }}>
        <span style={{ display: "inline-block", verticalAlign: -3, marginRight: 8 }}>✦</span>
        {T.sousTexte}
      </div>
      <Finish />
    </Stage>
  );
};

// ================================================================ F16g · Chaque taxe, à sa place (16b)
export const F16gTaxesVentilees: React.FC = () => {
  const frame = useCurrentFrame();
  const V = acte7.taxesVentilees;
  const card = springAt(frame, 0, { damping: 17, stiffness: 110 });
  const cap = prog(frame, 22, 36, ease.out);
  return (
    <Stage>
      <AiBg seed={82} />
      <div className="glass" style={{ left: 120, top: 150, width: 1680, padding: "34px 44px", opacity: Math.min(1, card * 2), transform: `scale(${lerp(0.94, 1, card)})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Badge size={24}>{V.badge}</Badge>
          <div style={{ fontSize: 20, color: "#8FA0C8" }}>{V.source}</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 26 }}>
          <tbody>
            <tr>
              {V.colonnes.map((c, i) => (
                <td
                  key={c}
                  style={{
                    padding: "15px 14px",
                    fontSize: 15,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "#8FA0C8",
                    fontWeight: 700,
                    borderBottom: "1.5px solid rgba(143,227,255,.3)",
                    textAlign: [1, 2, 4, 5].includes(i) ? "right" : undefined,
                    fontFamily: [1, 2, 4, 5].includes(i) ? "JBM" : undefined,
                  }}
                >
                  {c}
                </td>
              ))}
            </tr>
            {V.lignes.map((r, i) => {
              const row = prog(frame, 6 + i * 4, 14 + i * 4, ease.out);
              const pill = springAt(frame, 30 + i * 6, { damping: 12, stiffness: 200 });
              const [c, l] = V.familles[r[3]];
              const none = r[3] === "v";
              const cell: React.CSSProperties = { padding: "15px 14px", borderBottom: "1px solid rgba(143,227,255,.13)", fontSize: 26, whiteSpace: "nowrap" };
              const num: React.CSSProperties = { ...cell, textAlign: "right", fontFamily: "JBM", fontSize: 24 };
              return (
                <tr key={r[0]} style={{ opacity: row, transform: `translateY(${(1 - row) * 14}px)` }}>
                  <td style={{ ...cell, fontWeight: 700 }}>{r[0]}</td>
                  <td style={{ ...num, color: "#C9D6F5" }}>{r[1]}</td>
                  <td style={{ ...num, color: "#C9D6F5" }}>{r[2]}€</td>
                  <td style={cell}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "5px 12px",
                        borderRadius: 9,
                        fontFamily: "JBM",
                        fontSize: 20,
                        background: none ? "rgba(255,255,255,.05)" : hexA(c, 0.15),
                        border: `1px solid ${c}`,
                        color: none ? "#8FA0C8" : "#fff",
                        transform: `scale(${pill})`,
                        opacity: Math.min(1, pill * 2),
                      }}
                    >
                      {none ? "—" : `+${r[4]}€/kg`}
                    </span>
                    <span style={{ fontSize: 19, color: "#8FA0C8", marginLeft: 12, opacity: Math.min(1, pill) }}>{l}</span>
                  </td>
                  <td style={{ ...num, color: "#fff", fontWeight: 700, opacity: Math.min(1, pill) }}>{r[5]}€</td>
                  <td style={{ ...num, color: "#BFF0FF", opacity: Math.min(1, pill) }}>{r[6]}€</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Capt t={cap} style={{ left: 0, right: 0, textAlign: "center", bottom: 64 }}>
        {V.texte}
      </Capt>
      <Finish />
    </Stage>
  );
};

// ================================================================ F17 · Prendre du recul, prévoir
export const F17Scenarios: React.FC = () => {
  const frame = useCurrentFrame();
  const S = acte7.scenarios;
  // dézoom rapide de la ligne de facture vers la vue d'ensemble
  const dz = prog(frame, 0, 16, ease.outExpo);
  const W = 960,
    H = 470,
    X0 = 150,
    Y0 = 210;
  const vmin = 68,
    vmax = 82;
  const yOf = (v: number) => Y0 + H - ((v - vmin) / (vmax - vmin)) * H;
  const nH = S.historique.length;
  const nF = 5;
  const xOf = (i: number) => X0 + (i / (nH - 1 + nF)) * W;
  const hist = prog(frame, 12, 34, ease.inOut);
  const fut = prog(frame, 34, 64, ease.inOut);
  const cap = prog(frame, 18, 32, ease.out);
  const alertT = springAt(frame, 70, { damping: 13, stiffness: 160 });
  const last = S.historique[nH - 1];
  const scenPath = (fin: number) => {
    const pts: [number, number][] = [];
    for (let k = 0; k <= nF; k++) {
      const t = k / nF;
      pts.push([xOf(nH - 1 + k), yOf(lerp(last, fin, t * t * (3 - 2 * t)))]);
    }
    return pts;
  };
  return (
    <Stage>
      <AiBg seed={90} />
      <AbsoluteFill style={{ transform: `scale(${lerp(3.2, 1, dz)})`, transformOrigin: "960px 470px", filter: dz < 0.9 ? `blur(${(1 - dz) * 6}px)` : undefined }}>
        <div className="glass" style={{ left: 200, top: 130, width: 1520, height: 760, padding: "34px 44px" }}>
          <Badge size={24}>{S.badge}</Badge>
          <div style={{ fontWeight: 800, fontSize: 46, marginTop: 10 }}>{S.titre}</div>
        </div>
        <FrameCanvas
          draw={(ctx) => {
            const ox = 200,
              oy = 130;
            ctx.save();
            ctx.translate(ox, oy);
            // grille
            ctx.strokeStyle = "rgba(143,227,255,.12)";
            ctx.lineWidth = 1;
            for (let v = 70; v <= 80; v += 5) {
              ctx.beginPath();
              ctx.moveTo(X0, yOf(v));
              ctx.lineTo(X0 + W, yOf(v));
              ctx.stroke();
            }
            ctx.fillStyle = "#8FA0C8";
            ctx.font = "400 22px JBM";
            for (let v = 70; v <= 80; v += 5) ctx.fillText(`${v} %`, X0 - 90, yOf(v) + 8);
            // seuil 75 % en pointillés
            const th = prog(frame, 8, 22);
            ctx.strokeStyle = hexA(colors.pink, 0.8);
            ctx.lineWidth = 2.5;
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(X0, yOf(S.seuil));
            ctx.lineTo(X0 + W * th, yOf(S.seuil));
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = hexA("#FF7BB0", th);
            ctx.font = "600 24px Manrope";
            ctx.fillText(S.seuilTexte, X0 + 8, yOf(S.seuil) + 34);
            // « aujourd'hui »
            const xn = xOf(nH - 1);
            ctx.strokeStyle = `rgba(191,240,255,${0.3 * hist})`;
            ctx.beginPath();
            ctx.moveTo(xn, Y0 - 10);
            ctx.lineTo(xn, Y0 + H);
            ctx.stroke();
            ctx.fillStyle = `rgba(191,240,255,${0.8 * hist})`;
            ctx.font = "600 22px Manrope";
            ctx.fillText("aujourd'hui", xn - 56, Y0 + H + 34);
            // historique
            ctx.strokeStyle = "#EAF0FF";
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowColor = "rgba(191,240,255,.6)";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            const hn = hist * (nH - 1);
            for (let i = 0; i <= Math.floor(hn); i++) {
              const p = [xOf(i), yOf(S.historique[i])];
              if (i === 0) ctx.moveTo(p[0], p[1]);
              else ctx.lineTo(p[0], p[1]);
            }
            if (hn < nH - 1) {
              const i = Math.floor(hn),
                fr = hn - i;
              ctx.lineTo(lerp(xOf(i), xOf(i + 1), fr), yOf(lerp(S.historique[i], S.historique[i + 1], fr)));
            }
            ctx.stroke();
            // trois scénarios
            S.scenarios.forEach((sc) => {
              const pts = scenPath(sc.fin);
              const n = fut * nF;
              ctx.strokeStyle = sc.couleur;
              ctx.shadowColor = sc.couleur;
              ctx.shadowBlur = 14;
              ctx.lineWidth = 5;
              ctx.beginPath();
              ctx.moveTo(pts[0][0], pts[0][1]);
              for (let k = 1; k <= Math.floor(n); k++) ctx.lineTo(pts[k][0], pts[k][1]);
              if (n < nF && n > 0) {
                const k = Math.floor(n),
                  fr = n - k;
                ctx.lineTo(lerp(pts[k][0], pts[k + 1][0], fr), lerp(pts[k][1], pts[k + 1][1], fr));
              }
              ctx.stroke();
            });
            ctx.shadowBlur = 0;
            ctx.restore();
          }}
        />
        {S.scenarios.map((sc, i) => {
          const t = prog(frame, 56 + i * 4, 66 + i * 4, ease.out);
          const pts = scenPath(sc.fin);
          const [x, y] = pts[pts.length - 1];
          return (
            <div
              key={sc.nom}
              style={{
                position: "absolute",
                left: 200 + x + 22,
                top: 130 + y - 22,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 28,
                fontWeight: 700,
                color: sc.couleur,
                opacity: t,
                whiteSpace: "nowrap",
              }}
            >
              <span>{sc.nom}</span>
              <span className="num" style={{ color: "#fff", fontSize: 30 }}>
                {String(sc.fin).replace(".", ",")} %
              </span>
            </div>
          );
        })}
        {/* alerte scénario C */}
        <div
          style={{
            position: "absolute",
            left: 1080,
            top: 760,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 22px",
            borderRadius: 16,
            background: hexA(colors.pink, 0.15),
            border: `1.5px solid ${colors.pink}`,
            color: "#FFD3E4",
            fontSize: 28,
            fontWeight: 700,
            transform: `scale(${alertT})`,
            opacity: Math.min(1, alertT * 2),
          }}
        >
          <IconAlert size={30} />
          {S.scenarios[2].alerte}
        </div>
      </AbsoluteFill>
      <Capt t={cap} style={{ left: 0, right: 0, textAlign: "center", bottom: 50, fontSize: 52 }}>
        {S.texte}
      </Capt>
      <Finish />
    </Stage>
  );
};

// ================================================================ F18 · Les alertes du jour
export const F18Alertes: React.FC = () => {
  const frame = useCurrentFrame();
  const A = acte7.alertes;
  const title = prog(frame, 0, 12, ease.out);
  const srcY = (i: number) => 250 + i * 180;
  return (
    <Stage>
      <AiBg seed={91} />
      <div style={{ position: "absolute", left: 100, top: 90, fontWeight: 800, fontSize: 60, letterSpacing: "-.02em", opacity: title, transform: `translateY(${(1 - title) * 20}px)` }}>
        {A.titre}
      </div>
      {/* cartes sources (acte III) */}
      {A.liste.map((a, i) => {
        const s = springAt(frame, i * 3, { damping: 16, stiffness: 140 });
        return (
          <div
            key={a.source}
            className="card"
            style={{
              left: 90,
              top: srcY(i),
              width: 420,
              padding: "24px 30px",
              borderRadius: 22,
              opacity: Math.min(1, s * 2) * 0.92,
              transform: `translateX(${lerp(-300, 0, s)}px)`,
            }}
          >
            <div className="k" style={{ fontSize: 32, whiteSpace: "nowrap" }}>
              <span className="ic" style={{ background: a.couleur, width: 40, height: 40 }} />
              {a.source}
            </div>
          </div>
        );
      })}
      <FrameCanvas
        draw={(ctx) => {
          A.liste.forEach((a, i) => {
            const at = 14 + i * 18;
            const t = prog(frame, at + 6, at + 16, ease.out);
            const y0 = srcY(i) + 46;
            ctx.save();
            ctx.strokeStyle = a.couleur;
            ctx.shadowColor = a.couleur;
            ctx.shadowBlur = 14;
            ctx.lineWidth = 3;
            strokeBezPartial(ctx, t, [500, y0], [600, y0], [680, y0], [770, y0]);
            ctx.restore();
          });
        }}
      />
      {A.liste.map((a, i) => {
        const at = 14 + i * 18;
        const s = springAt(frame, at, { damping: 12, stiffness: 170 });
        return (
          <div
            key={a.texte}
            className="glass"
            style={{
              left: 770,
              top: srcY(i) - 6,
              width: 1070,
              padding: "26px 34px",
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              gap: 22,
              border: `1.5px solid ${hexA(a.couleur, 0.7)}`,
              opacity: Math.min(1, s * 2),
              transform: `translateY(${lerp(-260, 0, s)}px)`,
            }}
          >
            <IconAlert size={44} color={a.couleur} />
            <span style={{ fontSize: 36, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>{a.texte}</span>
          </div>
        );
      })}
      <Finish />
    </Stage>
  );
};

// ================================================================ F19 · Ce qui le rend unique
export const F19Unique: React.FC = () => {
  const frame = useCurrentFrame();
  const U = acte7.unique;
  const flows = prog(frame, 8, 46, ease.inOut);
  const core = springAt(frame, 40, { damping: 11, stiffness: 160 });
  const badge = prog(frame, 56, 68, ease.out);
  const labels = [springAt(frame, 0, { damping: 16 }), springAt(frame, 6, { damping: 16 })];
  const CX = 960,
    CY = 470;
  const exit = prog(frame, 80, 90, ease.in);
  return (
    <Stage>
      <AiBg seed={92} />
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 + exit * 0.2})` }}>
        <FrameCanvas
          draw={(ctx) => {
            ctx.globalCompositeOperation = "lighter";
            const cols = [colors.orange, colors.pink, colors.green, colors.blue];
            // flux gauche (10 ans de données métier) : 4 couleurs ; flux droit (vos données) : bleu électrique
            for (let s = 0; s < 24; s++) {
              const c = cols[s % 4];
              const off = (s - 12) * 6;
              ctx.strokeStyle = c;
              ctx.globalAlpha = 0.22;
              ctx.lineWidth = 1.6;
              ctx.shadowColor = c;
              ctx.shadowBlur = 10;
              strokeBezPartial(ctx, flows, [420, 470 + off * 1.5], [620, 470 + off * 1.5], [780, CY + off * 0.4], [CX - 40, CY + off * 0.1]);
              ctx.strokeStyle = colors.electric;
              ctx.shadowColor = colors.electric;
              strokeBezPartial(ctx, flows, [1500, 470 + off * 1.5], [1300, 470 + off * 1.5], [1140, CY + off * 0.4], [CX + 40, CY + off * 0.1]);
            }
            if (core > 0.01) {
              const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, 260 * core);
              g.addColorStop(0, "rgba(120,210,255,.55)");
              g.addColorStop(0.4, "rgba(61,184,255,.18)");
              g.addColorStop(1, "rgba(61,184,255,0)");
              ctx.globalAlpha = 1;
              ctx.fillStyle = g;
              ctx.beginPath();
              ctx.arc(CX, CY, 260 * core, 0, 7);
              ctx.fill();
            }
          }}
        />
        {U.flux.map((t, i) => (
          <div
            key={t}
            className="glass"
            style={{
              left: i === 0 ? 70 : undefined,
              right: i === 1 ? 70 : undefined,
              top: 420,
              width: 360,
              padding: "24px 30px",
              textAlign: "center",
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.2,
              opacity: Math.min(1, labels[i] * 2),
              transform: `translateX(${lerp(i === 0 ? -200 : 200, 0, labels[i])}px)`,
            }}
          >
            {t}
          </div>
        ))}
        <div style={{ position: "absolute", left: CX - 110, top: CY - 150, width: 220, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${core})`, opacity: Math.min(1, core * 2) }}>
          <Symbole size={150} />
          <AIWord size={92} id="f19ai" glow={0.6} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 790,
            display: "flex",
            justifyContent: "center",
            opacity: badge,
            transform: `translateY(${(1 - badge) * 16}px)`,
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 26px", borderRadius: 999, background: "rgba(14,30,78,.86)", border: "1px solid rgba(143,227,255,.4)", fontSize: 30, color: "#BFF0FF", fontWeight: 600 }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: colors.green, boxShadow: `0 0 10px ${colors.green}` }} />
            {U.badge}
          </div>
        </div>
      </AbsoluteFill>
      <Finish />
    </Stage>
  );
};
