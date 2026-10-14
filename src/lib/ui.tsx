// Petits composants d'interface Coopeo partagés entre les actes.
import React from "react";

/** En-tête de carte : pastille de couleur + titre (style 03-envol) */
export const CardHead: React.FC<{
  color: string;
  title: string;
  size?: number;
  icon?: React.ReactNode;
  sub?: string;
  style?: React.CSSProperties;
}> = ({ color, title, size = 34, icon, sub, style }) => (
  <div className="k" style={{ fontSize: size, ...style }}>
    <span className="ic" style={{ background: color, width: size * 1.35, height: size * 1.35, borderRadius: size * 0.36 }}>
      {icon}
    </span>
    {title}
    {sub ? <span style={{ fontWeight: 500, color: "#7A85A5", marginLeft: 4 }}>· {sub}</span> : null}
  </div>
);

/**
 * Compteur à rouleaux : chaque chiffre défile verticalement.
 * value : valeur continue ; digits : nombre de chiffres affichés ; group : espace fine tous les 3 chiffres ;
 * decimals : position de la virgule depuis la droite.
 */
export const Odometer: React.FC<{
  value: number;
  digits: number;
  group?: boolean;
  decimals?: number;
  hideLeadingZeros?: boolean;
  style?: React.CSSProperties;
}> = ({ value, digits, group = false, decimals = 0, hideLeadingZeros = true, style }) => {
  const v = Math.max(0, value);
  const cols: React.ReactNode[] = [];
  const intDigits = Math.max(1, Math.floor(v).toString().length);
  for (let i = digits - 1; i >= 0; i--) {
    const p = Math.pow(10, i);
    let d: number;
    if (i === 0) d = v % 10;
    else {
      const below = v % p;
      d = (Math.floor(v / p) % 10) + Math.max(0, Math.min(1, below - (p - 1)));
    }
    const leading = hideLeadingZeros && i >= intDigits && i > decimals;
    cols.push(
      <span
        key={`d${i}`}
        style={{
          display: "inline-block",
          height: "1em",
          overflow: "hidden",
          verticalAlign: "top",
          width: "0.62em",
          opacity: leading ? 0 : 1,
          textAlign: "center",
        }}
      >
        <span style={{ display: "block", transform: `translateY(${-d}em)` }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, k) => (
            <span key={k} style={{ display: "block", height: "1em", lineHeight: "1em" }}>
              {n}
            </span>
          ))}
        </span>
      </span>,
    );
    if (decimals && i === decimals) cols.push(<span key={`c${i}`}>,</span>);
    else if (group && i > 0 && i % 3 === 0) cols.push(<span key={`g${i}`} style={{ display: "inline-block", width: "0.22em" }} />);
  }
  return <span style={{ display: "inline-flex", lineHeight: "1em", fontVariantNumeric: "tabular-nums", ...style }}>{cols}</span>;
};

export const IconBars: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" />
  </svg>
);
export const IconCheck: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
export const IconAlert: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "#E01E6D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 3L22 20H2Z" fill={color} />
    <path d="M12 9v5M12 17v.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
