import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/cron/daily/route";
import { isAuthorizedCron } from "@/server/cron/auth";

const request = (authorization?: string) =>
  new Request("http://localhost/api/cron/daily", {
    headers: authorization ? { authorization } : {},
  });

describe("isAuthorizedCron", () => {
  it("menolak bila CRON_SECRET belum diisi, walau header ada", () => {
    expect(isAuthorizedCron("Bearer ", undefined)).toBe(false);
    expect(isAuthorizedCron("Bearer ", "")).toBe(false);
  });

  it("menolak tanpa header", () => {
    expect(isAuthorizedCron(null, "rahasia")).toBe(false);
  });

  it("menolak secret salah atau tanpa awalan Bearer", () => {
    expect(isAuthorizedCron("Bearer salah", "rahasia")).toBe(false);
    expect(isAuthorizedCron("rahasia", "rahasia")).toBe(false);
  });

  it("menerima header yang benar", () => {
    expect(isAuthorizedCron("Bearer rahasia", "rahasia")).toBe(true);
  });
});

describe("GET /api/cron/daily", () => {
  beforeEach(() => {
    vi.stubEnv("CRON_SECRET", "rahasia-tes");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("401 tanpa header Authorization", async () => {
    const res = await GET(request());
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ ok: false });
  });

  it("401 dengan secret salah", async () => {
    const res = await GET(request("Bearer salah"));
    expect(res.status).toBe(401);
  });

  it("200 dengan secret benar", async () => {
    const res = await GET(request("Bearer rahasia-tes"));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, steps: [] });
  });
});
