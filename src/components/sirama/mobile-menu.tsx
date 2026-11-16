"use client";

import { LogOut, Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";
import * as React from "react";

import type { SidebarNav } from "@/domain/roles";
import { signOut } from "@/server/actions/auth";
import { Logo } from "./logo";
import { NavList } from "./nav-list";

/**
 * MOD-10 Menu navigasi HP (design.md §10): panel yang meluncur dari kiri, berisi menu yang
 * sama dengan sidebar, nama dan peran user, dan tombol "Keluar".
 */
export function MobileMenu({
  nav,
  name,
  roleLabel,
}: {
  nav: SidebarNav;
  name: string;
  roleLabel: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="flex size-touch-target items-center justify-center rounded-control text-ink outline-none hover:bg-muted focus-visible:shadow-ring-focus"
        aria-label="Buka menu"
      >
        <Menu className="size-icon-nav" aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-overlay backdrop-blur-overlay data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-sidebar-width max-w-full flex-col bg-surface shadow-overlay duration-(--duration-base) data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left">
          <div className="flex h-header-height-mobile shrink-0 items-center justify-between border-b border-line pr-1 pl-4">
            <Logo />
            <Dialog.Close
              className="flex size-touch-target items-center justify-center rounded-control text-ink outline-none hover:bg-muted focus-visible:shadow-ring-focus"
              aria-label="Tutup menu"
            >
              <X className="size-icon-nav" aria-hidden />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Description className="sr-only">Navigasi ke halaman SIRAMA</Dialog.Description>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            <NavList nav={nav} onNavigate={() => setOpen(false)} />
          </div>

          <div className="flex flex-col gap-2 border-t border-line px-4 pt-3 pb-[calc(var(--spacing)*3+env(safe-area-inset-bottom))]">
            <div>
              <p className="text-body-strong text-ink">{name}</p>
              <p className="text-small text-ink-muted">{roleLabel}</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="flex h-touch-target w-full items-center justify-center gap-2 rounded-control border border-line bg-surface text-body-strong text-ink shadow-xs outline-none hover:border-line-strong focus-visible:shadow-ring-focus"
              >
                <LogOut className="size-icon-inline" aria-hidden />
                Keluar
              </button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
