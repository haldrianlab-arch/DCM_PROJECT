# PR 2: Auth

| | |
|---|---|
| Branch | `feat/02-auth` dari `main` |
| Acuan | PRD US-AUTH-01, US-AUTH-03, matriks hak akses §5, Lampiran A (user), Lampiran C (User); design.md §5.2-5.4, HAL-01, HAL-29, HAL-30, TPL-06, KOM-26/27/28, MOD-10; tech.md §4.2 (auth), §6, §13, §15 |
| Disalin ke | `plans/02-auth.md` (ikut di-commit) |

## Konteks dan tujuan

PR 1 menyiapkan kerangka. PR 2 membuat SIRAMA hanya bisa dibuka setelah login: login email + password dengan Better Auth, tiga peran (Admin, Teknisi, Viewer), pengalihan ke halaman awal per peran, pemeriksaan hak akses di server, dan tata letak aplikasi (sidebar, header, bar bawah HP). Setelah PR ini, empat akun demo bisa login di preview dan setiap PR berikutnya tinggal menambah halaman di dalam layout yang sudah ada.

## User story dan AC yang dicakup

| AC | Cakupan di PR 2 | Tes |
|---|---|---|
| US-AUTH-01 AC1 | Login benar → Dashboard (Admin, Viewer) atau Tugas saya (Teknisi) | E2E per peran |
| US-AUTH-01 AC2 | Password salah → "Email atau password salah." | Integrasi + E2E |
| US-AUTH-01 AC3 | Akun nonaktif (banned) → pesan sama dengan AC2 | Integrasi + E2E |
| US-AUTH-01 AC4 | Belum login → `/login?next=...` | E2E |
| US-AUTH-01 AC5 | Tidak ada pendaftaran mandiri (`disableSignUp`) | Integrasi (endpoint sign-up ditolak) |
| US-AUTH-03 AC1 | Fondasi: `authorize()` untuk server action menolak peran salah. AC1 penuh (hapus device) diuji di PR 6 | Integrasi `authorize` per peran |
| US-AUTH-03 AC2 | Menu Administrasi hanya Admin; Tugas saya hanya Teknisi; bar bawah per peran | Unit (navigasi per peran) + E2E |

Tidak dicakup: US-AUTH-02 (kelola user, PR 8), US-AUTH-04 (Should). HAL-29 dibuat dan ditampilkan lewat `forbidden()`, tetapi belum ada halaman khusus Admin untuk diuji E2E; diuji di PR 8 (`/users`).

## Keputusan sesi ini (sudah dijawab tim)

1. **Tabel auth dan seed user di PR 2.** Migrasi pertama berisi tabel Better Auth (`user`, `session`, `account`, `verification`) + kolom `role`, `skill`, `banned`. `pnpm db:seed` versi awal: kosongkan tabel auth lalu buat 4 akun demo dengan `SEED_PASSWORD`. PR 3 menambah tabel lain dan memperluas seed.
2. **Branch Neon di CI mulai PR 2.** Job CI: buat branch Neon sementara → migrasi → seed → tes integrasi + E2E → hapus branch (selalu, termasuk saat gagal).
3. **Branch Neon per preview + migrasi saat build.** Integrasi Neon-Vercel diatur agar setiap preview punya branch sendiri; `vercel.json` `buildCommand` menjalankan `pnpm db:migrate` sebelum `pnpm build`, untuk preview dan produksi. Ini mengubah tech.md §4.4 (migrasi oleh CI) karena CI tidak tahu branch milik preview Vercel; tech.md diperbarui di PR ini.
4. **Cache Components dimatikan.** `cacheComponents` dan `partialPrefetching` dihapus dari `next.config.ts`; halaman bersesi dirender dinamis biasa tanpa Suspense wajib. Dicatat di tech.md §1 dan CLAUDE.md.
5. **Header hanya menu user** (nama, peran, Keluar). Pencarian (KOM-31) di PR 8, lonceng (KOM-30) di PR 11.
6. **Halaman awal sementara**: `/dashboard` dan `/my-tasks` berisi judul + satu kalimat. Menu lain tampil sesuai peran dan mengarah ke HAL-30 sampai halamannya dibuat.

## Rancangan

**Better Auth (`src/server/auth.ts`)**
- `betterAuth({ database: drizzleAdapter(db, { provider: "pg", schema }), emailAndPassword: { enabled: true, disableSignUp: true }, plugins: [admin({ ac, roles, defaultRole: "viewer", adminRoles: ["admin"] }), nextCookies()] })`, `user.additionalFields.skill`.
- `baseURL`: `BETTER_AUTH_URL`; bila kosong di Vercel, dari `VERCEL_BRANCH_URL`/`VERCEL_URL` (preview berganti URL). `trustedOrigins` ikut daftar yang sama.
- Hash password bawaan (scrypt). Sesi di database.
- `src/app/api/auth/[...all]/route.ts`: `toNextJsHandler(auth)`.

