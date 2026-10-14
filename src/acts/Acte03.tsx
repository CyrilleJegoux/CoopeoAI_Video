// Acte III · Le déferlement (0:18 → 0:40)
// Un seul espace continu : la caméra voyage, chaque carte arrive d'une direction différente,
// les cartes précédentes reculent, floues, en profondeur. Style des cartes : 03-envol.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { acte3, colors, f } from "../config";
import { clamp, ease, hexA, lerp, prog, rng, springAt } from "../lib/anim";
import { NightBg, Stars } from "../lib/Night";
import { Finish, FrameCanvas, Stage } from "../lib/Stage";
import { CardHead, IconAlert, IconBars, IconCheck, Odometer } from "../lib/ui";
import { euroMono } from "../lib/paper";

const A = acte3;
const DUR = f(22);

// ---------------------------------------------------------------- outils de mise en scène
/** Carte qui, après `exitAt`, recule en profondeur (plus petite, floue, atténuée) puis disparaît */
const Depth: React.FC<{
  frame: number;
  exitAt: number;
  to: [number, number];
  scale?: number;
  fadeAfter?: number;
  children: React.ReactNode;
}> = ({ frame, exitAt, to, scale = 0.42, fadeAfter = 70, children }) => {
  const e = prog(frame, exitAt, exitAt + 20, ease.inOut);
  const gone = prog(frame, exitAt + fadeAfter, exitAt + fadeAfter + 30);
  if (gone >= 1) return null;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${to[0] * e}px,${to[1] * e}px) scale(${lerp(1, scale, e)})`,
        transformOrigin: "960px 540px",
        filter: e > 0.01 ? `blur(${e * 7}px)` : undefined,
        opacity: lerp(1, 0.45, e) * (1 - gone),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Traînées lumineuses aux quatre couleurs qui dérivent en fond */
const Streaks: React.FC = () => (
  <FrameCanvas
    draw={(ctx, frame) => {
      ctx.globalCompositeOperation = "lighter";
      const r = rng(5);
      const cols = [colors.orange, colors.pink, colors.green, colors.blue];
      for (let i = 0; i < 26; i++) {
        const y = 80 + r() * 920,
          len = 300 + r() * 700,
          sp = 2 + r() * 5,
          c = cols[i % 4];
        const x0 = ((r() * 2600 + frame * sp) % 2900) - 700;
        const g = ctx.createLinearGradient(x0, 0, x0 + len, 0);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, c);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1 + r() * 2;
        ctx.globalAlpha = 0.12 + r() * 0.2;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.bezierCurveTo(x0 + len * 0.4, y, x0 + len * 0.6, y - 30, x0 + len, y - 40 + r() * 20);
        ctx.stroke();
      }
    }}
  />
);

// ---------------------------------------------------------------- 0:18 · Analyse des factures
const SceneAnalyse: React.FC<{ frame: number }> = ({ frame }) => {
  const at = f(A.analyse.at);
  const s = springAt(frame, at, { damping: 16, stiffness: 90 });
  const count = prog(frame, at + 6, at + 50, ease.out);
  const bar = prog(frame, at + 10, at + 55, ease.out);
  return (
    <div
      className="card"
      style={{
        left: 430,
        top: 300,
        width: 1060,
        padding: "44px 54px",
        transform: `perspective(1800px) translateX(${lerp(-1300, 0, s)}px) rotateY(${lerp(55, 0, s)}deg) rotateX(${lerp(8, 0, s)}deg)`,
        transformOrigin: "0% 50%",
      }}
    >
      <CardHead color={A.analyse.couleur} title={A.analyse.titre} icon={<IconBars size={30} />} sub="2026" size={36} />
      <div style={{ display: "flex", gap: 90, marginTop: 34, alignItems: "flex-end" }}>
        {A.analyse.chiffres.map((c, i) => (
          <div key={i}>
            <div className="num" style={{ fontSize: 150, display: "flex", alignItems: "baseline" }}>
              <Odometer value={c.valeur * count} digits={String(c.valeur).length} group />
              <span style={{ marginLeft: 22 }}>{c.unite}</span>
            </div>
            <div style={{ fontSize: 36, color: "#4A5578", marginTop: 16 }}>{c.legende}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 36, color: "#26304f", marginTop: 22, fontWeight: 600 }}>{A.analyse.sousTitre}</div>
      <div style={{ height: 12, borderRadius: 10, background: "#E3E8F5", marginTop: 28, overflow: "hidden" }}>
        <div style={{ width: `${86 * bar}%`, height: "100%", background: "linear-gradient(90deg,#F48C03,#FFB54D)" }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 0:21 · Fiches techniques
// Croissant vectoriel dessiné trait par trait
const CROISSANT = {
  outline:
    "M 40 270 C 60 230, 110 200, 160 190 C 190 90, 280 50, 370 50 C 460 50, 550 90, 580 190 C 630 200, 680 230, 700 270 C 660 282, 610 272, 570 262 C 520 290, 440 302, 370 302 C 300 302, 220 290, 170 262 C 130 272, 80 282, 40 270 Z",
  ridges: [
    "M 160 190 C 178 220, 178 245, 170 262",
    "M 275 68 C 255 140, 255 230, 282 297",
    "M 465 68 C 485 140, 485 230, 458 297",
    "M 580 190 C 562 220, 562 245, 570 262",
  ],
};

const SceneFiche: React.FC<{ frame: number }> = ({ frame }) => {
  const at = f(A.fiche.at);
  const draw = prog(frame, at, at + 26, ease.inOut);
  const ridge = (i: number) => prog(frame, at + 14 + i * 4, at + 26 + i * 4, ease.out);
  const fill = prog(frame, at + 26, at + 40, ease.out);
  const unfold = prog(frame, at + 22, at + 38, ease.out);
  const cents = prog(frame, at + 34, at + 64, ease.out) * A.fiche.centimes;
  const orbit = interpolate(frame, [at, at + 90], [-6, 4], clamp);
  return (
    <AbsoluteFill style={{ transform: `perspective(2000px) rotateY(${orbit}deg)` }}>
      <svg width={760} height={360} viewBox="0 0 740 330" style={{ position: "absolute", left: 140, top: 360, overflow: "visible" }}>
        <defs>
          <linearGradient id="crg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F2B35E" />
            <stop offset="1" stopColor="#C97A2B" />
          </linearGradient>
        </defs>
        <path d={CROISSANT.outline} fill="url(#crg)" opacity={fill} />
        <path
          d={CROISSANT.outline}
          fill="none"
          stroke="#F7C77D"
          strokeWidth={6}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
          style={{ filter: "drop-shadow(0 0 10px rgba(255,190,110,.6))" }}
        />
        {CROISSANT.ridges.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#8E4B16"
            strokeWidth={6}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - ridge(i)}
          />
        ))}
      </svg>
      <div
        className="card"
        style={{
          left: 1000,
          top: 330,
          width: 780,
          padding: "40px 50px",
          transform: `perspective(1600px) rotateY(${lerp(-92, 0, unfold)}deg)`,
          transformOrigin: "0% 50%",
          opacity: unfold > 0.02 ? 1 : 0,
        }}
      >
        <CardHead color={A.fiche.couleur} title={A.fiche.titre} size={36} />
        <div style={{ fontSize: 40, color: "#4A5578", marginTop: 24 }}>{A.fiche.phrase}</div>
        <div className="num" style={{ fontSize: 170, color: colors.pink, marginTop: 14, display: "flex", alignItems: "baseline" }}>
          <Odometer value={cents} digits={3} decimals={2} hideLeadingZeros={false} />
          <span style={{ marginLeft: "0.14em" }}>€</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 0:24 · Mercuriales
const SceneMercuriales: React.FC<{ frame: number }> = ({ frame }) => {
  const at = f(A.mercuriales.at);
  const fac = A.mercuriales.facture;
  const enter = springAt(frame, at, { damping: 18, stiffness: 120 });
  // zoom dans la facture, puis dézoom
  const zin = prog(frame, at + 6, at + 22, ease.inOut);
  const zout = prog(frame, at + 40, at + 54, ease.inOut);
  const zoom = lerp(1, 1.55, zin) * lerp(1, 0.78 / 1.55, zout);
  const light = prog(frame, at + 20, at + 28, ease.out);
  const strike = prog(frame, at + 30, at + 38, ease.out);
  const slam = springAt(frame, at + 52, { damping: 11, stiffness: 220, mass: 0.8 });
  const shake = frame >= at + 54 && frame < at + 60 ? Math.sin((frame - at) * 9) * 6 * (1 - (frame - at - 54) / 6) : 0;
  const invX = lerp(0, -330, zout),
    invY = lerp(0, -150, zout);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px,${shake * 0.5}px)` }}>
      <AbsoluteFill
        style={{
          transform: `translate(${invX}px,${invY}px) scale(${zoom})`,
          transformOrigin: "980px 545px",
        }}
      >
        <div
          className="card"
          style={{
            left: 460,
            top: 330,
            width: 1000,
            padding: "30px 0 20px",
            borderRadius: 18,
            transform: `translateY(${lerp(500, 0, enter)}px) rotate(${lerp(6, 0, enter)}deg)`,
            opacity: Math.min(1, enter * 2),
          }}
        >
          <div style={{ fontFamily: "JBM", fontSize: 24, color: "#7A85A5", padding: "0 40px 18px", borderBottom: "1px solid #E1E6EF" }}>{fac.entete}</div>
          {fac.lignes.map((l, i) => {
            const hit = !!l.erreur;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 40px",
                  fontSize: 36,
                  borderBottom: "1px solid #E9EDF4",
                  position: "relative",
                  background: hit ? `rgba(224,30,109,${0.1 * light})` : undefined,
                  boxShadow: hit ? `inset 0 0 0 ${3 * light}px ${hexA(colors.pink, light)}` : undefined,
                }}
              >
                <span style={{ flex: 1, fontWeight: 600 }}>{l.designation}</span>
                <span style={{ width: 170, fontFamily: "JBM", fontSize: 30, color: "#4A5578" }}>{l.qte}</span>
                {hit ? (
                  <span
                    style={{
                      width: 200,
                      fontFamily: "JBM",
                      fontSize: 30,
                      color: "#7A85A5",
                      textAlign: "right",
                      opacity: strike,
                      position: "relative",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `<span style="position:relative">${euroMono(l.negocie!)}<i style="position:absolute;left:-4px;right:-4px;top:52%;height:3px;background:#7A85A5;transform:scaleX(${strike});transform-origin:0 50%"></i></span>`,
                    }}
                  />
                ) : (
                  <span style={{ width: 200 }} />
                )}
                <span
                  style={{ width: 200, textAlign: "right", fontFamily: "JBM", fontSize: 32, fontWeight: 600, color: hit && light > 0.5 ? colors.pink : "#1a2238" }}
                  dangerouslySetInnerHTML={{ __html: euroMono(l.prix) }}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* la carte « 77 € » claque par-dessus */}
      {frame >= at + 50 ? (
        <div
          className="card"
          style={{
            left: 900,
            top: 470,
            width: 820,
            padding: "40px 50px",
            transform: `scale(${lerp(1.6, 1, slam)})`,
            opacity: Math.min(1, prog(frame, at + 50, at + 54) * 1),
            boxShadow: "0 50px 110px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.6)",
          }}
        >
          <CardHead color={A.mercuriales.couleur} title={A.mercuriales.titre} size={34} />
          <div style={{ fontSize: 42, color: "#0B1430", marginTop: 22, fontWeight: 700 }}>{A.mercuriales.phrase}</div>
          <div className="num" style={{ fontSize: 160, color: colors.orange, marginTop: 10 }}>
            {A.mercuriales.montant.replace(" €", "")}
            <span style={{ marginLeft: "0.14em" }}>€</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, color: colors.pink, marginTop: 18, fontWeight: 600 }}>
            <IconAlert size={34} />
            {A.mercuriales.alerte}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 0:27 → 0:34 · Commandes · Inventaires · Planning
