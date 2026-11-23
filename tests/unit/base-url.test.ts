import { describe, expect, it } from "vitest";

import { normalizeOrigin, resolveBaseUrl, resolveTrustedOrigins } from "@/server/base-url";

/**
 * Build produksi PR 2 sempat gagal ("TypeError: Invalid URL") karena BETTER_AUTH_URL di Vercel
 * tidak berbentuk URL lengkap. Nilai env harus dirapikan, dan nilai rusak tidak boleh
 * menggagalkan build.
 */
describe("normalizeOrigin", () => {
  it.each([
    ["https://dcmproject.vercel.app", "https://dcmproject.vercel.app"],
    ["https://dcmproject.vercel.app/", "https://dcmproject.vercel.app"],
    ["https://dcmproject.vercel.app/login", "https://dcmproject.vercel.app"],
    ["dcmproject.vercel.app", "https://dcmproject.vercel.app"],
    ["  dcmproject.vercel.app  ", "https://dcmproject.vercel.app"],
    ['"https://dcmproject.vercel.app"', "https://dcmproject.vercel.app"],
    ["'dcmproject.vercel.app'", "https://dcmproject.vercel.app"],
    ["http://localhost:3000", "http://localhost:3000"],
    ["localhost:3100", "http://localhost:3100"],
    ["HTTPS://DCMPROJECT.VERCEL.APP", "https://dcmproject.vercel.app"],
  ])("%j → %s", (raw, expected) => {
    expect(normalizeOrigin(raw)).toBe(expected);
  });

  it.each([undefined, "", "   ", '""', "https://", "bukan url sama sekali", "http://a b.com"])(
    "nilai rusak %j → null",
    (raw) => {
      expect(normalizeOrigin(raw)).toBeNull();
    },
  );
});

describe("resolveBaseUrl", () => {
  it("memakai BETTER_AUTH_URL bila valid (lokal dan produksi)", () => {
    expect(
      resolveBaseUrl({
        BETTER_AUTH_URL: "dcmproject.vercel.app",
        VERCEL_URL: "dcmproject-abc.vercel.app",
      }),
    ).toBe("https://dcmproject.vercel.app");
  });

  it("preview tanpa BETTER_AUTH_URL memakai URL branch dari Vercel", () => {
    expect(
      resolveBaseUrl({
        VERCEL_BRANCH_URL: "dcmproject-git-feat-x.vercel.app",
        VERCEL_URL: "dcmproject-abc.vercel.app",
      }),
    ).toBe("https://dcmproject-git-feat-x.vercel.app");
  });

  it("BETTER_AUTH_URL rusak tidak menggagalkan build: kembali ke URL Vercel", () => {
    expect(
      resolveBaseUrl({
        BETTER_AUTH_URL: "bukan url",
        VERCEL_PROJECT_PRODUCTION_URL: "dcmproject.vercel.app",
      }),
    ).toBe("https://dcmproject.vercel.app");
  });

  it("produksi dengan BETTER_AUTH_URL rusak memakai domain utama, bukan alamat branch", () => {
    expect(
      resolveBaseUrl({
        VERCEL_ENV: "production",
        BETTER_AUTH_URL: "bukan url",
        VERCEL_BRANCH_URL: "dcmproject-git-main.vercel.app",
        VERCEL_URL: "dcmproject-xyz.vercel.app",
        VERCEL_PROJECT_PRODUCTION_URL: "dcmproject.vercel.app",
      }),
    ).toBe("https://dcmproject.vercel.app");
  });

  it("tanpa sumber apa pun → undefined (Better Auth memakai origin permintaan)", () => {
    expect(resolveBaseUrl({})).toBeUndefined();
  });
});

describe("resolveTrustedOrigins", () => {
  it("menggabungkan semua sumber yang valid tanpa duplikat dan tanpa nilai rusak", () => {
    expect(
      resolveTrustedOrigins({
        BETTER_AUTH_URL: "https://dcmproject.vercel.app/",
        VERCEL_URL: "dcmproject-abc.vercel.app",
        VERCEL_BRANCH_URL: "bukan url",
        VERCEL_PROJECT_PRODUCTION_URL: "dcmproject.vercel.app",
      }),
    ).toEqual(["https://dcmproject.vercel.app", "https://dcmproject-abc.vercel.app"]);
  });
});
