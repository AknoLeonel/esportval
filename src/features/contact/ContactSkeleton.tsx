import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

export function ContactSkeleton() {
  return (
    <SkeletonRegion label="Carregando formulário de contato">
      <div className="space-y-4 rounded-[var(--radius-card)] bg-ink-800 p-6 sm:p-8">
        {["a", "b", "c", "d"].map((key) => (
          <div key={key} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-14 w-44 rounded-full" />
      </div>
    </SkeletonRegion>
  );
}
