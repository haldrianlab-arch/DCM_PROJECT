# PR 1: Fondasi

| | |
|---|---|
| Branch | `feat/01-fondasi` dari `main` |
| Acuan | tech.md §1-3, §8, §10, §12, §13, §15 (PR 1); design.md §4; `specs/design-system/tokens.json` |
| Disalin ke | `plans/01-fondasi.md` (ikut di-commit sebagai jejak audit, tech.md §15) |

## Konteks dan tujuan

Tahap Design selesai; repo baru berisi dokumen. PR 1 menyiapkan kerangka yang dipakai semua PR berikutnya: aplikasi Next.js 16 yang bisa jalan lokal dan di Vercel, token SIRAMA terpasang di Tailwind v4 dan shadcn/ui, koneksi Drizzle ke Neon, kerangka tes (Vitest, Playwright), CI GitHub Actions, dan `vercel.json` untuk cron. Setelah PR ini, tim bisa membuka preview Vercel dan melihat token tampil sesuai design system.

## User story dan AC yang dicakup

PR 1 belum mencakup user story. Yang disiapkan:
- Keputusan teknis T1, T3, T5, T10, T11, T13 (tech.md §1).
- NFR-07 (keterujian): Vitest dan Playwright siap dipakai PR berikutnya.
- tech.md §8 (keamanan cron): route menolak permintaan tanpa `Authorization: Bearer ${CRON_SECRET}`.

## Keputusan sesi ini (sudah dijawab tim)

1. **CI bertahap.** PR 1: install, typecheck, lint, unit test, build, E2E smoke tanpa database. Langkah branch Neon + migrasi + seed + tes integrasi ditambahkan di PR 3 saat skema ada.
2. **Halaman token sementara di `/`.** Menampilkan logo, palet warna, tipografi, lencana status, dan tombol agar token bisa ditinjau di preview. Di PR 2 `/` diganti redirect per peran (design.md §5.2). Halaman `/dev/components` (tech.md §10) dibuat terpisah, hanya aktif di development.
3. **Route stub cron.** `vercel.json` sesuai §8 + `/api/cron/daily` yang memeriksa `CRON_SECRET` lalu menjawab 200 "belum ada langkah". Isi langkah cron menyusul di PR 11.

## Berkas yang dibuat atau diubah

**Kerangka aplikasi**
- `package.json` (versi persis, `packageManager: pnpm@...`, `engines.node >= 22`), `.npmrc` (`save-exact=true`), `pnpm-lock.yaml`, `.nvmrc` (22)
- `tsconfig.json` (strict, alias `@/*` → `src/*`), `next.config.ts`, `.gitignore`, `.env.example`
- `src/app/layout.tsx` (`lang="id"`, font Geist + Geist Mono, metadata SIRAMA), `src/app/page.tsx` (halaman token sementara), `src/app/icon.svg` (favicon dari simbol logo)
- `src/app/dev/components/page.tsx` (hanya development; `notFound()` di produksi)
- Folder kosong sesuai tech.md §3 diberi `.gitkeep` hanya bila perlu; folder lain dibuat saat dipakai.

**Token dan UI**
- `src/app/globals.css`: semua token `tokens.json` (warna, radius, bayangan, ukuran, durasi, opacity, blur) sebagai variabel CSS di `:root`, dipetakan ke Tailwind v4 lewat `@theme inline`. Variabel semantik shadcn dipetakan ke token SIRAMA (`primary` → `air`, `background` → `canvas`, `foreground` → `ink`, `border` → `line`, `ring` → `air`, `destructive` → `status-red`, dst.); warna bawaan shadcn dihapus. Kelas tipografi (`text-page-title`, `text-body`, `text-label`, dst.) dari `tokens.json` `type.groups`. Kelas `.sr-id` (`font-feature-settings: "ss09"`). Animasi mati saat `prefers-reduced-motion`.
- `components.json` (konfigurasi shadcn), `src/lib/utils.ts` (`cn`)
- `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`: hanya dua komponen untuk membuktikan token; komponen lain ditambahkan di PR yang memakainya.
- `src/components/sirama/logo.tsx`: simbol rack + wordmark (design.md §4.7).

