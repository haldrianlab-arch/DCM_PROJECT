"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "radix-ui";

import {
  activeGroupFor,
  isActivePath,
  type NavGroupId,
  type NavItem,
  type SidebarNav,
} from "@/domain/roles";
import { useStoredValue } from "@/lib/use-stored-value";
import { cn } from "@/lib/utils";
import { NAV_ICON } from "./nav-icons";

const GROUPS_KEY = "sirama.sidebar.groups";

type StoredGroups = Partial<Record<NavGroupId, boolean>>;

function parseGroups(raw: string | null): StoredGroups {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as StoredGroups;
  } catch {
    return {};
  }
}

function NavLink({
  item,
  active,
  collapsed,
  nested,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  nested?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = NAV_ICON[item.id];
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={cn(
        "flex h-touch-target items-center gap-2 rounded-control px-3 text-body-strong outline-none md:h-control-height",
        "transition-colors duration-(--duration-fast) focus-visible:shadow-ring-focus",
        active ? "bg-air-soft text-air" : "text-ink hover:bg-muted",
        nested && !collapsed && "pl-8",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-icon-inline shrink-0" aria-hidden />
      {collapsed ? null : <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  // Sidebar diciutkan: nama menu muncul sebagai keterangan saat ikon disorot (design.md §5.3).
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={8}
          className="z-50 rounded-control bg-ink px-2 py-1 text-label-xs text-on-fill shadow-float"
        >
          {item.label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/**
 * Daftar menu sidebar (KOM-26) dan menu HP (MOD-10): menu tunggal di atas, lalu grup.
 * Grup tertutup secara bawaan, kecuali grup yang berisi halaman aktif; pilihan terakhir
 * user diingat di browser (design.md §5.3).
 */
export function NavList({
  nav,
  collapsed = false,
  onNavigate,
}: {
  nav: SidebarNav;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeGroup = activeGroupFor(nav, pathname);
  const [raw, setRaw] = useStoredValue(GROUPS_KEY);
  const stored = parseGroups(raw);

  const isOpen = (id: NavGroupId) => stored[id] ?? id === activeGroup;

  function toggle(id: NavGroupId) {
    setRaw(JSON.stringify({ ...stored, [id]: !isOpen(id) }));
  }

  return (
    <Tooltip.Provider delayDuration={300}>
      <nav aria-label="Menu utama" className="flex flex-col gap-1">
        {nav.top.map((item) => (
          <NavLink
            key={item.id}
            item={item}
            active={isActivePath(pathname, item)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}

        {nav.groups.map((group) => {
          const open = collapsed || isOpen(group.id);
          return (
            <div key={group.id} className="mt-3 flex flex-col gap-1">
              {collapsed ? (
                <span className="mx-3 border-t border-line" aria-hidden />
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(group.id)}
                  aria-expanded={open}
                  className="flex h-control-height items-center gap-1 rounded-control px-3 text-label-xs text-ink-muted outline-none hover:text-ink focus-visible:shadow-ring-focus"
                >
                  <ChevronRight
                    className={cn(
                      "size-3 shrink-0 transition-transform duration-(--duration-fast)",
                      open && "rotate-90",
                    )}
                    aria-hidden
                  />
                  {group.label}
                </button>
              )}
              {open
                ? group.items.map((item) => (
                    <NavLink
                      key={item.id}
                      item={item}
                      active={isActivePath(pathname, item)}
                      collapsed={collapsed}
                      nested
                      onNavigate={onNavigate}
                    />
                  ))
                : null}
            </div>
          );
        })}
      </nav>
    </Tooltip.Provider>
  );
}
