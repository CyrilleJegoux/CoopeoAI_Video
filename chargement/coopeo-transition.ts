// Transition Coopeo : page de connexion -> écran de chargement -> dashboard.
//
// 1. lancerConnexion(bouton)  : au clic sur « Se connecter », le bouton se replie en pastille
//                               et sa position est mémorisée.
// 2. ouvrirChargement(écran)  : l'écran de chargement s'ouvre en cercle depuis le bouton,
//                               les pastilles en sortent (appelé par CoopeoLoader).
// 3. versDashboard(écran)     : les pastilles filent se poser sur le logo de la barre latérale
//                               ([data-coopeo-logo]) et les blocs [data-reveal] du dashboard
//                               apparaissent un par un (appelé par CoopeoLoader).

const CLE = "coopeo-transition-origine";
const EASE = "cubic-bezier(.65, 0, .35, 1)";
const BOUCLE = 2400; // durée d'un tour des pastilles, identique à --cl-loop

const animationsReduites = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const attendre = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** À appeler au clic sur « Se connecter ». Renvoie une fonction qui remet le bouton
 *  dans son état normal (à appeler si la connexion échoue). */
export function lancerConnexion(bouton: HTMLElement): () => void {
  const r = bouton.getBoundingClientRect();
  sessionStorage.setItem(CLE, JSON.stringify({ x: r.left + r.width / 2, y: r.top + r.height / 2 }));
  if (animationsReduites()) return () => sessionStorage.removeItem(CLE);

  const rayon = getComputedStyle(bouton).borderRadius || "0px";
  const pli = bouton.animate(
    [
      { clipPath: `inset(0 0 round ${rayon})`, color: getComputedStyle(bouton).color },
      { clipPath: `inset(0 0 round ${rayon})`, color: "transparent", offset: 0.35 },
      { clipPath: `inset(0 ${(r.width - r.height) / 2}px round ${r.height / 2}px)`, color: "transparent" },
    ],
    { duration: 420, easing: EASE, fill: "forwards" },
  );
  return () => {
    pli.cancel();
    sessionStorage.removeItem(CLE);
  };
}

/** Ouvre l'écran de chargement en cercle depuis le bouton mémorisé. Sans bouton mémorisé
 *  (rechargement de page, accès direct), l'écran garde son simple fondu. */
export function ouvrirChargement(ecran: HTMLElement) {
  const brut = sessionStorage.getItem(CLE);
  sessionStorage.removeItem(CLE);
  if (!brut || animationsReduites()) return;
  const { x, y } = JSON.parse(brut) as { x: number; y: number };
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  ecran.style.animation = "none";
  ecran.animate(
    [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)` }],
    { duration: 750, easing: "cubic-bezier(.7, 0, .2, 1)" },
  );

  // Liseré bleuté qui suit le bord du cercle : rend l'ouverture visible sur fond blanc
  const liseré = document.createElement("div");
  Object.assign(liseré.style, {
    position: "fixed", left: `${x - 100}px`, top: `${y - 100}px`, width: "200px", height: "200px",
    borderRadius: "50%", border: "2px solid rgba(18,155,224,.35)", pointerEvents: "none", zIndex: "10000",
    boxShadow: "0 0 60px rgba(18,155,224,.25), inset 0 0 40px rgba(18,155,224,.12)",
  });
  document.body.appendChild(liseré);
  liseré
    .animate(
      [
        { transform: "scale(0)", opacity: 0 },
        { transform: `scale(${(R / 100) * 0.5})`, opacity: 1, offset: 0.5 },
        { transform: `scale(${R / 100})`, opacity: 0 },
      ],
      { duration: 750, easing: "cubic-bezier(.7, 0, .2, 1)" },
    )
    .finished.finally(() => liseré.remove());

  // Les pastilles sortent du bouton en tournoyant
  const vol = ecran.querySelector<HTMLElement>(".cl-flight");
  if (!vol) return;
  const f = vol.getBoundingClientRect();
  vol.animate(
    [
      { transform: `translate(${x - f.left - f.width / 2}px, ${y - f.top - f.height / 2}px) rotate(-180deg) scale(.25)` },
      { transform: "none" },
    ],
    { duration: 850, easing: "cubic-bezier(.2, .9, .3, 1.15)", fill: "backwards" },
  );
}

/** Fait disparaître l'écran de chargement vers le dashboard (déjà affiché dessous).
 *  La promesse se termine quand l'écran de chargement peut être retiré. */
export async function versDashboard(ecran: HTMLElement): Promise<void> {
  const cible = document.querySelector<HTMLElement>("[data-coopeo-logo]");
  const vol = ecran.querySelector<HTMLElement>(".cl-flight");
  if (!cible || !vol || animationsReduites()) {
    ecran.classList.add("cl-leaving");
    revelerDashboard();
    await attendre(350);
    return;
  }

  await attendreRepos(ecran);
  const f = vol.getBoundingClientRect();
  const c = cible.getBoundingClientRect();
  const dx = c.left + c.width / 2 - (f.left + f.width / 2);
  const dy = c.top + c.height / 2 - (f.top + f.height / 2);
  const s = c.width / f.width;

  cible.style.visibility = "hidden";
  ecran.classList.add("cl-to-dashboard");
  ecran.querySelectorAll(".cl-title, .cl-messages, .cl-bar, .cl-footer").forEach((el) =>
    el.animate([{ opacity: 0 }], { duration: 250, easing: "ease-out", fill: "forwards" }),
  );
  revelerDashboard(100);

  // Trajectoire en arc vers le logo de la barre latérale
  await vol.animate(
    [
      { transform: "none" },
      { transform: `translate(${dx * 0.62}px, ${dy * 0.38}px) scale(${(1 + s) / 2})`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${s})` },
    ],
    { duration: 800, easing: EASE, fill: "forwards" },
  ).finished;

  cible.style.visibility = "";
  cible.animate(
    [{ transform: "scale(1.25)" }, { transform: "scale(.94)" }, { transform: "none" }],
    { duration: 350, easing: "ease-out" },
  );
  await vol.animate([{ opacity: 0 }], { duration: 120, fill: "forwards" }).finished;
}

// Attend que les pastilles soient revenues en position de logo, puis les fige.
async function attendreRepos(ecran: HTMLElement) {
  const tour = ecran.querySelector(".cl-symbol")?.getAnimations()[0];
  if (tour) {
    const total = Number(tour.currentTime ?? 0);
    const t = total % BOUCLE;
    const finDuRebond = BOUCLE * 0.94 + 130; // + décalage de la dernière pastille
    if (total < 200) await attendre(200 - total);
    else if (t >= BOUCLE * 0.14 && t < finDuRebond) await attendre(finDuRebond - t);
  }
  ecran.querySelectorAll(".cl-symbol, .cl-dot").forEach((el) => el.getAnimations().forEach((a) => a.pause()));
}

// Les blocs marqués data-reveal apparaissent un par un (data-reveal="gauche" : glisse depuis la gauche).
function revelerDashboard(delai = 0) {
  let i = 0;
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const gauche = el.dataset.reveal === "gauche";
    el.animate(
      [
        { opacity: gauche ? 1 : 0, transform: gauche ? "translateX(-100%)" : "translateY(22px)" },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: gauche ? 550 : 600,
        delay: delai + (gauche ? 0 : 120 + i++ * 80),
        easing: "cubic-bezier(.2, .8, .2, 1)",
        fill: "backwards",
      },
    );
  });
}
