// Génère la musique originale et les effets sonores du film, 100 % par code (aucun échantillon externe).
// Sortie : public/audio/musique.wav et public/audio/sfx.wav (48 kHz, stéréo, 16 bits).
// Tout est calé sur la grille 120 BPM et sur les instants de src/config.ts.
// Lancer : npm run audio
import fs from "fs";
import path from "path";
import {
  acte1,
  acte3,
  acte4,
  acte5,
  acte6,
  acte7,
  acte8,
  acte8bis,
  acte9,
  acte10,
  BEAT,
  DUREE_MASTER,
  timeline,
} from "../src/config";

const SR = 48000;
const N = Math.ceil((DUREE_MASTER + 1) * SR);
const TAU = Math.PI * 2;

type Bus = { L: Float32Array; R: Float32Array };
const bus = (): Bus => ({ L: new Float32Array(N), R: new Float32Array(N) });
const music = bus();
const sfx = bus();
const verbSend = bus(); // envoi vers la réverbération (musique)
const sfxVerb = bus();

// ---------------------------------------------------------------- utilitaires
const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 12345;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const add = (b: Bus, i: number, v: number, pan = 0) => {
  if (i < 0 || i >= N) return;
  b.L[i] += v * Math.min(1, 1 - pan);
  b.R[i] += v * Math.min(1, 1 + pan);
};
/** Enveloppe ADSR simplifiée (secondes) */
const env = (t: number, a: number, d: number, s: number, rel: number, dur: number) => {
  if (t < 0) return 0;
  if (t < a) return t / a;
  if (t < a + d) return 1 - (1 - s) * ((t - a) / d);
  if (t < dur) return s;
  const r = t - dur;
  return r < rel ? s * (1 - r / rel) : 0;
};

// sections du master (s)
const T = {
  a1: timeline.acte1.start,
  kick1: timeline.acte2.start, // premier kick à 0:12
  groove: timeline.acte3.start,
  leger: timeline.acte4.start,
  montee: timeline.acte5.start,
  tenue: timeline.acte5.start + acte5.bougies.start,
  silence: timeline.acte5.start + acte5.souffle.start,
  souffle: timeline.acte5.start + acte5.souffle.debut,
  boom: timeline.acte6.start + acte6.impact,
  ouverture: timeline.acte6.start + acte6.ai,
  drop: timeline.acte7.start,
  agir: timeline.acte8.start,
  cercle: timeline.acte8bis.start,
  frein: timeline.acte8bis.start + acte8bis.inversion,
  reprise: timeline.acte8bis.start + acte8bis.arret,
  plein: timeline.acte8bis.start + acte8bis.vertueux,
  signature: timeline.acte9.start,
  merci: timeline.acte10.start,
};

// accords Fm – Db – Ab – Eb (1 accord par mesure de 2 s)
const CHORDS = [
  [53, 56, 60, 65],
  [49, 53, 56, 61],
  [44, 48, 51, 56],
  [51, 55, 58, 63],
];
const ROOTS = [41, 37, 44, 39];
const chordAt = (t: number) => CHORDS[Math.floor(t / 2) % 4];
const rootAt = (t: number) => ROOTS[Math.floor(t / 2) % 4];
const PENTA = [65, 68, 70, 72, 75, 77, 80, 82, 84]; // fa mineur pentatonique

