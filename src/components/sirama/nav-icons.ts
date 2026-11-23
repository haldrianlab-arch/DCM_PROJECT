import {
  Bell,
  Cable,
  CalendarDays,
  ClipboardList,
  Factory,
  Layers,
  LayoutDashboard,
  ListChecks,
  MapPin,
  Repeat,
  RotateCcwClock,
  Search,
  Server,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { NavItemId } from "@/domain/roles";

/**
 * Ikon menu sesuai design-system/README.md (tabel ikon). Satu makna selalu satu ikon.
 * Catatan: ikon `history` (Audit log) di lucide-react 1.70 bernama `RotateCcwClock`.
 */
export const NAV_ICON: Record<NavItemId, LucideIcon> = {
  dashboard: LayoutDashboard,
  "my-tasks": ListChecks,
  locations: MapPin,
  devices: Server,
  cables: Cable,
  "work-orders": ClipboardList,
  "maintenance-plans": Repeat,
  calendar: CalendarDays,
  manufacturers: Factory,
  models: Layers,
  "device-functions": Tags,
  users: Users,
  "audit-log": RotateCcwClock,
  search: Search,
  notifications: Bell,
};
