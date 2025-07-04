"use server";

import { v7 as uuidv7 } from "uuid";
import * as argon2 from "argon2";

import type { UploadResult } from "@/lib/dropio/client";
import {
  loginFormSchema,
  type loginFormSchemaType,
} from "@/schemas/login-schema";

import { db } from "./db";
import { imagesTable, usersTable } from "./db/schema";
import { QUERIES } from "./db/queries";
import { createJWT } from "@/lib/utils";
import { cookies } from "next/headers";
import { getSession } from "./auth";
import type { responseActions } from "@/type/server";
import { registerFormSchema, type registerFormSchemaType } from "@/schemas";

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

export const login = async (
  request: loginFormSchemaType,
): Promise<responseActions> => {
  const cookie = await cookies();

  const validateFields = loginFormSchema.safeParse(request);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { username, password } = validateFields.data;

  const users = await QUERIES.getUserByUsername(username);
  const existingUser = users[0];

  if (!existingUser) {
    return { error: "Akun tidak ditemukan" };
  }

  const comparePassword = await argon2.verify(existingUser.password, password);

  if (!comparePassword) {
    return { error: "Invalid Password" };
  }

  const jwt = await createJWT({ jti: existingUser.id });

  cookie.set("weebzdev.gl-token", jwt, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return { success: "Login Success" };
};

export const register = async (
  request: registerFormSchemaType,
): Promise<responseActions> => {
  const validateFields = registerFormSchema.safeParse(request);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { username, password, confirm_password } = validateFields.data;

  if (password !== confirm_password) {
    return { error: "Password dan confirm password berbeda!" };
  }

  const admin = await QUERIES.getAdmin();
  const existingAdmin = admin[0];

  if (existingAdmin) {
    return {
      error:
        "Akun admin sudah pernah dibuat, mohon untuk login pada akun tersebut!",
    };
  }

  const hashPassword = await argon2.hash(password);
  await db.insert(usersTable).values({
    username: username,
    password: hashPassword,
    role: "admin",
  });

  return { success: "Akun berhasil dibuat" };
};
