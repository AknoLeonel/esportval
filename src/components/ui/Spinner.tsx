import { cn } from "@/lib/cn";

/** Spinner de ação em andamento (envio de formulário). Gira via CSS, com movimento reduzido vira estático. */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-5 animate-spin motion-reduce:animate-none", className)}
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
