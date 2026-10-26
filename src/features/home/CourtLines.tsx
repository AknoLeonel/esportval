/** Marcações de quadra em traço fino: textura do hero. Decorativa e estática. */
export function CourtLines({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="40" y="40" width="1120" height="620" rx="8" />
      <path d="M600 40v620" />
      <circle cx="600" cy="350" r="96" />
      <path d="M40 210a140 140 0 0 1 0 280M1160 210a140 140 0 0 0 0 280" />
    </svg>
  );
}
