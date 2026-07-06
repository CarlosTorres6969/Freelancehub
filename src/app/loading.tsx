export default function Loading() {
  return (
    <div className="page-shell">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-64 rounded-lg bg-muted" />
        <div className="h-6 w-96 max-w-full rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}
