import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit tidak membaca .env.local seperti Next.js; muat dengan fungsi bawaan Node 22.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    // Migrasi lewat koneksi langsung (tanpa pooler) bila tersedia; integrasi Neon-Vercel
    // menyediakan DATABASE_URL_UNPOOLED. Lokal cukup DATABASE_URL.
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "",
  },
  strict: true,
  verbose: true,
});