**Database**
- `drizzle.config.ts` (skema `src/server/db/schema.ts`, keluaran `db/migrations/`, dialek PostgreSQL; membaca `.env.local` dengan `process.loadEnvFile` bawaan Node 22, tanpa dependensi tambahan)
- `src/server/db/client.ts` (`Pool` dari `@neondatabase/serverless` + `drizzle-orm/neon-serverless`; Node 22 sudah punya `WebSocket` global, jadi paket `ws` tidak perlu)
- `src/server/db/schema.ts` (kosong; diisi PR 3)

**Cron**
- `vercel.json`: `{"crons":[{"path":"/api/cron/daily","schedule":"0 0 * * *"}]}`
- `src/app/api/cron/daily/route.ts`: tolak 401 tanpa header yang benar; 200 `{ ok: true, steps: [] }` bila benar.

**Mutu kode**
- `eslint.config.mjs` (flat config `eslint-config-next` + `eslint-config-prettier`). Aturan `no-restricted-imports` untuk `src/domain/**` yang melarang impor `next/*`, `react`, `drizzle-orm`, `@neondatabase/*`, `@/server/*`, sehingga aturan "domain murni" di CLAUDE.md dijaga otomatis.
- `.prettierrc`, `.prettierignore`

**Tes**
- `vitest.config.ts` (lingkungan node, alias `@/`, memuat `.env.local` lewat `loadEnv` Vite)
- `playwright.config.ts` (dua proyek: desktop Chromium dan HP 375 px; `webServer` = `pnpm build && pnpm start` di CI, `pnpm dev` di lokal)
- `tests/unit/tokens.test.ts`, `tests/unit/no-raw-colors.test.ts`, `tests/unit/cron-route.test.ts`, `tests/integration/db.test.ts`, `tests/e2e/smoke.spec.ts` (rinci di bawah)

**CI**
- `.github/workflows/ci.yml`: dipicu `pull_request` dan `push` ke `main`. Langkah: pnpm + Node 22 (cache) → `pnpm install --frozen-lockfile` → typecheck → lint → `pnpm test` → build → instal Chromium → `pnpm test:e2e` → unggah laporan Playwright sebagai artefak.

**Dokumen**
- `plans/01-fondasi.md` (rencana ini)
- `CLAUDE.md` bagian Perintah: tandai perintah yang sudah tersedia (`db:seed` menyusul PR 3)
- `README.md`: cara menjalankan lokal, status Build
- `docs/devlog.md`: entri sesi + versi paket yang dikunci (setelah merge)

## Dependensi

Semua dari tech.md §2. Yang ditambahkan di luar daftar itu, beserta alasannya:

| Paket | Alasan |
|---|---|
| `geist` | Paket resmi font Geist (design.md §4.4 "dipakai dari paket resminya"); berkas lengkap sehingga fitur `ss09` untuk `.sr-id` tetap ada. `next/font/google` berisiko memotong fitur OpenType. |
| `clsx`, `tailwind-merge`, `class-variance-authority`, `radix-ui`, `tw-animate-css` | Bawaan `shadcn init` untuk Tailwind v4 (T5). |
| `eslint-config-prettier`, `prettier-plugin-tailwindcss` | Lint tidak bentrok dengan Prettier; urutan kelas Tailwind seragam agar diff PR lebih bersih. |

Paket yang baru dipakai PR berikutnya (`better-auth`, `zod`, `react-hook-form`, `date-fns`, `qrcode`) **tidak** dipasang di PR 1. Sebelum memasang, versi terbaru dicek (`pnpm view next version` dst.). Bila versi stabil terbaru tidak sama dengan tech.md (misalnya Next.js sudah 17), saya berhenti dan bertanya.

## Tes yang ditulis

