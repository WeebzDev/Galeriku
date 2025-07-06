"use client";

import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteMember } from "@/server/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormError } from "@/components/form/form-error";

type MemberListProps = {
  username: string;
  memberId: string;
};

export function MemberList(props: MemberListProps) {
  const { username, memberId } = props;

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteMember = () => {
    startTransition(async () => {
      const response = await deleteMember(memberId);

      if (response?.success) {
        toast(response.success);
        setErrorMessage("");
        setTimeout(() => {
          router.refresh();
        }, 500);
      }

      if (response?.error) {
        setErrorMessage(response.error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{username}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormError message={errorMessage} />
        <Button
          className="w-full"
          title="Delete Member"
          onClick={handleDeleteMember}
          disabled={isPending}
        >
          <Trash />
        </Button>
      </CardContent>
    </Card>
  );
}
