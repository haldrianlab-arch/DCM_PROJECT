import { describe, expect, it } from "vitest";

import {
  activeGroupFor,
  bottomNavFor,
  homePathFor,
  isActivePath,
  isRole,
  isSafeNextPath,
  ROLES,
  sidebarFor,
  type Role,
} from "@/domain/roles";

const ids = (items: { id: string }[]) => items.map((i) => i.id);
const sidebarIds = (role: Role) => {
  const nav = sidebarFor(role);
  return [...ids(nav.top), ...nav.groups.flatMap((g) => ids(g.items))];
};

describe("homePathFor (design.md §5.2, US-AUTH-01 AC1)", () => {
  it("Admin dan Viewer ke Dashboard, Teknisi ke Tugas saya", () => {
    expect(homePathFor("admin")).toBe("/dashboard");
    expect(homePathFor("viewer")).toBe("/dashboard");
    expect(homePathFor("technician")).toBe("/my-tasks");
  });
});

describe("isRole", () => {
  it("hanya menerima tiga peran", () => {
    for (const r of ROLES) expect(isRole(r)).toBe(true);
    expect(isRole("user")).toBe(false);
    expect(isRole(undefined)).toBe(false);
    expect(isRole("ADMIN")).toBe(false);
  });
});

describe("isSafeNextPath (cegah pengalihan ke situs lain)", () => {
  it.each(["/devices/123", "/racks/abc?tab=port", "/my-tasks", "/a/DCM-0001"])(
    "menerima path internal %s",
    (p) => expect(isSafeNextPath(p)).toBe(true),
  );

  it.each([
    "//evil.example",
    "/\\evil.example",
    "https://evil.example",
    "javascript:alert(1)",
    "devices",
    "",
    "/login",
    "/login?next=/x",
    "/api/auth/sign-out",
    "/api",
    "/x\nSet-Cookie: a=b",
  ])("menolak %j", (p) => expect(isSafeNextPath(p)).toBe(false));

  it("menolak bukan string dan path terlalu panjang", () => {
    expect(isSafeNextPath(undefined)).toBe(false);
    expect(isSafeNextPath(["/devices"])).toBe(false);
    expect(isSafeNextPath(`/${"a".repeat(600)}`)).toBe(false);
  });
});

describe("sidebarFor (design.md §5.3, US-AUTH-03 AC2)", () => {
  it("grup Administrasi hanya untuk Admin", () => {
    expect(sidebarFor("admin").groups.map((g) => g.id)).toContain("admin");
    expect(sidebarFor("technician").groups.map((g) => g.id)).not.toContain("admin");
    expect(sidebarFor("viewer").groups.map((g) => g.id)).not.toContain("admin");
    expect(sidebarIds("viewer")).not.toContain("users");
    expect(sidebarIds("technician")).not.toContain("audit-log");
  });

  it("Tugas saya hanya untuk Teknisi, tepat setelah Dashboard", () => {
    expect(ids(sidebarFor("technician").top)).toEqual(["dashboard", "my-tasks"]);
    expect(ids(sidebarFor("admin").top)).toEqual(["dashboard"]);
    expect(ids(sidebarFor("viewer").top)).toEqual(["dashboard"]);
  });

  it("urutan grup dan isinya sesuai design.md §5.3", () => {
    const nav = sidebarFor("admin");
    expect(nav.groups.map((g) => [g.label, g.items.map((i) => i.label)])).toEqual([
      ["Inventaris", ["Lokasi", "Device", "Cable"]],
      ["Maintenance", ["Work order", "Maintenance plan", "Kalender"]],
      ["Katalog", ["Manufacturer", "Model", "Device function"]],
      ["Administrasi", ["User", "Audit log"]],
    ]);
  });
});

describe("bottomNavFor (design.md §5.4)", () => {
  it("isi bar bawah per peran, kiri ke kanan", () => {
    expect(bottomNavFor("technician").map((i) => i.label)).toEqual([
      "Tugas",
      "Dashboard",
      "Cari",
      "Notifikasi",
    ]);
    expect(bottomNavFor("admin").map((i) => i.label)).toEqual([
      "Dashboard",
      "Work order",
      "Cari",
      "Notifikasi",
    ]);
    expect(bottomNavFor("viewer").map((i) => i.label)).toEqual(["Dashboard", "Cari"]);
  });

  it("Viewer tidak punya Notifikasi (tidak menerima notifikasi, PRD §5)", () => {
    expect(ids(bottomNavFor("viewer"))).not.toContain("notifications");
  });
});

describe("menu aktif dan grup terbuka", () => {
  it("halaman turunan mengaktifkan menu induknya", () => {
    const devices = { href: "/devices" };
    expect(isActivePath("/devices", devices)).toBe(true);
    expect(isActivePath("/devices/123/edit", devices)).toBe(true);
    expect(isActivePath("/devices-archive", devices)).toBe(false);
  });

  it("detail rack mengaktifkan menu Lokasi (wireframe 00-kerangka)", () => {
    const locations = sidebarFor("viewer").groups[0].items[0];
    expect(locations.id).toBe("locations");
    expect(isActivePath("/racks/abc", locations)).toBe(true);
    expect(isActivePath("/racksx", locations)).toBe(false);
  });

  it("grup yang berisi halaman aktif terbuka otomatis", () => {
    const nav = sidebarFor("admin");
    expect(activeGroupFor(nav, "/racks/1")).toBe("inventory");
    expect(activeGroupFor(nav, "/locations")).toBe("inventory");
    expect(activeGroupFor(nav, "/models/9")).toBe("catalog");
    expect(activeGroupFor(nav, "/users")).toBe("admin");
    expect(activeGroupFor(nav, "/dashboard")).toBeNull();
  });
});
