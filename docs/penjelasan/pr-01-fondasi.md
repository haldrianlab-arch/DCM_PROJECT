# Penjelasan PR 1: Fondasi

Dokumen ini untuk tim agar bisa memahami dan menjelaskan PR 1 ke dosen. Rencana lengkapnya ada di [`plans/01-fondasi.md`](../../plans/01-fondasi.md), keputusannya di [`docs/devlog.md`](../devlog.md) sesi 13, dan bukti testing di [`docs/testing/`](../testing/README.md) (baris bertanda **PR 1**). Di GitHub: PR #1, di-merge 10 Nov 2026.

---

## 1. Tujuan dalam satu kalimat

PR 1 **menyiapkan kerangka kosong yang siap dibangun**: aplikasi bisa dijalankan di laptop dan di internet, tampilannya memakai warna dan huruf resmi SIRAMA, terhubung ke database, dan setiap perubahan kode otomatis diuji.

Analogi: sebelum membangun rumah, fondasi, listrik, dan air disiapkan dulu. Belum ada kamar yang bisa ditempati, tetapi semua kamar nanti dibangun di atas fondasi ini. PR 1 tidak menyelesaikan user story apa pun; ia menyiapkan keputusan teknis T1, T3, T5, T10, T11, dan T13 di tech.md §1.

---

## 2. Apa yang bisa dilihat

Hampir tidak ada fitur untuk user. Yang terlihat hanya **halaman token sementara** di alamat utama: logo SIRAMA, semua warna, gaya huruf, tombol, dan lencana status. Tujuannya agar tim bisa memeriksa apakah tampilannya sudah sesuai design system. Di PR 2 halaman ini dipindah ke `/dev/components` (hanya di laptop) karena alamat utama menjadi halaman login.

---

## 3. Apa yang dibangun

| Bagian | Isi | Istilah |
|---|---|---|
| Kerangka aplikasi | Next.js 16 + TypeScript | **Next.js**: framework untuk membuat aplikasi web dengan React. **TypeScript**: JavaScript dengan tipe data, sehingga banyak kesalahan tertangkap sebelum program dijalankan. |
| Tampilan dasar | Token warna, huruf, sudut, bayangan dari `specs/design-system/tokens.json` dipasang ke Tailwind CSS; font Geist; komponen Button dan Badge; logo dan favicon | **Token**: nilai desain resmi (misalnya warna `air` = `#0a6c8c`) yang dipakai di seluruh aplikasi, agar tidak ada warna "asal". **Tailwind**: cara menulis gaya langsung di kode lewat nama kelas. **shadcn/ui**: kumpulan komponen siap pakai yang disalin ke proyek dan disesuaikan dengan token. |
| Database | Koneksi ke Neon Postgres lewat Drizzle ORM (belum ada tabel) | **Neon**: layanan database PostgreSQL di internet yang bisa dibuat "branch" (salinan) seperti Git. **ORM (Drizzle)**: penerjemah antara kode TypeScript dan database. |
| Jadwal otomatis | `vercel.json` berisi cron harian, dan route `/api/cron/daily` yang hanya menerima permintaan dengan kunci `CRON_SECRET` | **Cron**: tugas yang dijalankan otomatis pada jam tertentu (nanti membuat work order dan notifikasi, PR 11). |
| Pengujian | Vitest (unit, integrasi) dan Playwright (E2E, dengan video) | Lihat bagian 6. |
| Mutu kode | ESLint, Prettier, dan aturan bahwa `src/domain/` tidak boleh memakai database atau React | **Lint**: pemeriksa pola kode yang berbahaya. **Prettier**: perapi format kode otomatis. |
| CI | GitHub Actions menjalankan semua pemeriksaan di setiap PR | **CI (Continuous Integration)**: setiap kali kode dikirim, server GitHub otomatis memeriksa dan menguji. PR hanya boleh di-merge bila hasilnya hijau. |
| Deploy | Vercel: setiap PR mendapat alamat preview, `main` menjadi produksi | **Preview**: versi aplikasi khusus satu PR, untuk ditinjau tim sebelum digabung. |

---

## 4. Keputusan yang diambil dan alasannya

| Keputusan | Alasan |
|---|---|
| CI bertahap: di PR 1 tanpa database | Belum ada tabel; pengujian database ditambahkan saat ada yang diuji (akhirnya di PR 2). |
| Halaman token sementara di alamat utama | Agar warna dan huruf bisa ditinjau di preview sebelum halaman sungguhan dibuat. |
| Route cron sudah dibuat walau isinya kosong | Mekanisme kunci `CRON_SECRET` teruji sejak awal; Vercel tidak memanggil alamat yang belum ada. |
| Versi paket dikunci persis | Agar semua anggota tim, CI, dan Vercel memakai versi yang sama. |
| Next.js 16.4.5, bukan 16.4.6 | 16.4.6 baru dirilis 1,5 jam sebelum dipasang; aturan keamanan pnpm menolak paket yang umurnya kurang dari 24 jam. |
| TypeScript 6 dan ESLint 9 (bukan versi terbaru) | Plugin lint bawaan Next.js belum mendukung TypeScript 7 dan ESLint 10. |
| Video tes E2E selalu direkam | Keputusan tim: bahan dokumentasi Bab IV dan presentasi. |

