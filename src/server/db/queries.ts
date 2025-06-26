import "server-only";

import { db } from "@/server/db";
import { imagesTable } from "./schema";

export const QUERIES = {
  getAllImages: function () {
    return db.select().from(imagesTable).orderBy(imagesTable.createdAt);
  },
};
