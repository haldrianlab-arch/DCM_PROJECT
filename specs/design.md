# Design Spec: SIRAMA

**SIRAMA** (Sistem Informasi Rak, Aset & Maintenance)

| | |
|---|---|
| Versi | 0.3 (direvisi setelah review) |
| Tanggal | 8 Oktober 2026 |
| Sumber | [`intent/asset-maintenance.md`](../intent/asset-maintenance.md), [`specs/PRD.md`](PRD.md) v0.3 |
| Tahap SDLC | Design |
| Dipakai oleh | Claude Design (mockup), Claude Code (build), tahap Test (acuan visual) |

---

## 1. Cara membaca dokumen ini

### 1.1 Penanda rujukan

| Penanda | Arti | Contoh |
|---|---|---|
| `§n` atau `§n.m` | Bagian di dokumen ini | §6.2 = bagian 6.2 Form |
| `TPL-nn` | Template halaman atau modal (§7) | TPL-01 Halaman daftar |
| `KOM-nn` | Komponen antarmuka (§8) | KOM-32 Elevation rack |
| `HAL-nn` | Halaman (punya URL) (§9) | HAL-07 Detail rack |
| `MOD-nn` | Modal, dialog, atau panel (tidak punya URL) (§10) | MOD-03 Modal rack |
| `US-`, `BR-`, `NFR-` | Kode user story, aturan bisnis, dan kebutuhan non-fungsional di PRD | US-DEV-02 |
| `PRD Lampiran C` | Daftar field per entitas di PRD, satu-satunya acuan field | |
| `F1`-`F6` | Flowchart di [`docs/diagrams/flowchart.md`](../docs/diagrams/flowchart.md) | F2 |

### 1.2 Wajib dan bebas

Dokumen ini tidak memakai sketsa. Setiap halaman dan komponen dijelaskan dengan kata-kata, dan untuk komponen penting dipisah menjadi:
- **Wajib:** aturan yang harus diikuti persis, biasanya karena menyangkut aturan domain (misalnya nomor U disusun dari bawah ke atas) atau aturan PRD.
- **Bebas:** hal yang sengaja diserahkan ke kreativitas desainer (Claude Design), selama tetap mengikuti identitas visual (§4) dan pola umum (§6).

Untuk halaman dan komponen yang tidak menyebut bagian "Bebas", semua hal yang **tidak disebut** dianggap bebas.

### 1.3 Penamaan

Mengikuti konvensi PRD §2.1: **nama entitas memakai bahasa Inggris** (Site, Room, Rack, Device, Device function, Manufacturer, Model, Port, Port template, Cable, Maintenance plan, Work order, User), **selebihnya bahasa Indonesia** (kalimat, label field, tombol, pesan, nilai status, dan nama halaman yang bukan entitas seperti Dashboard, Tugas saya, Notifikasi, Kalender, Lokasi).

---

## 2. Cakupan

Dokumen ini menjelaskan **bagaimana user mengalami SIRAMA**: identitas visual, struktur navigasi, pola antarmuka, komponen, halaman, dan modal. Field setiap form diambil dari PRD Lampiran C; dokumen ini menjelaskan cara menampilkannya.

**Dirancang:** semua fitur Must dan Should di PRD.
**Belum dirancang:** fitur Could (PRD §6). Dirancang bila jadi dikerjakan.
**Bukan isi dokumen ini:** cara membangun (library, struktur kode, validasi di server). Itu bagian Technical Spec.

**Dokumen terkait:**
- Flowchart dan diagram use case: [`docs/diagrams/`](../docs/diagrams/)
- Naskah demo: [`docs/demo-script.md`](../docs/demo-script.md)
- Brief dan prompt Claude Design: [`docs/claude-design-brief.md`](../docs/claude-design-brief.md)

---

## 3. Prinsip desain

1. **Rack adalah pusatnya.** Elevation rack adalah elemen paling khas dan paling dipoles. Bagian lain dibuat tenang dan disiplin agar rack menonjol.
2. **Sekali lihat, langsung paham.** Jenis device, kondisinya, dan sisa ruang terbaca tanpa membuka detail.
3. **Cegah kesalahan sebelum terjadi.** Mengikuti prinsip usability *error prevention*: lebih baik mencegah kesalahan daripada menampilkan pesan error yang bagus. Caranya: pilihan yang tidak sah tidak ditampilkan (port yang sudah tersambung, teknisi yang keahliannya tidak cocok, status Maintenance); akibat sebuah aksi diperlihatkan sebelum aksi dijalankan (pratinjau posisi di rack, panel dampak, dialog yang menyebut dampak); bila tetap ada kesalahan, pesannya muncul di kolom yang salah beserta cara memperbaikinya.
4. **Mudah dipakai teknisi di ruang server.** Teknisi sering membuka SIRAMA sambil berdiri di depan rack: HP di satu tangan, tangan lain memegang cable atau alat, ruangan bising dan dingin. Halaman yang dipakai dalam kondisi ini (detail device hasil pindai QR, Tugas saya, detail WO) harus punya tombol besar, aksi utama di bagian bawah layar agar terjangkau jempol, sesedikit mungkin mengetik, dan informasi terpenting di bagian atas.
5. **Status tidak pernah hanya warna.** Setiap warna status selalu disertai teks dan ikon, agar tetap terbaca oleh user dengan buta warna.
6. **Konsisten.** Satu komponen berperilaku sama di semua halaman, dan satu aksi memakai satu nama di tombol, judul dialog, dan pesan berhasil.

---

## 4. Identitas visual

### 4.1 Warna dasar

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

### 4.2 Warna status

Lencana status (KOM-12) berwarna pekat dengan teks putih dan ikon. Semua warna di bawah memiliki kontras minimal 4.5:1 dengan teks putih.

| Warna | Hex | Kontras | Dipakai untuk |
|---|---|---|---|
| Hijau | `#1A7F50` | 5.0:1 | Device **Aktif**, WO **Selesai** |
| Kuning-oranye | `#9A5B00` | 5.4:1 | Device **Maintenance**, WO **Dikerjakan**, **Garansi segera habis** |
| Ungu-indigo | `#5B4FC4` | 6.3:1 | WO **Terjadwal** |
| Abu | `#5F6E77` | 5.3:1 | Device **Stok**, WO **Dibatalkan** |
| Abu tua | `#3D4950` | 9.3:1 | Device **Pensiun** |
| Merah | `#C2382F` | 5.4:1 | WO **Terlambat**, **Garansi habis**, pesan error |

Ungu-indigo dipilih untuk Terjadwal agar tidak tertukar dengan warna merek `air` yang menandai elemen bisa diklik.

### 4.3 Warna device function (khusus elevation rack dan peta room)

Blok device di elevation memakai **isian pucat dengan garis tepi kiri tebal (4 px)** sesuai device function-nya, sehingga tidak tertukar dengan lencana status yang pekat. Teks `ink` di atas semua isian ini memiliki kontras di atas 13:1.

| Device function | Isian | Garis kiri |
|---|---|---|
| Server | `#E4EEF7` | `#3B6E9E` |
| Switch, router, firewall | `#F4ECDD` | `#9A6A1F` |
| Storage | `#E6F2EC` | `#2F7A57` |
| Patch panel | `#EEEEF0` | `#6E6E78` |
| PDU, UPS (daya) | `#F7E6E3` | `#A4483C` |
| Lainnya | `#EDEFF1` | `#5A6B74` |

Device function dibuat Admin di Katalog, sehingga daftarnya bisa bertambah. Pemetaan warna di atas ditentukan dari nama device function bawaan data seed; device function baru yang tidak cocok dengan baris mana pun memakai warna "Lainnya".

### 4.4 Tipografi

- **Satu keluarga huruf: IBM Plex Sans** (lisensi terbuka, tersedia di Google Fonts). Bernuansa teknik dan jelas di ukuran kecil.
- **Angka tabular** untuk nomor U, asset tag, nomor WO, serial number, tanggal, dan angka di tabel, agar digit sejajar vertikal.
- Skala ukuran: 13 px (keterangan), 14 px (isi tabel), 16 px (teks utama), 20 px (judul bagian), 28 px (judul halaman).
- Ketebalan: 400 untuk teks, 500 untuk label dan isi tabel yang ditekankan, 600 untuk judul.
- Huruf kapital hanya di awal kalimat (*sentence case*), termasuk label dan tombol, kecuali nama entitas dan singkatan (Device, WO, PDU). Tidak memakai label huruf kapital semua.
- Panjang baris paragraf maksimal sekitar 75 karakter.

### 4.5 Ikon

- **Tidak ada emoji di antarmuka.**
- Semua ikon berasal dari **satu pustaka ikon garis open source: Lucide**. Ukuran 16 px di dalam teks dan tombol kecil, 20 px di navigasi. Ketebalan garis seragam.
- Hanya logo (§4.7) yang digambar khusus.
- Ikon status (nama Lucide; diverifikasi saat build karena nama ikon bisa berubah antarversi):

| Status | Ikon |
|---|---|
| Aktif, Selesai | `circle-check` |
| Maintenance, Dikerjakan | `wrench` |
| Terjadwal | `calendar-clock` |
| Stok | `package` |
| Pensiun | `archive` |
| Dibatalkan | `circle-slash` |
| Terlambat, Garansi habis | `triangle-alert` |
| Garansi segera habis | `clock` |

- Ikon menu dan aksi dipilih bebas dari pustaka yang sama, dengan syarat satu makna selalu memakai ikon yang sama di seluruh aplikasi.

### 4.6 Bentuk, kepadatan, dan gerak

