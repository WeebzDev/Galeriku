import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type MemberListProps = {
  username: string;
};

export function MemberList(props: MemberListProps) {
  const { username } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{username}</CardTitle>
      </CardHeader>
    </Card>
  );
}
