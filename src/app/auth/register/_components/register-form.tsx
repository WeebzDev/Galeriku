"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerFormSchema, type registerFormSchemaType } from "@/schemas";
import { register } from "@/server/actions";
import Link from "next/link";
import { FormError } from "@/components/form/form-error";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
      const response = await register(values);

      if (response?.success) {
        toast(response.success);
        setErrorMessage("");
        router.push("/auth/login");
      }

      if (response?.error) {
        setErrorMessage(response.error);
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Buat Akun Admin </CardTitle>
          <CardDescription>
            Masukan username dan password untuk akun admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="john" {...field} />
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
                  <Link
                    href={"/auth/login"}
                    className="text-right text-sm hover:underline"
                  >
                    Sudah Punya Akun?
                  </Link>
                  <Button type="submit" className="w-full">
                    Buat Akun
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
