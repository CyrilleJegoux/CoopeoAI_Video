// Acte I · Il y a 10 ans (0:00 → 0:12)
// Mises en page reprises de sources-images/01a, 01b, 02, 03.
import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { acte1, colors, f } from "../config";
import { clamp, ease, lerp, prog, rng, springAt } from "../lib/anim";
import { Caption, Finish, FrameCanvas, Html, Stage } from "../lib/Stage";
import { euroMono, invoiceHTML } from "../lib/paper";

const P = acte1.plans;

// ---------------------------------------------------------------- décor bois (01a / 01b)
const WOOD_CSS = `
.wood{background:
  repeating-linear-gradient(92deg,rgba(0,0,0,0) 0 38px,rgba(0,0,0,.10) 38px 40px,rgba(0,0,0,0) 40px 97px,rgba(255,220,170,.04) 97px 99px),
  repeating-linear-gradient(91deg,rgba(0,0,0,0) 0 260px,rgba(0,0,0,.18) 260px 262px),
  linear-gradient(180deg,#3a2614,#2a1a0c)}
.binder{position:absolute;left:650px;top:100px;width:620px;height:770px;transform:rotate(-5deg)}
.cover{position:absolute;inset:0;border-radius:10px 14px 14px 10px;background:
  radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.10),transparent 60%),
  repeating-linear-gradient(35deg,rgba(255,255,255,.025) 0 3px,rgba(0,0,0,.03) 3px 6px),
  linear-gradient(135deg,#2d4f7a,#1f3a5c);box-shadow:0 30px 60px rgba(0,0,0,.6),inset 0 0 0 2px rgba(0,0,0,.25)}
.spine{position:absolute;left:0;top:0;bottom:0;width:70px;border-radius:10px 0 0 10px;background:linear-gradient(90deg,#16293f,#203a59 70%,#1a3150);box-shadow:inset -3px 0 6px rgba(0,0,0,.35)}
.ring{position:absolute;left:24px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#e9edf2,#8d96a3);box-shadow:0 2px 3px rgba(0,0,0,.5)}
.label{position:absolute;left:170px;top:110px;width:330px;height:150px;background:#F3EEE4;border-radius:4px;box-shadow:inset 0 0 0 6px #d9d2c4,0 2px 4px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;font-family:Caveat;font-weight:700;font-size:74px;color:#1d2a52;transform:rotate(-1deg)}
.finger{position:absolute;right:46px;top:340px;width:56px;height:120px;border-radius:30px;background:#14263c;box-shadow:inset 0 3px 8px rgba(0,0,0,.6)}
.open{position:absolute;left:300px;top:90px;width:1360px;height:860px}
.panel{position:absolute;top:0;bottom:0;width:660px;border-radius:12px;background:
  repeating-linear-gradient(35deg,rgba(255,255,255,.02) 0 3px,rgba(0,0,0,.03) 3px 6px),linear-gradient(135deg,#2d4f7a,#1f3a5c);box-shadow:0 30px 60px rgba(0,0,0,.6)}
.inside{position:absolute;inset:14px;border-radius:6px;background:linear-gradient(135deg,#9aa6b4,#7f8b99);box-shadow:inset 0 0 20px rgba(0,0,0,.25)}
.hinge{position:absolute;left:640px;top:0;bottom:0;width:80px;background:linear-gradient(90deg,#1a3150,#2a4a72 50%,#1a3150);border-radius:4px}
.arch{position:absolute;width:44px;height:230px;border:11px solid #c9cfd6;border-left-color:#f2f4f6;border-radius:24px;box-shadow:0 6px 10px rgba(0,0,0,.45)}
.lever{position:absolute;left:740px;top:390px;width:130px;height:46px;border-radius:22px;background:linear-gradient(#e7eaee,#a7afb8);box-shadow:0 6px 10px rgba(0,0,0,.45)}
.tab{position:absolute;width:70px;height:34px;border-radius:0 6px 6px 0;box-shadow:0 3px 6px rgba(0,0,0,.35)}
.hand{font-family:Caveat;font-weight:700;color:#1d3d8f;line-height:1.05}
`;

const Placed: React.FC<{ x: number; y: number; rot: number; html: string; style?: React.CSSProperties }> = ({
  x,
  y,
  rot,
  html,
  style,
}) => <Html html={html} style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, ...style }} />;

/** Particule lumineuse pré-dessinée (évite un shadowBlur par particule, très coûteux) */
let DUST_SPRITE: HTMLCanvasElement | null = null;
const dustSprite = () => {
  if (DUST_SPRITE) return DUST_SPRITE;
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, "rgba(255,233,200,1)");
  g.addColorStop(0.25, "rgba(255,217,160,.75)");
  g.addColorStop(1, "rgba(255,201,122,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 32, 32);
  DUST_SPRITE = c;
  return c;
};

