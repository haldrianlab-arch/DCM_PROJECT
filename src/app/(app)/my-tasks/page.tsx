import type { Metadata } from "next";

import { PageBody, PageHeader } from "@/components/sirama/page-header";
import { requireRole } from "@/server/authz";

export const metadata: Metadata = { title: "Tugas saya" };

/**
 * HAL-03 Tugas saya (sementara), khusus Teknisi (design.md §5.1); peran lain melihat HAL-29.
 * Daftar WO milik teknisi dibuat di PR 10.
 */
export default async function MyTasksPage() {
  await requireRole("technician");
  return (
    <PageBody>
      <PageHeader title="Tugas saya" description="Isi halaman ini dibuat di PR berikutnya." />
    </PageBody>
  );
}
