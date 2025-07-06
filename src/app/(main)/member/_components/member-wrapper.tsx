import { QUERIES } from "@/server/db/queries";

import { MemberList } from "./member-list";

import type { DB_UsersType } from "@/server/db/schema";

type MemberWrapperProps = {
  session: DB_UsersType | null;
};

export async function MemberWrapper(props: MemberWrapperProps) {
  const member = await QUERIES.getAllMember();

  return (
    <>
      {member.length ? (
        <div className="grid w-full grid-cols-1 md:grid-cols-3">
          {member.map((item) => (
            <MemberList
              key={item.id}
              username={item.username}
              memberId={item.id}
              session={props.session}
            />
          ))}
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <p className="text-muted-foreground text-center">Member Tidak Ditemukan</p>
        </div>
      )}
    </>
  );
}