- Sudut membulat 4 px untuk tombol dan input, 6 px untuk kartu dan modal. Blok di elevation rack bersudut 2 px agar terlihat seperti perangkat sungguhan.
- Tinggi baris tabel 44 px di desktop.
- Bayangan hanya untuk elemen yang melayang di atas halaman (modal, dropdown, toast, panel samping). Kartu biasa memakai garis tepi `line`, bukan bayangan.
- Animasi hanya sebagai respons aksi user (modal terbuka, panel dampak muncul, status berubah), berdurasi 150-200 ms. Tidak ada animasi dekoratif saat halaman dimuat. Bila user mengaktifkan "kurangi gerakan" di perangkatnya, animasi dimatikan.

### 4.7 Logo

Wordmark "SIRAMA" dalam IBM Plex Sans tebal berwarna `air`, didampingi simbol sederhana: tiga garis horizontal bertumpuk (melambangkan rack) yang dibingkai bentuk tetesan air. Versi kecil (hanya simbol) dipakai sebagai favicon dan di sidebar yang diciutkan. **Bebas:** bentuk detail simbol, selama tetap sederhana dan terbaca di ukuran 16 px.

---

## 5. Struktur dan navigasi

### 5.1 Sitemap

URL memakai bahasa Inggris karena merupakan identitas teknis, sama seperti kode dokumen.

| URL | Halaman | Peran |
|---|---|---|
| `/login` | HAL-01 Login | Semua (belum login) |
| `/` | Dialihkan ke halaman awal peran (§5.3) | Semua |
| `/dashboard` | HAL-02 Dashboard | Semua |
| `/my-tasks` | HAL-03 Tugas saya | Teknisi |
| `/search` | HAL-04 Pencarian | Semua |
| `/notifications` | HAL-05 Notifikasi | Admin, Teknisi |
| `/locations` | HAL-06 Lokasi (site, room, rack) | Semua |
| `/racks/[id]` | HAL-07 Detail rack | Semua |
| `/devices` | HAL-08 Daftar device | Semua |
| `/devices/new` | HAL-09 Form device (tambah) | Admin |
| `/devices/[id]` | HAL-10 Detail device | Semua |
| `/devices/[id]/edit` | HAL-09 Form device (ubah) | Admin |
| `/cables` | HAL-11 Daftar cable | Semua |
| `/cables/new` | HAL-12 Form cable (tambah) | Admin |
| `/cables/[id]/edit` | HAL-12 Form cable (ubah) | Admin |
| `/work-orders` | HAL-13 Daftar work order | Semua |
| `/work-orders/new` | HAL-14 Form work order korektif | Admin |
| `/work-orders/[id]` | HAL-15 Detail work order | Semua |
| `/maintenance-plans` | HAL-16 Daftar maintenance plan | Semua |
| `/maintenance-plans/new` | HAL-17 Form maintenance plan (tambah) | Admin |
| `/maintenance-plans/[id]` | HAL-18 Detail maintenance plan | Semua |
| `/maintenance-plans/[id]/edit` | HAL-17 Form maintenance plan (ubah) | Admin |
| `/calendar` | HAL-19 Kalender (Should) | Semua |
| `/manufacturers` | HAL-20 Daftar manufacturer | Semua |
| `/device-functions` | HAL-21 Daftar device function | Semua |
| `/models` | HAL-22 Daftar model | Semua |
| `/models/new` | HAL-23 Form model (tambah) | Admin |
| `/models/[id]` | HAL-24 Detail model | Semua |
| `/models/[id]/edit` | HAL-23 Form model (ubah) | Admin |
| `/users` | HAL-25 Daftar user | Admin |
| `/users/new` | HAL-26 Form user (tambah) | Admin |
| `/users/[id]/edit` | HAL-26 Form user (ubah) | Admin |
| `/audit-log` | HAL-27 Audit log | Admin |
| `/labels/print` | HAL-28 Cetak label (Should) | Admin |
| `/a/[asset-tag]` | Tujuan QR; dialihkan ke HAL-10 device tersebut | Semua |
| — | HAL-29 Akses ditolak, HAL-30 Tidak ditemukan | Semua |

Site, room, rack, manufacturer, dan device function **tidak punya halaman form**; tambah dan ubah memakai modal (§10). Halaman yang tidak boleh dibuka sebuah peran menampilkan HAL-29.

### 5.2 Halaman awal per peran

| Peran | Setelah login |
|---|---|
| Admin, Viewer | HAL-02 Dashboard |
| Teknisi | HAL-03 Tugas saya |

Bila login dipicu oleh pemindaian QR, user dikembalikan ke detail device yang dipindai (US-QR-02 AC2).

### 5.3 Desktop: sidebar dan header

**Tata letak.** Dua kolom: sidebar (KOM-26) di kiri selebar 240 px, berlatar `surface` dengan garis tepi kanan `line`, menempel saat halaman di-scroll; kolom kanan berisi header (KOM-27) di atas dan isi halaman di bawahnya, berlatar `canvas`.

**Isi sidebar dari atas ke bawah:**
1. Logo SIRAMA.
2. **Dashboard**, lalu **Tugas saya** (hanya Teknisi). Keduanya menu tunggal, bukan grup.
3. Grup **Inventaris**: Lokasi, Device, Cable.
4. Grup **Maintenance**: Work order, Maintenance plan, Kalender (Should).
5. Grup **Katalog**: Manufacturer, Model, Device function.
6. Grup **Administrasi**: User, Audit log. Hanya tampil untuk Admin.

**Perilaku grup:** semua grup **tertutup secara bawaan**, kecuali grup yang berisi halaman yang sedang dibuka, yang otomatis terbuka. Pilihan buka/tutup terakhir user diingat di browser tersebut. Nama grup bisa diklik untuk membuka/menutup, dengan ikon panah yang berputar sesuai keadaan.

**Menu aktif:** latar `air-soft`, teks `air`, dan garis tebal `air` di sisi kiri. Setiap menu memiliki ikon di kiri teksnya. Sidebar dapat diciutkan menjadi 64 px (hanya ikon); nama menu muncul sebagai keterangan saat ikon disorot.

**Header** setinggi 56 px, dari kiri ke kanan: pencarian global (KOM-31), lonceng notifikasi (KOM-30; Admin dan Teknisi), dan menu user berisi nama, peran, dan pilihan "Keluar".

Di bawah header: breadcrumb (§5.5), lalu isi halaman.

### 5.4 HP: header ringkas dan bar navigasi bawah

Pada layar selebar 768 px atau kurang, sidebar disembunyikan.

**Header ringkas** setinggi 52 px: tombol menu di kiri dan logo di sebelahnya. Tombol menu membuka MOD-10 (menu lengkap) yang meluncur dari kiri.

**Bar navigasi bawah** (KOM-28) setinggi 60 px, selalu terlihat, berisi tombol berikon dengan label di bawahnya:

| Peran | Tombol (kiri ke kanan) |
|---|---|
| Teknisi | Tugas, Dashboard, Cari, Notifikasi |
| Admin | Dashboard, Work order, Cari, Notifikasi |
| Viewer | Dashboard, Cari |

Tombol aktif berwarna `air`, lainnya `ink-muted`. Tombol Notifikasi menampilkan angka belum dibaca di sudut ikon. Tombol Cari membuka HAL-04 dengan kolom pencarian langsung aktif. Bar memperhitungkan area aman layar (notch dan garis navigasi sistem HP); isi halaman diberi ruang di bawah agar tidak tertutup bar.

### 5.5 Breadcrumb

Setiap halaman selain Dashboard dan Tugas saya menampilkan jejak lokasi di bawah header (KOM-29), misalnya *Inventaris / Lokasi / RK-A01*. Setiap bagian kecuali yang terakhir dapat diklik. Di HP, breadcrumb diringkas menjadi satu tautan kembali ke halaman induk.

---

## 6. Pola antarmuka umum

### 6.1 Tabel daftar

- Pagination 25 baris per halaman dengan keterangan total (*"Menampilkan 1-25 dari 87 device"*).
- Di atas tabel: kolom pencarian dan tombol filter. Filter yang aktif tampil sebagai chip (KOM-13) yang dapat dihapus satu per satu.
- Kolom status memakai lencana (KOM-12).
- Klik baris membuka halaman detail. Aksi per baris (ubah, hapus, lepas) ada di menu baris (ikon titik tiga) di ujung kanan, hanya untuk peran yang berhak.
- Di HP, tabel dapat digeser ke samping di dalam kotaknya sendiri; halaman tidak ikut bergeser. Kolom pertama tetap menempel di kiri saat digeser.

### 6.2 Form

| Jenis data | Pola |
|---|---|
| Sederhana (1-3 field): site, room, rack, manufacturer, device function | Modal (TPL-04). Di HP tampil layar penuh |
| Kompleks: device, model + port template, cable, maintenance plan, work order, user | Halaman penuh (TPL-03) |

- **Satu form untuk tambah dan ubah.** Setiap entitas punya satu form (modal atau halaman) dengan dua mode. Mode tambah berjudul "Tambah [entitas]" dengan kolom kosong (atau terisi sebagian, lihat "pintu masuk" di §9); mode ubah berjudul "Ubah [entitas]" dengan kolom terisi data yang ada. Field, aturan, dan tata letaknya sama.
- **Field mengikuti PRD Lampiran C**, termasuk sifat wajib/opsional. Field yang diisi sistem tidak tampil sebagai input; bila perlu ditampilkan (misalnya asset tag pada mode ubah), tampil sebagai teks tetap.
- Label di atas kolom input. Kolom opsional ditandai "(opsional)" setelah label; kolom tanpa tanda berarti wajib. Pilihan ini dibuat karena sebagian besar field wajib.
- Pesan validasi tampil di bawah kolom yang salah, berwarna merah dengan ikon, berisi penyebab dan solusi. Contoh: *"Posisi U10-U11 bertabrakan dengan sw-tor-01. Pilih posisi lain."*
- Pilihan yang tidak sah tidak ditampilkan (prinsip 3); di bawah daftar pilihan ditulis berapa pilihan yang disembunyikan dan alasannya, agar user tidak bingung mencari.
- Tombol utama berwarna `air` dan menyebut aksinya: "Simpan device", "Simpan work order". Tombol "Batal" bergaya garis tepi. Di halaman form, tombol ada di bawah form; di HP menempel di bawah layar.
- Meninggalkan form yang sudah diubah tanpa menyimpan memunculkan konfirmasi "Buang perubahan?".

