# Écran de chargement après connexion

Écran affiché entre le clic sur « Se connecter » et l'arrivée sur le dashboard.

- Les 4 pastilles Coopeo font un tour complet en s'écartant, puis reviennent exactement au logo, en boucle (2,4 s).
- « Bonjour Cyrille » dans la police à empattements du site.
- Des messages défilent sous le titre, un par couleur Coopeo : factures (orange), marges (rose), production (vert), tableau de bord (bleu).
- Une barre de progression aux 4 couleurs.
- En bas : « Coopeo — votre copilote de gestion », comme sur la page de connexion.

## Pourquoi du code et pas une vidéo

- **Durée** : le chargement dure parfois 1 seconde, parfois 6. Une vidéo a une durée fixe ; l'animation, elle, tourne en boucle sans à-coup aussi longtemps qu'il le faut.
- **Poids** : une vidéo doit elle-même se télécharger, au moment précis où le site est déjà occupé à charger. L'animation pèse moins de 10 Ko (environ 2 Ko une fois compressée par le serveur) et s'affiche tout de suite.
- **Netteté** : nette sur tous les écrans, du téléphone au grand écran.
- **Personnalisation** : le prénom du client s'affiche dans le titre.
- **Accessibilité** : pour les personnes qui ont désactivé les animations dans leur système, les pastilles pulsent doucement au lieu de tourner.

`export/apercu-chargement.mp4` est seulement un aperçu filmé pour montrer le résultat. Ce n'est pas lui qu'on intègre.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `coopeo-loader.css` | Toute l'animation (couleurs, mouvements, textes) |
| `CoopeoLoader.tsx` | Le composant React prêt pour Lovable |
| `demo.html` | La page de démonstration : ouvre-la dans un navigateur pour voir l'animation en vrai |
| `export/apercu-chargement.mp4` | Aperçu vidéo de 8 secondes |

## Intégration avec Lovable

1. Copie `coopeo-loader.css` et `CoopeoLoader.tsx` dans le dossier `src/components/` de ton projet.
2. Donne ce message à Lovable :

```
J'ai ajouté src/components/CoopeoLoader.tsx et src/components/coopeo-loader.css.
Après la connexion, pendant le chargement des données du dashboard, affiche <CoopeoLoader prenom={prénom de l'utilisateur} /> en plein écran à la place de l'écran de chargement actuel.
Règles :
- ne l'affiche que si le chargement dure plus de 300 ms (pas de flash si c'est rapide) ;
- une fois affiché, garde-le au moins 1,2 seconde pour que l'animation ait le temps de se voir ;
- quand les données sont prêtes, passe leaving={true}, attends 350 ms, puis retire le composant ;
- ne modifie pas le fichier CSS.
```

3. Si les polices Fraunces et Inter ne sont pas déjà chargées dans l'application, ajoute dans `index.html` :

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

## Modifier

Tout se règle en haut de `coopeo-loader.css` :

- `--cl-s` : taille du symbole (92 px) ;
- `--cl-loop` : vitesse du tour des pastilles (2,4 s) ;
- `--cl-msg` : temps d'affichage de chaque message (1,8 s).

Les textes des messages sont dans `CoopeoLoader.tsx` (liste `MESSAGES`). Garde 4 messages : chacun est associé à une couleur.

Pour refaire l'aperçu vidéo : `node render.js` (Playwright et ffmpeg requis).
