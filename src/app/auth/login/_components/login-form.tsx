"use client";

import Link from "next/link";
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
import { login } from "@/server/actions";
import { loginFormSchema, type loginFormSchemaType } from "@/schemas";
import { FormError } from "@/components/form/form-error";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<loginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: loginFormSchemaType) {
    startTransition(async () => {
      const response = await login(values).catch(() =>
        setErrorMessage("Something went wrong"),
      );

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
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Masukan username dan password untuk login
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
                <FormError message={errorMessage} />
                <div className="flex flex-col gap-3">
                  <Link
                    href={"/auth/register"}
                    className="text-right text-sm hover:underline"
                  >
                    Belum Punya Akun?
                  </Link>
                  <Button type="submit" className="w-full">
                    Login
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
