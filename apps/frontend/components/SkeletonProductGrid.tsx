// apps/frontend/components/SkeletonProductGrid.tsx
export default function SkeletonProductGrid() {
  return (
    <div className="space-y-6">
      {/* Category filter skeleton */}
      <div className="flex gap-2 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded-full w-24" />
        ))}
      </div>

      {/* Count skeleton */}
      <div className="h-4 bg-muted rounded w-40 animate-pulse" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="space-y-1">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-16" />
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-muted rounded flex-1" />
                <div className="h-10 bg-muted rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
