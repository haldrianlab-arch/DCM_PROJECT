import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Logo } from "@/components/sirama/logo";
import { homePathFor, isSafeNextPath } from "@/domain/roles";
import { getCurrentUser } from "@/server/authz";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Masuk" };

/** HAL-01 Login (design.md §9, wireframe 01-umum.md). */
export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const safeNext = isSafeNextPath(next) ? next : undefined;

  // Sudah login: langsung ke tujuan atau halaman awal peran.
  const user = await getCurrentUser();
  if (user) redirect(safeNext ?? homePathFor(user.role));

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-card border border-line bg-surface p-4 md:p-6">
        <div className="mb-6 flex flex-col items-center gap-1 text-center">
          <Logo />
          <p className="text-small text-ink-muted">Sistem Informasi Rak, Aset &amp; Maintenance</p>
        </div>
        <h1 className="sr-only">Masuk ke SIRAMA</h1>
        <LoginForm next={safeNext} />
      </div>
    </main>
  );
}
