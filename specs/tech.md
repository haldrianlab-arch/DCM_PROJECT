# Technical Specification: SIRAMA

| | |
|---|---|
| Versi | 0.1 (draf untuk review) |
| Tanggal | 10 Nov 2026 |
| Tahap | Design (dokumen terakhir sebelum Build) |
| Acuan | [`PRD.md`](PRD.md) v0.6 (apa yang dibangun), [`design.md`](design.md) v0.5 (bagaimana user mengalaminya) |

Dokumen ini menjelaskan **bagaimana SIRAMA dibangun**: stack, struktur kode, skema database, logika inti, keamanan, pengujian, dan urutan pengerjaan. Field entitas tetap mengacu ke PRD Lampiran C; halaman dan URL mengacu ke design.md §5.1. Bila dokumen ini bertentangan dengan PRD tentang perilaku, PRD yang benar dan dokumen ini diperbaiki.

---

## 1. Keputusan teknis

Diputuskan pada sesi 12 (10 Nov 2026) dengan pilihan ganda; alasan lengkap di §14.

| No | Topik | Keputusan |
|---|---|---|
| T1 | Framework | Next.js 16 (App Router), TypeScript strict |
| T2 | Autentikasi | Better Auth (email + password, plugin admin), session di database |
| T3 | Database | PostgreSQL di Neon, diakses lewat Drizzle ORM dengan driver `neon-serverless` (WebSocket `Pool`) agar transaksi interaktif tersedia |
| T4 | Mutasi data | Server Actions; Route Handler hanya untuk cron, gambar QR, dan simulator (Could) |
| T5 | UI | shadcn/ui + Tailwind CSS v4, token SIRAMA dipetakan ke variabel CSS |
| T6 | Impact analysis | Dihitung di TypeScript (fungsi murni), datanya diambil dengan satu query |
| T7 | Audit log | Ditulis di kode aplikasi, dalam transaksi yang sama dengan perubahan data |
| T8 | Cable | Kolom `port_a_id` dan `port_b_id`; untuk cable daya, A selalu power outlet dan B selalu power inlet |
| T9 | Tanggal | Tenggat, jadwal, dan garansi bertipe `date` dalam WIB; waktu kejadian bertipe `timestamptz` |
| T10 | Penjadwal | Vercel Cron Jobs, satu job harian `0 0 * * *` UTC (07.00-07.59 WIB) |
| T11 | Pengujian | Vitest (unit dan integrasi) + Playwright (E2E); setiap aturan BR wajib punya tes sebelum fitur dianggap selesai |
| T12 | Lingkungan | Neon: branch `main` (produksi), `dev`, dan branch sementara untuk CI dan preview |
| T13 | Git | Satu fitur satu branch dan satu PR; CI wajib hijau; preview Vercel untuk ditinjau; merge ke `main` = deploy produksi |
| T14 | Status Maintenance | Tidak disimpan; diturunkan dari WO berstatus Dikerjakan (lihat §5.3) |
| T15 | Nomor berurutan | Asset tag dan nomor WO dari tabel `counters` yang dikunci dalam transaksi, sehingga tidak ada nomor yang terlewat |

---

## 2. Stack dan versi

Versi dikunci di `package.json` saat inisialisasi (versi stabil terbaru pada hari itu) dan dicatat di devlog. Paket beta tidak dipakai.

| Lapisan | Paket |
|---|---|
| Framework | `next` 16, `react` 19, `typescript` |
| Database | `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless` |
| Auth | `better-auth` (plugin `admin`) |
| Validasi | `zod` (skema dipakai bersama oleh form dan server action) |
| Form | `react-hook-form` + `@hookform/resolvers` |
| UI | `tailwindcss` v4, komponen shadcn/ui (Radix), `lucide-react`, font Geist dan Geist Mono |
| Tanggal | `date-fns` + `@date-fns/tz` |
| QR | `qrcode` (SVG di server) |
| Tes | `vitest`, `@playwright/test` |
| Mutu kode | ESLint, Prettier, `tsc --noEmit` di CI |
| Package manager | pnpm |

---

## 3. Struktur proyek