### 6.3 Aksi berbahaya

Aksi yang mengubah atau menghapus banyak hal sekaligus memakai dialog konfirmasi (MOD-06) yang **menyebutkan dampaknya dengan angka konkret**. Tombol konfirmasi berwarna merah dan memakai kata kerja yang sama dengan judulnya.

Aksi yang **ditolak** aturan (misalnya menghapus device yang punya riwayat WO, BR-14) tidak menampilkan dialog konfirmasi, melainkan MOD-06 varian informasi: penjelasan alasan dan langkah yang bisa dilakukan, dengan satu tombol "Mengerti".

### 6.4 Kondisi halaman

| Kondisi | Tampilan |
|---|---|
| Memuat | Kerangka abu-abu berbentuk seperti konten yang akan muncul (KOM-16), bukan ikon berputar di tengah layar |
| Kosong | KOM-25: kalimat singkat yang menjelaskan keadaan + tombol aksi pertama (hanya untuk peran yang berhak). Contoh: *"Belum ada rack di room ini."* [Tambah rack] |
| Database masih kosong | Dashboard menampilkan langkah awal berurutan: tambah site → room → rack → katalog → device |
| Error | Penyebab dan langkah perbaikan, tanpa permintaan maaf |
| Berhasil | Toast (KOM-22) di pojok kanan bawah (di HP: di atas bar bawah), hilang sendiri setelah 4 detik, memakai kata kerja yang sama dengan tombolnya: "Simpan device" → *"Device tersimpan"* |

### 6.5 Format

- Tanggal: *5 Okt 2026*. Tanggal dan jam: *5 Okt 2026, 07.00 WIB*.
- Tanggal relatif hanya untuk notifikasi: *"3 jam lalu"*.
- Nomor U tanpa nol di depan: *U1*, *U12*, rentang *U12-U13*.
- Lokasi singkat device: *RK-A01 · U39-U40* (di rack), *RK-A01 · 0U* (0U), *Ruang Server Gedung A · tanpa rack* (tanpa rack), *—* (Stok/Pensiun).
- Nomor WO dan asset tag selalu ditulis lengkap (*WO-0012*, *DCM-0001*).

### 6.6 Teks antarmuka

- Bahasa Indonesia formal dan ringkas, mengikuti penamaan §1.3.
- Menyebut hal dari sudut pandang user: "Jadwal otomatis", bukan "cron".
- Satu aksi memakai satu nama di seluruh alur (tombol, judul dialog, toast).

### 6.7 Aksesibilitas dasar

- Kontras teks minimal 4.5:1 terhadap latarnya (sudah diperiksa untuk semua warna di §4).
- Semua aksi bisa dilakukan dengan keyboard; fokus ditandai garis `air` 2 px di sekeliling elemen.
- Setiap tombol yang hanya berupa ikon memiliki keterangan untuk pembaca layar.
- Area sentuh di HP minimal 44 × 44 px.

---

## 7. Template

Template adalah kerangka halaman atau modal yang dipakai berulang. Halaman yang memakai template cukup menyebut isi yang berbeda.

### TPL-01 Halaman daftar
**Susunan:** breadcrumb; baris judul (judul halaman di kiri, tombol utama seperti "Tambah device" di kanan, hanya untuk peran yang berhak); bar cari dan filter (KOM-18); tabel data (KOM-19) dengan pagination; KOM-25 bila kosong.
**Dipakai:** HAL-08, 11, 13, 16, 20, 21, 22, 25, 27.

### TPL-02 Halaman detail
**Susunan:** breadcrumb; header detail berisi judul (nama objek), identitas (kode seperti asset tag atau nomor WO), lencana status, dan tombol aksi di kanan (aksi berbahaya dikumpulkan di menu titik tiga); isi berupa tab (KOM-20) di desktop atau blok buka-tutup (KOM-21) di HP, atau seksi berurutan bila isinya sedikit.
**Dipakai:** HAL-07, 10, 15, 18, 24.

### TPL-03 Halaman form
**Susunan:** breadcrumb; judul "Tambah [entitas]" atau "Ubah [entitas]"; form satu kolom (lebar maksimal sekitar 720 px) yang dibagi menjadi bagian berjudul; tombol "Simpan [entitas]" dan "Batal" di bawah. Dua mode (§6.2).
**Dipakai:** HAL-09, 12, 14, 17, 23, 26.

### TPL-04 Modal form
**Susunan:** modal (KOM-23) dengan judul "Tambah [entitas]" atau "Ubah [entitas]", field di tengah, tombol "Simpan" dan "Batal" di kanan bawah. Di HP tampil layar penuh. Dua mode (§6.2).
**Dipakai:** MOD-01 s.d. MOD-05, MOD-07, MOD-08.

### TPL-05 Dialog konfirmasi
**Susunan:** modal kecil dengan judul berupa pertanyaan yang menyebut nama objek (*"Pensiunkan srv-web-01?"*), satu paragraf dampak dengan angka konkret, tombol "Batal" dan tombol konfirmasi merah. Varian informasi: tanpa tombol merah, hanya "Mengerti".
**Dipakai:** MOD-06.

### TPL-06 Halaman pesan
**Susunan:** di tengah halaman: ikon, judul singkat, satu kalimat penjelasan, tautan kembali ke halaman awal peran.
**Dipakai:** HAL-29, HAL-30.

---

## 8. Komponen

### 8.1 Keadaan standar komponen interaktif

Semua komponen yang bisa diklik atau diisi punya keadaan berikut, dan tampilannya konsisten di seluruh aplikasi:

| Keadaan | Tampilan |
|---|---|
| Normal | Tampilan dasar |
| Disorot | Sedikit lebih gelap atau berlatar `air-soft` (desktop saja) |
| Fokus | Garis `air` 2 px di sekeliling |
| Ditekan | Sedikit lebih gelap dari disorot |
| Nonaktif | Pudar (opasitas sekitar 50%), kursor tidak berubah menjadi tangan, disertai keterangan alasan bila tidak jelas |
| Error (input) | Garis tepi merah dan pesan di bawahnya |
| Memproses (tombol) | Ikon berputar kecil di dalam tombol, teks tetap, tombol tidak bisa ditekan lagi |

### 8.2 Komponen dasar

| ID | Komponen | Fungsi | Varian | Catatan |
|---|---|---|---|---|
| KOM-01 | Tombol | Menjalankan aksi | Utama (`air`), sekunder (garis tepi), bahaya (merah), teks saja | Satu tombol utama per area |
| KOM-02 | Tombol ikon | Aksi ringkas (menu titik tiga, tutup, buka menu HP) | — | Wajib punya keterangan untuk pembaca layar |
| KOM-03 | Input teks | Teks satu baris | Biasa, email, password (dengan tombol tampilkan/sembunyikan) | |
| KOM-04 | Area teks | Teks beberapa baris | — | Deskripsi masalah, catatan hasil, alasan pembatalan |
| KOM-05 | Input angka | Angka dengan satuan di dalam kolom | — | Tinggi rack (U), panjang cable (m), daya (W), interval |
| KOM-06 | Pilihan dengan pencarian | Memilih satu dari daftar panjang; mengetik menyaring daftar | Satu pilihan | Device, model, room, rack, teknisi. Setiap pilihan boleh punya keterangan kecil (misalnya lokasi device) |
| KOM-07 | Pemilih tanggal | Memilih tanggal | — | Format §6.5 |
| KOM-08 | Kotak centang | Ya/tidak, atau memilih banyak baris | — | Full-depth, item checklist, pilih baris tabel |
| KOM-09 | Pilihan tersegmen | Memilih satu dari 2-4 pilihan yang selalu terlihat | — | Sisi rack (Depan/Belakang), kategori (IT/Fasilitas), peran, keahlian, jenis port |
| KOM-10 | Tautan | Pindah halaman | Biasa, di dalam teks | Warna `air` |
| KOM-11 | Ikon | Lihat §4.5 | — | |
| KOM-12 | Lencana status | Menunjukkan status | Satu per nilai status (§4.2), versi ringkas (ikon saja, untuk ruang sempit) | Selalu warna + ikon + teks; versi ringkas wajib punya keterangan saat disorot |
| KOM-13 | Chip | Menandai filter aktif | Dengan tombol hapus | |
| KOM-14 | Keterangan (tooltip) | Info singkat saat disorot atau diketuk | — | |
| KOM-15 | Batang kemajuan | Menunjukkan proporsi | Utilisasi rack, kemajuan checklist | |
| KOM-16 | Kerangka memuat | Tampilan sementara saat data dimuat | Baris tabel, kartu, teks | |

### 8.3 Komponen gabungan

