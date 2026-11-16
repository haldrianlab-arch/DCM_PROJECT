import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { cache } from "react";

import { isRole, isSafeNextPath, type Role, type Skill } from "@/domain/roles";
import { getAuth } from "./auth";
import { PATH_HEADER } from "./authz-constants";

/**
 * Pemeriksaan hak akses di server (tech.md §6.2, US-AUTH-03).
 * - Halaman: requireUser / requireRole (alihkan ke login atau tampilkan HAL-29).
 * - Server action: authorize (mengembalikan hasil { ok }, bukan throw; CLAUDE.md).
 */

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  skill: Skill | null;
};

/** User yang sedang login, atau null. Di-cache per permintaan agar sesi dibaca sekali. */
export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  const result = await getAuth().api.getSession({ headers: await headers() });
  if (!result) return null;
  const { user } = result;
  if (!isRole(user.role) || user.banned) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    skill: (user.skill as Skill | null | undefined) ?? null,
  };
});

/** Halaman yang wajib login (US-AUTH-01 AC4). */
export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (user) return user;
  const path = (await headers()).get(PATH_HEADER);
  redirect(isSafeNextPath(path) ? `/login?next=${encodeURIComponent(path)}` : "/login");
}

/** Halaman khusus peran tertentu; peran lain melihat HAL-29 Akses ditolak (403). */
export async function requireRole(...roles: Role[]): Promise<AppUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) forbidden();
  return user;
}

export type AuthorizeResult =
  | { ok: true; user: AppUser }
  | { ok: false; code: "unauthenticated" | "forbidden"; message: string };

/**
 * Langkah pertama setiap server action mutasi (tech.md §7). Ini lapisan keamanan yang
 * sebenarnya: tombol yang disembunyikan di UI hanya pelengkap.
 */
export async function authorize(...roles: Role[]): Promise<AuthorizeResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, code: "unauthenticated", message: "Sesi berakhir. Masuk lagi." };
  }
  if (!roles.includes(user.role)) {
    return { ok: false, code: "forbidden", message: "Aksi ini tidak tersedia untuk peran Anda." };
  }
  return { ok: true, user };
}
