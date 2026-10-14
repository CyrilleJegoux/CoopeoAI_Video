// Cutdown 30 s : mêmes composants que le master, extraits raccourcis (voir cutdown30 dans config.ts).
// Pas d'acte X (merci) dans le cutdown.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { cutdown30, f } from "./config";
import { Master } from "./Master";

export const DUREE_CUTDOWN = cutdown30.extraits.reduce((a, [, d]) => a + d, 0);

export const Cutdown30: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {cutdown30.extraits.map(([debut, duree], i) => {
        const from = f(t);
        t += duree;
        return (
          <Sequence key={i} from={from} durationInFrames={f(duree)} name={`extrait ${debut}s`}>
            <Sequence from={-f(debut)}>
              <Master fenetre={[f(debut), f(debut + duree)]} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
