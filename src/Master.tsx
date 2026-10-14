import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { audio, f, timeline } from "./config";
import { Acte01 } from "./acts/Acte01";
import { Acte02 } from "./acts/Acte02";
import { Acte03 } from "./acts/Acte03";
import { Acte04 } from "./acts/Acte04";
import { Acte05 } from "./acts/Acte05";
import { Acte06 } from "./acts/Acte06";
import { Acte07 } from "./acts/Acte07";
import { Acte08 } from "./acts/Acte08";
import { Acte08bis } from "./acts/Acte08bis";
import { Acte09 } from "./acts/Acte09";
import { Acte10 } from "./acts/Acte10";

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
  { key: "acte9", C: Acte09, name: "IX · Signature" },
  { key: "acte10", C: Acte10, name: "X · Merci" },
];

/** fenetre : [début, fin] en images du master — fondu de 3 images aux bords (utilisé par le cutdown) */
export const Master: React.FC<{ son?: boolean; fenetre?: [number, number] }> = ({ son = true, fenetre }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {son
      ? audio.pistes.map((p) => (
          <Audio
            key={p.src}
            src={staticFile(p.src)}
            volume={(fr) => (fenetre ? p.volume * Math.max(0, Math.min(1, (fr - fenetre[0]) / 3, (fenetre[1] - fr) / 3)) : p.volume)}
          />
        ))
      : null}
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
