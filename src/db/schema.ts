import type { JSONContent } from '@tiptap/core'

import {
  pgTable,
  serial,
  varchar,
  jsonb,
  integer,
  boolean,
  timestamp,
  index,
  pgEnum,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core'

export const logTypeEnum = pgEnum('LogType', ['CREATE', 'UPDATE', 'DELETE'])

export const category = pgTable(
  'category',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    keywords: varchar('keywords', { length: 255 }),
    rank: integer('rank').notNull().default(5000),
    parentId: integer('parentId').references((): AnyPgColumn => category.id),
    lang: varchar('lang', { length: 20 }).notNull().default('en-US'),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .notNull()
      .defaultNow(),
    published: boolean('published').notNull().default(true),
  },
  (t) => [
    {
      rankCreatedAtIdx: index().on(t.rank, t.createdAt),
      parentIdIdx: index().on(t.parentId),
    },
  ]
)

export type Category = typeof category.$inferSelect
export type NewCategory = typeof category.$inferInsert

export const post = pgTable(
  'post',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    keywords: varchar('keywords', { length: 255 }),
    content: jsonb('content').notNull().$type<JSONContent>(),
    rank: integer('rank').notNull().default(5000),
    authorId: varchar('authorId', { length: 255 }).notNull(),
    categoryId: integer('categoryId')
      .notNull()
      .references(() => category.id),
    lang: varchar('lang', { length: 20 }).notNull().default('en-US'),
    writtenAt: timestamp('writtenAt', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .notNull()
      .defaultNow(),
    published: boolean('published').notNull().default(false),
  },
  (t) => [
    {
      authorIdIdx: index().on(t.authorId),
      rankWrittenAtIdx: index().on(t.rank, t.writtenAt),
      categoryIdIdx: index().on(t.categoryId),
    },
  ]
)

export type Post = typeof post.$inferSelect
export type NewPost = typeof post.$inferInsert

export const postLog = pgTable(
  'postLog',
  {
    logId: serial('logId').primaryKey(),
    logType: logTypeEnum('logType').notNull(),
    logTime: timestamp('logTime', { withTimezone: true })
      .notNull()
      .defaultNow(),
    id: integer('id').notNull(),
    slug: varchar('slug', { length: 255 }),
    title: varchar('title', { length: 255 }),
    description: varchar('description', { length: 255 }),
    keywords: varchar('keywords', { length: 255 }),
    content: jsonb('content').$type<JSONContent>(),
    rank: integer('rank'),
    authorId: varchar('authorId', { length: 255 }),
    categoryId: integer('categoryId'),
    lang: varchar('lang', { length: 20 }),
    writtenAt: timestamp('writtenAt', { withTimezone: true }),
    createdAt: timestamp('createdAt', { withTimezone: true }),
    updatedAt: timestamp('updatedAt', { withTimezone: true }),
    published: boolean('published'),
  },
  (t) => [
    {
      idLogTimeIdx: index().on(t.id, t.logTime),
      logTimeIdx: index().on(t.logTime),
    },
  ]
)

export type PostLog = typeof postLog.$inferSelect
export type NewPostLog = typeof postLog.$inferInsert
