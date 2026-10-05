# Design Spec: SIRAMA

**SIRAMA** (Sistem Informasi Rak, Aset & Maintenance)

| | |
|---|---|
| Versi | 0.2 (direvisi setelah review) |
| Tanggal | 5 Oktober 2026 |
| Sumber | [`intent/asset-maintenance.md`](../intent/asset-maintenance.md), [`specs/prd.md`](prd.md) v0.2 |
| Tahap SDLC | Design |
| Dipakai oleh | Claude Design (mockup), Claude Code (build), tahap Test (acuan visual) |

---

## 1. Cakupan dokumen

Dokumen ini menjelaskan **bagaimana pengguna mengalami SIRAMA**: identitas visual, halaman apa saja, isi setiap halaman, cara berpindah antarhalaman, dan perilaku komponen penting. Kebutuhan fungsional ada di PRD dan dirujuk dengan kode seperti `US-DEV-02`.

**Yang dirancang di sini:** semua fitur berprioritas **Must** dan **Should** di PRD.
**Yang belum dirancang:** fitur **Could** (foto bukti, trace patch panel, graf topologi, persetujuan WO, vendor eksternal, import CSV, notifikasi email, simulasi pembacaan perangkat, mode gelap, pemindai QR di aplikasi). Fitur tersebut dirancang bila jadi dikerjakan.

**Dokumen terkait yang dipisahkan:**
- Flowchart dan diagram use case: [`docs/diagrams/`](../docs/diagrams/)
- Naskah demo: [`docs/demo-script.md`](../docs/demo-script.md)
- Brief dan prompt Claude Design: [`docs/claude-design-brief.md`](../docs/claude-design-brief.md)

**Cara membaca sketsa:** setiap sketsa ASCII di dokumen ini disertai deskripsi tertulis. Sketsa hanya gambaran kasar; **bila sketsa dan deskripsi tampak berbeda, deskripsi tertulis yang berlaku.**

---

## 2. Prinsip desain

1. **Rak adalah pusatnya.** Elevation rak adalah elemen paling khas dan paling dipoles. Bagian lain dibuat tenang dan disiplin agar rak menonjol.
2. **Sekali lihat, langsung paham.** Jenis perangkat, kondisinya, dan sisa ruang terbaca tanpa membuka detail.
3. **Cegah di tampilan, tolak di server.** Pilihan yang tidak sah tidak ditampilkan (port terpakai, teknisi tidak sesuai keahlian, status Maintenance di form). Server tetap menolak bila ada yang lolos.
4. **Lapangan dulu untuk teknisi.** Halaman yang dibuka teknisi di depan rak harus bisa dipakai dengan satu tangan di HP.
5. **Status tidak pernah hanya warna.** Setiap warna status selalu disertai teks dan ikon.

---

## 3. Identitas visual

### 3.1 Warna dasar

| Token | Hex | Peran | Kontras |
|---|---|---|---|
| `ink` | `#14232B` | Teks utama (biru-abu sangat tua) | 16.1:1 di atas putih |
| `ink-muted` | `#5A6B74` | Teks sekunder, keterangan | 5.5:1 di atas putih, 5.1:1 di atas `canvas` |
| `surface` | `#FFFFFF` | Latar kartu, tabel, form | — |
| `canvas` | `#F3F6F8` | Latar halaman (abu dingin) | — |
| `line` | `#D5DEE3` | Garis tepi, pemisah | — |
| `air` | `#0A6C8C` | **Warna merek SIRAMA.** Tombol utama, menu aktif, tautan, garis fokus | 5.9:1 dengan teks putih |
| `air-soft` | `#E1F1F6` | Latar menu aktif, sorotan lembut | `air` di atasnya 5.1:1 |

Aturan: `air` hanya dipakai untuk elemen yang **bisa diklik atau sedang aktif**. Tidak dipakai untuk dekorasi dan tidak untuk status.

### 3.2 Warna status

Lencana status berupa kotak kecil berwarna pekat dengan **teks putih dan ikon**. Semua warna di bawah memiliki kontras minimal 4.5:1 dengan teks putih.

| Warna | Hex | Kontras | Dipakai untuk |
|---|---|---|---|
| Hijau | `#1A7F50` | 5.0:1 | Device **Aktif**, WO **Selesai** |
| Kuning-oranye | `#9A5B00` | 5.4:1 | Device **Maintenance**, WO **Dikerjakan**, **garansi segera habis** |
| Ungu-indigo | `#5B4FC4` | 6.3:1 | WO **Terjadwal** |
| Abu | `#5F6E77` | 5.3:1 | Device **Stok**, WO **Dibatalkan** |
| Abu tua | `#3D4950` | 9.3:1 | Device **Pensiun** |
| Merah | `#C2382F` | 5.4:1 | WO **Terlambat**, **garansi habis**, pesan error |

Ungu-indigo dipilih untuk Terjadwal agar tidak tertukar dengan warna merek `air` yang menandai elemen bisa diklik.

### 3.3 Warna fungsi perangkat (khusus elevation rak)

Blok perangkat di elevation memakai **isian pucat dengan garis tepi kiri tebal (4 px)** sesuai fungsinya, sehingga tidak tertukar dengan lencana status yang pekat. Teks `ink` di atas semua isian ini memiliki kontras di atas 13:1.

| Fungsi | Isian | Garis kiri |
|---|---|---|
| Server | `#E4EEF7` | `#3B6E9E` |
| Switch, router, firewall | `#F4ECDD` | `#9A6A1F` |
| Storage | `#E6F2EC` | `#2F7A57` |
| Patch panel | `#EEEEF0` | `#6E6E78` |
| PDU, UPS (daya) | `#F7E6E3` | `#A4483C` |
| Lainnya | `#EDEFF1` | `#5A6B74` |

Fungsi perangkat dibuat Admin di Katalog, sehingga daftarnya bisa bertambah. Pemetaan warna di atas ditentukan dari **nama fungsi bawaan data seed**; fungsi baru yang tidak cocok dengan baris mana pun memakai warna "Lainnya".

### 3.4 Tipografi

