"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { signOut } from "@/server/actions/auth";

/**
 * Menu user di header desktop (design.md §5.3): nama dan peran, lalu "Keluar".
 * "Akun saya" (HAL-31, Should) ditambahkan saat halamannya dibuat.
 */
export function UserMenu({ name, roleLabel }: { name: string; roleLabel: string }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="flex h-control-height items-center gap-2 rounded-control px-2 text-left outline-none hover:bg-muted focus-visible:shadow-ring-focus data-[state=open]:bg-muted"
        aria-label={`Menu user: ${name}, ${roleLabel}`}
      >
        <span className="flex flex-col">
          <span className="text-body-strong text-ink">{name}</span>
          <span className="text-label-xs text-ink-muted">{roleLabel}</span>
        </span>
        <ChevronDown className="size-icon-inline text-ink-muted" aria-hidden />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-48 rounded-card border border-line bg-surface p-1 shadow-float"
        >
          <form action={signOut}>
            <DropdownMenu.Item asChild>
              <button
                type="submit"
                className="flex h-control-height w-full items-center gap-2 rounded-control px-2 text-body text-ink outline-none data-[highlighted]:bg-muted"
              >
                <LogOut className="size-icon-inline" aria-hidden />
                Keluar
              </button>
            </DropdownMenu.Item>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
