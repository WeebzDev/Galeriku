import "server-only";

import { db } from "@/server/db";
import { imagesTable, tagsTable, usersTable } from "./schema";
import { eq, ilike, inArray } from "drizzle-orm";

export const QUERIES = {
  getAllImages: function () {
    return db.select().from(imagesTable).orderBy(imagesTable.createdAt);
  },
  getAllImagesFilter: function (tag: string | undefined) {
    tag ??= "";

    return db
      .select()
      .from(imagesTable)
      .orderBy(imagesTable.createdAt)
      .where(eq(imagesTable.tagId, tag));
  },
  getImagesByIds: function (ids: string[]) {
    return db
      .select()
      .from(imagesTable)
      .orderBy(imagesTable.createdAt)
      .where(inArray(imagesTable.id, ids));
  },
  getAdmin: function () {
    return db.select().from(usersTable).where(eq(usersTable.role, "admin"));
  },
  getUserByUsername: function (username: string) {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));
  },
  getUserByUserId: function (id: string) {
    return db.select().from(usersTable).where(eq(usersTable.id, id));
  },
  getAllTags: function () {
    return db.select().from(tagsTable);
  },
  getTagsByName: function (name: string) {
    return db.select().from(tagsTable).where(ilike(tagsTable.name, name));
  },
  getAllMember: function () {
    return db.select().from(usersTable).where(eq(usersTable.role, "member"));
  },
};
