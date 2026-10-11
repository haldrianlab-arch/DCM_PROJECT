# Wireframe ASCII SIRAMA

Gambaran kasar setiap halaman dan modal di [`specs/design.md`](../../specs/design.md) v0.4 (isi dan urutan halaman tidak berubah di v0.5), supaya tim bisa membayangkan bentuk website sebelum mockup dan kode jadi.

**Untuk internal tim saja.**
- **Bukan sumber kebenaran.** Bila wireframe berbeda dengan `design.md`, yang berlaku `design.md`.
- **Jangan dilampirkan ke Claude Design.** Sketsa ASCII sengaja dikeluarkan dari design.md agar Claude Design tidak terpaku pada tata letak kasar ini.
- Ukuran, jarak, dan proporsi di sini tidak akurat; yang penting adalah **isi dan urutan**.
- **Tampilan visual** (warna, huruf, bentuk lencana, sudut) tidak digambarkan di sini. Lihat `design.md` §4 dan design system SIRAMA di [`specs/design-system/`](../../specs/design-system/).

## Daftar file

| File | Isi |
|---|---|
| [`00-kerangka.md`](00-kerangka.md) | Kerangka desktop dan HP (per peran), menu user, MOD-10 menu HP, pola umum (toast, kosong, memuat), HAL-29, HAL-30 |
| [`01-umum.md`](01-umum.md) | HAL-01 Login, HAL-02 Dashboard, HAL-03 Tugas saya, HAL-04 Pencarian, HAL-05 Notifikasi |
| [`02-inventaris.md`](02-inventaris.md) | HAL-06 Lokasi, MOD-01/02/03, HAL-07 Detail rack, HAL-08 s.d. HAL-12 (device dan cable), MOD-11 Port |
| [`03-maintenance.md`](03-maintenance.md) | HAL-13 s.d. HAL-19 (work order, maintenance plan, kalender), MOD-07, MOD-08 |
| [`04-katalog-admin.md`](04-katalog-admin.md) | HAL-20 s.d. HAL-28 (katalog, user, audit log, cetak label), HAL-31 Akun saya, MOD-04, MOD-05, MOD-09, MOD-12 |
| [`05-dialog.md`](05-dialog.md) | MOD-06 Dialog konfirmasi, semua varian |

## Cara membaca

| Simbol | Arti |
|---|---|
| `[# Simpan device ]` | Tombol utama (warna merek `air`) |
| `[ Batal ]` | Tombol sekunder (garis tepi) |
| `[! Pensiunkan ]` | Tombol bahaya (merah) |
| `[...]` | Menu titik tiga |
| `[≡]` | Tombol buka menu (HP) |
| `[x]` / `[ ]` | Kotak centang tercentang / kosong |
| `(•) Depan  ( ) Belakang` | Pilihan tersegmen; `(•)` = terpilih |
| `[________________]` | Kolom isian teks |
| `[ Pilih room       v]` | Pilihan dengan pencarian (dropdown) |
| `{Aktif}` | Lencana status (di aplikasi: lencana lembut berwarna + ikon + teks; hanya `{Terlambat}` yang pekat) |
| `_srv-web-01_` | Tautan |
| `(!)` | Ikon peringatan |
| `(i)` | Ikon informasi |
| `[ok]` | Ikon centang |
| `┌╌╌┐` | Garis putus-putus |
| `////` | Blok berarsir: bagian belakang device full-depth |
| `.....` | Slot rack kosong |
| `░░░░` | Kerangka memuat |
| `Notif(3)` | Ikon lonceng dengan 3 notifikasi belum dibaca |

Ikon lain ditulis sebagai teks pendek di dalam kurung siku. Di aplikasi semua ikon memakai Lucide, tanpa emoji.

**Halaman desktop** digambar hanya bagian isinya (tanpa sidebar dan header) kecuali di `00-kerangka.md`, karena kerangkanya selalu sama.

**Data contoh** mengikuti PRD Lampiran A: site Kampus Utama, room Ruang Server Gedung A, rack RK-A01 s.d. RK-A04; user Andi (Admin), Rina (Teknisi IT), Joko (Teknisi Fasilitas), Sari (Viewer); tanggal "hari ini" = 9 Okt 2026.
