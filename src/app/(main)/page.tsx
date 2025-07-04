import Link from "next/link";
import { X } from "lucide-react";

import { MainContainer } from "@/components/container/main-container";
import { QUERIES } from "@/server/db/queries";
import { Button } from "@/components/ui/button";

import type { DB_ImagesType } from "@/server/db/schema";

import { ImagesContainer } from "./_components/image-container";
import { TagList } from "./_components/tag-list";

export const revalidate = 0;

type HomePageProps = {
  searchParams: Promise<{ tags: string | undefined }>;
};

export default async function HomePage(props: HomePageProps) {
  const searchParams = await props.searchParams;

  const tags = await QUERIES.getAllTags();

  let images: DB_ImagesType[] = [];

  if (searchParams.tags) {
    images = await QUERIES.getAllImagesFilter(searchParams.tags);
  } else {
    images = await QUERIES.getAllImages();
  }

  return (
    <MainContainer className="space-y-4 pb-12">
      <div className="flex w-full items-center justify-start md:justify-end gap-x-4">
        <TagList tags={tags} filter={searchParams.tags} />
        {searchParams.tags ? (
          <Link href={"/"} title="Clear Filter">
            <Button>
              <X />
            </Button>
          </Link>
        ) : null}
      </div>
      {images.length ? (
        <ImagesContainer images={images} tags={tags} />
      ) : (
        <div className="flex w-full items-center justify-center">
          <p className="text-muted-foreground">Gambar Tidak Ditemukan</p>
        </div>
      )}
    </MainContainer>
  );
}
