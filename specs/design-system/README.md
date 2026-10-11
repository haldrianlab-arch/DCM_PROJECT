SIRAMA (Sistem Informasi Rak, Aset & Maintenance) adalah aplikasi web untuk pengelola dan teknisi ruang server kampus. Gayanya modern dan tenang, sejalan dengan shadcn/ui dan Linear: netral zinc, satu aksen `air`, garis tipis, bayangan yang nyaris tak terlihat, dan tipografi Geist yang rapat. Elevation rack tetap menjadi pusat; status selalu terbaca sekali lihat; kesalahan dicegah sebelum terjadi; halaman teknisi nyaman dipakai dengan satu tangan di depan rack.

## Bahasa dan teks

- **Nama entitas berbahasa Inggris**, ditulis dengan huruf awal kapital di awal kalimat dan huruf kecil di tengah kalimat: Site, Room, Rack, Device, Device function, Manufacturer, Model, Port, Port template, Cable, Maintenance plan, Work order (WO), User.
- **Selebihnya bahasa Indonesia formal dan ringkas**: kalimat, label field, tombol, pesan, nilai status, dan nama halaman yang bukan entitas (Dashboard, Tugas saya, Notifikasi, Kalender, Lokasi).
- **Sentence case** di mana pun, termasuk label, tombol, kepala kolom, dan label grup sidebar: "Simpan device", "Asset tag", "Inventaris". Kapital hanya untuk awal kalimat, nama entitas di awal, dan singkatan (WO, PDU, UPS). Tidak ada label huruf kapital semua.
- **Satu aksi, satu nama** di tombol, judul dialog, dan toast: "Simpan device" → *"Device tersimpan"*; "Pensiunkan" → *"Pensiunkan srv-web-01?"*.
- **Sudut pandang user**: "Jadwal otomatis", bukan "cron".
- **Pesan error** menyebut penyebab dan cara memperbaiki, tanpa permintaan maaf: *"Posisi U10-U11 bertabrakan dengan sw-tor-01. Pilih posisi lain."*
- **Keadaan kosong** satu kalimat + tombol aksi pertama: *"Belum ada rack di room ini."* [Tambah rack].
- **Istilah "tenggat"**, bukan "jatuh tempo": *"Tenggat WO-0012 tinggal 3 hari (11 Okt 2026)"*.
- **Tidak ada emoji** di antarmuka.

### Format

| Data | Contoh |
|---|---|
| Tanggal | *5 Okt 2026* (`formatDate`) |
| Tanggal dan jam | *5 Okt 2026, 07.00 WIB* (`formatDateTime`) |
| Waktu relatif (notifikasi saja) | *3 jam lalu* (`formatRelative`) |
| Nomor U | *U1*, *U12*, rentang *U12-U13* (`formatU`, pengenal: `.sr-id`) |
| Lokasi singkat | *RK-A01 · U39-U40*, *RK-A01 · 0U*, *Ruang Server Gedung A · tanpa rack*, *—* (Stok/Pensiun); pengenal: `.sr-id` |
| Angka desimal dan ribuan | Format Indonesia: titik untuk ribuan, koma untuk desimal: *1,5 m*, *5.250 W*, *1.100 W* (`formatNumber`, `parseNumber`, `NumberInput`) |
| Nomor WO, asset tag, serial number | Selalu lengkap dan dalam Geist Mono: `WO-0012`, `DCM-0001`, `CN7016-9XK2` |
| Keterangan total tabel | *Menampilkan 1-25 dari 87 device* |

## Warna

### Netral (zinc)

- Teks utama `ink`; teks sekunder, keterangan, kepala kolom, dan label grup `ink-muted`.
- Latar halaman `canvas`; kartu, tabel, input, header, modal, dan popover `surface`; sidebar `sidebar` (sedikit lebih gelap dari `surface`).
- Latar disorot pada menu, opsi, tombol ghost, dan item sidebar `muted`.
- Garis tepi dan pemisah `line`; garis saat disorot `line-strong`. Kartu biasa memakai garis `line`, bukan bayangan.

### Aksen `air`

- **`air` adalah warna merek SIRAMA dan satu-satunya aksen.** Hanya untuk elemen yang bisa diklik atau sedang aktif: tombol utama, tautan, kotak centang tercentang, tanggal terpilih, garis fokus, dan menu aktif **navigasi utama** (Sidebar, BottomNav). Tidak untuk dekorasi, status, atau batang kemajuan.
- **Navigasi di dalam halaman memakai `ink`**: tab aktif bergaris bawah `ink`, pilihan tersegmen terpilih berteks `ink` di atas `surface`. Dengan begitu `air` hanya menandai di mana user berada di aplikasi, bukan bagian mana di halaman.
- `air-soft` sebagai latar lembut menu aktif dan chip terpilih; teksnya `air`.
- `air-ring` sebagai cincin fokus lembut.
- Teks dan ikon di atas isian pekat (`air`, tombol bahaya, lencana Terlambat) memakai `on-fill`.

