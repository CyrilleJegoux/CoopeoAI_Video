# Film Coopeo AI — projet Remotion

Film de lancement de 2 min 15 (1920 × 1080, 30 images/s), construit avec Remotion d'après `SCENARIO.md`.

## Les fichiers rendus (dossier `rendu/`)

| Fichier | Contenu |
|---|---|
| `coopeo-ai-master.mp4` | Le film complet avec le son (H.264 + AAC, moins de 95 Mo) |
| `coopeo-ai-master-sans-son.mp4` | Le même film sans piste audio |
| `coopeo-ai-cutdown-30s.mp4` | La version courte de 30 s (sans le merci final) |
| `coopeo-ai-fin-dashboard.mp4` | La fin alternative : le logo devient l'en-tête d'un tableau de bord clair |
| `stills/` | Les images de contrôle de chaque acte (référence à gauche, rendu à droite) |

## Modifier le film : tout est dans `src/config.ts`

Ouvrez `src/config.ts`. Chaque acte a son bloc, avec des noms en français.

- **Textes** : par exemple `signature` (la phrase finale), `ligneAnniversaire`, `acte2.texte`, `acte7.loupe.texte`…
- **Mention de prudence** : `mentionPrudence` (`true` ou `false`) et `texteMentionPrudence`.
- **Prénoms** : `equipeClient` (la boulangerie, actes IV, VII, VIII) et `equipeCoopeo` (le merci final, dans l'ordre d'affichage).
  Pour distinguer les deux Anthony : `anthonyInitiales: ["Anthony B.", "Anthony R."]`.
- **Chiffres** : chaque montant est à côté du calcul qui le vérifie (77 €, 12,50 €, +13 %, 26,49 €, 22,42 €, taxes…).
  Si vous changez un chiffre, recalculez ceux qui en dépendent.
- **Couleurs** : bloc `colors` en haut du fichier.
- **Timings** : `timeline` donne le début et la fin de chaque acte (en secondes) ; chaque acte a ensuite ses
  propres instants. La musique est à 120 BPM : 1 temps = 0,5 s, 1 mesure = 2 s. Gardez les moments importants
  sur un multiple de 0,5 s.
- **Cutdown 30 s** : `cutdown30.extraits` liste les passages du master utilisés (début, durée).
- **Son** : `audio.pistes`. Pour un morceau sous licence, voir le commentaire dans le fichier.

Le logo n'est jamais redessiné : il vient des PNG officiels de `public/assets/` (copies de `assets/`).

## Voir et refaire le film

Prérequis : Node 18 ou plus, ffmpeg.

```bash
npm install
npm run audio      # génère la musique et les effets (public/audio/*.wav)
npm run studio     # aperçu interactif dans le navigateur
npm run film       # son + rendu du master + encodage < 95 Mo + version sans son + cutdown
npm run render:fin # fin alternative (FinDashboard)
```

Une image fixe d'un instant précis : `scripts/stills.sh out/stills 62.3` (temps en secondes).
Vérifier un MP4 (durée, piste audio, planche d'une image toutes les 5 s) : `scripts/verify.sh rendu/coopeo-ai-master.mp4`.

Si Remotion ne peut pas télécharger son navigateur, `remotion.config.ts` utilise automatiquement le Chromium
déjà installé (`/opt/pw-browsers/...`) quand il existe.

## Organisation du code

- `src/config.ts` : toutes les données du film.
- `src/acts/` : un fichier par acte (`Acte01.tsx` … `Acte10.tsx`, `Acte08bis.tsx`).
- `src/lib/` : éléments communs repris de `sources-images/` (logo + « AI », flammes, « 10 », factures papier,
  cartes, grain, vignettage).
- `src/Master.tsx`, `src/Cutdown30.tsx`, `src/FinDashboard.tsx` : les trois compositions.
- `scripts/generate-audio.ts` : musique et effets générés par code (aucun son externe), calés sur `config.ts`.
