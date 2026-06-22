import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  content: text("content").notNull().default(""),
  status: text("status").notNull().default("active"),
  tags: text("tags").array().notNull().default([]),
  link: text("link"),
  coverUrl: text("cover_url"),
  year: text("year"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const papers = pgTable("papers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  abstract: text("abstract").notNull().default(""),
  content: text("content").notNull().default(""),
  authors: text("authors").notNull().default(""),
  venue: text("venue"),
  year: text("year"),
  link: text("link"),
  pdfUrl: text("pdf_url"),
  tags: text("tags").array().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  year: text("year"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  tags: text("tags").array().notNull().default([]),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Project = typeof projects.$inferSelect
export type Paper = typeof papers.$inferSelect
export type Post = typeof posts.$inferSelect
