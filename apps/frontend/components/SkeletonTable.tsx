// apps/frontend/components/SkeletonTable.tsx
export default function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-muted rounded w-48 mb-2" />
          <div className="h-4 bg-muted rounded w-32" />
        </div>
        <div className="h-10 bg-muted rounded w-32" />
      </div>

      {/* Controls skeleton */}
      <div className="bg-card border border-border rounded-lg p-4 flex justify-between">
        <div className="h-5 bg-muted rounded w-48" />
        <div className="h-9 bg-muted rounded w-32" />
      </div>

      {/* Table skeleton */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 bg-muted-foreground/20 rounded w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-md" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-20" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-16" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-24" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-muted rounded-full w-20" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <div className="h-8 w-8 bg-muted rounded" />
                    <div className="h-8 w-8 bg-muted rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
