import React from "react";
import { Composition } from "remotion";
import { DUREE_MASTER, f, FPS, HEIGHT, timeline, WIDTH } from "./config";
import { loadFonts } from "./lib/fonts";
import { ACTES, Master } from "./Master";
import { Cutdown30, DUREE_CUTDOWN } from "./Cutdown30";
import { FinDashboard } from "./FinDashboard";
import { finDashboard } from "./config";

loadFonts();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Master" component={Master} durationInFrames={f(DUREE_MASTER)} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Cutdown30" component={Cutdown30} durationInFrames={f(DUREE_CUTDOWN)} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="FinDashboard" component={FinDashboard} durationInFrames={f(finDashboard.duree)} fps={FPS} width={WIDTH} height={HEIGHT} />
    {ACTES.map(({ key, C }) => (
      <Composition
        key={key}
        id={key.replace("acte", "Acte")}
        component={C}
        durationInFrames={f(timeline[key].end - timeline[key].start)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
