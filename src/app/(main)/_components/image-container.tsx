"use client";

import { useState } from "react";

import { ImagePreview } from "@/app/(main)/_components/image-preview";

import type { DB_ImagesType, DB_TagType } from "@/server/db/schema";

import { AddTagsToImage } from "./add-tags-to-image";

type ImagesContainerProps = {
  images: DB_ImagesType[];
  tags: DB_TagType[];
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

  return (
    <>
      {selectedImage.length ? (
        <AddTagsToImage
          tags={props.tags}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      ) : null}

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
