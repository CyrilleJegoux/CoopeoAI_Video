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

// ---------------------------------------------------------------- Acte VII · Un nouveau coéquipier, le moindre détail
// Plans (secondes relatives au début de l'acte, 0 = 1:06 dans le master)
export const acte7 = {
  plans: {
    equipe: { start: 0, end: 4 },
    loupe: { start: 4, end: 9 },
    libelles: { start: 9, end: 13 },
    fusion: { start: 13, end: 17 },
    boissons: { start: 17, end: 21 },
    coutReel: { start: 21, end: 25 },
    taxesFacture: { start: 25, end: 29 },
    taxesVentilees: { start: 29, end: 33 },
    scenarios: { start: 33, end: 37 },
    alertes: { start: 37, end: 41 },
    unique: { start: 41, end: 44 },
  },
  // F15 · Il rejoint l'équipe
  equipe: {
    titre: ["Un nouveau membre ", "dans l'équipe."],
    sousTitre: "Il voit tout, avant tout le monde.",
  },
  // F16 · La loupe (12-loupe)
  loupe: {
    fournisseur: "Crèmerie B",
    numero: "4812",
    date: "12/10/2026",
    client: "Boulangerie du Port",
    // [désignation, qté, unité, P.U. HT, montant HT]
    lignes: [
      ["Lait entier", "12", "L", "0,92", "11,04"],
      ["Lait demi-écrémé", "6", "L", "0,88", "5,28"],
      ["Crème 35 %", "10", "L", "3,98", "39,80"],
      ["Crème 30 %", "5", "L", "3,62", "18,10"],
      ["Mascarpone", "2", "kg", "6,40", "12,80"],
      ["Fromage blanc 20 %", "5", "kg", "2,95", "14,75"],
      ["Œufs plein air", "360", "u", "0,19", "68,40"],
      ["Beurre doux 82 %", "25", "kg", "7,10", "177,50"],
      ["Beurre demi-sel", "10", "kg", "7,30", "73,00"],
      ["Crème fraîche épaisse", "5", "L", "4,10", "20,50"],
      ["Lait concentré", "12", "u", "1,85", "22,20"],
      ["Yaourt nature", "48", "u", "0,32", "15,36"],
      ["Beurre de tourage 82 %", "20", "kg", "8,95", "179,00"],
      ["Beurre AOP 82 %", "25", "kg", "8,40", "210,00"],
      ["Crème UHT 35 %", "12", "L", "3,75", "45,00"],
      ["Lait ribot", "6", "L", "1,10", "6,60"],
    ] as string[][],
    ligneErreur: 13, // ligne 14
    totaux: [
      ["Total HT", "919,33 €"],
      ["TVA 5,5 %", "50,56 €"],
      ["Total TTC", "969,89 €"],
    ],
    carte: {
      badge: "Coopeo AI · écart détecté",
      contexte: "Crèmerie B · facture n° 4812 · ligne 14",
      produit: "Beurre AOP 82 %",
      lignes: [
        ["Prix facturé", "8,40 €/kg"],
        ["Prix négocié", "7,90 €/kg"],
        ["Quantité", "25 kg"],
      ],
      montant: "+12,50 €", // (8,40 − 7,90) × 25 kg = 12,50 €
      montantLegende: "à récupérer",
      bouton: "Signaler au fournisseur →",
    },
    texte: "Le moindre détail.",
  },
  // F16b · Trois libellés, un seul produit (13a-libelles)
  libelles: {
    factures: [
      { fournisseur: "Hygiène Pro A", numero: "F-20931", lignes: [["Sac poubelle 100 L", "10", "rlx", "4,90"], ["EM Bob 2P 450F", "24", "pièce", "2,15"], ["Savon mains 5 L", "2", "bidon", "12,80"]], ligne: 1, pastille: ["1 pièce = 1 rouleau", "2,15 € / rouleau"] },
      { fournisseur: "Distri Emballage B", numero: "2026-1184", lignes: [["Gants nitrile M", "4", "boîte", "6,20"], ["Bobine 450 feuilles 2 plis", "30", "rouleau", "1,98"], ["Film étirable", "2", "rouleau", "9,40"]], ligne: 1, pastille: ["1 rouleau", "1,98 € / rouleau"] },
      { fournisseur: "CHR Fournitures C", numero: "FC-77812", lignes: [["Essuie Main 450 - 2P x 6", "5", "carton", "11,40"], ["Liquide vaisselle 5 L", "3", "bidon", "8,90"], ["Éponges x10", "2", "lot", "3,60"]], ligne: 0, pastille: ["1 carton = 6 rouleaux", "11,40 / 6 = 1,90 €"] },
    ],
    texte: "Trois libellés. Un seul produit.",
  },
  // F16c · Même produit, vrai prix (13b-fusion)
  fusion: {
    badge: "Coopeo AI · produit unifié",
    produit: "Essuie-mains en bobine · 450 feuilles · 2 plis",
    libellesReconnus: "3 libellés reconnus :",
    libelles: ["EM Bob 2P 450F", "Bobine 450 feuilles 2 plis", "Essuie Main 450 - 2P x 6"],
    titreBarres: "Prix ramené au rouleau",
    barres: [
      { fournisseur: "CHR Fournitures C", prix: 1.9, texte: "1,90 €", couleur: "green" },
      { fournisseur: "Distri Emballage B", prix: 1.98, texte: "1,98 €", couleur: "neutre" },
      { fournisseur: "Hygiène Pro A", prix: 2.15, texte: "2,15 €", couleur: "pink" },
    ],
    ecart: "+13 %", // 2,15 / 1,90 = 1,1316
    ecartTexte: ["payés en trop chez Hygiène Pro A", "pour exactement le même produit."],
    texte: "Même produit. Vrai prix.",
  },
  // F16d · Lire ce qui n'est pas écrit (14a-boissons) — facture anonymisée
  boissons: {
    fournisseur: "Grossiste Boissons ●●●●●",
    client: "Client : Restaurant ●●●●●",
    entete: ["num. réf", "date liv", "date fact", "date échéance", "transport"],
    enteteValeurs: ["4●●●●●●358", "30.09.2026", "30.09.2026", "31.10.2026", "88●●●55"],
    paiement: "Relevé mens 30 du mois suiv · Chèque client",
    colonnes: ["Désignation article (8)", "Colis", "Cols", "P.U.HTT", "Base", "Remise", "Droits", "Montant net HT", "Consignes P.U.", "Consignes Montant", "Code TVA"],
    // [libellés], cols, [P.U.HTT par sous-ligne], base, remise, droits, net, ligne whisky ?
    lignes: [
      [["10●●71 APERITIF A BASE DE VIN 15% 100CL", "Remise commerciale article 100%", "Prix net"], "2", ["11,1335", "", "0,0000"], "11,134", "-11,134", "2,900", "5,80", false],
      [["91●●0 POMMEAU 17° 70CL", "Prix net"], "2", ["6,7200", "6,7200"], "", "", "1,465", "16,37", false],
      [["98●●5 GIN LONDON DRY 37°5 70CL", "Prix net"], "5", ["6,4345", "6,4345"], "", "", "5,072", "57,53", false],
      [["11●●23 WHISKY BLEND 40° (6) 100CL", "Prix net"], "3", ["16,2830", "16,2830"], "", "", "7,730", "72,04", true],
      [["11●●23 WHISKY BLEND 40° (6) 100CL", "Remise commerciale article 100%", "Prix net"], "1", ["16,2830", "", "0,0000"], "16,283", "-16,283", "7,730", "7,73", true],
      [["11●●2 COGNAC VS 40° 70CL", "Service Compris ESC 100 COL", "Prix net"], "1", ["37,2783", "", "31,2783"], "1,000", "-6,000", "5,410", "36,69", false],
      [["10●●37 CREME DE CASSIS 15° 100CL", "Prix net"], "3", ["5,2525", "5,2525"], "", "", "2,900", "24,46", false],
      [["10●●38 CREME DE FRAMBOISE 15° 70CL", "Prix net"], "3", ["7,4140", "7,4140"], "", "", "2,030", "28,33", false],
    ] as [string[], string, string[], string, string, string, string, boolean][],
    pastilles: [
      ["40° · 100 cl lus dans le libellé", "0,40 L d'alcool pur"],
      ["Vignette Sécurité sociale", "non facturée sur la ligne · 2,482 €"],
      ["Gratuité détectée", "3 achetées + 1 offerte"],
    ],
    texte: ["Lire ce qui", "n'est pas écrit."],
  },
  // F16e · Le vrai prix, au centime près (14b-cout-reel)
  coutReel: {
    badge: "Coopeo AI · coût réel recalculé",
    produit: "Whisky blend 40° · 100 cl",
    // 16,283 + 7,72968 + 2,48188 = 26,49 €
    lignes: [
      { label: "Prix unitaire HT (P.U.HTT)", detail: "", valeur: "16,283 €", part: 61.5, couleur: "blue", texte: "#7CC8F5" },
      { label: "Droits d'accise", detail: "1 932,42 € / hl AP × 0,004 hl", valeur: "+ 7,730 €", part: 29.2, couleur: "orange", texte: "#FFC27A" },
      { label: "Vignette Sécurité sociale", detail: "620,47 € / hl AP × 0,004 hl · absente de la ligne", valeur: "+ 2,482 €", part: 9.3, couleur: "pink", texte: "#FF7BB0" },
    ],
    totalLabel: "Coût réel par bouteille",
    total: "26,49 €",
    encart1: { titre: "Prix affiché sur la ligne", valeur: "16,28 €", note: "+63 % entre prix affiché et coût réel" },
    // (3 × 26,49488 + 7,730 + 2,48188) / 4 = 22,42 €
    encart2: { titre: "Avec la bouteille offerte", texte: ["3 achetées + 1 offerte", "(droits et vignette restent dus)"], valeur: "22,42 €", legende: "coût moyen réel" },
    texte: ["Le vrai prix,", "au centime près."],
  },
  // F16f · Les taxes en bas de facture (16a-taxes-facture) — facture anonymisée
  taxesFacture: {
    fournisseur: "Grossiste Viandes ●●●●●",
    client: ["Client : Restaurant ●●●●●", "Facture hebdomadaire"],
    colonnes: ["Code", "Produit", "Qté", "Poids", "P.U.", "P.U. net", "Montant"],
    bon: "Bon de Livraison N° 19●●91 - Du : 25-09-2026",
    // [code, produit, origine, qté, poids, P.U., montant, famille] familles : v volaille, p porc, b bœuf, c veau
    produits: [
      ["070015", "SUPREME POULET SV ABATTOIR L", "Origine France Agrément abattoir: FR ●● ●●● ●●● CE", "2", "10.348", "7.8500", "81.23", "v"],
      ["060091", "SAUCISSE FRANCFORT S/ATM FR", "Origine FRANCE Agrément abattoir: FR ●● ●●● ●●● CE", "1", "0.605", "7.7000", "4.66", "p"],
      ["050313", "ENTRECOTE PIECE SV VBF", "VBF Agrément abattoir: FR ●● ●●● ●●●", "5", "9.105", "22.9000", "208.50", "b"],
      ["030011", "RIS VEAU GORGE SV FR", "VF Agrément abattoir: FR ●● ●●● ●●● CE", "1", "0.825", "24.5000", "20.21", "c"],
      ["050327", "PAVE ONGLET BLACK ANGUS", "Abattu : IRLANDE - IRLANDE IRLANDE", "5", "5.665", "20.5000", "116.13", "b"],
      ["050252", "FILET BOEUF PAD SV VBF", "Abattu : ALLEMAGNE - ALLEMAGNE ALLEMAGNE", "5", "7.245", "21.5000", "155.77", "b"],
    ],
    // [libellé, code, poids, taux, montant, couleur, cible] — R.S.D. : veau et porc uniquement (71,491 = 19,975 + 51,516)
    taxes: [
      ["R.S.D.", "32", "71.491", "0.002000", "0.14", colors.blue, "r"],
      ["INTERBEV BOVINS S/OS FR", "35", "45.530", "0.119700", "5.45", colors.orange, "b"],
      ["INTERBEV VEAU S/OS FR", "14", "19.975", "0.074900", "1.50", colors.green, "c"],
      ["INAPORC CVE", "18", "51.516", "0.023000", "1.18", colors.pink, "p"],
    ],
    totaux: [
      ["Total H.T.", "1 771.92"],
      ["Total T.V.A.", "97.46"],
      ["Total T.T.C.", "1 869.38"],
    ],
    pastilles: [
      ["Interbev bovins", "0,1197€/kg → bœuf", colors.orange],
      ["Interbev veau", "0,0749€/kg → veau", colors.green],
      ["Inaporc", "0,023€/kg → porc", colors.pink],
      ["R.S.D.", "0,002€/kg → veau et porc", colors.blue],
    ],
    texte: ["Taxes en bas", "de facture ?"],
    sousTexte: "Coopeo AI les ventile sur chaque ligne produit, au kilo près.",
  },
  // F16g · Chaque taxe, à sa place (16b-taxes-ventilees)
  taxesVentilees: {
    badge: "Coopeo AI · taxes ventilées à la ligne",
    source: "Grossiste Viandes ●●●●● · livraison du 25/09/2026",
    colonnes: ["Produit", "Poids", "P.U. facturé", "Taxe ventilée", "P.U. réel", "Total HT réel"],
    // [produit, poids, P.U. facturé, famille, taxe €/kg, P.U. réel, total HT réel]
    lignes: [
      ["Suprême de poulet", "10,348 kg", "7,85", "v", "—", "7,85", "81,23"],
      ["Saucisse de Francfort", "0,605 kg", "7,70", "p", "0,025", "7,725", "4,67"],
      ["Entrecôte de bœuf", "9,105 kg", "22,90", "b", "0,1197", "23,020", "209,59"],
      ["Ris de veau", "0,825 kg", "24,50", "c", "0,0769", "24,577", "20,28"],
      ["Onglet de bœuf", "5,665 kg", "20,50", "b", "0,1197", "20,620", "116,81"],
      ["Filet de bœuf", "7,245 kg", "21,50", "b", "0,1197", "21,620", "156,63"],
    ],
    familles: {
      b: [colors.orange, "Interbev bovins"],
      c: [colors.green, "Interbev veau + RSD"],
      p: [colors.pink, "Inaporc + RSD"],
      v: ["#5C6A92", "aucune"],
    } as Record<string, [string, string]>,
    texte: "Chaque taxe, à sa place.",
  },
  // F17 · Prendre du recul, prévoir
  scenarios: {
    badge: "Coopeo AI · prévision",
    titre: "Marge du croissant",
    seuil: 75,
    seuilTexte: "seuil 75 %",
    historique: [80.2, 79.8, 80.1, 79.4, 79.6, 78.9, 79.1, 78.6], // marge (%) des derniers mois
    scenarios: [
      { nom: "A · prix stable", fin: 78.4, couleur: colors.green },
      { nom: "B · beurre +3 %", fin: 75.6, couleur: colors.orange },
      { nom: "C · beurre +6 %", fin: 71, couleur: colors.pink, alerte: "marge 71 %, sous le seuil" },
    ],
    texte: "Prendre du recul. Prévoir.",
  },
  // F18 · Les alertes du jour
  alertes: {
    titre: "Les alertes du jour",
    // chaque alerte est reliée à la carte de l'acte III d'où elle vient
    liste: [
      { texte: "4 fortes variations de prix détectées", source: "Mercuriales", couleur: colors.orange },
      { texte: "Le croissant est passé sous les 75 % de marge", source: "Fiches techniques", couleur: colors.pink },
      { texte: "La commande de jeudi n'a pas été passée", source: "Commandes", couleur: colors.orange },
      { texte: "Attention aux ruptures en début d'après-midi", source: "Analyse des ventes", couleur: colors.blue },
    ],
  },
  // F19 · Ce qui le rend unique
  unique: {
    flux: ["10 ans de données métier", "Vos données"],
    badge: "Connecté à vos outils · MCP",
  },
};

