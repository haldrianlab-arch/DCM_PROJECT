import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Dasar KOM-12 Lencana status (design.md §4.2, §8.2).
 * Lembut: tint pucat + teks gelap + garis 1 px. Hanya `red-solid` (Terlambat) yang pekat.
 * Pemetaan status ke warna, ikon, dan teks dibuat di komponen StatusBadge saat entitasnya ada.
 */
const badgeVariants = cva(
  [
    "inline-flex h-badge-height shrink-0 items-center gap-1 rounded-control border px-2 text-label-xs whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        green: "border-status-green-line bg-status-green-soft text-status-green-text",
        amber: "border-status-amber-line bg-status-amber-soft text-status-amber-text",
        indigo: "border-status-indigo-line bg-status-indigo-soft text-status-indigo-text",
        gray: "border-status-gray-line bg-status-gray-soft text-status-gray-text",
        "gray-dark":
          "border-status-gray-dark-line bg-status-gray-dark-soft text-status-gray-dark-text",
        red: "border-status-red-line bg-status-red-soft text-status-red-text",
        "red-solid": "border-status-red bg-status-red text-on-fill",
      },
    },
    defaultVariants: {
      tone: "gray",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, tone, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
