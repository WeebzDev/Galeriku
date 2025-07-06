"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { AddMemberModal } from "./add-member-modal";

import type { DB_UsersType } from "@/server/db/schema";

type MemberNavbarProps = {
  session: DB_UsersType | null;
};

export function MemberNavbar(props: MemberNavbarProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <AddMemberModal onClose={setOpen} isOpen={open} />
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold">List Member</h1>
        {props.session?.role === "admin" ? (
          <Button onClick={() => setOpen(true)}>Tambah Member</Button>
        ) : null}
      </div>
    </>
  );
}
