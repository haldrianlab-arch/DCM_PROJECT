# Devlog: Server Room Asset & Maintenance Management System

Jurnal proses pengembangan. Satu entri per sesi kerja, entri terbaru di atas.
Tujuannya agar seluruh anggota tim memahami apa yang dikerjakan, keputusan yang
diambil beserta alasannya, dan langkah berikutnya.

**Alur AI-Native SDLC:** Plan → Design → Build → Test → Deploy → Maintain (berulang).

**Status saat ini:** Tahap Design berjalan. PRD draft v0.1 selesai, menunggu review. Berikutnya: Design Spec.

---

## Sesi 3: Brainstorming dan penulisan PRD (Tahap Design)

**Dikerjakan**
- Membahas 17 keputusan yang membentuk isi PRD, masing-masing dengan pilihan, trade-off, dan rekomendasi.
- Menulis `specs/prd.md` v0.1: glosarium, persona dan matriks hak akses, prioritas MoSCoW, user stories dengan acceptance criteria Given/When/Then, aturan bisnis, kebutuhan non-fungsional, risiko, rencana rilis, dan skenario data demo.

**Keputusan penting**
- Posisi rak memakai U + sisi depan/belakang + full-depth, karena realistis dan validasinya menunjukkan pemahaman domain.
- Model perangkat memakai template (Device Type) agar port terbentuk otomatis.
- Kabel port ke port langsung (desain Top-of-Rack); kabel daya ikut dicatat agar impact analysis bisa menjawab "PDU ini mati, server mana yang terdampak?".
- QR berisi asset tag permanen (bukan nama) agar label fisik tidak perlu dicetak ulang.
- Maintenance: rencana berulang → cron harian membuat work order preventif; work order korektif dibuat manual (termasuk penggantian unit).
- Status "Terlambat" dihitung saat ditampilkan, tidak disimpan, agar selalu akurat.
- Penugasan teknisi difilter berdasarkan kategori role device (IT/Fasilitas) dan keahlian teknisi.
- Foto bukti (Cloudinary), vendor eksternal, persetujuan WO, dan graf topologi menjadi fitur bonus (Could).

**Istilah baru yang dipelajari:** patch panel, trace, cron, MoSCoW, work order, asset tag. Lihat glosarium di PRD.

**Berikutnya**
- Review PRD, lalu menulis Design Spec (sitemap, alur pengguna, wireframe, use case, flowchart).

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