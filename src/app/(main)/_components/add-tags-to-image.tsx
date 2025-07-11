"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { changeTagInImage, logout } from "@/server/actions";
import { FormError } from "@/components/form/form-error";

import type { DB_TagType } from "@/server/db/schema";

type AddTagsToImageProps = {
  tags: DB_TagType[];
  selectedImage: string[];
  setSelectedImage: (imageId: string[]) => void;
};

export function AddTagsToImage(props: AddTagsToImageProps) {
  const { tags, selectedImage, setSelectedImage } = props;

  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logout();

    if (response.success) {
      toast(response.success);
      router.push("/auth/login");
    }
  };

  const handleUpdateTag = () => {
    startTransition(async () => {
      const response = await changeTagInImage(selectedImage, value).catch(() =>
        setErrorMessage("Something went wrong"),
      );

      if (response?.success) {
        toast(response.success);
        setSelectedImage([]);
        setErrorMessage("");
      }

      if (response?.error) {
        if (response.error === "Mohon Untuk login terlebih dahulu!") {
          await handleLogout();
        }
        setErrorMessage(response.error);
      }
    });
  };

  return (
    <div className="fixed right-10 bottom-10 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Ubah Tag</Button>
        </DialogTrigger>
        <DialogContent className="w-fit">
          <DialogHeader>
            <DialogTitle>Ubah Tag Gambar</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-y-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[320px] justify-between md:w-sm"
                >
                  {value
                    ? tags.find((tag) => tag.name === value)?.name
                    : "Select Tag..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0 md:w-sm">
                <Command>
                  <CommandInput placeholder="Search tag..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No tag found.</CommandEmpty>
                    <CommandGroup>
                      {tags.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          {tag.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === tag.name ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormError message={errorMessage} />
            <div className="flex w-full items-center justify-end">
              <Button
                onClick={handleUpdateTag}
                disabled={isPending}
                className="w-full"
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
