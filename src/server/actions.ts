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

export const login = async (request: loginFormSchemaType) => {
  const cookie = await cookies();

  const validateFields = loginFormSchema.safeParse(request);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { username, password } = validateFields.data;

  const [admin] = await Promise.all([QUERIES.getAdmin()]);

  if (!admin.length || !admin[0]) {
    const hashPassword = await argon2.hash(password);
    const user = await db
      .insert(usersTable)
      .values({
        id: uuidv7(),
        username: username,
        password: hashPassword,
        role: "admin",
      })
      .returning();

    const jwt = await createJWT({ jti: user[0]!.id, sub: user[0]!.role });

    cookie.set("wb-token", jwt);

    return { success: "Login Success" };
  }

  const validPassword = await argon2.verify(admin[0].password, password);

  if (!validPassword) {
    return { error: "Invalid Password" };
  }

  const jwt = await createJWT({ jti: admin[0].id });

  cookie.set("wb-token", jwt);

  return { success: "Login Success" };
};
