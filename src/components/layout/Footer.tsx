import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { orField } from "@/lib/organization";

type FooterProps = {
  nav: readonly { href: string; label: string }[];
  instagram: { handle: string; url: string };
  motto: string;
  organization: { legalName: string | null; cnpj: string | null };
};

export function Footer({ nav, instagram, motto, organization }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm font-display text-2xl leading-tight font-semibold text-fg-muted uppercase">
            {motto}
          </p>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="mb-4 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
            Navegue
          </h2>
          <ul className="grid gap-2 text-fg-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors duration-150 hover:text-fg" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
            Dados da associação
          </h2>
          <dl className="grid gap-1 text-sm text-fg-muted">
            <div>
              <dt className="inline text-fg-subtle">Razão social: </dt>
              <dd className="inline">{orField(organization.legalName)}</dd>
            </div>
            <div>
              <dt className="inline text-fg-subtle">CNPJ: </dt>
              <dd className="inline">{orField(organization.cnpj)}</dd>
            </div>
          </dl>
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-fg-muted transition-colors duration-150 hover:text-fg"
          >
            Instagram @{instagram.handle}
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-sm text-fg-subtle">
        © {new Date().getFullYear()} Esportval. Todos os direitos reservados.
      </div>
    </footer>
  );
}
