"use client";

import { useState } from "react";

import { ImagePreview } from "@/app/(main)/_components/image-preview";

import type { DB_ImagesType } from "@/server/db/schema";
import { Button } from "@/components/ui/button";

type ImagesContainerProps = {
  images: DB_ImagesType[];
};

export function ImagesContainer(props: ImagesContainerProps) {
  const [selectedImage, setSelectedImage] = useState<string[]>([]);

  const handleSelectImage = (imageId: string) => {
    setSelectedImage((prev) => [...prev, imageId]);
  };

  const handleRemoveSelectImage = (imageId: string) => {
    const newSelected = selectedImage.filter((item) => item !== imageId);
    setSelectedImage(newSelected);
  };

  const currentImage = (imageId: string) => {
    const selected = selectedImage.filter((item) => item === imageId);
    return selected.length ? true : false;
  };

  console.log({ selectedImage });

  return (
    <>
      {selectedImage.length ? <AddTagsToImage /> : null}

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
        {props.images.map((item) => (
          <ImagePreview
            key={item.id}
            image={item}
            handleSelectImage={handleSelectImage}
            handleRemoveSelectImage={handleRemoveSelectImage}
            currentImage={currentImage}
          />
        ))}
      </div>
    </>
  );
}

function AddTagsToImage() {
  return (
    <div className="fixed right-10 bottom-10 z-50">
      <Button>Tambahkan Tag</Button>
    </div>
  );
}
