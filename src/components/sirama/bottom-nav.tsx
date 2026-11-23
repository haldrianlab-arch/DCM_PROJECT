"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActivePath, type NavItem } from "@/domain/roles";
import { cn } from "@/lib/utils";
import { NAV_ICON } from "./nav-icons";

/**
 * KOM-28 Bar navigasi bawah HP (design.md §5.4): 60 px + area aman layar, selalu terlihat
 * di layar 768 px atau kurang. Isi per peran dari bottomNavFor(). Angka notifikasi belum
 * dibaca ditambahkan di PR 11.
 */
export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex h-bottom-nav-height">
        {items.map((item) => {
          const Icon = NAV_ICON[item.id];
          const active = isActivePath(pathname, item);
          return (
            <li key={item.id} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-label-xs outline-none focus-visible:shadow-ring-focus",
                  active ? "text-air" : "text-ink-muted",
                )}
              >
                <Icon className="size-icon-nav" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
