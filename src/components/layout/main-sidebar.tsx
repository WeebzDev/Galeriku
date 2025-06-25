"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { mainSidebar } from "@/lib/sidebar";

export function MainSidebar() {
  return (
    <>
      <SidebarHeader className="flex h-[70px] w-full items-center justify-center border-b">
        <h1>Galeriku</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{"Dashboard"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainSidebar.map((item, index) => {
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={""} />
              <AvatarFallback>{"username".slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{"username"}</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