- **Satu keluarga huruf: IBM Plex Sans** (lisensi terbuka, tersedia di Google Fonts). Bernuansa teknik dan jelas di ukuran kecil.
- **Angka tabular** (`font-variant-numeric: tabular-nums`) untuk nomor U, asset tag, serial number, tanggal, dan angka di tabel, agar digit sejajar vertikal.
- Skala ukuran: 13 px (keterangan), 14 px (isi tabel), 16 px (teks utama), 20 px (judul bagian), 28 px (judul halaman).
- Ketebalan: 400 untuk teks, 500 untuk label dan isi tabel yang ditekankan, 600 untuk judul.
- Huruf kapital hanya di awal kalimat (*sentence case*), termasuk label dan tombol. Tidak memakai label huruf kapital semua.
- Panjang baris paragraf maksimal sekitar 75 karakter.

### 3.5 Bentuk, kepadatan, dan gerak

- Sudut membulat 4 px untuk tombol dan input, 6 px untuk kartu dan modal. Blok di elevation rak bersudut 2 px agar terlihat seperti perangkat sungguhan.
- Tinggi baris tabel 44 px di desktop.
- Bayangan hanya untuk elemen yang melayang di atas halaman (modal, dropdown, toast). Kartu biasa memakai garis tepi `line`, bukan bayangan.
- Animasi hanya sebagai respons aksi pengguna (modal terbuka, panel dampak muncul, status berubah), berdurasi pendek (150-200 ms). Tidak ada animasi dekoratif saat halaman dimuat. Bila pengguna mengaktifkan "kurangi gerakan" di perangkatnya, animasi dimatikan.

### 3.6 Logo

Wordmark "SIRAMA" dalam IBM Plex Sans tebal berwarna `air`, didampingi simbol sederhana: tiga garis horizontal bertumpuk (melambangkan rak) yang dibingkai bentuk tetesan air. Dibuat di Claude Design. Versi kecil (hanya simbol) dipakai sebagai favicon dan di sidebar yang diciutkan.

---

## 4. Sitemap dan akses

```
/login
/                                  → dialihkan sesuai peran (5.3)
/dashboard
/tugas                             → Tugas saya
/cari                              → halaman pencarian (dibuka dari bar bawah HP)
/notifikasi
/inventaris/lokasi                 → site, ruangan, daftar rak
/inventaris/rak/[id]               → detail rak + elevation
/inventaris/device                 → daftar device
/inventaris/device/baru
/inventaris/device/[id]            → detail device
/inventaris/device/[id]/ubah
/inventaris/kabel                  → daftar kabel
/inventaris/kabel/baru
/inventaris/kabel/[id]/ubah
/maintenance/work-order            → daftar WO
/maintenance/work-order/baru       → WO korektif
/maintenance/work-order/[id]       → detail WO
/maintenance/rencana               → daftar rencana
/maintenance/rencana/baru
/maintenance/rencana/[id]          → detail rencana
/maintenance/rencana/[id]/ubah
/maintenance/kalender              → (Should)
/katalog/manufacturer
/katalog/fungsi-perangkat
/katalog/model
/katalog/model/baru
/katalog/model/[id]                → detail model + template port
/katalog/model/[id]/ubah
/admin/pengguna
/admin/pengguna/baru
/admin/pengguna/[id]/ubah
/admin/audit-log
/a/[asset-tag]                     → tujuan QR, dialihkan ke detail device
/label/cetak                       → cetak label massal (Should)
```

Site, ruangan, rak, manufacturer, dan fungsi perangkat tidak punya halaman form sendiri karena memakai modal (6.2).

### Akses halaman per peran

| Halaman | Admin | Teknisi | Viewer |
|---|:---:|:---:|:---:|
| Dashboard, cari, inventaris, maintenance, katalog (melihat) | ✅ | ✅ | ✅ |
| Semua halaman `/baru` dan `/ubah`, modal tambah/ubah | ✅ | ❌ | ❌ |
| Tugas saya | ❌ | ✅ | ❌ |
| Notifikasi | ❌ | ✅ | ❌ |
| Administrasi (pengguna, audit log) | ✅ | ❌ | ❌ |
| Cetak label | ✅ | ❌ | ❌ |

Tugas saya dan notifikasi hanya untuk Teknisi karena penugasan WO dan notifikasi di PRD hanya ditujukan kepada teknisi (US-WO-03, US-NOTIF-01). Halaman yang tidak boleh diakses menampilkan "Akses ditolak" dengan tautan kembali ke halaman awal peran tersebut.

---

## 5. Navigasi

### 5.1 Desktop: sidebar kiri dan header

```
┌───────────────┬────────────────────────────────────────────────┐
│ ◈ SIRAMA      │ [ Cari nama, asset tag, serial...   ]   🔔3  Rina ▾│
│               ├────────────────────────────────────────────────┤
│ Dashboard     │ Inventaris / Lokasi & rak / RK-A01             │
│ Tugas saya    │                                                │
│               │ RK-A01                                         │
│ Inventaris    │                                                │
│  Lokasi & rak │              (isi halaman)                     │
│  Device       │                                                │
│  Kabel        │                                                │
│ Maintenance   │                                                │
│  Work order   │                                                │
│  Rencana      │                                                │
│  Kalender     │                                                │
│ Katalog     ▸ │                                                │
└───────────────┴────────────────────────────────────────────────┘
```

**Deskripsi.** Layar dibagi dua kolom. Kolom kiri adalah **sidebar** selebar 240 px berlatar `surface` dengan garis tepi kanan `line`; menempel saat halaman di-scroll. Kolom kanan berisi header di atas dan isi halaman di bawahnya, berlatar `canvas`.

Isi sidebar dari atas ke bawah:
1. Logo SIRAMA (simbol + wordmark).
2. Menu tunggal: **Dashboard**, lalu **Tugas saya** (hanya Teknisi).
3. Grup **Inventaris**: Lokasi & rak, Device, Kabel.
4. Grup **Maintenance**: Work order, Rencana, Kalender.
5. Grup **Katalog**: Manufacturer, Model, Fungsi perangkat. Grup ini **tertutup secara bawaan** (ditandai ▸) dan bisa dibuka dengan klik.
6. Grup **Administrasi**: Pengguna, Audit log. Hanya tampil untuk Admin.

Nama grup ditulis lebih kecil dengan warna `ink-muted` dan tidak bisa diklik (kecuali Katalog yang bisa dibuka-tutup). Menu yang sedang aktif berlatar `air-soft` dengan teks `air` dan garis tebal `air` di sisi kirinya. Setiap menu memiliki ikon garis di kiri teksnya.

Sidebar dapat diciutkan menjadi 64 px yang hanya menampilkan ikon; nama menu muncul sebagai keterangan saat ikon disorot.

