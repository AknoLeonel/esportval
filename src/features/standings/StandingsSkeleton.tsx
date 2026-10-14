import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

export function StandingsSkeleton() {
  return (
    <SkeletonRegion label="Carregando classificação">
      <div className="grid gap-2">
        {["a", "b", "c", "d", "e", "f", "g", "h"].map((key) => (
          <Skeleton key={key} className="h-12 rounded-xl" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