**Skema (`src/server/db/schema.ts`)**: tabel Better Auth ditulis tangan sesuai skema adapter Drizzle; enum `role` (`admin`, `technician`, `viewer`) dan `skill` (`it`, `facility`, `both`); CHECK: `skill` wajib bila `role = technician` (tech.md §4.2). Migrasi pertama `db/migrations/0000_*.sql` di-commit.

**Login (HAL-01, `src/app/(auth)/login/`)**
- Server action `signIn`: Zod → `auth.api.signInEmail` → apa pun kegagalannya (salah, banned, tidak ada) dikembalikan `{ ok: false, message: "Email atau password salah." }` → berhasil: `redirect(next aman ?? halaman awal peran)`.
- Form memakai `useActionState` (dua kolom, tetap jalan sebelum JavaScript termuat); `react-hook-form` dipasang di PR pertama yang punya form kompleks (PR 4).
- Kolom password dengan tombol tampilkan/sembunyikan (KOM-03). Tidak ada tautan daftar atau lupa password.

**Otorisasi (`src/server/authz.ts`)**
- `getCurrentUser()`: sesi dari `auth.api.getSession({ headers })`, di-cache per permintaan (`React.cache`).
- `requireUser()` (halaman): tanpa sesi → `redirect("/login?next=...")`.
- `requireRole(...roles)` (halaman): peran salah → `forbidden()` → HAL-29 (`forbidden.tsx`; butuh `experimental.authInterrupts`, dicek di dokumentasi Next 16.4 saat implementasi).
- `authorize(...roles)` (server action): mengembalikan `{ ok: false, code: "forbidden", message }`, bukan throw (CLAUDE.md). `canWorkOn` menyusul di PR 10.
- `src/proxy.ts`: hanya cek ada/tidaknya cookie sesi (`getSessionCookie`) → `/login?next=`; bukan pemeriksaan keamanan (tech.md §6.2).

**Domain murni (`src/domain/roles.ts`)**: `homePathFor(role)`, `isSafeNextPath(next)` (hanya path relatif internal, tolak `//`, `http:`, `/api/`, `/login`), `navigationFor(role)` (daftar id menu sidebar dan bar bawah sesuai design.md §5.3-5.4). `src/lib/labels.ts`: label peran dan keahlian bahasa Indonesia.

**Layout (`src/app/(app)/layout.tsx`)**: `requireUser()` lalu
- `components/sirama/sidebar.tsx` (KOM-26): logo, Dashboard, Tugas saya (Teknisi), grup Inventaris, Maintenance, Katalog, Administrasi (Admin); grup tertutup bawaan kecuali yang berisi halaman aktif; buka/tutup dan ciut 64 px diingat di `localStorage`; menu aktif `air-soft` + `air`; tooltip saat diciutkan. Ikon sesuai design-system README.
- `components/sirama/app-header.tsx` (KOM-27): menu user (nama, peran, Keluar) dengan `DropdownMenu` dari `radix-ui`.
- `components/sirama/bottom-nav.tsx` (KOM-28) dan `mobile-menu.tsx` (MOD-10, `Dialog` dari `radix-ui`) di ≤ 768 px, dengan area aman layar.
- Keluar: server action `signOut` → `/login`.
- Halaman sementara `/dashboard`, `/my-tasks`; `/` mengalihkan ke halaman awal peran (halaman token PR 1 dipindah ke `/dev/components`).
- `src/app/not-found.tsx` (HAL-30) dan `forbidden.tsx` (HAL-29) memakai `components/sirama/message-page.tsx` (TPL-06).

**Seed (`db/seed/index.ts`, `pnpm db:seed`)**: kosongkan tabel auth, buat Andi (Admin), Rina (Teknisi, IT), Joko (Teknisi, Fasilitas), Sari (Viewer) dengan email `@kampus.ac.id` (mengikuti wireframe HAL-01) dan `SEED_PASSWORD`; hash lewat `better-auth/crypto`. Tolak berjalan bila `SEED_PASSWORD` kosong.

**Vercel dan CI**
- `vercel.json`: `"buildCommand": "pnpm db:migrate && pnpm build"`. `drizzle.config.ts` memakai `DATABASE_URL_UNPOOLED` bila ada (migrasi sebaiknya tanpa pooler), selain itu `DATABASE_URL`.
- `.github/workflows/ci.yml`: langkah Neon (aksi resmi `neondatabase/create-branch-action` dan `delete-branch-action`, versi dicek saat implementasi) dengan `NEON_API_KEY` dan `NEON_PROJECT_ID`; `BETTER_AUTH_SECRET` dan `SEED_PASSWORD` dibuat acak per job; lalu migrasi → seed → `pnpm test` → build → E2E → hapus branch (`if: always()`).

