export function ServiceCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 animate-pulse">
      <div className="h-40 bg-zinc-200 dark:bg-zinc-700 rounded-lg mb-4" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mb-3" />
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full mb-2" />
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6 mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-16" />
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-20" />
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-4" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 mb-8" />
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
        <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
        <div className="flex-1">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
