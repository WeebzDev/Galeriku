"use server";

import * as argon2 from "argon2";
import { eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "./db";
import { imagesTable, tagsTable, usersTable } from "./db/schema";
import { QUERIES } from "./db/queries";
import { getSession } from "./auth";

import { createJWT } from "@/lib/utils";
import type { UploadResult } from "@/lib/dropio/client";
import type { responseActions } from "@/type/server";
import {
  createTagSchema,
  registerFormSchema,
  loginFormSchema,
  type loginFormSchemaType,
  type createTagSchemaType,
  type registerFormSchemaType,
} from "@/schemas";
import { dioApi } from "./dropio";

export const createFile = async (
  metadata: UploadResult,
): Promise<responseActions> => {
  if (metadata.isError) return { error: "Invalid Metadata" };

  const { error, user } = await getSession();

  if (error || !user) {
    return { error: "Mohon Untuk login terlebih dahulu!" };
  }

  await db.insert(imagesTable).values({
    userId: user.id,
    name: metadata.originalName,
    uniqueName: metadata.uniqueName,
    fileSize: metadata.fileSize,
    url: metadata.fileUrl,
  });

  return { success: "Berhasil menambahkan gambar!" };
};

export const createTag = async (
  request: createTagSchemaType,
): Promise<responseActions> => {
  const validateFields = createTagSchema.safeParse(request);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name } = validateFields.data;

  const { error, user } = await getSession();

  if (error || !user) {
    return { error: "Mohon Untuk login terlebih dahulu!" };
  }

  const [tags] = await QUERIES.getTagsByName(name);

  if (tags) {
    return {
      error: "Tag ini sudah pernah dibuat, mohon buat dengan nama lain!",
    };
  }

  await db.insert(tagsTable).values({
    name: name,
  });

  return { success: "Berhasil membuat tag baru!" };
};

export const changeTagInImage = async (
  selectedImage: string[],
  tagId: string,
): Promise<responseActions> => {
  const { error, user } = await getSession();

  if (error || !user) {
    return { error: "Mohon Untuk login terlebih dahulu!" };
  }

  if (!selectedImage.length) {
    return { error: "Minimal pilih satu gambar!" };
  }

  await db
    .update(imagesTable)
    .set({ tagId: tagId })
    .where(inArray(imagesTable.id, selectedImage));

  return { success: "Berhasil mengganti tag paga gambar!" };
};

export const deleteImages = async (
  selectedImage: string[],
): Promise<responseActions> => {
  const { error, user } = await getSession();

  if (error || !user) {
    return { error: "Mohon Untuk login terlebih dahulu!" };
  }

  if (!selectedImage.length) {
    return { error: "Minimal pilih satu gambar!" };
  }

  const images = await QUERIES.getImagesByIds(selectedImage);
  const uniqueName = images.map((item) => item.uniqueName);

  console.log({ images, selectedImage, uniqueName });

  if (!uniqueName.length) {
    return { error: "Gambar Tidak Ditemukan" };
  }

  const response = await dioApi.delete(uniqueName);

  if (response.success) {
    await db.delete(imagesTable).where(inArray(imagesTable.id, selectedImage));
    return { success: "Berhasil menghapus gambar!" };
  } else {
    return {
      success: "Gagal menghapus gambar, mohon coba beberapa menit lagi!",
    };
  }
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

export const createNewMember = async (
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

  const { error, user: session } = await getSession();

  if (error || !session) {
    return { error: "Mohon Untuk login terlebih dahulu!" };
  }

  if (session.role !== "admin") {
    return { error: "Hanya admin yang dapat membuat member baru!" };
  }

  const [user] = await QUERIES.getUserByUsername(username);

  if (user) {
    return {
      error: "Username ini sudah pernah dibuat, mohon gunakan username lain!",
    };
  }

  const hashPassword = await argon2.hash(password);
  await db.insert(usersTable).values({
    username: username,
    password: hashPassword,
    role: "member",
  });

  return { success: "Akun berhasil dibuat" };
};

export const deleteMember = async (
  memberId: string,
): Promise<responseActions> => {
  if (!memberId) {
    return { error: "Member Id Required!" };
  }

  const { error, user: session } = await getSession();

  if (error || !session) {
    return { error: "Mohon Untuk login terlebih dahulu!" };
  }

  if (session.role !== "admin") {
    return { error: "Hanya admin yang dapat menghapus member!" };
  }

  const [user] = await QUERIES.getUserByUserId(memberId);

  console.log({ user, memberId });

  if (!user) {
    return {
      error: "User Tidak Ditemukan",
    };
  }

  await db.delete(usersTable).where(eq(usersTable.id, memberId));

  return { success: "Akun berhasil dihapus" };
};

export const logout = async (): Promise<responseActions> => {
  const cookie = await cookies();

  cookie.delete("weebzdev.gl-token");

  return { success: "Berhasil Logout" };
};
