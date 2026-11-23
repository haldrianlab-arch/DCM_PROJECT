import { notFound } from "next/navigation";

import { Logo } from "@/components/sirama/logo";
import { ComponentShowcase, TokenShowcase } from "../../_showcase/showcase";

export const metadata = { title: "Komponen" };

/**
 * Peninjauan token dan komponen dengan data contoh (tech.md §10). Hanya aktif di development;
 * komponen khusus SIRAMA (KOM-32 s.d. KOM-46) ditambahkan di sini saat dibuat.
 */
export default function DevComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-col gap-3">
        <Logo />
        <h1 className="text-page-title">Token dan komponen</h1>
      </header>
      <TokenShowcase />
      <ComponentShowcase />
    </main>
  );
}
