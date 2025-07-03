// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `galeriku_${name}`);

export const usersTable = createTable(
  "users",
  (d) => ({
    id: d.varchar().primaryKey(),
    username: d.varchar({ length: 256 }).notNull(),
    password: d.varchar({ length: 256 }).notNull(),
    role: d.varchar({ length: 256 }).notNull(),
  }),
  (t) => [index("username_idx").on(t.username)],
);

export type DB_UsersType = typeof usersTable.$inferSelect;

export const imagesTable = createTable("images", (d) => ({
  id: d.varchar({ length: 256 }).primaryKey(),
  userId: d
    .varchar({ length: 256 })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: d.varchar({ length: 256 }).notNull(),
  uniqueName: d.varchar({ length: 256 }).notNull(),
  fileSize: d.bigint({ mode: "number" }).notNull(),
  url: d.varchar({ length: 256 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const imagesRelations = relations(imagesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [imagesTable.userId],
    references: [usersTable.id],
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  images: many(imagesTable),
}));

export type DB_ImagesType = typeof imagesTable.$inferSelect;

export const tagsTable = createTable("tags", (d) => ({
  id: d.varchar({ length: 256 }).primaryKey(),
  name: d.varchar({ length: 256 }).notNull(),
}));

export type DB_TagType = typeof tagsTable.$inferSelect;

export const imageTagsTable = createTable(
  "image_tags",
  (d) => ({
    imageId: d
      .varchar("imageId")
      .notNull()
      .references(() => imagesTable.id, { onDelete: "cascade" }),
    tagId: d
      .varchar("tagId")
      .notNull()
      .references(() => tagsTable.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.imageId, t.tagId] })],
);

export type DB_ImageTagType = typeof imageTagsTable.$inferSelect;
