import { notFound } from "next/navigation";

import { ComponentShowcase } from "../../_showcase/showcase";

export const metadata = { title: "Komponen" };

/**
 * Peninjauan komponen dengan data contoh (tech.md §10). Hanya aktif di development;
 * komponen khusus SIRAMA (KOM-32 s.d. KOM-46) ditambahkan di sini saat dibuat.
 */
export default function DevComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-page-title">Komponen</h1>
      <ComponentShowcase />
    </main>
  );
}
