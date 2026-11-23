# Bukti testing SIRAMA

Dibuat otomatis oleh `pnpm test:evidence` (`scripts/test-evidence.mjs`). Jangan diubah manual; jalankan ulang perintahnya.

| | |
|---|---|
| Waktu | 24 Nov 2026, 04.18 WIB |
| Commit | `ca5f6f7` (branch `feat/02-auth`) |
| Node | v22.16.0 |
| Database | Neon branch `dev` (akun demo dari `pnpm db:seed`) |
| E2E | Build produksi (`next start`), Chromium desktop 1280 x 720 dan HP 375 x 812 |

## Ringkasan

| Pemeriksaan | Hasil | Durasi |
|---|---|---|
| Typecheck | Lulus | 3 detik |
| Lint | Lulus | 4 detik |
| Format | Lulus | 1 detik |
| Unit + integrasi (Vitest) | Lulus | 40 detik |
| Build produksi | Lulus | 8 detik |
| E2E (Playwright) | Lulus | 23 detik |

| Jenis tes | Jumlah | Lulus | Gagal | Dilewati |
|---|---|---|---|---|
| Unit (Vitest) | 164 | 164 | 0 | 0 |
| Integrasi (Vitest + Neon) | 19 | 19 | 0 | 0 |
| E2E (Playwright, desktop + HP) | 54 | 46 | 0 | 8 |

Tes E2E yang "Dilewati" sengaja hanya dijalankan di satu ukuran layar (misalnya sidebar hanya ada di desktop, bar bawah hanya di HP).

## Tes per PR

Kolom **PR** di setiap tabel menunjukkan PR (urutan Build di `specs/tech.md` §15) yang pertama menambahkan tes itu, atau yang terakhir mengganti judulnya. Ditentukan otomatis dari riwayat git: commit di `main` dibaca dari judul squash merge "PR N: ...", commit yang belum di-merge dari nama branch `feat/NN-...`.

| PR | Unit | Integrasi | Skenario E2E |
|---|---|---|---|
| PR 1 | 138 | 2 | 4 |
| PR 2 | 26 | 17 | 23 |

## Jenis pemeriksaan

| Jenis | Alat | Yang dibuktikan | Bukti |
|---|---|---|---|
| Typecheck | TypeScript (`tsc`) | Tipe data konsisten di seluruh kode | Baris Ringkasan |
| Lint | ESLint | Pola kode berbahaya, aturan `src/domain/` murni | Baris Ringkasan |
| Format | Prettier | Penulisan kode seragam | Baris Ringkasan |
| Unit | Vitest | Fungsi murni (aturan bisnis, peran, token) tanpa database | Tabel Unit di bawah |
| Integrasi | Vitest + Neon | Kode server dengan database sungguhan (login, hak akses, seed) | Tabel Integrasi di bawah |
| E2E (blackbox) | Playwright | Aplikasi dipakai seperti user di browser | Tabel E2E + video |

## E2E (Playwright)

Satu baris = satu skenario. Klik "video" untuk melihat rekamannya.