// ---------------------------------------------------------------- instruments (musique)
const kickTimes: number[] = [];
function kick(t: number, g = 1) {
  kickTimes.push(t);
  const i0 = Math.floor(t * SR);
  let ph = 0;
  for (let k = 0; k < SR * 0.45; k++) {
    const x = k / SR;
    const f = 45 + 110 * Math.exp(-x * 28);
    ph += (TAU * f) / SR;
    const a = Math.exp(-x * 7.5) * g;
    const click = k < 120 ? rnd() * 0.25 * (1 - k / 120) : 0;
    add(music, i0 + k, (Math.sin(ph) * 0.9 + click) * a * 0.75);
  }
}
function clap(t: number, g = 1) {
  const i0 = Math.floor(t * SR);
  let lp = 0;
  for (let k = 0; k < SR * 0.25; k++) {
    const x = k / SR;
    const bursts = x < 0.03 ? (Math.floor(x / 0.01) % 2 === 0 ? 1 : 0.4) : 1;
    const n = rnd();
    lp += 0.45 * (n - lp);
    const v = (n - lp) * Math.exp(-x * 22) * bursts * g * 0.35;
    add(music, i0 + k, v, -0.1);
    add(verbSend, i0 + k, v * 0.4);
  }
}
function hat(t: number, g = 1, open = false) {
  const i0 = Math.floor(t * SR);
  let prev = 0;
  const dec = open ? 9 : 38;
  for (let k = 0; k < SR * (open ? 0.3 : 0.08); k++) {
    const n = rnd();
    const hp = n - prev;
    prev = n;
    add(music, i0 + k, hp * Math.exp((-k / SR) * dec) * g * 0.09, 0.25);
  }
}
function snare(t: number, g = 1) {
  const i0 = Math.floor(t * SR);
  let lp = 0;
  for (let k = 0; k < SR * 0.15; k++) {
    const x = k / SR;
    const n = rnd();
    lp += 0.6 * (n - lp);
    const v = (lp * 0.7 + Math.sin(TAU * 190 * x) * 0.3) * Math.exp(-x * 30) * g * 0.3;
    add(music, i0 + k, v, 0.05);
  }
}
/** Voix soustractive : supersaw filtrée */
function saw(t: number, dur: number, midi: number, g: number, opts: { a?: number; d?: number; s?: number; r?: number; cutoff?: number; voices?: number; detune?: number; pan?: number; send?: number; cutoffEnd?: number; duck?: boolean } = {}) {
  const { a = 0.01, d = 0.2, s = 0.6, r = 0.2, cutoff = 2000, voices = 3, detune = 0.12, pan = 0, send = 0.2, cutoffEnd, duck = false } = opts;
  const i0 = Math.floor(t * SR);
  const len = Math.floor((dur + r) * SR);
  const f0 = mtof(midi);
  const phs = Array.from({ length: voices }, () => rnd() * 0.5 + 0.5);
  let lp1 = 0,
    lp2 = 0;
  for (let k = 0; k < len; k++) {
    const x = k / SR;
    let v = 0;
    for (let j = 0; j < voices; j++) {
      const det = voices > 1 ? (j / (voices - 1) - 0.5) * detune : 0;
      phs[j] += (f0 * Math.pow(2, det / 12)) / SR;
      v += 2 * (phs[j] % 1) - 1;
    }
    v /= voices;
    const co = cutoffEnd ? cutoff + (cutoffEnd - cutoff) * Math.min(1, x / dur) : cutoff;
    const c = 1 - Math.exp((-TAU * co) / SR);
    lp1 += c * (v - lp1);
    lp2 += c * (lp1 - lp2);
    let e = env(x, a, d, s, r, dur) * g;
    if (duck) e *= sidechain(t + x);
    add(music, i0 + k, lp2 * e, pan);
    if (send) add(verbSend, i0 + k, lp2 * e * send);
  }
}
function sine(b: Bus, t: number, dur: number, f: number, g: number, opts: { a?: number; decay?: number; pan?: number; send?: Bus; sendG?: number; fEnd?: number } = {}) {
  const { a = 0.005, decay = 4, pan = 0, send, sendG = 0.3, fEnd } = opts;
  const i0 = Math.floor(t * SR);
  let ph = 0;
  for (let k = 0; k < dur * SR; k++) {
    const x = k / SR;
    const fr = fEnd ? f + (fEnd - f) * (x / dur) : f;
    ph += (TAU * fr) / SR;
    const e = Math.min(1, x / a) * Math.exp(-x * decay) * g;
    const v = Math.sin(ph) * e;
    add(b, i0 + k, v, pan);
    if (send) add(send, i0 + k, v * sendG);
  }
}
/** Cloche / pluck (FM léger) */
function bell(b: Bus, t: number, midi: number, g: number, pan = 0, send?: Bus) {
  const i0 = Math.floor(t * SR);
  const f = mtof(midi);
  for (let k = 0; k < SR * 1.6; k++) {
    const x = k / SR;
    const mod = Math.sin(TAU * f * 3.5 * x) * 1.8 * Math.exp(-x * 6);
    const v = Math.sin(TAU * f * x + mod) * Math.exp(-x * 3.2) * Math.min(1, x / 0.003) * g;
    add(b, i0 + k, v, pan);
    if (send) add(send, i0 + k, v * 0.5);
  }
}
/** Bruit filtré (passe-bande glissant) */
function noise(b: Bus, t: number, dur: number, g: number, f0: number, f1: number, opts: { a?: number; shape?: "swell" | "decay" | "flat"; pan?: number; q?: number; send?: Bus } = {}) {
  const { a = 0.01, shape = "decay", pan = 0, q = 0.7, send } = opts;
  const i0 = Math.floor(t * SR);
  let lp = 0,
    bp = 0;
  for (let k = 0; k < dur * SR; k++) {
    const x = k / SR;
    const u = x / dur;
    const fc = f0 * Math.pow(f1 / f0, u);
    const c = Math.min(0.99, (TAU * fc) / SR);
    const n = rnd();
    // filtre d'état variable simple
    lp += c * bp;
    const hp = n - lp - q * bp;
    bp += c * hp;
    let e: number;
    if (shape === "swell") e = Math.pow(u, 1.6) * (u > 0.92 ? (1 - u) / 0.08 : 1);
    else if (shape === "flat") e = Math.min(1, x / a) * (u > 0.85 ? (1 - u) / 0.15 : 1);
    else e = Math.min(1, x / a) * Math.exp(-u * 4);
    const v = bp * e * g;
    add(b, i0 + k, v, pan);
    if (send) add(send, i0 + k, v * 0.4);
  }
}
const sidechain = (t: number) => {
  // retrouve le dernier kick (liste triée en fin de génération des kicks)
  let lo = 0,
    hi = kickTimes.length - 1,
    last = -10;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (kickTimes[m] <= t) {
      last = kickTimes[m];
      lo = m + 1;
    } else hi = m - 1;
  }
  const dt = t - last;
  return 1 - 0.75 * Math.exp(-dt / 0.11);
};

