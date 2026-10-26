import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

export function ProjectsSkeleton() {
  return (
    <SkeletonRegion label="Carregando projetos">
      <Skeleton className="mb-6 h-11 w-full max-w-xl rounded-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["a", "b", "c", "d", "e", "f"].map((key) => (
          <Skeleton key={key} className="h-[26rem] rounded-[var(--radius-card)]" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
