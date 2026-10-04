# Rangkuman Diskusi Proyek UTS/UAS DCM

**Topik terpilih:** Server Room Asset & Inventory Management System (manajemen rak, server, perkabelan, dan jadwal maintenance).

---

## 1. Titik awal: bingung mulai dari mana

Kami belum paham isi data center, jadi langkah pertama adalah memahami domainnya dulu, lalu mempelajari NetBox (software DCIM open source) sebagai referensi.

### Inti data center dalam satu kalimat
Data center menjaga server tetap hidup 24/7 dengan empat hal: **listrik, pendinginan, jaringan, dan keamanan**.

### Komponen yang perlu dikenal
- **Rak:** lemari 19 inci, tinggi diukur dalam **U** (1U = 4,45 cm), umumnya 42U.
- **Perangkat:** server, switch, router, firewall, storage, PDU, UPS.
- **Kabel:** UTP, fiber, kabel daya. Harus berlabel di kedua ujung (standar ANSI/TIA-606).
- **Jalur listrik:** PLN → ATS/genset → UPS → PDU rak → server.
- **Jalur jaringan:** ISP → router/firewall → core switch → switch rak (ToR) → server.

Kalau komponen hulu mati, yang di hilir ikut terdampak. Ini dasar fitur **impact analysis**.

---

## 2. Hasil belajar NetBox vs syarat topik

| Syarat topik | Di NetBox | Status |
|---|---|---|
| Rak | Racks + elevation (tampak depan rak) | ✅ |
| Server | Manufacturer → Device Type → Role → Device | ✅ |
| Perkabelan | Interfaces + Cables + Trace | ✅ |
| **Jadwal maintenance** | **Tidak ada bawaan** | ❌ |

**Kesimpulan:**
1. Satu dari empat syarat (maintenance) belum ada di NetBox. Ini justru jadi **pembeda proyek kita**.
2. Deliverable-nya source code buatan sendiri, jadi kita **bangun web sendiri**, terinspirasi NetBox, bukan sekadar mengisi NetBox.

**Positioning:** NetBox fokus sebagai pencatat jaringan. Sistem kita fokus pada **operasional ruang server**: inventaris aset fisik yang terhubung dengan perawatan dan siklus hidupnya.

---

## 3. Scope fitur

**Diambil dari NetBox (disederhanakan)**
- Site → Ruangan → Rak + visualisasi elevation
- Katalog: Manufacturer, Model (dengan template port), Role
- Device + validasi posisi U (tidak boleh bertabrakan atau melebihi tinggi rak)
- Port + Kabel (label, warna, jenis, panjang)

**Wajib ditambah (pembeda)**
- **Modul maintenance:** jadwal berulang, work order ke teknisi, checklist, status (Terjadwal / Dikerjakan / Selesai / Terlambat), kalender, pengingat H-3
- **Siklus hidup aset:** tanggal beli, vendor, akhir garansi, status (Dipesan → Stok → Terpasang → Pensiun)
- **Dashboard:** utilisasi rak, maintenance minggu ini, garansi hampir habis
- **Login + role** (Admin, Teknisi, Viewer) dan **audit log**

**Nilai tambah yang dipilih**
- **QR code label aset:** pindai dari HP untuk membuka detail dan riwayat maintenance
- **Impact analysis:** saat maintenance switch X, tampilkan server yang ikut terdampak (dihitung dari data kabel)

**Dibuang:** IPAM penuh, Virtualization, VPN, Wireless, Circuits.

---

## 4. Keputusan yang sudah dikunci

| Hal | Keputusan |
|---|---|
| Skenario | **Data center kampus/instansi** (realistis, bisa observasi langsung, tanpa kompleksitas penyewa) |
| Stack | **Next.js + Drizzle ORM + Neon Postgres + Vercel** |
| Pengingat otomatis | Vercel Cron Jobs |
| Nilai tambah | QR code + impact analysis |

---

## 5. Metode pengembangan: AI-Native SDLC (Anthropic, 2026)

