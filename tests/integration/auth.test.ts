import { eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DEMO_USERS, seedUsers } from "../../db/seed/users";
import { getAuth, resolveBaseUrl } from "@/server/auth";
import { getDb } from "@/server/db/client";
import { session, user } from "@/server/db/schema";
import { attemptSignIn, LOGIN_FAILED } from "@/server/sign-in";
import { canRunAuthTests, SEED_PASSWORD, sessionHeaders } from "./helpers";

/**
 * US-AUTH-01 terhadap database sungguhan (Neon branch dev lokal, branch sementara di CI).
 * Catatan: menjalankan seed, sehingga tabel auth di-reset ke akun demo.
 */
describe.skipIf(!canRunAuthTests)("login (US-AUTH-01)", () => {
  const db = getDb();
  const noHeaders = () => new Headers();

  beforeAll(async () => {
    await seedUsers(db, SEED_PASSWORD);
  });

  afterAll(async () => {
    await db.delete(user).where(sql`${user.email} like 'tes-%@kampus.ac.id'`);
  });

  it.each(DEMO_USERS.map((u) => [u.email, u.role] as const))(
    "AC1: %s login berhasil dengan peran %s",
    async (email, role) => {
      const result = await attemptSignIn({ email, password: SEED_PASSWORD }, noHeaders());
      expect(result).toEqual({ ok: true, role });
    },
  );

  it("AC1: email tidak peka huruf besar dan spasi", async () => {
    const result = await attemptSignIn(
      { email: "  ANDI@Kampus.ac.id ", password: SEED_PASSWORD },
      noHeaders(),
    );
    expect(result).toEqual({ ok: true, role: "admin" });
  });

  it("AC2: password salah → pesan umum", async () => {
    const result = await attemptSignIn(
      { email: "andi@kampus.ac.id", password: `${SEED_PASSWORD}x` },
      noHeaders(),
    );
    expect(result).toEqual({ ok: false, message: LOGIN_FAILED });
  });

  it("AC2: email tidak terdaftar dan isian tidak valid → pesan yang sama", async () => {
    const unknown = await attemptSignIn(
      { email: "tidak-ada@kampus.ac.id", password: SEED_PASSWORD },
      noHeaders(),
    );
    const invalid = await attemptSignIn({ email: "bukan-email", password: "" }, noHeaders());
    expect(unknown).toEqual({ ok: false, message: LOGIN_FAILED });
    expect(invalid).toEqual({ ok: false, message: LOGIN_FAILED });
  });

  it("AC3: akun dinonaktifkan → ditolak dengan pesan yang sama dan sesinya berakhir", async () => {
    const auth = getAuth();
    const admin = await sessionHeaders("andi@kampus.ac.id");
    const email = "tes-nonaktif@kampus.ac.id";
    const created = await auth.api.createUser({
      body: { email, password: SEED_PASSWORD, name: "Tes nonaktif", role: "viewer" },
      headers: admin,
    });
    const userId = created.user.id;

    await sessionHeaders(email); // user ini sedang login
    const before = await db.select().from(session).where(eq(session.userId, userId));
    expect(before.length).toBeGreaterThan(0);

    await auth.api.banUser({ body: { userId }, headers: admin });

    const after = await db.select().from(session).where(eq(session.userId, userId));
    expect(after).toHaveLength(0);
    const result = await attemptSignIn({ email, password: SEED_PASSWORD }, noHeaders());
    expect(result).toEqual({ ok: false, message: LOGIN_FAILED });
  });

  it("AC5: pendaftaran mandiri ditolak", async () => {
    const base = resolveBaseUrl() ?? "http://localhost:3000";
    const email = "tes-daftar@kampus.ac.id";
    const response = await getAuth().handler(
      new Request(`${base}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: new URL(base).origin },
        body: JSON.stringify({ email, password: "password-panjang", name: "Tes daftar" }),
      }),
    );
    expect(response.ok).toBe(false);
    const rows = await db.select().from(user).where(eq(user.email, email));
    expect(rows).toHaveLength(0);
  });
});

describe.skipIf(!canRunAuthTests)("tabel user dan seed", () => {
  const db = getDb();

  it("Teknisi wajib punya keahlian (CHECK user_technician_skill)", async () => {
    await expect(
      db.insert(user).values({
        name: "Tes teknisi",
        email: "tes-teknisi@kampus.ac.id",
        role: "technician",
        skill: null,
      }),
    ).rejects.toThrow();
  });

  it("seed dapat dijalankan berulang dan selalu menghasilkan 4 akun demo", async () => {
    await seedUsers(db, SEED_PASSWORD);
    await seedUsers(db, SEED_PASSWORD);
    const rows = await db.select({ email: user.email, role: user.role }).from(user);
    expect(rows.map((r) => r.email).sort()).toEqual(DEMO_USERS.map((u) => u.email).sort());
  });

  it("seed menolak password pendek", async () => {
    await expect(seedUsers(db, "pendek")).rejects.toThrow(/minimal 8/);
  });
});
