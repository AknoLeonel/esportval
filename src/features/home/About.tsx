import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { site } from "@/data/site";

const VALUES = [
  {
    title: "Esporte como oportunidade",
    text: "Quadra, bola e professor são a porta de entrada para disciplina, convivência e permanência na escola.",
  },
  {
    title: "Contas abertas",
    text: "Cada real recebido do poder público é publicado aqui, com documentos e a situação da prestação de contas.",
  },
  {
    title: "Perto da comunidade",
    text: "Os projetos acontecem onde as pessoas moram, com parceiros locais.",
  },
];

export function About() {
  return (
    <Section
      id="sobre"
      eyebrow="Quem somos"
      title={`A ${site.name}`}
      description="Uma associação que transforma recursos em projetos esportivos e mostra, com documentos, como cada projeto foi feito."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <blockquote className="border-l-4 border-brand pl-6">
            <p className="font-display text-4xl leading-tight font-extrabold uppercase">
              {site.motto}
            </p>
          </blockquote>
        </Reveal>
        <ul className="grid gap-4">
          {VALUES.map((value, index) => (
            <Reveal
              as="li"
              key={value.title}
              index={index}
              className="rounded-2xl bg-ink-800 p-5 ring-1 ring-white/10"
            >
              <h3 className="font-display text-2xl font-bold uppercase">{value.title}</h3>
              <p className="mt-1 text-fg-muted">{value.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
