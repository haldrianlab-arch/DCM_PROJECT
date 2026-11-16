import { beforeAll, describe, expect, it, vi } from "vitest";

import { seedUsers } from "../../db/seed/users";
import { getDb } from "@/server/db/client";
import { canRunAuthTests, SEED_PASSWORD, sessionHeaders } from "./helpers";

/**
 * US-AUTH-03 AC1 (fondasi): authorize() adalah langkah pertama setiap server action mutasi.
 * next/headers diganti header sesi hasil login sungguhan, karena tes berjalan di luar Next.js.
 */
let currentHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => currentHeaders }));

const { authorize } = await import("@/server/authz");

describe.skipIf(!canRunAuthTests)("authorize (US-AUTH-03)", () => {
  const as = {} as Record<"admin" | "technician" | "viewer", Headers>;

  beforeAll(async () => {
    await seedUsers(getDb(), SEED_PASSWORD);
    as.admin = await sessionHeaders("andi@kampus.ac.id");
    as.technician = await sessionHeaders("rina@kampus.ac.id");
    as.viewer = await sessionHeaders("sari@kampus.ac.id");
  });

  it("tanpa sesi → unauthenticated", async () => {
    currentHeaders = new Headers();
    expect(await authorize("admin")).toMatchObject({ ok: false, code: "unauthenticated" });
  });

  it.each(["technician", "viewer"] as const)(
    "aksi khusus Admin ditolak untuk %s, walau dikirim langsung ke server",
    async (role) => {
      currentHeaders = as[role];
      expect(await authorize("admin")).toMatchObject({ ok: false, code: "forbidden" });
    },
  );

  it("Admin diizinkan dan menerima data user", async () => {
    currentHeaders = as.admin;
    const result = await authorize("admin");
    expect(result).toMatchObject({ ok: true, user: { email: "andi@kampus.ac.id", role: "admin" } });
  });

  it("aksi untuk beberapa peran: Teknisi diizinkan, Viewer tidak", async () => {
    currentHeaders = as.technician;
    expect(await authorize("admin", "technician")).toMatchObject({
      ok: true,
      user: { role: "technician", skill: "it" },
    });
    currentHeaders = as.viewer;
    expect(await authorize("admin", "technician")).toMatchObject({ ok: false, code: "forbidden" });
  });
});
