// CSS repris tel quel de sources-images/base.css, ai.css et paper.js (PAPER_CSS).
// Seules les déclarations @font-face sont retirées (polices chargées par fonts.ts).
export const BASE_CSS = `
.stage{position:relative;width:1920px;height:1080px;overflow:hidden;font-family:"Manrope",sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
.stage *{box-sizing:border-box}
.abs{position:absolute}
.fill{position:absolute;inset:0}
.grain{position:absolute;inset:0;pointer-events:none;opacity:.10;mix-blend-mode:overlay;z-index:50}
.vignette{position:absolute;inset:0;pointer-events:none;z-index:49;background:radial-gradient(ellipse 75% 70% at 50% 50%,transparent 55%,rgba(0,0,0,.55) 100%)}
.caption{position:absolute;left:0;right:0;bottom:92px;text-align:center;font-weight:600;font-size:54px;letter-spacing:-.01em;z-index:40}
`;

export const AI_CSS = `
.bgAI{background:radial-gradient(ellipse 1300px 900px at 50% 45%,#13306F 0%,#0A1844 45%,#030714 100%)}
.doc{position:absolute;background:#F6F8FC;color:#1a2238;border-radius:8px;box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 0 1px rgba(143,227,255,.18);font-family:Manrope}
.doc .hd{display:flex;justify-content:space-between;align-items:flex-start;padding:22px 26px 14px;border-bottom:1px solid #e1e6ef}
.doc .sup{font-weight:800;font-size:22px}
.doc .meta{font-size:13px;color:#6a7591;text-align:right;line-height:1.45}
.doc table{width:100%;border-collapse:collapse;font-size:15px}
.doc td{padding:9px 12px;border-bottom:1px solid #e9edf4;white-space:nowrap}
.doc tr.th td{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#7a85a0;border-bottom:2px solid #a8b2c8}
.doc td.n{text-align:right;font-family:JBM;font-size:14px}
.doc tr.dim td{color:#a7b0c4}
.doc tr.hit td{background:rgba(61,184,255,.13)}
.doc tr.hit{outline:3px solid #3DB8FF;outline-offset:-2px}
.chip{position:absolute;display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:16px;background:rgba(14,30,78,.86);border:1px solid rgba(143,227,255,.4);color:#EAF0FF;font-size:21px;box-shadow:0 20px 50px rgba(0,0,0,.45),0 0 30px rgba(61,184,255,.18);white-space:nowrap}
.chip .k{color:#8FE3FF;font-weight:700}
.chip .m{font-family:JBM;font-size:20px}
.spark{display:inline-block;width:22px;height:22px;flex:none}
.glass{position:absolute;border-radius:28px;padding:36px 42px;background:rgba(14,30,78,.80);border:1px solid rgba(143,227,255,.35);box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 70px rgba(61,184,255,.16),inset 0 1px 0 rgba(255,255,255,.12);color:#EAF0FF}
.badge{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:22px;color:#BFF0FF}
.capt{position:absolute;font-weight:700;font-size:52px;letter-spacing:-.015em;color:#fff}
`;

export const PAPER_CSS = `
.inv{position:absolute;padding:30px 30px 26px;color:#2b2a27;font-family:Manrope;box-shadow:0 2px 0 rgba(0,0,0,.05),0 14px 34px rgba(0,0,0,.45);background-image:linear-gradient(160deg,rgba(255,255,255,.18),rgba(0,0,0,.04))}
.inv .ih{display:flex;justify-content:space-between;gap:14px;margin-bottom:20px}
.inv .sn{font-weight:800;font-size:22px;letter-spacing:-.01em}
.inv .ad{height:6px;width:80%;background:#cfc6b4;border-radius:3px;margin-top:8px}
.inv .ft{display:flex;flex-direction:column;align-items:flex-end;font-size:13px;color:#6b6457;gap:2px}
.inv .ft b{font-size:17px;color:#2b2a27;letter-spacing:.12em}
.inv table{width:100%;border-collapse:collapse;font-size:13.5px}
.inv td{padding:6px 4px;border-bottom:1px solid #ddd3c0}
.inv .th td{font-weight:700;font-size:11.5px;color:#7a7263;text-transform:uppercase;letter-spacing:.06em;border-bottom:1.5px solid #8e8572}
.inv .r{text-align:right;font-family:JBM;font-size:12.5px}
.inv .hl td{background:rgba(255,230,60,.55)}
.inv .tot{display:flex;justify-content:space-between;margin-top:14px;font-size:14px}
.inv .tot b{font-family:JBM}
.inv .stamp{position:absolute;right:34px;bottom:90px;transform:rotate(-14deg);border:4px solid rgba(200,30,40,.7);color:rgba(200,30,40,.72);font-weight:800;font-size:30px;padding:2px 16px;letter-spacing:.14em;border-radius:6px}
.inv .hw{position:absolute;left:40px;bottom:150px;font-family:Caveat;font-weight:700;font-size:30px;color:#1d3d8f;transform:rotate(-4deg)}
.inv .legal{margin-top:46px}.inv .legal i{display:block;height:4px;background:#ddd3c0;border-radius:2px;margin-top:7px}
.postit{position:absolute;width:150px;height:140px;background:linear-gradient(170deg,#FFE97A,#F7D84C);font-family:Caveat;font-weight:700;font-size:32px;color:#2a2a2a;padding:16px 14px;line-height:1;box-shadow:0 10px 20px rgba(0,0,0,.35)}
`;

// Cartes blanches Coopeo (reprises de sources-images/03-envol.html)
export const CARD_CSS = `
.card{position:absolute;background:rgba(246,248,255,.97);color:#0B1430;border-radius:28px;padding:30px 36px;box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.6)}
.card .k{display:flex;align-items:center;gap:14px;font-weight:700;font-size:28px;color:#26304f}
.card .ic{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex:none}
.num{font-weight:800;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
`;
