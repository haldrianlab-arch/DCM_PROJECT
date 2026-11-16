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
          {/* Server action dipanggil langsung saat item dipilih: menu tertutup (dan isinya
              dilepas dari halaman) begitu item dipilih, jadi form di dalamnya tidak sempat terkirim. */}
          <DropdownMenu.Item
            onSelect={() => {
              void signOut();
            }}
            className="flex h-control-height w-full cursor-pointer items-center gap-2 rounded-control px-2 text-body text-ink outline-none data-[highlighted]:bg-muted"
          >
            <LogOut className="size-icon-inline" aria-hidden />
            Keluar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