Satu aplikasi Next.js di root repo. Dokumen yang sudah ada (`intent/`, `specs/`, `docs/`) tetap di tempatnya.

```
src/
  app/
    (auth)/login/               HAL-01
    (app)/                      layout dengan sidebar dan header; wajib login
      dashboard/ my-tasks/ search/ notifications/ locations/
      racks/[id]/ devices/ cables/ work-orders/ maintenance-plans/
      manufacturers/ device-functions/ models/ users/ audit-log/ account/
    a/[assetTag]/route.ts       tujuan QR, dialihkan ke /devices/[id]
    api/
      auth/[...all]/route.ts    handler Better Auth
      cron/daily/route.ts       cron harian
      qr/[assetTag]/route.ts    gambar QR (SVG)
  proxy.ts                      cek cookie session; belum login → /login?next=...
  components/
    ui/                         komponen shadcn yang disalin (KOM-01 s.d. KOM-31)
    sirama/                     komponen khusus (KOM-32 s.d. KOM-46)
  domain/                       logika murni tanpa database, diuji unit
    rack-placement.ts           BR-01 s.d. BR-04
    power-impact.ts             BR-21, US-IMP
    work-order-rules.ts         BR-08 s.d. BR-11, BR-16, BR-18
    dates.ts                    hari ini WIB, tambah interval, garansi, terlambat
    power-estimate.ts           BR-19
  server/
    db/schema.ts                skema Drizzle (satu file per kelompok bila membesar)
    db/client.ts                koneksi Pool
    auth.ts                     konfigurasi Better Auth
    authz.ts                    requireUser, requireRole, canWorkOn
    audit.ts                    writeAudit(tx, ...)
    counters.ts                 nextAssetTag, nextWoNumber
    actions/                    server action per entitas
    queries/                    query baca per halaman
    cron/daily.ts               langkah-langkah cron (dipanggil route dan tes)
  lib/                          util kecil (format angka Indonesia, dsb.)
db/
  migrations/                   hasil drizzle-kit generate
  seed/                         data demo PRD Lampiran A
tests/
  unit/  integration/  e2e/
```

Aturan lapisan: `domain/` tidak boleh mengimpor database atau Next.js. `server/actions` boleh memakai `domain/` dan `server/db`. Komponen tidak mengakses database langsung, kecuali Server Component yang memanggil fungsi di `server/queries`.

---

## 4. Skema database

Nama tabel dan kolom bahasa Inggris, `snake_case`. Semua tabel punya `id` (`uuid`, default `gen_random_uuid()`), `created_at`, dan `updated_at` (`timestamptz`), kecuali disebut lain. Enum PostgreSQL dipakai untuk nilai tetap.

### 4.1 Enum

| Enum | Nilai |
|---|---|
| `role` | `admin`, `technician`, `viewer` |
| `skill` | `it`, `facility`, `both` |
| `function_category` | `it`, `facility` |
| `device_status` | `stock`, `active`, `retired` (Maintenance diturunkan, T14) |
| `rack_face` | `front`, `rear` |
| `port_kind` | `data`, `power_inlet`, `power_outlet` |
| `cable_type` | `cat6`, `fiber`, `dac`, `power` |
| `interval_unit` | `day`, `week`, `month` |
| `wo_type` | `preventive`, `corrective` |
| `wo_status` | `scheduled`, `in_progress`, `done`, `cancelled` |
| `notification_type` | `assigned`, `due_reminder`, `unassigned`, `overdue` |
| `audit_action` | `create`, `update`, `delete`, plus aksi bermakna seperti `wo_start`, `wo_complete`, `wo_cancel`, `user_deactivate`, `password_reset` |

Label tampilan bahasa Indonesia (Stok, Aktif, Terjadwal, ...) ada di satu berkas pemetaan di `lib/labels.ts`, bukan di database.

### 4.2 Tabel

**Auth (dikelola Better Auth):** `user`, `session`, `account`, `verification`. Tabel `user` ditambah kolom:

