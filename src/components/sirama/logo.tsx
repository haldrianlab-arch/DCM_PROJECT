import { cn } from "@/lib/utils";

/**
 * Logo SIRAMA (design.md §4.7; design-system/README.md bagian Logo).
 * Simbol lemari rack di kisi 24 px: bingkai 15 x 20 px bersudut 2 px dengan garis `air` 2 px
 * tanpa isian, blok 2U (9 x 6 px) dan 1U (9 x 3 px), serta titik lampu indikator 2,5 px.
 * Simbol saja dipakai untuk favicon (src/app/icon.svg) dan sidebar yang diciutkan.
 */
export function LogoSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-6 shrink-0 text-air", className)}
    >
      <rect x="4.5" y="2" width="15" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="7.5" y="5" width="9" height="6" rx="1" fill="currentColor" />
      <rect x="7.5" y="13" width="9" height="3" rx="1" fill="currentColor" />
      <circle cx="15.25" cy="18.75" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-air", className)}>
      <LogoSymbol />
      {showWordmark ? (
        <span className="text-section-title font-semibold tracking-normal">SIRAMA</span>
      ) : (
        <span className="sr-only">SIRAMA</span>
      )}
    </span>
  );
}
