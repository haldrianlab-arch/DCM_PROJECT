import { FileQuestionMark } from "lucide-react";

import { MessagePage } from "@/components/sirama/message-page";

/** HAL-30 Tidak ditemukan (design.md §9). `/` mengalihkan ke halaman awal peran. */
export default function NotFound() {
  return (
    <MessagePage
      icon={FileQuestionMark}
      title="Halaman tidak ditemukan"
      description="Alamat ini tidak ada atau halamannya belum tersedia."
    />
  );
}
