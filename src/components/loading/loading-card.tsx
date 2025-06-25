import { LoadingSkeleton } from "./loading-skeleton";

export function LoadingCard() {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="space-y-3">
        <LoadingSkeleton height="h-4" width="w-2/3" />
        <LoadingSkeleton height="h-3" count={3} />
        <div className="flex justify-between pt-2">
          <LoadingSkeleton height="h-8" width="w-24" />
          <LoadingSkeleton height="h-8" width="w-8" circle />
        </div>
      </div>
    </div>
  );
}
