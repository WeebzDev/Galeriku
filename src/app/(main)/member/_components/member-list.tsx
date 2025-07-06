"use client";

import { Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DB_UsersType } from "@/server/db/schema";
import { DeleteMemberModal } from "./delete-member-modal";

type MemberListProps = {
  username: string;
  memberId: string;
  session: DB_UsersType | null;
};

export function MemberList(props: MemberListProps) {
  const { username, memberId } = props;

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <DeleteMemberModal isOpen={open} onClose={setOpen} memberId={memberId} />
      <Card>
        <CardHeader>
          <CardTitle>{username}</CardTitle>
        </CardHeader>
        {props.session?.role === "admin" ? (
          <CardContent className="space-y-4">
            <Button
              className="w-full"
              title="Delete Member"
              onClick={() => setOpen(true)}
            >
              <Trash />
            </Button>
          </CardContent>
        ) : null}
      </Card>
    </>
  );
}
