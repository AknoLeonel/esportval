import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

export function SummarySkeleton() {
  return (
    <SkeletonRegion label="Carregando resumo">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {["a", "b", "c", "d"].map((key) => (
          <Skeleton key={key} className="h-28 rounded-2xl" />
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function ListSkeleton({ rows = 3, label }: { rows?: number; label: string }) {
  return (
    <SkeletonRegion label={label}>
      <Skeleton className="mb-6 h-14 w-full rounded-xl" />
      <div className="grid gap-3">
        {Array.from({ length: rows }, (_, i) => `row-${i}`).map((key) => (
          <Skeleton key={key} className="h-32 rounded-[var(--radius-card)]" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
