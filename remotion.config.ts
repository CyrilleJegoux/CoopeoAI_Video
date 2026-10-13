import { Config } from "@remotion/cli/config";
import fs from "fs";

// Utilise le Chromium déjà installé dans l'environnement s'il existe
// (sinon Remotion télécharge son propre navigateur).
const LOCAL_SHELL =
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (fs.existsSync(LOCAL_SHELL)) {
  Config.setBrowserExecutable(LOCAL_SHELL);
}

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer("swangle");
