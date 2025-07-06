import { MemberList } from "./member-list";

export function MemberWrapper() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <MemberList />
    </div>
  );
}