const PanelCommandes: React.FC<{ frame: number }> = ({ frame }) => {
  const at = f(A.commandes.at);
  const s = springAt(frame, at, { damping: 15, stiffness: 140 });
  return (
    <div
      className="card"
      style={{
        left: 90,
        top: 170,
        width: 760,
        padding: "34px 42px",
        transform: `translateY(${lerp(-520, 0, s)}px)`,
        boxShadow: "0 40px 90px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.6),0 0 60px rgba(244,140,3,.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <CardHead color={A.commandes.couleur} title={A.commandes.titre} size={34} />
        <span style={{ fontFamily: "JBM", fontSize: 26, color: "#7A85A5" }}>{A.commandes.heure}</span>
      </div>
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginTop: 24 }}>
        <IconAlert size={44} color={colors.pink} />
        <div style={{ fontSize: 40, lineHeight: 1.2, color: colors.pink, fontWeight: 700 }}>{A.commandes.notification}</div>
      </div>
    </div>
  );
};

const PanelInventaires: React.FC<{ frame: number }> = ({ frame }) => {
  const at = f(A.inventaires.at);
  const s = springAt(frame, at, { damping: 16, stiffness: 120 });
  const bar = prog(frame, at + 8, at + 40, ease.out);
  return (
    <div
      className="card"
      style={{
        left: 90,
        top: 560,
        width: 760,
        padding: "34px 42px",
        transform: `translateX(${lerp(-900, 0, s)}px)`,
      }}
    >
      <CardHead color={A.inventaires.couleur} title={A.inventaires.titre} size={34} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 20 }}>
        <span className="num" style={{ fontSize: 110 }}>
          {A.inventaires.valeur}
        </span>
        <span style={{ fontSize: 38, color: "#4A5578" }}>{A.inventaires.phrase}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26 }}>
        <div style={{ flex: 1, height: 18, borderRadius: 10, background: "#E3E8F5", overflow: "hidden" }}>
          <div style={{ width: `${A.inventaires.progression * bar}%`, height: "100%", background: `linear-gradient(90deg,${colors.green},#4BE0B0)` }} />
        </div>
        <span className="num" style={{ fontSize: 40, width: 110, textAlign: "right" }}>
          {Math.round(A.inventaires.progression * bar)} %
        </span>
      </div>
    </div>
  );
};

