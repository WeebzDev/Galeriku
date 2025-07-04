/* eslint-disable @typescript-eslint/no-unsafe-member-access */

"use client";

import Image from "next/image";
import { ClipboardCopy, ImageOff, LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import type { DB_ImagesType } from "@/server/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type ImageCardProps = {
  image: DB_ImagesType;
  handleSelectImage: (imageId: string) => void;
  handleRemoveSelectImage: (imageId: string) => void;
  currentImage: (imageId: string) => boolean;
};

export function ImagePreview(props: ImageCardProps) {
  const { image, handleSelectImage, handleRemoveSelectImage, currentImage } =
    props;

  const [isPending, startTransition] = useTransition();

  const convertAndCopyImage = (imageUrl: string) => {
    startTransition(async () => {
      try {
        const img: HTMLImageElement = document.createElement("img");
        img.crossOrigin = "anonymous"; // penting untuk bisa pakai di canvas cross-origin
        img.src = imageUrl;

        // Tunggu gambar selesai dimuat
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Gagal memuat gambar."));
        });

        // Buat canvas dan gambar ulang sebagai PNG
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context tidak tersedia.");

        ctx.drawImage(img, 0, 0);

        // Convert ke blob PNG
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png"),
        );

        if (!blob) throw new Error("Gagal mengonversi gambar ke PNG.");

        // Copy ke clipboard
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);

        toast("Gambar berhasil disalin ke clipboard");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("❌ Gagal menyalin gambar:", error);
        toast(`Gagal menyalin gambar: ${error.message}`);
      }
    });
  };

  return (
    <div className="group bg-secondary/50 relative z-10 mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl">
      <div
        title="Copy To Clipboard"
        onClick={() => convertAndCopyImage(image.url)}
        className="bg-background/85 absolute top-2 right-2 z-10 hidden rounded-md border p-2 backdrop-blur-md group-hover:block"
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" size={18} />
        ) : (
          <ClipboardCopy size={18} />
        )}
      </div>
      <div
        title="Select Image"
        className={cn(
          "bg-background/85 absolute top-2 left-2 z-10 hidden rounded-md border p-2 pb-1 backdrop-blur-md group-hover:block",
          currentImage(image.id) && "block",
        )}
      >
        <Checkbox
          onCheckedChange={(checked) =>
            checked
              ? handleSelectImage(image.id)
              : handleRemoveSelectImage(image.id)
          }
          className=""
        />
      </div>
      {!image ? (
        <div className="flex h-40 items-center justify-center">
          <ImageOff />
        </div>
      ) : (
        <Image
          className="max-h-[480px] w-full object-cover 2xl:max-h-[860px]"
          src={image.url}
          alt={image.url}
          width={720}
          height={720}
          loading="lazy"
        />
      )}
    </div>
  );
}
