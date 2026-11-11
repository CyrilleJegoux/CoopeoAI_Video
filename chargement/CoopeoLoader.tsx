import { useEffect, useLayoutEffect, useRef } from "react";
import { ouvrirChargement, versDashboard } from "./coopeo-transition";
import "./coopeo-loader.css";

type CoopeoLoaderProps = {
  /** Prénom affiché dans « Bonjour … ». Sans prénom : « Bienvenue ». */
  prenom?: string;
  /** Passe à true quand les données sont prêtes et que le dashboard est affiché dessous :
   *  les pastilles filent vers le logo de la barre latérale et le dashboard apparaît. */
  leaving?: boolean;
  /** Appelé à la fin de la transition : c'est le moment de retirer le composant. */
  onDone?: () => void;
};

// Un message par couleur Coopeo (orange, rose, vert, bleu), affichés à tour de rôle.
const MESSAGES = [
  "Récupération de vos factures",
  "Calcul de vos marges",
  "Mise à jour de votre production",
  "Préparation de votre tableau de bord",
];

export default function CoopeoLoader({ prenom, leaving = false, onDone }: CoopeoLoaderProps) {
  const ecran = useRef<HTMLDivElement>(null);

  // Ouverture en cercle depuis le bouton « Se connecter » (si lancerConnexion a été appelé)
  useLayoutEffect(() => {
    if (ecran.current) ouvrirChargement(ecran.current);
  }, []);

  useEffect(() => {
    if (!leaving || !ecran.current) return;
    let annule = false;
    versDashboard(ecran.current).then(() => {
      if (!annule) onDone?.();
    });
    return () => {
      annule = true;
    };
  }, [leaving]);

  return (
    <div
      ref={ecran}
      className="cl-screen"
      role="status"
      aria-live="polite"
      aria-label="Chargement de votre espace Coopeo"
    >
      <div className="cl-flight" aria-hidden="true">
        <div className="cl-symbol">
          <span className="cl-dot p" />
          <span className="cl-dot o" />
          <span className="cl-dot g" />
          <span className="cl-dot b" />
        </div>
      </div>
      <h1 className="cl-title">{prenom ? `Bonjour ${prenom}` : "Bienvenue"}</h1>
      <div className="cl-messages">
        {MESSAGES.map((m) => (
          <span key={m} className="cl-msg">{m}</span>
        ))}
      </div>
      <div className="cl-bar" aria-hidden="true" />
      <div className="cl-footer">Coopeo — votre copilote de gestion</div>
    </div>
  );
}