**Dokumen**: `plans/02-auth.md`; tech.md (§1 Cache Components, §4.4 migrasi saat build Vercel, §13 preview branch, §15 PR 2 membawa tabel auth + seed user + CI Neon); `.env.example` (`DATABASE_URL_UNPOOLED` opsional); CLAUDE.md Perintah (`db:seed` tersedia); devlog sesi 14.

## Dependensi baru

| Paket | Versi | Alasan |
|---|---|---|
| `better-auth` | 1.7.25 (14 Nov) | T2; cocok dengan Next 16 dan Drizzle 0.45 (peer dependency dicek) |
| `zod` | 4.6.7 | Validasi server action (tech.md §2, §7) |
| `tsx` | versi terbaru > 24 jam | Menjalankan `db/seed/index.ts` (TypeScript + alias `@/`) dari `pnpm db:seed` |

Semua dicek lolos aturan umur rilis 24 jam sebelum dipasang.

## Tes yang ditulis

| Berkas | Isi |
|---|---|
| `tests/unit/roles.test.ts` | `homePathFor` tiap peran; `isSafeNextPath` (relatif ok; `//evil`, `https://`, `/api/...`, `/login` ditolak); `navigationFor`: Administrasi hanya Admin, Tugas saya hanya Teknisi, bar bawah sesuai tabel §5.4 |
| `tests/integration/auth.test.ts` | Login benar per peran mengembalikan sesi dan peran; password salah dan email tak dikenal → pesan sama; user banned → pesan sama dan sesinya dicabut; endpoint sign-up ditolak; CHECK `skill` untuk Teknisi; seed idempoten (dua kali → tetap 4 user) |
| `tests/integration/authz.test.ts` | `authorize("admin")` dengan sesi Teknisi dan Viewer → `forbidden`; dengan Admin → ok |
| `tests/e2e/auth.spec.ts` | Login 4 peran → halaman awal benar (AC1); password salah (AC2); akun banned (AC3, dibuat per tes); belum login → `/login?next=` lalu kembali ke tujuan (AC4); tidak ada tautan daftar (AC5); sidebar per peran (desktop) dan bar bawah per peran (375 px) (US-AUTH-03 AC2); Keluar; URL tak dikenal → HAL-30. Semua direkam video |
| `tests/e2e/smoke.spec.ts` | Disesuaikan: halaman token kini di `/dev/components` (hanya lokal), route cron tetap |

## Yang perlu kamu siapkan

Sebelum mulai menulis kode:
1. **`SEED_PASSWORD`** di `.env.local` (password akun demo, minimal 8 karakter). Masih kosong.

Sebelum PR dibuka (bisa sambil aku menulis kode):
2. **GitHub Secrets** (repo → Settings → Secrets and variables → Actions): `NEON_API_KEY` (Neon console → Account settings → API keys → buat key baru) dan `NEON_PROJECT_ID` (Neon → project → Settings; nilainya sama dengan variabel `NEON_PROJECT_ID` yang sudah ada di Vercel).
3. **Vercel env**: `BETTER_AUTH_SECRET` untuk Production dan Preview (nilai baru, berbeda dari `.env.local`); `BETTER_AUTH_URL` untuk Production saja = URL produksi (`https://<domain-produksi>.vercel.app`). Preview memakai URL otomatis dari Vercel.
4. **Preview branching Neon**: Vercel → Storage → database Neon → pengaturan integrasi → aktifkan pembuatan branch untuk setiap preview deployment.

Setelah merge (aku tanyakan dulu, karena mengosongkan tabel auth produksi): jalankan `pnpm db:seed` sekali terhadap database produksi agar akun demo bisa login di produksi.

## Verifikasi

1. Lokal (Neon branch `dev`): `pnpm db:migrate`, `pnpm db:seed`, lalu typecheck, lint, format, `pnpm test`, build, `pnpm test:e2e` hijau.
2. Manual `pnpm dev`: login keempat akun, cek halaman awal, sidebar/bar bawah per peran, Keluar, `/apa-saja` → HAL-30, akses tanpa login → login lalu kembali ke tujuan.
3. CI: branch Neon dibuat dan dihapus, semua tes hijau, artefak video berisi alur login.
4. Preview: build menjalankan migrasi ke branch preview; login dengan akun demo (data dari branch induk; bila produksi belum di-seed, seed dijalankan ke branch preview dulu) dan uji dengan `npx vercel curl`.

## Pertanyaan terbuka

- Email akun demo memakai pola `andi@kampus.ac.id` dari wireframe HAL-01 (PRD tidak menyebut email). Ganti bila tim punya pola lain.
- `forbidden()` di Next 16.4 masih di balik `experimental.authInterrupts`; bila ternyata tidak stabil, HAL-29 dirender langsung oleh `requireRole` tanpa `forbidden()` (perilaku sama bagi user).
