import { QUERIES } from "@/server/db/queries";
import { MemberList } from "./member-list";

export async function MemberWrapper() {
  const member = await QUERIES.getAllMember();
  return (
    <>
      {member.length ? (
        <>
          {member.map((item) => (
            <MemberList
              key={item.id}
              username={item.username}
              memberId={item.id}
            />
          ))}
        </>
      ) : (
        <div className="flex w-full items-center justify-center">
          <p className="text-muted text-center">Member Tidak Ditemukan</p>
        </div>
      )}
    </>
  );
}
