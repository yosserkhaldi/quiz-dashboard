export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card kpi">
          <div className="animate-pulse w-24 h-3 bg-gray-200 rounded mb-3" />
          <div className="animate-pulse w-20 h-7 bg-gray-200 rounded mb-2" />
          <div className="animate-pulse w-16 h-3 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
export function ChartSkeleton() {
  return <div className="h-full w-full animate-pulse bg-gray-100 rounded" />;
}
export function TableSkeleton() {
  return (
    <div className="p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-3 w-1/3 bg-gray-200 animate-pulse rounded mb-2" />
            <div className="h-3 w-1/5 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