| ID | Komponen | Fungsi | Dipakai di |
|---|---|---|---|
| KOM-17 | Field form | Label + input + teks bantuan + pesan error dalam satu kesatuan | Semua form |
| KOM-18 | Bar cari dan filter | Kolom cari, tombol filter yang membuka daftar filter, dan chip filter aktif | TPL-01 |
| KOM-19 | Tabel data | Tabel dengan kepala kolom, baris yang bisa diklik, menu baris, kotak centang (opsional), dan pagination | TPL-01, beberapa tab detail |
| KOM-20 | Tab | Berpindah antarbagian di satu halaman tanpa pindah URL | TPL-02 di desktop |
| KOM-21 | Blok buka-tutup | Bagian yang bisa dibuka-tutup dengan ketukan | TPL-02 di HP, grup sidebar |
| KOM-22 | Toast | Pesan berhasil singkat (§6.4) | Setelah simpan, hapus, lepas |
| KOM-23 | Modal | Jendela di atas halaman dengan latar gelap transparan; tutup dengan tombol tutup, Esc, atau klik di luar (kecuali form yang sudah diubah) | TPL-04, TPL-05 |
| KOM-24 | Panel samping | Panel yang meluncur dari kanan (desktop) atau dari bawah (HP) untuk detail tambahan tanpa meninggalkan halaman | MOD-09 |
| KOM-25 | Keadaan kosong | Kalimat penjelasan + tombol aksi pertama | Semua daftar |
| KOM-26 | Sidebar | Navigasi desktop (§5.3) | Semua halaman setelah login |
| KOM-27 | Header | Pencarian, lonceng, menu user (§5.3) | Semua halaman setelah login |
| KOM-28 | Bar navigasi bawah | Navigasi HP (§5.4) | Semua halaman setelah login di HP |
| KOM-29 | Breadcrumb | Jejak lokasi halaman (§5.5) | Semua halaman kecuali Dashboard dan Tugas saya |
| KOM-30 | Lonceng notifikasi | Ikon lonceng dengan angka belum dibaca; diklik membuka daftar 5 notifikasi terbaru dan tautan "Lihat semua" | Header (Admin, Teknisi) |
| KOM-31 | Pencarian global | Kolom cari device di header; hasil muncul sebagai daftar di bawah kolom saat mengetik (nama, asset tag, lokasi singkat, lencana status); Enter membuka HAL-04 | Header |

### 8.4 Komponen khusus SIRAMA

#### KOM-32 Elevation rack

Menampilkan isi satu rack seperti tampak fisiknya. Dipakai di HAL-07.

**Wajib**
- Dua kolom berdampingan: **Depan di kiri, Belakang di kanan**, masing-masing berjudul.
- Baris ringkasan di atas: nama rack, tinggi, U terpakai, U kosong, persentase utilisasi.
- Setiap kolom dibagi menjadi slot setinggi 22 px per U, disusun dari **U tertinggi di atas sampai U1 di bawah**. Nomor U (angka tabular, `ink-muted`) di sebelah kiri kolom Depan, sejajar slotnya.
- Device tampil sebagai blok yang menutupi semua slot yang ditempatinya (device 2U di posisi U39 menutupi U39 dan U40). Blok memakai warna device function (§4.3), berisi nama device dan lencana status.
- Device **half-depth** hanya tampil di kolom sisinya. Device **full-depth** tampil di kedua kolom: di sisi pemasangan sebagai blok biasa, di sisi lain sebagai blok berarsir garis miring tipis tanpa lencana, dengan nama ditulis kecil, menandakan bagian belakang device yang sama.
- Slot kosong untuk **Admin**: saat disorot berlatar `air-soft` dengan teks "+ Pasang di sini"; diklik membuka HAL-09 dengan room, rack, sisi, dan posisi terisi. Untuk Teknisi dan Viewer slot kosong tidak bereaksi.
- Menyorot atau mengetuk sekali sebuah blok menampilkan keterangan (nama, model, asset tag, status). Klik (atau ketukan kedua di HP) membuka HAL-10.
- Di bawah kedua kolom: baris "Terpasang 0U" berisi device 0U sebagai label kecil dengan lencana status.
- Di HP kedua kolom tetap berdampingan (minimal 160 px per kolom); bila tidak muat, area elevation digeser ke samping di dalam kotaknya sendiri.

**Bebas:** gaya bingkai yang menyerupai tiang rack, cara menampilkan nama yang terlalu panjang di blok 1U, tampilan baris ringkasan.

Referensi: US-RAK-02, US-DEV-02.

#### KOM-33 Elevation mini

Versi kecil elevation untuk menunjukkan posisi. Dipakai di HAL-09 (pratinjau), HAL-10 (tab Ringkasan), dan KOM-34.

**Wajib**
- Satu kolom (sisi yang relevan), slot setinggi 4-6 px, tanpa teks di dalam blok, hanya warna device function.
- Device yang sedang dibahas disorot dengan garis tepi `air`.
- **Mode pratinjau** (di form device): slot yang akan ditempati disorot `air` bila kosong; merah bila bertabrakan atau melebihi tinggi rack, disertai teks di bawahnya yang menyebut device yang bertabrakan atau alasannya. Pratinjau diperbarui setiap kali rack, sisi, posisi, atau model berubah.

#### KOM-34 Peta room

Ringkasan seluruh rack dalam satu pandangan. Dipakai di HAL-02.

**Wajib**
- Setiap room menjadi satu baris berjudul nama room.
- Di dalamnya deretan kolom vertikal sempit, satu per rack, masing-masing berupa elevation mini (gabungan sisi depan dan belakang), dengan nama rack dan persentase utilisasi di bawahnya. Klik kolom membuka HAL-07.
- Di bawah deretan rack: baris "Tanpa rack" berisi device tanpa rack di room itu sebagai label kecil dengan lencana status (misalnya ups-01, crac-01). Klik membuka HAL-10. Baris ini tidak tampil bila kosong.
- Di HP baris rack dapat digeser ke samping.

**Bebas:** jarak antarkolom, cara menampilkan banyak room.

#### KOM-35 Pohon lokasi

Struktur site → room → rack dalam satu halaman. Dipakai di HAL-06.

**Wajib**
- Setiap site adalah blok buka-tutup berjudul nama site dengan jumlah room. Di dalamnya, setiap room adalah blok buka-tutup berjudul nama room dengan jumlah rack dan jumlah device tanpa rack. Bawaan: semua terbuka.
- Di dalam room: tabel rack (nama, tinggi, U terpakai, utilisasi dengan batang kemajuan); klik baris membuka HAL-07. Di bawah tabel: baris "Tanpa rack" seperti KOM-34.
- Untuk Admin: baris site punya tombol "+ Tambah room" (membuka MOD-02 dengan site terisi); baris room punya tombol "+ Tambah rack" (membuka MOD-03 dengan room terisi); setiap baris site, room, dan rack punya menu titik tiga berisi Ubah dan Hapus.
- Site tanpa room menampilkan *"Belum ada room"*; room tanpa rack menampilkan *"Belum ada rack"*, masing-masing dengan tombol tambah untuk Admin.

#### KOM-36 Panel dampak

Menunjukkan device yang terhubung langsung ke sebuah device. Dipakai di HAL-14 (setelah device dipilih), HAL-15 (ringkas), dan HAL-10 tab Port & cable.

**Wajib**
- Kotak berlatar kuning-oranye sangat pucat dengan garis tepi kiri tebal kuning-oranye, ikon peringatan, dan judul *"[jumlah] device terhubung ke [nama device]"*.
- Dua kelompok berurutan, **Data** lalu **Daya**, masing-masing berjudul dengan jumlahnya. Kelompok kosong tidak ditampilkan.
- Setiap baris: nama device terhubung (tautan ke HAL-10), port di device itu, simbol penghubung, lalu port di device yang dibahas.
- Mencakup semua cable dari arah mana pun (satu lompatan).
- Bila tidak ada device terhubung: kotak abu-abu pucat tanpa ikon peringatan, teks *"Tidak ada device terhubung."*
- Panel hanya informasi; tidak menghalangi penyimpanan form.
- Versi ringkas (HAL-15): hanya judul dan jumlah; diklik membuka daftar lengkap.
- *(Should, US-IMP-03)* Di kelompok Daya, setiap device yang menerima daya diberi label di ujung baris: "Masih punya jalur daya cadangan" (abu) atau "Kehilangan seluruh daya" (merah).

Referensi: US-IMP-01, US-IMP-02, US-IMP-03.

#### KOM-37 Checklist pengerjaan

Dipakai teknisi untuk mengerjakan WO. Dipakai di HAL-15.

**Wajib**
- Judul "Checklist" dengan keterangan kemajuan (*"3 dari 5 selesai"*) dan batang kemajuan (KOM-15).
- Setiap item satu baris: kotak centang dan teks. Seluruh baris dapat diketuk, tinggi minimal 44 px di HP. Item yang sudah dicentang tetap terbaca jelas (tidak dicoret, tidak dipudarkan).
- Centang tersimpan langsung setiap kali diubah.
- Di bawahnya kolom "Catatan hasil" (area teks), lalu tombol "Selesaikan pekerjaan".
- Tombol Selesaikan nonaktif sampai semua item tercentang dan catatan hasil terisi; di bawahnya tertulis apa yang masih kurang (*"2 item belum dicentang"*).
- Aturan per kondisi:

| Kondisi WO | Tampilan |
|---|---|
| Terjadwal | Kotak centang tampil tapi terkunci; catatan hasil belum tampil; tombol bawah "Mulai pekerjaan" (nonaktif bila belum ada teknisi) |
| Dikerjakan, dibuka teknisi yang ditugaskan atau Admin | Kotak centang aktif; catatan hasil dan tombol Selesaikan tampil |
| Dikerjakan, dibuka user lain | Hanya dibaca, tanpa tombol |
| Selesai | Hanya dibaca; catatan hasil dan waktu selesai tampil |
| Dibatalkan | Hanya dibaca; alasan pembatalan tampil |
| WO korektif tanpa checklist | Bagian checklist tidak tampil; tombol Selesaikan aktif cukup dengan catatan hasil terisi |

Referensi: US-WO-04.

#### KOM-38 Editor checklist

Menyusun daftar item checklist di form. Dipakai di HAL-14 dan HAL-17.

