import type { Metadata } from "next";

import { PageBody, PageHeader } from "@/components/sirama/page-header";

export const metadata: Metadata = { title: "Dashboard" };

/** HAL-02 Dashboard (sementara). Isi dashboard (US-DASH-01) dibuat di PR 13. */
export default function DashboardPage() {
  return (
    <PageBody>
      <PageHeader title="Dashboard" description="Isi halaman ini dibuat di PR berikutnya." />
    </PageBody>
  );
}
