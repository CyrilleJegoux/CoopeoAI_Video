// ============================================================================
//  COOPEO AI · FILM DE LANCEMENT · FICHIER DE CONFIGURATION UNIQUE
//  Tous les textes, chiffres, prénoms, couleurs et timings du film sont ici.
//  Les timings sont en SECONDES (converties en images à 30 fps).
//  Grille musicale : 120 BPM → 1 temps = 0,5 s, 1 mesure = 2 s.
// ============================================================================

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const BPM = 120;
export const BEAT = 60 / BPM; // 0,5 s

/** secondes → images */
export const f = (sec: number) => Math.round(sec * FPS);

// ---------------------------------------------------------------- Couleurs
export const colors = {
  pink: "#E01E6D", // marges, pertes
  orange: "#F48C03", // achats, commandes
  green: "#0CBF88", // production, stocks
  blue: "#129BE0", // ventes, équipe
  electric: "#3DB8FF", // « AI », uniquement à partir du BOOM
  electricHot: "#BFF0FF",
  night: "#070D22",
  nightCenter: "#13306F",
  glass: "rgba(14,30,78,.80)",
  aiGradient: ["#E6FAFF", "#7FD6FF", "#3DB8FF", "#2A7BFF"],
};
/** Ordre des pastilles du logo : rose en haut, orange à gauche, vert à droite, bleu en bas */
export const logoDots = [colors.pink, colors.orange, colors.green, colors.blue];

// ---------------------------------------------------------------- Textes clés
export const signature = "Détectez. Anticipez. Agissez.";
// Alternatives : « Voir avant. Agir ensemble. », « Comprendre. Anticiper. Agir. »
export const ligneAnniversaire = "Depuis 10 ans à vos côtés";
export const mentionPrudence = true;
export const texteMentionPrudence =
  "Fonctionnalités Coopeo AI en déploiement progressif.";
export const anthonyInitiales: [string, string] = ["", ""]; // ex. ["Anthony B.", "Anthony R."]

// ---------------------------------------------------------------- Équipes
export const equipeClient = [
  { nom: "Cathy", role: "vente", initiale: "C", couleur: colors.blue },
  { nom: "Nico", role: "fournil", initiale: "N", couleur: colors.orange },
  { nom: "Anthony", role: "", initiale: "A", couleur: colors.green },
  { nom: "Dominique", role: "", initiale: "D", couleur: colors.pink },
  { nom: "Thierry", role: "", initiale: "T", couleur: colors.orange },
  { nom: "Julien", role: "", initiale: "J", couleur: colors.blue },
];

export const equipeCoopeo = [
  "Carole", "Aurore", "Séverine", "Rachel", "Tristana", "Sabine", "Elodie",
  "Laurent", "Joël", "Romain", "Philippe", "Thibault", "Réda", "Anthony",
  "Brewal", "Julien", "Cédric", "Erwan", "Anthony", "Cyrille",
];

// ---------------------------------------------------------------- Timeline master (secondes)
export const timeline = {
  acte1: { start: 0, end: 12 },
  acte2: { start: 12, end: 18 },
  acte3: { start: 18, end: 40 },
  acte4: { start: 40, end: 52 },
  acte5: { start: 52, end: 62 },
  acte6: { start: 62, end: 66 },
  acte7: { start: 66, end: 110 },
  acte8: { start: 110, end: 116 },
  acte8bis: { start: 116, end: 124 },
  acte9: { start: 124, end: 132 },
  acte10: { start: 132, end: 135 },
};
export const DUREE_MASTER = 135;

// ---------------------------------------------------------------- Acte I · Il y a 10 ans
// (temps relatifs au début de l'acte)
export const acte1 = {
  plans: {
    classeur: { start: 0, end: 3 },
    ouverture: { start: 3, end: 6 },
    saisie: { start: 6, end: 10 },
    envol: { start: 10, end: 12 },
  },
  textes: {
    ilYa10Ans: "Il y a 10 ans.",
    saisie: "Des factures papier. Tout à la main.",
  },
  etiquetteClasseur: "Factures",
  postit: ["à saisir", "avant", "vendredi"],
  noteFacture: "vérifier prix !",
  noteTotaux: {
    titre: "Achats mars",
    lignes: [
      { label: "farine", valeur: "17,75 + 21,00" },
      { label: "beurre", barre: "98,00", valeur: "103,00" },
      { label: "crème", valeur: "23,88" },
      { label: "total =", barre: "160,63", valeur: "??" },
    ],
  },
  tableur: {
    fichier: "factures_fournisseurs_v3_FINAL.xls",
    titre: "FACTURES FOURNISSEURS · MARS",
    menus: ["Fichier", "Édition", "Affichage", "Insertion", "Format", "Outils", "Données", "Fenêtre"],
    entetes: ["Date", "Fournisseur", "Article", "Qté", "Unité", "Prix unit.", "Total"],
    lignes: [
      ["02/03", "Minoterie A", "Farine T65", "25", "kg", "0,71€", "17,75€"],
      ["02/03", "Minoterie A", "Farine T45", "25", "kg", "0,84€", "21,00€"],
      ["04/03", "Crèmerie B", "Crème 35 %", "6", "L", "3,98€", "23,88€"],
      ["04/03", "Crèmerie B", "Beurre doux 82 %", "25", "kg", "", ""],
    ],
    saisie: "4,12", // tapé caractère par caractère dans F7
  },
  envol: {
    fragments: [
      { texte: "Farine T65", style: "paper" },
      { texte: "4,12 €", style: "yellow" },
      { texte: "0,71 €", style: "paper" },
      { texte: "25 kg", style: "paper" },
      { texte: "Crème 35 %", style: "paper" },
      { texte: "Beurre doux 82 %", style: "paper" },
    ],
    carte: {
      titre: "Analyse des factures",
      valeur: "5 700 L",
      sousTitre: "de crème liquide achetés cette année",
    },
    petitesCartes: [
      { titre: "Stocks", couleur: colors.green },
      { titre: "Fiches techniques", valeur: "0,37 €", couleur: colors.pink },
      { titre: "Ventes", couleur: colors.blue },
    ],
  },
};