| Berkas | Isi |
|---|---|
| `tokens.test.ts` | Setiap token warna, radius, bayangan, ukuran, durasi di `tokens.json` ada di `globals.css` dengan nilai sama (alias `{canvas}` diselesaikan). Menjaga tokens.json sebagai sumber kebenaran. |
| `no-raw-colors.test.ts` | Tidak ada warna hex/rgb atau nilai sembarang Tailwind (`bg-[#...]`, `text-[13px]`) di `src/**/*.tsx`. Menjaga aturan "tidak ada warna atau ukuran di luar token". |
| `cron-route.test.ts` | Tanpa header → 401; token salah → 401; token benar → 200. Handler dipanggil langsung, tanpa server. |
| `db.test.ts` | `select 1` lewat `client.ts`. Dilewati (`skipIf`) bila `DATABASE_URL` kosong, jadi di CI PR 1 dilewati; dijalankan lokal setelah `.env.local` diisi. |
| `smoke.spec.ts` | `/` tampil (200), berisi "SIRAMA", tanpa error console, di desktop dan 375 px tanpa scroll horizontal. |

## Urutan commit

1. `chore: inisialisasi Next.js 16, TypeScript strict, pnpm` (dibuat di scratchpad lalu disalin, agar README.md dan CLAUDE.md tidak tertimpa)
2. `feat: token SIRAMA di Tailwind v4, font Geist, shadcn Button dan Badge`
3. `feat: halaman token sementara, logo, dan favicon`
4. `chore: koneksi Drizzle ke Neon`
5. `feat: vercel.json dan route cron dengan CRON_SECRET`
6. `test: Vitest, Playwright, dan tes token, cron, smoke`
7. `chore: ESLint, Prettier, dan aturan impor domain`
8. `chore: CI GitHub Actions`
9. `docs: rencana PR 1, perintah di CLAUDE.md, README`

## Yang perlu kamu siapkan sendiri

Wajib sebelum saya mulai menulis kode:
1. **pnpm.** Belum terpasang (Node 22.16 dan npm sudah ada). Jalankan `! npm install -g pnpm` (tanpa hak admin, berbeda dengan `corepack enable`).
2. **Login GitHub CLI.** `gh` 2.83 sudah terpasang tetapi belum login. Jalankan `! gh auth login` → GitHub.com → HTTPS → login lewat browser. Pastikan akun itu punya hak tulis ke `haldrianlab-arch/DCM_PROJECT`.

Wajib sebelum PR dibuka (bisa disiapkan sambil saya menulis kode):
3. **Neon** (paket gratis): buat project lewat Vercel Marketplace (langkah 4) agar branch preview per PR otomatis. Region Singapore. Di console Neon buat branch `dev`, salin *pooled connection string* branch `dev` ke `.env.local` sebagai `DATABASE_URL`. Jangan kirim string itu lewat chat.
4. **Vercel** (paket Hobby, login dengan GitHub): Add New → Project → impor `DCM_PROJECT`. Lalu Storage → Neon untuk menghubungkan database (mengisi `DATABASE_URL` otomatis dan membuat branch per preview). Catatan: bila `haldrianlab-arch` adalah organisasi GitHub, cek apakah Hobby mengizinkan impor repo organisasi; bila tidak, kita bahas pilihannya.
5. **`CRON_SECRET`**: buat dengan `openssl rand -base64 32` (tersedia di Git Bash), isi di Vercel (Production + Preview) dan di `.env.local`.

Bisa menunggu PR berikutnya:
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (PR 2)
- `SEED_PASSWORD`, `NEON_API_KEY` dan `NEON_PROJECT_ID` sebagai GitHub Secrets untuk CI (PR 3)
- Proteksi branch `main` (wajib PR + CI hijau): diaktifkan setelah CI pertama kali jalan, karena nama status check baru muncul setelah itu.
- Undang Calvin dan Christian sebagai collaborator agar bisa meninjau PR.

## Verifikasi

1. Lokal: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:e2e` semuanya hijau.
2. Dengan `.env.local` terisi: `pnpm test` menjalankan `db.test.ts` (tidak dilewati) dan lulus.
3. `pnpm dev`, buka `http://localhost:3000`: palet, tipografi, lencana, tombol, dan nol bergaris di `.sr-id` sesuai design.md §4; cek juga di lebar 375 px.
4. `curl` ke `/api/cron/daily` tanpa header → 401, dengan header benar → 200.
5. Push branch, buka PR dengan `gh pr create`; CI hijau; tim meninjau preview Vercel.

## Pertanyaan terbuka

Tidak ada untuk kode. Satu hal untuk dicek kamu: apakah `haldrianlab-arch` akun pribadi atau organisasi (berpengaruh ke Vercel Hobby, langkah 4).
