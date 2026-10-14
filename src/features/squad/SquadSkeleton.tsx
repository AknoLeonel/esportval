import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

export function SquadSkeleton() {
  return (
    <SkeletonRegion label="Carregando elenco">
      <Skeleton className="mb-6 h-12 w-80 rounded-full" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {["a", "b", "c", "d", "e", "f", "g", "h"].map((key) => (
          <Skeleton key={key} className="h-48 rounded-2xl" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
