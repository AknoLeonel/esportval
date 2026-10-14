import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

export function GallerySkeleton() {
  return (
    <SkeletonRegion label="Carregando galeria">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {["a", "b", "c", "d", "e", "f"].map((key) => (
          <Skeleton key={key} className="aspect-[3/2] rounded-2xl" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
