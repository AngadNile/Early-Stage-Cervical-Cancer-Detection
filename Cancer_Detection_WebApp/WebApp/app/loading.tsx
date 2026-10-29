export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        <p className="text-sm text-slate-600 dark:text-slate-300">Loading page...</p>
      </div>
    </div>
  )
}