**Header** setinggi 56 px berisi, dari kiri ke kanan: kolom pencarian global (lebar sekitar 400 px), ikon lonceng dengan angka notifikasi belum dibaca (hanya Teknisi), dan menu pengguna berisi nama serta peran pengguna dengan pilihan "Keluar".

Di bawah header terdapat **breadcrumb** (5.4) lalu judul halaman.

### 5.2 HP: header ringkas dan bar navigasi bawah

```
┌─────────────────────────────┐
│ ☰   ◈ SIRAMA                │
│                             │
│        (isi halaman)        │
│                             │
├───────┬───────┬──────┬──────┤
│  ☑    │  ▦    │  ⌕   │ 🔔3  │
│ Tugas │ Dasbor│ Cari │ Notif│
└───────┴───────┴──────┴──────┘
```

**Deskripsi.** Pada layar selebar 768 px atau kurang, sidebar disembunyikan. Di atas terdapat **header ringkas** setinggi 52 px berisi tombol ☰ di kiri dan logo di tengah-kiri. Tombol ☰ membuka menu lengkap (isi sama dengan sidebar) yang meluncur dari kiri menutupi sebagian layar.

Di bawah layar terdapat **bar navigasi bawah** setinggi 60 px yang selalu terlihat, berisi tombol berikon dengan label di bawahnya. Isinya berbeda per peran:

| Peran | Tombol (kiri ke kanan) |
|---|---|
| Teknisi | Tugas, Dasbor, Cari, Notif |
| Admin | Dasbor, Work order, Cari |
| Viewer | Dasbor, Cari |

Tombol yang sedang aktif berwarna `air`; lainnya `ink-muted`. Tombol Notif menampilkan angka belum dibaca di sudut ikon. Tombol Cari membuka halaman `/cari` yang langsung memfokuskan kolom pencarian. Bar memperhitungkan area aman layar (notch dan garis navigasi sistem HP) sehingga tombol tidak tertutup. Isi halaman diberi ruang di bagian bawah agar tidak tertutup bar.

### 5.3 Halaman awal per peran

| Peran | Setelah login |
|---|---|
| Admin, Viewer | `/dashboard` |
| Teknisi | `/tugas` |

Bila login dipicu oleh pemindaian QR, pengguna dikembalikan ke halaman device yang dipindai (US-QR-02 AC2).

### 5.4 Breadcrumb

Setiap halaman selain dashboard dan tugas saya menampilkan jejak lokasi di bawah header, misalnya *Inventaris / Lokasi & rak / RK-A01*. Setiap bagian kecuali yang terakhir dapat diklik. Di HP, breadcrumb diringkas menjadi satu tautan "← kembali ke halaman induk".

---

## 6. Pola antarmuka umum

### 6.1 Tabel daftar

- Pagination 25 baris per halaman dengan keterangan total (*"Menampilkan 1-25 dari 87 device"*).
- Di atas tabel: kolom pencarian dan tombol filter. Filter yang aktif tampil sebagai *chip* (label kecil berbingkai) yang dapat dihapus satu per satu.
- Kolom status memakai lencana (3.2).
- Klik baris membuka halaman detail.
- Tabel device memiliki kotak centang per baris untuk aksi massal cetak label (Admin, Should).
- Di HP, tabel dapat digeser ke samping di dalam kotaknya sendiri; halaman tidak ikut bergeser. Kolom pertama (nama) tetap menempel di kiri saat digeser.

### 6.2 Form

| Jenis data | Pola |
|---|---|
| Sederhana: site, ruangan, rak, manufacturer, fungsi perangkat | Modal di tengah layar (di HP: layar penuh) |
| Kompleks: device, model + template port, kabel, rencana, WO, pengguna | Halaman penuh |

- Label di atas kolom input. Kolom wajib ditandai "(wajib)" setelah label, bukan hanya tanda bintang.
- Pesan validasi tampil di bawah kolom yang salah, berwarna merah, berisi penyebab dan solusi. Contoh: *"Posisi U10-U11 bertabrakan dengan sw-tor-01. Pilih posisi lain."*
- Pilihan yang tidak sah tidak ditampilkan (prinsip 3): status Maintenance tidak ada di pilihan status device (US-DEV-03 AC4); daftar port hanya berisi port kosong yang jenisnya cocok (8.5); daftar teknisi hanya berisi teknisi dengan keahlian sesuai (US-WO-03).
- Tombol utama berwarna `air` dan menyebut aksinya: "Simpan device", "Pasang ke rak", "Mulai pekerjaan". Tombol sekunder ("Batal") bergaya garis tepi.

### 6.3 Aksi berbahaya

Hapus, pensiunkan, batalkan WO, dan nonaktifkan pengguna atau rencana memakai dialog konfirmasi yang **menyebutkan dampaknya**. Tombol konfirmasi berwarna merah dan memakai kata kerja aksinya.

```
┌──────────────────────────────────────────────┐
│ Pensiunkan srv-web-01?                       │
│                                              │
│ Posisi U39-U40 di RK-A01 akan dikosongkan,   │
│ 3 kabel dilepas, dan 1 rencana maintenance   │
│ dinonaktifkan.                               │
│                                              │
│                     [ Batal ] [ Pensiunkan ] │
└──────────────────────────────────────────────┘
```

**Deskripsi.** Dialog modal di tengah layar dengan judul berupa pertanyaan yang menyebut nama objek, diikuti satu paragraf yang menjelaskan semua akibat aksi dengan angka konkret (berapa posisi, kabel, dan rencana yang terdampak). Di kanan bawah terdapat tombol "Batal" (garis tepi) dan tombol konfirmasi berwarna merah dengan kata kerja yang sama seperti judulnya. Membatalkan WO menambahkan kolom alasan wajib di dalam dialog; tombol konfirmasi tidak aktif sebelum alasan diisi.

Aksi yang ditolak aturan hapus (BR-14) tidak memakai dialog konfirmasi, melainkan pesan yang menjelaskan alasannya dan langkah yang bisa dilakukan, misalnya *"Device ini memiliki riwayat work order sehingga tidak dapat dihapus. Ubah statusnya menjadi Pensiun."*

### 6.4 Kondisi halaman