// ---------------------------------------------------------------- ARRANGEMENT MUSICAL
const beats = (from: number, to: number, step = BEAT) => {
  const out: number[] = [];
  for (let t = Math.ceil(from / step - 1e-6) * step; t < to - 1e-6; t += step) out.push(+t.toFixed(4));
  return out;
};
const inRange = (t: number, a: number, b: number) => t >= a && t < b;

// 1) kicks (d'abord, pour le sidechain)
beats(T.kick1, T.groove).forEach((t) => kick(t, t === T.kick1 ? 1.1 : 0.75)); // le beat s'installe
beats(T.groove, T.leger).forEach((t) => kick(t, 0.95));
beats(T.leger, T.montee, 1).forEach((t) => kick(t, 0.75)); // variante plus légère
beats(T.montee, T.tenue).forEach((t) => kick(t, 0.8 + 0.2 * ((t - T.montee) / (T.tenue - T.montee))));
beats(T.ouverture + 1, T.agir).forEach((t) => kick(t, inRange(t, T.drop + 4, T.drop + 37) ? 0.7 : 0.95)); // plus léger sous les factures
beats(T.agir, T.cercle).forEach((t) => kick(t, 0.95));
beats(T.cercle, T.frein, 1).forEach((t) => kick(t, 0.7)); // basse sourde, demi-temps
beats(T.reprise + 0.5, T.signature).forEach((t) => kick(t, inRange(t, T.reprise, T.plein) ? 0.7 : 1));
kickTimes.sort((a, b) => a - b);

