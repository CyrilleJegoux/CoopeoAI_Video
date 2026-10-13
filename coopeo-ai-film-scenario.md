# Coopeo AI : scénario de production du film de lancement

> **Destinataire : Claude Code.** Ce document est le cahier des charges complet du film. Le fichier `STORYBOARD.html` en est la version visuelle (croquis de chaque plan + images finales) : ouvre-le et fais-en des captures pour visualiser les plans qui n'ont pas d'image de référence (actes II, III, IV, VIII). En cas de différence, **SCENARIO.md fait foi**. Il a été validé plan par plan avec Cyrille (fondateur de Coopeo). Les images du dossier `references/` montrent le niveau de finition attendu. Respecte-les : même lumière, mêmes couleurs, même typographie, même composition.

---

## 1. Mission

Produire un **vrai film de motion design** (pas un diaporama) de **2 min 15** qui :

1. rappelle d'où vient Coopeo (10 ans plus tôt : un classeur de factures saisies à la main) ;
2. montre la richesse actuelle de la plateforme ;
3. révèle par surprise les **10 ans de Coopeo** (on souffle les bougies) ;
4. fait exploser la révélation **Coopeo AI** ;
5. prouve la supériorité technique de Coopeo dans la lecture des factures (3 exemples concrets) ;
6. termine sur les gains réels pour les clients (cercle vertueux), la signature, puis un remerciement à l'équipe Coopeo.

Les trois émotions à faire ressentir, dans l'ordre : *Coopeo est déjà riche et puissant* → *tout se connecte, quelque chose de majeur se prépare* → *Coopeo AI ouvre une nouvelle dimension*.

**Prudence :** les fonctions IA montrées (actes VI à VIII bis) illustrent la vision produit. Ne rien ajouter qui les présente comme toutes disponibles aujourd'hui. Prévoir la mention de prudence (voir § 9).

---

## 2. Spécifications techniques

| Élément | Valeur |
|---|---|
| Outil | **Remotion** (React + TypeScript). SVG, Canvas ou WebGL pour les effets. |
| Format | 1920 × 1080, 16:9 |
| Cadence | 30 fps (60 fps possible ensuite, rendu deux fois plus long) |
| Durée master | **2:15** = 135 s = 4 050 images à 30 fps |
| Export | MP4 H.264, AAC 48 kHz, débit vidéo ≥ 12 Mb/s |
| Livrables | 1. master avec son · 2. master sans son · 3. cutdown 30 s avec son · 4. projet source · 5. `LISEZMOI.md` court (comment modifier textes, couleurs, timings) |
| Configuration | Tous les textes, chiffres, prénoms, couleurs et timings dans **un seul fichier** `src/config.ts`. Aucune donnée en dur dans les composants. |
| Grille de temps | Musique à **120 BPM** : 1 temps = 0,5 s = 15 images, 1 mesure = 2 s = 60 images. Les apparitions importantes tombent sur un temps. |

**Ne pas déclarer le film terminé tant qu'un MP4 n'a pas été rendu, puis vérifié** : extraire une image toutes les 5 s avec ffmpeg et les regarder, contrôler la durée et la présence de la piste audio.

---

## 3. Identité visuelle

### Logo (impératif)
- Fichiers dans `assets/` :
  - `logo-coopeo-blanc-officiel.png` : logo officiel blanc fourni par Coopeo (600 px de large).
  - `logo-coopeo-blanc-hd.png` : même logo en 1 261 px, lettres passées en blanc sans retouche de forme. À utiliser pour les grands formats.
  - `logo-coopeo-couleur.png` : version originale, lettres noires, pour un fond clair (fin alternative).
  - `symbole-coopeo.png` : les quatre pastilles seules.
