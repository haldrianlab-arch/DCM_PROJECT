/**
 * `pnpm db:seed`: kembalikan database ke data demo (tech.md §11, NFR-08).
 * PR 2: akun demo saja. PR 3 menambah lokasi, katalog, dan seterusnya.
 *
 * PERINGATAN: mengosongkan tabel terlebih dahulu. Pastikan DATABASE_URL menunjuk branch
 * yang benar (lokal: branch Neon `dev`).
 */
import { existsSync } from "node:fs";

import { getDb } from "../../src/server/db/client";
import { DEMO_USERS, seedUsers } from "./users";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

async function main() {
  const password = process.env.SEED_PASSWORD;
  if (!password) {
    throw new Error("SEED_PASSWORD belum diisi. Isi di .env.local (lihat .env.example).");
  }
  const db = getDb();
  try {
    await seedUsers(db, password);
    console.log(
      `Seed selesai: ${DEMO_USERS.length} akun demo (${DEMO_USERS.map((u) => u.email).join(", ")}).`,
    );
  } finally {
    await db.$client.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
