import React from "react";
import { Composition } from "remotion";
import { DUREE_MASTER, f, FPS, HEIGHT, timeline, WIDTH } from "./config";
import { loadFonts } from "./lib/fonts";
import { ACTES, Master } from "./Master";

loadFonts();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Master" component={Master} durationInFrames={f(DUREE_MASTER)} fps={FPS} width={WIDTH} height={HEIGHT} />
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