// 2) pad feutré de l'acte I (presque rien), qui s'ouvre avec les frappes
for (let bar = 0; bar < T.kick1; bar += 2) {
  chordAt(bar).forEach((m, j) =>
    saw(bar, 2.05, m, 0.045, { a: 0.8, d: 0.5, s: 0.9, r: 1.2, cutoff: 260 + (bar / T.kick1) * 1500, voices: 2, pan: (j - 1.5) * 0.3, send: 0.5 }),
  );
}
// 3) actes II → V : basse, accords, arpèges
for (let bar = T.kick1; bar < T.tenue; bar += 2) {
  const light = inRange(bar, T.leger, T.montee);
  saw(bar, 1.9, rootAt(bar), bar < T.kick1 + 2 ? 0.08 : 0.16, { a: 0.005, d: 0.3, s: 0.7, r: 0.1, cutoff: 420, voices: 1, duck: true, send: 0 });
  chordAt(bar).forEach((m, j) =>
    saw(bar, 2, m, light ? 0.05 : 0.06, { a: 0.3, d: 0.6, s: 0.8, r: 0.6, cutoff: light ? 1600 : 1100, voices: 3, pan: (j - 1.5) * 0.35, duck: true, send: 0.4 }),
  );
}
// arpèges en doubles-croches (groove plein), plus mélodiques sur l'acte IV
beats(T.groove, T.tenue, BEAT / 2).forEach((t, i) => {
  const ch = chordAt(t);
  const light = inRange(t, T.leger, T.montee);
  if (light && i % 2 === 1) return;
  const m = ch[[0, 2, 1, 3, 2, 1, 3, 0][i % 8]] + 12;
  saw(t, 0.12, m, light ? 0.05 : 0.04, { a: 0.002, d: 0.1, s: 0.2, r: 0.12, cutoff: 3200, voices: 1, pan: i % 2 ? 0.35 : -0.35, send: 0.35 });
});
// percussions
beats(T.groove, T.leger, 1).forEach((t) => clap(t + BEAT, 1));
beats(T.kick1 + 2, T.tenue, BEAT / 2).forEach((t, i) => hat(t, inRange(t, T.groove, T.leger) ? (i % 2 ? 0.8 : 1) : 0.6));
beats(T.groove, T.leger, 2).forEach((t) => hat(t + 1.75, 0.8, true));
// montée : riser + roulement de caisse claire qui accélère
noise(music, T.montee, T.tenue - T.montee, 0.5, 300, 7000, { shape: "swell", send: verbSend });
sine(music, T.montee, T.tenue - T.montee, 110, 0.12, { a: 4, decay: 0, fEnd: 440 });
{
  let t = T.montee + 1;
  while (t < T.tenue - 0.05) {
    const p = (t - T.montee) / (T.tenue - T.montee);
    snare(t, 0.3 + 0.7 * p);
    t += BEAT / (1 + Math.floor(p * 4)) / (p > 0.75 ? 2 : 1);
  }
}
// 0:57 → 1:00 : tout retombe sur une note tenue
saw(T.tenue, T.silence - T.tenue, 53, 0.09, { a: 0.05, d: 1, s: 0.7, r: 0.25, cutoff: 900, voices: 4, send: 0.6 });
saw(T.tenue, T.silence - T.tenue, 65, 0.05, { a: 0.4, d: 1, s: 0.7, r: 0.25, cutoff: 1400, voices: 3, send: 0.6 });
// 1:00 → 1:02 : silence (musique), puis 1:02 impact + sub drop
sine(music, T.boom, 1.8, 80, 0.75, { a: 0.002, decay: 1.6, fEnd: 28 });
noise(music, T.boom, 1.2, 0.9, 6000, 200, { shape: "decay", send: verbSend });
// 1:03 : accords qui s'ouvrent
chordAt(T.ouverture).forEach((m, j) => saw(T.ouverture, 3, m + 12, 0.06, { a: 0.6, d: 1, s: 0.8, r: 1, cutoff: 600, cutoffEnd: 4000, voices: 5, detune: 0.25, pan: (j - 1.5) * 0.4, send: 0.6 }));
// 1:06 → 1:50 : drop « future bass » avec sidechain, plus léger sous les exemples de factures
for (let bar = T.drop; bar < T.agir; bar += 2) {
  const soft = inRange(bar, T.drop + 4, T.drop + 37);
  saw(bar, 1.95, rootAt(bar) - 12, soft ? 0.14 : 0.2, { a: 0.005, d: 0.2, s: 0.8, r: 0.05, cutoff: 300, voices: 2, duck: true, send: 0 });
  chordAt(bar).forEach((m, j) =>
    [0, 0.75, 1.5].forEach((o) =>
      saw(bar + o, o === 1.5 ? 0.45 : 0.7, m + 12, soft ? 0.035 : 0.06, { a: 0.01, d: 0.15, s: 0.7, r: 0.15, cutoff: soft ? 1800 : 3500, voices: 5, detune: 0.3, pan: (j - 1.5) * 0.45, duck: true, send: 0.35 }),
    ),
  );
}
beats(T.drop, T.agir, BEAT / 2).forEach((t, i) => hat(t, inRange(t, T.drop + 4, T.drop + 37) ? 0.45 : 0.8));
beats(T.drop, T.agir, 1).forEach((t) => (inRange(t, T.drop + 4, T.drop + 37) ? null : clap(t + BEAT, 0.9)));
// accents sur les chiffres clés
const a7 = timeline.acte7.start;
const accents = [
  a7 + acte7.plans.loupe.start + (12 + acte7.loupe.ligneErreur * 6) / 30, // 8,40 €
  a7 + acte7.plans.fusion.start + 2, // +13 %
  a7 + acte7.plans.coutReel.start + 2, // 26,49 €
  a7 + acte7.plans.taxesVentilees.start + 2, // ventilation
];
accents.forEach((t) => {
  chordAt(t).forEach((m, j) => saw(t, 0.5, m + 24, 0.05, { a: 0.003, d: 0.3, s: 0.2, r: 0.4, cutoff: 6000, voices: 3, pan: (j - 1.5) * 0.4, send: 0.6 }));
  bell(music, t, 77, 0.12, 0, verbSend);
  bell(music, t + 0.01, 89, 0.06, 0.2, verbSend);
});
// 1:50 → 1:56 : montée
noise(music, T.agir, T.cercle - T.agir, 0.35, 400, 8000, { shape: "swell", send: verbSend });
for (let bar = T.agir; bar < T.cercle; bar += 2)
  chordAt(bar).forEach((m, j) => saw(bar, 2, m + 12, 0.05, { a: 0.2, d: 0.3, s: 0.8, r: 0.3, cutoff: 1200, cutoffEnd: 5000, voices: 4, pan: (j - 1.5) * 0.4, duck: true, send: 0.4 }));