**SDLC** = urutan tahapan membuat software dari ide sampai dirawat. Model klasiknya Waterfall, Prototyping, Agile/Scrum.

Kita memakai **AI-Native SDLC Playbook** (Claude Academy, 14 lesson). Idenya: AI sudah menulis kode dengan cepat, jadi prosesnya diubah menjadi **loop**, dan setiap tahap menghasilkan file yang dibaca tahap berikutnya.

**Catatan:** ini panduan praktik industri dari Anthropic yang masih baru, bukan model akademik klasik. Tetap boleh dipakai. Di laporan, jelaskan SDLC klasik di Bab II lalu AI-native sebagai perkembangannya, dan pakai AI-native sebagai metode di Bab III. **Konfirmasi dulu ke dosen.**

### Alur yang akan kita jalani

| Tahap | Yang dilakukan | File di repo |
|---|---|---|
| **Plan** | Rumuskan masalah, tujuan, batasan | `intent/asset-maintenance.md` |
| **Design** | PRD, Design Spec, Technical Spec | `specs/prd.md`, `specs/design.md`, `specs/tech.md` |
| **Build** | Rencana dulu per fitur (plan mode), aturan proyek, aturan domain | `plans/*.md`, `CLAUDE.md`, `.claude/skills/` |
| **Test** | Claude wajib jalankan tes sebelum bilang selesai; tes otomatis di setiap PR | Test suite, GitHub Actions |
| **Deploy** | Claude review PR + 1 teman approve; hook pengaman; deploy Vercel | Riwayat PR, `.claude/settings.json` |
| **Maintain** | Bug dan masukan dosen jadi intent baru | `intent/` baru |

Riwayat Git otomatis jadi bukti proses untuk laporan.

### Pemetaan ke deliverable kampus
- intent + PRD → Bab I dan analisis kebutuhan (Bab III)
- Design Spec → Use Case & Flowchart
- Technical Spec → Architecture & Topology Diagram
- Test case → Bab IV (Blackbox testing)
- Setelah build → Manual Book, Bab V

---

## 6. Testing

Selama ini kita hanya cek "app jalan". Itu belum cukup, karena kode buatan AI bisa terlihat jalan padahal logikanya salah.

| Lapis | Menguji | Tool | Contoh |
|---|---|---|---|
| Unit | Fungsi logika | **Vitest** | Cek posisi U bertabrakan, hitung jadwal maintenance berikutnya |
| Component | Komponen UI | **Vitest + React Testing Library** | Elevasi rak tampil benar, form menampilkan error |
| Integration | Server action + DB | **Vitest + PGlite** / Neon branch | Device tersimpan, ditolak jika bentrok |
| E2E | Alur penuh di browser | **Playwright** | Login → tambah device → jadwalkan maintenance → buka halaman QR |

- **Vitest** dipilih daripada Jest (lebih cepat, modern).
- **Playwright** dipilih daripada Cypress (lebih cepat, cocok dengan Next.js, bisa dipakai Claude untuk cek UI).
- **Blackbox testing** di laporan = tes E2E Playwright. Tiap baris tabel test case punya tes otomatis sebagai bukti.

**Alur:** PRD → acceptance criteria → test case → kode.

**Aturan kerja dengan AI:** saat ada bug, minta Claude buat tes yang gagal dulu, lalu perbaiki kodenya tanpa mengubah tes. "Selesai" berarti semua tes lulus dan output-nya ditunjukkan.

---

## 7. Langkah berikutnya

1. Finalkan `intent.md`
2. Tulis **PRD** (user stories + acceptance criteria)
3. Design Spec, lalu Technical Spec
4. Setup repo, `CLAUDE.md`, dan test tooling
5. Build per modul

**Yang perlu dijawab tim sebelum menulis PRD:**
- Berapa orang anggota tim?
- Kapan tanggal demo UTS dan UAS?
- Sudah konfirmasi ke dosen soal metode AI-Native SDLC?
