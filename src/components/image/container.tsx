import React from "react";
import { ImagePreview } from "./image-preview";

export function ImagesContainer() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
      {[
        { id: "1", imageUrl: "" },
        { id: "2", imageUrl: "" },
        { id: "3", imageUrl: "" },
        { id: "4", imageUrl: "" },
      ].map((item) => (
        <ImagePreview key={item.id} imageUrl={item.imageUrl} />
      ))}
    </div>
  );
}
