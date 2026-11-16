/**
 * Skema Drizzle (tech.md §4). PR 2: tabel autentikasi yang dikelola Better Auth.
 * Tabel lain (lokasi, katalog, device, cable, maintenance, sistem) ditambahkan di PR 3.
 *
 * Nama tabel dan kolom bahasa Inggris, snake_case. ID bertipe uuid (Better Auth diatur
 * `generateId: "uuid"`). Properti TypeScript camelCase karena adapter Better Auth membaca
 * nama properti, bukan nama kolom.
 */
import { sql } from "drizzle-orm";
import { boolean, check, index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Path relatif (bukan @/) karena berkas ini juga dibaca drizzle-kit.
import { ROLES, SKILLS } from "../../domain/roles";

// tech.md §4.1. Daftar nilai diambil dari domain agar satu sumber.
export const roleEnum = pgEnum("role", ROLES);
export const skillEnum = pgEnum("skill", SKILLS);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/** User aplikasi. `banned` dari plugin admin dipakai sebagai "nonaktif" (tech.md §4.2). */
export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    role: roleEnum("role").notNull().default("viewer"),
    skill: skillEnum("skill"),
    banned: boolean("banned").notNull().default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    // Keahlian wajib untuk Teknisi (PRD Lampiran C).
    check("user_technician_skill", sql`${t.role} <> 'technician' OR ${t.skill} IS NOT NULL`),
  ],
);

export const session = pgTable(
  "session",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    token: text("token").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    impersonatedBy: text("impersonated_by"),
    ...timestamps,
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

/** Kredensial login. Untuk email + password: provider_id = "credential", password = hash. */
export const account = pgTable(
  "account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);
