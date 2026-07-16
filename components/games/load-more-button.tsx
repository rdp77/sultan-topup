import { Loader2 } from 'lucide-react'

interface LoadMoreButtonProps {
  remaining: number
  isPending: boolean
  onClick: () => void
}

export function LoadMoreButton({ remaining, isPending, onClick }: Readonly<LoadMoreButtonProps>) {
  return (
    <div className="mt-6 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className="press inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-card disabled:opacity-50"
      >
        <Loader2 className={`size-4 ${isPending ? 'animate-spin' : ''}`} aria-hidden="true" />
        {isPending ? 'Memuat...' : `Muat Lebih Banyak (${remaining} lagi)`}
      </button>
    </div>
  )
}
