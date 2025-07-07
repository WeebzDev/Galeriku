"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteImages, logout } from "@/server/actions";
import { FormError } from "@/components/form/form-error";

type AddTagsToImageProps = {
  selectedImage: string[];
  setSelectedImage: (imageId: string[]) => void;
};

export function DeleteImagesModal(props: AddTagsToImageProps) {
  const { selectedImage, setSelectedImage } = props;

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

  const handleDeleteImages = () => {
    startTransition(async () => {
      const response = await deleteImages(selectedImage).catch(() =>
        setErrorMessage("Something went wrong"),
      );

      if (response?.success) {
        toast(response.success);
        setSelectedImage([]);
        setErrorMessage("");
        router.refresh()
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
    <div className="fixed right-10 bottom-20 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Hapus Gambar</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Gambar</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-y-4">
            <FormError message={errorMessage} />
            <div className="flex w-full items-center justify-end">
              <Button
                onClick={handleDeleteImages}
                disabled={isPending}
                className="w-full"
                variant="destructive"
              >
                Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
