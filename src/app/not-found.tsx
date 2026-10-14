import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-content-center gap-6 px-5 text-center">
      <p className="font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
        Fora da quadra
      </p>
      <h1 className="font-display text-7xl font-extrabold uppercase">404</h1>
      <p className="text-fg-muted">Essa página não existe ou mudou de lugar.</p>
      <div>
        <ButtonLink href="/">Voltar ao início</ButtonLink>
      </div>
    </div>
  );
}
