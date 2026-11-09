import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "./schema";

/**
 * Koneksi database (tech.md T3): driver neon-serverless lewat WebSocket `Pool`,
 * agar `db.transaction` interaktif tersedia. Node 22 sudah punya WebSocket global.
 */
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL belum diisi. Salin .env.example ke .env.local lalu isi nilainya.");
  }
  return drizzle({ client: new Pool({ connectionString: url }), schema });
}

type Db = ReturnType<typeof createDb>;

let instance: Db | undefined;

/** Instance database tunggal per proses; dibuat saat pertama dipakai. */
export function getDb(): Db {
  instance ??= createDb();
  return instance;
}
