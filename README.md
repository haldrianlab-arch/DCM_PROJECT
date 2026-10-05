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
| Framework | Next.js |
| ORM | Drizzle ORM |
| Database | Neon Postgres |
| Deploy & cron | Vercel (Vercel Cron Jobs untuk pengingat) |
| Testing | Vitest, React Testing Library, PGlite, Playwright |

## Metode pengembangan

Proyek ini dikembangkan dengan **AI-Native SDLC** (Anthropic, 2026) bersama Claude Code. Siklusnya berbentuk loop, dan setiap tahap menghasilkan dokumen yang menjadi masukan tahap berikutnya:

| Tahap | Artefak | Status |
|---|---|---|
| Plan | [`intent/asset-maintenance.md`](intent/asset-maintenance.md) | ✅ Selesai |
| Design | [`specs/prd.md`](specs/prd.md) ✅, [`specs/design.md`](specs/design.md) ⏳, `specs/tech.md` (lihat [indeks](specs/README.md)) | ⏳ Berjalan |
| Build | `plans/*.md`, `CLAUDE.md`, source code | — |
| Test | Test suite + tabel blackbox testing | — |
| Deploy | Vercel | — |
| Maintain | Bug dan masukan → intent baru | — |

## Struktur repo

```
.
├── README.md
├── intent/        # Tahap Plan: masalah, tujuan, batasan
├── specs/         # Tahap Design: PRD, design spec, technical spec
├── plans/         # Tahap Build: rencana per fitur
└── docs/
    ├── devlog.md                          # Jurnal proses pengembangan per sesi
    └── rangkuman-diskusi-proyek-dcim.md   # Rangkuman riset dan keputusan awal
```

## Untuk anggota tim

Mulai dari [`docs/rangkuman-diskusi-proyek-dcim.md`](docs/rangkuman-diskusi-proyek-dcim.md) untuk memahami latar belakang, lalu ikuti perkembangan di [`docs/devlog.md`](docs/devlog.md).

## Tim

| Nama | NIM |
|---|---|
| _isi_ | _isi_ |
| _isi_ | _isi_ |
| _isi_ | _isi_ |