import { CircleAlert } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * KOM-17 Field form: label di atas, kontrol, lalu teks bantuan atau pesan error
 * (merah dengan ikon circle-alert, design.md §8.1).
 */
function FormField({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-body-strong text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="flex items-center gap-1 text-small text-status-red-text"
        >
          <CircleAlert className="size-icon-inline shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-small text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

/** Pesan error tingkat form (misalnya login gagal), diumumkan pembaca layar. */
function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-control border border-status-red-line bg-status-red-soft px-3 py-2 text-small text-status-red-text"
    >
      <CircleAlert className="mt-px size-icon-inline shrink-0" aria-hidden />
      {message}
    </p>
  );
}

export { FormError, FormField };