| Kondisi | Tampilan |
|---|---|
| Memuat | Kerangka abu-abu berbentuk seperti konten yang akan muncul (baris tabel, kartu), bukan ikon berputar di tengah layar |
| Kosong | Kalimat singkat yang menjelaskan keadaan + tombol aksi pertama (untuk Admin). Contoh: *"Belum ada rak di ruangan ini."* [Tambah rak]. Untuk peran lain tanpa tombol |
| Database masih kosong | Dashboard menampilkan langkah awal berurutan: tambah site → ruangan → rak → katalog → device |
| Error | Penyebab dan langkah perbaikan, tanpa permintaan maaf |
| Berhasil | Toast di pojok kanan bawah (di HP: di atas bar bawah), hilang sendiri setelah 4 detik, memakai kata kerja yang sama dengan tombolnya: "Simpan device" → *"Device tersimpan"* |

### 6.5 Format

- Tanggal: *5 Okt 2026*. Tanggal dan jam: *5 Okt 2026, 07.00 WIB*.
- Tanggal relatif hanya untuk notifikasi: *"3 jam lalu"*.
- Nomor U ditulis tanpa nol di depan: *U1*, *U12*, rentang *U12-U13*.

### 6.6 Teks antarmuka

- Bahasa Indonesia formal dan ringkas; istilah teknis tetap Inggris (rak, U, port, PDU, work order, asset tag).
- Menyebut hal dari sudut pandang pengguna: "Jadwal maintenance", bukan "Cron job".
- Satu aksi memakai satu nama di seluruh alur (tombol, judul dialog, toast).

### 6.7 Aksesibilitas dasar

- Kontras teks minimal 4.5:1 terhadap latarnya (sudah diperiksa untuk semua warna di bagian 3).
- Semua aksi bisa dilakukan dengan keyboard; fokus ditandai garis `air` 2 px di sekeliling elemen.
- Setiap tombol yang hanya berupa ikon memiliki keterangan untuk pembaca layar.
- Area sentuh di HP minimal 44 × 44 px.

---

## 7. Inventaris halaman

Tanda 📱 = halaman yang wajib dioptimalkan untuk HP (NFR-02). Halaman lain cukup tidak rusak di HP.

### Login (`/login`) 📱 (tampilan sederhana)
- Kartu di tengah layar berisi logo, kolom email, kolom password (dengan tombol tampilkan/sembunyikan), dan tombol "Masuk".
- Pesan salah login generik: *"Email atau password salah."* (US-AUTH-01 AC2). Akun nonaktif mendapat pesan yang sama.
- Tidak ada tautan daftar atau lupa password.

### Dashboard (`/dashboard`) 📱
Urutan bagian di desktop, dari atas:
1. **Ringkasan device per status:** satu baris berisi lencana status dengan jumlahnya (*Aktif 18 · Maintenance 1 · Stok 2 · Pensiun 1*). Setiap lencana dapat diklik menuju daftar device terfilter.
2. **Peta ruangan** (lebar penuh): setiap ruangan menjadi satu baris berjudul nama ruangan, berisi deretan kolom vertikal sempit yang masing-masing mewakili satu rak. Setiap kolom diisi blok berwarna fungsi perangkat (3.3) sesuai posisi U yang terpakai, dengan nama rak dan persentase utilisasi di bawahnya. Klik kolom membuka detail rak. Ini versi mini dari elevation dan menjadi bagian paling khas di dashboard.
3. Dua kolom berdampingan:
   - **Perlu perhatian:** daftar WO terlambat (lencana merah) diikuti WO jatuh tempo 7 hari ke depan, maksimal 8 item dengan tautan "Lihat semua".
   - **Garansi:** device dengan garansi habis atau habis dalam 30 hari, maksimal 8 item.

Di HP urutannya: Perlu perhatian, ringkasan status, peta ruangan (dapat digeser ke samping), lalu garansi.

Referensi: US-DASH-01.

### Lokasi & rak (`/inventaris/lokasi`)
- Daftar bertingkat: nama site sebagai judul, di bawahnya ruangan, dan di bawah setiap ruangan tabel rak (nama, tinggi, U terpakai, persentase utilisasi dengan batang kecil).
- Admin: tombol tambah site/ruangan/rak dan menu ubah/hapus per baris (modal). Penghapusan yang ditolak memakai pesan BR-14.
- Referensi: US-LOC-01, US-RAK-01.

### Detail rak (`/inventaris/rak/[id]`)
- Judul nama rak, lokasi (site / ruangan), dan ringkasan: U terpakai, U kosong, persentase.
- Komponen elevation rak (8.1).
- Daftar "Terpasang 0U" di bawah elevation.
- Admin: tombol ubah dan hapus rak.
- Referensi: US-RAK-02, US-DEV-02.

### Daftar device (`/inventaris/device`)
- Kolom: nama, asset tag, fungsi, model, lokasi (*RK-A01 · U39-U40*), status, garansi (tanggal; berwarna kuning-oranye atau merah sesuai 3.2).
- Filter: status, fungsi, rak, garansi (segera habis, habis).
- Admin: tombol "Tambah device"; aksi massal "Cetak label" setelah baris dicentang (Should).
- Referensi: US-DEV-01, US-SRCH-01.

### Form device (`/inventaris/device/baru`, `/[id]/ubah`)
Form satu kolom yang dibagi tiga bagian:
1. **Identitas:** nama, model, fungsi perangkat, serial number, status (pilihan: Stok, Aktif, Pensiun; Maintenance tidak ditampilkan). Pada mode ubah, asset tag tampil sebagai teks tetap yang tidak bisa diubah. Bila device sedang berstatus Maintenance, kolom status tampil sebagai teks tetap *"Maintenance (diatur oleh work order)"*.
2. **Penempatan** (hanya aktif bila status Aktif atau Maintenance): ruangan, lalu rak (opsional), sisi (depan/belakang), dan posisi U. Bila rak dikosongkan, device tercatat berada di ruangan tanpa posisi rak, untuk perangkat yang berdiri di lantai seperti UPS dan AC presisi (PRD Lampiran A); kolom sisi dan posisi disembunyikan. Bila model yang dipilih bertinggi 0U, kolom sisi dan posisi disembunyikan dan muncul keterangan *"Perangkat 0U dipasang tanpa posisi U."* Di samping kolom terdapat **pratinjau elevation mini** dari rak terpilih yang menyorot slot yang akan ditempati: sorotan berwarna `air` bila kosong, merah dengan nama device yang bertabrakan bila bentrok, dan merah bila melebihi tinggi rak.
3. **Pembelian:** tanggal beli, vendor, akhir garansi.

Bila dibuka dari slot kosong elevation, rak, sisi, dan posisi sudah terisi. Tombol utama: "Simpan device".

Referensi: US-DEV-01, US-DEV-02, US-DEV-03.