| No | PR | Kelompok | Skenario | Mencakup | Desktop | HP 375 px |
|---|---|---|---|---|---|---|
| 01 | PR 2 | US-AUTH-01 login | AC1: andi@kampus.ac.id masuk ke halaman awal perannya (/dashboard) | US-AUTH-01 AC1 | Lulus, [video](e2e/01-us-auth-01-login-ac1-andi-masuk-ke-halaman-awal-perannya-dashboard-desktop.webm) | Lulus, [video](e2e/01-us-auth-01-login-ac1-andi-masuk-ke-halaman-awal-perannya-dashboard-hp.webm) |
| 02 | PR 2 | US-AUTH-01 login | AC1: rina@kampus.ac.id masuk ke halaman awal perannya (/my-tasks) | US-AUTH-01 AC1 | Lulus, [video](e2e/02-us-auth-01-login-ac1-rina-masuk-ke-halaman-awal-perannya-my-tasks-desktop.webm) | Lulus, [video](e2e/02-us-auth-01-login-ac1-rina-masuk-ke-halaman-awal-perannya-my-tasks-hp.webm) |
| 03 | PR 2 | US-AUTH-01 login | AC1: joko@kampus.ac.id masuk ke halaman awal perannya (/my-tasks) | US-AUTH-01 AC1 | Lulus, [video](e2e/03-us-auth-01-login-ac1-joko-masuk-ke-halaman-awal-perannya-my-tasks-desktop.webm) | Lulus, [video](e2e/03-us-auth-01-login-ac1-joko-masuk-ke-halaman-awal-perannya-my-tasks-hp.webm) |
| 04 | PR 2 | US-AUTH-01 login | AC1: sari@kampus.ac.id masuk ke halaman awal perannya (/dashboard) | US-AUTH-01 AC1 | Lulus, [video](e2e/04-us-auth-01-login-ac1-sari-masuk-ke-halaman-awal-perannya-dashboard-desktop.webm) | Lulus, [video](e2e/04-us-auth-01-login-ac1-sari-masuk-ke-halaman-awal-perannya-dashboard-hp.webm) |
| 05 | PR 2 | US-AUTH-01 login | AC2: password salah → pesan umum, tetap di halaman login | US-AUTH-01 AC2 | Lulus, [video](e2e/05-us-auth-01-login-ac2-password-salah-pesan-umum-tetap-di-halaman-login-desktop.webm) | Lulus, [video](e2e/05-us-auth-01-login-ac2-password-salah-pesan-umum-tetap-di-halaman-login-hp.webm) |
| 06 | PR 2 | US-AUTH-01 login | AC2: email tidak terdaftar → pesan yang sama | US-AUTH-01 AC2 | Lulus, [video](e2e/06-us-auth-01-login-ac2-email-tidak-terdaftar-pesan-yang-sama-desktop.webm) | Lulus, [video](e2e/06-us-auth-01-login-ac2-email-tidak-terdaftar-pesan-yang-sama-hp.webm) |
| 07 | PR 2 | US-AUTH-01 login | AC3: akun dinonaktifkan → ditolak dengan pesan yang sama | US-AUTH-01 AC3 | Lulus, [video](e2e/07-us-auth-01-login-ac3-akun-dinonaktifkan-ditolak-dengan-pesan-yang-sama-desktop.webm) | Lulus, [video](e2e/07-us-auth-01-login-ac3-akun-dinonaktifkan-ditolak-dengan-pesan-yang-sama-hp.webm) |
| 08 | PR 2 | US-AUTH-01 login | AC4: belum login → ke halaman login, lalu kembali ke tujuan | US-AUTH-01 AC4 | Lulus, [video](e2e/08-us-auth-01-login-ac4-belum-login-ke-halaman-login-lalu-kembali-ke-tuju-desktop.webm) | Lulus, [video](e2e/08-us-auth-01-login-ac4-belum-login-ke-halaman-login-lalu-kembali-ke-tuju-hp.webm) |
| 09 | PR 2 | US-AUTH-01 login | AC4: halaman yang belum dibuat pun tetap meminta login dulu | US-AUTH-01 AC4 | Lulus, [video](e2e/09-us-auth-01-login-ac4-halaman-yang-belum-dibuat-pun-tetap-meminta-login-desktop.webm) | Lulus, [video](e2e/09-us-auth-01-login-ac4-halaman-yang-belum-dibuat-pun-tetap-meminta-login-hp.webm) |
| 10 | PR 2 | US-AUTH-01 login | AC4: halaman awal / tanpa login → halaman login | US-AUTH-01 AC4 | Lulus, [video](e2e/10-us-auth-01-login-ac4-halaman-awal-tanpa-login-halaman-login-desktop.webm) | Lulus, [video](e2e/10-us-auth-01-login-ac4-halaman-awal-tanpa-login-halaman-login-hp.webm) |
| 11 | PR 2 | US-AUTH-01 login | AC5: tidak ada tautan pendaftaran atau lupa password | US-AUTH-01 AC5 | Lulus, [video](e2e/11-us-auth-01-login-ac5-tidak-ada-tautan-pendaftaran-atau-lupa-password-desktop.webm) | Lulus, [video](e2e/11-us-auth-01-login-ac5-tidak-ada-tautan-pendaftaran-atau-lupa-password-hp.webm) |
| 12 | PR 2 | US-AUTH-01 login | password dapat ditampilkan dan disembunyikan | US-AUTH-01 | Lulus, [video](e2e/12-us-auth-01-login-password-dapat-ditampilkan-dan-disembunyikan-desktop.webm) | Lulus, [video](e2e/12-us-auth-01-login-password-dapat-ditampilkan-dan-disembunyikan-hp.webm) |
| 13 | PR 2 | US-AUTH-03 AC2 menu sesuai peran | desktop: sidebar Admin punya Administrasi, tanpa Tugas saya | US-AUTH-03 AC2 | Lulus, [video](e2e/13-us-auth-03-ac2-menu-sesuai-peran-desktop-sidebar-admin-punya-administr-desktop.webm) | Dilewati |
| 14 | PR 2 | US-AUTH-03 AC2 menu sesuai peran | desktop: sidebar Teknisi punya Tugas saya, tanpa Administrasi | US-AUTH-03 AC2 | Lulus, [video](e2e/14-us-auth-03-ac2-menu-sesuai-peran-desktop-sidebar-teknisi-punya-tugas-s-desktop.webm) | Dilewati |
| 15 | PR 2 | US-AUTH-03 AC2 menu sesuai peran | desktop: sidebar Viewer tanpa Tugas saya dan tanpa Administrasi | US-AUTH-03 AC2 | Lulus, [video](e2e/15-us-auth-03-ac2-menu-sesuai-peran-desktop-sidebar-viewer-tanpa-tugas-sa-desktop.webm) | Dilewati |
| 16 | PR 2 | US-AUTH-03 AC2 menu sesuai peran | HP: bar bawah rina@kampus.ac.id sesuai design.md §5.4 | US-AUTH-03 AC2 | Dilewati | Lulus, [video](e2e/16-us-auth-03-ac2-menu-sesuai-peran-hp-bar-bawah-rina-sesuai-design-md-5-hp.webm) |
| 17 | PR 2 | US-AUTH-03 AC2 menu sesuai peran | HP: bar bawah andi@kampus.ac.id sesuai design.md §5.4 | US-AUTH-03 AC2 | Dilewati | Lulus, [video](e2e/17-us-auth-03-ac2-menu-sesuai-peran-hp-bar-bawah-andi-sesuai-design-md-5-hp.webm) |
| 18 | PR 2 | US-AUTH-03 AC2 menu sesuai peran | HP: bar bawah sari@kampus.ac.id sesuai design.md §5.4 | US-AUTH-03 AC2 | Dilewati | Lulus, [video](e2e/18-us-auth-03-ac2-menu-sesuai-peran-hp-bar-bawah-sari-sesuai-design-md-5-hp.webm) |
| 19 | PR 2 | US-AUTH-03 AC2 menu sesuai peran | HP: menu MOD-10 berisi menu dan tombol Keluar | US-AUTH-03 AC2; MOD-10 | Dilewati | Lulus, [video](e2e/19-us-auth-03-ac2-menu-sesuai-peran-hp-menu-mod-10-berisi-menu-dan-tombol-hp.webm) |
| 20 | PR 2 | keluar dan halaman pesan | Keluar mengakhiri sesi | — | Lulus, [video](e2e/20-keluar-dan-halaman-pesan-keluar-mengakhiri-sesi-desktop.webm) | Dilewati |
| 21 | PR 2 | keluar dan halaman pesan | HAL-30: alamat tidak dikenal → Halaman tidak ditemukan | HAL-30 | Lulus, [video](e2e/21-keluar-dan-halaman-pesan-hal-30-alamat-tidak-dikenal-halaman-tidak-dit-desktop.webm) | Lulus, [video](e2e/21-keluar-dan-halaman-pesan-hal-30-alamat-tidak-dikenal-halaman-tidak-dit-hp.webm) |
| 22 | PR 2 | keluar dan halaman pesan | HAL-29: Admin membuka Tugas saya (khusus Teknisi) → Akses ditolak | HAL-29 | Lulus, [video](e2e/22-keluar-dan-halaman-pesan-hal-29-admin-membuka-tugas-saya-khusus-teknis-desktop.webm) | Lulus, [video](e2e/22-keluar-dan-halaman-pesan-hal-29-admin-membuka-tugas-saya-khusus-teknis-hp.webm) |
| 23 | PR 2 | smoke halaman | halaman login tampil tanpa error dan tanpa scroll horizontal | — | Lulus, [video](e2e/23-smoke-halaman-halaman-login-tampil-tanpa-error-dan-tanpa-scroll-horizo-desktop.webm) | Lulus, [video](e2e/23-smoke-halaman-halaman-login-tampil-tanpa-error-dan-tanpa-scroll-horizo-hp.webm) |
| 24 | PR 1 | smoke halaman | tombol utama memakai token air dan lebih gelap saat disorot | — | Lulus, [video](e2e/24-smoke-halaman-tombol-utama-memakai-token-air-dan-lebih-gelap-saat-diso-desktop.webm) | Lulus, [video](e2e/24-smoke-halaman-tombol-utama-memakai-token-air-dan-lebih-gelap-saat-diso-hp.webm) |
| 25 | PR 1 | smoke halaman | setiap token warna tersedia sebagai variabel CSS di browser | — | Lulus, [video](e2e/25-smoke-halaman-setiap-token-warna-tersedia-sebagai-variabel-css-di-brow-desktop.webm) | Lulus, [video](e2e/25-smoke-halaman-setiap-token-warna-tersedia-sebagai-variabel-css-di-brow-hp.webm) |
| 26 | PR 1 | smoke route | halaman /dev/components tidak tersedia di build produksi | — | Lulus | Lulus |
| 27 | PR 1 | smoke route | route cron menolak tanpa CRON_SECRET | — | Lulus | Lulus |

