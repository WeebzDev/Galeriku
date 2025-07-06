import { QUERIES } from "@/server/db/queries";
import { MemberList } from "./member-list";

export async function MemberWrapper() {
  const member = await QUERIES.getAllMember();
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {member.length ? (
        <>
          {member.map((item) => (
            <MemberList key={item.id} username={item.username} />
          ))}
        </>
      ) : (
        <>
          <p className="text-muted text-center">Member Tidak Ditemukan</p>
        </>
      )}
    </div>
  );
}