// ---------------------------------------------------------------- Factures papier (acte I)
export const fournisseursPapier = [
  { n: "Minoterie A", c: "#8A5A1E", items: [["Farine T65", "25 kg", "0,71", "17,75"], ["Farine T45", "25 kg", "0,84", "21,00"], ["Farine de seigle", "10 kg", "1,12", "11,20"]] },
  { n: "Crèmerie B", c: "#1F5C8C", items: [["Beurre doux 82 %", "25 kg", "4,12", "103,00"], ["Crème 35 %", "6 L", "3,98", "23,88"], ["Lait entier", "12 L", "0,92", "11,04"]] },
  { n: "Primeurs C", c: "#2E7D4F", items: [["Pommes golden", "10 kg", "1,85", "18,50"], ["Citrons", "3 kg", "2,90", "8,70"]] },
  { n: "Emballages D", c: "#7A2E5C", items: [["Sacs baguette", "1 000", "0,03", "30,00"], ["Boîtes pâtisserie", "200", "0,21", "42,00"]] },
  { n: "Épicerie E", c: "#5A4A8C", items: [["Sucre semoule", "25 kg", "1,02", "25,50"], ["Œufs plein air", "360", "0,19", "68,40"], ["Levure fraîche", "1 kg", "3,40", "3,40"]] },
];

// ---------------------------------------------------------------- Acte II · Coopeo évolue
export const acte2 = {
  texte: "Coopeo évolue.",
  // instants (s, relatifs à l'acte) : arrivée des pastilles, masque du wordmark, texte, départ caméra
  pastilles: [0, 0.15, 0.3, 0.45],
  wordmark: { start: 1.0, end: 1.8 },
  texteA: 2.0,
  sortie: 5.5,
};

// ---------------------------------------------------------------- Acte III · Le déferlement
// Instants en secondes relatifs au début de l'acte (0 = 0:18 dans le master)
export const acte3 = {
  analyse: {
    at: 0,
    titre: "Analyse des factures",
    couleur: colors.orange,
    chiffres: [
      { valeur: 5700, unite: "L", legende: "de crème liquide" },
      { valeur: 5, unite: "t", legende: "de beurre" },
    ],
    sousTitre: "achetés cette année",
  },
  fiche: {
    at: 3,
    titre: "Fiches techniques",
    couleur: colors.pink,
    phrase: "Mon croissant me coûte",
    centimes: 37, // 0,37 €
  },
  mercuriales: {
    at: 6,
    titre: "Mercuriales",
    couleur: colors.orange,
    facture: {
      entete: "Fournisseur A · facture 2026-0914",
      lignes: [
        { designation: "Beurre AOP 82 %", qte: "25 kg", prix: "7,90 €" },
        { designation: "Crème 35 %", qte: "100 L", prix: "5,12 €", negocie: "4,35 €", erreur: true },
        { designation: "Farine T45", qte: "25 kg", prix: "0,84 €" },
      ],
    },
    phrase: "Le fournisseur A vous doit",
    montant: "77 €", // (5,12 − 4,35) × 100 L = 77,00 €
    alerte: "Erreur de facturation détectée",
  },
  commandes: {
    at: 9,
    titre: "Commandes",
    couleur: colors.orange,
    notification: "Il manque du lait sur la livraison de ce matin",
    heure: "06:42",
  },
  inventaires: {
    at: 11,
    titre: "Inventaires",
    couleur: colors.green,
    valeur: "1 zone",
    phrase: "reste à compter",
    progression: 86,
  },
  planning: {
    at: 13,
    titre: "Planning de production",
    couleur: colors.green,
    lignes: ["Pétrissage", "Façonnage", "Cuisson", "Viennoiseries", "Pâtisseries"],
    // créneaux [ligne, début (h), durée (h), couleur]
    creneaux: [
      [0, 0, 2.5, colors.blue],
      [1, 1.5, 3, colors.orange],
      [2, 3, 3.5, colors.pink],
      [3, 0.5, 2.5, colors.green],
      [4, 4, 3, "#8B6CF0"],
      [0, 4, 2, colors.blue],
      [2, 6.5, 1.5, colors.pink],
      [3, 4, 2, colors.green],
    ] as [number, number, number, string][],
    heures: ["4h", "6h", "8h", "10h", "12h"],
  },
  marges: {
    at: 16,
    titre: "Suivi des marges",
    sousTitre: "12 mois",
    couleur: colors.pink,
    gain: "+3,2 pts",
    // marge mensuelle (%) sur 12 mois
    courbe: [68.1, 68.6, 68.2, 69.0, 69.4, 69.1, 69.9, 70.3, 70.0, 70.6, 70.9, 71.3],
    mois: ["N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O"],
  },
  export: {
    at: 18,
    titre: "Export comptable",
    couleur: colors.green,
    fichier: "compta_octobre.csv",
    statut: "Envoyé au cabinet comptable",
  },
  ventes: {
    at: 20,
    titre: "Analyse des ventes",
    couleur: colors.blue,
    legende: ["Achats", "Ventes", "Écarts"],
    // [achats, ventes] par mois (base 100)
    barres: [
      [52, 78],
      [48, 74],
      [55, 86],
      [50, 80],
      [58, 92],
      [54, 88],
    ] as [number, number][],
  },
};

