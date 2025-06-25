"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "../breadcrumb/breadcrumb";
import { Input } from "../ui/input";

export function MainNavbar() {
  return (
    <div
      className={cn(
        "bg-sidebar/90 sticky top-0 left-0 z-50 flex h-[70px] w-full items-center justify-between border-b px-4 shadow-md backdrop-blur-sm md:px-8",
      )}
    >
      <div className="flex items-center gap-x-4">
        <SidebarTrigger className="md:hidden" />
        <Breadcrumb dynamicSegments homeHref="/dashboard" />
      </div>
      <div className="flex items-center gap-x-4">
        <Input placeholder="Search" />
        <ThemeToggle />
      </div>
    </div>
  );
}
