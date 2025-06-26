import React from "react";
import { ImagePreview } from "./image-preview";

import type { DB_ImagesType } from "@/server/db/schema";

type ImagesContainerProps = {
  images: DB_ImagesType[];
};

export function ImagesContainer(props: ImagesContainerProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
      {props.images.map((item) => (
        <ImagePreview key={item.id} imageUrl={item.url} />
      ))}
    </div>
  );
}