## Integrasi (Vitest + database Neon)

### `tests/integration/auth.test.ts`

| PR | Kelompok | Tes | Hasil | Durasi |
|---|---|---|---|---|
| PR 2 | login (US-AUTH-01) | AC1: andi@kampus.ac.id login berhasil dengan peran admin | Lulus | 1104 ms |
| PR 2 | login (US-AUTH-01) | AC1: rina@kampus.ac.id login berhasil dengan peran technician | Lulus | 1022 ms |
| PR 2 | login (US-AUTH-01) | AC1: joko@kampus.ac.id login berhasil dengan peran technician | Lulus | 1028 ms |
| PR 2 | login (US-AUTH-01) | AC1: sari@kampus.ac.id login berhasil dengan peran viewer | Lulus | 1025 ms |
| PR 2 | login (US-AUTH-01) | AC1: email tidak peka huruf besar dan spasi | Lulus | 1025 ms |
| PR 2 | login (US-AUTH-01) | AC2: password salah → pesan umum | Lulus | 555 ms |
| PR 2 | login (US-AUTH-01) | AC2: email tidak terdaftar dan isian tidak valid → pesan yang sama | Lulus | 326 ms |
| PR 2 | login (US-AUTH-01) | AC3: akun dinonaktifkan → ditolak dengan pesan yang sama dan sesinya berakhir | Lulus | 5957 ms |
| PR 2 | login (US-AUTH-01) | AC5: pendaftaran mandiri ditolak | Lulus | 245 ms |
| PR 2 | tabel user dan seed | Teknisi wajib punya keahlian (CHECK user_technician_skill) | Lulus | 230 ms |
| PR 2 | tabel user dan seed | seed dapat dijalankan berulang dan selalu menghasilkan 4 akun demo | Lulus | 7659 ms |
| PR 2 | tabel user dan seed | seed menolak password pendek | Lulus | 0 ms |

