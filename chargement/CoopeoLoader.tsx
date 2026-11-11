import "./coopeo-loader.css";

type CoopeoLoaderProps = {
  /** Prénom affiché dans « Bonjour … ». Sans prénom : « Bienvenue ». */
  prenom?: string;
  /** Passe à true quand les données sont prêtes : l'écran s'efface en fondu (0,35 s). */
  leaving?: boolean;
};

// Un message par couleur Coopeo (orange, rose, vert, bleu), affichés à tour de rôle.
const MESSAGES = [
  "Récupération de vos factures",
  "Calcul de vos marges",
  "Mise à jour de votre production",
  "Préparation de votre tableau de bord",
];

export default function CoopeoLoader({ prenom, leaving = false }: CoopeoLoaderProps) {
  return (
    <div
      className={`cl-screen${leaving ? " cl-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Chargement de votre espace Coopeo"
    >
      <div className="cl-symbol" aria-hidden="true">
        <span className="cl-dot p" />
        <span className="cl-dot o" />
        <span className="cl-dot g" />
        <span className="cl-dot b" />
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
