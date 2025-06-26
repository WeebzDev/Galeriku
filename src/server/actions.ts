"use server";

import { v7 as uuidv7 } from "uuid";

import type { UploadResult } from "@/lib/dropio/client";
import { db } from "./db";
import { imagesTable } from "./db/schema";

export const createFile = async (metadata: UploadResult) => {
  if (metadata.isError) return;

  await db.insert(imagesTable).values({
    id: uuidv7(),
    userId: "uwu",
    name: metadata.originalName,
    uniqueName: metadata.uniqueName,
    fileSize: metadata.fileSize,
    url: metadata.fileUrl,
  });
};
