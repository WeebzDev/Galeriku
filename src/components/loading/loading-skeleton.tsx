import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  circle?: boolean;
};

export function LoadingSkeleton({
  className,
  count = 1,
  height = "h-4",
  width = "w-full",
  circle = false,
}: LoadingSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-muted animate-pulse",
            circle ? "rounded-full" : "rounded",
            height,
            width,
            className,
          )}
        />
      ))}
    </div>
  );
}