**Wajib:** daftar item berupa kolom teks satu baris; tombol "Tambah item" di bawah; setiap item punya tombol hapus dan tombol naik/turun untuk mengubah urutan. Di HAL-17 minimal satu item (PRD Lampiran C); di HAL-14 boleh kosong.

#### KOM-39 Editor port template

Menyusun port template sebuah model. Dipakai di HAL-23.

**Wajib:** tabel yang bisa diedit; setiap baris berisi nama, jenis (KOM-09: Data, Power inlet, Power outlet), dan tipe konektor (opsional), serta tombol hapus baris. Tombol "Tambah port" di bawah. Nama ganda dalam satu model ditandai error di barisnya.

#### KOM-40 Pemilih port

Memilih satu ujung cable. Dipakai di HAL-12 (dua kali: Ujung A dan Ujung B).

**Wajib**
- Berjudul "Ujung A" atau "Ujung B", berisi dua kolom berurutan: **Device** (KOM-06, setiap pilihan menampilkan lokasi singkat) lalu **Port** (aktif setelah device dipilih; setiap pilihan menampilkan nama port, jenis, dan tipe konektor).
- Hanya port yang **belum tersambung** yang ditampilkan.
- Untuk Ujung B: device yang sama dengan Ujung A tidak dapat dipilih, dan hanya port yang **jenisnya cocok** dengan port Ujung A yang ditampilkan (data dengan data, power inlet dengan power outlet).
- Di bawah daftar port tertulis jumlah port yang disembunyikan, namanya, dan alasannya (sudah tersambung atau jenis tidak cocok).
- Bila Ujung A diganti dan Ujung B menjadi tidak cocok, Ujung B dikosongkan dengan keterangan alasannya.

Referensi: US-CAB-01.

#### KOM-41 Label QR

Label stiker untuk ditempel di device. Dipakai di HAL-10 (unduh) dan HAL-28 (cetak).

**Wajib**
- Persegi panjang mendatar sekitar 63,5 × 33,9 mm, **hitam putih** agar jelas di printer apa pun.
- Kiri: QR code persegi setinggi hampir seluruh label, dengan margin putih. QR berisi tautan `/a/[asset-tag]`.
- Kanan, rata kiri dari atas: **asset tag** (paling besar dan tebal, agar tetap terbaca manusia bila QR rusak), nama device (lebih kecil), wordmark SIRAMA (paling kecil).

#### KOM-42 Kartu WO

Ringkasan satu WO dalam bentuk kartu. Dipakai di HAL-03 dan HAL-10 versi HP.

**Wajib:** nomor WO dan judul; nama device dan lokasi singkat; tenggat; lencana status (dan lencana Terlambat bila berlaku); jenis (Preventif/Korektif) sebagai teks kecil. Seluruh kartu dapat diketuk untuk membuka HAL-15.

#### KOM-43 Kartu lokasi

Menampilkan lokasi device dengan teks besar, untuk dibaca cepat di depan rack. Dipakai di HAL-10 versi HP.

**Wajib:** lokasi singkat (§6.5) dengan ukuran 20 px, diikuti site dan room dalam teks kecil, serta tautan ke HAL-07 bila device ada di rack.

#### KOM-44 Info asal WO

Menjelaskan dari mana sebuah WO berasal. Dipakai di HAL-15.

**Wajib**
- WO preventif: *"Dibuat dari maintenance plan: [judul] (setiap [interval])"*, dengan judul sebagai tautan ke HAL-18; di bawahnya *"Dibuat oleh: Sistem (jadwal otomatis), [waktu]"*.
- WO korektif: *"Dibuat oleh: [nama Admin], [waktu]"*.

#### KOM-45 Perbandingan audit

Menunjukkan perubahan data. Dipakai di MOD-09.

**Wajib:** dua kolom, "Sebelum" dan "Sesudah", berisi daftar field dan nilainya. Field yang berubah disorot (sebelum berlatar merah pucat, sesudah hijau pucat) dan diletakkan paling atas. Untuk aksi Buat, kolom Sebelum kosong; untuk Hapus, kolom Sesudah kosong.

#### KOM-46 Kalender bulanan (Should)

Dipakai di HAL-19. **Wajib:** grid bulan; setiap WO tampil sebagai label kecil di tanggal tenggatnya dengan nomor WO dan warna status; klik label membuka HAL-15; tombol bulan sebelumnya/berikutnya dan "Hari ini". Bila satu tanggal punya lebih dari 3 WO, tampil "+n lainnya" yang membuka daftar.

---

## 9. Halaman

Format setiap halaman: URL, template, peran yang boleh membuka, pintu masuk (dari mana halaman dibuka, bila ada isian awal), isi, aksi, dan referensi. Tanda 📱 = dioptimalkan untuk HP (NFR-02); halaman lain cukup tidak rusak di HP.

### HAL-01 Login 📱
- **URL:** `/login`. **Template:** khusus. **Peran:** belum login.
- **Isi:** kartu di tengah layar berisi logo, kolom email, kolom password (dengan tombol tampilkan/sembunyikan), tombol "Masuk". Tidak ada tautan daftar atau lupa password.
- **Perilaku:** login gagal (salah kredensial atau akun nonaktif) menampilkan pesan yang sama: *"Email atau password salah."* Login berhasil menuju halaman awal peran (§5.2).
- **Referensi:** US-AUTH-01.

### HAL-02 Dashboard 📱
- **URL:** `/dashboard`. **Template:** khusus. **Peran:** semua.
- **Isi desktop, dari atas:**
  1. **Ringkasan device per status:** satu baris lencana dengan jumlah (*Aktif 18 · Maintenance 1 · Stok 2 · Pensiun 1*). Setiap lencana membuka HAL-08 terfilter.
  2. **Peta room** (KOM-34), lebar penuh.
  3. Dua kolom berdampingan: **Perlu perhatian** (WO terlambat, lalu WO dengan tenggat 7 hari ke depan; maksimal 8 item, tautan "Lihat semua" ke HAL-13 terfilter) dan **Garansi** (device dengan garansi habis atau habis dalam 30 hari; maksimal 8 item).
- **Isi HP:** Perlu perhatian, ringkasan status, peta room (digeser ke samping), Garansi.
- **Database kosong:** langkah awal (§6.4) menggantikan seluruh isi.
- **Referensi:** US-DASH-01.

### HAL-03 Tugas saya 📱
- **URL:** `/my-tasks`. **Template:** khusus. **Peran:** Teknisi.
- **Isi:** WO milik teknisi yang login dan belum Selesai/Dibatalkan, sebagai kartu (KOM-42), dikelompokkan dengan judul kecil: **Terlambat**, **Hari ini**, **7 hari ke depan**, **Nanti**, berdasarkan tenggat. Kelompok kosong tidak ditampilkan; urutan dalam kelompok dari tenggat terdekat.
- **Kosong:** *"Tidak ada tugas. Tugas baru akan muncul di sini dan di notifikasi."*
- **Referensi:** US-WO-05 AC3.

### HAL-04 Pencarian 📱
- **URL:** `/search`. **Template:** khusus. **Peran:** semua.
- **Isi:** kolom pencarian yang langsung aktif; hasil berupa daftar device (nama, asset tag, lokasi singkat, lencana status) yang diperbarui saat mengetik. Mencari pada nama, asset tag, dan serial number.
- **Pintu masuk:** tombol Cari di bar bawah HP; Enter pada pencarian global desktop.
- **Referensi:** US-SRCH-01.

### HAL-05 Notifikasi
- **URL:** `/notifications`. **Template:** khusus. **Peran:** Admin, Teknisi.
- **Isi:** daftar notifikasi milik user, terbaru di atas. Notifikasi belum dibaca ditandai titik `air` di kiri dan teks tebal. Setiap notifikasi berisi ikon jenis, kalimat, dan waktu relatif.
- **Jenis notifikasi:**

| Penerima | Jenis | Kalimat |
|---|---|---|
| Teknisi | Penugasan | *"WO-0012 ditugaskan kepada Anda: Cek baterai UPS-01"* |
| Teknisi | Pengingat tenggat | *"Tenggat WO-0012 tinggal 3 hari (11 Okt 2026)"* |
| Admin | WO tanpa teknisi | *"WO-0013 belum punya teknisi: Bersihkan filter CRAC-01"* |
| Admin | WO terlambat | *"WO-0010 terlambat sejak 6 Okt 2026"* |

- **Aksi:** klik notifikasi membuka HAL-15 dan menandainya sudah dibaca; untuk jenis "WO tanpa teknisi", HAL-15 langsung membuka MOD-08. Tombol "Tandai semua sudah dibaca".
- **Referensi:** US-NOTIF-01, 02, 03.

### HAL-06 Lokasi
- **URL:** `/locations`. **Template:** khusus. **Peran:** semua.
- **Isi:** baris judul dengan tombol Admin "Tambah site", "Tambah room", "Tambah rack"; lalu pohon lokasi (KOM-35).
- **Alur menambah dan mengubah (Admin):**

| Tujuan | Dari mana | Hasil |
|---|---|---|
| Site baru | Tombol "Tambah site" | MOD-01 kosong |
| Room di site tertentu | Tombol "+ Tambah room" di baris site | MOD-02 dengan site terisi |
| Room (umum) | Tombol "Tambah room" | MOD-02, site dipilih manual |
| Rack di room tertentu | Tombol "+ Tambah rack" di baris room | MOD-03 dengan room terisi, tinggi 42 |
| Rack (umum) | Tombol "Tambah rack" | MOD-03, room dipilih manual |
| Ubah site/room/rack | Menu titik tiga di baris → Ubah | Modal yang sama dalam mode ubah; induk (site/room) boleh diganti |
| Hapus | Menu titik tiga di baris → Hapus | MOD-06: konfirmasi bila kosong, atau varian informasi bila masih berisi (menyebut jumlah isinya) |

