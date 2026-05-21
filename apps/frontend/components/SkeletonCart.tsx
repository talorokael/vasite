// apps/frontend/components/SkeletonCart.tsx
export default function SkeletonCart() {
  return (
    <div className="p-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
            <div className="w-24 h-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <div className="h-7 bg-gray-200 rounded w-32 ml-auto mb-4" />
        <div className="h-10 bg-gray-200 rounded w-40 ml-auto" />
      </div>
    </div>
  );
}