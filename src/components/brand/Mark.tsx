import { useId } from "react";

/**
 * Marca PROVISÓRIA da Esportval: uma bola formada por quatro esportes (futebol, basquete, vôlei e tênis),
 * no espírito da logo antiga da associação. Substitua este SVG pelo arquivo oficial quando ele chegar.
 */
export function Mark({ className, title }: { className?: string; title?: string }) {
  const clipId = `${useId()}-ball`;
  const decorative = !title;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="60" cy="60" r="52" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* futebol */}
        <rect x="8" y="8" width="52" height="52" fill="#fff" />
        <polygon points="34,22.6 47.5,33 42.3,48.6 25.7,48.6 20.5,33" fill="#0b0e13" />
        {/* basquete */}
        <rect x="60" y="8" width="52" height="52" fill="#ff6a13" />
        <path
          d="M86 8v52M60 34h52M68 8q26 26 0 52"
          fill="none"
          stroke="#0b0e13"
          strokeWidth="2.6"
        />
        {/* vôlei */}
        <rect x="8" y="60" width="52" height="52" fill="#ffd2b3" />
        <path
          d="M8 75.6q26-10.4 52 0M8 92.2q26-10.4 52 0"
          fill="none"
          stroke="#ff6a13"
          strokeWidth="3.2"
        />
        {/* tênis */}
        <rect x="60" y="60" width="52" height="52" fill="#0b0e13" />
        <path d="M67.8 112q10.4-28.6 44.2-33.8" fill="none" stroke="#fff" strokeWidth="3.6" />
      </g>
      <path d="M8 60h104M60 8v104" stroke="#fff" strokeWidth="3.2" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="#0b0e13" strokeWidth="4" />
      <circle
        cx="60"
        cy="60"
        r="57"
        fill="none"
        stroke="#ff6a13"
        strokeWidth="2"
        strokeOpacity="0.5"
      />
    </svg>
  );
}
