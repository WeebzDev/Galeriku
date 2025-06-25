import { LoadingSpinner } from "./loading-spinner";

export default function FullPageLoadingSpinner() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