- Isian induk yang terisi otomatis tetap bisa diganti. Tombol "Tambah room" nonaktif bila belum ada site, dengan keterangan *"Tambahkan site terlebih dahulu"*; begitu pula "Tambah rack" bila belum ada room.
- Setelah rack dibuat, toast menyertakan tautan "Buka rack" ke HAL-07.
- **Referensi:** US-LOC-01, US-RAK-01.

### HAL-07 Detail rack
- **URL:** `/racks/[id]`. **Template:** TPL-02 (tanpa tab). **Peran:** semua.
- **Isi:** judul nama rack; lokasi (site / room) sebagai tautan; elevation rack (KOM-32).
- **Aksi Admin:** Ubah (MOD-03), Hapus (MOD-06), dan *(Should)* "Cetak label semua device" (HAL-28 dengan device di rack ini terpilih).
- **Referensi:** US-RAK-01, US-RAK-02, US-DEV-02, US-QR-03.

### HAL-08 Daftar device
- **URL:** `/devices`. **Template:** TPL-01. **Peran:** semua.
- **Kolom:** nama, asset tag, device function, model, lokasi singkat (§6.5), status, akhir garansi (berwarna kuning-oranye atau merah sesuai §4.2; kosong bila tidak diisi).
- **Filter:** status, device function, room, rack (termasuk pilihan "Tanpa rack"), garansi (segera habis, habis).
- **Aksi Admin:** "Tambah device" (HAL-09 kosong); *(Should)* centang baris lalu "Cetak label" (HAL-28).
- **Referensi:** US-DEV-01, US-SRCH-01, US-QR-03.

### HAL-09 Form device
- **URL:** `/devices/new` (tambah), `/devices/[id]/edit` (ubah). **Template:** TPL-03. **Peran:** Admin.
- **Pintu masuk:**

| Dari | Isian awal |
|---|---|
| HAL-08 "Tambah device" | Kosong; status bawaan Aktif |
| Slot kosong KOM-32 | Status Aktif; room, rack, sisi, dan posisi U sesuai slot yang diklik |
| HAL-10 "Ubah" | Data device (mode ubah) |

- **Bagian 1, Identitas:** nama; model (KOM-06; terkunci pada mode ubah dengan keterangan *"Model tidak dapat diubah karena port sudah terbentuk"*); device function; serial number (opsional); status (KOM-09: Stok, Aktif, Pensiun). Pada mode ubah, asset tag tampil sebagai teks tetap di bawah judul. Bila device berstatus Maintenance, status tampil sebagai teks tetap *"Maintenance (diatur oleh work order)"* dan tidak bisa diubah.
- **Bagian 2, Penempatan** (hanya tampil bila status Aktif atau Maintenance): room (KOM-06); rack (opsional, KOM-06, hanya rack di room terpilih; pilihan paling atas *"Tanpa rack (berdiri di lantai room)"*); sisi (KOM-09) dan posisi U (KOM-06 berisi U1 sampai tinggi rack), keduanya hanya tampil bila rack dipilih dan model bukan 0U. Bila model 0U dan rack dipilih, tampil keterangan *"Device 0U dipasang tanpa posisi U."* Di samping kolom (di HP: di bawahnya) tampil KOM-33 mode pratinjau.
- **Bagian 3, Pembelian & garansi:** tanggal beli, vendor, akhir garansi, semuanya opsional, dengan teks bantuan *"Boleh dikosongkan bila data pembelian tidak tersedia."*
- **Saat menyimpan:**
  - Mengubah status dari Aktif ke Stok atau Pensiun memunculkan MOD-06 (varian pindah status) sebelum disimpan.
  - Tabrakan atau melebihi tinggi rack sudah terlihat di pratinjau; bila tetap disimpan, pesan muncul di kolom posisi.
- **Tombol:** "Simpan device", "Batal".
- **Referensi:** US-DEV-01, 02, 03; PRD Lampiran C (Device).

### HAL-10 Detail device 📱
- **URL:** `/devices/[id]` (juga tujuan `/a/[asset-tag]`). **Template:** TPL-02. **Peran:** semua.
- **Header:** nama device, asset tag, lencana status, penanda garansi bila berlaku. Aksi Admin: Ubah (HAL-09), Unduh label (KOM-41 sebagai gambar), Buat WO korektif (HAL-14 dengan device terisi), dan di menu titik tiga: Pindah ke stok, Pensiunkan (keduanya MOD-06), Hapus (MOD-06 konfirmasi bila belum ada riwayat WO, atau varian informasi bila sudah). Aksi pindah status nonaktif bila device berstatus Maintenance.
- **Tab desktop:**

| Tab | Isi |
|---|---|
| Ringkasan | Lokasi lengkap (site, room, rack, U, sisi) dengan KOM-33 bila di rack; model, device function, serial number; tanggal beli, vendor, akhir garansi; QR code |
| Port & cable | Tabel port: nama, jenis, tipe konektor, tersambung ke (device · port, tautan), label cable. Aksi Admin per baris: port kosong → "Sambungkan" (HAL-12 dengan Ujung A terisi); port tersambung → menu titik tiga berisi "Ubah cable" (HAL-12) dan "Lepas cable" (MOD-06). Di bawah tabel: KOM-36 |
| Maintenance | WO terbuka (KOM-42), maintenance plan aktif (judul, interval, tenggat berikutnya), riwayat WO (nomor, judul, jenis, teknisi, tenggat, status). Aksi Admin: "Tambah maintenance plan" (HAL-17 dengan device terisi) |
| Riwayat | Audit log khusus device ini (waktu, pelaku, aksi); klik baris membuka MOD-09 |

- **HP (tanpa tab), dari atas:** header; KOM-43 kartu lokasi; **tugas aktif** (KOM-42 untuk setiap WO terbuka, atau *"Tidak ada tugas aktif"*); lalu blok buka-tutup tertutup: Detail, Port & cable, Maintenance, Riwayat.
- **Referensi:** US-DEV-04, 05, US-IMP-01, US-QR-01, 02, US-AUD-01 AC4.

### HAL-11 Daftar cable
- **URL:** `/cables`. **Template:** TPL-01. **Peran:** semua.
- **Kolom:** label, tipe, warna (lingkaran kecil berisi warnanya dan nama warna), Ujung A (device · port), Ujung B, panjang.
- **Filter:** tipe, device.
- **Aksi Admin:** "Tambah cable" (HAL-12 kosong); per baris di menu titik tiga: "Ubah" (HAL-12) dan "Lepas cable" (MOD-06).
- **Referensi:** US-CAB-01, 02.

### HAL-12 Form cable
- **URL:** `/cables/new`, `/cables/[id]/edit`. **Template:** TPL-03. **Peran:** Admin.
- **Pintu masuk:** HAL-11 "Tambah cable" (kosong); HAL-10 "Sambungkan" (Ujung A terisi); "Ubah" (mode ubah).
- **Bagian 1, Sambungan:** KOM-40 Ujung A, lalu KOM-40 Ujung B. Pada mode ubah, port yang sedang dipakai cable ini ikut ditampilkan sebagai pilihan.
- **Bagian 2, Atribut:** label; tipe (KOM-09: Cat6, Fiber, DAC, Power; bila kedua ujung port daya, pilihan otomatis Power); warna (opsional); panjang (opsional, meter).
- **Tidak ada aksi lepas di form ini;** melepas cable dilakukan dari HAL-10 atau HAL-11.
- **Tombol:** "Simpan cable", "Batal".
- **Referensi:** US-CAB-01, 02; PRD Lampiran C (Cable).

### HAL-13 Daftar work order
- **URL:** `/work-orders`. **Template:** TPL-01. **Peran:** semua.
- **Kolom:** nomor WO, judul, device, jenis, teknisi (atau *"Belum ada teknisi"* dalam teks miring), tenggat, status (ditambah lencana Terlambat bila berlaku).
- **Pencarian:** nomor WO, judul, nama device.
- **Filter:** status, jenis, teknisi (termasuk "Belum ada teknisi"), hanya yang terlambat.
- **Aksi Admin:** "Buat WO korektif" (HAL-14).
- **Referensi:** US-WO-05, US-WO-06 AC4.

### HAL-14 Form work order korektif
- **URL:** `/work-orders/new`. **Template:** TPL-03 (hanya mode tambah). **Peran:** Admin.
- **Keterangan di bawah judul:** *"WO preventif dibuat otomatis dari maintenance plan."* dengan tautan ke HAL-16.
- **Pintu masuk:** HAL-13 (kosong); HAL-10 "Buat WO korektif" (device terisi).
- **Urutan field:** judul; device (KOM-06, hanya device Aktif atau Maintenance); **KOM-36 panel dampak** langsung muncul di bawah kolom device setelah dipilih; deskripsi masalah; tenggat; teknisi (opsional, KOM-06, nonaktif sampai device dipilih, lalu hanya berisi teknisi aktif dengan keahlian cocok); checklist (opsional, KOM-38).
- **Tombol:** "Simpan work order", "Batal". Setelah disimpan menuju HAL-15 dengan toast yang menyebut nomor WO baru.
- **Referensi:** US-WO-02, 03, US-IMP-02; PRD Lampiran C (Work order).

### HAL-15 Detail work order 📱
- **URL:** `/work-orders/[id]`. **Template:** TPL-02 (seksi berurutan, tanpa tab). **Peran:** semua.
- **Header:** nomor WO, judul, lencana status (dan Terlambat bila berlaku), jenis.
- **Isi, dari atas:**
  1. **Info:** device (tautan) dan lokasi singkat, teknisi, tenggat, deskripsi masalah (korektif).
  2. **Belum ada teknisi:** bila teknisi kosong, tampil pemberitahuan *"WO ini belum punya teknisi dan belum dapat dimulai."* dengan tombol Admin "Tugaskan teknisi" (MOD-08).
  3. KOM-36 versi ringkas.
  4. KOM-37 checklist pengerjaan.
  5. KOM-44 info asal WO.
