/**
 * Peran, halaman awal, dan navigasi per peran (PRD §5, design.md §5.2-5.4).
 * Murni: tanpa database, Next.js, atau React, sehingga diuji unit (tests/unit/roles.test.ts).
 */

export const ROLES = ["admin", "technician", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const SKILLS = ["it", "facility", "both"] as const;
export type Skill = (typeof SKILLS)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Halaman awal setelah login (design.md §5.2, US-AUTH-01 AC1). */
export function homePathFor(role: Role): string {
  return role === "technician" ? "/my-tasks" : "/dashboard";
}

/**
 * Tujuan `?next=` hanya boleh path internal, agar tautan login tidak bisa dipakai
 * untuk mengalihkan user ke situs lain (open redirect).
 */
export function isSafeNextPath(next: unknown): next is string {
  if (typeof next !== "string" || next.length === 0 || next.length > 512) return false;
  if (!next.startsWith("/")) return false;
  if (next.startsWith("//") || next.startsWith("/\\")) return false;
  if (/[\u0000-\u001f]/.test(next)) return false;
  const path = next.split(/[?#]/)[0];
  if (path === "/login" || path.startsWith("/login/")) return false;
  if (path === "/api" || path.startsWith("/api/")) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Navigasi (design.md §5.3 sidebar, §5.4 bar bawah)
// ---------------------------------------------------------------------------

export type NavItemId =
  | "dashboard"
  | "my-tasks"
  | "locations"
  | "devices"
  | "cables"
  | "work-orders"
  | "maintenance-plans"
  | "calendar"
  | "manufacturers"
  | "models"
  | "device-functions"
  | "users"
  | "audit-log"
  | "search"
  | "notifications";

export type NavGroupId = "inventory" | "maintenance" | "catalog" | "admin";

export type NavItem = {
  id: NavItemId;
  label: string;
  href: string;
  /** Awalan path lain yang juga mengaktifkan menu ini (detail rack berada di bawah Lokasi). */
  alsoActiveFor?: string[];
};
export type NavGroup = { id: NavGroupId; label: string; items: NavItem[] };
export type SidebarNav = { top: NavItem[]; groups: NavGroup[] };

const ITEM: Record<NavItemId, NavItem> = {
  dashboard: { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  "my-tasks": { id: "my-tasks", label: "Tugas saya", href: "/my-tasks" },
  locations: { id: "locations", label: "Lokasi", href: "/locations", alsoActiveFor: ["/racks"] },
  devices: { id: "devices", label: "Device", href: "/devices" },
  cables: { id: "cables", label: "Cable", href: "/cables" },
  "work-orders": { id: "work-orders", label: "Work order", href: "/work-orders" },
  "maintenance-plans": {
    id: "maintenance-plans",
    label: "Maintenance plan",
    href: "/maintenance-plans",
  },
  calendar: { id: "calendar", label: "Kalender", href: "/calendar" },
  manufacturers: { id: "manufacturers", label: "Manufacturer", href: "/manufacturers" },
  models: { id: "models", label: "Model", href: "/models" },
  "device-functions": {
    id: "device-functions",
    label: "Device function",
    href: "/device-functions",
  },
  users: { id: "users", label: "User", href: "/users" },
  "audit-log": { id: "audit-log", label: "Audit log", href: "/audit-log" },
  search: { id: "search", label: "Cari", href: "/search" },
  notifications: { id: "notifications", label: "Notifikasi", href: "/notifications" },
};

/** Isi sidebar dan menu HP (MOD-10) untuk sebuah peran. */
export function sidebarFor(role: Role): SidebarNav {
  const top: NavItem[] = [ITEM.dashboard];
  if (role === "technician") top.push(ITEM["my-tasks"]);

  const groups: NavGroup[] = [
    {
      id: "inventory",
      label: "Inventaris",
      items: [ITEM.locations, ITEM.devices, ITEM.cables],
    },
    {
      id: "maintenance",
      label: "Maintenance",
      items: [ITEM["work-orders"], ITEM["maintenance-plans"], ITEM.calendar],
    },
    {
      id: "catalog",
      label: "Katalog",
      items: [ITEM.manufacturers, ITEM.models, ITEM["device-functions"]],
    },
  ];
  if (role === "admin") {
    groups.push({ id: "admin", label: "Administrasi", items: [ITEM.users, ITEM["audit-log"]] });
  }
  return { top, groups };
}

/** Tombol bar navigasi bawah HP, kiri ke kanan (design.md §5.4). */
export function bottomNavFor(role: Role): NavItem[] {
  switch (role) {
    case "technician":
      return [
        { ...ITEM["my-tasks"], label: "Tugas" },
        ITEM.dashboard,
        ITEM.search,
        ITEM.notifications,
      ];
    case "admin":
      return [ITEM.dashboard, ITEM["work-orders"], ITEM.search, ITEM.notifications];
    case "viewer":
      return [ITEM.dashboard, ITEM.search];
  }
}

const matches = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

/**
 * Menu aktif: path sama persis atau halaman turunannya (/devices/123 → Device), termasuk
 * awalan tambahan (/racks/1 → Lokasi, wireframe 00-kerangka.md).
 */
export function isActivePath(
  pathname: string,
  item: Pick<NavItem, "href" | "alsoActiveFor">,
): boolean {
  return [item.href, ...(item.alsoActiveFor ?? [])].some((base) => matches(pathname, base));
}

/** Grup yang berisi halaman aktif; grup ini terbuka otomatis (design.md §5.3). */
export function activeGroupFor(nav: SidebarNav, pathname: string): NavGroupId | null {
  const group = nav.groups.find((g) => g.items.some((i) => isActivePath(pathname, i)));
  return group?.id ?? null;
}
