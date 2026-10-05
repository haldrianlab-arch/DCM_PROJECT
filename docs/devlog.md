# Devlog: Server Room Asset & Maintenance Management System

Jurnal proses pengembangan. Satu entri per sesi kerja, entri terbaru di atas.
Tujuannya agar seluruh anggota tim memahami apa yang dikerjakan, keputusan yang
diambil beserta alasannya, dan langkah berikutnya.

**Alur AI-Native SDLC:** Plan → Design → Build → Test → Deploy → Maintain (berulang).

**Status saat ini:** Tahap Design berjalan. PRD v0.2 disetujui, Design Spec v0.2 selesai direvisi. Berikutnya: mockup di Claude Design, lalu Technical Spec.

---

## Sesi 6: Revisi Design Spec menjadi v0.2 (Tahap Design)

**Dikerjakan**
- Memisahkan isi yang bukan Design Spec ke file sendiri: flowchart dan use case ke `docs/diagrams/`, naskah demo ke `docs/demo-script.md`, prompt Claude Design ke `docs/claude-design-brief.md`.
- Menambahkan deskripsi tertulis yang detail untuk setiap sketsa ASCII, karena AI (dan manusia) lebih mudah memahami aturan yang ditulis dengan kata-kata. Bila sketsa dan deskripsi berbeda, deskripsi yang berlaku.
- Pemeriksaan silang design.md terhadap PRD.

**Temuan pemeriksaan silang (sudah diperbaiki)**
- Tiga warna status ternyata tidak memenuhi kontras 4.5:1 yang diklaim dokumen. Setelah dihitung, warnanya diganti dan rasio kontras dicantumkan.
- "Tugas saya" dan notifikasi sempat tersedia untuk Admin, padahal PRD hanya menugaskan WO dan mengirim notifikasi ke Teknisi.
- Menu "profil" muncul padahal tidak ada di PRD (dihapus).
- Sitemap belum lengkap (halaman ubah, form model dan pengguna, pencarian).
- Form device belum mengatur status Maintenance, perangkat 0U, dan perangkat di ruangan tanpa rak.
- Label "(uplink)" di panel dampak tidak ada di model data (dihapus).

**Pertanyaan terbuka**
- Apakah Admin perlu notifikasi (WO terlambat/selesai)? Bila ya, PRD perlu user story baru.
- Perangkat di ruangan tanpa rak (UPS, CRAC) perlu ditegaskan di PRD US-DEV-02.

**Pelajaran**
- Dokumen buatan AI tetap harus diperiksa silang: klaim seperti "kontras sudah memenuhi standar" perlu dibuktikan, bukan dipercaya.

**Berikutnya**
- Menjawab dua pertanyaan terbuka, lalu membuat mockup di Claude Design.

---

## Sesi 5: Design Spec (Tahap Design)

**Dikerjakan**
- Membahas 16 keputusan desain dan menulis `specs/design.md` v0.1: identitas visual, sitemap, navigasi, pola antarmuka, isi setiap halaman, komponen kunci, 6 flowchart (Mermaid), diagram use case (PlantUML), naskah demo, dan prompt untuk Claude Design.
- Membuat `specs/README.md` sebagai indeks yang menjelaskan bahwa prd + design + tech bersama-sama adalah `spec.md` versi kita.
- Memeriksa bahwa semua diagram valid secara sintaks dan diagram use case bisa dirender.

**Keputusan**
- Nama aplikasi: **SIRAMA** (Sistem Informasi Rak, Aset & Maintenance).
- Warna merek biru-teal tua ("air") hanya untuk elemen yang bisa diklik atau aktif. Status WO Terjadwal memakai ungu-indigo agar tidak tertukar dengan warna merek.
- Navigasi: sidebar di desktop, bar bawah di HP (Dasbor, Tugas, Cari, Notif).
- Teknisi langsung mendarat di "Tugas saya"; Admin dan Viewer di Dashboard.
- Elevation rak menjadi elemen paling khas: blok warna per fungsi perangkat, lencana status, slot kosong bisa diklik untuk memasang device.
- Pola "cegah di tampilan, tolak di server": pilihan yang tidak sah tidak ditampilkan di form.
- Pindai QR memakai kamera bawaan HP.
- Diagram laporan: Mermaid untuk flowchart, PlantUML untuk use case (notasi UML yang benar).
- Naskah demo 7 menit disusun sekarang agar data seed dan halaman prioritas mengikutinya.

**Kaitan dengan playbook**
- Playbook menyebut mockup frontend dibuat di Claude Design dari intent, diiterasi, lalu diekspor ke Claude Code. Mockup yang disetujui menjadi acuan perbandingan screenshot di tahap Test.

**Berikutnya**
- Review design.md, lalu membuat mockup di Claude Design dengan prompt di bagian 11.
- Menulis Technical Spec.

---

## Sesi 4: Review PRD menjadi v0.2 (Tahap Design)

**Dikerjakan**
- Review PRD v0.1 oleh Product Owner; 12 revisi diterapkan menjadi v0.2 (lihat bagian "Riwayat revisi" di PRD).

**Keputusan**
- "Role" perangkat diganti menjadi **Fungsi Perangkat** agar tidak tertukar dengan peran pengguna (Admin/Teknisi/Viewer).
- Status device disederhanakan: Stok, Aktif, Maintenance, Pensiun. "Dipesan" dihapus karena pengadaan di luar scope.
- Kebijakan hapus: device dan rencana yang punya riwayat WO diarsipkan, bukan dihapus; master data hanya bisa dihapus jika tidak dipakai.
- Admin dapat memproses WO mana pun; Teknisi hanya WO miliknya.
- Dashboard ikut dioptimalkan untuk HP karena Viewer sering memantau dari HP.
- Metrik SUS tidak dipakai; ditambah metrik waktu penyelesaian WO dari HP.
- Fitur bonus baru: simulasi "agen pembaca perangkat" yang mendeteksi ketidaksesuaian kabel (Could).

**Yang dipelajari**
- Metrik sukses mengukur hasil bagi pengguna; kebutuhan non-fungsional mengukur kualitas sistem.
- Persona = tokoh fiktif untuk membantu merancang; peran pengguna = hak akses teknis.
- Desain jaringan Top-of-Rack vs End-of-Row, dan kenapa ToR tidak butuh trace patch panel.
- Hak akses wajib diperiksa di server, bukan hanya dengan menyembunyikan tombol.

**Berikutnya**
- Menulis Design Spec: sitemap, alur pengguna, wireframe, diagram use case, flowchart.

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