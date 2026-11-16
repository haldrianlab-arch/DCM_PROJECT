import { ShieldX } from "lucide-react";

import { MessagePage } from "@/components/sirama/message-page";

/** HAL-29 Akses ditolak (design.md §9), ditampilkan oleh forbidden() di requireRole. */
export default function Forbidden() {
  return (
    <MessagePage
      icon={ShieldX}
      title="Akses ditolak"
      description="Halaman ini tidak tersedia untuk peran Anda."
    />
  );
}
