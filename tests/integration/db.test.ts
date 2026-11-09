import { sql } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";

import { getDb } from "@/server/db/client";

/**
 * Bukti koneksi ke Neon lewat driver neon-serverless. Dilewati bila DATABASE_URL kosong
 * (CI PR 1). Mulai PR 3, CI menjalankannya terhadap branch Neon sementara.
 */
describe.skipIf(!process.env.DATABASE_URL)("koneksi database", () => {
  afterAll(async () => {
    await getDb().$client.end();
  });

  it("select 1", async () => {
    const result = await getDb().execute(sql`select 1 as one`);
    expect(result.rows[0]).toEqual({ one: 1 });
  });

  it("transaksi interaktif tersedia", async () => {
    const value = await getDb().transaction(async (tx) => {
      const r = await tx.execute(sql`select 2 as two`);
      return r.rows[0];
    });
    expect(value).toEqual({ two: 2 });
  });
});
