import { ImageOff } from "lucide-react";
import Image from "next/image";

type ImageCardProps = {
  imageUrl: string;
};

export function ImagePreview(props: ImageCardProps) {
  return (
    <div className="group bg-secondary/50 relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl">
      {!props.imageUrl ? (
        <div className="flex h-40 items-center justify-center">
          <ImageOff />
        </div>
      ) : (
        <Image
          className="max-h-[480px] w-full object-cover 2xl:max-h-[860px]"
          src={props.imageUrl}
          alt={props.imageUrl}
          width={720}
          height={720}
          loading="lazy"
        />
      )}
    </div>
  );
}
