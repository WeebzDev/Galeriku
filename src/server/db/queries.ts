import "server-only";

import { db } from "@/server/db";
import { imagesTable, tagsTable, usersTable } from "./schema";
import { eq } from "drizzle-orm";

export const QUERIES = {
  getAllImages: function () {
    return db.select().from(imagesTable).orderBy(imagesTable.createdAt);
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
};
