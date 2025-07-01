import { MainContainer } from "@/components/container/main-container";
import { ImagesContainer } from "@/components/image/container";
import { QUERIES } from "@/server/db/queries";

export const revalidate = 0;

export default async function HomePage() {
  const [images] = await Promise.all([QUERIES.getAllImages()]);

  return (
    <MainContainer>
      <ImagesContainer images={images} />
    </MainContainer>
  );
}
