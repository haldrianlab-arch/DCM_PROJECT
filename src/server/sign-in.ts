import { z } from "zod";

import { isRole, type Role } from "@/domain/roles";
import { getAuth } from "./auth";

/** Pesan tunggal untuk SEMUA kegagalan login (US-AUTH-01 AC2, AC3; HAL-01). */
export const LOGIN_FAILED = "Email atau password salah.";

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(256),
});

export type SignInResult = { ok: true; role: Role } | { ok: false; message: string };

/**
 * Coba login dengan email + password. Apa pun penyebab gagalnya (format salah, email tidak
 * terdaftar, password salah, akun dinonaktifkan) hasilnya sama, agar penyerang tidak bisa
 * mengetahui email mana yang terdaftar atau akun mana yang dinonaktifkan.
 * Cookie sesi ditulis oleh plugin nextCookies saat dipanggil dari server action.
 */
export async function attemptSignIn(
  input: unknown,
  requestHeaders: Headers,
): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: LOGIN_FAILED };

  try {
    const result = await getAuth().api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password, rememberMe: true },
      headers: requestHeaders,
    });
    const role = (result.user as { role?: unknown }).role;
    if (!isRole(role)) return { ok: false, message: LOGIN_FAILED };
    return { ok: true, role };
  } catch {
    return { ok: false, message: LOGIN_FAILED };
  }
}
