// apps/frontend/components/SkeletonCart.tsx
export default function SkeletonCart() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Title skeleton */}
      <div className="h-8 bg-muted rounded-md w-48 mb-8 animate-pulse" />

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Cart items skeleton */}
        <div className="lg:col-span-2 space-y-4 mb-8 lg:mb-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-4 flex gap-4 animate-pulse"
            >
              <div className="w-24 h-24 bg-muted rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-10 bg-muted rounded w-32" />
              </div>
              <div className="h-6 bg-muted rounded w-20" />
            </div>
          ))}
        </div>

        {/* Order summary skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-6" />
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-4 bg-muted rounded w-16" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </div>
            <div className="h-12 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