- **Ne jamais redessiner ni réinterpréter le logo.** Pas de police qui imite le wordmark.
- **Coopeo AI** = le logo officiel + le mot « AI » posé à droite :
  - police Manrope ExtraBold (800), lettrage serré (-6 / 1000 em) ;
  - hauteur de capitale ≈ 1,13 × la hauteur des minuscules du wordmark ; ligne de base alignée sur celle du wordmark ;
  - espace entre le « o » final et le « A » ≈ 5 % de la largeur du logo. **Le « AI » ne touche jamais le logo** ;
  - remplissage en dégradé vertical `#E6FAFF → #7FD6FF → #3DB8FF → #2A7BFF`, halo bleu électrique doux.
  - Le code exact de cet assemblage est dans `sources-images/lib.js`, fonction `logoAI()`. Mesures du PNG 1261 × 324 : minuscules de y = 96 à y = 232, ligne de base y = 232.

### Couleurs
| Rôle | Hex |
|---|---|
| Rose (marges, pertes) | `#E01E6D` |
| Orange (achats, commandes) | `#F48C03` |
| Vert (production, stocks) | `#0CBF88` |
| Bleu (ventes, équipe) | `#129BE0` |
| Bleu électrique « AI » (uniquement à partir du BOOM) | `#3DB8FF`, clair `#BFF0FF` |
| Bleu nuit, fond | `#070D22` (dégradés radiaux vers `#13306F` au centre) |

