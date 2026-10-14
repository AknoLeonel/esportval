import { useId } from "react";

/**
 * Escudo Fut'Art: bola + trave sobre o laranja da marca.
 * Ilustração original inspirada no perfil @esportval — troque pelo arquivo oficial do clube quando disponível.
 */
export function Crest({ className, title }: { className?: string; title?: string }) {
  const uid = useId();
  const clipId = `${uid}-inner`;
  const ballId = `${uid}-ball`;
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
        <clipPath id={ballId}>
          <circle cx="66" cy="57" r="26" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="58" fill="#0b0e13" />
      <circle cx="60" cy="60" r="52" fill="#ff6a13" />
      <g clipPath={`url(#${clipId})`}>
        {/* trave e rede */}
        <g stroke="#fff" strokeLinecap="round" fill="none">
          <path d="M20 66V30h48" strokeWidth="3.5" />
          <g strokeWidth="1" opacity="0.8">
            <path d="M26 30v36M32 30v36M38 30v36M44 30v36M50 30v36M56 30v36M62 30v36" />
            <path d="M20 38h48M20 46h48M20 54h40M20 62h30" />
          </g>
        </g>
        {/* bola */}
        <circle cx="66" cy="57" r="26" fill="#fff" />
        <g clipPath={`url(#${ballId})`} fill="#0b0e13">
          <polygon points="66,48 74.6,54.2 71.3,64.3 60.7,64.3 57.4,54.2" />
          <circle cx="80.1" cy="37.6" r="5" />
          <circle cx="88.8" cy="64.4" r="5" />
          <circle cx="66" cy="83" r="5" />
          <circle cx="43.2" cy="64.4" r="5" />
          <circle cx="51.9" cy="37.6" r="5" />
          <g stroke="#0b0e13" strokeWidth="1.6">
            <path d="M66 48V38M74.6 54.2l9.5-3M71.3 64.3l5.9 8.2M60.7 64.3l-5.9 8.2M57.4 54.2l-9.5-3" />
          </g>
        </g>
        <circle cx="66" cy="57" r="26" fill="none" stroke="#0b0e13" strokeWidth="2.5" />
        {/* nome */}
        <text
          x="60"
          y="104"
          textAnchor="middle"
          fontFamily="var(--font-display), Arial Narrow, sans-serif"
          fontWeight="800"
          fontSize="19"
          letterSpacing="1.5"
          fill="#0b0e13"
        >
          FUT’ART
        </text>
      </g>
    </svg>
  );
}
