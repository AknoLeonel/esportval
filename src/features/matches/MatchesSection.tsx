import { Suspense } from "react";
import { Section } from "@/components/ui/Section";
import { getMatches } from "@/data/matches";
import { site } from "@/data/site";
import { splitMatches } from "@/lib/matches";
import { MatchesSkeleton } from "./MatchesSkeleton";
import { MatchesTabs } from "./MatchesTabs";

export async function MatchesContent() {
  const { upcoming, results } = splitMatches(await getMatches());
  return <MatchesTabs upcoming={upcoming} results={results} />;
}

export function MatchesSection() {
  return (
    <Section
      id="jogos"
      eyebrow="Agenda"
      title="Jogos e resultados"
      description="Quando e onde o Esportval entra em quadra, e como foram as últimas rodadas."
      illustrative={site.illustrativeContent}
    >
      <Suspense fallback={<MatchesSkeleton />}>
        <MatchesContent />
      </Suspense>
    </Section>
  );
}
