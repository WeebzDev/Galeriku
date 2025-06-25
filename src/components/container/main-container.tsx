import { cn } from "@/lib/utils";

type MainContainerProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function MainContainer(props: MainContainerProps) {
  return (
    <div
      className={cn(
        "min-h-[calc(100dvh-70px)] w-full px-4 pt-4 md:px-6 md:pt-6 lg:px-8 lg:pt-8",
        props.className,
      )}
      id={props.id}
    >
      {props.children}
    </div>
  );
}
