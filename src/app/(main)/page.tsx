import { MainContainer } from "@/components/container/main-container";
import { QUERIES } from "@/server/db/queries";

import { ImagesContainer } from "./_components/image-container";
import { TagList } from "./_components/tag-list";

export const revalidate = 0;

export default async function HomePage() {
  const [images, tags] = await Promise.all([
    QUERIES.getAllImages(),
    QUERIES.getAllTags(),
  ]);

  return (
    <MainContainer className="space-y-4 pb-12">
      <div className="flex w-full items-center justify-start md:justify-end">
        <TagList tags={tags} />
      </div>
      <ImagesContainer images={images} tags={tags} />
    </MainContainer>
  );
}
