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
import { createTagSchema, type createTagSchemaType } from "@/schemas";
import { createTag } from "@/server/actions";
import { FormError } from "../form/form-error";

type CreateTagProps = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
};

export function CreateTag(props: CreateTagProps) {
  const { isOpen, onClose } = props;

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<createTagSchemaType>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: createTagSchemaType) {
    startTransition(async () => {
      const response = await createTag(values);

      if (response?.success) {
        toast(response.success);
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
            <DialogTitle>Tambah Tag Baru</DialogTitle>
            <DialogDescription>
              Buat tag baru untuk mengelompokan gambar anda
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="ui" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormError message={errorMessage} />
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Buat Tag Baru
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
