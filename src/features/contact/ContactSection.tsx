import { LazyOnView } from "@/components/ui/LazyOnView";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";
import { ContactSkeleton } from "./ContactSkeleton";

export function ContactSection() {
  return (
    <Section
      id="contato"
      eyebrow="Fale com a gente"
      title="Contato"
      description="Parcerias, patrocínio, imprensa, pedidos de informação sobre a prestação de contas ou vontade de participar de um projeto."
      className="bg-ink-900"
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="space-y-4 text-lg text-fg-muted">
          <p className="font-display text-3xl leading-tight font-bold text-fg uppercase">
            Escreva para a {site.name}
          </p>
          <p>
            Empresas e órgãos que querem apoiar um projeto, jornalistas e qualquer pessoa com
            dúvidas sobre como os recursos foram usados: escreva pelo formulário ou chame no
            Instagram.
          </p>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-display text-xl font-bold tracking-wide text-brand uppercase underline-offset-4 hover:underline"
          >
            @{site.instagram.handle}
          </a>
        </Reveal>
        <LazyOnView fallback={<ContactSkeleton />}>
          <ContactForm instagramUrl={site.instagram.url} />
        </LazyOnView>
      </div>
    </Section>
  );
}
