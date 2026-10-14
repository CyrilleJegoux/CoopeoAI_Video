import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { f, timeline } from "./config";
import { Acte01 } from "./acts/Acte01";
import { Acte02 } from "./acts/Acte02";
import { Acte03 } from "./acts/Acte03";
import { Acte04 } from "./acts/Acte04";
import { Acte05 } from "./acts/Acte05";
import { Acte06 } from "./acts/Acte06";
import { Acte07 } from "./acts/Acte07";
import { Acte08 } from "./acts/Acte08";
import { Acte08bis } from "./acts/Acte08bis";

type Act = { key: keyof typeof timeline; C: React.FC; name: string };
export const ACTES: Act[] = [
  { key: "acte1", C: Acte01, name: "I · Il y a 10 ans" },
  { key: "acte2", C: Acte02, name: "II · Coopeo évolue" },
  { key: "acte3", C: Acte03, name: "III · Le déferlement" },
  { key: "acte4", C: Acte04, name: "IV · L'équipe à bord" },
  { key: "acte5", C: Acte05, name: "V · Convergence et 10 bougies" },
  { key: "acte6", C: Acte06, name: "VI · BOOM Coopeo AI" },
  { key: "acte7", C: Acte07, name: "VII · Un nouveau coéquipier" },
  { key: "acte8", C: Acte08, name: "VIII · Agir ensemble" },
  { key: "acte8bis", C: Acte08bis, name: "VIII bis · Le cercle vertueux" },
];

export const Master: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {ACTES.map(({ key, C, name }) => {
      const t = timeline[key];
      return (
        <Sequence key={key} from={f(t.start)} durationInFrames={f(t.end - t.start)} name={name}>
          <C />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