/** Poussière dans la lumière de la lampe */
const Dust: React.FC<{ count?: number; alpha?: number }> = ({ count = 90, alpha = 1 }) => (
  <FrameCanvas
    style={{ mixBlendMode: "screen" }}
    draw={(ctx, frame) => {
      const r = rng(77);
      const sp = dustSprite();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < count; i++) {
        const x0 = 500 + r() * 1000,
          y0 = 150 + r() * 750,
          v = 0.2 + r() * 0.6,
          ph = r() * 6.28,
          s = 0.6 + r() * 2.2;
        const x = x0 + Math.sin(frame * 0.02 * v + ph) * 30 + frame * 0.25 * v;
        const y = y0 - frame * 0.35 * v + Math.cos(frame * 0.03 + ph) * 12;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.05 + ph));
        ctx.globalAlpha = alpha * tw * (0.25 + r() * 0.45);
        const d = s * 6;
        ctx.drawImage(sp, x - d / 2, y - d / 2, d, d);
      }
    }}
  />
);

const WarmLight: React.FC<{ cx?: number }> = ({ cx = 52 }) => (
  <>
    <div
      className="fill"
      style={{
        background: `radial-gradient(ellipse 1000px 760px at ${cx}% 46%,rgba(255,196,120,.30),rgba(255,160,80,.08) 50%,transparent 75%)`,
        mixBlendMode: "screen",
      }}
    />
    <div className="fill" style={{ background: `radial-gradient(ellipse 1150px 820px at ${cx}% 46%,transparent 40%,rgba(0,0,0,.72) 100%)` }} />
  </>
);

// ---------------------------------------------------------------- F1 · Le classeur (01a)
const F1Classeur: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = f(P.classeur.end - P.classeur.start);
  // très lente descente verticale de la caméra, puis poussée rapide vers le classeur (raccord)
  const slow = lerp(1.0, 1.045, prog(frame, 0, dur - 8, ease.inOutSine));
  const push = lerp(1, 1.15, prog(frame, dur - 8, dur, ease.inExpo));
  const scale = slow * push;
  const blur = prog(frame, dur - 6, dur) * 3;
  const txt = prog(frame, 10, 40, ease.out); // fondu doux (seule exception autorisée)
  return (
    <Stage>
      <style>{WOOD_CSS}</style>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "960px 485px", filter: blur ? `blur(${blur}px)` : undefined }}>
        <div className="fill wood" />
        <Placed html={invoiceHTML(1, { w: 520 })} x={900} y={190} rot={4} />
        <Placed html={invoiceHTML(0, { w: 520, tone: "#F7F2E8" })} x={890} y={420} rot={-9} />
        <Placed html={invoiceHTML(4, { w: 520, tone: "#EFE8D8" })} x={860} y={620} rot={11} />
        <Placed html={invoiceHTML(3, { w: 500, tone: "#FBE3EA" })} x={760} y={700} rot={-3} />
        <div className="binder">
          <div className="cover" />
          <div className="spine" />
          <div className="ring" style={{ top: 180 }} />
          <div className="ring" style={{ top: 600 }} />
          <div className="label">{acte1.etiquetteClasseur}</div>
          <div className="finger" />
        </div>
        <Placed html={invoiceHTML(2, { w: 440, h: 600, stamp: true })} x={170} y={300} rot={-16} />
        <Placed html={invoiceHTML(1, { w: 440, h: 600, hl: 0, note: acte1.noteFacture })} x={1390} y={470} rot={13} />
        <Placed
          html={`<div class="postit">${acte1.postit.join("<br>")}</div>`}
          x={1420}
          y={190}
          rot={8}
          style={{ width: 150, height: 140 }}
        />
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 800,
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "6px solid rgba(60,32,12,.45)",
            filter: "blur(1.5px)",
          }}
        />
        <WarmLight />
        <Dust />
      </AbsoluteFill>
      <div className="abs" style={{ left: 0, right: 0, bottom: 0, height: 300, background: "linear-gradient(transparent,rgba(0,0,0,.8) 75%)", zIndex: 39 }} />
      <Caption opacity={txt} style={{ color: "#FFE9C9", textShadow: "0 2px 30px rgba(0,0,0,.9)", bottom: 80, fontSize: 64 }}>
        {acte1.textes.ilYa10Ans}
      </Caption>
      <Finish />
    </Stage>
  );
};

