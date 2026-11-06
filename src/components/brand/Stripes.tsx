/**
 * Faixas diagonais vermelho, laranja e amarelo das peças do manual Esportval 2027 (portais,
 * bandeiras, banners). Decorativa e estática: use com moderação, em cantos e bordas.
 */
export function Stripes({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMaxYMax slice"
      className={className}
    >
      <path d="M600 40C430 120 300 250 230 400H600Z" fill="var(--color-brand-yellow)" />
      <path d="M600 130C470 190 380 290 335 400H600Z" fill="var(--color-brand)" />
      <path d="M600 220C520 260 460 330 435 400H600Z" fill="var(--color-brand-red)" />
    </svg>
  );
}

/** Filete com as três cores da marca, para bordas de seção e rodapé. */
export function StripeBar({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="flex h-1 w-full">
        <span className="flex-1 bg-brand-red" />
        <span className="flex-1 bg-brand" />
        <span className="flex-1 bg-brand-yellow" />
      </div>
    </div>
  );
}
