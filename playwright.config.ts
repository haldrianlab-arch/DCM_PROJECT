import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const isCI = !!process.env.CI;

/**
 * E2E (tech.md §12). Dua proyek: desktop dan HP 375 px (NFR-02).
 * CI menguji build produksi; lokal memakai server dev yang sudah berjalan bila ada.
 * Laporan HTML menjadi bahan tabel blackbox Bab IV.
 * Setiap tes yang membuka halaman direkam sebagai video (.webm) di test-results/ dan ikut
 * dilampirkan di laporan HTML (playwright-report/). Tes yang hanya memanggil API tidak punya video.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI
    ? [["html", { open: "never" }], ["github"]]
    : [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "id-ID",
    timezoneId: "Asia/Jakarta",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        video: { mode: "on", size: { width: 1280, height: 720 } },
      },
    },
    {
      name: "hp",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        video: { mode: "on", size: { width: 375, height: 812 } },
      },
    },
  ],
  webServer: {
    command: isCI ? `pnpm start --port ${PORT}` : `pnpm dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
