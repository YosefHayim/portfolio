import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]",
        className,
      )}
      style={{
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

export function SkeletonTitle({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-8 w-3/4", className)} />;
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-16 w-16 rounded-full", className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-4 rounded-lg bg-gray-800/50 p-4", className)}>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <SkeletonTitle />
        <SkeletonText className="w-full" />
        <SkeletonText className="w-4/5" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonProjectGrid() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={`skeleton-card-${i.toString()}`} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <SkeletonAvatar className="h-32 w-32" />
      <div className="w-full max-w-md space-y-3 text-center">
        <SkeletonTitle className="mx-auto" />
        <SkeletonText />
        <SkeletonText className="mx-auto w-4/5" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}

export default Skeleton;
