import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";
import { createAccessControl } from "better-auth/plugins/access";

import { getDb } from "./db/client";
import * as schema from "./db/schema";

/**
 * Konfigurasi Better Auth (tech.md §6.1, T2).
 * - Login email + password; pendaftaran mandiri dimatikan (US-AUTH-01 AC5).
 * - Plugin admin: tiga peran, nonaktifkan user = ban (sesi dicabut), atur ulang password.
 * - Sesi disimpan di database; hash password bawaan (scrypt).
 */

// Hak plugin admin (kelola user, cabut sesi) hanya untuk Admin. Teknisi dan Viewer
// tidak punya hak apa pun di plugin ini; hak bisnis mereka dicek di server/authz.ts.
const ac = createAccessControl(defaultStatements);
const roles = {
  admin: ac.newRole(adminAc.statements),
  technician: ac.newRole({}),
  viewer: ac.newRole({}),
};

/**
 * URL dasar aplikasi. Lokal dan produksi memakai BETTER_AUTH_URL; preview Vercel
 * berganti URL setiap deploy, jadi diambil dari variabel bawaan Vercel.
 */
export function resolveBaseUrl(env: NodeJS.ProcessEnv = process.env): string | undefined {
  if (env.BETTER_AUTH_URL) return env.BETTER_AUTH_URL;
  const host = env.VERCEL_BRANCH_URL ?? env.VERCEL_URL;
  return host ? `https://${host}` : undefined;
}

function trustedOrigins(env: NodeJS.ProcessEnv = process.env): string[] {
  const hosts = [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL];
  const origins = hosts.filter((h): h is string => !!h).map((h) => `https://${h}`);
  const base = resolveBaseUrl(env);
  if (base) origins.push(new URL(base).origin);
  return [...new Set(origins)];
}

function createAuth() {
  return betterAuth({
    appName: "SIRAMA",
    baseURL: resolveBaseUrl(),
    trustedOrigins: trustedOrigins(),
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    advanced: {
      database: { generateId: "uuid" },
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 8,
    },
    user: {
      additionalFields: {
        // Keahlian Teknisi (PRD Lampiran C). Diisi Admin, bukan oleh user sendiri.
        skill: { type: "string", required: false, input: false },
      },
    },
    plugins: [
      admin({ ac, roles, defaultRole: "viewer", adminRoles: ["admin"] }),
      // Wajib terakhir: menulis cookie sesi saat auth.api dipanggil dari server action.
      nextCookies(),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;

let instance: Auth | undefined;

/**
 * Instance Better Auth tunggal per proses, dibuat saat pertama dipakai agar build
 * tidak gagal hanya karena DATABASE_URL belum tersedia.
 */
export function getAuth(): Auth {
  instance ??= createAuth();
  return instance;
}
