# Penjelasan environment variable

**Environment variable** (variabel lingkungan) adalah pengaturan yang tidak ditulis di kode karena isinya rahasia (password, kunci) atau berbeda di setiap tempat aplikasi berjalan (laptop, preview, produksi). Kode cukup membaca namanya, misalnya `process.env.DATABASE_URL`; nilainya diisi di luar kode.

Aturan tim (CLAUDE.md): nilai rahasia **tidak pernah** di-commit ke Git. Contoh nama tanpa nilai ada di [`.env.example`](../../.env.example).

---

## 1. Di mana saja variabel disimpan

| Tempat | Dipakai oleh | Siapa yang mengisi |
|---|---|---|
| `.env.local` (laptop, tidak di-commit) | `pnpm dev`, tes, migrasi, seed di laptop | Setiap anggota tim, di laptop masing-masing |
| `.env.production.local` (laptop, tidak di-commit) | Hanya untuk tindakan manual ke database produksi, misalnya seed produksi | Haldrian, bila diperlukan |
| Vercel > project `dcm_project` > Settings > Environment Variables | Aplikasi yang berjalan di preview dan produksi | Sebagian diisi tim, sebagian dibuat otomatis oleh integrasi Neon |
| GitHub > repo > Settings > Secrets and variables > Actions | Pengujian otomatis (CI) | Haldrian |
| Dibuat di dalam CI setiap job | Pengujian otomatis (CI) | Otomatis (acak, hilang setelah job selesai) |

---

## 2. Variabel di `.env.local` (laptop)

| Nama | Untuk apa | Didapat dari | Dipakai di kode |
|---|---|---|---|
| `DATABASE_URL` | Alamat dan kredensial database yang dipakai di laptop: branch Neon `dev` | Neon console > project `neon-cinnabar-globe` > Branches > `dev` > Connect > centang Connection pooling > salin | `src/server/db/client.ts` (aplikasi), `drizzle.config.ts` (migrasi), tes, seed |
| `DATABASE_URL_UNPOOLED` | Opsional. Koneksi langsung (tanpa pooler) untuk migrasi | Sama seperti di atas, tanpa centang Connection pooling. Boleh dikosongkan di laptop | `drizzle.config.ts` |
| `BETTER_AUTH_SECRET` | Kunci rahasia untuk menandatangani cookie sesi login. Siapa pun yang tahu nilainya bisa memalsukan sesi | Dibuat sendiri: `openssl rand -base64 32` di Git Bash. Nilainya harus berbeda dari Vercel | `src/server/auth.ts` (dibaca otomatis oleh Better Auth) |
| `BETTER_AUTH_URL` | Alamat aplikasi. Better Auth hanya menerima permintaan login dari alamat ini | Di laptop: `http://localhost:3000` | `src/server/auth.ts` |
| `CRON_SECRET` | Kunci yang wajib dikirim untuk menjalankan cron harian | Dibuat sendiri: `openssl rand -base64 32`. Agar bisa menguji cron yang sama dengan produksi, nilainya disamakan dengan Vercel | `src/app/api/cron/daily/route.ts`, `src/server/cron/auth.ts` |
| `SEED_PASSWORD` | Password keempat akun demo (andi, rina, joko, sari `@kampus.ac.id`). Juga dipakai tes untuk login | Ditentukan tim, minimal 8 karakter | `db/seed/index.ts`, tes integrasi dan E2E |

## 3. Variabel di `.env.production.local` (laptop, opsional)

| Nama | Untuk apa | Didapat dari |
|---|---|---|
| `DATABASE_URL` | Alamat database **produksi** (branch Neon `main`). Dipakai sekali untuk seed produksi dan untuk membuktikan preview tidak menyentuh produksi | Neon console > project `neon-cinnabar-globe` > branch `main` > Connect (pooled) |

Berkas ini hanya dibaca bila sengaja dipanggil (misalnya `pnpm exec tsx --env-file=.env.production.local db/seed/index.ts`). Karena berisi akses ke data produksi, sebaiknya dihapus bila tidak sedang dipakai.

---

## 4. Variabel di Vercel

### Diisi tim