| Kolom | Tipe | Catatan |
|---|---|---|
| `role` | `role` | Wajib |
| `skill` | `skill` null | Wajib bila `role = technician` (CHECK) |
| `banned` | boolean | Dari plugin admin; dipakai sebagai "nonaktif" |

**Lokasi**

| Tabel | Kolom penting | Constraint |
|---|---|---|
| `sites` | `name` | `name` unik |
| `rooms` | `site_id`, `name` | unik (`site_id`, `name`) |
| `racks` | `room_id`, `name`, `height_u` (int, default 42), `power_capacity_w` (int null) | unik (`room_id`, `name`); CHECK `height_u` 1-60 |

**Katalog**

| Tabel | Kolom penting | Constraint |
|---|---|---|
| `manufacturers` | `name` | unik |
| `device_functions` | `name`, `category` | `name` unik |
| `models` | `manufacturer_id`, `name`, `height_u` (0 = 0U), `full_depth` (bool), `max_power_w` (int null) | unik (`manufacturer_id`, `name`) |
| `port_templates` | `model_id`, `name`, `kind`, `connector` (text null), `position` | unik (`model_id`, `name`) |

**Device, port, cable**

| Tabel | Kolom penting | Constraint |
|---|---|---|
| `devices` | `asset_tag`, `name`, `model_id`, `function_id`, `serial` (null), `status`, `room_id` (null), `rack_id` (null), `face` (null), `position_u` (null), `purchase_date` (date null), `vendor` (text null), `warranty_end` (date null) | `asset_tag` unik; `name` unik; `serial` unik bila tidak null; CHECK BR-05: status `stock`/`retired` ⇒ `room_id`, `rack_id`, `face`, `position_u` null; status `active` ⇒ `room_id` tidak null; `rack_id` ada ⇒ `room_id` sama dengan room rack (dicek di aplikasi) |
| `ports` | `device_id`, `name`, `kind`, `connector`, `is_manual` (bool), `position` | unik (`device_id`, `name`) |
| `cables` | `label`, `type`, `color` (null), `length_m` (numeric null), `port_a_id`, `port_b_id` | `label` unik; `port_a_id` unik; `port_b_id` unik; CHECK `port_a_id <> port_b_id` |

Aturan yang tidak bisa dinyatakan dengan constraint sederhana dijaga di server action dan diuji: satu port tidak boleh muncul di `port_a_id` satu cable dan `port_b_id` cable lain; jenis port cocok (BR-06); arah daya (T8); kedua ujung bukan device yang sama.

Tabrakan posisi rack (BR-03) dicek di aplikasi. Agar dua Admin yang menyimpan bersamaan tidak lolos berdua, transaksi penempatan mengunci baris rack terlebih dahulu (`SELECT ... FOR UPDATE`).

**Maintenance**

| Tabel | Kolom penting | Constraint |
|---|---|---|
| `maintenance_plans` | `title`, `device_id`, `interval_value` (int > 0), `interval_unit`, `next_due` (date), `default_technician_id` (null), `active` (bool) | |
| `maintenance_plan_items` | `plan_id`, `position`, `text` | minimal satu per plan (dicek di aplikasi) |
| `work_orders` | `number`, `type`, `title`, `device_id`, `plan_id` (null), `problem` (text null), `due` (date), `technician_id` (null), `status`, `result_note` (null), `cancel_reason` (null), `started_at`, `completed_at`, `cancelled_at` (timestamptz null), `created_by` (user id null = Sistem) | `number` unik; CHECK `type = preventive` ⇔ `plan_id` tidak null; **indeks unik parsial** (`plan_id`) WHERE `status IN ('scheduled','in_progress')` (BR-08 dijaga database) |
| `work_order_items` | `work_order_id`, `position`, `text`, `done` (bool), `done_at`, `done_by` | |

**Sistem**

