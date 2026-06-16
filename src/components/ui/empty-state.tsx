export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className ?? "h-32 w-full"}`} />;
}
