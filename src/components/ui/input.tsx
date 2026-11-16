import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * KOM-03 Input teks (design.md §8.2, keadaan §8.1).
 * Tinggi 36 px di desktop; di HP minimal 44 px dan isi 16 px agar halaman tidak diperbesar.
 * `aria-invalid` memberi garis merah (keadaan error).
 */
function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-touch-target w-full min-w-0 rounded-control border border-line bg-surface px-3 text-input-mobile text-ink shadow-xs md:h-control-height md:text-body",
        "transition-colors duration-(--duration-fast) outline-none placeholder:text-ink-muted",
        "hover:border-line-strong focus-visible:border-air focus-visible:shadow-ring-focus",
        "aria-invalid:border-status-red aria-invalid:focus-visible:shadow-ring-error",
        "disabled:cursor-not-allowed disabled:opacity-(--opacity-disabled)",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
