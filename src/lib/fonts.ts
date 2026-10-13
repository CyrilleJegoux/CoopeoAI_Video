import { continueRender, delayRender, staticFile } from "remotion";

// Polices locales (copiées depuis @fontsource dans public/fonts).
// Familles identiques à sources-images/ : "Manrope", "JBM" (JetBrains Mono), "Caveat".
const FONTS: [string, number, string][] = [
  ["Manrope", 400, "manrope-latin-400-normal.woff2"],
  ["Manrope", 500, "manrope-latin-500-normal.woff2"],
  ["Manrope", 600, "manrope-latin-600-normal.woff2"],
  ["Manrope", 700, "manrope-latin-700-normal.woff2"],
  ["Manrope", 800, "manrope-latin-800-normal.woff2"],
  ["JBM", 400, "jetbrains-mono-latin-400-normal.woff2"],
  ["JBM", 600, "jetbrains-mono-latin-600-normal.woff2"],
  ["JBM", 700, "jetbrains-mono-latin-700-normal.woff2"],
  ["Caveat", 500, "caveat-latin-500-normal.woff2"],
  ["Caveat", 700, "caveat-latin-700-normal.woff2"],
];

let started = false;
export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("Chargement des polices");
  Promise.all(
    FONTS.map(([family, weight, file]) =>
      new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format("woff2")`, {
        weight: String(weight),
      })
        .load()
        .then((face) => {
          document.fonts.add(face);
        }),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
