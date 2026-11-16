import { expect, test, type Page } from "@playwright/test";

/**
 * E2E autentikasi dan hak akses (US-AUTH-01, US-AUTH-03 AC2). Butuh database yang sudah
 * di-seed (`pnpm db:seed`) dengan SEED_PASSWORD yang sama. Setiap tes direkam video.
 */
const PASSWORD = process.env.SEED_PASSWORD ?? "";
const ANDI = "andi@kampus.ac.id";
const RINA = "rina@kampus.ac.id";
const JOKO = "joko@kampus.ac.id";
const SARI = "sari@kampus.ac.id";

test.skip(!PASSWORD, "SEED_PASSWORD kosong: jalankan pnpm db:seed dan isi .env.local.");

// Jeda singkat agar keadaan akhir ikut terekam di video (lihat smoke.spec.ts).
test.afterEach(async ({ page }) => {
  if (page.url() !== "about:blank") await page.waitForTimeout(500);
});

/** Pesan error form login (Next.js juga punya elemen role="alert" untuk pengumuman rute). */
const loginError = (page: Page) => page.locator("form").getByRole("alert");

async function login(page: Page, email: string, password = PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
}

test.describe("US-AUTH-01 login", () => {
  for (const [email, path, heading] of [
    [ANDI, "/dashboard", "Dashboard"],
    [RINA, "/my-tasks", "Tugas saya"],
    [JOKO, "/my-tasks", "Tugas saya"],
    [SARI, "/dashboard", "Dashboard"],
  ] as const) {
    test(`AC1: ${email} masuk ke halaman awal perannya (${path})`, async ({ page }) => {
      await login(page, email);
      await expect(page).toHaveURL(path);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    });
  }

  test("AC2: password salah → pesan umum, tetap di halaman login", async ({ page }) => {
    await login(page, ANDI, `${PASSWORD}-salah`);
    await expect(loginError(page)).toHaveText("Email atau password salah.");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByLabel("Email")).toHaveValue(ANDI);
  });

  test("AC2: email tidak terdaftar → pesan yang sama", async ({ page }) => {
    await login(page, "tidak-ada@kampus.ac.id");
    await expect(loginError(page)).toHaveText("Email atau password salah.");
  });

  test("AC3: akun dinonaktifkan → ditolak dengan pesan yang sama", async ({ page }, info) => {
    // Admin membuat akun baru lalu menonaktifkannya lewat API Better Auth (Kelola user di PR 8).
    await login(page, ANDI);
    await expect(page).toHaveURL("/dashboard");
    const email = `tes-nonaktif-${info.project.name}-${Date.now()}@kampus.ac.id`;
    const origin = new URL(page.url()).origin;
    const created = await page.request.post("/api/auth/admin/create-user", {
      headers: { origin },
      data: { email, password: PASSWORD, name: "Tes nonaktif", role: "viewer" },
    });
    expect(created.ok()).toBe(true);
    const { user } = (await created.json()) as { user: { id: string } };
    const banned = await page.request.post("/api/auth/admin/ban-user", {
      headers: { origin },
      data: { userId: user.id },
    });
    expect(banned.ok()).toBe(true);

    await page.context().clearCookies();
    await login(page, email);
    await expect(loginError(page)).toHaveText("Email atau password salah.");
    await expect(page).toHaveURL(/\/login/);
  });

  test("AC4: belum login → ke halaman login, lalu kembali ke tujuan", async ({ page }) => {
    await page.goto("/my-tasks");
    await expect(page).toHaveURL("/login?next=%2Fmy-tasks");
    await page.getByLabel("Email").fill(RINA);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page).toHaveURL("/my-tasks");
  });

  test("AC4: halaman yang belum dibuat pun tetap meminta login dulu", async ({ page }) => {
    await page.goto("/devices");
    await expect(page).toHaveURL("/login?next=%2Fdevices");
  });

  test("AC4: halaman awal / tanpa login → halaman login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("AC5: tidak ada tautan pendaftaran atau lupa password", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("link")).toHaveCount(0);
    await expect(page.getByText(/daftar|lupa password/i)).toHaveCount(0);
  });

  test("password dapat ditampilkan dan disembunyikan", async ({ page }) => {
    await page.goto("/login");
    const field = page.getByLabel("Password", { exact: true });
    await field.fill("rahasia");
    await expect(field).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Tampilkan password" }).click();
    await expect(field).toHaveAttribute("type", "text");
  });
});

