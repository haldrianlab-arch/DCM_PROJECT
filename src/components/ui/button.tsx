import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * KOM-01 Tombol (design.md §8.2, keadaan §8.1).
 * Satu tombol utama per area. Fokus: garis `air` 1 px + cincin `air-ring` 3 px;
 * tombol pekat (utama, bahaya) didahului celah `surface` 2 px.
 */
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-control text-body-strong whitespace-nowrap",
    "transition-colors duration-(--duration-fast) outline-none select-none",
    "disabled:pointer-events-none disabled:opacity-(--opacity-disabled)",
    "[&_svg]:pointer-events-none [&_svg]:size-icon-inline [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-air text-on-fill shadow-xs hover:bg-air-hover active:bg-air-active focus-visible:shadow-ring-focus-gap",
        secondary: [
          "border border-line bg-surface text-ink shadow-xs hover:border-line-strong active:bg-muted",
          "focus-visible:shadow-ring-focus",
        ],
        danger:
          "bg-status-red text-on-fill shadow-xs hover:bg-danger-hover active:bg-danger-active focus-visible:shadow-ring-focus-gap",
        ghost: "text-ink hover:bg-muted active:bg-line focus-visible:shadow-ring-focus",
        text: "text-air hover:underline focus-visible:shadow-ring-focus",
      },
      size: {
        default: "h-control-height px-3",
        lg: "h-touch-target px-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Memproses: ikon berputar, teks tetap, tombol tidak bisa ditekan lagi. */
    loading?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
