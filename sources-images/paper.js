// Realistic paper invoices for flat-lay frames
const SUPPLIERS = [
  { n: 'Minoterie A', c: '#8A5A1E', items: [['Farine T65', '25 kg', '0,71', '17,75'], ['Farine T45', '25 kg', '0,84', '21,00'], ['Farine de seigle', '10 kg', '1,12', '11,20']] },
  { n: 'Crèmerie B', c: '#1F5C8C', items: [['Beurre doux 82 %', '25 kg', '4,12', '103,00'], ['Crème 35 %', '6 L', '3,98', '23,88'], ['Lait entier', '12 L', '0,92', '11,04']] },
  { n: 'Primeurs C', c: '#2E7D4F', items: [['Pommes golden', '10 kg', '1,85', '18,50'], ['Citrons', '3 kg', '2,90', '8,70']] },
  { n: 'Emballages D', c: '#7A2E5C', items: [['Sacs baguette', '1 000', '0,03', '30,00'], ['Boîtes pâtisserie', '200', '0,21', '42,00']] },
  { n: 'Épicerie E', c: '#5A4A8C', items: [['Sucre semoule', '25 kg', '1,02', '25,50'], ['Œufs plein air', '360', '0,19', '68,40'], ['Levure fraîche', '1 kg', '3,40', '3,40']] },
];
function invoiceHTML(i, { w = 420, h = 0, tone = '#F4EEE2', stamp = false, hl = -1, note = '' } = {}) {
  const s = SUPPLIERS[i % SUPPLIERS.length];
  const num = 2400 + i * 37;
  const rows = s.items.map((it, k) => `<tr${k === hl ? ' class="hl"' : ''}><td>${it[0]}</td><td>${it[1]}</td><td class="r">${it[2]} €</td><td class="r">${it[3]} €</td></tr>`).join('');
  const total = s.items.reduce((a, it) => a + parseFloat(it[3].replace(',', '.')), 0).toFixed(2).replace('.', ',');
  return `<div class="inv" style="width:${w}px;${h ? `min-height:${h}px;` : ''}background:${tone}">
    <div class="ih"><div><div class="sn" style="color:${s.c}">${s.n}</div><div class="ad"></div><div class="ad" style="width:60%"></div></div>
    <div class="ft"><b>FACTURE</b><span>N° ${num}</span><span>${String(2 + i * 3).padStart(2, '0')}/03</span></div></div>
    <table><tr class="th"><td>Désignation</td><td>Qté</td><td class="r">P.U.</td><td class="r">Montant</td></tr>${rows}</table>
    <div class="tot"><span>Total HT</span><b>${total} €</b></div>
    <div class="legal"><i></i><i style="width:70%"></i><i style="width:50%"></i></div>
    ${stamp ? '<div class="stamp">PAYÉ</div>' : ''}${note ? `<div class="hw">${note}</div>` : ''}
  </div>`;
}
const PAPER_CSS = `
@font-face{font-family:"Caveat";font-weight:700;src:url(node_modules/@fontsource/caveat/files/caveat-latin-700-normal.woff2) format("woff2")}
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
.inv .hw{position:absolute;left:40px;bottom:150px;font-family:Caveat;font-size:30px;color:#1d3d8f;transform:rotate(-4deg)}
.inv .legal{margin-top:46px}.inv .legal i{display:block;height:4px;background:#ddd3c0;border-radius:2px;margin-top:7px}
.postit{position:absolute;width:150px;height:140px;background:linear-gradient(170deg,#FFE97A,#F7D84C);font-family:Caveat;font-size:32px;color:#2a2a2a;padding:16px 14px;line-height:1;box-shadow:0 10px 20px rgba(0,0,0,.35)}
`;
