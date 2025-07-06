import { MainContainer } from "@/components/container/main-container";
import { getSession } from "@/server/auth";

import { MemberWrapper } from "./_components/member-wrapper";
import { MemberNavbar } from "./_components/member-navbar";

export default async function MemberPage() {
  const { user: session } = await getSession();

  return (
    <MainContainer className="space-y-4 pb-12">
      <MemberNavbar session={session} />
      <MemberWrapper session={session} />
    </MainContainer>
  );
}