- **Tombol aksi utama** ("Mulai pekerjaan" atau "Selesaikan pekerjaan", dari KOM-37) menempel di bawah layar di HP (di atas bar navigasi). Hanya tampil untuk teknisi yang ditugaskan dan Admin.
- **Aksi Admin di header:** "Ganti teknisi" (MOD-08; untuk Terjadwal dan Dikerjakan), "Batalkan" (MOD-07; untuk Terjadwal dan Dikerjakan).
- **Referensi:** US-WO-03, 04, 06.

### HAL-16 Daftar maintenance plan
- **URL:** `/maintenance-plans`. **Template:** TPL-01. **Peran:** semua.
- **Kolom:** judul, device, interval (*setiap 3 bulan*), tenggat berikutnya, teknisi bawaan, status (Aktif/Nonaktif sebagai teks dengan ikon, bukan lencana status device).
- **Filter:** aktif/nonaktif, device.
- **Aksi Admin:** "Tambah maintenance plan" (HAL-17).
- **Referensi:** US-MP-01.

### HAL-17 Form maintenance plan
- **URL:** `/maintenance-plans/new`, `/maintenance-plans/[id]/edit`. **Template:** TPL-03. **Peran:** Admin.
- **Pintu masuk:** HAL-16 (kosong); HAL-10 tab Maintenance (device terisi); "Ubah" dari HAL-18.
- **Field:** judul; device (hanya device Aktif atau Maintenance); interval (KOM-05 angka + KOM-09 satuan: Hari, Minggu, Bulan); tenggat (label *"Tenggat pertama"* pada mode tambah, *"Tenggat berikutnya"* pada mode ubah); teknisi bawaan (opsional, tersaring sesuai keahlian setelah device dipilih); checklist (KOM-38, minimal satu item).
- **Teks bantuan di bawah tenggat:** *"WO preventif dibuat otomatis 3 hari sebelum tenggat."*
- **Tombol:** "Simpan maintenance plan", "Batal".
- **Referensi:** US-MP-01; PRD Lampiran C (Maintenance plan).

### HAL-18 Detail maintenance plan
- **URL:** `/maintenance-plans/[id]`. **Template:** TPL-02 (seksi berurutan). **Peran:** semua.
- **Isi:** judul, status aktif/nonaktif, device (tautan), interval, tenggat berikutnya, teknisi bawaan, daftar item checklist; lalu tabel WO yang pernah dihasilkan (nomor, tenggat, teknisi, status).
- **Aksi Admin:** Ubah (HAL-17), Nonaktifkan atau Aktifkan (MOD-06), Hapus (MOD-06; varian informasi bila sudah punya riwayat WO).
- **Referensi:** US-MP-01.

### HAL-19 Kalender (Should)
- **URL:** `/calendar`. **Template:** khusus. **Peran:** semua.
- **Isi:** KOM-46, dengan filter teknisi dan jenis.
- **Referensi:** US-CAL-01.

### HAL-20 Daftar manufacturer
- **URL:** `/manufacturers`. **Template:** TPL-01. **Peran:** semua.
- **Kolom:** nama, jumlah model.
- **Aksi Admin:** "Tambah manufacturer" (MOD-04); per baris: Ubah (MOD-04), Hapus (MOD-06).
- **Referensi:** US-CAT-01.

### HAL-21 Daftar device function
- **URL:** `/device-functions`. **Template:** TPL-01. **Peran:** semua.
- **Kolom:** nama, kategori (IT/Fasilitas), contoh warna elevation (§4.3), jumlah device.
- **Aksi Admin:** "Tambah device function" (MOD-05); per baris: Ubah (MOD-05), Hapus (MOD-06).
- **Referensi:** US-CAT-01.

### HAL-22 Daftar model
- **URL:** `/models`. **Template:** TPL-01. **Peran:** semua.
- **Kolom:** manufacturer, nama, tinggi (U), full-depth, daya maksimum, jumlah port, jumlah device.
- **Filter:** manufacturer.
- **Aksi Admin:** "Tambah model" (HAL-23).
- **Referensi:** US-CAT-02.

### HAL-23 Form model
- **URL:** `/models/new`, `/models/[id]/edit`. **Template:** TPL-03. **Peran:** Admin.
- **Bagian 1, Spesifikasi:** manufacturer; nama; tinggi (KOM-05, U; 0 untuk device 0U); full-depth (KOM-08; disembunyikan bila tinggi 0); daya maksimum (opsional, watt).
- **Bagian 2, Port template:** KOM-39.
- **Pada mode ubah, bila model sudah dipakai device:** pemberitahuan di atas bagian 2: *"Perubahan port template hanya berlaku untuk device yang dibuat setelah ini. [n] device yang sudah ada tidak berubah."*
- **Tombol:** "Simpan model", "Batal".
- **Referensi:** US-CAT-02; PRD Lampiran C (Model, Port template).

### HAL-24 Detail model
- **URL:** `/models/[id]`. **Template:** TPL-02 (seksi berurutan). **Peran:** semua.
- **Isi:** spesifikasi; tabel port template; daftar device yang memakai model ini (tautan).
- **Aksi Admin:** Ubah (HAL-23), Hapus (MOD-06).
- **Referensi:** US-CAT-02.

### HAL-25 Daftar user
- **URL:** `/users`. **Template:** TPL-01. **Peran:** Admin.
- **Kolom:** nama, email, peran, keahlian (hanya untuk Teknisi), status (Aktif/Nonaktif).
- **Filter:** peran, status.
- **Aksi:** "Tambah user" (HAL-26); per baris: Ubah (HAL-26), Nonaktifkan atau Aktifkan (MOD-06).
- **Referensi:** US-AUTH-02.

### HAL-26 Form user
- **URL:** `/users/new`, `/users/[id]/edit`. **Template:** TPL-03. **Peran:** Admin.
- **Field:** nama; email; password awal (hanya mode tambah); peran (KOM-09: Admin, Teknisi, Viewer); keahlian (KOM-09: IT, Fasilitas, Keduanya; hanya tampil bila peran Teknisi).
- **Tombol:** "Simpan user", "Batal".
- **Referensi:** US-AUTH-02; PRD Lampiran C (User).

### HAL-27 Audit log
- **URL:** `/audit-log`. **Template:** TPL-01 (tanpa tombol tambah). **Peran:** Admin.
- **Kolom:** waktu, pelaku (nama user atau "Sistem"), aksi (Buat, Ubah, Hapus), jenis objek, nama objek.
- **Filter:** pelaku, jenis objek, rentang tanggal.
- **Aksi:** klik baris membuka MOD-09. Tidak ada aksi ubah atau hapus.
- **Referensi:** US-AUD-01.

### HAL-28 Cetak label (Should)
- **URL:** `/labels/print`. **Template:** khusus. **Peran:** Admin.
- **Pintu masuk:** HAL-08 (device yang dicentang), HAL-07 (semua device di rack).
- **Isi:** pratinjau lembar A4 berisi KOM-41 dalam grid 3 kolom × 8 baris (24 label per lembar, ukuran umum kertas label A4 isi 24). Lebih dari 24 device menambah lembar.
- **Aksi:** "Cetak" membuka dialog cetak browser. Tampilan cetak menyembunyikan sidebar, header, dan tombol.
- **Referensi:** US-QR-03.

### HAL-29 Akses ditolak
- **Template:** TPL-06. Judul *"Akses ditolak"*, penjelasan *"Halaman ini tidak tersedia untuk peran Anda."*

### HAL-30 Tidak ditemukan
- **Template:** TPL-06. Judul *"Halaman tidak ditemukan"*. Juga dipakai bila asset tag dari QR tidak ditemukan, dengan penjelasan *"Asset tag [kode] tidak terdaftar."*

---

## 10. Modal, dialog, dan panel

### MOD-01 Site
- **Template:** TPL-04. **Dibuka dari:** HAL-06.
- **Field:** nama.

### MOD-02 Room
- **Template:** TPL-04. **Dibuka dari:** HAL-06 (tombol umum atau baris site).
- **Field:** nama; site (KOM-06; terisi bila dibuka dari baris site).

### MOD-03 Rack
- **Template:** TPL-04. **Dibuka dari:** HAL-06 (tombol umum atau baris room), HAL-07 (Ubah).
- **Field:** nama; room (KOM-06; terisi bila dibuka dari baris room); tinggi (KOM-05, bawaan 42U).
- **Validasi tampilan:** pada mode ubah, mengecilkan tinggi di bawah U tertinggi yang terpakai menampilkan pesan di kolom tinggi: *"Rack ini berisi device sampai U40. Tinggi minimal 40U."*

### MOD-04 Manufacturer
- **Template:** TPL-04. **Dibuka dari:** HAL-20.
- **Field:** nama.

### MOD-05 Device function
- **Template:** TPL-04. **Dibuka dari:** HAL-21.
- **Field:** nama; kategori (KOM-09: IT, Fasilitas), dengan teks bantuan *"Menentukan teknisi yang dapat ditugaskan."*

### MOD-06 Dialog konfirmasi
- **Template:** TPL-05. Satu komponen dengan varian berikut. Angka dalam kalimat diisi dari data nyata.