### Typographie
- **Manrope** (400 à 800) pour tous les titres, interfaces et grands chiffres.
- **JetBrains Mono** uniquement pour les petits montants dans les tableaux et factures.
- Paquets npm : `@fontsource/manrope`, `@fontsource/jetbrains-mono`, `@fontsource/caveat` (écriture manuscrite de l'acte I).
- **Règle du symbole €** : jamais d'espace large avant le €. En police à chasse fixe, coller le € au chiffre, ou mettre le € en Manrope avec un petit écart (0,14 em). Les grands chiffres (≥ 26 px) sont toujours en Manrope avec `tabular-nums`.
- Texte minimum 36 px à l'écran pour tout ce qui doit être lu ; chiffres clés ≥ 80 px.

### Univers
Trois mondes, une seule caméra :
1. **L'artisanal** (acte I) : lumière chaude, bois, papier, écriture manuscrite, grain.
2. **Le SaaS premium** (actes II à V) : bleu nuit, cartes d'interface blanches, les quatre couleurs en accents.
3. **L'intelligence** (à partir du BOOM) : cartes en verre sombre `rgba(14,30,78,.8)`, liserés bleu électrique, connexions lumineuses.

Les données métier et les interfaces sont les protagonistes. **Interdits** : cerveaux, robots, puces électroniques, tout univers « IA générique ».

### Mouvement
- Chaque apparition de carte est différente : glissé 3D, masque de révélation, déroulé, éjection, impact.
- Courbes ressort (`spring`) pour les arrivées, accélérations exponentielles pour la convergence.
- Flou de mouvement sur les déplacements rapides, **jamais sur un texte à lire**.
- Interdits : fondus enchaînés systématiques, animations identiques, transitions lentes, texte illisible, flash blanc plein écran.
- Grain léger et vignettage sur toutes les images (voir `grain()` et `.vignette` dans les sources).

---

## 4. Données d'affichage (à mettre dans `config.ts`)

- **Équipe client** (la boulangerie) : Cathy (vente), Nico (fournil), Anthony, Dominique, Thierry, Julien.
- **Équipe Coopeo** (carton final uniquement, dans cet ordre, deux « Anthony » éloignés l'un de l'autre) : Carole, Aurore, Séverine, Rachel, Tristana, Sabine, Elodie, Laurent, Joël, Romain, Philippe, Thibault, Réda, Anthony, Brewal, Julien, Cédric, Erwan, Anthony, Cyrille.
- **Signature** : `« Détectez. Anticipez. Agissez. »` *(variable `signature`, choix final en attente ; alternatives : « Voir avant. Agir ensemble. », « Comprendre. Anticiper. Agir. »)*.
- **Ligne d'anniversaire** : « Depuis 10 ans à vos côtés ».
- Tous les montants ci-dessous ont été vérifiés. Ne pas les modifier sans recalculer.

---

## 5. Timeline du master (2:15)

| Acte | Début → fin | Contenu | Réf. image |
|---|---|---|---|
| I · Il y a 10 ans | 0:00 → 0:12 | Classeur, factures, tableur, envol | 01a, 01b, 02, 03 |
| II · Coopeo évolue | 0:12 → 0:18 | Logo, « Coopeo évolue. » | — |
| III · Le déferlement | 0:18 → 0:40 | 9 cartes fonctionnalités | 03 (style des cartes) |
| IV · L'équipe à bord | 0:40 → 0:52 | Cathy / Nico, toute l'équipe agit | — |
| V · Convergence et 10 bougies | 0:52 → 1:02 | Connexions → « 10 » → bougies → souffle | 04, 05, 06 |
| VI · BOOM | 1:02 → 1:06 | Impact, « AI » surgit, logo stabilisé | 07, 08, 09 |
| VII · Un nouveau coéquipier, le moindre détail | 1:06 → 1:50 | AI rejoint l'équipe, loupe, 3 exemples factures, scénarios, alertes, données + MCP | 12, 13a, 13b, 14a, 14b, 16a, 16b |
| VIII · Agir ensemble | 1:50 → 1:56 | Donnée → action, partage, « Résolution en cours » | — |
| VIII bis · Le cercle vertueux | 1:56 → 2:04 | Cercle vicieux qui s'inverse | 15a, 15b, 15c |
| IX · Signature | 2:04 → 2:12 | Coopeo AI + signature | 10 |
| X · Merci | 2:12 → 2:15 | 20 prénoms en constellation | 11 |

---

## 6. Plan par plan

Format : **timecode · plan** · ce qu'on voit · animation · texte à l'écran · son.

### Acte I · Il y a 10 ans (0:00 → 0:12)

**0:00 → 0:03 · F1 Le classeur** (réf. `01a-classeur.jpg`)
Vue de dessus, table en bois sombre, lumière chaude de lampe. Classeur bleu étiqueté « Factures » à la main, des factures qui débordent, d'autres en vrac autour, un post-it « à saisir avant vendredi », une trace de tasse.
Animation : très lente descente verticale de la caméra, poussière dans la lumière.
Texte : **« Il y a 10 ans. »** (fondu doux, seule exception autorisée au fondu).
Son : silence, horloge, froissement de papier ; pad feutré.

**0:03 → 0:06 · F1b On l'ouvre** (réf. `01b-classeur-ouvert.jpg`)
La couverture s'ouvre d'un geste (rotation 3D de la couverture autour de la reliure). Pile de factures en désordre, ligne « Beurre doux 82 % » surlignée en jaune, « vérifier prix ! » au stylo bleu, feuille de totaux recalculés et raturés, 4 intercalaires aux couleurs Coopeo.
Son : couverture cartonnée, claquement métallique du levier.

**0:06 → 0:10 · F2 La saisie** (réf. `02-tableur.jpg`)
Gros plan sur l'écran d'un portable : tableur générique (aucune marque de logiciel), fichier `factures_fournisseurs_v3_FINAL.xls`. Cellule F7 active : le curseur tape « 4,1 » puis « 2 ». Facture floue au premier plan.
Texte : **« Des factures papier. Tout à la main. »**
Son : frappe clavier. **Les touches deviennent le rythme** : elles se calent progressivement sur la grille 120 BPM.

**0:10 → 0:12 · F3 Le papier devient interface** (réf. `03-envol.jpg`)
Les cellules (« Farine T65 », « 0,71 € », « 4,12 € », « 25 kg »…) se détachent, s'envolent vers la droite avec des traînées colorées et se transforment en cartes Coopeo arrondies. La lumière chaude bascule vers le bleu nuit.
Son : whoosh montant. **Premier kick à 0:12 pile.**

### Acte II · Coopeo évolue (0:12 → 0:18)
Bleu nuit, arcs fins aux quatre couleurs qui traversent l'écran. Les quatre pastilles arrivent chacune de leur direction et forment le symbole ; le wordmark se révèle par masque de gauche à droite. Caméra qui avance lentement.
Texte : **« Coopeo évolue. »**
Son : impact léger, le beat s'installe.

### Acte III · Le déferlement (0:18 → 0:40)
Un seul espace 3D continu : la caméra voyage, les cartes arrivent de directions différentes, les cartes précédentes restent floues en profondeur. Une info clé par carte. Style des cartes : `03-envol.jpg` (cartes blanches, coins 28 px, pastille de couleur + titre).

| Temps | Carte | Contenu | Animation |
|---|---|---|---|
| 0:18 | Analyse des factures (orange) | **5 700 L** de crème liquide · **5 t** de beurre, achetés cette année | glissé 3D depuis la gauche, compteurs qui roulent |
| 0:21 | Fiches techniques (rose) | croissant dessiné trait par trait · « Mon croissant me coûte **0,37 €** » | compteur chiffre par chiffre |
| 0:24 | Mercuriales (orange) | une ligne de facture s'allume (Crème 35 % · 100 L · 5,12 € au lieu de 4,35 €) · « Le fournisseur A vous doit **77 €** » · « Erreur de facturation détectée » | zoom dans la facture, carte qui claque |
| 0:27 | Commandes (orange) | notification « Il manque du lait sur la livraison de ce matin » | arrivée en notification |
| 0:29 | Inventaires (vert) | « **1 zone** reste à compter », barre à 86 % | barre qui se remplit |
| 0:31 | Planning de production (vert) | lignes Pétrissage / Façonnage / Cuisson / Viennoiseries / Pâtisseries, créneaux colorés | créneaux posés un par un |
| 0:34 | Suivi des marges (rose) | courbe sur 12 mois, **+3,2 pts** | tracé d'un seul geste |
| 0:36 | Export comptable (vert) | fichier CSV éjecté hors de l'interface | éjection + rebond |
| 0:38 | Analyse des ventes (bleu) | barres achats / ventes / écarts | barres en cascade |

Vérification du chiffre 77 € : (5,12 − 4,35) × 100 L = 77,00 €.
Son : chaque carte a son propre son (ticks, scan, notification, bip, swoosh, pop). Densification progressive.

### Acte IV · L'équipe à bord (0:40 → 0:52)
**0:40 → 0:46.** Fil de discussion dans Coopeo : Cathy (vente) « **Rupture sur les baguettes !** » 10:24 → Nico (fournil) « Je relance une fournée de 40. » ✓ → indicateur « Pertes du jour **−12 %** ». Texte : **« Avant, l'info se perdait dans les groupes de discussion. »** (ne jamais citer WhatsApp ni aucune marque).
**0:46 → 0:52.** Les avatars C, N, A, D, T, J s'allument un par un ; chacun déclenche une micro-action (« Inventaire validé », « Commande passée », « Recette mise à jour ») ; une jauge globale monte. Texte : **« Chaque collaborateur fait avancer l'entreprise. »**
Son : notifications musicales accordées sur la tonalité du morceau.

### Acte V · Convergence et 10 bougies (0:52 → 1:02), la surprise
**0:52 → 0:57 · F12 Les connexions dessinent le « 10 »** (réf. `04-dix.jpg`)
Les cartes gravitent autour du centre. Des fils lumineux partent de chaque carte (Achats, Marges, Recettes, Inventaires, Commandes, Ventes, Production) et tissent un grand **« 10 »** épais aux quatre couleurs (effet de fils entrecroisés + trait principal brillant). Le tracé progresse avec une étincelle à sa tête.
Texte : **« Et si tout se connectait ? »**
Son : riser, roulement de caisse claire qui accélère.

**0:57 → 1:00 · F13 Les bougies s'allument** (réf. `05-bougies.jpg`)
Les cartes disparaissent. Dans le « 0 », **quatre flammes de bougie s'allument une à une, disposées exactement comme les 4 pastilles du logo** : rose en haut, orange à gauche, vert à droite, bleu en bas. Flammes réalistes qui vacillent (cœur blanc, contour coloré, racine bleutée, petite mèche).
Texte : **« 10 ans. »**
Son : 4 allumettes, la musique retombe sur une note tenue.

**1:00 → 1:02 · F13b On souffle** (réf. `06-souffle.jpg`)
**Silence ~0,5 s, on entend une inspiration.** Puis un souffle traverse l'écran de gauche à droite (traînées translucides) : les flammes se couchent, s'éteignent une à une, leur fumée colorée s'enroule vers le centre. Le « 10 » s'assombrit.
Son : inspiration, souffle. **Le souffle déclenche le BOOM.**

### Acte VI · BOOM Coopeo AI (1:02 → 1:06), moment signature
**1:02 · F14a L'impact** (réf. `07-impact.jpg`) : la fumée s'embrase, cœur lumineux blanc-bleu (pas de blanc plein écran), 4 anneaux d'onde de choc rose / orange / vert / bleu, rayons fins, étincelles, spirales. Léger tremblement de caméra (4 à 6 images).
**1:03 · F14b « AI » surgit** (réf. `08-ai-surgit.jpg`) : le logo officiel est déjà en place, net. « AI » arrive à droite : aberration chromatique rose / cyan pendant 3 images, balayage lumineux en diagonale, reflet horizontal, rebond court.
**1:04,5 · F14c Stabilisation** (réf. `09-coopeo-ai.jpg`) : Coopeo AI parfaitement net, halo doux, arcs discrets aux 4 couleurs.
Son : **impact cinématique + sub drop pile sur l'image du flash**, puis scintillement électrique.

### Acte VII · Un nouveau coéquipier, le moindre détail (1:06 → 1:50)

**1:06 → 1:10 · F15 Il rejoint l'équipe.** Les avatars Cathy, Nico, Anthony, Dominique, Thierry, Julien alignés ; une nouvelle place s'allume en bleu électrique : « AI ». Texte : **« Un nouveau membre dans l'équipe. »** puis « Il voit tout, avant tout le monde. »

**1:10 → 1:15 · F16 La loupe** (réf. `12-loupe.jpg`)
Facture Crèmerie B n° 4812 (16 lignes, total HT 919,33 €, TVA 5,5 % 50,56 €, TTC 969,89 €). Une loupe bleu électrique descend ligne par ligne ; chaque ligne vérifiée reçoit un ✓ bleu. Elle s'arrête sur la **ligne 14, Beurre AOP 82 %, 25 kg** ; le prix **8,40 €** grossi en rose. Un fil relie la loupe à la carte Coopeo AI : prix facturé 8,40 €/kg, prix négocié 7,90 €/kg, 25 kg, **+12,50 € à récupérer**, bouton « Signaler au fournisseur ».
Texte : **« Le moindre détail. »**
*(Clin d'œil : le beurre valait 4,12 € dans le tableur de l'acte I.)*

**1:15 → 1:19 · F16b Trois libellés, un seul produit** (réf. `13a-libelles.jpg`)
Trois factures de trois fournisseurs (Hygiène Pro A, Distri Emballage B, CHR Fournitures C). Lignes surlignées : « EM Bob 2P 450F » 24 pièces à 2,15 € · « Bobine 450 feuilles 2 plis » 30 rouleaux à 1,98 € · « Essuie Main 450 - 2P x 6 » 5 cartons à 11,40 €. Sous chacune, une pastille IA : « 1 pièce = 1 rouleau · 2,15 €/rouleau », « 1 rouleau · 1,98 €/rouleau », « 1 carton = 6 rouleaux · 11,40 / 6 = 1,90 € ». Les trois flux convergent vers un point lumineux.
Texte : **« Trois libellés. Un seul produit. »**

**1:19 → 1:23 · F16c Même produit, vrai prix** (réf. `13b-fusion.jpg`)
Fiche « Essuie-mains en bobine · 450 feuilles · 2 plis », 3 libellés reconnus, barres de prix au rouleau (proportionnelles) : C 1,90 € (vert), B 1,98 €, A 2,15 € (rose). **« +13 % payés en trop chez Hygiène Pro A pour exactement le même produit. »**
Texte : **« Même produit. Vrai prix. »**
Vérification : 2,15 / 1,90 = 1,1316, soit +13 %.

**1:23 → 1:27 · F16d Lire ce qui n'est pas écrit** (réf. `14a-boissons.jpg`)
Facture de grossiste en boissons, **reconstituée fidèlement et anonymisée** (fournisseur, client, marques et références masqués par ●●●). Colonnes : Désignation article · Colis · Cols · P.U.HTT · Base · Remise · Droits · Montant net HT · Consignes P.U. · Consignes Montant · Code TVA. Coopeo AI encadre les deux lignes « WHISKY BLEND 40° (6) 100CL » (3 achetées + 1 avec remise 100 %). Trois pastilles : « 40° · 100 cl lus dans le libellé → 0,40 L d'alcool pur » · « Vignette Sécurité sociale non facturée sur la ligne · 2,482 € » · « Gratuité détectée · 3 achetées + 1 offerte ».
Texte : **« Lire ce qui n'est pas écrit. »**

**1:27 → 1:31 · F16e Le vrai prix, au centime près** (réf. `14b-cout-reel.jpg`)
Calcul qui se construit ligne par ligne avec une barre empilée :
P.U.HTT **16,283 €** + droits d'accise **7,730 €** (1 932,42 €/hl AP × 0,004 hl) + vignette Sécurité sociale **2,482 €** (620,47 €/hl AP × 0,004 hl) = **26,49 € par bouteille**. Encarts : « Prix affiché sur la ligne 16,28 € · +63 % entre prix affiché et coût réel » ; « Avec la bouteille offerte (droits et vignette restent dus) : **22,42 €** coût moyen réel ».
Texte : **« Le vrai prix, au centime près. »**
Vérifications : 16,283 + 7,72968 + 2,48188 = 26,49 € ; (3 × 26,49488 + 7,730 + 2,48188) / 4 = 22,42 € ; taux 2026 de la douane.

**1:31 → 1:35 · F16f Les taxes en bas de facture** (réf. `16a-taxes-facture.jpg`)
Facture de grossiste en viandes, anonymisée. Lignes : Suprême poulet 10,348 kg × 7,85 = 81,23 · Saucisse Francfort 0,605 × 7,70 = 4,66 · Entrecôte pièce 9,105 × 22,90 = 208,50 · Ris de veau 0,825 × 24,50 = 20,21 · Pavé onglet 5,665 × 20,50 = 116,13 · Filet de bœuf 7,245 × 21,50 = 155,77. Bloc « Taxe » en bas : R.S.D. 0,002 €/kg · Interbev bovins 0,1197 · Interbev veau 0,0749 · Inaporc 0,023. Coopeo AI encadre le bloc ; chaque taxe envoie un fil de sa couleur vers ses lignes : **bovins → bœuf, veau → veau, Inaporc → porc, R.S.D. → veau et porc uniquement** (71,491 kg = 19,975 kg de veau + 51,516 kg de porc).
Texte : **« Taxes en bas de facture ? »** et « Coopeo AI les ventile sur chaque ligne produit, au kilo près. »

**1:35 → 1:39 · F16g Chaque taxe, à sa place** (réf. `16b-taxes-ventilees.jpg`)
Vue d'analyse Coopeo : Produit · Poids · P.U. facturé · Taxe ventilée · P.U. réel · Total HT réel. Poulet aucune taxe → 81,23 € · Saucisse +0,025 €/kg → 7,725 € → 4,67 € · Entrecôte +0,1197 → 23,020 € → 209,59 € · Ris de veau +0,0769 → 24,577 € → 20,28 € · Onglet +0,1197 → 20,620 € → 116,81 € · Filet +0,1197 → 21,620 € → 156,63 €. Les pastilles de taxe se posent une à une en cascade.
Texte : **« Chaque taxe, à sa place. »**

**1:39 → 1:43 · F17 Prendre du recul, prévoir.** Dézoom rapide de la ligne de facture vers la vue d'ensemble. Courbe de marge du croissant qui se divise en 3 scénarios : A prix stable · B beurre +3 % · C beurre +6 % → marge 71 %, sous le seuil de 75 % (ligne pointillée).

**1:43 → 1:47 · F18 Les alertes du jour.** Quatre alertes tombent une par une, chacune reliée par un fil à la carte de l'acte III d'où elle vient : « 4 fortes variations de prix détectées » · « Le croissant est passé sous les 75 % de marge » · « La commande de jeudi n'a pas été passée » · « Attention aux ruptures en début d'après-midi ».

**1:47 → 1:50 · F19 Ce qui le rend unique.** Deux flux fusionnent dans le noyau « AI » : « 10 ans de données métier » + « Vos données ». Badge discret « Connecté à vos outils · MCP ».

### Acte VIII · Agir ensemble (1:50 → 1:56)
Chaîne qui se construit : Donnée → Analyse → Alerte → Recommandation → **Action**. Une alerte est partagée avec l'équipe, assignée à Nico (« Relancer le fournisseur A »), statut « **Résolution en cours** ».
*(Les mots « Détecter. Comprendre. Anticiper. Agir ensemble. » sont supprimés : le cercle vertueux les remplace.)*

### Acte VIII bis · Le cercle vertueux (1:56 → 2:04)
**1:56 → 1:59 · Le cercle vicieux** (réf. `15a-cercle-vicieux.jpg`) : fond éteint, couleurs ternes, cercle qui tourne **dans le sens inverse des aiguilles d'une montre** : Travail dans l'urgence → Turn-over → Baisse du chiffre d'affaires → Baisse de marge → Pertes. Centre : « Sans visibilité, tout s'enchaîne. » Texte : **« Le cercle vicieux. »**
**1:59 → 2:01 · On inverse le sens** (réf. `15b-cercle-inverse.jpg`) : le symbole Coopeo AI s'allume au centre, le cercle freine, s'arrête, repart **dans le sens des aiguilles d'une montre**. Chaque terme négatif se raye et se dissout ; le terme positif apparaît **au même endroit** : urgence → Qualité de travail · pertes → Moins de pertes · baisse de marge → Marge · baisse du CA → Rentabilité · turn-over → Cohésion d'équipe. Texte : **« Et si on inversait le sens ? »**
**2:01 → 2:04 · Le cercle vertueux** (réf. `15c-cercle-vertueux.jpg`) : le cercle tourne à pleine vitesse aux 4 couleurs, flèches lumineuses. Texte : **« Le cercle vertueux. »**

### Acte IX · Signature (2:04 → 2:12) (réf. `10-signature.jpg`)
Tout s'efface. Logo Coopeo AI au centre sur bleu nuit, arcs discrets aux 4 couleurs. « DEPUIS 10 ANS À VOS CÔTÉS » (JetBrains Mono, espacé), puis la signature (variable `signature`). Mention de prudence discrète en bas (voir § 9). Le logo respire une fois sur le dernier temps.
**Fin alternative** (composition séparée `FinDashboard`) : le logo glisse en haut à gauche et devient l'en-tête d'un tableau de bord clair (logo couleur), les blocs se posent pour enchaîner sur une vraie capture produit.

### Acte X · Merci (2:12 → 2:15) (réf. `11-merci.jpg`)
Symbole Coopeo, « **Merci à celles et ceux qui ont construit Coopeo.** », 20 prénoms en constellation reliés par des fils aux 4 couleurs ; ils s'allument un à un rapidement. **Uniquement dans le master**, pas dans le cutdown.

---

## 7. Musique et sound design

**Musique originale générée par code** (pas de morceau existant, pas de banque de sons sous licence douteuse). Style : électro cinématique, future bass léger, percussions précises, son publicitaire premium. 120 BPM. Tonalité mineure (ex. fa mineur : Fm – D♭ – A♭ – E♭). Sortie : `public/audio/musique.wav` + `public/audio/sfx.wav` mixés ensemble pour le master. Prévoir aussi la possibilité de remplacer la piste par un morceau sous licence (tout est calé sur la grille).

| Temps | Musique | Effets synchronisés |
|---|---|---|
| 0:00 → 0:06 | pad feutré, presque rien | horloge, papier, couverture, levier |
| 0:06 → 0:12 | les frappes clavier deviennent le rythme, filtre qui s'ouvre | frappe clavier, whoosh à 0:10 |
| **0:12** | **premier kick** | impact léger (logo) |
| 0:18 → 0:40 | groove plein : kick, clap, charleston, basse, arpèges | un son différent par carte, sur le temps |
| 0:40 → 0:52 | variante plus légère, plus mélodique | notifications accordées |
| 0:52 → 0:57 | montée : riser + roulement qui accélère | — |
| 0:57 → 1:00 | tout retombe sur une note tenue | 4 allumettes |
| **1:00 → 1:00,5** | **silence** | **inspiration** |
| 1:00,5 → 1:02 | — | souffle |
| **1:02** | **impact cinématique + sub drop** | flash, tremblement |
| 1:03 | accords qui s'ouvrent | scintillement électrique (AI) |
| 1:06 → 1:50 | drop complet, accords « future bass » avec sidechain ; plus léger sous les exemples de factures | scans, verrouillages, fils lumineux. **Accents** sur 8,40 € (≈1:13), +13 % (≈1:21), 26,49 € (≈1:29), ventilation (≈1:37) |
| 1:50 → 1:56 | montée | clics d'action, envoi |
| 1:56 → 1:59 | basse sourde, tempo qui ralentit | — |
| 1:59 → 2:01 | frein, puis reprise | whoosh inversé |
| 2:01 → 2:04 | pleine puissance | — |
| 2:04 → 2:12 | **motif signature de 4 notes** | dernier coup sur la respiration du logo |
| 2:12 → 2:15 | queue de réverbération douce | scintillements légers |

Le film doit rester compréhensible **sans le son** : tous les messages passent par le texte à l'écran.

---

## 8. Cutdown 30 s

Composition séparée `Cutdown30`, mêmes composants avec des durées raccourcies :

| Temps | Contenu |
|---|---|
| 0:00 → 0:02 | logo, « Coopeo évolue. » |
| 0:02 → 0:10 | déferlement accéléré (factures, croissant, 77 €, planning, marges) |
| 0:10 → 0:15 | connexions → « 10 » → bougies → souffle |
| 0:15 → 0:18 | BOOM, Coopeo AI |
| 0:18 → 0:24 | loupe (8,40 €) puis 26,49 € (coût réel whisky) |
| 0:24 → 0:27 | cercle vertueux (bref) |
| 0:27 → 0:30 | signature |

---

## 9. Points ouverts (variables dans `config.ts`)

- `signature` : texte de la signature finale (choix en attente).
- `mentionPrudence` : `true` par défaut. Texte : « Fonctionnalités Coopeo AI en déploiement progressif. » (petit, en bas de la signature).
- `anthonyInitiales` : possibilité d'ajouter une initiale pour distinguer les deux Anthony.

---

## 10. Méthode de travail attendue

1. Lire ce document et regarder **toutes** les images de `references/`.
2. Initialiser le projet Remotion, installer les polices, créer `config.ts`.
3. Construire acte par acte. Après chaque acte : rendre 3 ou 4 images fixes (`npx remotion still`) et les comparer aux références.
4. Générer la musique et les effets à partir de la table du § 7, calés sur la grille.
5. Rendre le master, la version sans son (ffmpeg `-an`) et le cutdown.
6. Vérifier : durée, piste audio, une image toutes les 5 s, lisibilité des textes, absence de chevauchement avec le logo.
7. Écrire `LISEZMOI.md` : où changer textes, couleurs, prénoms et timings.

Les fichiers de `sources-images/` sont le code HTML / Canvas qui a produit les images de référence. **Réutilise-les directement** : fonctions `logoAI()`, `drawFlame()`, `strokeTen()`, `grain()`, `invoiceHTML()`, le cercle (`circle.js`), l'explosion (`boom.js`), le « 10 » (`ten.js`).