// 1:56 → 1:59 : basse sourde ; 1:59 → 2:01 : frein (chute de hauteur), puis reprise ; 2:01 → 2:04 pleine puissance
saw(T.cercle, T.frein - T.cercle, 29, 0.22, { a: 0.3, d: 0.5, s: 0.8, r: 0.3, cutoff: 220, voices: 2, send: 0 });
sine(music, T.frein, T.reprise - T.frein + 0.3, 220, 0.12, { a: 0.01, decay: 1.5, fEnd: 55 });
noise(music, T.reprise, 1.2, 0.35, 8000, 300, { shape: "swell", send: verbSend }); // whoosh inversé
for (let bar = T.plein; bar < T.signature; bar += 1)
  chordAt(bar).forEach((m, j) => saw(bar, 0.95, m + 12, 0.065, { a: 0.01, d: 0.2, s: 0.8, r: 0.1, cutoff: 4000, voices: 5, detune: 0.3, pan: (j - 1.5) * 0.45, duck: true, send: 0.35 }));
beats(T.reprise, T.signature, BEAT / 2).forEach((t) => hat(t, 0.7));
// 2:04 → 2:12 : motif signature de 4 notes + dernier coup sur la respiration du logo
const sig = T.signature;
[
  [sig + 1.0, 65],
  [sig + 1.5, 72],
  [sig + 2.0, 68],
  [sig + 2.5, 77],
].forEach(([t, m]) => {
  bell(music, t, m + 12, 0.16, 0, verbSend);
  saw(t, 0.4, m, 0.05, { a: 0.005, d: 0.3, s: 0.3, r: 0.6, cutoff: 3000, voices: 3, send: 0.7 });
});
[53, 56, 60, 65].forEach((m, j) => saw(sig, timeline.acte10.end - sig, m, 0.04, { a: 1.5, d: 2, s: 0.8, r: 2, cutoff: 1200, voices: 3, pan: (j - 1.5) * 0.4, send: 0.7 }));
const respir = sig + acte9.respiration;
kick(respir, 1);
sine(music, respir, 2.5, 55, 0.4, { a: 0.003, decay: 1.4 });
chordAt(0).forEach((m) => bell(music, respir, m + 24, 0.07, 0, verbSend));
// 2:12 → 2:15 : queue de réverbération douce (assurée par l'envoi réverbéré)

