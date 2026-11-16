"use client";

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";

import type { SidebarNav } from "@/domain/roles";
import { useStoredValue } from "@/lib/use-stored-value";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NavList } from "./nav-list";

const COLLAPSED_KEY = "sirama.sidebar.collapsed";

/**
 * KOM-26 Sidebar desktop (design.md §5.3): 240 px, dapat diciutkan menjadi 64 px (hanya ikon),
 * menempel saat halaman di-scroll. Disembunyikan di HP (bar bawah dan MOD-10 menggantikannya).
 */
export function Sidebar({ nav }: { nav: SidebarNav }) {
  const [stored, setStored] = useStoredValue(COLLAPSED_KEY);
  const collapsed = stored === "1";

  function toggle() {
    setStored(collapsed ? "0" : "1");
  }

  return (
    <aside
      data-collapsed={collapsed || undefined}
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-sidebar md:flex",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar-width",
      )}
    >
      <div
        className={cn(
          "flex h-header-height shrink-0 items-center",
          collapsed ? "justify-center" : "px-4",
        )}
      >
        <Link
          href="/"
          className="rounded-control outline-none focus-visible:shadow-ring-focus"
          aria-label="SIRAMA, ke halaman awal"
        >
          <Logo showWordmark={!collapsed} />
        </Link>
      </div>

      <div className={cn("flex-1 overflow-y-auto pb-4", collapsed ? "px-2" : "px-3")}>
        <NavList nav={nav} collapsed={collapsed} />
      </div>

      <div className={cn("border-t border-line p-2", collapsed && "flex justify-center")}>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Lebarkan sidebar" : "Ciutkan sidebar"}
          className="flex h-control-height items-center gap-2 rounded-control px-3 text-body-strong text-ink-muted outline-none hover:bg-muted hover:text-ink focus-visible:shadow-ring-focus"
        >
          {collapsed ? (
            <ChevronsRight className="size-icon-inline" aria-hidden />
          ) : (
            <>
              <ChevronsLeft className="size-icon-inline" aria-hidden />
              Ciutkan
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
