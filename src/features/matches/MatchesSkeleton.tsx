import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

export function MatchesSkeleton() {
  return (
    <SkeletonRegion label="Carregando jogos">
      <Skeleton className="mb-6 h-12 w-72 rounded-full" />
      <div className="grid gap-3">
        {["a", "b", "c", "d"].map((key) => (
          <Skeleton key={key} className="h-24 rounded-2xl" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