### Status: lencana lembut

Setiap status punya empat token: `status-<warna>` (dasar), `-soft` (latar tint pucat), `-text` (teks dan ikon, ≥ 5.8:1 di atas `-soft`), dan `-line` (garis 1 px). Lencana selalu warna + ikon + teks.

| Warna | Dipakai untuk |
|---|---|
| `status-green` | Device **Aktif**, WO **Selesai** |
| `status-amber` | Device **Maintenance**, WO **Dikerjakan**, **Garansi segera habis**; juga peringatan yang tidak menghalangi (panel dampak, daya melebihi kapasitas) |
| `status-indigo` | WO **Terjadwal** (sengaja bukan `air`, agar tidak dikira dapat diklik) |
| `status-gray` | Device **Stok**, WO **Dibatalkan** |
| `status-gray-dark` | Device **Pensiun** |
| `status-red` | **Garansi habis**, pesan error (`status-red-text`), input error, tombol konfirmasi bahaya |

**Lencana pekat hanya untuk Terlambat** (`status-red` + `on-fill`), agar WO yang lewat tenggat langsung tertangkap mata. Jangan membuat lencana pekat untuk status lain. Merah hanya untuk keadaan yang salah atau sudah lewat; akibat yang *mungkin* terjadi (device ikut mati saat maintenance) memakai amber.

### Device function

Khusus elevation rack dan peta room. Blok device memakai **isian pucat** `fn-*-fill` dengan **garis tepi kiri 4 px** (`function-edge`) `fn-*-edge`, sudut `radius-rack`, dan teks `ink`. **Ini satu-satunya tempat garis kiri tebal dipakai**; kartu, panel, dan peringatan lain tidak memakainya.

| Device function | Isian | Garis kiri |
|---|---|---|
| Server | `fn-server-fill` | `fn-server-edge` |
| Switch, router, firewall | `fn-network-fill` | `fn-network-edge` |
| Storage | `fn-storage-fill` | `fn-storage-edge` |
| Patch panel | `fn-patch-fill` | `fn-patch-edge` |
| PDU, UPS (daya) | `fn-power-fill` | `fn-power-edge` |
| Lainnya, dan device function baru yang tidak cocok | `fn-other-fill` | `fn-other-edge` |

### Warna turunan

Disorot/ditekan pada isian pekat = warna dasar dicampur hitam 10%/20% (`color-mix()`); cincin error = `status-red` 20%. Latar pucat lain yang disebut spesifikasi (panel dampak, perbandingan audit) memakai token `status-*-soft` dan garis `status-*-line` 1 px.

### Kontras (diperiksa)

| Pasangan | Rasio |
|---|---|
| `ink` di atas `surface` / `muted` | 17.7 / 16.1 |
| `ink-muted` di atas `surface` / `canvas` / `muted` / `air-soft` | 5.3 / 5.1 / 4.8 / 4.6 |
| `air` di atas `surface` / `air-soft`; `on-fill` di atas `air` | 5.9 / 5.1 / 5.9 |
| `status-*-text` di atas `status-*-soft` | hijau 5.8, amber 6.2, indigo 7.0, abu 7.0, abu tua 11.7, merah 6.1 |
| `on-fill` di atas `status-red` (Terlambat) | 5.4 |
| `ink` di atas `fn-*-fill` | ≥ 14.7 |

`ink-muted` sengaja #6b6b73, sedikit lebih gelap dari zinc-500 (#71717a, hanya 4.4:1 di atas `muted`). `line` (1.3:1) di bawah 3:1 untuk batas kontrol: kontrol selalu punya label, dan fokus menambah garis `air`. Kotak centang memakai garis `ink-muted`.

## Tipografi

- **Geist** (`--font-sans`) untuk semua teks antarmuka, berkas 400/500/600/700 di `fonts/`; Inter dan system-ui sebagai cadangan.
- Berkas Geist di `fonts/` adalah versi asli tanpa perubahan (lisensi di `fonts/OFL.txt`), sama dengan paket resmi yang akan dimuat aplikasi.
- **Pengenal memakai kelas `.sr-id`** (`font-feature-settings: "ss09"`, nol bergaris) agar 0 tidak tertukar dengan O: nama device, nama rack, lokasi singkat, nomor U (*srv-web-01*, *RK-A01 · U12-U13*). Tanpa `tabular-nums`, karena di Geist `tnum` mematikan `ss09`.
- Komponen memasang `.sr-id` sendiri: kolom nama (`strong`) dan kolom `ident` di DataTable, label dan keterangan Combobox serta isi kolomnya, hasil dan isi kolom GlobalSearch, Breadcrumb, `TextInput ident` (kolom nama device atau rack), nama dan nomor U di elevation rack dan cover. Di tempat lain, pasang `className="sr-id"` sendiri.
- **Angka tabular hanya untuk** kolom angka DataTable (`numeric: true`), nilai ProgressBar, dan angka DatePicker (kelas `.sr-num` untuk kasus serupa).
- **Teks biasa tanpa nol bergaris:** tanggal, waktu relatif, jumlah, nama model, dan kalimat memakai Geist biasa.
- **Geist Mono** (`--font-mono`) **hanya untuk asset tag, nomor WO, dan serial number**. Pakai komponen `Code`, kolom tabel `mono: true`, item breadcrumb `code: true`, atau kelas `.sr-code`.