// ---------------------------------------------------------------- Acte IV · L'équipe à bord
export const acte4 = {
  fil: {
    titre: "Fil de l'équipe",
    sousTitre: "Boulangerie du Port",
    messages: [
      { at: 0.5, qui: 0, texte: "Rupture sur les baguettes !", heure: "10:24", alerte: true },
      { at: 1.5, qui: 1, texte: "Je relance une fournée de 40.", heure: "10:25", fait: true },
    ],
    indicateur: { at: 3.0, label: "Pertes du jour", valeur: 12 }, // −12 %
    texte: "Avant, l'info se perdait dans les groupes de discussion.",
    texteA: 0.9,
  },
  equipe: {
    start: 6,
    // une micro-action par collaborateur (même ordre que equipeClient)
    actions: ["Vente clôturée", "Fournée relancée", "Inventaire validé", "Commande passée", "Recette mise à jour", "Planning ajusté"],
    jauge: { label: "Objectifs de la semaine", valeur: 94 },
    texte: "Chaque collaborateur fait avancer l'entreprise.",
    texteA: 1.0, // relatif à start
    pas: 0.5, // un avatar s'allume tous les temps
  },
};

// ---------------------------------------------------------------- Acte V · Convergence et 10 bougies
export const acte5 = {
  connexions: {
    texte: "Et si tout se connectait ?",
    texteA: 1.0,
    // cartes qui gravitent puis se figent (positions finales de 04-dix)
    cartes: [
      { titre: "Achats", valeur: "5 700 L", couleur: colors.orange, x: 150, y: 170, flou: 0 },
      { titre: "Marges", valeur: "+3,2 pts", couleur: colors.pink, x: 1440, y: 150, flou: 0 },
      { titre: "Recettes", valeur: "0,37 €", couleur: colors.pink, x: 110, y: 560, flou: 2 },
      { titre: "Inventaires", valeur: "", couleur: colors.green, x: 1500, y: 520, flou: 2.5 },
      { titre: "Commandes", valeur: "lait", couleur: colors.orange, x: 260, y: 840, flou: 0 },
      { titre: "Ventes", valeur: "écarts", couleur: colors.blue, x: 1380, y: 830, flou: 0 },
      { titre: "Production", valeur: "", couleur: colors.green, x: 830, y: 60, flou: 4 },
    ],
    traceDebut: 1.0,
    traceFin: 4.7,
  },
  bougies: {
    start: 5,
    // allumage : rose (haut), orange (gauche), vert (droite), bleu (bas), sur les temps
    allumage: [5.5, 6.0, 6.5, 7.0],
    texte: "10 ans.",
    texteA: 7.0,
  },
  souffle: {
    start: 8,
    silence: 0.5, // inspiration
    debut: 8.5,
    // extinction par flamme [rose, orange, vert, bleu] : rose puis vert s'éteignent d'abord
    extinction: [8.7, 9.05, 8.82, 9.2],
  },
};

// ---------------------------------------------------------------- Acte VI · BOOM Coopeo AI
export const acte6 = {
  impact: 0, // flash + onde de choc (sub drop pile sur cette image)
  logo: 0.9, // le logo officiel est en place, net
  ai: 1.0, // « AI » surgit
  stabilisation: 2.5,
  tremblement: 5, // images de tremblement de caméra
};
