import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const bhandarasTable = pgTable("bhandaras", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  temple: text("temple").notNull(),
  description: text("description"),
  locality: text("locality").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  prasad: text("prasad").notNull(),
  organizerName: text("organizer_name").notNull(),
  organizerPhone: text("organizer_phone"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  verificationStatus: text("verification_status").notNull().default("pending"),
  verificationNote: text("verification_note"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertBhandaraSchema = createInsertSchema(bhandarasTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBhandara = z.infer<typeof insertBhandaraSchema>;
export type Bhandara = typeof bhandarasTable.$inferSelect;

export const favoritesTable = pgTable(
  "bhandara_favorites",
  {
    id: serial("id").primaryKey(),
    bhandaraId: integer("bhandara_id")
      .notNull()
      .references(() => bhandarasTable.id, { onDelete: "cascade" }),
    userKey: text("user_key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    bhandaraUserKeyUnique: uniqueIndex("bhandara_favorites_bhandara_user_key").on(
      table.bhandaraId,
      table.userKey,
    ),
  }),
);

export const reportsTable = pgTable("bhandara_reports", {
  id: serial("id").primaryKey(),
  bhandaraId: integer("bhandara_id")
    .notNull()
    .references(() => bhandarasTable.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  note: text("note"),
  reporterKey: text("reporter_key"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favoritesTable).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reportsTable).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;