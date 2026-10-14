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
      eyebrow="Venha jogar"
      title="Quero treinar"
      description="Conte um pouco sobre o atleta e a comissão técnica retorna com horários e próximos passos."
      className="bg-ink-900"
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="space-y-4 text-lg text-fg-muted">
          <p className="font-display text-3xl leading-tight font-bold text-fg uppercase">
            {site.tagline}
          </p>
          <p>
            Do iniciante ao atleta de competição: preencha o formulário ao lado. Prefere conversar?
            Chame o projeto no Instagram.
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
