"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

type BreadcrumbSegment = {
  title: string;
  href: string;
};

type BreadcrumbProps = {
  segments?: BreadcrumbSegment[];
  homeHref?: string;
  separator?: React.ReactNode;
  showHomeIcon?: boolean;
  /**
   * When true, automatically generates breadcrumb segments from the current pathname
   */
  dynamicSegments?: boolean;
  /**
   * Custom function to transform URL segments into readable titles
   */
  transformLabel?: (segment: string) => string;
} & React.HTMLAttributes<HTMLElement>;

/**
 * Default function to transform URL segments into readable titles
 */
const defaultTransformLabel = (segment: string): string => {
  // Replace hyphens and underscores with spaces
  const withSpaces = segment.replace(/[-_]/g, " ");
  // Capitalize first letter of each word
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function Breadcrumb({
  segments: customSegments,
  homeHref = "/",
  separator = <ChevronRight className="h-4 w-4" />,
  showHomeIcon = true,
  dynamicSegments = false,
  transformLabel = defaultTransformLabel,
  className,
  ...props
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate segments from pathname if dynamicSegments is true
  const segments = React.useMemo(() => {
    if (!dynamicSegments || customSegments) {
      return customSegments ?? [];
    }

    // Split the pathname and filter out empty segments
    const pathSegments = pathname.split("/").filter(Boolean);

    // Build up the segments with proper hrefs
    return pathSegments.map((segment, index) => {
      // Build the href by joining all segments up to the current one
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      return {
        title: transformLabel(segment),
        href,
      };
    });
  }, [pathname, dynamicSegments, customSegments, transformLabel]);

  // If no segments and not using dynamic segments, don't render anything
  if (!segments.length && !dynamicSegments) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "text-muted-foreground flex items-center text-sm",
        className,
      )}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {showHomeIcon && (
          <li>
            <Link
              href={homeHref}
              className="hover:text-foreground flex items-center transition-colors"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
            <span className="sr-only">Home</span>
          </li>
        )}

        {segments.map((segment, index) => {
          const isLastItem = index === segments.length - 1;

          return (
            <React.Fragment key={segment.href}>
              {(index > 0 || showHomeIcon) && (
                <li className="flex items-center" aria-hidden="true">
                  {separator}
                </li>
              )}
              <li>
                {isLastItem ? (
                  <span
                    className="text-foreground font-medium"
                    aria-current="page"
                  >
                    {segment.title}
                  </span>
                ) : (
                  <Link
                    href={segment.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {segment.title}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