### `tests/integration/authz.test.ts`

| PR | Kelompok | Tes | Hasil | Durasi |
|---|---|---|---|---|
| PR 2 | authorize (US-AUTH-03) | tanpa sesi → unauthenticated | Lulus | 3 ms |
| PR 2 | authorize (US-AUTH-03) | aksi khusus Admin ditolak untuk technician, walau dikirim langsung ke server | Lulus | 478 ms |
| PR 2 | authorize (US-AUTH-03) | aksi khusus Admin ditolak untuk viewer, walau dikirim langsung ke server | Lulus | 474 ms |
| PR 2 | authorize (US-AUTH-03) | Admin diizinkan dan menerima data user | Lulus | 478 ms |
| PR 2 | authorize (US-AUTH-03) | aksi untuk beberapa peran: Teknisi diizinkan, Viewer tidak | Lulus | 940 ms |

### `tests/integration/db.test.ts`

| PR | Kelompok | Tes | Hasil | Durasi |
|---|---|---|---|---|
| PR 1 | koneksi database | select 1 | Lulus | 996 ms |
| PR 1 | koneksi database | transaksi interaktif tersedia | Lulus | 715 ms |

## Unit (Vitest)

### `tests/unit/cron-route.test.ts`

| PR | Kelompok | Tes | Hasil | Durasi |
|---|---|---|---|---|
| PR 1 | isAuthorizedCron | menolak bila CRON_SECRET belum diisi, walau header ada | Lulus | 1 ms |
| PR 1 | isAuthorizedCron | menolak tanpa header | Lulus | 0 ms |
| PR 1 | isAuthorizedCron | menolak secret salah atau tanpa awalan Bearer | Lulus | 0 ms |
| PR 1 | isAuthorizedCron | menerima header yang benar | Lulus | 0 ms |
| PR 1 | GET /api/cron/daily | 401 tanpa header Authorization | Lulus | 16 ms |
| PR 1 | GET /api/cron/daily | 401 dengan secret salah | Lulus | 1 ms |
| PR 1 | GET /api/cron/daily | 200 dengan secret benar | Lulus | 1 ms |