---

## 5. Masalah yang ditemukan dan cara mengatasinya

| Masalah | Cara ditemukan | Penyelesaian |
|---|---|---|
| CI gagal memasang paket | Log CI: paket Next.js terlalu baru | Turun ke Next.js 16.4.5 |
| Sebagian kotak warna tampil putih | Memeriksa screenshot halaman token | Tailwind diatur agar semua token selalu tersedia (`@theme static`), ditambah tes yang memastikan setiap warna ada di browser |
| Preview Vercel gagal ("No Output Directory named public") | Log build Vercel | Project diimpor saat repo belum berisi aplikasi, jadi terdeteksi sebagai situs statis; `vercel.json` menetapkan framework Next.js |
| Sebagian video tes kosong | Memeriksa isi video | Tes yang selesai terlalu cepat diberi jeda 0,5 detik; tes tanpa tampilan dipisah agar tidak membuat video |
| Tes "tombol lebih gelap saat disorot" gagal di HP | Tes E2E ukuran HP | Benar secara desain: layar sentuh tidak punya keadaan "disorot", jadi pemeriksaan itu hanya di desktop |

---

## 6. Pengujian di PR 1

| Tes | Yang dibuktikan |
|---|---|
| `tests/unit/tokens.test.ts` | Setiap token di `tokens.json` terpasang dengan nilai yang sama di CSS |
| `tests/unit/no-raw-colors.test.ts` | Tidak ada warna atau ukuran "asal" di kode (wajib lewat token) |
| `tests/unit/cron-route.test.ts` | Route cron menolak tanpa kunci atau kunci salah, menerima kunci benar |
| `tests/integration/db.test.ts` | Koneksi ke Neon dan transaksi database berjalan |
| `tests/e2e/smoke.spec.ts` | Halaman tampil tanpa error dan tanpa scroll ke samping di HP, warna tombol sesuai token, route cron menolak tanpa kunci |

Dua tes yang sangat berguna untuk presentasi: **tes token** dan **tes tanpa warna asal**. Keduanya menjaga agar tampilan selalu sesuai design system secara otomatis, bukan hanya dengan dicek mata.

---

## 7. Di mana kodenya

| Bagian | Berkas |
|---|---|
| Token desain | `src/app/globals.css` (dicek terhadap `specs/design-system/tokens.json`) |
| Komponen dasar | `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`, `src/components/sirama/logo.tsx` |
| Halaman token | `src/app/_showcase/showcase.tsx`, `src/app/dev/components/page.tsx` |
| Koneksi database | `src/server/db/client.ts`, `drizzle.config.ts` |
| Cron | `vercel.json`, `src/app/api/cron/daily/route.ts`, `src/server/cron/auth.ts` |
| Konfigurasi tes | `vitest.config.mts`, `playwright.config.ts` |
| Aturan kode | `eslint.config.mjs`, `.prettierrc` |
| CI | `.github/workflows/ci.yml` |

---

## 8. Kronologi pengerjaan

1. **Rencana** (plan mode): membaca tech.md, menulis `plans/01-fondasi.md`, memutuskan tiga hal (CI bertahap, halaman token, route cron), menyebutkan yang perlu disiapkan (pnpm, login GitHub CLI, Vercel, Neon, `CRON_SECRET`).
2. **Kerangka dan tampilan**: Next.js, token, font, komponen, logo.
3. **Database dan cron**: koneksi Neon, `vercel.json`, route cron.
4. **Tes, lint, CI**: Vitest, Playwright, ESLint, Prettier, GitHub Actions.
5. **Peninjauan lewat screenshot**: menemukan kotak warna putih, diperbaiki.
6. **PR dibuka**: CI gagal karena umur paket, diperbaiki; preview gagal karena preset Vercel, diperbaiki; koneksi Neon dan route cron diuji langsung di preview.
7. **Video tes** ditambahkan atas permintaan tim, lalu PR di-merge.

---

## 9. Pertanyaan yang mungkin diajukan dosen

**Kenapa memakai Next.js dan Vercel?** Satu framework untuk tampilan dan server (tanpa backend terpisah), dan Vercel menyediakan deploy otomatis, preview per PR, serta cron harian di paket gratis (tech.md §14).

**Bagaimana memastikan tampilan konsisten dengan desain?** Semua warna dan ukuran berasal dari token resmi, dan ada tes otomatis yang gagal bila ada warna di luar token atau token yang tidak terpasang.

**Apa gunanya CI?** Setiap PR otomatis dicek (tipe data, lint, format, tes, build, E2E) sebelum boleh digabung, sehingga kesalahan tertangkap sebelum sampai ke produksi. Contoh nyata: CI PR 1 menangkap paket yang terlalu baru, CI dan E2E PR 2 menangkap dua bug login.

**Kenapa database Neon?** PostgreSQL penuh, gratis untuk skala proyek ini, dan bisa membuat salinan database (branch) dalam hitungan detik untuk pengujian dan preview.
