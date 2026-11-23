"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

/** KOM-03 varian password: tombol tampilkan/sembunyikan di dalam kolom (HAL-01, MOD-12). */
function PasswordInput({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-11 md:pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-touch-target items-center justify-center rounded-control text-ink-muted outline-none hover:text-ink focus-visible:shadow-ring-focus md:w-control-height"
      >
        {visible ? (
          <EyeOff className="size-icon-inline" aria-hidden />
        ) : (
          <Eye className="size-icon-inline" aria-hidden />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
