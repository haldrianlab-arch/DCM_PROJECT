import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge perlu tahu nama gaya teks SIRAMA (globals.css `--text-*`).
 * Tanpa ini `text-body-strong` dianggap warna dan bisa membuang `text-on-fill`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "page-title",
        "section-title",
        "card-title",
        "body",
        "body-strong",
        "small",
        "location-lg",
        "label-xs",
        "code",
        "code-strong",
      ],
      radius: ["rack", "control", "card", "modal"],
      shadow: ["float", "overlay", "ring-focus", "ring-focus-gap"],
    },
  },
});

/** Gabungkan kelas Tailwind; kelas yang belakangan menang bila bertentangan. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
