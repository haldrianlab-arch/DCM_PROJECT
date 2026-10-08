# Intent: Server Room Asset & Maintenance Management System

Author: Tim DCM (3 orang). Status: draft → menunggu review Product Owner.

## Problem
Pengelola ruang server kampus mencatat aset di spreadsheet yang terpisah dari
jadwal maintenance. Posisi perangkat (rak dan nomor U) serta sambungan kabel
sering tidak sesuai kondisi fisik. Jadwal perawatan dan masa garansi terlewat
karena tidak ada pengingat. Saat satu perangkat perlu di-maintenance, tidak ada
cara cepat mengetahui perangkat lain yang ikut terdampak.

## Proposed outcome
Satu aplikasi web tempat pengelola dan teknisi dapat:
- menemukan lokasi perangkat dan sambungan kabelnya dalam hitungan detik,
- melihat sisa kapasitas rak sebelum memasang perangkat baru,
- menjadwalkan, mengerjakan, dan mencatat maintenance, dengan pengingat sebelum tenggat,
- memindai QR code di perangkat untuk membuka detail dan riwayatnya dari HP,
- melihat perangkat yang terdampak sebelum maintenance dimulai (impact analysis).

## Affected users
- Admin data center: mengelola master data, pengguna, dan seluruh aset.
- Teknisi: mengerjakan maintenance, memperbarui status, memindai QR di lapangan.
- Viewer (kepala unit/dosen): melihat dashboard dan laporan, tanpa mengubah data.

## Scope
Masuk:
- Lokasi: Site → Ruangan → Rak, dengan visualisasi elevation rak.
- Katalog: Manufacturer, Model (template port), Role perangkat.
- Device: posisi rak/U dengan validasi tabrakan dan batas tinggi rak; data siklus hidup
  (tanggal beli, vendor, akhir garansi, status lifecycle).
- Port dan kabel: label, warna, jenis, panjang.
- Maintenance: jadwal berulang, work order ke teknisi, checklist, status, kalender, pengingat H-3.
- Dashboard: utilisasi rak, maintenance minggu ini dan yang terlambat, garansi hampir habis.
- Login dengan role (Admin, Teknisi, Viewer) dan audit log.
- QR code label aset; impact analysis berbasis data kabel.

Tidak masuk:
- IPAM penuh, virtualisasi, VPN, wireless, circuits. (Kolom IP management per device menjadi fitur bonus; lihat PRD.)
- Discovery otomatis perangkat dan monitoring real-time (data dimasukkan manual atau impor CSV).

## Constraints
- Aplikasi web: Next.js, Drizzle ORM, Neon Postgres, deploy di Vercel.
- Tim 3 orang; pengembangan dikerjakan satu orang bersama AI (Claude Code).
  Seluruh proses dan keputusan dicatat di `docs/devlog.md` agar anggota lain
  dapat mengikuti alurnya. Pembagian peran dilakukan saat presentasi/demo.
- Harus siap demo live sebelum tanggal UTS/UAS (beberapa minggu dari sekarang).
- Halaman detail aset (tujuan QR) wajib nyaman dipakai di HP.
- Setiap fitur harus punya tes otomatis yang lulus sebelum dianggap selesai.

## Success looks like
- Lokasi perangkat ditemukan kurang dari 30 detik lewat pencarian atau pemindaian QR.
- Sistem menolak 100% pemasangan device yang bertabrakan posisi U atau melebihi tinggi rak.
- Setiap maintenance memunculkan pengingat paling lambat 3 hari sebelum tenggat.
- Impact analysis menampilkan seluruh perangkat yang terhubung langsung ke perangkat
  yang akan di-maintenance.
- Seluruh test case blackbox di laporan berstatus valid saat demo.

## Decisions (dapat direvisi)
- Metode pengembangan: AI-Native SDLC (Anthropic, 2026), dijelaskan secara
  profesional di laporan. Dosen mengizinkan penggunaan AI.
- Impact analysis MVP: satu lompatan (perangkat yang terhubung langsung lewat kabel).
  Penelusuran berantai menjadi pengembangan lanjutan.
- Pengingat MVP: notifikasi di dalam aplikasi. Email menjadi pengembangan lanjutan.

## Open questions
- Belum ada. Pertanyaan baru dicatat di sini saat muncul.
