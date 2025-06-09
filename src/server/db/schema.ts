// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTable, varchar, pgTableCreator, timestamp, jsonb } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hcat_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)]
);


export const chats = pgTable('chats', {
  id: varchar({ length: 255 }).primaryKey(),
  createdAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()
});

// export const message = pgTable('Message_v2', {
//   id: uuid('id').primaryKey().notNull().defaultRandom(),
//   chatId: uuid('chatId')
//     .notNull()
//     .references(() => chat.id),
//   role: varchar('role').notNull(),
//   parts: json('parts').notNull(),
//   attachments: json('attachments').notNull(),
//   createdAt: timestamp('createdAt').notNull(),
// });

export const messages = pgTable('messages', {
  id: varchar({ length: 255 }).primaryKey(),
  createdAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  content: varchar({ length: 8191 }).notNull(),
  reasoning: varchar({ length: 8191 }),
  experimental_attachments: jsonb(),
  role: varchar({ length: 16 }).notNull(),
  data: jsonb(),
  annotations: jsonb(),
  toolInvocations: jsonb(),
  parts: jsonb(),
  chatId: varchar({ length: 255 }).notNull().references(() => chats.id)
})

