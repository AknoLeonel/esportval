import { Logo } from "@/components/brand/Logo";

type FooterProps = {
  nav: readonly { href: string; label: string }[];
  instagram: { handle: string; url: string };
  tagline: string;
};

export function Footer({ nav, instagram, tagline }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm font-display text-2xl leading-tight font-semibold text-fg-muted uppercase">
            {tagline}
          </p>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="mb-4 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
            Navegue
          </h2>
          <ul className="grid gap-2 text-fg-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <a className="transition-colors duration-150 hover:text-fg" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
            Siga o projeto
          </h2>
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted transition-colors duration-150 hover:text-fg"
          >
            Instagram @{instagram.handle}
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-sm text-fg-subtle">
        © {new Date().getFullYear()} Esportval Futsal · Projeto Fut’Art. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