| Tabel | Kolom penting | Constraint |
|---|---|---|
| `notifications` | `user_id`, `type`, `work_order_id`, `read_at` (null) | indeks unik parsial (`user_id`, `work_order_id`, `type`) WHERE `type <> 'assigned'`, agar cron tidak membuat pengingat ganda (NFR-06) |
| `audit_logs` | `at`, `actor_id` (null = Sistem), `action`, `entity_type`, `entity_id`, `entity_label`, `before` (jsonb), `after` (jsonb) | tanpa `updated_at`; aplikasi tidak punya fungsi ubah atau hapus |
| `counters` | `name` (pk: `asset_tag`, `wo_number`), `value` (int) | |
| `cron_runs` | `run_date` (date WIB), `started_at`, `finished_at`, `ok`, `summary` (jsonb) | riwayat eksekusi untuk menelusuri kegagalan (risiko R2) |

### 4.3 Kebijakan hapus

Foreign key memakai `ON DELETE RESTRICT`, kecuali port milik device dan item checklist milik plan/WO yang ikut terhapus (`CASCADE`). Penolakan hapus (BR-14) dicek di aplikasi lebih dulu agar pesannya bisa menyebut jumlah yang masih memakai; `RESTRICT` adalah pengaman terakhir.

### 4.4 Migrasi

`drizzle-kit generate` menghasilkan berkas SQL di `db/migrations/` yang ikut di-commit dan ditinjau di PR. Migrasi dijalankan oleh CI ke branch Neon tujuan; `drizzle-kit push` tidak dipakai di produksi.

---

## 5. Logika inti

Semua fungsi di bagian ini berada di `src/domain/`, murni (tanpa database), dan wajib punya unit test (NFR-07).

### 5.1 Penempatan di rack (BR-01 s.d. BR-04)

```ts
type Occupant = { deviceId: string; positionU: number; heightU: number; fullDepth: boolean; face: 'front' | 'rear' }
checkPlacement(rackHeight, candidate: Occupant, others: Occupant[]): { ok: true } | { ok: false; reason: 'below_1' | 'over_height' | 'collision'; withDeviceIds: string[] }
```

- Rentang U kandidat: `[P, P + H - 1]`; tolak bila `P < 1` atau `P + H - 1 > tinggi rack`.
- Sisi yang ditempati: full-depth = {depan, belakang}, half-depth = {sisi terpilih}.
- Bertabrakan bila rentang beririsan dan himpunan sisi beririsan.
- `others` tidak memuat device yang sedang dipindah (US-DEV-02 AC9).
- Device 0U dan tanpa rack tidak pernah masuk fungsi ini.

Kasus uji minimal: semua AC US-DEV-02, ditambah U1, U tertinggi, irisan sebagian, dan device 4U yang menutupi dua device 1U.

### 5.2 Impact analysis

**Data (satu lompatan, US-IMP-01):** query semua cable yang salah satu ujungnya port milik device X, lalu ambil device di ujung lain. Kueri memeriksa `port_a_id` dan `port_b_id` (risiko R4).

**Daya (berantai, BR-21, US-IMP-03/04):** query mengambil seluruh cable daya sekali (`outlet device → inlet device`, beserta id inlet), lalu:

```ts
type PowerEdge = { fromDevice: string; toDevice: string; inletPortId: string }
powerImpact(root: string, edges: PowerEdge[]): Array<{ deviceId: string; via: string | null; depth: number; outcome: 'down' | 'backup' }>
```

1. `dead = {root}`, antrean berisi device yang disuplai root.
2. Untuk setiap device D di antrean: kumpulkan inlet D yang tersambung. Bila semua sumbernya ada di `dead`, D masuk `dead` dengan `outcome = 'down'`, dan device yang disuplai D masuk antrean. Bila ada sumber yang tidak mati, D dicatat `outcome = 'backup'` dan tidak diteruskan.
3. Ulangi sampai antrean habis. Karena device bisa dicek ulang setelah sumber lain ikut mati, status `backup` dapat berubah menjadi `down`; hasil akhir diambil setelah tidak ada perubahan.
4. `via` = device mati pertama yang menyuplainya (untuk keterangan "lewat [device]"); `depth` 1 = langsung.
5. Hasil unik per device (US-IMP-04 AC4). Siklus pada data (misalnya kabel salah) tidak membuat loop karena device yang sudah `down` tidak diproses ulang.

