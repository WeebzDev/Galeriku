"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AddMemberModal } from "./add-member-modal";

export function MemberNavbar() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <AddMemberModal onClose={setOpen} isOpen={open} />
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold">List Member</h1>
        <Button onClick={() => setOpen(true)}>Tambah Member</Button>
      </div>
    </>
  );
}
