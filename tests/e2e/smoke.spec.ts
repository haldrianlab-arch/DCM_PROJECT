import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("halaman token tampil tanpa error dan tanpa scroll horizontal", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle("SIRAMA");
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(
      page.getByRole("heading", { level: 1, name: "Token design system" }),
    ).toBeVisible();
    await expect(page.getByText("SIRAMA", { exact: true }).first()).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test("token warna aksen terpasang di tombol utama", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Tambah device" });
    await expect(button).toHaveCSS("background-color", "rgb(10, 108, 140)");
    await expect(button).toHaveCSS("border-radius", "6px");
  });

  test("halaman /dev/components tidak tersedia di build produksi", async ({ request }) => {
    test.skip(!process.env.CI, "Lokal memakai server dev, tempat halaman ini memang aktif.");
    const res = await request.get("/dev/components");
    expect(res.status()).toBe(404);
  });

  test("route cron menolak tanpa CRON_SECRET", async ({ request }) => {
    const res = await request.get("/api/cron/daily");
    expect(res.status()).toBe(401);
  });
});