Kasus uji minimal: PDU tunggal; server dua PSU ke PDU-A dan PDU-B (backup); UPS → dua PDU → server dua PSU (keduanya mati, jadi server `down`); rantai tiga tingkat; data berisi siklus.

### 5.3 Status device dan WO

- **Status Maintenance diturunkan (T14).** Kolom `status` hanya `stock`, `active`, `retired`. Device ditampilkan "Maintenance" bila `status = active` dan ada WO `in_progress` untuknya. Dengan begitu BR-11 dan US-WO-04 AC5/AC8 selalu benar tanpa kode sinkronisasi, dan risiko R3 berkurang. Satu fungsi `effectiveStatus(device, hasInProgressWo)` dipakai di seluruh aplikasi, dan query daftar/dashboard memakai subquery `EXISTS` yang sama.
- **Transisi WO** di `work-order-rules.ts` sebagai tabel transisi: `scheduled → in_progress` (wajib punya teknisi), `in_progress → done` (semua item dicentang dan catatan hasil terisi), `scheduled|in_progress → cancelled` (Admin, alasan wajib). Selain itu ditolak.
- **Hak mengerjakan:** `canWorkOn(user, wo)` = Admin, atau Teknisi yang `technician_id`-nya sama.
- **Penutupan WO preventif (BR-09):** dalam transaksi yang sama, `plan.next_due = wo.due + interval`.
- **Terlambat (BR-10):** `isOverdue(wo, today)` = `due < today` dan status terbuka; tidak disimpan.
- **Perubahan status device ke Stok/Pensiun (US-DEV-03 AC3):** satu transaksi yang mengosongkan penempatan, menghapus cable, menonaktifkan plan, membatalkan WO `scheduled`, dan menulis audit untuk setiap perubahan.

### 5.4 Tanggal (T9)

- `todayWIB(now = new Date())` menghasilkan `YYYY-MM-DD` di zona `Asia/Jakarta`. Semua fungsi menerima `today` sebagai parameter, sehingga tes bisa memakai tanggal tetap.
- `addInterval(date, value, unit)`: bulan memakai `addMonths` (31 Jan + 1 bulan = 28/29 Feb).
- `warrantyState(end, today)`: `expired` bila `end < today`, `soon` bila `end ≤ today + 30`, selain itu `ok`.
- Kolom `date` dibaca Drizzle sebagai string (`mode: 'string'`) agar tidak dikonversi ke zona waktu server.

### 5.5 Estimasi daya (BR-19)

`rackPowerEstimate(devices)` = jumlah `max_power_w` model semua device di rack (termasuk 0U), ditambah jumlah device yang modelnya tanpa data daya.

---

## 6. Autentikasi dan otorisasi

### 6.1 Better Auth

- `emailAndPassword` aktif dengan `disableSignUp: true` (US-AUTH-01 AC5). User hanya dibuat Admin lewat plugin admin.
- Plugin `admin` dengan tiga peran: `admin`, `technician`, `viewer`.
- **Nonaktifkan user** = `banUser` (sesi aktif dicabut, US-AUTH-02 AC3). **Atur ulang password** = `setUserPassword` + `revokeUserSessions` (AC5).
- Pesan login gagal selalu "Email atau password salah", termasuk untuk akun nonaktif (AC2, AC3).
- Hash password memakai bawaan Better Auth (scrypt).
- Field tambahan `skill` didaftarkan sebagai `additionalFields`.

### 6.2 Lapisan pemeriksaan

1. **`proxy.ts`**: hanya memeriksa ada tidaknya cookie session, lalu mengalihkan ke `/login?next=<url>` (US-QR-02 AC2). Ini bukan pemeriksaan keamanan, hanya kenyamanan.
2. **Halaman (Server Component)**: `requireUser()` atau `requireRole('admin')`; peran yang salah menampilkan HAL-29.
3. **Server action**: setiap action dimulai dengan `requireRole(...)` atau `canWorkOn(...)` (US-AUTH-03, NFR-04). Ini lapisan yang sebenarnya.
4. **UI**: tombol dan menu disembunyikan sesuai peran (US-AUTH-03 AC2).

