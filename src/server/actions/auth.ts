"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { homePathFor, isSafeNextPath } from "@/domain/roles";
import { getAuth } from "../auth";
import { attemptSignIn } from "../sign-in";

export type SignInState = { message?: string; email?: string };

/**
 * HAL-01: kirim form login. Berhasil → tujuan ?next= (bila aman) atau halaman awal peran
 * (design.md §5.2). Gagal → pesan tunggal "Email atau password salah.".
 */
export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const result = await attemptSignIn(
    { email, password: String(formData.get("password") ?? "") },
    await headers(),
  );
  if (!result.ok) return { message: result.message, email };

  const next = formData.get("next");
  // redirect() dipanggil di luar try/catch karena bekerja dengan melempar sinyal khusus.
  redirect(isSafeNextPath(next) ? next : homePathFor(result.role));
}

/** Menu user → Keluar: hapus sesi di database dan cookie, lalu kembali ke login. */
export async function signOut(): Promise<void> {
  try {
    await getAuth().api.signOut({ headers: await headers() });
  } catch {
    // Sesi sudah tidak ada; tetap arahkan ke login.
  }
  redirect("/login");
}
