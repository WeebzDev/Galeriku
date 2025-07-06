import { MainContainer } from "@/components/container/main-container";

import { MemberWrapper } from "./_components/member-wrapper";
import { MemberNavbar } from "./_components/member-navbar";

export default function MemberPage() {
  return (
    <MainContainer className="space-y-4 pb-12">
      <MemberNavbar />
      <MemberWrapper />
    </MainContainer>
  );
}