Tes integrasi memanggil setiap server action mutasi sebagai Teknisi dan Viewer, dan semuanya harus ditolak kecuali yang diizinkan matriks PRD §5.

---

## 7. Pola server action

Setiap mutasi mengikuti urutan yang sama:

```ts
export async function placeDevice(input: unknown) {
  const user = await requireRole('admin')                 // 1. hak akses
  const data = placeDeviceSchema.parse(input)             // 2. validasi Zod (skema sama dengan form)
  return db.transaction(async (tx) => {                   // 3. satu transaksi
    const before = await getDeviceForUpdate(tx, data.id)
    const rule = checkPlacement(...)                      // 4. aturan dari domain/
    if (!rule.ok) return fail(rule)                       //    hasil terstruktur, bukan throw
    const after = await updateDevice(tx, data)
    await writeAudit(tx, { actor: user, action: 'update', entity: 'device', before, after })  // 5. audit
    return ok(after)
  }).finally(() => revalidatePath(...))                   // 6. segarkan halaman
}
```

- Hasil action berbentuk `{ ok: true, data } | { ok: false, code, message, fieldErrors? }`. Pesan bahasa Indonesia sesuai design.md.
- `writeAudit` menyimpan `before` dan `after` sebagai JSON hanya dengan field bisnis (tanpa `updated_at`, tanpa hash password).
- Tes integrasi setiap action memastikan satu baris audit tertulis (mitigasi risiko audit terlewat, T7).

---

## 8. Cron harian

- **Konfigurasi:** `vercel.json` berisi `{"crons":[{"path":"/api/cron/daily","schedule":"0 0 * * *"}]}`. Di paket Hobby berjalan sekali sehari antara 07.00 dan 07.59 WIB.
- **Keamanan:** route menolak permintaan tanpa header `Authorization: Bearer ${CRON_SECRET}`.
- **Urutan langkah** (`server/cron/daily.ts`, dipanggil dengan `today` sebagai parameter):
  1. Buat WO preventif untuk setiap plan aktif dengan `next_due ≤ today + 7` dan tanpa WO terbuka (US-WO-01). Indeks unik parsial mencegah WO ganda walau cron dijalankan dua kali (AC2, AC3).
  2. Notifikasi `assigned` ke teknisi bawaan, atau `unassigned` ke semua Admin aktif bila tanpa teknisi.
  3. Notifikasi `due_reminder` untuk WO terbuka yang sudah punya teknisi dengan `due ≤ today + 3` (US-NOTIF-01 AC2).
  4. Notifikasi `overdue` ke semua Admin aktif untuk WO terlambat (US-NOTIF-02 AC2).
  5. Tulis `cron_runs` beserta ringkasan jumlah.
- Langkah 2 sampai 4 memakai `INSERT ... ON CONFLICT DO NOTHING` sesuai indeks unik notifikasi, sehingga idempoten (NFR-06).
- Admin dapat menjalankan cron secara manual lewat server action yang memanggil fungsi yang sama (berguna saat demo dan bila Vercel terlambat memicu). Tombolnya belum ada di design.md; letaknya diputuskan saat PR 11 lalu design.md diperbarui.

---

## 9. QR code

- URL di QR: `https://<domain>/a/DCM-0001` (asset tag, US-QR-01 AC1). Route `/a/[assetTag]` mencari device dan mengalihkan ke `/devices/[id]`, sehingga nama device boleh berubah (US-QR-02 AC3).
- `/api/qr/[assetTag]` menghasilkan SVG dengan pustaka `qrcode`; label (KOM-41) menggabungkan SVG, asset tag, dan nama device dalam satu komponen yang bisa dicetak.

---

## 10. Antarmuka

- Token design system (`specs/design-system/tokens.json`) dipetakan ke variabel CSS di `globals.css` dan ke tema Tailwind v4 (`@theme`). Komponen shadcn diubah agar memakai token itu; tidak ada warna atau ukuran di luar token.
- Komponen khusus KOM-32 s.d. KOM-46 (elevation rack, panel dampak, dan lainnya) dibuat di `components/sirama/` dengan Storybook-lite: satu halaman `/dev/components` yang hanya aktif di development untuk meninjau setiap komponen dengan data contoh.
- Data halaman dibaca di Server Component; interaksi (form, filter, modal) di Client Component.
- Format angka dan tanggal Indonesia lewat `Intl` (`id-ID`), terpusat di `lib/format.ts`.