| Gaya | Ukuran | Pakai untuk |
|---|---|---|
| `page-title` | 24/32, 600, −0.02em | Judul halaman |
| `section-title` | 18/28, 600, −0.01em | Judul bagian, modal, panel |
| `card-title` | 14/20, 600 | Judul kartu, blok buka-tutup, popover |
| `body` | 14/20, 400 | Teks UI dasar, isi tabel, isi input (16 px di HP) |
| `body-strong` | 14/20, 500 | Label field, tombol, kolom nama, menu sidebar |
| `small` | 13/18, 400 | Teks bantuan, keterangan, pesan validasi |
| `label-xs` | 12/16, 500 | Kepala kolom, lencana, label grup sidebar, bar bawah |
| `location-lg` | 20/28, 600, −0.01em | Lokasi singkat di kartu lokasi (KOM-43) |
| `code` / `code-strong` | 13/20, 400 / 500, Geist Mono | Asset tag, nomor WO, serial number |

Panjang baris paragraf maksimal sekitar 75 karakter.

## Ikonografi

- **Semua ikon dari Lucide** (garis, ISC), tebal garis 2, warna mengikuti teks. 16 px di teks, tombol, dan sidebar; 20 px di bar navigasi bawah dan header HP; 12 px di lencana. Komponen `Icon` memuat set yang dipakai; berkas SVG ada di grup aset Icons.
- **Tidak ada emoji.** Hanya logo yang digambar khusus.
- **Satu makna selalu satu ikon.** Ikon status tidak dipakai untuk makna lain.

| Makna | Ikon |
|---|---|
| Aktif, Selesai | `circle-check` |
| Maintenance, Dikerjakan | `wrench` |
| Terjadwal | `calendar-clock` |
| Stok | `package` |
| Pensiun | `archive` |
| Dibatalkan | `circle-slash` |
| Terlambat, Garansi habis | `triangle-alert` |
| Garansi segera habis | `clock` |
| Dashboard · Tugas saya · Lokasi · Device · Cable | `layout-dashboard` · `list-checks` · `map-pin` · `server` · `cable` |
| Work order · Maintenance plan · Kalender | `clipboard-list` · `repeat` · `calendar-days` |
| Manufacturer · Model · Device function | `factory` · `layers` · `tags` |
| User · Audit log · Notifikasi · Cari | `users` · `history` · `bell` · `search` |
| Akun saya · Keluar | `circle-user` · `log-out` |
| Tambah · Tutup/hapus · Menu baris · Menu HP · Filter | `plus` · `x` · `ellipsis-vertical` · `menu` · `list-filter` |
| Pesan error di bawah kolom · Info | `circle-alert` · `info` |
| Notifikasi: WO ditugaskan · tenggat mendekat · belum punya teknisi · terlambat | `clipboard-list` · `clock` · `user-x` · `triangle-alert` |
| Memproses | `loader-circle` (berputar) |

Nama ikon Lucide dapat berubah antarversi; set ini diambil dari lucide-static 0.460.0.

## Bentuk, kepadatan, dan kedalaman

- **Sudut:** `radius-control` 6 px (tombol, input, lencana, chip, item menu), `radius-card` 10 px (kartu, tabel, popover, toast), `radius-modal` 12 px (modal, panel samping), `radius-rack` 2 px (blok elevation rack).
- **Kepadatan:** tombol dan input `control-height` 36 px dengan teks 14 px/500; baris tabel `table-row` 40 px; kepala kolom `table-head` 36 px; lencana `badge-height` 22 px. Di HP semua kontrol minimal `touch-target` 44 px.
- **Bayangan:** `shadow-xs` untuk tombol utama, tombol sekunder, input, dan opsi terpilih tersegmen; `shadow-float` untuk dropdown, menu, kalender, tooltip, toast; `shadow-overlay` (besar dan halus) untuk modal dan panel. Kartu biasa: garis `line`, tanpa bayangan.
- **Overlay:** `overlay` (hitam 40%) dengan blur `blur-overlay` 4 px di belakang modal dan panel. Ini satu-satunya efek blur.
- **Gerak:** hanya sebagai respons aksi user, `duration-fast` 150 ms atau `duration-base` 200 ms. Tidak ada animasi dekoratif saat halaman dimuat; kerangka memuat diam. Bila "kurangi gerakan" aktif, animasi dimatikan.
- **Tata letak:** sidebar `sidebar-width` 240 px (diciutkan 64 px) berlatar `sidebar`, header `header-height` 56 px berlatar `surface`, isi berlatar `canvas`. Di bawah `breakpoint-mobile` 768 px: header ringkas 52 px dan bar bawah 60 px + area aman. Form satu kolom selebar maksimal `form-max` 720 px.
- **Hindari:** gradasi, glassmorphism (selain blur overlay), kartu bergaris kiri tebal (hanya blok device di elevation rack), dan lencana pekat di mana-mana.