| Nama | Lingkungan | Untuk apa | Didapat dari |
|---|---|---|---|
| `BETTER_AUTH_SECRET` | Production, Preview | Sama seperti di laptop, tetapi untuk aplikasi online | `openssl rand -base64 32`, nilai baru (bukan nilai laptop) |
| `BETTER_AUTH_URL` | Production saja | Alamat produksi: `https://dcmproject.vercel.app` | Domain produksi Vercel. Preview tidak diisi karena alamatnya berganti setiap deploy; kode memakai variabel bawaan Vercel di bawah |
| `CRON_SECRET` | Production, Preview | Vercel Cron mengirim kunci ini setiap kali menjalankan cron harian | `openssl rand -base64 32` |

### Dibuat otomatis oleh integrasi Neon (Vercel > Storage)

| Nama | Dipakai SIRAMA? | Keterangan |
|---|---|---|
| `DATABASE_URL` | Ya | Koneksi pooled ke database. Di produksi: branch `main`. Di setiap preview: diganti otomatis ke branch `preview/<nama-branch-git>` |
| `DATABASE_URL_UNPOOLED` | Ya (migrasi saat build) | Koneksi langsung, dipakai `pnpm db:migrate` di build Vercel |
| `NEON_PROJECT_ID` | Tidak | ID project Neon; nilainya sama dengan secret GitHub di bawah |
| `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_URL_NO_SSL`, `POSTGRES_PRISMA_URL`, `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`, `PGHOST`, `PGHOST_UNPOOLED`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | Tidak | Koneksi yang sama dalam format lain untuk pustaka lain (Prisma, `pg`). Dibiarkan; jangan dihapus karena dikelola integrasi |

### Disediakan otomatis oleh Vercel

| Nama | Untuk apa di SIRAMA |
|---|---|
| `VERCEL_URL`, `VERCEL_BRANCH_URL` | Alamat deployment preview; dipakai `src/server/auth.ts` bila `BETTER_AUTH_URL` kosong |
| `VERCEL_PROJECT_PRODUCTION_URL` | Alamat produksi; dimasukkan ke daftar alamat yang dipercaya Better Auth |

---

## 5. Variabel untuk CI (GitHub Actions)

### GitHub Secrets (diisi sekali)

| Nama | Untuk apa | Didapat dari |
|---|---|---|
| `NEON_API_KEY` | Izin bagi CI untuk membuat dan menghapus branch database sementara | Neon console > Account settings > API keys > Create new API key |
| `NEON_PROJECT_ID` | Project Neon tempat branch sementara dibuat (project produksi) | Neon console > project > Settings, atau variabel `NEON_PROJECT_ID` di Vercel |

### Dibuat di dalam setiap job CI (tidak disimpan di mana pun)

| Nama | Isi |
|---|---|
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Koneksi ke branch Neon sementara `ci-<nomor-run>`, yang dihapus di akhir job (atau kedaluwarsa sendiri setelah 2 jam) |
| `BETTER_AUTH_SECRET`, `SEED_PASSWORD`, `CRON_SECRET` | Nilai acak baru setiap job, disamarkan (`***`) di log |
| `BETTER_AUTH_URL` | `http://localhost:3100`, alamat server tes di dalam CI |

---

## 6. Ringkasan: nilai mana yang harus sama

| Variabel | Laptop | Vercel | Harus sama? |
|---|---|---|---|
| `BETTER_AUTH_SECRET` | Nilai A | Nilai B | **Tidak**, sengaja berbeda agar kebocoran di laptop tidak membahayakan produksi |
| `CRON_SECRET` | Nilai C | Nilai C | Disamakan agar cron bisa diuji dengan kunci yang sama |
| `SEED_PASSWORD` | Password demo | Tidak ada di Vercel | Password ini juga berlaku di produksi karena produksi di-seed dari laptop |
| `DATABASE_URL` | Branch `dev` | Branch `main` (produksi) atau `preview/...` | **Tidak**, setiap lingkungan punya database sendiri |

---

## 7. Bila ada yang salah

| Gejala | Kemungkinan penyebab |
|---|---|
| `DATABASE_URL belum diisi` saat `pnpm dev` atau tes | `.env.local` belum dibuat atau kosong |
| Login selalu gagal di laptop | Database `dev` belum di-seed dengan `SEED_PASSWORD` yang sekarang: jalankan `pnpm db:seed` |
| Tes integrasi dan E2E auth "dilewati" | `SEED_PASSWORD` kosong di `.env.local` |
| Cron menjawab "Tidak diizinkan." | `CRON_SECRET` tidak diisi atau kunci yang dikirim berbeda |
| CI gagal di langkah "Buat branch Neon sementara" | Secret `NEON_API_KEY` atau `NEON_PROJECT_ID` salah atau kedaluwarsa |