### Detail device (`/inventaris/device/[id]`) 📱
**Desktop.** Header berisi nama device (judul), asset tag, lencana status, dan tombol aksi Admin: Ubah, Unduh label, Pensiunkan, Hapus (Hapus ditolak dengan pesan BR-14 bila device punya riwayat WO). Di bawahnya empat tab:

| Tab | Isi |
|---|---|
| Ringkasan | Lokasi lengkap (site, ruangan, rak, U, sisi) dengan elevation mini yang menyorot device ini; model, fungsi, serial number; tanggal beli, vendor, akhir garansi dengan penanda garansi; QR code |
| Port & kabel | Tabel port: nama, jenis, tipe konektor, tersambung ke (device dan port), label kabel. Di bawahnya panel dampak (8.2) |
| Maintenance | Rencana aktif, WO terbuka, dan riwayat WO (tanggal, jenis, teknisi, status) |
| Riwayat | Audit log khusus device ini |

**HP.** Tanpa tab. Urutan dari atas: header (nama, asset tag, lencana status), **kartu lokasi** dengan teks besar (*RK-A01 · U39-U40 · depan*, atau nama ruangan saja untuk device tanpa rak), **tugas maintenance aktif** berupa kartu dengan tombol menuju detail WO (atau teks *"Tidak ada tugas aktif"*), lalu bagian Detail, Port & kabel, Maintenance, dan Riwayat sebagai blok yang tertutup dan bisa dibuka dengan ketukan.

Referensi: US-DEV-04, US-DEV-05, US-IMP-01, US-QR-01, US-QR-02, US-AUD-01 AC4.

### Daftar kabel (`/inventaris/kabel`) dan form kabel (`/baru`, `/[id]/ubah`)
- Daftar: label, tipe, warna (lingkaran kecil berisi warna kabel dan namanya), ujung A (device · port), ujung B, panjang.
- Form: dua komponen pemilih port (8.5) untuk ujung A dan ujung B, lalu label, tipe kabel (Cat6, Fiber, DAC, Power), warna, panjang.
- Admin dapat menghapus kabel dari daftar atau form ubah.
- Referensi: US-CAB-01, US-CAB-02.

### Daftar work order (`/maintenance/work-order`)
- Kolom: judul, device, jenis (Preventif/Korektif), teknisi (atau *"Belum ditugaskan"*), jatuh tempo, status. WO terlambat menampilkan lencana merah "Terlambat" di samping lencana statusnya.
- Filter: status, jenis, teknisi, hanya yang terlambat.
- Admin: tombol "Buat WO korektif".
- Referensi: US-WO-05.

### Form work order (`/maintenance/work-order/baru`)
- Untuk WO korektif (WO preventif dibuat otomatis).
- Urutan kolom: device → **panel dampak** (8.2) langsung muncul di bawah kolom device setelah dipilih → deskripsi masalah → tanggal target → teknisi (sudah tersaring sesuai keahlian; daftarnya kosong sampai device dipilih) → checklist (opsional).
- Tombol utama: "Simpan work order". Panel dampak tidak menghalangi penyimpanan.
- Referensi: US-WO-02, US-WO-03, US-IMP-02.

### Tugas saya (`/tugas`) 📱
- Daftar WO milik teknisi yang login, dikelompokkan dengan judul kecil: **Terlambat**, **Hari ini**, **Minggu ini**, **Nanti**. Kelompok kosong tidak ditampilkan.
- Setiap WO berupa kartu: judul, nama device, lokasi singkat (*RK-A01 · U39*), jatuh tempo, lencana status. Ketuk kartu membuka detail WO.
- Bila tidak ada tugas: *"Tidak ada tugas. Tugas baru akan muncul di sini dan di notifikasi."*
- Referensi: US-WO-05 AC3.

### Detail work order (`/maintenance/work-order/[id]`) 📱
- Info: judul, jenis, device (tautan), lokasi, teknisi, jatuh tempo, lencana status (dan Terlambat bila berlaku). WO preventif menampilkan tautan ke rencananya.
- Panel dampak versi ringkas (judul dan jumlah, dapat dibuka untuk melihat daftar).
- Komponen checklist (8.3).
- **Tombol aksi menempel di bawah layar** (di HP, di atas bar navigasi): "Mulai pekerjaan" saat Terjadwal; "Selesaikan pekerjaan" saat Dikerjakan. Hanya tampil untuk teknisi yang ditugaskan dan Admin.
- Admin: Batalkan (dialog dengan alasan wajib, 6.3) dan ubah teknisi.
- WO Selesai menampilkan waktu selesai dan catatan hasil; WO Dibatalkan menampilkan alasannya.
- Referensi: US-WO-04.

### Rencana maintenance (`/maintenance/rencana`, `/baru`, `/[id]`, `/[id]/ubah`)
- Daftar: judul, device, interval (*setiap 3 bulan*), jatuh tempo berikutnya, teknisi default, status aktif/nonaktif.
- Form: judul, device, interval (angka + satuan hari/minggu/bulan), jatuh tempo pertama, teknisi default (tersaring sesuai keahlian), dan editor checklist (tambah item, hapus item, ubah urutan dengan tombol naik/turun).
- Detail: info rencana, daftar WO yang pernah dihasilkan, dan tombol Admin: Ubah, Nonaktifkan/Aktifkan, Hapus (ditolak dengan pesan BR-14 bila sudah punya riwayat WO).
- Referensi: US-MP-01.

### Kalender (`/maintenance/kalender`) (Should)
- Tampilan bulanan; setiap WO tampil sebagai label kecil di tanggal jatuh temponya dengan warna status. Klik label membuka detail WO. Tombol bulan sebelumnya/berikutnya.
- Referensi: US-CAL-01.

### Katalog
- **Manufacturer** dan **fungsi perangkat:** tabel + modal. Tabel fungsi perangkat menampilkan kategori (IT/Fasilitas) dan jumlah device yang memakainya.
- **Model:** tabel (manufacturer, nama, tinggi U, full-depth, daya). Detail model menampilkan spesifikasi dan tabel template port. Form model berisi spesifikasi dan **editor template port** (baris berisi nama, jenis, tipe konektor; tombol tambah dan hapus baris).
- Penghapusan yang ditolak menampilkan jumlah device yang masih memakai (US-CAT-01 AC2).
- Referensi: US-CAT-01, US-CAT-02.

