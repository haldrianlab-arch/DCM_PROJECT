import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/**
 * TPL-06 Halaman pesan (design.md §7): ikon, judul singkat, satu kalimat penjelasan,
 * tautan kembali ke halaman awal peran. Dipakai HAL-29 dan HAL-30.
 */
export function MessagePage({
  icon: Icon,
  title,
  description,
  backHref = "/",
  backLabel = "Kembali ke halaman awal",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <Icon className="size-10 text-ink-muted" aria-hidden />
      <h1 className="text-page-title">{title}</h1>
      <p className="max-w-md text-body text-ink-muted">{description}</p>
      <Link
        href={backHref}
        className="rounded-control text-body-strong text-air outline-none hover:underline focus-visible:shadow-ring-focus"
      >
        {backLabel}
      </Link>
    </main>
  );
}