// ---------------------------------------------------------------- EFFETS SONORES (sfx)
const clock = (t: number) => {
  sine(sfx, t, 0.04, 3200, 0.08, { decay: 80, pan: 0.3 });
  noise(sfx, t, 0.03, 0.08, 2500, 2500, { shape: "decay", pan: 0.3 });
};
for (let t = 0.2; t < 6; t += 1) clock(t);
noise(sfx, 0.3, 0.6, 0.12, 1500, 4000, { shape: "decay", a: 0.05, pan: -0.3 }); // froissement de papier
noise(sfx, 1.6, 0.4, 0.08, 2000, 5000, { shape: "decay", a: 0.03, pan: 0.4 });
// couverture cartonnée + levier métallique (acte I, F1b)
const ouv = acte1.plans.ouverture.start;
noise(sfx, ouv + 0.25, 0.5, 0.25, 300, 1200, { shape: "decay", a: 0.03 });
sine(sfx, ouv + 0.95, 0.25, 110, 0.35, { decay: 18 });
[2900, 4100, 5300].forEach((fr, k) => sine(sfx, ouv + 1.2, 0.35, fr, 0.06 / (k + 1), { decay: 14, pan: 0.2 }));
noise(sfx, ouv + 1.2, 0.05, 0.25, 5000, 5000, { shape: "decay" });
// frappes clavier : d'abord irrégulières, puis calées sur la grille
const keyClick = (t: number, g = 1) => {
  noise(sfx, t, 0.035, 0.22 * g, 3500, 2200, { shape: "decay", pan: rnd() * 0.3 });
  sine(sfx, t, 0.03, 180, 0.08 * g, { decay: 60 });
};
const sa = acte1.plans.saisie.start;
const fr = acte1.tableur.frappes;
[...fr.cles, ...fr.ligneSuivante].forEach((t) => keyClick(sa + t));
keyClick(sa + fr.entree, 1.4);
[0.15, 0.62, 1.1, 1.6, 1.8, 2.05].forEach((t) => keyClick(sa + t, 0.6)); // frappes de fond
beats(sa + 2.5, T.kick1, BEAT / 2).forEach((t) => keyClick(t, 0.75)); // les touches deviennent le rythme
noise(sfx, acte1.plans.envol.start, 2, 0.5, 300, 6000, { shape: "swell" }); // whoosh montant → kick 0:12
// impact léger du logo
noise(sfx, T.kick1, 0.6, 0.25, 4000, 300, { shape: "decay", send: sfxVerb });
// un son différent par carte (acte III)
const a3 = timeline.acte3.start;
for (let k = 0; k < 14; k++) sine(sfx, a3 + acte3.analyse.at + 0.2 + k * 0.1, 0.03, 2400, 0.05, { decay: 60 }); // ticks de compteur
noise(sfx, a3 + acte3.fiche.at, 0.9, 0.08, 800, 3000, { shape: "flat" }); // tracé
sine(sfx, a3 + acte3.fiche.at + 0.75, 0.08, 1800, 0.12, { decay: 30 }); // clic
noise(sfx, a3 + acte3.mercuriales.at + 0.3, 0.5, 0.15, 1000, 6000, { shape: "flat" }); // scan
noise(sfx, a3 + acte3.mercuriales.at + 1.75, 0.5, 0.4, 3000, 200, { shape: "decay", send: sfxVerb }); // la carte claque
sine(sfx, a3 + acte3.mercuriales.at + 1.75, 0.4, 70, 0.4, { decay: 10 });
[77, 84].forEach((m, k) => bell(sfx, a3 + acte3.commandes.at + k * 0.12, m, 0.12, 0.2, sfxVerb)); // notification
sine(sfx, a3 + acte3.inventaires.at + 0.3, 0.12, 1320, 0.1, { decay: 20 }); // bip
for (let k = 0; k < 8; k++) sine(sfx, a3 + acte3.planning.at + 0.33 + k * 0.167, 0.05, 900 + k * 60, 0.06, { decay: 40 }); // créneaux posés
noise(sfx, a3 + acte3.marges.at + 0.2, 1, 0.18, 400, 5000, { shape: "swell" }); // swoosh du tracé
sine(sfx, a3 + acte3.export.at + 0.4, 0.15, 600, 0.2, { decay: 25, fEnd: 1400 }); // pop fichier
sine(sfx, a3 + acte3.export.at + 1.4, 0.1, 300, 0.15, { decay: 30 }); // rebond
for (let k = 0; k < 6; k++) sine(sfx, a3 + acte3.ventes.at + 0.27 + k * 0.13, 0.05, 700 + k * 120, 0.06, { decay: 40 }); // barres en cascade
// acte IV : notifications accordées sur la tonalité
const a4 = timeline.acte4.start;
acte4.fil.messages.forEach((m, k) => bell(sfx, a4 + m.at, PENTA[k * 2 + 1], 0.12, k ? 0.3 : -0.3, sfxVerb));
bell(sfx, a4 + acte4.fil.messages[1].at + 0.75, 84, 0.1, 0.3, sfxVerb); // check
bell(sfx, a4 + acte4.fil.indicateur.at, 80, 0.1, 0, sfxVerb);
for (let i = 0; i < 6; i++) bell(sfx, a4 + acte4.equipe.start + 0.3 + i * acte4.equipe.pas, PENTA[i + 1], 0.11, (i - 2.5) * 0.15, sfxVerb);
// acte V : 4 allumettes, inspiration, souffle
const a5 = timeline.acte5.start;
acte5.bougies.allumage.forEach((t) => {
  noise(sfx, a5 + t - 0.05, 0.25, 0.35, 2500, 900, { shape: "decay", a: 0.005 });
  noise(sfx, a5 + t + 0.1, 0.7, 0.06, 600, 1500, { shape: "flat" }); // crépitement
});
noise(sfx, T.silence, acte5.souffle.silence, 0.18, 500, 1800, { shape: "swell" }); // inspiration
noise(sfx, T.souffle, 1.4, 0.45, 2500, 350, { shape: "decay", a: 0.08, pan: 0 }); // souffle
// acte VI : flash, tremblement, scintillement électrique
noise(sfx, T.boom, 0.5, 0.6, 8000, 1500, { shape: "decay", send: sfxVerb });
for (let k = 0; k < 40; k++) sine(sfx, T.ouverture + k * 0.04 + Math.abs(rnd()) * 0.03, 0.15, 3000 + Math.abs(rnd()) * 5000, 0.025, { decay: 30, pan: rnd() * 0.6 });
// acte VII : scans, verrouillages, fils lumineux
const lp0 = a7 + acte7.plans.loupe.start;
for (let r = 0; r < acte7.loupe.ligneErreur; r++) sine(sfx, lp0 + (12 + r * 6 + 4) / 30, 0.04, 2000 + r * 40, 0.04, { decay: 50, pan: 0.2 });
sine(sfx, lp0 + (12 + acte7.loupe.ligneErreur * 6) / 30, 0.3, 880, 0.15, { decay: 10 }); // verrouillage
const lib = a7 + acte7.plans.libelles.start;
[0, 0.2, 0.4].forEach((o) => noise(sfx, lib + 0.6 + o, 0.3, 0.1, 1500, 6000, { shape: "flat" }));
noise(sfx, lib + 1.5, 1, 0.2, 300, 3000, { shape: "swell" });
const bo = a7 + acte7.plans.boissons.start;
[1.33, 1.67, 2.0].forEach((o, k) => bell(sfx, bo + o, PENTA[k + 3], 0.08, 0.3, sfxVerb));
const tf = a7 + acte7.plans.taxesFacture.start;
for (let k = 0; k < 4; k++) noise(sfx, tf + 1 + k * 0.27, 0.6, 0.08, 800, 4000, { shape: "swell", pan: 0.3 });
const tv = a7 + acte7.plans.taxesVentilees.start;
for (let k = 0; k < 6; k++) sine(sfx, tv + 1 + k * 0.2, 0.06, 1100 + k * 80, 0.07, { decay: 35 });
const al = a7 + acte7.plans.alertes.start;
for (let k = 0; k < 4; k++) bell(sfx, al + (14 + k * 18) / 30, PENTA[4 - k], 0.1, 0.2, sfxVerb);
noise(sfx, a7 + acte7.plans.unique.start + 0.3, 1.4, 0.18, 300, 4000, { shape: "swell" }); // fusion
// acte VIII : clics d'action, envoi
const a8 = timeline.acte8.start;
acte8.chaine.forEach((_, i) => sine(sfx, a8 + acte8.chaineA + i * acte8.pas, 0.06, 1500 + i * 150, 0.1, { decay: 40 }));
noise(sfx, a8 + acte8.tacheA, 0.4, 0.15, 3000, 500, { shape: "decay" });
sine(sfx, a8 + acte8.assigneA, 0.08, 1800, 0.1, { decay: 30 });
noise(sfx, a8 + acte8.statutA, 0.5, 0.2, 800, 6000, { shape: "swell" }); // envoi
bell(sfx, a8 + acte8.statutA + 0.15, 84, 0.1, 0, sfxVerb);
// acte X : scintillements légers sur les prénoms
const a10 = timeline.acte10.start;
for (let i = 0; i < 20; i++) sine(sfx, a10 + acte10.allumageA + i * acte10.pas, 0.25, mtof(PENTA[i % PENTA.length] + 12), 0.03, { decay: 12, pan: (i / 19 - 0.5) * 1.2, send: sfxVerb, sendG: 0.5 });