### Pengguna (`/admin/pengguna`, `/baru`, `/[id]/ubah`)
- Tabel: nama, email, peran, keahlian (hanya untuk Teknisi), status aktif/nonaktif.
- Form: nama, email, password awal (hanya saat membuat), peran, keahlian (muncul hanya bila peran Teknisi). Tombol Nonaktifkan/Aktifkan.
- Referensi: US-AUTH-02.

### Audit log (`/admin/audit-log`)
- Tabel: waktu, pengguna, aksi (Buat/Ubah/Hapus), jenis objek, nama objek.
- Klik baris membuka panel samping berisi perbandingan data sebelum dan sesudah dalam dua kolom; baris kolom yang berubah disorot (sebelum berlatar merah pucat, sesudah hijau pucat).
- Filter: pengguna, jenis objek, rentang tanggal. Tidak ada tombol ubah atau hapus.
- Referensi: US-AUD-01.

### Pencarian (`/cari`) 📱 (tampilan sederhana)
- Kolom pencarian yang langsung aktif, hasil berupa daftar device (nama, asset tag, lokasi, lencana status) yang diperbarui saat mengetik.
- Di desktop, pencarian dilakukan dari kolom di header dengan hasil berupa dropdown di bawahnya; tekan Enter untuk membuka halaman ini.
- Referensi: US-SRCH-01.

### Notifikasi (`/notifikasi`)
- Daftar notifikasi terbaru di atas; yang belum dibaca memiliki titik `air` di kiri dan teks tebal. Klik notifikasi membuka WO terkait dan menandainya sudah dibaca. Tombol "Tandai semua sudah dibaca".
- Lonceng di header desktop membuka dropdown berisi 5 notifikasi terbaru dengan tautan "Lihat semua".
- Referensi: US-NOTIF-01.

### Cetak label (`/label/cetak`) (Should)
- Pratinjau lembar A4 berisi label QR (8.4) tersusun dalam grid 3 kolom × 8 baris (24 label per lembar), mengikuti ukuran umum kertas label A4 isi 24 (sekitar 63,5 × 33,9 mm per label). Bila lebih dari 24 device, lembar berikutnya ditambahkan.
- Tombol "Cetak" membuka dialog cetak browser. Tampilan cetak menyembunyikan sidebar, header, dan tombol.
- Referensi: US-QR-03.

### Akses ditolak dan halaman tidak ditemukan
- Judul singkat, satu kalimat penjelasan, dan tautan kembali ke halaman awal peran.

---

## 8. Komponen kunci

### 8.1 Elevation rak

```
 RK-A01 · 42U · 31U terpakai (74%)

         DEPAN                          BELAKANG
 U42 │                        │   │▌sw-tor-01      ● Aktif │
 U41 │  + Pasang di sini      │   │                        │
 U40 │▌srv-web-01             │   │▌░ srv-web-01 ░░░░░░░░░░ │
 U39 │▌       ◐ Maintenance   │   │▌░░░░░░░░░░░░░░░░░░░░░░ │
 U38 │▌srv-db-01      ● Aktif │   │▌░ srv-db-01 ░░░░░░░░░░░ │
 U37 │▌                       │   │▌░░░░░░░░░░░░░░░░░░░░░░ │
 ...
 U1  │                        │   │                        │

 Terpasang 0U:  pdu-a-01 ● Aktif   pdu-b-01 ● Aktif
```

**Deskripsi.** Komponen menampilkan satu rak sebagai **dua kolom berdampingan**: sisi **Depan** di kiri dan sisi **Belakang** di kanan, masing-masing diberi judul di atasnya. Di atas kedua kolom terdapat baris ringkasan: nama rak, tinggi, U terpakai, dan persentase utilisasi.

*Struktur kolom.* Setiap kolom adalah bingkai persegi panjang tegak berlatar `surface` dengan garis tepi `line` yang lebih tebal di kiri dan kanan (menyerupai tiang rak). Kolom dibagi menjadi slot horizontal setinggi 22 px per U, disusun dari **U tertinggi di atas hingga U1 di bawah**. Nomor U ditulis di luar bingkai sebelah kiri kolom depan, dengan angka tabular berwarna `ink-muted`, sejajar dengan slotnya. Garis tipis `line` memisahkan setiap slot.

*Blok device.* Device tampil sebagai blok yang menutupi slot-slot yang ditempatinya, setinggi jumlah U-nya (device 2U di posisi U39 menutupi U39 dan U40). Blok berisi isian pucat dan garis tepi kiri tebal sesuai warna fungsi perangkat (3.3). Di dalam blok, nama device ditulis di kiri atas (14 px, ketebalan 500), dan lencana status (3.2) di kanan. Pada blok 1U yang sempit, nama dan lencana berada dalam satu baris; bila nama terlalu panjang, nama dipotong dengan elipsis dan lencana diringkas menjadi ikon saja.

*Kedalaman.* Device **half-depth** hanya tampil di kolom sisi tempat ia dipasang. Device **full-depth** tampil di kedua kolom: di sisi pemasangan sebagai blok biasa, dan di sisi lainnya sebagai blok dengan pola arsiran garis miring tipis tanpa lencana, menandakan "bagian belakang dari device yang sama". Nama device tetap ditulis kecil di blok arsiran agar jelas pemiliknya.

*Slot kosong.* Slot yang tidak ditempati tampil polos. Untuk Admin, saat kursor berada di atas slot kosong, slot itu berlatar `air-soft` dengan teks "+ Pasang di sini" berwarna `air`; klik membuka form device dengan rak, sisi, dan posisi U sudah terisi. Untuk Teknisi dan Viewer, slot kosong tidak bereaksi.

*Interaksi blok.* Saat kursor berada di atas blok (atau saat blok diketuk sekali di HP), tampil kotak keterangan kecil berisi nama, model, asset tag, dan status. Klik blok (atau ketukan kedua di HP) membuka detail device.

*Perangkat 0U.* Di bawah kedua kolom terdapat baris "Terpasang 0U" berisi daftar device 0U sebagai label kecil dengan lencana status; klik membuka detail device.

*Ukuran.* Di desktop, setiap kolom selebar sekitar 280 px; rak 42U setinggi sekitar 924 px dan halaman di-scroll vertikal seperti biasa. Di HP, kedua kolom tetap berdampingan dengan lebar minimum 160 px per kolom; bila layar tidak cukup lebar, area elevation dapat digeser ke samping di dalam kotaknya sendiri.

