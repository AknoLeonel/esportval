import { Suspense } from "react";
import { Section } from "@/components/ui/Section";
import { site } from "@/data/site";
import { getSquad } from "@/data/squad";
import { SquadGrid } from "./SquadGrid";
import { SquadSkeleton } from "./SquadSkeleton";

export async function SquadContent() {
  const { players, staff } = await getSquad();
  return <SquadGrid players={players} staff={staff} />;
}

export function SquadSection() {
  return (
    <Section
      id="elenco"
      eyebrow="Time"
      title="Elenco"
      description="Atletas e comissão técnica. Filtre por posição para ver quem joga onde."
      illustrative={site.illustrativeContent}
    >
      <Suspense fallback={<SquadSkeleton />}>
        <SquadContent />
      </Suspense>
    </Section>
  );
}
