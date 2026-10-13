# Comment lancer le film avec Claude Code

## Contenu du dossier
- `SCENARIO.md` : le cahier des charges complet, plan par plan (2 min 15).
- `STORYBOARD.html` : le storyboard visuel (croquis de chaque plan + images finales). S'ouvre dans un navigateur.
- `references/` : les 22 images de référence en qualité finale.
- `assets/` : les logos officiels.
- `sources-images/` : le code qui a fabriqué les images de référence, réutilisable par Claude Code.

## Étapes
1. Décompresse ce dossier dans un dossier vide, par exemple `coopeo-ai-film`.
2. Ouvre Claude Code dans ce dossier.
3. Colle le message ci-dessous.

## Premier message à envoyer à Claude Code

```
Lis entièrement SCENARIO.md et regarde toutes les images du dossier references/.
Ta mission : produire le film Coopeo AI décrit dans SCENARIO.md avec Remotion.
Réutilise le code de sources-images/ et les logos de assets/ (ne redessine jamais le logo).
Travaille acte par acte : après chaque acte, rends 3 ou 4 images fixes, compare-les
aux références et montre-les-moi avant de passer à l'acte suivant.
Ne déclare pas le film terminé tant que le MP4 n'est pas rendu et vérifié.
```

## Conseils
- Fais valider chaque acte avant de passer au suivant : c'est plus rapide que de tout corriger à la fin.
- Pour changer un texte, un prénom ou un chiffre plus tard, demande simplement à Claude Code de modifier `config.ts`.
- Le rendu final peut prendre du temps (environ 4 000 images). Lance-le quand tout est validé.