*Versi mini* (dipakai di form device, tab Ringkasan, dan peta ruangan dashboard): hanya satu kolom (sisi yang relevan, atau gabungan untuk peta ruangan), slot setinggi 4-6 px, tanpa teks di dalam blok, hanya warna fungsi. Device yang sedang dibahas disorot dengan garis tepi `air`.

Referensi: US-RAK-02, US-DEV-02.

### 8.2 Panel dampak

```
┌─ ⚠ 6 perangkat terhubung ke sw-tor-01 ─────────────────┐
│ Data (4)                                                │
│   srv-web-01   eth0      ↔  sw-tor-01 port 1           │
│   srv-web-02   eth0      ↔  sw-tor-01 port 2           │
│   srv-db-01    eth0      ↔  sw-tor-01 port 3           │
│   core-sw-01   port 48   ↔  sw-tor-01 port 48          │
│ Daya (2)                                                │
│   pdu-a-01     outlet 7  ↔  sw-tor-01 PSU1             │
│   pdu-b-01     outlet 7  ↔  sw-tor-01 PSU2             │
└─────────────────────────────────────────────────────────┘
```

**Deskripsi.** Kotak dengan latar kuning-oranye sangat pucat dan garis tepi kiri tebal berwarna kuning-oranye (3.2). Baris judul berisi ikon peringatan dan kalimat *"[jumlah] perangkat terhubung ke [nama device]"*.

Isinya dua kelompok berurutan, **Data** lalu **Daya**, masing-masing dengan subjudul dan jumlahnya. Setiap baris berisi tiga bagian sejajar: nama perangkat yang terhubung (berupa tautan ke detail device), nama port di perangkat itu, simbol ↔, lalu nama port di device yang sedang dibahas. Daftar mencakup semua perangkat yang tersambung langsung lewat kabel, dari arah mana pun (satu lompatan, sesuai keputusan di intent).

Kelompok yang kosong tidak ditampilkan. Bila tidak ada perangkat terhubung sama sekali, panel berubah menjadi kotak abu-abu pucat tanpa ikon peringatan dengan teks *"Tidak ada perangkat terhubung."*

Panel bersifat informasi dan tidak menghalangi penyimpanan form.

*(Should, US-IMP-03)* Pada kelompok Daya, setiap perangkat yang menerima daya dari device yang dibahas diberi label kecil di ujung barisnya: **"Masih punya jalur daya cadangan"** (abu) bila perangkat itu masih tersambung ke sumber daya lain, atau **"Kehilangan seluruh daya"** (merah) bila tidak.

Referensi: US-IMP-01, US-IMP-02, US-IMP-03.

### 8.3 Checklist work order

```
 Checklist · 3 dari 5 selesai
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━──────────────────
 ☑ Periksa panel indikator, pastikan tidak ada alarm
 ☑ Ukur tegangan setiap blok baterai, catat hasilnya
 ☑ Periksa fisik baterai: tidak menggembung atau bocor
 ☐ Bersihkan debu pada ventilasi UPS
 ☐ Jalankan self-test UPS dan catat hasilnya

 Catatan hasil (wajib)
 ┌──────────────────────────────────────────────────┐
 │                                                  │
 └──────────────────────────────────────────────────┘

 [            Selesaikan pekerjaan            ]  (belum aktif)
```

**Deskripsi.** Bagian berjudul "Checklist" dengan keterangan kemajuan (*"3 dari 5 selesai"*) dan batang kemajuan tipis berwarna `air` di bawahnya. Di bawahnya daftar item, masing-masing satu baris berisi kotak centang di kiri dan teks item di kanan; seluruh baris dapat diketuk (bukan hanya kotaknya), dengan tinggi minimal 44 px di HP. Item yang sudah dicentang tetap terbaca jelas (tidak dicoret dan tidak dipudarkan) agar mudah ditinjau ulang.

Di bawah daftar terdapat kolom teks "Catatan hasil (wajib)" beberapa baris.

Tombol **"Selesaikan pekerjaan"** selebar kolom berada di bagian bawah (menempel di bawah layar pada HP). Tombol tampak pudar dan tidak bisa ditekan sampai semua item tercentang dan catatan hasil terisi; di bawahnya tertulis keterangan apa yang masih kurang (*"2 item belum dicentang"*).

*Aturan tampilan per kondisi:*
- WO **Terjadwal:** kotak centang tampil tetapi tidak dapat diubah; tombol bawah adalah "Mulai pekerjaan".
- WO **Dikerjakan:** kotak centang dapat diubah oleh teknisi yang ditugaskan dan Admin. Perubahan centang tersimpan langsung.
- WO **Selesai** atau **Dibatalkan:** checklist hanya dibaca, tanpa tombol.
- Pengguna lain (bukan teknisi yang ditugaskan, bukan Admin): checklist hanya dibaca, tanpa tombol.
- WO korektif **tanpa checklist:** bagian checklist tidak tampil; tombol Selesaikan aktif cukup dengan catatan hasil terisi.

Referensi: US-WO-04.

### 8.4 Label QR

```
┌──────────────────────────────┐
│ ▓▓▓▓▓▓▓▓    DCM-0001         │
│ ▓▓ QR ▓▓    srv-web-01       │
│ ▓▓▓▓▓▓▓▓    SIRAMA           │
└──────────────────────────────┘
```

**Deskripsi.** Label persegi panjang mendatar seukuran satu stiker (sekitar 63,5 × 33,9 mm), hitam putih tanpa warna agar jelas di printer apa pun. Sisi kiri berisi **QR code persegi** setinggi hampir seluruh label dengan margin putih di sekelilingnya. Sisi kanan berisi tiga baris teks rata kiri: **asset tag** paling besar dan tebal (agar tetap dapat dibaca manusia bila QR rusak), **nama device** lebih kecil, dan wordmark **SIRAMA** paling kecil di bawah. QR berisi tautan ke `/a/[asset-tag]`.

Label tunggal diunduh dari detail device sebagai gambar; label massal dicetak dari halaman cetak label (7).

Referensi: US-QR-01, US-QR-03.

### 8.5 Pemilih port

```
 Ujung A
 Device   [ srv-web-03                        ▾ ]
 Port     [ Pilih port                        ▾ ]
          ┌───────────────────────────────────┐
          │ eth0   data · RJ45                │
          │ eth1   data · RJ45                │
          │ 2 port disembunyikan karena sudah │
          │ tersambung (eth2, PSU1)           │
          └───────────────────────────────────┘
```

