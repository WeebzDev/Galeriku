"use server";

import { v7 as uuidv7 } from "uuid";
import * as argon2 from "argon2";

import type { UploadResult } from "@/lib/dropio/client";
import type { responseActions } from "@/type/server";
import { registerFormSchema, type registerFormSchemaType } from "@/schemas";

import { db } from "./db";
import { imagesTable, usersTable } from "./db/schema";
import { QUERIES } from "./db/queries";
import { getSession } from "./auth";
import { AuthError } from "next-auth";
import { signIn } from "./auth/index";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const createFile = async (metadata: UploadResult) => {
  if (metadata.isError) return;

  const { error, userId } = await getSession();

  if (error || !userId) {
    return;
  }

  await db.insert(imagesTable).values({
    id: uuidv7(),
    userId: userId,
    name: metadata.originalName,
    uniqueName: metadata.uniqueName,
    fileSize: metadata.fileSize,
    url: metadata.fileUrl,
  });
};

export const register = async (
  request: registerFormSchemaType,
): Promise<responseActions> => {
  const validateFields = registerFormSchema.safeParse(request);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { username, password } = validateFields.data;

  try {
    const admin = await QUERIES.getAdmin();

    if (!admin.length || !admin[0]) {
      const hashPassword = await argon2.hash(password);
      await db.insert(usersTable).values({
        username: username,
        password: hashPassword,
        role: "admin",
        email: "dummy@email.id",
      });
      return { success: "Akun berhasil dibuat" };
    }

    return {
      error:
        "Akun admin sudah pernah dibuat, mohon untuk login pada akun tersebut!",
    };
  } catch (error) {
    console.log("REGISTER ERRROR : ", error);
    return { error: "Internal server error!" };
  }
};

export const login = async (
  request: registerFormSchemaType,
): Promise<responseActions> => {
  const validateFields = registerFormSchema.safeParse(request);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { username, password } = validateFields.data;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    console.log({ res });
    return { success: "Login Success" };
  } catch (error) {
    console.log("LOGIN ERRROR : ", error);
    if (error instanceof AuthError) {
      const { type, cause } = error;
      switch (type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        case "CallbackRouteError":
          return { error: cause?.err?.toString() };
        default:
          return { error: "Something went wrong!" };
      }
    }

    if (isRedirectError(error)) {
      throw error; // Re-throw the redirect error to allow Next.js to handle it
    }

    throw error;
  }
};
