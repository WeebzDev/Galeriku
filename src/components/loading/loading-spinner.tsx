type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "circle" | "dots" | "pulse";
  className?: string;
  color?: "primary" | "secondary" | "white";
};

export function LoadingSpinner({
  size = "md",
  variant = "circle",
  className = "",
  color = "primary",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const colorClasses = {
    primary: {
      bg: "bg-primary",
      border: "border-primary",
      borderAlt: "border-primary/30",
      borderTop: "border-t-primary",
    },
    secondary: {
      bg: "bg-secondary",
      border: "border-secondary",
      borderAlt: "border-secondary/30",
      borderTop: "border-t-secondary",
    },
    white: {
      bg: "bg-white",
      border: "border-white",
      borderAlt: "border-white/30",
      borderTop: "border-t-white",
    },
  };

  const { bg, borderAlt, borderTop } = colorClasses[color];

  if (variant === "dots") {
    return (
      <div
        className={`flex items-center justify-center space-x-2 ${className}`}
      >
        <div
          className={`${sizeClasses[size]} ${bg} animate-bounce rounded-full`}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={`${sizeClasses[size]} ${bg} animate-bounce rounded-full`}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={`${sizeClasses[size]} ${bg} animate-bounce rounded-full`}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div
          className={`${sizeClasses[size]} ${bg} animate-pulse rounded-full`}
        />
      </div>
    );
  }

  // Default circle spinner
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${borderAlt} ${borderTop} animate-spin rounded-full border-4`}
      />
    </div>
  );
}