**Deskripsi.** Komponen terdiri dari dua kolom pilihan berurutan dengan judul "Ujung A" (atau "Ujung B").
1. **Device:** kolom pilihan dengan pencarian (mengetik menyaring daftar). Setiap pilihan menampilkan nama device dan lokasinya.
2. **Port:** aktif setelah device dipilih. Membuka daftar port device tersebut; setiap baris berisi nama port, lalu jenis dan tipe konektor dalam teks lebih kecil. **Hanya port yang belum tersambung yang ditampilkan.** Di bagian bawah daftar tertulis berapa port yang disembunyikan beserta namanya dan alasannya, agar pengguna tidak bingung mencari.

Setelah ujung A lengkap, pemilih **ujung B** menyaring lebih lanjut:
- device yang sama dengan ujung A tidak dapat dipilih;
- port yang ditampilkan hanya yang **jenisnya cocok** dengan port ujung A: data dengan data, power inlet dengan power outlet (dan sebaliknya). Keterangan di bawah daftar menyebut port yang disembunyikan karena jenisnya tidak cocok.

Bila ujung A diganti setelah ujung B terisi dan ujung B menjadi tidak cocok, pilihan ujung B dikosongkan dengan keterangan alasannya.

Referensi: US-CAB-01.

---

## 9. Alur pengguna

Alur langkah demi langkah untuk tugas-tugas penting digambarkan sebagai flowchart di [`docs/diagrams/flowchart.md`](../docs/diagrams/flowchart.md):

| Kode | Alur | Halaman yang dilalui |
|---|---|---|
| F1 | Login dan pengalihan per peran | Login → Dashboard / Tugas saya / detail device |
| F2 | Memasang device ke rak | Detail rak → form device → detail rak |
| F3 | Menyambung kabel | Form kabel → daftar kabel |
| F4 | Pembuatan WO otomatis (cron) | Tanpa halaman; hasilnya muncul di daftar WO, Tugas saya, notifikasi |
| F5 | Mengerjakan WO | Tugas saya → detail WO |
| F6 | Memindai QR | Kamera HP → (login) → detail device |

Diagram use case ada di [`docs/diagrams/`](../docs/diagrams/).

---

## 10. Halaman prioritas

Berdasarkan [naskah demo](../docs/demo-script.md), halaman berikut dipoles paling detail dan dibuat mockup lebih dulu: detail rak, dashboard, form work order, Tugas saya, detail work order, dan detail device versi HP.

---

## 11. Ditunda dan pertanyaan terbuka

**Ditunda ke Technical Spec:**
- Library komponen UI, ikon, autentikasi, dan QR.
- Struktur folder dan komponen di kode.
- Pembuatan skill `.claude/skills/ui-guidelines/` dari bagian 2, 3, dan 6 dokumen ini (awal tahap Build).

**Pertanyaan terbuka:**
- PRD Lampiran A menempatkan UPS dan CRAC di ruangan tanpa posisi rak, tetapi belum ada user story yang menyatakannya secara eksplisit. Desain ini sudah mendukungnya (form device bagian Penempatan). Usulan: tambahkan acceptance criteria di US-DEV-02 pada revisi PRD berikutnya.
- PRD hanya mengirim notifikasi kepada Teknisi. Apakah Admin juga perlu notifikasi, misalnya saat WO terlambat atau selesai? Bila ya, PRD perlu ditambah user story baru, dan lonceng serta halaman notifikasi dibuka untuk Admin.

---

## 12. Riwayat keputusan desain

| No | Keputusan | Pilihan |
|---|---|---|
| 1 | Struktur spec | Tiga file (prd, design, tech) + indeks `specs/README.md` |
| 2 | Mockup | Claude Design dari dokumen ini + sketsa ASCII berdeskripsi untuk komponen rumit |
| 3 | Navigasi | Sidebar desktop + bar bawah di HP |
| 4 | Pengelompokan menu | Berdasarkan tugas: Inventaris, Maintenance, Katalog, Administrasi |
| 5 | Elevation rak | Blok warna per fungsi + lencana status + slot kosong bisa diklik |
| 6 | Warna status | Warna + teks + ikon; Terjadwal memakai ungu-indigo agar tidak bentrok dengan warna merek |
| 7 | Arah visual | Terang dan bersih, aksen biru-teal "air"; mode gelap = Could |
| 8 | Pola form | Modal untuk data sederhana, halaman penuh untuk data kompleks |
| 9 | Impact analysis di form WO | Panel peringatan langsung di form |
| 10 | Pindai QR | Kamera bawaan HP; pemindai di aplikasi = Could |
| 11 | Diagram laporan | Mermaid (flowchart) + PlantUML (use case), disimpan di `docs/diagrams/` |
| 12 | Skill desain | Dokumen ini + skill `ui-guidelines` saat Build |
| 13 | Nama aplikasi | SIRAMA (Sistem Informasi Rak, Aset & Maintenance) |
| 14 | Halaman awal | Teknisi → Tugas saya; Admin dan Viewer → Dashboard |
| 15 | Detail device | Tab di desktop; versi ringkas di HP dengan lokasi dan tugas aktif di atas |
| 16 | Naskah demo | Disusun lebih awal agar data seed dan halaman prioritas mengikutinya; disimpan di `docs/demo-script.md` |

---

## 13. Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 5 Okt 2026 | Draft awal |
| 0.2 | 5 Okt 2026 | Flowchart, use case, naskah demo, dan brief Claude Design dipindah ke `docs/`. Semua sketsa ASCII diberi deskripsi tertulis. Hasil pemeriksaan silang: (1) tiga warna status tidak memenuhi kontras 4.5:1 yang diklaim, diganti (hijau, kuning-oranye, abu) dan rasio kontras dicantumkan; (2) "Tugas saya" dan notifikasi dibatasi untuk Teknisi agar sesuai PRD; bar bawah HP dibedakan per peran; (3) menu "profil" dihapus karena tidak ada di PRD; (4) sitemap dilengkapi halaman ubah, form model dan pengguna, serta halaman pencarian; (5) form device ditambah aturan status Maintenance, perangkat 0U, penempatan hanya untuk status Aktif/Maintenance, dan device di ruangan tanpa rak (sesuai PRD Lampiran A); (6) aksi hapus device, rencana, dan katalog disesuaikan dengan BR-14; (7) label "(uplink)" di panel dampak dihapus karena tidak ada di model data; (8) format nomor U di sketsa diseragamkan (U1, bukan U01); (9) ditambah cakupan dokumen, breadcrumb, aturan checklist per status, dan pertanyaan terbuka soal notifikasi Admin |