---

## 11. Seed data demo

- `pnpm db:seed` mengosongkan seluruh tabel lalu mengisi data PRD Lampiran A (NFR-08).
- Tanggal ditulis relatif terhadap `today` (misalnya `today - 3` untuk WO terlambat), sehingga demo kapan pun menghasilkan kondisi yang sama dengan mockup.
- Seed memakai server action/fungsi domain yang sama dengan aplikasi bila memungkinkan, agar data demo juga lolos aturan bisnis.
- Akun demo (Andi, Rina, Joko, Sari) memakai password dari environment variable `SEED_PASSWORD`, tidak ditulis di repo.

---

## 12. Pengujian

| Jenis | Alat | Cakupan | Kapan jalan |
|---|---|---|---|
| Unit | Vitest | Semua fungsi `domain/`: BR-01 s.d. BR-05, BR-08 s.d. BR-11, BR-16, BR-18, BR-19, BR-21 | Lokal dan setiap PR |
| Integrasi | Vitest + database Neon branch CI | Setiap server action: hak akses per peran, constraint, audit tertulis; query impact analysis dari kedua ujung cable; cron dengan `today` tetap dan dijalankan dua kali | Setiap PR |
| E2E | Playwright | Satu alur per epic Must: login per peran, tambah device dengan bentrok, sambung cable, buat WO dan lihat dampak, kerjakan WO di viewport 375 px, pindai QR tanpa login | Setiap PR (preview) dan sebelum rilis |

**Definisi selesai sebuah fitur:** semua AC user story terkait punya tes otomatis yang lulus, aturan BR terkait punya unit test, `tsc` dan lint bersih, dan sudah ditinjau di preview.

Hasil Playwright (laporan HTML) menjadi bahan tabel blackbox Bab IV (PRD M5).

---

## 13. Lingkungan dan deploy

| Lingkungan | Database (Neon) | Dipakai untuk |
|---|---|---|
| Lokal | branch `dev` | Pengembangan sehari-hari |
| CI | branch sementara dari `main`, dibuat dan dihapus per job | Migrasi + tes integrasi + E2E |
| Preview | branch per PR (integrasi Neon-Vercel) | Peninjauan oleh tim |
| Produksi | branch `main` | Demo UAS |

**Environment variable:** `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CRON_SECRET`, `SEED_PASSWORD`. Contohnya di `.env.example` tanpa nilai rahasia.

**GitHub Actions per PR:** install → `tsc` → lint → unit test → buat branch Neon → migrasi → seed → tes integrasi → build → E2E → hapus branch.

**Alur kerja:** branch `feat/<epic>-<ringkas>` → PR dengan ringkasan dan daftar AC → CI hijau → tim meninjau preview → merge (squash) → produksi otomatis.

---

## 14. Alasan keputusan

| No | Pilihan lain | Alasan memilih |
|---|---|---|
| T2 | Auth.js v5, buat sendiri | Better Auth mendukung login password, session di database, dan manajemen user (ban, reset password, cabut sesi) secara bawaan, sehingga US-AUTH-02 hampir tanpa kode tambahan. Auth.js lemah di login password; buat sendiri memindahkan risiko keamanan ke tim. |
| T3 | `neon-http` | Driver HTTP tidak mendukung transaksi interaktif, padahal hampir setiap action perlu transaksi (audit, nomor berurutan, kunci rack). |
| T4 | REST API penuh | Server Actions mengurangi kode separuhnya dan skema Zod dipakai bersama. Tidak ada kebutuhan API publik. |
| T5 | Mantine, Tailwind murni | Gaya design system mengikuti shadcn/ui; komponennya disalin ke repo sehingga bisa disesuaikan penuh dengan token. |
| T6 | Recursive CTE | Aturan jalur cadangan sulit ditulis dan dites di SQL; datanya kecil. |
| T7 | Trigger PostgreSQL | Pelaku dan aksi bermakna (misalnya "menyelesaikan WO") lebih jelas di aplikasi; risiko terlewat ditutup dengan tes. |
| T8 | A/B tanpa aturan urutan | Arah daya langsung terbaca dari kolom, query dampak lebih sederhana. |
| T9 | Semua `timestamptz` | Perhitungan H-7/H-3 dan terlambat rawan meleset sehari di sekitar tengah malam WIB. |
| T12 | Docker, PGlite | Sama persis dengan produksi tanpa instalasi; branch gratis dan cepat dibuat. |
| T14 | Menyimpan status Maintenance | Menurunkan status menghapus seluruh kode sinkronisasi BR-11 yang menjadi risiko R3. Kekurangannya, query daftar device butuh subquery `EXISTS`. |
| T15 | Sequence PostgreSQL | Sequence bisa melompati nomor saat transaksi gagal; PRD meminta nomor berurutan. |