## Keadaan komponen interaktif

| Keadaan | Tampilan |
|---|---|
| Normal | Tampilan dasar |
| Disorot | Isian pekat sedikit lebih gelap; kontrol bergaris menjadi `line-strong` atau berlatar `canvas`; item menu, opsi, dan ghost berlatar `muted`; baris tabel berlatar `canvas` (desktop saja) |
| Fokus | Garis `air` 1 px + cincin `air-ring` 3 px (`ring-focus`). Pada tombol utama dan bahaya didahului celah `surface` 2 px |
| Ditekan | Sedikit lebih gelap dari disorot |
| Nonaktif | Opasitas `opacity-disabled`, bayangan hilang, kursor tidak berubah menjadi tangan, keterangan alasan bila tidak jelas |
| Error (input) | Garis `status-red`, cincin merah lembut saat fokus, pesan `status-red-text` dengan ikon `circle-alert` di bawahnya |
| Memproses (tombol) | `loader-circle` berputar di dalam tombol, teks tetap, tidak bisa ditekan lagi |

## Aksesibilitas

- Kontras teks minimal 4.5:1 terhadap latarnya; lihat tabel kontras di atas.
- Semua aksi bisa dilakukan dengan keyboard; fokus selalu terlihat. Pencarian global dapat dibuka dengan Ctrl K (⌘ K di Mac).
- Setiap tombol ikon punya keterangan untuk pembaca layar (`IconButton` mewajibkan `label`).
- Area sentuh di HP minimal 44 × 44 px; isi input 16 px di HP.
- Status selalu warna + ikon + teks; versi ringkas (ikon saja) punya keterangan saat disorot dan dibacakan pembaca layar.

## Logo

Simbol lemari rack: persegi panjang tegak berproporsi 3:4 dengan garis tepi `air` 2 px tanpa isi pekat, berisi dua blok unit berbeda tinggi (2U dan 1U) dan satu titik kecil sebagai lampu indikator (kisi 24 px: bingkai 15 × 20 px bersudut 2 px, blok 9 × 6 px dan 9 × 3 px, titik ⌀ 2,5 px). Bentuknya sengaja tidak menyerupai ikon menu atau ikon Lucide lain, sehingga tidak tertukar dengan tombol menu di header HP; tetap terbaca di 16 px. Wordmark "SIRAMA" dalam Geist 600 berwarna `air` di sebelah kanan simbol. Simbol saja dipakai sebagai favicon dan di sidebar yang diciutkan. Berkas di grup aset Logos; komponen `Logo` (dipakai `Sidebar` dan `AppHeader`).

## Komponen

Bundle `window.SIRAMA` (React 18). Komponen dasar: `Button` (KOM-01), `IconButton` (02), `TextInput` (03), `TextArea` (04), `NumberInput` (05), `Combobox` (06), `DatePicker` (07), `Checkbox` (08), `SegmentedControl` (09), `Link` (10), `Icon` (11), `StatusBadge` (12), `Chip` (13), `Tooltip` (14), `ProgressBar` (15), `Skeleton` (16). Komponen gabungan: `FormField` (17), `FilterBar` (18), `DataTable` (19), `Tabs` (20), `Collapsible` (21), `Toast` + `ToastViewport` (22), `Modal` (23), `SidePanel` (24), `EmptyState` (25), `Sidebar` (26), `AppHeader` (27), `BottomNav` (28), `Breadcrumb` (29), `NotificationBell` (30), `GlobalSearch` (31). Tambahan: `Logo`, `Code` (asset tag, nomor WO, serial number dalam Geist Mono), konstanta `NOTIFICATION_TYPES`, dan fungsi format `formatDate`, `formatDateTime`, `formatU`, `formatRelative`, `formatNumber`, `parseNumber`.

Baca README tiap komponen sebelum memakainya: isinya props yang harus disediakan, kapan dipakai, dan larangannya.
