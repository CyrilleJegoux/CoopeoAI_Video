# Vidéo « Nouveauté » pour la popup du dashboard

Animation de 8 secondes, aux couleurs Coopeo, pour le panneau gauche de la popup qui annonce une nouvelle fonctionnalité.
Elle est générique : la même vidéo sert pour toutes les annonces, le texte de la popup change.

## Les fichiers à utiliser (dossier `export/`)

| Fichier | Rôle | Poids |
|---|---|---|
| `coopeo-nouveaute.webm` | Vidéo, format le plus léger (Chrome, Firefox, Edge) | ~145 Ko |
| `coopeo-nouveaute.mp4` | Même vidéo, format compatible partout (Safari, iPhone) | ~170 Ko |
| `coopeo-nouveaute-poster.webp` | Image fixe affichée pendant le chargement | ~10 Ko |

Format : 560 × 700 px (portrait 4:5, net sur écran Retina pour un panneau de 280 px de large), 30 images/s, sans son.

La vidéo se joue une fois puis reste figée sur sa dernière image (logo + « Nouveauté »), qui est propre.
Pour la faire tourner en boucle, il suffit d'ajouter `loop` sur la balise vidéo.

## Intégration avec Lovable

1. Mets les 3 fichiers de `export/` dans le dossier `public/videos/` de ton projet.
2. Donne ce message à Lovable :

```
Dans la popup « Nouveauté » du dashboard, remplace le visuel du panneau de gauche par cette vidéo :
<video autoPlay muted playsInline preload="auto" poster="/videos/coopeo-nouveaute-poster.webp"
       className="w-full h-full object-cover">
  <source src="/videos/coopeo-nouveaute.webm" type="video/webm" />
  <source src="/videos/coopeo-nouveaute.mp4" type="video/mp4" />
</video>
Le panneau garde un ratio 4:5 et un fond #070D22. Ne pas ajouter de contrôles de lecture.
```

`muted` et `playsInline` sont indispensables : sans eux, les navigateurs (surtout sur iPhone) bloquent la lecture automatique.

## Aperçu

Ouvre `apercu-popup.html` dans un navigateur : c'est une maquette de la popup avec la vidéo en place.

## Modifier l'animation

- L'animation est dans `src/index.html` (HTML + JavaScript). Ouvrir ce fichier dans un navigateur la joue en boucle.
- Les pastilles sont découpées dans le symbole officiel (`assets/symbole-coopeo.png`), le logo n'est pas redessiné.
- Pour régénérer les vidéos :

```bash
npm install
node render.js
```

`node render.js 1.5 3 8` produit seulement des images fixes à ces instants (en secondes), pour vérifier un moment précis.
