export function PaymentCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-muted h-8 w-40 animate-pulse rounded-full" />
      <div className="bg-muted h-7 w-56 animate-pulse rounded" />
      <div className="bg-muted h-4 w-72 animate-pulse rounded" />
      <div className="bg-card mt-2 h-80 w-full animate-pulse rounded-xl" />
      <div className="bg-muted h-4 w-full max-w-xs animate-pulse rounded" />
    </div>
  );
}
