"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createNewMember } from "@/server/actions";
import { FormError } from "@/components/form/form-error";
import { registerFormSchema, type registerFormSchemaType } from "@/schemas";

type AddMemberModalProps = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
};

export function AddMemberModal(props: AddMemberModalProps) {
  const { isOpen, onClose } = props;

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<registerFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirm_password: "",
    },
  });

  function onSubmit(values: registerFormSchemaType) {
    startTransition(async () => {
      const response = await createNewMember(values);

      if (response?.success) {
        toast(response.success);
        setErrorMessage("");
        setTimeout(() => {
          router.refresh();
          onClose(false);
          form.reset();
        }, 500);
      }

      if (response?.error) {
        setErrorMessage(response.error);
      }
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Member Baru</DialogTitle>
            <DialogDescription>
              Buat tag baru untuk mengelompokan gambar anda
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jhon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormError message={errorMessage} />
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Buat Member Baru
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
