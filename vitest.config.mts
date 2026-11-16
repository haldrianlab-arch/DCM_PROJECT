import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Tes integrasi membaca DATABASE_URL dan SEED_PASSWORD dari .env.local (lokal) atau environment CI.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const alias = { "@": fileURLToPath(new URL("./src", import.meta.url)) };

export default defineConfig({
  resolve: { alias },
  test: {
    environment: "node",
    projects: [
      {
        resolve: { alias },
        test: { name: "unit", include: ["tests/unit/**/*.test.ts"] },
      },
      {
        resolve: { alias },
        test: {
          name: "integrasi",
          include: ["tests/integration/**/*.test.ts"],
          // Satu database bersama (dan seed yang mengosongkan tabel): berkas dijalankan berurutan.
          fileParallelism: false,
          testTimeout: 30_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
});
