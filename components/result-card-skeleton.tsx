export function ResultCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card mx-auto size-20 animate-pulse rounded-full" />
      <div className="bg-card mx-auto h-6 w-48 animate-pulse rounded-md" />
      <div className="bg-card h-64 animate-pulse rounded-xl" />
    </div>
  );
}
