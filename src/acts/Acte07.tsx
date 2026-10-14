// Acte VII · Un nouveau coéquipier, le moindre détail (1:06 → 1:50)
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { acte7, f } from "../config";
import { F15Equipe, F16bLibelles, F16cFusion, F16Loupe } from "./Acte07a";
import { F16dBoissons, F16eCoutReel, F16fTaxesFacture, F16gTaxesVentilees, F17Scenarios, F18Alertes, F19Unique } from "./Acte07b";

const P = acte7.plans;
type Plan = { start: number; end: number };
const Plan: React.FC<{ p: Plan; name: string; children: React.ReactNode }> = ({ p, name, children }) => (
  <Sequence from={f(p.start)} durationInFrames={f(p.end - p.start)} name={name}>
    {children}
  </Sequence>
);

export const Acte07: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Plan p={P.equipe} name="F15 Il rejoint l'équipe">
      <F15Equipe />
    </Plan>
    <Plan p={P.loupe} name="F16 La loupe">
      <F16Loupe />
    </Plan>
    <Plan p={P.libelles} name="F16b Trois libellés">
      <F16bLibelles />
    </Plan>
    <Plan p={P.fusion} name="F16c Même produit, vrai prix">
      <F16cFusion />
    </Plan>
    <Plan p={P.boissons} name="F16d Lire ce qui n'est pas écrit">
      <F16dBoissons />
    </Plan>
    <Plan p={P.coutReel} name="F16e Le vrai prix">
      <F16eCoutReel />
    </Plan>
    <Plan p={P.taxesFacture} name="F16f Taxes en bas de facture">
      <F16fTaxesFacture />
    </Plan>
    <Plan p={P.taxesVentilees} name="F16g Chaque taxe à sa place">
      <F16gTaxesVentilees />
    </Plan>
    <Plan p={P.scenarios} name="F17 Prendre du recul, prévoir">
      <F17Scenarios />
    </Plan>
    <Plan p={P.alertes} name="F18 Les alertes du jour">
      <F18Alertes />
    </Plan>
    <Plan p={P.unique} name="F19 Ce qui le rend unique">
      <F19Unique />
    </Plan>
  </AbsoluteFill>
);