### `tests/unit/no-raw-colors.test.ts`

| PR | Kelompok | Tes | Hasil | Durasi |
|---|---|---|---|---|
| PR 1 | tidak ada warna atau ukuran di luar token | ada berkas yang diperiksa | Lulus | 1 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\(app)\dashboard\page.tsx | Lulus | 2 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\(app)\layout.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\(app)\my-tasks\page.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\(auth)\login\login-form.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\(auth)\login\page.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\api\auth\[...all]\route.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\api\cron\daily\route.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\dev\components\page.tsx | Lulus | 1 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\forbidden.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\layout.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\not-found.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\page.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\app\_showcase\showcase.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\sirama\bottom-nav.tsx | Lulus | 1 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\sirama\logo.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\sirama\message-page.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\sirama\mobile-menu.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\sirama\nav-icons.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\sirama\nav-list.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\sirama\page-header.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\sirama\sidebar.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\sirama\user-menu.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\ui\badge.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\ui\button.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\ui\form-field.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\ui\input.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\components\ui\password-input.tsx | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\domain\roles.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\lib\labels.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\lib\use-stored-value.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\lib\utils.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\proxy.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\server\actions\auth.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\server\auth.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\server\authz-constants.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\server\authz.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\server\cron\auth.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\server\db\client.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\server\db\schema.ts | Lulus | 0 ms |
| PR 1 | tidak ada warna atau ukuran di luar token | src\server\sign-in.ts | Lulus | 0 ms |

### `tests/unit/roles.test.ts`

| PR | Kelompok | Tes | Hasil | Durasi |
|---|---|---|---|---|
| PR 2 | homePathFor (design.md §5.2, US-AUTH-01 AC1) | Admin dan Viewer ke Dashboard, Teknisi ke Tugas saya | Lulus | 1 ms |
| PR 2 | isRole | hanya menerima tiga peran | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menerima path internal /devices/123 | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menerima path internal /racks/abc?tab=port | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menerima path internal /my-tasks | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menerima path internal /a/DCM-0001 | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "//evil.example" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "/\\evil.example" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "https://evil.example" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "javascript:alert(1)" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "devices" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "/login" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "/login?next=/x" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "/api/auth/sign-out" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "/api" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak "/x\nSet-Cookie: a=b" | Lulus | 0 ms |
| PR 2 | isSafeNextPath (cegah pengalihan ke situs lain) | menolak bukan string dan path terlalu panjang | Lulus | 0 ms |
| PR 2 | sidebarFor (design.md §5.3, US-AUTH-03 AC2) | grup Administrasi hanya untuk Admin | Lulus | 1 ms |
| PR 2 | sidebarFor (design.md §5.3, US-AUTH-03 AC2) | Tugas saya hanya untuk Teknisi, tepat setelah Dashboard | Lulus | 1 ms |
| PR 2 | sidebarFor (design.md §5.3, US-AUTH-03 AC2) | urutan grup dan isinya sesuai design.md §5.3 | Lulus | 0 ms |
| PR 2 | bottomNavFor (design.md §5.4) | isi bar bawah per peran, kiri ke kanan | Lulus | 0 ms |
| PR 2 | bottomNavFor (design.md §5.4) | Viewer tidak punya Notifikasi (tidak menerima notifikasi, PRD §5) | Lulus | 0 ms |
| PR 2 | menu aktif dan grup terbuka | halaman turunan mengaktifkan menu induknya | Lulus | 0 ms |
| PR 2 | menu aktif dan grup terbuka | detail rack mengaktifkan menu Lokasi (wireframe 00-kerangka) | Lulus | 1 ms |
| PR 2 | menu aktif dan grup terbuka | grup yang berisi halaman aktif terbuka otomatis | Lulus | 0 ms |

