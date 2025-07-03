import { Suspense } from "react";

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/layout/main-sidebar";
import { LoadingSpinner } from "@/components/loading/loading-spinner";
import { MainNavbar } from "@/components/navbar/main-navbar";
import { auth } from "@/server/auth/index";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  console.log({ session });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <MainSidebar />
          </Suspense>
        </Sidebar>
        <SidebarInset className="w-full flex-1">
          <MainNavbar />
          <div className="w-full">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
