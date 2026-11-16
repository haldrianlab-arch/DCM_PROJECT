import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components sengaja tidak dipakai (keputusan PR 2, tech.md §1): hampir semua halaman
  // membaca sesi login, jadi dirender per permintaan tanpa Suspense wajib. Lebih sederhana
  // dijelaskan; data SIRAMA kecil sehingga NFR-05 tetap terpenuhi.
  experimental: {
    // forbidden() + app/forbidden.tsx untuk HAL-29 Akses ditolak (status 403).
    authInterrupts: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