### `tests/unit/tokens.test.ts`

| PR | Kelompok | Tes | Hasil | Durasi |
|---|---|---|---|---|
| PR 1 | token design system di globals.css | warna ink | Lulus | 1 ms |
| PR 1 | token design system di globals.css | warna ink-muted | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna surface | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna canvas | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna sidebar | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna muted | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna line | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna line-strong | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna air | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna air-soft | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna air-ring | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna on-fill | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna overlay | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-green | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-green-soft | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-green-text | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-green-line | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-amber | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-amber-soft | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-amber-text | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-amber-line | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-indigo | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-indigo-soft | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-indigo-text | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-indigo-line | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-gray | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-gray-soft | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-gray-text | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-gray-line | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-gray-dark | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-gray-dark-soft | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-gray-dark-text | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-gray-dark-line | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-red | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-red-soft | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-red-text | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna status-red-line | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-server-fill | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-server-edge | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-network-fill | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-network-edge | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-storage-fill | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-storage-edge | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-patch-fill | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-patch-edge | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-power-fill | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-power-edge | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-other-fill | Lulus | 0 ms |
| PR 1 | token design system di globals.css | warna fn-other-edge | Lulus | 0 ms |
| PR 1 | token design system di globals.css | tidak ada warna literal di globals.css yang bukan token | Lulus | 1 ms |
| PR 1 | token design system di globals.css | sudut radius-rack | Lulus | 0 ms |
| PR 1 | token design system di globals.css | sudut radius-control | Lulus | 0 ms |
| PR 1 | token design system di globals.css | sudut radius-card | Lulus | 0 ms |
| PR 1 | token design system di globals.css | sudut radius-modal | Lulus | 0 ms |
| PR 1 | token design system di globals.css | bayangan shadow-xs | Lulus | 0 ms |
| PR 1 | token design system di globals.css | bayangan shadow-float | Lulus | 0 ms |
| PR 1 | token design system di globals.css | bayangan shadow-overlay | Lulus | 0 ms |
| PR 1 | token design system di globals.css | bayangan ring-focus | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran sidebar-width | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran sidebar-collapsed | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran header-height | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran header-height-mobile | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran bottom-nav-height | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran breakpoint-mobile | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran control-height | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran table-row | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran table-head | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran badge-height | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran touch-target | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran rack-unit | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran form-max | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran ring-width | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran function-edge | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran icon-inline | Lulus | 0 ms |
| PR 1 | token design system di globals.css | ukuran icon-nav | Lulus | 0 ms |
| PR 1 | token design system di globals.css | skala jarak 4 px | Lulus | 0 ms |
| PR 1 | token design system di globals.css | duration-fast | Lulus | 0 ms |
| PR 1 | token design system di globals.css | duration-base | Lulus | 0 ms |
| PR 1 | token design system di globals.css | opacity-disabled | Lulus | 0 ms |
| PR 1 | token design system di globals.css | blur-overlay | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks page-title | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks section-title | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks card-title | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks body | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks body-strong | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks small | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks location-lg | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks label-xs | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks code | Lulus | 0 ms |
| PR 1 | token design system di globals.css | gaya teks code-strong | Lulus | 0 ms |

## Cara membuat ulang

```
pnpm test:evidence
```

Butuh `.env.local` berisi `DATABASE_URL` (branch Neon `dev`) dan `SEED_PASSWORD`. Laporan HTML Playwright lengkap ada di `playwright-report/` (tidak di-commit): buka dengan `pnpm exec playwright show-report`. Di CI, laporan yang sama tersedia sebagai artefak `playwright-report` pada setiap run GitHub Actions (disimpan 14 hari).
