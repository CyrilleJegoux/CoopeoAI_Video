# Sources des images de référence

Pages HTML 1920×1080 (HTML + Canvas) qui ont produit les images de `references/`.

Pour les rendre :
1. `npm i @fontsource/manrope @fontsource/jetbrains-mono @fontsource/caveat playwright`
2. Copier `../assets/logo-coopeo-blanc-hd.png` en `logo-coopeo-white.png` et `../assets/symbole-coopeo.png` en `symbole.png` dans ce dossier.
3. Ouvrir chaque page dans Chromium à 1920×1080 et faire une capture (voir `render.js`).

Fichiers communs : `base.css` (polices, grain, vignettage), `ai.css` (cartes « verre » Coopeo AI), `lib.js` (logo + AI, flammes, « 10 », grain, règle du €), `paper.js` (factures papier), `ten.js` (le « 10 »), `boom.js` (BOOM, signature), `circle.js` (cercle vicieux / vertueux).