// ---------------------------------------------------------------- Acte VIII · Agir ensemble
export const acte8 = {
  chaine: ["Donnée", "Analyse", "Alerte", "Recommandation", "Action"],
  tache: {
    titre: "Relancer le fournisseur A",
    contexte: "Erreur de facturation · Crème 35 % · 77 €",
    partage: "Partagé avec l'équipe",
    assigneA: "Assigné à",
    assigne: 1, // index dans equipeClient (Nico)
    statutAvant: "À traiter",
    statut: "Résolution en cours",
  },
  // instants (s, relatifs à l'acte)
  chaineA: 0.2,
  pas: 0.35,
  tacheA: 2.0,
  partageA: 2.7,
  assigneA: 3.5,
  statutA: 4.2,
};

// ---------------------------------------------------------------- Acte VIII bis · Le cercle vertueux
export const acte8bis = {
  // nœuds dans le sens des aiguilles d'une montre depuis le haut ; le négatif se lit dans l'autre sens
  noeuds: [
    { angle: -90, negatif: "Travail dans l'urgence", positif: "Qualité de travail" },
    { angle: -18, negatif: "Pertes", positif: "Moins de pertes" },
    { angle: 54, negatif: "Baisse de marge", positif: "Marge" },
    { angle: 126, negatif: "Baisse du chiffre d'affaires", positif: "Rentabilité" },
    { angle: 198, negatif: "Turn-over", positif: "Cohésion d'équipe" },
  ],
  centreVicieux: ["Sans visibilité,", "tout s'enchaîne."],
  textes: ["Le cercle vicieux.", "Et si on inversait le sens ?", "Le cercle vertueux."],
  // instants (s, relatifs à l'acte)
  inversion: 3.0, // le symbole Coopeo AI s'allume, le cercle freine
  arret: 3.6, // le cercle s'arrête puis repart dans le sens des aiguilles d'une montre
  bascule: 3.75, // premier terme qui se raye et se dissout (puis un tous les 0,2 s)
  vertueux: 5.0,
};

// ---------------------------------------------------------------- Acte IX · Signature
export const acte9 = {
  logoA: 0.2,
  ligneA: 1.0, // « DEPUIS 10 ANS À VOS CÔTÉS »
  signatureA: 2.0,
  prudenceA: 3.0,
  respiration: 7.0, // le logo respire une fois sur le dernier temps
};

// ---------------------------------------------------------------- Acte X · Merci
export const acte10 = {
  titre: ["Merci à celles et ceux", "qui ont construit Coopeo."],
  // constellation placée à la main (4 rangées libres, ordre de equipeCoopeo)
  positions: [
    [300, 480], [560, 430], [830, 470], [1100, 425], [1370, 475], [1630, 440],
    [200, 620], [450, 590], [700, 640], [950, 600], [1200, 650], [1450, 605], [1700, 650],
    [250, 780], [490, 810], [730, 770], [970, 820], [1210, 775], [1450, 815], [1690, 790],
  ] as [number, number][],
  allumageA: 0.35, // premier prénom
  pas: 0.07, // un prénom toutes les ~2 images
};
