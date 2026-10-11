# Brief untuk Claude Design

Dipakai pada tahap Design untuk membuat mockup (alur playbook: mockup dibuat di Claude Design, diiterasi, lalu diekspor ke Claude Code). Mockup yang disetujui menjadi acuan perbandingan screenshot di tahap Test.

## Langkah 1: design system (sudah selesai)

Design system SIRAMA sudah dibuat di Claude Design sebagai artifact **Design System** bernama "SIRAMA". Isinya token warna, huruf, ukuran, dan 31 komponen dasar (KOM-01 s.d. KOM-31) beserta README tiap komponen. Salinan token dan aturannya ada di [`specs/design-system/`](../specs/design-system/).

Ringkasan proses pembuatannya ada di devlog sesi 10. Bila design system diubah lagi, salin ulang `tokens.json` dan `README.md` ke `specs/design-system/` dan perbarui `specs/design.md` §4 bila aturannya berubah.

## Langkah 2: mockup

1. Di Claude Design, buat proyek baru dari kartu **Design**.
2. Pilih design system **SIRAMA**.
3. Lampirkan:
   1. `intent/asset-maintenance.md`
   2. `specs/PRD.md`
   3. `specs/design.md`
4. Tempel prompt pertama di bawah. Buat **satu atau dua layar per prompt**, periksa hasilnya, lalu lanjut ke layar berikutnya. Meminta semua layar sekaligus cenderung menurunkan ketelitian layar yang dibuat belakangan.

Jangan lampirkan `docs/wireframes/`. Wireframe ASCII hanya untuk tim, dan sengaja tidak diberikan agar Claude Design tidak terpaku pada tata letak kasarnya. `specs/design-system/` juga tidak perlu dilampirkan, karena isinya sudah ada di design system yang dipilih.

### Prompt pertama

```
Buat mockup aplikasi web SIRAMA (Sistem Informasi Rak, Aset & Maintenance)
berdasarkan design.md terlampir, memakai design system SIRAMA.

Aturan umum:
- Pakai komponen dan token design system SIRAMA (Button, DataTable, StatusBadge,
  Sidebar, AppHeader, dan seterusnya). Jangan membuat ulang komponen yang sudah
  ada, dan jangan memakai warna atau ukuran di luar token.
- Identitas visual mengikuti design.md §4: netral zinc, satu aksen air, lencana
  lembut (hanya Terlambat yang pekat), Geist; Geist Mono hanya untuk asset tag,
  nomor WO, dan serial number (komponen Code); nol bergaris (.sr-id) untuk nama
  device, nama rack, lokasi singkat, dan nomor U, termasuk di dalam kalimat.
- Angka format Indonesia (5.250 W, 1,5 m). Tanggal "5 Okt 2026".
- Penamaan §1.3: nama entitas bahasa Inggris (Rack, Device, Cable, Work order),
  selebihnya bahasa Indonesia. Ikon Lucide, tanpa emoji.
- Data dari PRD Lampiran A (Kampus Utama, Ruang Server Gedung A, RK-A01 s.d.
  RK-A04, user Andi/Rina/Joko/Sari, hari ini 9 Okt 2026); field form dari PRD
  Lampiran C.
- Komponen khusus (KOM-32 s.d. KOM-46) belum ada di design system. Ikuti bagian
  Wajib di §8.4 persis; bagian Bebas silakan dikreasikan selama konsisten
  dengan §4 dan §6.

Layar pertama: HAL-07 Detail rack RK-A01 dengan KOM-32 elevation rack
(desktop, login sebagai Andi/Admin). Elevation rack adalah elemen paling khas;
buat paling detail. Elemen lain tenang dan rapi.
```

### Prompt lanjutan

Kirim satu per satu setelah layar sebelumnya disetujui. Cukup sebut layarnya; aturan umum di prompt pertama sudah berlaku.

```
Lanjut: HAL-02 Dashboard dengan KOM-34 peta room (desktop dan HP, sebagai Andi).
```

Urutan layar berikutnya:

1. HAL-10 Detail device srv-db-01: tab Ringkasan dan tab Port & cable (desktop), lalu versi HP
2. HAL-14 Form work order korektif dengan KOM-36 panel dampak (desktop)
3. HAL-03 Tugas saya dan HAL-15 Detail work order dengan KOM-37 (HP, sebagai Rina)
4. HAL-09 Form device dengan KOM-33 pratinjau, termasuk kondisi bentrok (desktop)
5. HAL-06 Lokasi dengan KOM-35 pohon lokasi (desktop)
6. HAL-01 Login (desktop dan HP)
7. HAL-28 Lembar cetak label QR A4 dengan KOM-41

## Yang diperiksa di setiap layar

- Status selalu warna, ikon, dan teks; hanya Terlambat yang pekat.
- `air` hanya untuk yang bisa diklik atau aktif; tab memakai `ink`.
- Kartu bergaris tipis tanpa bayangan; garis kiri tebal hanya di blok elevation rack.
- Nol bergaris di pengenal, mono hanya di kode, angka format Indonesia.
- Data cocok dengan PRD Lampiran A dan field cocok dengan Lampiran C.

## Setelah mockup jadi

- Iterasi sampai disetujui; catat perubahan desain penting di `docs/devlog.md`.
- Bila mockup mengubah keputusan di `specs/design.md`, perbarui dokumen itu agar tetap menjadi sumber kebenaran.
- Ekspor ke Claude Code saat tahap Build.
