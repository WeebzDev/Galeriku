"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { mainSidebar } from "@/lib/sidebar";
import { FileUploader } from "@/components/dialog/file-uploader";
import { CreateTag } from "../dialog/create-tag";
import { logout } from "@/server/actions";
import { Progress } from "../ui/progress";
import { formatFileSize } from "@/lib/utils";

import type { Session } from "@/type/server";
import type { BucketDetailsType } from "@/lib/dropio/server";

type MainSidebarProps = {
  session: Session;
  bucket: BucketDetailsType | null;
};

export function MainSidebar(props: MainSidebarProps) {
  const { session, bucket } = props;

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCreateTag, setIsCreateTag] = useState<boolean>(false);

  const [storageUsed, setStorageUsage] = useState<number>(
    bucket?.quotaUsage ?? 0,
  );
  const [storageLimit, setStorageLimit] = useState<number>(
    bucket?.quota ?? 0,
  );

  useEffect(() => {
    setStorageUsage(bucket?.quotaUsage ?? 0);
    setStorageLimit(bucket?.quota ?? 0);
  }, [bucket]);

  const storagePercentage = (storageUsed / storageLimit) * 100;

  const router = useRouter();

  const handleLogout = async () => {
    const response = await logout();

    if (response.success) {
      toast(response.success);
      router.push("/auth/login");
    }
  };

  const handleUpload = async () => {
    if (!session) {
      await handleLogout();
    }

    setIsUploading(true);
  };

  return (
    <>
      <FileUploader
        isOpen={isUploading}
        onClose={() => setIsUploading(false)}
      />
      <CreateTag isOpen={isCreateTag} onClose={setIsCreateTag} />

      <SidebarHeader className="flex h-[70px] w-full items-center justify-center">
        <DropdownMenu onOpenChange={setDropdownOpen} open={dropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="w-full">Baru</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-96"
            align="start"
            alignOffset={10}
            sideOffset={10}
          >
            <DropdownMenuItem
              onClick={() => handleUpload()}
              className="cursor-pointer"
            >
              Upload
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsCreateTag(true)}
              className="cursor-pointer"
            >
              Kategori Baru
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          <div className={"space-y-2"}>
            <div className={"flex justify-between text-sm"}>
              <span className="text-muted-foreground">Storage :</span>
              <span className="font-medium">
                {`${formatFileSize(storageUsed)} / ${formatFileSize(storageLimit)}`}
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {session.user?.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{session.user?.username}</p>
            </div>
            <div
              className="cursor-pointer"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
            </div>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
