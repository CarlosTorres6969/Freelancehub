export function ServiceCardSkeleton() {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-4 animate-pulse">
      <div className="h-40 bg-muted rounded-lg mb-4" />
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted rounded w-1/2 mb-3" />
      <div className="h-3 bg-muted rounded w-full mb-2" />
      <div className="h-3 bg-muted rounded w-5/6 mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-8 bg-muted rounded w-20" />
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3 mb-4" />
      <div className="h-4 bg-muted rounded w-2/3 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-muted rounded-full" />
        <div className="flex-1">
          <div className="h-6 bg-muted rounded w-1/3 mb-2" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  )
}
