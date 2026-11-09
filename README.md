# SIRAMA: Sistem Informasi Rak, Aset & Maintenance

Aplikasi web untuk mengelola aset fisik ruang server data center kampus: rak, perangkat, perkabelan, dan jadwal maintenance dalam satu sistem.

Proyek UTS/UAS mata kuliah Data Center Management.

## Masalah yang diselesaikan

Pencatatan aset di spreadsheet terpisah dari jadwal maintenance, posisi perangkat dan kabel yang tidak sesuai kondisi fisik, serta jadwal perawatan dan garansi yang terlewat karena tidak ada pengingat.

## Fitur utama

- **Lokasi dan rak:** Site → Ruangan → Rak, dengan visualisasi elevation (tampak depan rak).
- **Inventaris perangkat:** katalog manufacturer/model/role, posisi rak dan U dengan validasi tabrakan, data siklus hidup (pembelian, vendor, garansi).
- **Perkabelan:** port dan kabel dengan label, warna, jenis, dan panjang.
- **Maintenance:** jadwal berulang, work order, checklist, kalender, pengingat H-3.
- **Dashboard:** utilisasi rak, maintenance terjadwal/terlambat, garansi hampir habis.
- **QR code label aset:** pindai dari HP untuk membuka detail dan riwayat perangkat.
- **Impact analysis:** menampilkan perangkat yang terdampak sebelum maintenance dimulai.
- **Login dengan role** (Admin, Teknisi, Viewer) dan audit log.

## Tech stack

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16, TypeScript, shadcn/ui + Tailwind |
| ORM | Drizzle ORM |
| Database | Neon Postgres |
| Deploy & jadwal otomatis | Vercel (Vercel Cron Jobs untuk WO preventif dan pengingat) |
| Auth | Better Auth |
| Testing | Vitest, Playwright, Neon branch untuk tes integrasi |

## Metode pengembangan

Proyek ini dikembangkan dengan **AI-Native SDLC** (Anthropic, 2026) bersama Claude Code. Siklusnya berbentuk loop, dan setiap tahap menghasilkan dokumen yang menjadi masukan tahap berikutnya:

| Tahap | Artefak | Status |
|---|---|---|
| Plan | [`intent/asset-maintenance.md`](intent/asset-maintenance.md) | ✅ Selesai |
| Design | [`specs/PRD.md`](specs/PRD.md) v0.7, [`specs/design.md`](specs/design.md) v0.6, [design system](specs/design-system/), [`specs/tech.md`](specs/tech.md) v0.2 (lihat [indeks](specs/README.md)) | ✅ Selesai |
| Build | [`CLAUDE.md`](CLAUDE.md), [`plans/`](plans/), source code | ⏳ Berjalan (PR 1 fondasi) |
| Test | Test suite + tabel blackbox testing | — |
| Deploy | Vercel | — |
| Maintain | Bug dan masukan → intent baru | — |

## Menjalankan lokal

Butuh Node 22 dan pnpm.

```
pnpm install
cp .env.example .env.local   # isi DATABASE_URL (Neon branch dev) dan CRON_SECRET
pnpm dev
```

Perintah lain (tes, lint, migrasi) ada di [`CLAUDE.md`](CLAUDE.md) bagian Perintah.

## Struktur repo

```
.
├── README.md
├── CLAUDE.md      # Aturan kerja untuk Claude Code (dibaca otomatis setiap sesi)
├── intent/        # Tahap Plan: masalah, tujuan, batasan
├── specs/         # Tahap Design: PRD, design spec, design system (token), technical spec
├── plans/         # Tahap Build: rencana per fitur
└── docs/
    ├── devlog.md                          # Jurnal proses pengembangan per sesi
    ├── rangkuman-diskusi-proyek-dcim.md   # Rangkuman riset dan keputusan awal
    ├── diagrams/                          # Flowchart dan use case
    ├── wireframes/                        # Wireframe ASCII semua halaman (internal tim)
    ├── laporan/                           # Laporan project (Bab I-II)
    ├── demo-script.md                     # Naskah demo
    └── claude-design-brief.md             # Prompt mockup Claude Design
```

## Untuk anggota tim

Mulai dari [`docs/rangkuman-diskusi-proyek-dcim.md`](docs/rangkuman-diskusi-proyek-dcim.md) untuk memahami latar belakang, lalu ikuti perkembangan di [`docs/devlog.md`](docs/devlog.md).

## Tim

| Nama | NIM |
|---|---|
| _isi_ | _isi_ |
| _isi_ | _isi_ |
| _isi_ | _isi_ |