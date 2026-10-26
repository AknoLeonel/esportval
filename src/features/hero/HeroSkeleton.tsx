import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

export function HeroPanelSkeleton() {
  return (
    <SkeletonRegion label="Carregando próximo jogo e números da temporada">
      <Skeleton className="h-72 w-full rounded-[var(--radius-card)]" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {["jogos", "vitorias", "gols", "aproveitamento"].map((key) => (
          <Skeleton key={key} className="h-24 rounded-2xl" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