// ---------------------------------------------------------------- réverbération (Schroeder) et sortie
function reverb(src: Bus, dst: Bus, g: number) {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356].map((d) => Math.round((d * SR) / 44100));
  const aps = [225, 556].map((d) => Math.round((d * SR) / 44100));
  for (const [ch, out, spread] of [
    [src.L, dst.L, 0],
    [src.R, dst.R, 23],
  ] as [Float32Array, Float32Array, number][]) {
    const acc = new Float32Array(N);
    for (const d0 of combs) {
      const d = d0 + spread;
      const buf = new Float32Array(d);
      let idx = 0,
        lp = 0;
      for (let i = 0; i < N; i++) {
        const y = buf[idx];
        lp = y * 0.6 + lp * 0.4;
        buf[idx] = ch[i] + lp * 0.84;
        acc[i] += y;
        idx = (idx + 1) % d;
      }
    }
    for (const d of aps) {
      const buf = new Float32Array(d);
      let idx = 0;
      for (let i = 0; i < N; i++) {
        const bv = buf[idx];
        const y = -acc[i] + bv;
        buf[idx] = acc[i] + bv * 0.5;
        acc[i] = y;
        idx = (idx + 1) % d;
      }
    }
    for (let i = 0; i < N; i++) out[i] += acc[i] * g;
  }
}
reverb(verbSend, music, 0.09);
reverb(sfxVerb, sfx, 0.07);