// ---------------------------------------------------------------- F1b · On l'ouvre (01b)
const F1bOuverture: React.FC = () => {
  const frame = useCurrentFrame();
  const openStart = 8,
    openEnd = 32;
  // Rotation 3D de la couverture autour de la reliure
  const a = prog(frame, openStart, openEnd, ease.inOut);
  const angle = -180 * a;
  // Caméra : départ cadré sur le classeur fermé (raccord avec F1), puis recadrage sur le classeur ouvert
  const cam = prog(frame, 0, 44, ease.inOut);
  const settle = springAt(frame, 0, { damping: 18, stiffness: 90 });
  const s0 = 0.9 * 1.15;
  const scale = lerp(s0, 1, cam) * lerp(1.02, 1, settle);
  // point (1330,520) amené en (960,485) au départ
  const tx = lerp(960 - 1330 * s0, 0, cam);
  const ty = lerp(485 - 520 * s0, 0, cam);
  const rot = lerp(-5, -2.5, cam);
  const drift = 1 + prog(frame, 44, 90) * 0.025;
  // levier : claquement métallique
  const lever = interpolate(frame, [36, 40, 44], [0, -10, 0], clamp);
  // surlignage jaune et note au stylo
  const hl = prog(frame, 46, 58, ease.out);
  const note = prog(frame, 56, 72, ease.inOut);
  const shade = Math.abs(Math.cos((angle * Math.PI) / 180));

  const tones = ["#F4EEE2", "#F7F2E8", "#EFE8D8", "#FBE3EA", "#F2F0EA", "#E9F0F4"];
  const offsets: [number, number, number][] = [
    [-14, 30, -6],
    [10, 10, 5],
    [-20, 44, -9],
    [18, 0, 7],
    [4, 36, -3],
    [-8, 16, 3],
  ];
  return (
    <Stage>
      <style>{WOOD_CSS}</style>
      <AbsoluteFill style={{ transform: `scale(${drift})`, transformOrigin: "50% 50%" }}>
        <div className="fill wood" />
        <AbsoluteFill style={{ transform: `translate(${tx}px,${ty}px) scale(${scale})`, transformOrigin: "0 0" }}>
          <div className="open" style={{ transform: `rotate(${rot}deg)`, perspective: 2400, perspectiveOrigin: "690px 430px" }}>
            <div className="panel" style={{ left: 700 }}>
              <div className="inside" />
            </div>
            <div className="hinge" />
            {/* pile de factures sur le panneau droit */}
            <div>
              <Placed html={invoiceHTML(4, { w: 520, h: 700, tone: "#EFE8D8" })} x={860} y={90} rot={-12} />
              <Placed html={invoiceHTML(3, { w: 520, h: 700, tone: "#FBE3EA" })} x={840} y={40} rot={10} />
              {offsets.map(([dx, dy, r], k) => (
                <Placed key={k} html={invoiceHTML(k + 2, { w: 540, h: 740, tone: tones[k % tones.length] })} x={810 + dx * 3} y={50 + dy} rot={r} />
              ))}
              <Html
                html={invoiceHTML(1, { w: 560, h: 760, hl: 0, hlOpacity: hl })}
                style={{ position: "absolute", left: 800, top: 46, transform: "rotate(-1.5deg)" }}
              />
              {/* « vérifier prix ! » écrit au stylo */}
              <div
                style={{
                  position: "absolute",
                  left: 840,
                  top: 46 + 760 - 150 - 30,
                  transform: "rotate(-5.5deg)",
                  fontFamily: "Caveat",
                  fontWeight: 700,
                  fontSize: 30,
                  color: "#1d3d8f",
                  clipPath: `inset(0 ${100 - note * 100}% 0 0)`,
                }}
              >
                {acte1.noteFacture}
              </div>
              {[
                [colors.pink, 150],
                [colors.orange, 300],
                [colors.green, 480],
                [colors.blue, 640],
              ].map(([c, y]) => (
                <div key={c as string} className="tab" style={{ left: 1350, top: y as number, background: c as string }} />
              ))}
            </div>
            <div className="arch" style={{ left: 752, top: 120 }} />
            <div className="arch" style={{ left: 752, top: 520 }} />
            <div className="lever" style={{ transform: `rotate(${lever}deg)`, transformOrigin: "10% 50%" }} />
            {/* couverture : recto = couverture bleue, verso = panneau gauche intérieur */}
            <div
              style={{
                position: "absolute",
                left: 690,
                top: 0,
                width: 670,
                height: 860,
                transformOrigin: "0 50%",
                transform: `rotateY(${angle}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
                <div className="cover" style={{ left: 10 }} />
                <div className="label" style={{ left: 190, top: 120 }}>
                  {acte1.etiquetteClasseur}
                </div>
                <div className="finger" style={{ top: 370 }} />
                <div className="fill" style={{ background: `rgba(0,0,0,${(1 - shade) * 0.55})`, borderRadius: 12 }} />
              </div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <div style={{ position: "absolute", left: 670 - 660 - 20, top: 0, width: 660, height: 860 }}>
                  <div className="panel" style={{ left: 0 }}>
                    <div className="inside" />
                  </div>
                  <Placed html={invoiceHTML(0, { w: 470, stamp: true, tone: "#F7F2E8" })} x={60} y={330} rot={-8} />
                  <div
                    style={{
                      position: "absolute",
                      left: 110,
                      top: 60,
                      width: 430,
                      height: 330,
                      transform: "rotate(4deg)",
                      background: "repeating-linear-gradient(#FBFAF4 0 37px,#b9cde6 37px 38px)",
                      boxShadow: "0 12px 26px rgba(0,0,0,.4)",
                      padding: "22px 28px",
                    }}
                  >
                    <div className="hand" style={{ fontSize: 40, color: "#B5452F" }}>
                      {acte1.noteTotaux.titre}
                    </div>
                    {acte1.noteTotaux.lignes.map((l, k) => (
                      <div key={k} className="hand" style={{ fontSize: 31, marginTop: k === 0 ? 6 : 0 }}>
                        {l.label}&nbsp;&nbsp;{l.barre ? <s>{l.barre}</s> : null} {l.valeur}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 470,
                      top: 40,
                      width: 30,
                      height: 90,
                      border: "4px solid #b8c0c8",
                      borderRadius: 16,
                      transform: "rotate(12deg)",
                      boxShadow: "0 3px 4px rgba(0,0,0,.4)",
                    }}
                  />
                  <div className="fill" style={{ background: `rgba(0,0,0,${(1 - shade) * 0.5})`, borderRadius: 12 }} />
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
        <WarmLight cx={54} />
        <Dust count={60} alpha={0.7} />
      </AbsoluteFill>
      <Finish />
    </Stage>
  );
};

// ---------------------------------------------------------------- F2 · La saisie (02)
const SHEET_CSS = `
.screenWrap{left:150px;top:40px;width:1640px;height:900px;transform:perspective(2600px) rotateY(-7deg) rotateX(3deg);transform-origin:50% 50%}
.bezel{position:absolute;inset:0;background:#121214;border-radius:26px;padding:34px 34px 46px;box-shadow:0 0 0 3px #26262a,0 40px 120px rgba(0,0,0,.8)}
.disp{position:relative;width:100%;height:100%;background:#F2F5F7;overflow:hidden;border-radius:3px;box-shadow:0 0 90px 4px rgba(190,215,255,.10)}
.chrome{height:46px;background:linear-gradient(#e4e8ec,#d3d9de);display:flex;align-items:center;gap:12px;padding:0 18px;font-size:19px;color:#3c4650;border-bottom:1px solid #b9c2ca}
.dotw{width:13px;height:13px;border-radius:50%}
.menu{height:36px;background:#eceff2;display:flex;gap:30px;align-items:center;padding:0 20px;font-size:17px;color:#46505a;border-bottom:1px solid #c9d1d8}
.tools{height:44px;background:#f4f6f8;display:flex;gap:10px;align-items:center;padding:0 16px;border-bottom:1px solid #c9d1d8}
.tools i{width:26px;height:22px;border-radius:4px;background:#d5dbe1}
.fx{height:42px;background:#fff;display:flex;align-items:center;border-bottom:1px solid #c0c8cf;font-family:"JBM";font-size:19px;color:#2b333b}
.fx span{padding:0 16px;border-right:1px solid #c9d1d8;height:100%;display:flex;align-items:center}
.sheet{border-collapse:collapse;font-size:22px;color:#1f262d;width:100%;table-layout:fixed}
.sheet td{height:46px;border-right:1px solid #cdd4da;border-bottom:1px solid #cdd4da;padding:0 12px;white-space:nowrap;overflow:hidden;font-family:"Manrope";font-weight:500}
.sheet td.n{text-align:right;font-family:"JBM";font-size:20px}
.sheet tr.h td{background:#e3e8ed;color:#59636d;text-align:center;font-weight:600;font-size:18px;height:34px}
.sheet td.r{background:#e3e8ed;color:#59636d;text-align:center;font-size:17px;width:56px;font-weight:600}
.cur{display:inline-block;width:3px;height:26px;background:#111;vertical-align:-5px;margin-left:2px}
`;

// frappes clavier (images relatives au plan) : d'abord irrégulières, puis calées sur la grille
const FR = acte1.tableur.frappes;
const KEYS = FR.cles.map((t, i) => ({ at: f(t), txt: acte1.tableur.saisie.slice(0, [1, 2, 3, 4][i]) }));
const ENTER_AT = f(FR.entree);
const NEXT_ROW_KEYS = FR.ligneSuivante.map((t) => f(t)); // A8 : « 05/03 » au rythme

const Spreadsheet: React.FC<{ frame: number; liftCells?: boolean }> = ({ frame, liftCells }) => {
  const t = acte1.tableur;
  let typed = "";
  for (const k of KEYS) if (frame >= k.at) typed = k.txt;
  const entered = frame >= ENTER_AT;
  const nextTyped = ["", "0", "05", "05/0", "05/03"][NEXT_ROW_KEYS.filter((k) => frame >= k).length];
  const blink = Math.floor(frame / 8) % 2 === 0 || KEYS.some((k) => frame - k.at >= 0 && frame - k.at < 8);
  const hide = (key: string) => (liftCells && LIFT_KEYS.includes(key) ? { opacity: 0.12 } : undefined);
  const row = (i: number) => t.lignes[i];
  return (
    <div className="disp">
      <div className="chrome">
        <span className="dotw" style={{ background: "#e4675b" }} />
        <span className="dotw" style={{ background: "#e9b54c" }} />
        <span className="dotw" style={{ background: "#6bbf5a" }} />
        <span style={{ marginLeft: 18, fontWeight: 600 }}>{t.fichier}</span>
      </div>
      <div className="menu">
        {t.menus.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="tools">
        <i />
        <i />
        <i />
        <i style={{ width: 2, background: "#bbb" }} />
        <i />
        <i />
        <i style={{ width: 60 }} />
        <i style={{ width: 40 }} />
        <i />
        <i />
        <i />
      </div>
      <div className="fx">
        <span style={{ width: 110, justifyContent: "center" }}>{entered ? (frame >= NEXT_ROW_KEYS[0] - 6 ? "A8" : "F8") : "F7"}</span>
        <span style={{ color: "#8a949e", fontStyle: "italic" }}>fx</span>
        <span style={{ border: "none" }}>{entered ? nextTyped : typed}</span>
      </div>
      <table className="sheet">
        <colgroup>
          <col style={{ width: 56 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 230 }} />
          <col style={{ width: 310 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 170 }} />
          <col style={{ width: 170 }} />
          <col />
        </colgroup>
        <tbody>
          <tr className="h">
            {["", "A", "B", "C", "D", "E", "F", "G", "H"].map((c, i) => (
              <td key={i}>{c}</td>
            ))}
          </tr>
          <tr>
            <td className="r">1</td>
            <td colSpan={4} style={{ fontWeight: 800, fontSize: 24 }}>
              {t.titre}
            </td>
            <td />
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td className="r">2</td>
            {Array.from({ length: 8 }).map((_, i) => (
              <td key={i} />
            ))}
          </tr>
          <tr style={{ background: "#fff7df" }}>
            <td className="r">3</td>
            {t.entetes.map((h, i) => (
              <td key={h} style={{ fontWeight: 700, textAlign: i >= 5 ? "right" : undefined }}>
                {h}
              </td>
            ))}
            <td />
          </tr>
          {[0, 1, 2].map((i) => (
            <tr key={i}>
              <td className="r">{4 + i}</td>
              <td className="n" style={{ textAlign: "left" }}>
                {row(i)[0]}
              </td>
              <td>{row(i)[1]}</td>
              <td style={hide(`C${4 + i}`)}>{row(i)[2]}</td>
              <td className="n" style={hide(`D${4 + i}`)}>
                {row(i)[3]}
              </td>
              <td>{row(i)[4]}</td>
              <td className="n" style={hide(`F${4 + i}`)} dangerouslySetInnerHTML={{ __html: euroMono(row(i)[5].replace("€", " €")) }} />
              <td className="n" dangerouslySetInnerHTML={{ __html: euroMono(row(i)[6].replace("€", " €")) }} />
              <td />
            </tr>
          ))}
          <tr>
            <td className="r" style={{ background: entered ? "#e3e8ed" : "#c9d6cc", color: entered ? "#59636d" : "#2d5a3a" }}>
              7
            </td>
            <td className="n" style={{ textAlign: "left" }}>
              {row(3)[0]}
            </td>
            <td>{row(3)[1]}</td>
            <td style={hide("C7")}>{row(3)[2]}</td>
            <td className="n">{row(3)[3]}</td>
            <td>{row(3)[4]}</td>
            <td
              className="n"
              style={
                entered
                  ? { ...hide("F7") }
                  : { background: "#fff", outline: "3px solid #2d6a3e", outlineOffset: -2 }
              }
            >
              {entered ? <span dangerouslySetInnerHTML={{ __html: euroMono("4,12 €") }} /> : typed}
              {!entered && blink ? <span className="cur" /> : null}
            </td>
            <td className="n">{entered ? <span dangerouslySetInnerHTML={{ __html: euroMono("103,00 €") }} /> : null}</td>
            <td />
          </tr>
          <tr>
            <td className="r" style={entered ? { background: "#c9d6cc", color: "#2d5a3a" } : undefined}>
              8
            </td>
            <td
              className="n"
              style={
                entered && frame >= NEXT_ROW_KEYS[0] - 6
                  ? { textAlign: "left", background: "#fff", outline: "3px solid #2d6a3e", outlineOffset: -2 }
                  : { textAlign: "left" }
              }
            >
              {entered && frame >= NEXT_ROW_KEYS[0] - 6 ? (
                <>
                  {nextTyped}
                  {blink ? <span className="cur" /> : null}
                </>
              ) : null}
            </td>
            {Array.from({ length: 7 }).map((_, i) => (
              <td key={i} />
            ))}
          </tr>
          {[9, 10, 11, 12, 13].map((n) => (
            <tr key={n}>
              <td className="r">{n}</td>
              {Array.from({ length: 8 }).map((_, i) => (
                <td key={i} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="fill"
        style={{
          background:
            "linear-gradient(115deg,rgba(255,190,110,.20) 0%,rgba(255,190,110,.06) 22%,transparent 40%),linear-gradient(200deg,rgba(255,255,255,.04),transparent 25%)",
        }}
      />
    </div>
  );
};

const F2Saisie: React.FC = () => {
  const frame = useCurrentFrame();
  const settle = springAt(frame, 0, { damping: 20, stiffness: 70 });
  const scale = lerp(1.08, 1.0, settle) * (1 + prog(frame, 0, 120) * 0.035);
  const cap = prog(frame, 18, 30, ease.out);
  const capY = lerp(26, 0, cap);
  return (
    <Stage>
      <style>{SHEET_CSS}</style>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "62% 50%" }}>
        <div className="fill" style={{ background: "radial-gradient(ellipse 1400px 900px at 40% 40%,#2a1c0e 0%,#0c0805 70%)" }} />
        <div className="abs screenWrap">
          <div className="bezel">
            <Spreadsheet frame={frame} />
          </div>
        </div>
        <ForegroundInvoice x={lerp(-160, -120, prog(frame, 0, 120))} />
      </AbsoluteFill>
      <div className="fill" style={{ background: "radial-gradient(ellipse 900px 600px at 0% 100%,rgba(255,170,80,.18),transparent 70%)", mixBlendMode: "screen" }} />
      <div className="abs" style={{ left: 0, right: 0, bottom: 0, height: 300, background: "linear-gradient(transparent,rgba(0,0,0,.75))", zIndex: 39 }} />
      <Caption opacity={cap} y={capY} style={{ color: "#FFE9C9", fontSize: 54, bottom: 70 }}>
        {acte1.textes.saisie}
      </Caption>
      <Finish />
    </Stage>
  );
};

const ForegroundInvoice: React.FC<{ x: number; opacity?: number }> = ({ x, opacity = 1 }) => (
  <div
    className="abs"
    style={{
      left: x,
      top: 760,
      width: 640,
      height: 520,
      background: "#EFE3CB",
      transform: "rotate(-12deg)",
      filter: "blur(10px) brightness(.5)",
      boxShadow: "0 0 60px rgba(0,0,0,.6)",
      padding: 50,
      opacity,
    }}
  >
    <div style={{ fontWeight: 800, fontSize: 40, color: "#5a4a33" }}>FACTURE</div>
    <div style={{ height: 10, background: "#a99a7e", margin: "24px 0", width: "70%" }} />
    <div style={{ height: 10, background: "#a99a7e", margin: "24px 0" }} />
    <div style={{ height: 10, background: "#a99a7e", margin: "24px 0", width: "80%" }} />
  </div>
);

// ---------------------------------------------------------------- F3 · Le papier devient interface (03)
const LIFT_KEYS = ["C4", "F4", "C6", "F7", "C7", "D4"];
// départ : position des cellules à l'écran dans F2 ; milieu : composition de 03-envol ; fin : sortie à droite
const CELLS = [
  { key: "C4", txt: "Farine T65", mono: false, from: [672, 438], mid: [130, 285], rot: -14, sc: 1.15, blur: 2.5, yellow: false },
  { key: "F4", txt: "0,71 €", mono: true, from: [1225, 437], mid: [250, 505], rot: 9, sc: 1, blur: 1.5, yellow: false },
  { key: "C6", txt: "Crème 35 %", mono: false, from: [678, 529], mid: [190, 725], rot: -6, sc: 1.3, blur: 4, yellow: false },
  { key: "F7", txt: "4,12 €", mono: true, from: [1195, 576], mid: [480, 362], rot: 18, sc: 0.9, blur: 1, yellow: true },
  { key: "C7", txt: "Beurre doux 82 %", mono: false, from: [705, 574], mid: [610, 815], rot: -20, sc: 0.85, blur: 1, yellow: false },
  { key: "D4", txt: "25 kg", mono: false, from: [985, 437], mid: [695, 592], rot: 6, sc: 0.8, blur: 0, yellow: false },
];

const ENVOL_CSS = `
.cell{position:absolute;background:#F2F5F7;border:1px solid #c9d1d8;font-size:30px;padding:12px 18px;color:#1f262d;white-space:nowrap;border-radius:2px;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.cell.m{font-family:"JBM";font-size:28px}
`;

export const IconBars: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" />
  </svg>
);

const F3Envol: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = f(P.envol.end - P.envol.start); // 60
  // phase A (0→14) : les cellules se détachent ; phase B (14→40) : composition 03 ; phase C (40→60) : accélération vers la droite
  const warm = 1 - prog(frame, 0, 26, ease.inOut);
  const screenOut = prog(frame, 0, 18, ease.out);
  const exitT = prog(frame, 40, dur, ease.inExpo);
  const card = springAt(frame, 14, { damping: 15, stiffness: 110 });
  const env = acte1.envol;
  return (
    <Stage>
      <style>{SHEET_CSS + ENVOL_CSS}</style>
      {/* fond : la lumière chaude bascule vers le bleu nuit */}
      <div
        className="fill"
        style={{
          background:
            "radial-gradient(ellipse 900px 700px at 0% 50%,rgba(120,72,24,.55),transparent 70%),radial-gradient(ellipse 1300px 900px at 70% 45%,#142a66 0%,#0a1438 45%,#060b1e 80%),#060b1e",
        }}
      />
      <div className="fill" style={{ background: "radial-gradient(ellipse 1400px 900px at 40% 40%,#2a1c0e 0%,#0c0805 70%)", opacity: warm }} />
      {/* l'écran du tableur s'éloigne */}
      {screenOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - screenOut, transform: `scale(${1 - screenOut * 0.25}) translateX(${-screenOut * 200}px)`, filter: `blur(${screenOut * 8}px)` }}>
          <div className="abs screenWrap">
            <div className="bezel">
              <Spreadsheet frame={200} liftCells />
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
      {/* traînées colorées */}
      <FrameCanvas
        draw={(ctx, fr) => {
          ctx.globalCompositeOperation = "lighter";
          const cols = [colors.orange, colors.pink, colors.green, colors.blue, "#FFB46A"];
          const r = rng(11);
          const grow = prog(fr, 4, 34, ease.out);
          const shift = prog(fr, 40, dur, ease.inExpo) * 900;
          for (let i = 0; i < 46; i++) {
            const y = 120 + r() * 860,
              x0 = -100 + r() * 700 + shift,
              len = (300 + r() * 900) * grow * (1 + prog(fr, 40, dur) * 0.8),
              c = cols[i % 4],
              w = 1 + r() * 3.5;
            const al = 0.25 + r() * 0.5;
            if (len < 2) continue;
            const g = ctx.createLinearGradient(x0, 0, x0 + len, 0);
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(1, c);
            ctx.strokeStyle = g;
            ctx.lineWidth = w;
            ctx.shadowColor = c;
            ctx.shadowBlur = 14;
            ctx.globalAlpha = al * (1 - warm * 0.6);
            ctx.beginPath();
            ctx.moveTo(x0, y);
            ctx.bezierCurveTo(x0 + len * 0.4, y, x0 + len * 0.6, y - (y - 540) * 0.25, x0 + len, y - (y - 520) * 0.32);
            ctx.stroke();
          }
          for (let i = 0; i < 220; i++) {
            const x = r() * 1920 + shift * 0.6,
              y = r() * 1080,
              s = r() * 2.2;
            ctx.globalAlpha = (0.25 + r() * 0.6) * prog(fr, 6, 20);
            ctx.fillStyle = x < 700 ? "#FFCF8A" : "#9FD8FF";
            ctx.shadowBlur = 6;
            ctx.shadowColor = ctx.fillStyle;
            ctx.beginPath();
            ctx.arc(x, y, s, 0, 7);
            ctx.fill();
          }
        }}
      />
      {/* cellules qui s'envolent */}
      {CELLS.map((c, i) => {
        const lift = springAt(frame, i * 1.5, { damping: 16, stiffness: 120 });
        const x = lerp(c.from[0], c.mid[0], lift) + exitT * (1500 + i * 120);
        const y = lerp(c.from[1], c.mid[1], lift) + exitT * (c.mid[1] - 540) * -0.3;
        const rot = lerp(0, c.rot, lift) * (1 - exitT);
        const sc = lerp(0.85, c.sc, lift) * (1 - exitT * 0.4);
        // la cellule devient carte : coins arrondis
        const radius = lerp(2, 16, prog(frame, 26, 46));
        const blur = lerp(0, c.blur, lift) + exitT * 6;
        const trail = Math.min(1, exitT * 2);
        return (
          <React.Fragment key={c.key}>
            {trail > 0
              ? [1, 2, 3].map((k) => (
                  <div
                    key={k}
                    className={`cell${c.mono ? " m" : ""}`}
                    style={{
                      left: x - k * 60 * trail,
                      top: y,
                      transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`,
                      opacity: 0.25 / k,
                      filter: `blur(${blur + k * 3}px)`,
                      borderRadius: radius,
                      background: c.yellow ? "#FFF3C4" : undefined,
                    }}
                  >
                    {c.txt}
                  </div>
                ))
              : null}
            <div
              className={`cell${c.mono ? " m" : ""}`}
              style={{
                left: x,
                top: y,
                transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`,
                filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
                borderRadius: radius,
                background: c.yellow ? "#FFF3C4" : undefined,
              }}
              dangerouslySetInnerHTML={{ __html: c.mono ? euroMono(c.txt) : c.txt }}
            />
          </React.Fragment>
        );
      })}
      {/* carte intermédiaire (moitié cellule, moitié carte) */}
      <div
        className="card"
        style={{
          left: 790 + exitT * 1400,
          top: 250,
          padding: "18px 24px",
          borderRadius: 16,
          transform: `rotate(-7deg) scale(${0.82 * springAt(frame, 20, { damping: 13 })})`,
        }}
      >
        <div className="k" style={{ fontSize: 24 }}>
          <span className="ic" style={{ background: env.petitesCartes[0].couleur, width: 30, height: 30, borderRadius: 8 }} />
          {env.petitesCartes[0].titre}
        </div>
      </div>
      {/* carte principale : glissé 3D */}
      <div
        className="card"
        style={{
          left: 1010 + lerp(500, 0, card) + exitT * 1200,
          top: 330,
          width: 700,
          opacity: Math.min(1, card * 2),
          transform: `perspective(1600px) rotateY(${lerp(-50, -16, card)}deg) rotateX(4deg) scale(${1 + exitT * 0.3})`,
          filter: exitT > 0.05 ? `blur(${exitT * 10}px)` : undefined,
        }}
      >
        <div className="k">
          <span className="ic" style={{ background: colors.orange }}>
            <IconBars />
          </span>
          {env.carte.titre}
        </div>
        <div style={{ display: "flex", gap: 56, marginTop: 26, alignItems: "flex-end" }}>
          <div>
            <div className="num" style={{ fontSize: 96 }}>
              {env.carte.valeur}
            </div>
            <div style={{ fontSize: 26, color: "#4A5578", marginTop: 10 }}>{env.carte.sousTitre}</div>
          </div>
        </div>
        <div style={{ height: 10, borderRadius: 10, background: "#E3E8F5", marginTop: 26, overflow: "hidden" }}>
          <div style={{ width: `${72 * prog(frame, 22, 44, ease.out)}%`, height: "100%", background: "linear-gradient(90deg,#F48C03,#FFB54D)" }} />
        </div>
      </div>
      {/* cartes lointaines */}
      <div
        className="card"
        style={{
          left: 1460 + exitT * 600,
          top: 120,
          transform: `scale(${0.7 * springAt(frame, 12, { damping: 16 })})`,
          filter: "blur(3px)",
          opacity: 0.85,
        }}
      >
        <div className="k">
          <span className="ic" style={{ background: env.petitesCartes[1].couleur }} />
          {env.petitesCartes[1].titre}
        </div>
        <div className="num" style={{ fontSize: 60, color: colors.pink, marginTop: 10 }}>
          {env.petitesCartes[1].valeur}
        </div>
      </div>
      <div
        className="card"
        style={{
          left: 1480 + exitT * 600,
          top: 770,
          transform: `scale(${0.62 * springAt(frame, 16, { damping: 16 })})`,
          filter: "blur(4px)",
          opacity: 0.8,
        }}
      >
        <div className="k">
          <span className="ic" style={{ background: env.petitesCartes[2].couleur }} />
          {env.petitesCartes[2].titre}
        </div>
      </div>
      {/* fin du plan : le noir monte juste avant le premier kick */}
      <div className="fill" style={{ background: "#03060f", opacity: prog(frame, dur - 6, dur, ease.in) * 0.85 }} />
      <Finish />
    </Stage>
  );
};

// ---------------------------------------------------------------- Acte complet
export const Acte01: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={f(P.classeur.start)} durationInFrames={f(P.classeur.end - P.classeur.start)} name="F1 Le classeur">
      <F1Classeur />
    </Sequence>
    <Sequence from={f(P.ouverture.start)} durationInFrames={f(P.ouverture.end - P.ouverture.start)} name="F1b On l'ouvre">
      <F1bOuverture />
    </Sequence>
    <Sequence from={f(P.saisie.start)} durationInFrames={f(P.saisie.end - P.saisie.start)} name="F2 La saisie">
      <F2Saisie />
    </Sequence>
    <Sequence from={f(P.envol.start)} durationInFrames={f(P.envol.end - P.envol.start)} name="F3 Envol">
      <F3Envol />
    </Sequence>
  </AbsoluteFill>
);
