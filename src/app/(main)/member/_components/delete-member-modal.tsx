"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { FormError } from "@/components/form/form-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteMember } from "@/server/actions";

type DeleteMemberModalProps = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  memberId: string;
};

export function DeleteMemberModal(props: DeleteMemberModalProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteMember = () => {
    startTransition(async () => {
      const response = await deleteMember(props.memberId);

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
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Apakah Kamu Yakin Ingin Menghapus Member Ini?
          </DialogTitle>
          <div className="space-y-4 mt-4">
            <FormError message={errorMessage} />
            <div className="flex justify-end gap-x-4">
              <Button onClick={() => props.onClose(false)} variant="outline">
                Batal
              </Button>
              <Button onClick={handleDeleteMember} disabled={isPending}>
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
