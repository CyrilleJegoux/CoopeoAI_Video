import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { f, timeline } from "./config";
import { Acte01 } from "./acts/Acte01";
import { Acte02 } from "./acts/Acte02";
import { Acte03 } from "./acts/Acte03";

type Act = { key: keyof typeof timeline; C: React.FC; name: string };
export const ACTES: Act[] = [
  { key: "acte1", C: Acte01, name: "I · Il y a 10 ans" },
  { key: "acte2", C: Acte02, name: "II · Coopeo évolue" },
  { key: "acte3", C: Acte03, name: "III · Le déferlement" },
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