test.describe("US-AUTH-03 AC2 menu sesuai peran", () => {
  test("desktop: sidebar Admin punya Administrasi, tanpa Tugas saya", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Sidebar hanya di desktop.");
    await login(page, ANDI);
    const nav = page.getByRole("navigation", { name: "Menu utama" });
    await expect(nav.getByRole("button", { name: "Administrasi" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Tugas saya" })).toHaveCount(0);
    await nav.getByRole("button", { name: "Administrasi" }).click();
    await expect(nav.getByRole("link", { name: "User" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Audit log" })).toBeVisible();
  });

  test("desktop: sidebar Teknisi punya Tugas saya, tanpa Administrasi", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Sidebar hanya di desktop.");
    await login(page, RINA);
    const nav = page.getByRole("navigation", { name: "Menu utama" });
    await expect(nav.getByRole("link", { name: "Tugas saya" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(nav.getByRole("button", { name: "Administrasi" })).toHaveCount(0);
  });

  test("desktop: sidebar Viewer tanpa Tugas saya dan tanpa Administrasi", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Sidebar hanya di desktop.");
    await login(page, SARI);
    const nav = page.getByRole("navigation", { name: "Menu utama" });
    await expect(nav.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Tugas saya" })).toHaveCount(0);
    await expect(nav.getByRole("button", { name: "Administrasi" })).toHaveCount(0);
  });

  for (const [email, labels] of [
    [RINA, ["Tugas", "Dashboard", "Cari", "Notifikasi"]],
    [ANDI, ["Dashboard", "Work order", "Cari", "Notifikasi"]],
    [SARI, ["Dashboard", "Cari"]],
  ] as const) {
    test(`HP: bar bawah ${email} sesuai design.md §5.4`, async ({ page, isMobile }) => {
      test.skip(!isMobile, "Bar bawah hanya di HP.");
      await login(page, email);
      const bar = page.getByRole("navigation", { name: "Navigasi bawah" });
      await expect(bar.getByRole("link")).toHaveText([...labels]);
    });
  }

  test("HP: menu MOD-10 berisi menu dan tombol Keluar", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Menu ini hanya di HP.");
    await login(page, ANDI);
    await page.getByRole("button", { name: "Buka menu" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("button", { name: "Administrasi" })).toBeVisible();
    await expect(dialog.getByText("Andi")).toBeVisible();
    await dialog.getByRole("button", { name: "Keluar" }).click();
    await expect(page).toHaveURL("/login");
  });
});

test.describe("keluar dan halaman pesan", () => {
  test("Keluar mengakhiri sesi", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keluar di HP diuji lewat menu MOD-10.");
    await login(page, SARI);
    await page.getByRole("button", { name: /Menu user/ }).click();
    await page.getByRole("menuitem", { name: "Keluar" }).click();
    await expect(page).toHaveURL("/login");
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login?next=%2Fdashboard");
  });

  test("HAL-30: alamat tidak dikenal → Halaman tidak ditemukan", async ({ page }) => {
    await login(page, SARI);
    await expect(page).toHaveURL("/dashboard");
    const response = await page.goto("/halaman-yang-tidak-ada");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible();
  });

  test("HAL-29: Admin membuka Tugas saya (khusus Teknisi) → Akses ditolak", async ({ page }) => {
    await login(page, ANDI);
    await expect(page).toHaveURL("/dashboard");
    const response = await page.goto("/my-tasks");
    expect(response?.status()).toBe(403);
    await expect(page.getByRole("heading", { name: "Akses ditolak" })).toBeVisible();
    await expect(page.getByText("Halaman ini tidak tersedia untuk peran Anda.")).toBeVisible();
  });
});
