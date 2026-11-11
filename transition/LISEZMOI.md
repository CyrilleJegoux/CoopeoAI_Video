# Transition connexion → dashboard

Le film `export/transition-connexion-dashboard.mp4` (8 s) montre la transition complète, construite à partir des vraies captures de Coopeo :

1. **Clic sur « Se connecter »** : le bouton s'enfonce, son texte s'efface et il se replie en pastille orange.
   Tant que le serveur vérifie l'email et le mot de passe, la pastille respire doucement et émet une onde : le client voit tout de suite que ça travaille. Dans le film, cette attente dure 1 seconde ; dans l'application, elle dure le temps réel de la vérification.
2. **Ouverture** : l'écran de chargement s'ouvre en cercle depuis le bouton, souligné d'un liseré bleuté. La page de connexion recule légèrement et se floute. Les 4 pastilles Coopeo sortent du bouton en tournoyant et vont se placer au centre.
3. **Chargement** : « Bonjour Cyrille », les messages qui défilent, les pastilles qui tournent (c'est l'écran du dossier `chargement/`).
4. **Arrivée** : les pastilles rapetissent et filent en arc se poser exactement sur le logo de la barre latérale. Pendant ce temps, la barre latérale glisse depuis la gauche et les blocs du dashboard montent un par un. Une petite onde marque l'atterrissage sur le logo.

Le film sert à montrer et valider l'idée. Dans l'application, la transition est faite par du code (dossier `chargement/`), pas par une vidéo : elle s'adapte à la durée réelle du chargement et à la taille de l'écran.

## Intégration avec Lovable

1. Copie ces 3 fichiers du dossier `chargement/` dans `src/components/` (remplace les anciens s'ils y sont déjà) :
   - `CoopeoLoader.tsx`
   - `coopeo-loader.css`
   - `coopeo-transition.ts`
2. Donne ce message à Lovable :

```
J'ai ajouté dans src/components : CoopeoLoader.tsx, coopeo-loader.css et coopeo-transition.ts. Ne modifie pas ces 3 fichiers.
Mets en place la transition connexion → dashboard :

1. Page de connexion : au clic sur « Se connecter », appelle
   const annuler = lancerConnexion(bouton)   (import depuis src/components/coopeo-transition)
   avec l'élément HTML du bouton. Si la connexion échoue, appelle annuler() avant d'afficher l'erreur.

2. Dès que la connexion réussit, affiche <CoopeoLoader prenom={prénom de l'utilisateur} /> en plein écran,
   au niveau de l'application (il doit rester affiché pendant le changement de page).

3. Quand les données du dashboard sont chargées :
   - affiche le dashboard normalement, SOUS le CoopeoLoader (le loader reste par-dessus) ;
   - passe leaving={true} au CoopeoLoader ;
   - retire le CoopeoLoader quand il appelle onDone.

4. Dans le dashboard :
   - ajoute l'attribut data-coopeo-logo sur l'image du symbole Coopeo (les 4 pastilles seules, sans le mot « Coopeo ») en haut de la barre latérale ;
   - ajoute data-reveal="gauche" sur la barre latérale ;
   - ajoute data-reveal sur chacun des blocs principaux, dans l'ordre d'affichage : la carte d'en-tête (Bonjour, établissement, période, forfait), « Bien démarrer avec Coopeo », « Votre utilisation de Coopeo », « Vos factures », le titre « Mon dashboard », « Votre activité ».
```

## Bon à savoir

- **Si la connexion échoue** (mauvais mot de passe), `annuler()` remet le bouton exactement dans son état normal et retire l'onde.
- **Si le symbole de la barre latérale n'est pas trouvé** (attribut oublié, page mobile sans barre latérale), l'écran de chargement s'efface en simple fondu : rien ne casse.
- **Accès direct au dashboard** (page rechargée, lien favori) : il n'y a pas de bouton, donc pas d'ouverture en cercle. L'écran de chargement apparaît en fondu, puis la fin de la transition se joue normalement.
- **Personnes qui ont désactivé les animations dans leur système** : pas de mouvement, uniquement des fondus.
- Les pastilles attendent d'être revenues en position de logo avant de partir vers la barre latérale : au maximum 2 secondes d'attente, souvent beaucoup moins.

## Refaire le film

Le film est construit à partir des captures découpées dans `film/img/`. L'animation est dans `film/index.html` (l'ouvrir dans un navigateur la joue en boucle). Pour regénérer la vidéo :

```bash
cd transition/film
node render.js
```

`node render.js 1 4.5 5.2` produit seulement des images fixes à ces instants (en secondes).