const PanelPlanning: React.FC<{ frame: number }> = ({ frame }) => {
  const at = f(A.planning.at);
  const s = springAt(frame, at, { damping: 16, stiffness: 110 });
  const P = A.planning;
  const x0 = 270,
    perH = 70; // px par heure, de 4h à 12h
  return (
    <div
      className="card"
      style={{
        left: 900,
        top: 170,
        width: 940,
        height: 750,
        padding: "34px 42px",
        transform: `translateX(${lerp(1100, 0, s)}px)`,
      }}
    >
      <CardHead color={P.couleur} title={P.titre} size={34} />
      <div style={{ position: "relative", marginTop: 30, height: 600 }}>
        {P.heures.map((h, i) => (
          <div key={h} style={{ position: "absolute", left: x0 + i * perH * 2 - 20, top: 0, fontFamily: "JBM", fontSize: 24, color: "#7A85A5" }}>
            {h}
          </div>
        ))}
        {P.lignes.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 0, top: 54 + i * 106, width: 856, height: 90, borderTop: "1px solid #E1E6EF" }}>
            <div style={{ position: "absolute", left: 0, top: 26, fontSize: 32, fontWeight: 600, color: "#26304f" }}>{l}</div>
          </div>
        ))}
        {P.creneaux.map(([row, start, len, c], k) => {
          const t = springAt(frame, at + 10 + k * 5, { damping: 14, stiffness: 170 });
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: x0 + start * perH,
                top: 54 + row * 106 + 20,
                width: len * perH * Math.min(1, t) - 6,
                height: 52,
                borderRadius: 12,
                background: c,
                opacity: Math.min(1, t * 2),
                transform: `translateY(${lerp(-40, 0, Math.min(1, t))}px)`,
                boxShadow: `0 8px 18px ${hexA(c, 0.35)}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 0:34 → 0:40 · Marges · Export · Ventes
const PanelMarges: React.FC<{ frame: number }> = ({ frame }) => {
  const at = f(A.marges.at);
  const s = springAt(frame, at, { damping: 17, stiffness: 110 });
  const trace = prog(frame, at + 6, at + 36, ease.inOut);
  const M = A.marges;
  const W = 820,
    H = 360;
  const min = 67.5,
    max = 71.8;
  const pts = M.courbe.map((v, i) => [(i / (M.courbe.length - 1)) * W, H - ((v - min) / (max - min)) * H] as [number, number]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1],
      [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  // position de la tête du tracé
  const idx = trace * (pts.length - 1);
  const i0 = Math.min(pts.length - 2, Math.floor(idx));
  const fr = idx - i0;
  const head = [lerp(pts[i0][0], pts[i0 + 1][0], fr), lerp(pts[i0][1], pts[i0 + 1][1], fr)];
  const gain = prog(frame, at + 30, at + 40, ease.out);
  return (
    <div
      className="card"
      style={{
        left: 80,
        top: 150,
        width: 960,
        height: 780,
        padding: "38px 46px",
        transform: `perspective(1800px) translateZ(${lerp(-900, 0, s)}px) rotateX(${lerp(20, 0, s)}deg)`,
        opacity: Math.min(1, s * 2),
      }}
    >
      <CardHead color={M.couleur} title={M.titre} sub={M.sousTitre} size={34} />
      <div className="num" style={{ fontSize: 120, color: colors.pink, marginTop: 24, opacity: gain, transform: `translateY(${(1 - gain) * 20}px)` }}>
        {M.gain}
      </div>
      <svg width={W} height={H + 60} style={{ position: "absolute", left: 70, top: 330, overflow: "visible" }}>
        <defs>
          <linearGradient id="mgf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={hexA(colors.pink, 0.22)} />
            <stop offset="1" stopColor={hexA(colors.pink, 0)} />
          </linearGradient>
          <clipPath id="mgclip">
            <rect x={0} y={-20} width={head[0]} height={H + 40} />
          </clipPath>
        </defs>
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={0} x2={W} y1={(H / 3) * k} y2={(H / 3) * k} stroke="#E3E8F5" strokeWidth={2} />
        ))}
        <path d={`${d} L ${W} ${H} L 0 ${H} Z`} fill="url(#mgf)" clipPath="url(#mgclip)" />
        <path d={d} fill="none" stroke={colors.pink} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - trace} />
        {trace > 0 && trace < 1 ? <circle cx={head[0]} cy={head[1]} r={12} fill={colors.pink} style={{ filter: `drop-shadow(0 0 12px ${colors.pink})` }} /> : null}
        {M.mois.map((m, i) => (
          <text key={i} x={(i / (M.mois.length - 1)) * W} y={H + 50} textAnchor="middle" fontFamily="JBM" fontSize={24} fill="#7A85A5">
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
};

const PanelExport: React.FC<{ frame: number }> = ({ frame }) => {
  const at = f(A.export.at);
  const s = springAt(frame, at, { damping: 16, stiffness: 130 });
  // le fichier est éjecté hors de l'interface puis retombe avec un rebond
  const ej = frame - (at + 12);
  let fx = 0,
    fy = 0,
    rot = 0;
  if (ej > 0) {
    const t = ej / 30;
    if (t < 1) {
      fx = 260 * t;
      fy = -4 * 330 * t * (1 - t); // parabole : le fichier sort au-dessus de la carte
      rot = 30 * Math.sin(t * Math.PI);
    } else {
      const b = Math.min(1, (t - 1) * 2.4);
      fx = 260;
      fy = -40 * Math.abs(Math.sin(b * Math.PI)) * (1 - b);
    }
  }
  const sent = prog(frame, at + 44, at + 52, ease.out);
  return (
    <div
      className="card"
      style={{
        left: 1100,
        top: 150,
        width: 740,
        height: 330,
        padding: "34px 42px",
        transform: `translateY(${lerp(-700, 0, s)}px)`,
      }}
    >
      <CardHead color={A.export.couleur} title={A.export.titre} size={34} />
      <div style={{ position: "relative", height: 200 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 30,
            width: 116,
            height: 140,
            borderRadius: 16,
            background: colors.green,
            color: "#fff",
            fontWeight: 800,
            fontSize: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${fx}px,${fy}px) rotate(${rot}deg)`,
            boxShadow: "0 18px 30px rgba(12,191,136,.35)",
          }}
        >
          CSV
        </div>
        <div style={{ position: "absolute", left: 420, top: 44, width: 260, fontFamily: "JBM", fontSize: 22, color: "#4A5578", wordBreak: "break-all" }}>
          {A.export.fichier}
        </div>
        <div style={{ position: "absolute", left: 420, top: 120, display: "flex", gap: 12, alignItems: "center", fontSize: 28, color: colors.green, fontWeight: 700, opacity: sent }}>
          <span style={{ width: 36, height: 36, borderRadius: 18, background: colors.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconCheck size={24} />
          </span>
          Envoyé
        </div>
      </div>
    </div>
  );
};

const PanelVentes: React.FC<{ frame: number }> = ({ frame }) => {
  const at = f(A.ventes.at);
  const s = springAt(frame, at, { damping: 16, stiffness: 130 });
  const V = A.ventes;
  const legendCols = [colors.orange, colors.blue, colors.pink];
  return (
    <div
      className="card"
      style={{
        left: 1100,
        top: 520,
        width: 740,
        height: 410,
        padding: "34px 42px",
        transform: `translateX(${lerp(900, 0, s)}px)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <CardHead color={V.couleur} title={V.titre} size={34} />
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 14, fontSize: 24, color: "#4A5578" }}>
        {V.legende.map((l, i) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i style={{ width: 16, height: 16, borderRadius: 4, background: legendCols[i], display: "inline-block" }} />
            {l}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 42, right: 42, bottom: 34, height: 230, display: "flex", alignItems: "flex-end", gap: 26 }}>
        {V.barres.map(([ach, ven], i) => {
          const t = (k: number) => springAt(frame, at + 8 + i * 4 + k * 2, { damping: 13, stiffness: 160 });
          const sc = 2.3;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 5, flex: 1 }}>
              <div style={{ flex: 1, height: ach * sc * t(0), background: colors.orange, borderRadius: "6px 6px 0 0" }} />
              <div style={{ flex: 1, height: ven * sc * t(1), background: colors.blue, borderRadius: "6px 6px 0 0" }} />
              <div style={{ flex: 1, height: (ven - ach) * sc * t(2), background: colors.pink, borderRadius: "6px 6px 0 0" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- caméra
/** Caméra du groupe de 3 panneaux : cadre sur le plus récent, puis recul pour tout montrer */
const groupCam = (frame: number, keys: { t: number; cx: number; cy: number; z: number }[]) => {
  let cx = keys[0].cx,
    cy = keys[0].cy,
    z = keys[0].z;
  for (let i = 1; i < keys.length; i++) {
    const k0 = keys[i - 1],
      k1 = keys[i];
    const t = prog(frame, k1.t - 14, k1.t + 6, ease.inOut);
    if (frame >= k1.t - 14) {
      cx = lerp(k0.cx, k1.cx, t);
      cy = lerp(k0.cy, k1.cy, t);
      z = lerp(k0.z, k1.z, t);
    }
  }
  return `translate(${960 - cx * z}px,${540 - cy * z}px) scale(${z})`;
};

// ---------------------------------------------------------------- Acte complet
export const Acte03: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (s: number) => f(s);
  const drift = frame * 0.06; // la caméra voyage en continu
  const exit = prog(frame, DUR - 12, DUR, ease.inExpo);
  return (
    <Stage>
      <NightBg cx={50 + Math.sin(frame / 120) * 6} />
      <Stars speed={0.6} count={300} />
      <Streaks />
      <AbsoluteFill style={{ transform: `translateX(${-drift}px) scale(${1 + exit * 0.4})`, opacity: 1 - exit, filter: exit > 0.05 ? `blur(${exit * 10}px)` : undefined }}>
        {frame < t(9) + 100 ? (
          <Depth frame={frame} exitAt={t(A.fiche.at)} to={[-640, -330]}>
            <SceneAnalyse frame={frame} />
          </Depth>
        ) : null}
        {frame >= t(A.fiche.at) - 2 && frame < t(12) + 100 ? (
          <Depth frame={frame} exitAt={t(A.mercuriales.at)} to={[660, -350]}>
            <SceneFiche frame={frame} />
          </Depth>
        ) : null}
        {frame >= t(A.mercuriales.at) - 2 && frame < t(14) + 100 ? (
          <Depth frame={frame} exitAt={t(A.commandes.at)} to={[640, 360]}>
            <SceneMercuriales frame={frame} />
          </Depth>
        ) : null}
        {frame >= t(A.commandes.at) - 2 && frame < t(20) + 100 ? (
          <Depth frame={frame} exitAt={t(A.marges.at)} to={[-620, 380]} scale={0.4}>
            <AbsoluteFill
              style={{
                transform: groupCam(frame, [
                  { t: t(A.commandes.at), cx: 470, cy: 290, z: 1.25 },
                  { t: t(A.inventaires.at), cx: 470, cy: 690, z: 1.25 },
                  { t: t(A.planning.at), cx: 960, cy: 545, z: 1 },
                ]),
              }}
            >
              <PanelCommandes frame={frame} />
              {frame >= t(A.inventaires.at) - 2 ? <PanelInventaires frame={frame} /> : null}
              {frame >= t(A.planning.at) - 2 ? <PanelPlanning frame={frame} /> : null}
            </AbsoluteFill>
          </Depth>
        ) : null}
        {frame >= t(A.marges.at) - 2 ? (
          <AbsoluteFill
            style={{
              transform: groupCam(frame, [
                { t: t(A.marges.at), cx: 560, cy: 540, z: 1.12 },
                { t: t(A.export.at), cx: 1290, cy: 330, z: 1.2 },
                { t: t(A.ventes.at), cx: 960, cy: 540, z: 1 },
              ]),
            }}
          >
            <PanelMarges frame={frame} />
            {frame >= t(A.export.at) - 2 ? <PanelExport frame={frame} /> : null}
            {frame >= t(A.ventes.at) - 2 ? <PanelVentes frame={frame} /> : null}
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Finish />
    </Stage>
  );
};