| Varian | Judul | Isi dampak | Tombol |
|---|---|---|---|
| Pensiunkan / pindah ke stok device | *"Pensiunkan srv-web-01?"* / *"Pindahkan srv-web-01 ke stok?"* | Penempatan dikosongkan (sebut rack dan U), n cable dilepas, n maintenance plan dinonaktifkan, n WO Terjadwal dibatalkan (sebut nomornya) | Pensiunkan / Pindahkan ke stok |
| Hapus device | *"Hapus srv-web-01?"* | Device, n port, dan n cable dihapus permanen | Hapus |
| Lepas cable | *"Lepas cable C-0042?"* | Sambungan [device · port] dan [device · port] diputus; kedua port menjadi kosong | Lepas cable |
| Nonaktifkan / aktifkan maintenance plan | *"Nonaktifkan [judul]?"* | Tidak ada WO baru yang dibuat; n WO terbuka tetap ada | Nonaktifkan / Aktifkan |
| Hapus maintenance plan | *"Hapus [judul]?"* | Dihapus permanen (hanya bila belum punya riwayat WO) | Hapus |
| Nonaktifkan / aktifkan user | *"Nonaktifkan Rina?"* | User tidak dapat login dan sesinya berakhir; n WO terbuka miliknya perlu ditugaskan ulang | Nonaktifkan / Aktifkan |
| Hapus master data | *"Hapus room Ruang Server Gedung B?"* | Dihapus permanen | Hapus |
| **Informasi** (ditolak aturan) | *"srv-web-01 tidak dapat dihapus"* | Alasan dan langkah yang bisa dilakukan, misalnya *"Device ini punya riwayat work order. Ubah statusnya menjadi Pensiun."* atau *"Room ini masih berisi 4 rack dan 3 device."* | Mengerti |

- Tombol "Aktifkan" pada varian aktifkan berwarna utama (`air`), bukan merah, karena tidak berbahaya.

### MOD-07 Batalkan work order
- **Template:** TPL-04 bergaya konfirmasi. **Dibuka dari:** HAL-15.
- **Judul:** *"Batalkan WO-0012?"*. **Isi:** keterangan dampak (status device kembali Aktif bila tidak ada WO lain yang Dikerjakan; untuk WO preventif, tenggat berikutnya maintenance plan dihitung ulang), lalu kolom alasan (wajib, area teks).
- **Tombol:** "Batalkan WO" (merah, nonaktif sampai alasan terisi), "Kembali".

### MOD-08 Tugaskan atau ganti teknisi
- **Template:** TPL-04. **Dibuka dari:** HAL-15, HAL-05 (notifikasi WO tanpa teknisi).
- **Judul:** *"Tugaskan teknisi untuk WO-0013"* atau *"Ganti teknisi WO-0012"*.
- **Field:** teknisi (KOM-06, hanya teknisi aktif dengan keahlian cocok; di bawahnya tertulis kategori device, misalnya *"Device kategori Fasilitas: menampilkan teknisi Fasilitas dan Keduanya"*).
- **Tombol:** "Simpan", "Batal". Teknisi baru menerima notifikasi.

### MOD-09 Detail audit
- **Jenis:** panel samping (KOM-24). **Dibuka dari:** HAL-27, HAL-10 tab Riwayat.
- **Isi:** waktu, pelaku, aksi, objek (tautan bila masih ada); KOM-45.

### MOD-10 Menu navigasi HP
- **Jenis:** panel yang meluncur dari kiri. **Dibuka dari:** tombol menu di header ringkas HP.
- **Isi:** sama dengan sidebar (§5.3), ditambah nama dan peran user serta tombol "Keluar" di bawah.

---

## 11. Alur pengguna

Flowchart ada di [`docs/diagrams/flowchart.md`](../docs/diagrams/flowchart.md):

| Kode | Alur | Halaman dan modal |
|---|---|---|
| F1 | Login dan pengalihan per peran | HAL-01 → HAL-02 / HAL-03 / HAL-10 |
| F2 | Memasang device ke rack | HAL-07 (KOM-32) → HAL-09 → HAL-07 |
| F3 | Menyambung cable | HAL-12 → HAL-11 atau HAL-10 |
| F4 | Jadwal otomatis harian (cron; US-WO-01, US-NOTIF-01, 02) | Tanpa halaman; hasil tampil di HAL-13, HAL-03, HAL-05 |
| F5 | Mengerjakan WO | HAL-03 → HAL-15 |
| F6 | Memindai QR | Kamera HP → `/a/[asset-tag]` → (HAL-01) → HAL-10 |

Diagram use case ada di [`docs/diagrams/`](../docs/diagrams/).

---

## 12. Halaman prioritas

Berdasarkan [naskah demo](../docs/demo-script.md), halaman berikut dipoles paling detail dan dibuat mockup lebih dulu: HAL-07 Detail rack, HAL-02 Dashboard, HAL-14 Form WO korektif, HAL-03 Tugas saya, HAL-15 Detail WO, dan HAL-10 Detail device versi HP.

---

## 13. Ditunda ke Technical Spec

- Library komponen UI, autentikasi, dan pembuat QR; versi pustaka ikon Lucide.
- Pemeriksaan hak akses dan validasi di server (pasangan "tolak di server" dari prinsip 3; PRD US-AUTH-03, NFR-04).
- Cara menyimpan pilihan buka/tutup sidebar dan cara mengisi awal form dari pintu masuk (misalnya lewat parameter URL).
- Struktur folder dan komponen di kode.
- Pembuatan skill `.claude/skills/ui-guidelines/` dari §3, §4, §6, §7, dan §8 (awal tahap Build).

---

## 14. Riwayat keputusan desain

| No | Keputusan | Pilihan |
|---|---|---|
| 1 | Struktur spec | Tiga file (PRD, design, tech) + indeks `specs/README.md` |
| 2 | Mockup | Claude Design dari dokumen ini |
| 3 | Navigasi | Sidebar desktop + bar bawah di HP |
| 4 | Pengelompokan menu | Berdasarkan tugas: Inventaris, Maintenance, Katalog, Administrasi |
| 5 | Elevation rack | Blok warna per device function + lencana status + slot kosong bisa diklik |
| 6 | Warna status | Warna + teks + ikon; Terjadwal memakai ungu-indigo agar tidak bentrok dengan warna merek |
| 7 | Arah visual | Terang dan bersih, aksen biru-teal "air"; mode gelap = Could |
| 8 | Pola form | Modal untuk data sederhana, halaman penuh untuk data kompleks; satu form untuk tambah dan ubah |
| 9 | Impact analysis di form WO | Panel peringatan langsung di form |
| 10 | Pindai QR | Kamera bawaan HP; pemindai di aplikasi = Could |
| 11 | Diagram laporan | Mermaid (flowchart) + PlantUML (use case), disimpan di `docs/diagrams/` |
| 12 | Skill desain | Dokumen ini + skill `ui-guidelines` saat Build |
| 13 | Nama aplikasi | SIRAMA |
| 14 | Halaman awal | Teknisi → Tugas saya; Admin dan Viewer → Dashboard |
| 15 | Detail device | Tab di desktop; versi ringkas di HP dengan lokasi dan tugas aktif di atas |
| 16 | Naskah demo | Disusun lebih awal; disimpan di `docs/demo-script.md` |
| 17 | Level detail | Inventaris template, komponen, halaman, dan modal dengan ID |
| 18 | Sketsa | Semua sketsa ASCII dihapus; deskripsi dipisah Wajib dan Bebas |
| 19 | Prinsip pencegahan | "Cegah kesalahan sebelum terjadi"; bagian server pindah ke Technical Spec |
| 20 | Ikon | Lucide, ikon garis, tanpa emoji |
| 21 | Lokasi | Tiga tingkat, satu halaman pohon, tambah anak dari baris induk dengan induk terisi otomatis |
| 22 | Grup sidebar | Semua tertutup secara bawaan; grup halaman aktif terbuka otomatis; pilihan diingat |
| 23 | Lepas cable | Dari daftar cable dan tab Port & cable detail device; tidak dari form ubah |
| 24 | URL | Bahasa Inggris (identitas teknis) |

---

## 15. Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 5 Okt 2026 | Draft awal |
| 0.2 | 5 Okt 2026 | Flowchart, use case, naskah demo, dan brief Claude Design dipindah ke `docs/`. Semua sketsa diberi deskripsi tertulis. Perbaikan kontras warna status, akses Tugas saya dan notifikasi, sitemap, form device, dan panel dampak |
| 0.3 | 8 Okt 2026 | **Struktur:** bagian cara membaca dengan konvensi rujukan (§1); inventaris template (§7), komponen (§8), halaman (§9), dan modal (§10) dengan ID; setiap halaman menyebut template, peran, pintu masuk, dan referensi. **Sketsa:** semua sketsa ASCII dan emoji dihapus; komponen khusus dideskripsikan dengan bagian Wajib dan Bebas. **Prinsip:** "Cegah di tampilan, tolak di server" menjadi "Cegah kesalahan sebelum terjadi"; "Lapangan dulu" diperjelas menjadi "Mudah dipakai teknisi di ruang server"; prinsip konsistensi ditambahkan. **Ikon:** Lucide. **Penamaan:** mengikuti PRD v0.3 (nama entitas bahasa Inggris, "tenggat"); URL bahasa Inggris. **Dari PRD v0.3:** notifikasi Admin (lonceng, bar bawah, jenis notifikasi, MOD-08 dari notifikasi); device tanpa rack (form device, peta room, pohon lokasi, filter); nomor WO; info asal WO (KOM-44); judul WO korektif; data pembelian opsional dengan nama bagian "Pembelian & garansi"; status device terkunci saat Maintenance; pindah ke stok; WO tanpa teknisi tidak dapat dimulai. **Lainnya:** alur tambah lokasi (HAL-06); grup sidebar tertutup secara bawaan; "Lepas cable" dari daftar dan tab Port & cable; "Sambungkan" dari port kosong; "Buat WO korektif" dan "Tambah maintenance plan" dari detail device; pemberitahuan perubahan port template; validasi tinggi rack di MOD-03; kelompok Tugas saya "7 hari ke depan"; keadaan standar komponen (§8.1) |
