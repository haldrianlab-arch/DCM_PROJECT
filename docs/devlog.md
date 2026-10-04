# Devlog: Server Room Asset & Maintenance Management System

Jurnal proses pengembangan. Satu entri per sesi kerja, entri terbaru di atas.
Tujuannya agar seluruh anggota tim memahami apa yang dikerjakan, keputusan yang
diambil beserta alasannya, dan langkah berikutnya.

**Alur AI-Native SDLC:** Plan → Design → Build → Test → Deploy → Maintain (berulang).

**Status saat ini:** Tahap Plan selesai. Berikutnya: Design (PRD).

---

## Sesi 2: Mengunci intent.md (Tahap Plan)

**Dikerjakan**
- Menulis `intent/asset-maintenance.md`: masalah, hasil yang diharapkan, pengguna, scope, batasan, metrik sukses.

**Keputusan**
- Skenario: data center kampus/instansi. Alasan: realistis, bisa diobservasi langsung, tanpa kompleksitas penyewa seperti colocation.
- Pengembangan dikerjakan satu orang bersama AI; anggota lain mengikuti lewat devlog ini. Pembagian peran saat presentasi.
- Impact analysis MVP: satu lompatan (perangkat yang terhubung langsung lewat kabel).
- Pengingat maintenance MVP: notifikasi di aplikasi; email menyusul.
- Metode: AI-Native SDLC, dijelaskan secara profesional di laporan.

**Berikutnya**
- Menulis PRD: user stories dan acceptance criteria (dasar test case blackbox).

---

## Sesi 1: Riset domain dan perumusan arah (sebelum Tahap Plan)

**Dikerjakan**
- Mempelajari dasar data center: rak dan satuan U, perangkat, jalur listrik/jaringan/pendingin, standar (Tier, TIA-942, TIA-606).
- Mempelajari NetBox sebagai referensi: Site/Location, Rack, Device Type, Device, Interface, Cable, IPAM.
- Membandingkan NetBox dengan syarat topik: rak, server, dan kabel tercakup; **jadwal maintenance tidak ada** → menjadi pembeda proyek.

**Keputusan**
- Membangun web sendiri yang terinspirasi NetBox, ditambah modul maintenance, siklus hidup aset, dashboard, role, dan audit log.
- Nilai tambah: QR code label aset dan impact analysis.
- Stack: Next.js, Drizzle ORM, Neon Postgres, Vercel (Vercel Cron untuk pengingat).
- Testing: Vitest (unit), React Testing Library (komponen), PGlite/Neon branch (integrasi), Playwright (E2E = blackbox testing otomatis).

**Referensi**
- [`rangkuman-diskusi-proyek-dcim.md`](rangkuman-diskusi-proyek-dcim.md) untuk penjelasan lengkap.
