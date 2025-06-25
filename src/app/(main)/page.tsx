import { MainContainer } from "@/components/container/main-container";
import { UploadFileButton } from "@/components/dialog/upload-button";
import { ImagesContainer } from "@/components/image/container";

export default function HomePage() {
  return (
    <MainContainer>
      <ImagesContainer />
      <UploadFileButton />
    </MainContainer>
  );
}
