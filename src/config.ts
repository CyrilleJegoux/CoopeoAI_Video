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