---

## 15. Urutan Build

Target UAS: R1 + R2 (semua Must). Should dikerjakan setelah semua Must lulus (risiko R5).

| No | PR | Isi | Bergantung pada |
|---|---|---|---|
| 1 | Fondasi | Inisialisasi Next.js, Tailwind + token, shadcn, Drizzle + Neon, CI, `vercel.json` | |
| 2 | Auth | Better Auth, login (HAL-01), proxy, `requireRole`, layout aplikasi (sidebar, header), HAL-29/30 | 1 |
| 3 | Skema + seed awal | Seluruh skema §4, migrasi, `counters`, `writeAudit`, seed user dan lokasi | 1 |
| 4 | Lokasi dan rack | E2: site, room, rack (modal), HAL-06, HAL-07 dengan elevation (KOM-32) | 2, 3 |
| 5 | Katalog | E3: manufacturer, device function, model + port template | 3 |
| 6 | Device | E4: form device dengan pratinjau dan validasi (KOM-33), detail, status, hapus | 4, 5 |
| 7 | Cable | E5 + US-IMP-01 + impact daya berantai (KOM-36) | 6 |
| 8 | User, pencarian, audit log | US-AUTH-02, US-SRCH-01, US-AUD-01 | 2, 6 |
| — | **Rilis R1** | Seed inventaris lengkap; semua AC E1-E5 lulus | |
| 9 | Maintenance plan | US-MP-01, HAL-16 s.d. HAL-18 | 6 |
| 10 | Work order | US-WO-02 s.d. US-WO-06, Tugas saya, detail WO di HP | 9 |
| 11 | Cron dan notifikasi | US-WO-01, US-NOTIF-01 s.d. 03 | 10 |
| 12 | QR | US-QR-01, US-QR-02 | 6 |
| 13 | Dashboard | US-DASH-01 dengan peta room (KOM-34) | 10 |
| — | **Rilis R2** | Seed lengkap Lampiran A; semua AC Must lulus; cron berjalan di produksi | |

Setiap PR dimulai dengan `plan.md` singkat (AI-Native SDLC tahap Build) yang dicatat di deskripsi PR.

---

## 16. Risiko teknis

| ID | Risiko | Mitigasi |
|---|---|---|
| TR1 | Cron Vercel terlambat atau tidak jalan saat demo | Tombol jalankan manual untuk Admin; `cron_runs` menunjukkan eksekusi terakhir |
| TR2 | Batas paket gratis Neon (compute dan penyimpanan) | Branch CI dihapus setiap selesai; data demo kecil |
| TR3 | Cold start Neon membuat halaman pertama lambat (NFR-05) | Ukur di produksi; bila perlu jalankan permintaan pemanasan sebelum demo |
| TR4 | Perubahan API Better Auth atau Next.js | Versi dikunci; pembaruan dilakukan di PR terpisah |
| TR5 | Validasi lintas kolom cable (satu port di dua cable lewat A dan B) | Dicek di action dengan mengunci kedua port; ada tes khusus |

---

## 17. Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 10 Nov 2026 | Draf pertama dari keputusan sesi 12 |
