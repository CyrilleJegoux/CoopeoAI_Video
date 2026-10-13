// Portage de sources-images/paper.js : factures papier réalistes (HTML).
import { fournisseursPapier } from "../config";

// Règle du € en police à chasse fixe : € en Manrope avec un petit écart (0,14 em)
export const euroMono = (s: string) =>
  s.replace(/[\s ]€/g, '<span style="font-family:Manrope;margin-left:.14em">€</span>');

export function invoiceHTML(
  i: number,
  { w = 420, h = 0, tone = "#F4EEE2", stamp = false, hl = -1, note = "", hlOpacity = 1 } = {},
) {
  const s = fournisseursPapier[i % fournisseursPapier.length];
  const num = 2400 + i * 37;
  const rows = s.items
    .map(
      (it, k) =>
        `<tr${k === hl ? ` class="hl" style="opacity:1"` : ""}><td${k === hl ? ` style="background:rgba(255,230,60,${0.55 * hlOpacity})"` : ""}>${it[0]}</td><td${k === hl ? ` style="background:rgba(255,230,60,${0.55 * hlOpacity})"` : ""}>${it[1]}</td><td class="r"${k === hl ? ` style="background:rgba(255,230,60,${0.55 * hlOpacity})"` : ""}>${euroMono(it[2] + " €")}</td><td class="r"${k === hl ? ` style="background:rgba(255,230,60,${0.55 * hlOpacity})"` : ""}>${euroMono(it[3] + " €")}</td></tr>`,
    )
    .join("");
  const total = s.items
    .reduce((a, it) => a + parseFloat(it[3].replace(/\s/g, "").replace(",", ".")), 0)
    .toFixed(2)
    .replace(".", ",");
  return `<div class="inv" style="width:${w}px;${h ? `min-height:${h}px;` : ""}background-color:${tone}">
    <div class="ih"><div><div class="sn" style="color:${s.c}">${s.n}</div><div class="ad"></div><div class="ad" style="width:60%"></div></div>
    <div class="ft"><b>FACTURE</b><span>N° ${num}</span><span>${String(2 + i * 3).padStart(2, "0")}/03</span></div></div>
    <table><tr class="th"><td>Désignation</td><td>Qté</td><td class="r">P.U.</td><td class="r">Montant</td></tr>${rows}</table>
    <div class="tot"><span>Total HT</span><b>${euroMono(total + " €")}</b></div>
    <div class="legal"><i></i><i style="width:70%"></i><i style="width:50%"></i></div>
    ${stamp ? '<div class="stamp">PAYÉ</div>' : ""}${note ? `<div class="hw">${note}</div>` : ""}
  </div>`;
}
