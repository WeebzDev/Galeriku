// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { v7 as uuidv7 } from "uuid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const usersTable = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  username: d.varchar({ length: 256 }).notNull(),
  role: d.varchar({ length: 256 }).notNull(),
  password: d.varchar({ length: 256 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
}));

export type DB_UsersType = typeof usersTable.$inferSelect;

export const imagesTable = createTable("images", (d) => ({
  id: d.varchar({ length: 256 }).primaryKey(),
  userId: d
    .varchar({ length: 256 })
    .notNull()
    .references(() => usersTable.id),
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

export const imagesRelations = relations(imagesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [imagesTable.userId],
    references: [usersTable.id],
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
  images: many(imagesTable),
}));

export const accountsTable = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => usersTable.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export type DB_AccountsType = typeof accountsTable.$inferSelect;

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsTable = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => usersTable.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export type DB_SessionsType = typeof sessionsTable.$inferSelect;

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const verificationTokensTable = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export type DB_CerificationTokensType =
  typeof verificationTokensTable.$inferSelect;