// silence absolu de la musique pendant l'inspiration (1:00 → 1:00,5)
{
  const i0 = Math.floor(T.silence * SR),
    i1 = Math.floor(T.souffle * SR);
  const fade = Math.floor(0.08 * SR);
  for (let i = i0 - fade; i < i1; i++) {
    const gm = i < i0 ? 1 - (i - (i0 - fade)) / fade : 0;
    music.L[i] *= gm;
    music.R[i] *= gm;
  }
  // la musique ne reprend qu'au BOOM (le souffle est seul)
  for (let i = i1; i < Math.floor(T.boom * SR) - 1; i++) {
    music.L[i] = 0;
    music.R[i] = 0;
  }
}
// fin du film : coupe propre à 2:15
const iEnd = Math.floor(DUREE_MASTER * SR);
for (const b of [music, sfx]) {
  const fade = Math.floor(0.5 * SR);
  for (let i = iEnd - fade; i < N; i++) {
    const g = i < iEnd ? (iEnd - i) / fade : 0;
    b.L[i] *= g;
    b.R[i] *= g;
  }
}

function peakOf(b: Bus, len: number) {
  let p = 0;
  for (let i = 0; i < len; i++) p = Math.max(p, Math.abs(b.L[i]), Math.abs(b.R[i]));
  return p || 1;
}
function writeWav(file: string, b: Bus, g: number) {
  const len = iEnd;
  const buf = Buffer.alloc(44 + len * 4);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + len * 4, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(len * 4, 40);
  for (let i = 0; i < len; i++) {
    const l = Math.max(-1, Math.min(1, b.L[i] * g));
    const r = Math.max(-1, Math.min(1, b.R[i] * g));
    buf.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
  console.log(`${file} : ${(buf.length / 1e6).toFixed(1)} Mo`);
}
// Équilibre : musique à 1, effets à 0,8 (stems normalisés, utiles pour remplacer la musique)
const gm = 1 / peakOf(music, iEnd);
const gs = 0.8 / peakOf(sfx, iEnd);
const out = path.join(process.cwd(), "public", "audio");
writeWav(path.join(out, "musique.wav"), music, gm * 0.6);
writeWav(path.join(out, "sfx.wav"), sfx, gs * 0.6);

// Mixage final du master : niveau remonté puis limiteur (attaque anticipée, relâchement 120 ms), plafond −1 dBFS
const mix = bus();
const LOUD = Math.pow(10, 9 / 20);
for (let i = 0; i < iEnd; i++) {
  mix.L[i] = (music.L[i] * gm + sfx.L[i] * gs) * 0.6 * LOUD;
  mix.R[i] = (music.R[i] * gm + sfx.R[i] * gs) * 0.6 * LOUD;
}
{
  const ceil = Math.pow(10, -1 / 20);
  const req = new Float32Array(iEnd);
  for (let i = 0; i < iEnd; i++) {
    const p = Math.max(Math.abs(mix.L[i]), Math.abs(mix.R[i]));
    req[i] = p > ceil ? ceil / p : 1;
  }
  const att = 1 / (0.004 * SR),
    rel = 1 / (0.12 * SR);
  for (let i = iEnd - 2; i >= 0; i--) req[i] = Math.min(req[i], req[i + 1] + att);
  for (let i = 1; i < iEnd; i++) req[i] = Math.min(req[i], req[i - 1] + rel);
  for (let i = 0; i < iEnd; i++) {
    mix.L[i] *= req[i];
    mix.R[i] *= req[i];
  }
}
writeWav(path.join(out, "mix.wav"), mix, 1);
