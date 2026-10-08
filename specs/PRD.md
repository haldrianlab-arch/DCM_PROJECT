# PRD: SIRAMA (Sistem Informasi Rak, Aset & Maintenance)

| | |
|---|---|
| Versi | 0.3 (direview Product Owner) |
| Tanggal | 8 Oktober 2026 |
| Sumber | [`intent/asset-maintenance.md`](../intent/asset-maintenance.md) |
| Tahap SDLC | Design |
| Dokumen berikutnya | [`specs/design.md`](design.md) (Design Spec), `specs/tech.md` (Technical Spec) |

---

## 1. Ringkasan

Aplikasi web untuk mengelola aset fisik ruang server data center kampus: lokasi dan rack, device, cable data dan daya, serta maintenance terjadwal. Pembeda utama dari tools inventaris seperti NetBox adalah **modul maintenance** yang terhubung langsung dengan data inventaris, ditambah **impact analysis** (melihat device terdampak sebelum maintenance) dan **QR code** pada label aset.

---

## 2. Glosarium dan konvensi penamaan

### 2.1 Konvensi penamaan

- **Nama entitas memakai bahasa Inggris**, mengikuti istilah yang lazim di DCIM seperti NetBox: Site, Room, Rack, Device, Device function, Manufacturer, Model, Port, Port template, Cable, Maintenance plan, Work order, User. Di dalam kalimat ditulis dengan huruf kecil (misalnya "memasang device ke rack").
- **Selain nama entitas, semuanya bahasa Indonesia:** kalimat, label field, tombol, pesan, nilai status, dan nama halaman yang bukan nama entitas (misalnya Dashboard, Tugas saya, Notifikasi, Kalender).
- **Kode dokumen** (US-, BR-, NFR-, dsb.) adalah identitas permanen dan tidak diubah walaupun nama fiturnya berubah.

### 2.2 Glosarium

| Istilah | Arti |
|---|---|
| **Site** | Lokasi tingkat teratas, misalnya satu kampus. |
| **Room** | Ruangan di dalam site, misalnya "Ruang Server Gedung A". |
| **Rack** | Lemari standar 19 inci di dalam room tempat device dipasang. Tingginya diukur dalam U. |
| **U (Rack Unit)** | Satuan tinggi rack, 1U = 4,45 cm. Rack standar 42U. Penomoran dari bawah (U1 paling bawah). |
| **Sisi rack** | Depan atau belakang. Device half-depth hanya memakai satu sisi; full-depth memakai keduanya. |
| **0U** | Device yang dipasang di samping rack tanpa memakai slot U, misalnya PDU vertikal. |
| **Device** | Setiap perangkat fisik yang dicatat: server, switch, patch panel, PDU, UPS, AC presisi (CRAC). |
| **Device tanpa rack** | Device aktif yang berdiri di lantai room, bukan di dalam rack, misalnya UPS besar dan CRAC. |
| **Model** | Template device (di NetBox disebut *Device Type*), misalnya "Dell PowerEdge R650": tinggi U, kedalaman, daya, dan daftar port template. |
| **Port template** | Daftar port bawaan sebuah model. Disalin menjadi port sungguhan saat device dibuat. |
| **Manufacturer** | Pembuat device (Dell, Cisco, APC). |
| **Vendor** | Penjual tempat kampus membeli device (misalnya "PT Mitra Solusi"), sering juga yang mengurus klaim garansi. Berbeda dengan manufacturer. Dicatat sebagai teks. |
| **Garansi** | Garansi dari manufacturer atau vendor: periode device yang rusak diperbaiki atau diganti tanpa biaya. Bukan periode maintenance internal. |
| **Peran** | Hak akses user di sistem: Admin, Teknisi, atau Viewer. |
| **Device function** | Kegunaan device (Server, Switch, PDU, UPS, CRAC, dll.), masing-masing berkategori IT atau Fasilitas. Berbeda dengan peran user. |
| **Port** | Titik sambung pada device. Jenisnya: data, power inlet (colokan masuk daya), power outlet (stopkontak keluar daya). |
| **Cable** | Sambungan antara dua port. |
| **PDU** | Power Distribution Unit, "stopkontak cerdas" di rack yang membagi listrik ke device. |
| **UPS** | Uninterruptible Power Supply, baterai cadangan saat listrik padam. |
| **CRAC** | Computer Room Air Conditioner, AC presisi ruang server. |
| **ToR (Top-of-Rack)** | Desain jaringan dengan satu switch di bagian atas setiap rack; server di rack itu disambung langsung ke switch tersebut. |
| **End-of-Row (EoR)** | Desain jaringan dengan switch terpusat di rack ujung baris; server tersambung lewat patch panel dan cable panjang. |
| **Patch panel** | Papan berisi port untuk merapikan cable. Port depan tembus ke port belakang dengan nomor yang sama. |
| **Trace** | Menelusuri jalur cable dari ujung ke ujung. |
| **Asset tag** | Kode unik permanen tiap device (misalnya `DCM-0001`), dicetak di QR. |
| **Maintenance plan** | Jadwal maintenance preventif berulang untuk satu device, misalnya "Cek baterai UPS-01 setiap 3 bulan". Bukan pekerjaan, melainkan aturan yang menghasilkan work order preventif. |
| **Work order (WO)** | Satu pekerjaan maintenance untuk satu device, ditugaskan ke teknisi. Setiap WO punya satu jenis: Preventif atau Korektif. |
| **Nomor WO** | Kode unik permanen setiap WO (misalnya `WO-0012`), untuk dirujuk. Berbeda dengan judul WO, yang menjelaskan isi pekerjaan. |
| **Preventif / Korektif** | Mengikuti standar terminologi maintenance EN 13306. Preventif = dilakukan sebelum kerusakan pada interval tertentu (di sini: dari maintenance plan). Korektif = dilakukan setelah kerusakan terdeteksi, untuk memulihkan fungsi device (termasuk penggantian unit). |
| **Tenggat** | Tanggal paling lambat sebuah WO harus selesai. |
| **Checklist** | Daftar langkah yang dicentang teknisi saat mengerjakan WO. |
| **Cron** | Program yang berjalan otomatis sesuai jadwal (di sini: setiap hari pukul 07.00 WIB). |
| **Impact analysis** | Daftar device yang ikut terdampak bila satu device dimatikan atau di-maintenance. |
| **Least privilege** | Prinsip keamanan: setiap orang hanya diberi akses sebatas yang dibutuhkan pekerjaannya. |
| **CMMS** | Computerized Maintenance Management System, software khusus manajemen maintenance. |
| **Discovery / telemetri** | Pembacaan data langsung dari device lewat jaringan (misalnya SNMP, IPMI, LLDP), tanpa diketik manual. |
| **Audit log** | Catatan siapa mengubah apa, kapan, beserta data sebelum dan sesudahnya. |
| **MoSCoW** | Metode prioritas: Must (wajib), Should (penting, setelah Must), Could (bonus), Won't (tidak dikerjakan kali ini). |
| **Given/When/Then** | Format acceptance criteria: Given = kondisi awal, When = aksi, Then = hasil yang diharapkan. |

---

## 3. Masalah dan tujuan

**Masalah**
1. Data aset tersebar di spreadsheet dan terpisah dari jadwal maintenance.
2. Posisi device dan sambungan cable tidak sesuai kondisi fisik.
3. Jadwal perawatan dan masa garansi terlewat karena tidak ada pengingat.
4. Tidak ada cara cepat mengetahui device yang terdampak saat satu device di-maintenance.

**Tujuan produk**
- **T1.** Satu sumber data yang akurat untuk lokasi, device, dan sambungan di ruang server.
- **T2.** Tidak ada maintenance yang terlewat tanpa diketahui.
- **T3.** Dampak maintenance diketahui sebelum pekerjaan dimulai.
- **T4.** Informasi aset dapat diakses di ruang server dengan memindai label.

---

## 4. Metrik sukses

| ID | Metrik | Target | Cara membuktikan |
|---|---|---|---|
| M1 | Waktu menemukan lokasi device | < 30 detik | Demo: pencarian atau pindai QR → halaman detail menampilkan site, room, rack, U |
| M2 | Pemasangan device bertabrakan yang lolos | 0% | Unit test + E2E untuk semua skenario tabrakan |
| M3 | Maintenance mendekati tenggat tanpa pengingat | 0 | Tes cron: WO dan notifikasi terbentuk paling lambat 3 hari sebelum tenggat |
| M4 | Kelengkapan impact analysis (satu lompatan) | 100% device yang terhubung langsung tampil | Tes integrasi dengan data seed |
| M5 | Test case blackbox valid saat demo | 100% | Tabel Bab IV + laporan Playwright |
| M6 | Waktu teknisi menyelesaikan WO dari HP | < 2 menit | Diukur saat uji coba: buka WO → Mulai → centang checklist → Selesai |

Metrik sukses mengukur hasil bagi user (tujuan T1-T4 tercapai), sedangkan kebutuhan non-fungsional (bagian 9) mengukur kualitas sistem yang mendukung tercapainya metrik tersebut.

---

## 5. Persona

### Admin data center (Pak Andi, staf IT kampus)
Mengelola seluruh data: lokasi, rack, device, cable, user, dan maintenance plan; membuat dan menugaskan WO. **Kebutuhan:** data rapi dan akurat, mudah melihat kapasitas rack, tahu siapa mengubah apa, tahu WO yang terbengkalai.

### Teknisi (Rina, teknisi IT; Joko, teknisi fasilitas)
Mengerjakan maintenance di ruang server, sering dari HP sambil berdiri di depan rack. **Kebutuhan:** daftar tugas yang jelas, checklist, dan akses cepat ke info device.

### Viewer (Bu Sari, kepala UPT TIK)
Memantau kondisi tanpa mengubah data, sering dari HP. Peran yang sama juga cocok untuk auditor dan pimpinan bidang sarana-prasarana. **Kebutuhan:** ringkasan utilisasi rack, WO yang terlambat, dan garansi yang hampir habis.

### Matriks hak akses

| Aksi | Admin | Teknisi | Viewer |
|---|:---:|:---:|:---:|
| Lihat semua data (lokasi, rack, device, cable, maintenance, dashboard) | ✅ | ✅ | ✅ |
| Kelola site, room, rack, katalog, device, cable | ✅ | ❌ | ❌ |
| Kelola maintenance plan, buat WO korektif, tugaskan dan ganti teknisi WO | ✅ | ❌ | ❌ |
| Mulai, isi checklist, dan selesaikan WO **yang ditugaskan kepadanya** | — | ✅ | ❌ |
| Mulai, isi checklist, dan selesaikan **WO mana pun** (misalnya saat teknisi berhalangan) | ✅ | ❌ | ❌ |
| Batalkan WO | ✅ | ❌ | ❌ |
| Menerima notifikasi | ✅ (US-NOTIF-02) | ✅ (US-NOTIF-01) | ❌ |
| Kelola user | ✅ | ❌ | ❌ |
| Lihat audit log | ✅ | ❌ | ❌ |

---

## 6. Scope dan prioritas (MoSCoW)

| Prioritas | Fitur |
|---|---|
| **Must** | Login + peran; manajemen user; Site → Room → Rack; elevation rack; katalog Manufacturer/Model/Device function; device dengan validasi posisi; device tanpa rack (berdiri di lantai room); port otomatis dari model; cable data dan daya; maintenance plan berulang; WO preventif otomatis (cron) dan korektif manual; nomor WO otomatis; checklist; penugasan berdasarkan keahlian; notifikasi in-app untuk Teknisi dan Admin; impact analysis satu lompatan; QR per device; pencarian; dashboard; audit log; seed data; semua halaman tidak rusak di HP |
| **Should** | Cetak label QR massal (satu lembar A4); indikator jalur daya cadangan pada impact analysis; kalender WO |
| **Could** | Kolom IP management per device; WO korektif lanjutan dari WO lain; foto bukti maintenance (Cloudinary); trace cable menembus patch panel; visual graf topologi; persetujuan WO; vendor sebagai data terpisah (bukan teks); import CSV; notifikasi email; impact analysis berantai; pindahkan device ke device function lain saat menghapus device function; optimasi tampilan HP untuk semua halaman; simulasi pembacaan data device; mode gelap; pemindai QR di dalam aplikasi |
| **Won't** | IPAM penuh (prefix, VLAN, alokasi IP); virtualisasi; VPN; wireless; circuits; pembacaan data dari device fisik sungguhan (SNMP/IPMI/LLDP); pengadaan barang (status "Dipesan") |

---

## 7. User stories dan acceptance criteria

Setiap acceptance criteria (AC) menjadi minimal satu test case blackbox di Bab IV. Daftar field setiap entitas beserta wajib/opsional ada di **Lampiran C**; user story di bawah hanya menyebut field yang relevan dengan perilakunya.

### E1. Autentikasi dan user

**US-AUTH-01 (Must)** Sebagai user, saya ingin login dengan email dan password agar hanya orang berwenang yang bisa mengakses data.
- **AC1:** Given akun aktif, When login dengan email dan password benar, Then masuk ke halaman awal sesuai peran (Admin dan Viewer ke Dashboard, Teknisi ke Tugas saya).
- **AC2:** Given akun aktif, When password salah, Then muncul pesan "Email atau password salah" tanpa menyebut bagian mana yang salah.
- **AC3:** Given akun dinonaktifkan, When login dengan kredensial benar, Then login ditolak dengan pesan yang sama seperti AC2.
- **AC4:** Given belum login, When membuka halaman mana pun selain login, Then diarahkan ke halaman login.
- **AC5:** Tidak ada halaman pendaftaran mandiri.

**US-AUTH-02 (Must)** Sebagai Admin, saya ingin membuat dan mengelola user agar setiap orang punya akses sesuai perannya.
- **AC1:** Given login sebagai Admin, When membuat user dengan nama, email, password awal, peran, dan keahlian (wajib untuk Teknisi: IT / Fasilitas / Keduanya), Then user tersimpan dan bisa dipakai login.
- **AC2:** Given email sudah terdaftar, When membuat user dengan email yang sama, Then ditolak dengan pesan email sudah dipakai.
- **AC3:** Given user ada, When Admin menonaktifkannya, Then user itu tidak bisa login lagi dan sesi aktifnya berakhir.
- **AC4:** Given login sebagai Teknisi atau Viewer, When membuka halaman kelola user, Then akses ditolak.

**US-AUTH-03 (Must)** Sebagai sistem, saya harus menegakkan hak akses di sisi server, bukan hanya menyembunyikan tombol.
- **AC1:** Given login sebagai Teknisi, When mengirim permintaan hapus device langsung ke server (tanpa lewat tombol), Then permintaan ditolak.

### E2. Lokasi dan rack

**US-LOC-01 (Must)** Sebagai Admin, saya ingin mencatat site dan room agar setiap rack punya lokasi jelas.
- **AC1:** Given login sebagai Admin, When membuat site "Kampus Utama" lalu room "Ruang Server Gedung A" di dalamnya, Then keduanya tersimpan dengan relasi yang benar.
- **AC2:** Given room masih berisi rack atau device, When Admin menghapus room itu, Then ditolak dengan pesan yang menyebut jumlah rack dan device yang masih ada.
- **AC3:** Given site masih berisi room, When Admin menghapus site itu, Then ditolak dengan pesan yang menyebut jumlah room.

**US-RAK-01 (Must)** Sebagai Admin, saya ingin mencatat rack beserta tingginya.
- **AC1:** When membuat rack dengan nama, room, dan tinggi (bawaan 42U), Then rack tersimpan.
- **AC2:** Given nama rack sudah ada di room yang sama, When membuat rack dengan nama itu, Then ditolak.
- **AC3:** Given rack masih berisi device, When Admin menghapus rack, Then ditolak.
- **AC4:** Given rack berisi device yang menempati sampai U40, When tingginya diubah menjadi kurang dari 40U, Then ditolak.

**US-RAK-02 (Must)** Sebagai user, saya ingin melihat elevation rack (tampak depan dan belakang) agar tahu slot mana yang terisi dan kosong.
- **AC1:** Given rack berisi device, When membuka halaman rack, Then tampil dua kolom (depan dan belakang) dari U tertinggi ke U1, dengan device di posisinya masing-masing.
- **AC2:** Device full-depth tampil di kedua sisi; device half-depth hanya di sisinya.
- **AC3:** Ringkasan rack menampilkan jumlah U terpakai, U kosong, dan persentase utilisasi.
- **AC4:** Device 0U tampil di daftar terpisah "Terpasang 0U".
- **AC5:** Klik device di elevation membuka halaman detail device.

### E3. Katalog

**US-CAT-01 (Must)** Sebagai Admin, saya ingin mengelola manufacturer dan device function.
- **AC1:** When membuat device function, Then wajib memilih kategori IT atau Fasilitas.
- **AC2:** Given manufacturer atau device function masih dipakai, When dihapus, Then ditolak dengan pesan yang menyebut jumlah model atau device yang masih memakainya.
- **AC3:** Given device function dipakai beberapa device, When namanya diubah, Then semua device tersebut menampilkan nama baru.

**US-CAT-02 (Must)** Sebagai Admin, saya ingin membuat model beserta port template agar tidak perlu mengisi spesifikasi berulang kali.
- **AC1:** When membuat model dengan manufacturer, nama, tinggi U (0 untuk 0U), full-depth ya/tidak, dan daya maksimum, Then model tersimpan.
- **AC2:** When menambahkan port template (nama, jenis: data / power inlet / power outlet, tipe konektor), Then port template tersimpan pada model.
- **AC3:** Given nama port template sudah ada pada model yang sama, When menambahkan nama itu lagi, Then ditolak.
- **AC4:** Given model sudah dipakai device, When port template-nya diubah, Then hanya device yang dibuat setelahnya yang terpengaruh; port device yang sudah ada tidak berubah.
- **AC5:** Given model masih dipakai device, When dihapus, Then ditolak dengan pesan yang menyebut jumlah device.

### E4. Device

**US-DEV-01 (Must)** Sebagai Admin, saya ingin mendaftarkan device dari sebuah model agar port-portnya terbentuk otomatis.
- **AC1:** When membuat device dengan field wajib (Lampiran C), Then device tersimpan dan port-port dari port template model terbentuk otomatis.
- **AC2:** Device baru otomatis mendapat asset tag berurutan (`DCM-0001`, `DCM-0002`, ...).
- **AC3:** Given nama sudah dipakai device lain, When disimpan, Then ditolak. Given serial number diisi dan sudah dipakai device lain, When disimpan, Then ditolak.
- **AC4:** Asset tag tidak dapat diubah oleh siapa pun setelah dibuat.
- **AC5:** Data pembelian dan garansi (tanggal beli, vendor, akhir garansi) boleh dikosongkan, karena device lama sering tidak punya data pembelian lagi.

**US-DEV-02 (Must)** Sebagai Admin, saya ingin menempatkan device di room atau di rack pada posisi dan sisi tertentu dengan validasi otomatis.
- **AC1:** Given U10 sisi depan kosong, When memasang device half-depth 1U di U10 sisi depan, Then berhasil.
- **AC2:** Given device full-depth menempati U10, When memasang device apa pun di U10 sisi mana pun, Then ditolak dengan pesan yang menyebut device yang bertabrakan.
- **AC3:** Given device half-depth di U10 sisi belakang, When memasang device half-depth di U10 sisi depan, Then berhasil.
- **AC4:** Given device half-depth di U10 sisi belakang, When memasang device full-depth di U10, Then ditolak.
- **AC5:** Given rack 42U, When memasang device 2U di U42, Then ditolak karena melebihi tinggi rack.
- **AC6:** Given model 0U, When dipasang ke rack, Then tidak diminta posisi U dan sisi, dan tampil di daftar "Terpasang 0U".
- **AC7:** Given device 2U, When dipasang di U5, Then device menempati U5 dan U6 (posisi = U terbawah).
- **AC8:** Given device Aktif, When ditempatkan di room tanpa memilih rack, Then tersimpan sebagai device tanpa rack (tanpa posisi U dan sisi), dan tampil sebagai "berdiri di lantai room" di halaman lokasi dan dashboard.
- **AC9:** Given device sudah terpasang, When posisinya dipindah, Then validasi AC2-AC5 berlaku dengan mengabaikan posisi lama device itu sendiri.

**US-DEV-03 (Must)** Sebagai Admin, saya ingin mengubah status device sesuai siklus hidupnya.
- **AC1:** Status yang tersedia: Stok (ada fisik, belum dipasang), Aktif, Maintenance, Pensiun.
- **AC2:** Given device berstatus Stok atau Pensiun, When ditempatkan di room atau rack, Then ditolak. Hanya device Aktif atau Maintenance yang punya penempatan.
- **AC3:** Given device Aktif, When statusnya diubah menjadi Stok atau Pensiun, Then setelah konfirmasi yang menyebutkan dampaknya: penempatannya dikosongkan, cable-nya dilepas, maintenance plan aktifnya dinonaktifkan, dan WO Terjadwal-nya dibatalkan otomatis dengan alasan "Device dipindah ke status Stok/Pensiun".
- **AC4:** Status Maintenance tidak dapat dipilih manual; status ini hanya diatur otomatis oleh WO (lihat US-WO-04).
- **AC5:** Given device punya WO berstatus Dikerjakan, When statusnya akan diubah, Then ditolak dengan pesan yang menyebut nomor WO tersebut.

**US-DEV-04 (Must)** Sebagai user, saya ingin melihat halaman detail device.
- **AC1:** Halaman menampilkan identitas (nama, asset tag, serial), model, device function, status, lokasi lengkap (site, room, rack, U, sisi; atau "berdiri di lantai room"), data pembelian dan garansi, daftar port beserta sambungannya, device terhubung (impact analysis), maintenance plan, riwayat WO, dan QR code.
- **AC2:** Given akhir garansi tinggal 30 hari atau kurang, Then tampil penanda "Garansi segera habis"; jika sudah lewat, tampil "Garansi habis"; jika akhir garansi kosong, tidak ada penanda.

**US-DEV-05 (Must)** Sebagai Admin, saya ingin menghapus device yang salah input tanpa menghilangkan riwayat.
- **AC1:** Given device belum pernah punya WO, When dihapus, Then device beserta port dan cable-nya terhapus permanen setelah konfirmasi.
- **AC2:** Given device sudah punya riwayat WO, When dihapus, Then ditolak dengan saran mengubah statusnya menjadi Pensiun.

### E5. Port dan cable

**US-CAB-01 (Must)** Sebagai Admin, saya ingin menyambungkan dua port dengan cable.
- **AC1:** When memilih port A dan port B serta mengisi label, tipe cable (Cat6, Fiber, DAC, Power), warna, dan panjang, Then cable tersimpan dan tampil di kedua port.
- **AC2:** Given port sudah tersambung, When disambungkan lagi ke cable lain, Then ditolak.
- **AC3:** When menyambung port data ke port power, Then ditolak.
- **AC4:** Cable daya hanya boleh menyambung power inlet ke power outlet; inlet ke inlet atau outlet ke outlet ditolak.
- **AC5:** When menyambung dua port pada device yang sama, Then ditolak.
- **AC6:** Given label cable sudah dipakai, When disimpan dengan label yang sama, Then ditolak.

**US-CAB-02 (Must)** Sebagai Admin, saya ingin mengubah atau melepas cable.
- **AC1:** When atribut cable (label, tipe, warna, panjang) atau salah satu ujungnya diubah, Then aturan US-CAB-01 tetap berlaku.
- **AC2:** When cable dilepas (setelah konfirmasi), Then cable terhapus dan kedua port kembali kosong.

### E6. Maintenance

**US-MP-01 (Must)** Sebagai Admin, saya ingin membuat maintenance plan berulang untuk sebuah device.
- **AC1:** When membuat maintenance plan dengan judul, device, interval (angka + satuan hari/minggu/bulan), tenggat pertama, teknisi bawaan (opsional), dan checklist, Then maintenance plan tersimpan dan aktif.
- **AC2:** Given device berstatus Stok atau Pensiun, When membuat maintenance plan untuknya, Then ditolak.
- **AC3:** Admin dapat menonaktifkan dan mengaktifkan kembali maintenance plan; maintenance plan nonaktif tidak menghasilkan WO baru. WO yang sudah terlanjur dibuat tetap ada, dan Admin memutuskan untuk tetap dikerjakan atau dibatalkan.
- **AC4:** Given maintenance plan sudah punya riwayat WO, When dihapus, Then ditolak dengan saran menonaktifkannya. Maintenance plan tanpa riwayat WO boleh dihapus permanen.
- **AC5:** Teknisi bawaan hanya dapat dipilih dari teknisi dengan keahlian yang sesuai (BR-12).

**US-WO-01 (Must)** Sebagai sistem, saya harus membuat WO preventif otomatis agar tidak ada jadwal yang terlewat.
- **AC1:** Given maintenance plan aktif yang tenggat berikutnya tinggal 3 hari lagi atau kurang dan belum punya WO terbuka, When cron harian berjalan, Then satu WO preventif dibuat dengan status Terjadwal, judul dan checklist disalin dari maintenance plan, tenggat dari maintenance plan, dan teknisi bawaan (jika ada).
- **AC2:** Given cron sudah berjalan hari ini, When cron dijalankan lagi, Then tidak ada WO ganda.
- **AC3:** Given maintenance plan sudah punya WO yang belum Selesai atau Dibatalkan, When cron berjalan, Then tidak dibuat WO baru untuk maintenance plan itu.
- **AC4:** Given cron gagal berjalan satu hari, When cron berjalan keesokan harinya, Then WO yang seharusnya dibuat kemarin tetap dibuat (aturan "3 hari atau kurang", bukan "tepat 3 hari").
- **AC5:** Given maintenance plan tidak punya teknisi bawaan, When WO-nya dibuat, Then WO tersimpan tanpa teknisi dan Admin menerima notifikasi (US-NOTIF-02).

**US-WO-02 (Must)** Sebagai Admin, saya ingin membuat WO korektif secara manual saat ada kerusakan.
- **AC1:** When membuat WO dengan judul, device, deskripsi masalah, tenggat, dan teknisi (opsional), Then WO tersimpan dengan jenis Korektif dan status Terjadwal.
- **AC2:** Checklist pada WO korektif opsional; Admin boleh menambahkan item bila langkah perbaikannya sudah jelas.
- **AC3:** Given device berstatus Stok atau Pensiun, When membuat WO untuknya, Then ditolak.

**US-WO-03 (Must)** Sebagai Admin, saya ingin menugaskan WO hanya ke teknisi dengan keahlian yang sesuai.
- **AC1:** Given device function device berkategori Fasilitas (misalnya CRAC), When memilih teknisi, Then daftar hanya berisi teknisi aktif berkeahlian Fasilitas atau Keduanya.
- **AC2:** Given device function device berkategori IT, When memilih teknisi, Then daftar hanya berisi teknisi aktif berkeahlian IT atau Keduanya.
- **AC3:** Given WO berstatus Terjadwal atau Dikerjakan, When Admin menugaskan atau mengganti teknisinya, Then teknisi baru menerima notifikasi (US-NOTIF-01 AC1).

**US-WO-04 (Must)** Sebagai Teknisi, saya ingin memperbarui status WO yang ditugaskan kepada saya.
- **AC1:** Alur status: Terjadwal → Dikerjakan → Selesai. Admin dapat mengubah Terjadwal atau Dikerjakan menjadi Dibatalkan dengan alasan wajib diisi.
- **AC2:** Given WO Terjadwal yang sudah punya teknisi, When teknisi menekan "Mulai", Then status menjadi Dikerjakan dan status device menjadi Maintenance. WO tanpa teknisi tidak dapat dimulai.
- **AC3:** Given WO Dikerjakan dan semua item checklist (jika ada) sudah dicentang, When teknisi mengisi catatan hasil lalu menekan "Selesai", Then status menjadi Selesai, waktu selesai tercatat, dan status device kembali Aktif.
- **AC4:** Given masih ada item checklist yang belum dicentang atau catatan hasil kosong, When menekan "Selesai", Then ditolak.
- **AC5:** Given device punya dua WO berstatus Dikerjakan, When salah satunya selesai, Then status device tetap Maintenance sampai semua WO yang Dikerjakan selesai atau dibatalkan.
- **AC6:** Given login sebagai Teknisi dan WO ditugaskan ke teknisi lain, When mencoba memulai atau memperbarui WO tersebut (termasuk lewat permintaan langsung ke server), Then ditolak.
- **AC7:** Given WO preventif Selesai atau Dibatalkan, Then tenggat berikutnya pada maintenance plan = tenggat WO tersebut + interval (bukan tanggal penyelesaian).
- **AC8:** Given WO Dikerjakan dibatalkan, Then status device mengikuti BR-11.

**US-WO-05 (Must)** Sebagai user, saya ingin melihat WO yang terlambat dan WO milik saya.
- **AC1:** Given tenggat sudah lewat dan status bukan Selesai atau Dibatalkan, Then WO ditandai "Terlambat" di semua tampilan. Penanda dihitung saat ditampilkan, tidak disimpan sebagai status.
- **AC2:** Daftar WO dapat difilter berdasarkan status, jenis, teknisi, dan terlambat.
- **AC3:** Teknisi memiliki halaman "Tugas saya" yang hanya menampilkan WO miliknya yang belum Selesai atau Dibatalkan.

**US-WO-06 (Must)** Sebagai user, saya ingin setiap WO punya nomor dan asal-usul yang jelas.
- **AC1:** Setiap WO baru otomatis mendapat nomor berurutan (`WO-0001`, `WO-0002`, ...) yang unik dan tidak dapat diubah.
- **AC2:** WO preventif menyimpan dan menampilkan maintenance plan asalnya (dapat diklik), serta "Dibuat oleh: Sistem (jadwal otomatis)".
- **AC3:** WO korektif menampilkan "Dibuat oleh: [nama Admin]" beserta waktu pembuatannya.
- **AC4:** Pencarian WO menerima nomor WO.

**US-WO-07 (Could)** Sebagai Admin, saya ingin membuat WO korektif lanjutan dari WO lain, misalnya saat teknisi menemukan kerusakan ketika mengerjakan WO preventif.
- **AC1:** WO lanjutan menampilkan "Lanjutan dari WO-xxxx" (dapat diklik), dan WO asal menampilkan daftar WO lanjutannya.

**US-NOTIF-01 (Must)** Sebagai Teknisi, saya ingin menerima notifikasi di aplikasi.
- **AC1:** When WO ditugaskan kepada saya (saat dibuat atau saat teknisi diganti), Then saya menerima notifikasi.
- **AC2:** Given WO saya tenggatnya tinggal 3 hari lagi atau kurang, When cron harian berjalan, Then saya menerima notifikasi pengingat (sekali per WO).

**US-NOTIF-02 (Must)** Sebagai Admin, saya ingin diberi tahu tentang WO yang berisiko terbengkalai.
- **AC1:** Given cron membuat WO preventif tanpa teknisi, Then semua Admin aktif menerima notifikasi "WO-xxxx belum punya teknisi".
- **AC2:** Given WO melewati tenggatnya dan belum Selesai atau Dibatalkan, When cron harian berjalan, Then semua Admin aktif menerima notifikasi "WO-xxxx terlambat" (sekali per WO).

**US-NOTIF-03 (Must)** Sebagai penerima notifikasi, saya ingin mengelola notifikasi saya.
- **AC1:** Ikon lonceng menampilkan jumlah notifikasi belum dibaca.
- **AC2:** Klik notifikasi membuka WO terkait dan menandainya sudah dibaca; tersedia aksi "Tandai semua sudah dibaca".
- **AC3:** Setiap user hanya melihat notifikasinya sendiri.

**US-CAL-01 (Should)** Sebagai user, saya ingin melihat WO dalam tampilan kalender bulanan berdasarkan tenggatnya.

**US-PHOTO-01 (Could)** Sebagai Teknisi, saya ingin mengunggah foto bukti saat menyelesaikan WO (Cloudinary).

### E7. Impact analysis

**US-IMP-01 (Must)** Sebagai user, saya ingin melihat device yang terhubung langsung ke sebuah device.
- **AC1:** Given device punya cable ke device lain, When membuka halaman detailnya, Then tampil daftar device terhubung, dikelompokkan menjadi Data dan Daya, beserta port di kedua ujung.
- **AC2:** Given device tidak punya cable, Then tampil "Tidak ada device terhubung".
- **AC3:** Hasilnya sama dari ujung cable mana pun yang tercatat sebagai A atau B.

**US-IMP-02 (Must)** Sebagai Admin, saya ingin melihat dampak sebelum menyimpan WO.
- **AC1:** Given device punya device terhubung, When memilih device itu di form WO, Then sebelum disimpan tampil peringatan berisi daftar device terdampak dan jumlahnya.
- **AC2:** Admin tetap dapat menyimpan WO setelah melihat peringatan.

**US-IMP-03 (Should)** Sebagai Admin, saya ingin tahu apakah device terdampak masih punya jalur daya cadangan.
- **AC1:** Given PDU-A akan di-maintenance dan sebuah server punya power inlet lain yang tersambung ke PDU-B, Then server itu ditandai "Masih punya jalur daya cadangan"; jika tidak, ditandai "Kehilangan seluruh daya".

### E8. QR code

**US-QR-01 (Must)** Sebagai Admin, saya ingin mengunduh QR code setiap device untuk dicetak sebagai label.
- **AC1:** QR berisi tautan ke halaman aset berdasarkan **asset tag** (bukan nama).
- **AC2:** Label yang diunduh menampilkan QR, asset tag, dan nama device.

**US-QR-02 (Must)** Sebagai Teknisi, saya ingin memindai QR dengan HP untuk membuka detail device.
- **AC1:** Given sudah login di HP, When memindai QR, Then halaman detail device terbuka.
- **AC2:** Given belum login, When memindai QR, Then diarahkan ke login lalu kembali ke halaman device yang dipindai.
- **AC3:** Given nama device sudah diubah, When memindai QR lama, Then tetap membuka device yang benar.
- **AC4:** Halaman ini nyaman dipakai di layar HP (lebar 375px) tanpa perlu menggeser ke samping.

**US-QR-03 (Should)** Sebagai Admin, saya ingin mencetak banyak label sekaligus.
- **AC1:** When memilih beberapa device (atau semua device dalam satu rack) lalu memilih "Cetak label", Then tampil halaman siap cetak berisi label tersusun dalam grid di kertas A4.

### E9. Dashboard dan pencarian

**US-DASH-01 (Must)** Sebagai user, saya ingin melihat ringkasan kondisi ruang server.
- **AC1:** Dashboard menampilkan: jumlah device per status; utilisasi setiap rack (% U terpakai); device tanpa rack per room; WO dengan tenggat 7 hari ke depan; WO terlambat; device dengan garansi habis atau habis dalam 30 hari.
- **AC2:** Setiap angka atau item dapat diklik menuju daftar atau detail terkait.

**US-SRCH-01 (Must)** Sebagai user, saya ingin mencari device dengan cepat.
- **AC1:** When mengetik sebagian nama, asset tag, atau serial number di kolom pencarian, Then tampil device yang cocok beserta lokasinya.

### E10. Audit log

**US-AUD-01 (Must)** Sebagai Admin, saya ingin melihat riwayat perubahan data.
- **AC1:** Setiap pembuatan, perubahan, dan penghapusan pada site, room, rack, manufacturer, device function, model, device, cable, maintenance plan, WO, dan user tercatat dengan: waktu, user pelaku (atau "Sistem" untuk cron), aksi, jenis dan identitas objek, data sebelum, dan data sesudah.
- **AC2:** Audit log dapat difilter berdasarkan user, jenis objek, dan rentang tanggal.
- **AC3:** Audit log tidak dapat diubah atau dihapus melalui aplikasi.
- **AC4:** Halaman detail device menampilkan riwayat perubahan device itu.

### E11. Simulasi pembacaan device

**US-SIM-01 (Could)** Sebagai Admin, saya ingin sistem menerima data dari "agen pembaca device" agar ketidaksesuaian antara inventaris dan kondisi fisik terdeteksi, seperti DCIM profesional.
- **AC1:** Script simulator mengirim data dummy lewat HTTP dengan API key: status hidup/mati device, konsumsi daya per PDU, dan laporan sambungan (port switch → device).
- **AC2:** Given permintaan tanpa API key yang valid, When data dikirim, Then ditolak.
- **AC3:** Given laporan sambungan berbeda dengan cable yang tercatat, Then muncul peringatan ketidaksesuaian di dashboard yang menyebut port tercatat dan port terlaporkan.
- **AC4:** Halaman detail device menampilkan status dan waktu laporan terakhir.

---

## 8. Aturan bisnis

| ID | Aturan |
|---|---|
| BR-01 | Posisi device = U terbawah yang ditempati. Device setinggi H di posisi P menempati U P sampai P+H-1. |
| BR-02 | P+H-1 tidak boleh melebihi tinggi rack, dan P minimal 1. |
| BR-03 | Device full-depth menempati sisi depan dan belakang. Device half-depth hanya menempati sisi yang dipilih. Dua device bertabrakan bila rentang U-nya beririsan dan ada sisi yang sama-sama ditempati. |
| BR-04 | Device 0U dan device tanpa rack tidak punya posisi U dan tidak dihitung dalam utilisasi rack. |
| BR-05 | Penempatan device. Device **Aktif atau Maintenance wajib punya room**; rack opsional (tanpa rack = berdiri di lantai room). Device **Stok atau Pensiun tidak punya penempatan**. |
| BR-06 | Satu port hanya boleh punya satu cable. Cable data: data ↔ data. Cable daya: power inlet ↔ power outlet. |
| BR-07 | Asset tag dibuat otomatis, berurutan, unik, dan tidak dapat diubah. |
| BR-08 | Satu maintenance plan hanya boleh punya satu WO terbuka (Terjadwal atau Dikerjakan) pada satu waktu. |
| BR-09 | Tenggat berikutnya pada maintenance plan = tenggat WO preventif yang baru ditutup (Selesai atau Dibatalkan) + interval. |
| BR-10 | WO disebut "Terlambat" bila tenggatnya sudah lewat (sebelum hari ini) dan statusnya bukan Selesai atau Dibatalkan. Pada hari tenggat itu sendiri belum terlambat. Dihitung saat ditampilkan, tidak disimpan. |
| BR-11 | Device berstatus Maintenance selama ada minimal satu WO Dikerjakan untuknya; kembali Aktif saat tidak ada lagi. |
| BR-12 | Teknisi yang dapat ditugaskan harus aktif dan memiliki keahlian yang cocok dengan kategori device function device (atau Keduanya). |
| BR-13 | Semua tanggal dan jadwal memakai zona waktu WIB (Asia/Jakarta). Cron berjalan pukul 07.00 WIB. |
| BR-14 | Kebijakan hapus. **Device dan maintenance plan** yang sudah punya riwayat WO tidak dihapus permanen, melainkan diarsipkan (device → Pensiun, maintenance plan → nonaktif). **Master data** (site, room, rack, model, device function, manufacturer) hanya boleh dihapus bila tidak lagi dipakai; penolakan menyebut apa yang masih memakainya. |
| BR-15 | Nomor WO dibuat otomatis, berurutan, unik, dan tidak dapat diubah. |
| BR-16 | WO (preventif maupun korektif) dan maintenance plan hanya dapat dibuat untuk device berstatus Aktif atau Maintenance. Status device tidak dapat diubah selama ada WO Dikerjakan untuknya. |
| BR-17 | Satu WO memiliki tepat satu jenis: Preventif (dibuat cron dari maintenance plan) atau Korektif (dibuat manual oleh Admin). |

---

## 9. Kebutuhan non-fungsional

| ID | Kategori | Kebutuhan |
|---|---|---|
| NFR-01 | Bahasa | Mengikuti konvensi penamaan di bagian 2.1: nama entitas bahasa Inggris, selebihnya bahasa Indonesia. |
| NFR-02 | Perangkat | Desktop-first. Semua halaman tidak rusak di HP; tabel lebar dan elevation rack boleh digeser di dalam kotaknya sendiri. Empat halaman dioptimalkan untuk HP (lebar 375px): detail device (tujuan QR), Tugas saya, detail WO, dan dashboard. |
| NFR-03 | Browser | Chrome dan Edge versi terbaru di desktop; Chrome Android dan Safari iOS di HP. |
| NFR-04 | Keamanan | Password disimpan dalam bentuk hash. Hak akses diperiksa di server untuk setiap aksi. Tidak ada halaman yang dapat diakses tanpa login selain halaman login. |
| NFR-05 | Performa | Dengan data seed, setiap halaman tampil kurang dari 2 detik. |
| NFR-06 | Keandalan | Cron idempoten: dijalankan berulang kali di hari yang sama tidak menghasilkan WO atau notifikasi ganda. |
| NFR-07 | Keterujian | Setiap AC bertanda Must memiliki minimal satu tes otomatis. Aturan BR-01 s.d. BR-03, BR-05, BR-08 s.d. BR-11, dan BR-16 memiliki unit test. |
| NFR-08 | Data demo | Tersedia seed script yang mengembalikan database ke data demo standar dengan satu perintah. |

---

## 10. Asumsi

1. Data dimasukkan manual oleh Admin atau lewat seed. Sistem tidak membaca data langsung dari device fisik (discovery/telemetri); simulasinya menjadi fitur Could (US-SIM-01).
2. Performa diuji dengan data sampai 20 rack dan 500 device di satu site kampus. Sistem tidak membatasi jumlah data.
3. Desain jaringan di data demo memakai pola Top-of-Rack, sehingga server tersambung langsung ke switch tanpa melewati patch panel.
4. Penggantian unit dicatat sebagai WO korektif; Admin mengubah device lama menjadi Pensiun dan mendaftarkan unit baru secara manual.
5. Satu user memiliki tepat satu peran.
6. Hierarki lokasi tetap tiga tingkat (site → room → rack). Lokasi bersarang bebas seperti di NetBox tidak dibutuhkan untuk ruang server satu kampus.

---

## 11. Risiko dan area rawan

Area berikut paling mungkin salah tanpa terlihat, sehingga wajib diuji paling lengkap dan direview dengan cermat saat tahap Build.

| ID | Area | Kenapa rawan | Mitigasi |
|---|---|---|---|
| R1 | Validasi posisi rack (BR-01 s.d. BR-03, US-DEV-02 AC9) | Banyak kombinasi: tinggi, sisi, kedalaman, batas rack, pemindahan | Unit test untuk setiap kombinasi pada US-DEV-02 |
| R2 | Cron pembuatan WO dan notifikasi (US-WO-01, US-NOTIF-01/02) | Duplikasi WO atau notifikasi, salah zona waktu, gagal diam-diam | Idempotensi (BR-08, NFR-06), tes dengan tanggal yang dikendalikan, log hasil setiap eksekusi |
| R3 | Sinkronisasi status device (BR-11, BR-16) | Beberapa WO bersamaan, pembatalan, dan perubahan status bisa membuat status salah | Tes khusus untuk US-WO-04 AC5, AC8, dan US-DEV-03 AC3, AC5 |
| R4 | Query impact analysis (US-IMP) | Arah cable dua sisi (A↔B) mudah terlewat sebelah | Tes integrasi dengan seed: hasil harus sama dari sisi mana pun |
| R5 | Scope melebar | Banyak fitur bonus yang menarik | Kerjakan Should/Could hanya setelah semua Must lulus tes |
| R6 | Pengetahuan terpusat pada satu pengembang | Anggota tim lain sulit menjelaskan saat presentasi | Setiap sesi dicatat di `docs/devlog.md` |

---

## 12. Rencana rilis

| Rilis | Isi | Syarat selesai |
|---|---|---|
| **R1: Inventaris** | E1, E2, E3, E4, E5, US-SRCH-01, US-AUD-01 | Semua AC lulus tes; seed data inventaris tersedia |
| **R2: Maintenance** | E6 (Must), E7 (Must), E8 (Must), US-DASH-01 | Semua AC lulus tes; cron berjalan di Vercel |
| **R3: Penyempurnaan** | Semua Should | Semua AC Should lulus tes |
| **R4: Bonus** | Could, dipilih sesuai sisa waktu | — |

---

## 13. Lampiran A: Skenario data demo (seed)

**Lokasi:** Site "Kampus Utama" → room "Ruang Server Gedung A" → 4 rack 42U: `RK-A01` s.d. `RK-A04`.

**Device (sekitar 20):**
- Setiap rack: 1 switch ToR (half-depth, sisi belakang, U42), 2 PDU 0U (PDU-A dan PDU-B), 3-4 server full-depth.
- `RK-A01` juga berisi core switch dan firewall; `RK-A04` berisi patch panel dan storage.
- Device tanpa rack (berdiri di lantai room): 1 UPS, 2 CRAC.
- 2 device berstatus Stok (tanpa penempatan) dan 1 device Pensiun.

**Cable (sekitar 40):** setiap server ke switch ToR (data); setiap server dengan dua power inlet ke PDU-A dan PDU-B (daya, redundan); switch ToR ke core switch.

**Maintenance plan:** cek baterai UPS (3 bulan), bersihkan filter CRAC (1 bulan), update firmware switch (6 bulan), cek fisik server (3 bulan). Data diatur agar saat demo ada WO dengan tenggat minggu ini, satu WO terlambat, satu WO preventif tanpa teknisi, dan satu device dengan garansi habis bulan ini.

**User:** 1 Admin; 2 Teknisi (IT dan Fasilitas); 1 Viewer.

---

## 14. Lampiran B: Riwayat keputusan

| No | Keputusan | Pilihan |
|---|---|---|
| 1 | Format kebutuhan | User story + Given/When/Then |
| 2 | Posisi rack | U + sisi depan/belakang + full-depth; 0U tanpa posisi |
| 3 | Input device | Model dengan port template |
| 4 | Model cable | Port ke port langsung; trace patch panel = Could |
| 5 | Sambungan listrik | Data dan daya dalam satu model port/cable |
| 6 | Identitas aset | Nama + asset tag otomatis + serial number |
| 7 | Jadwal maintenance | Maintenance plan berulang + WO otomatis (cron) + checklist; foto Cloudinary = Could |
| 8 | Status WO | Terjadwal → Dikerjakan → Selesai/Dibatalkan; Terlambat dihitung; status device tersinkron |
| 9 | Objek maintenance | Semua device; penugasan berdasarkan kategori device function (IT/Fasilitas) dan keahlian teknisi; vendor eksternal = Could |
| 10 | Hak akses | Admin kelola data; Teknisi mengerjakan WO; Viewer melihat |
| 11 | Login | Email + password, akun dibuat Admin |
| 12 | Akses QR | Wajib login; cetak massal = Should |
| 13 | Impact analysis | Di detail device + saat membuat WO; graf = Could |
| 14 | Audit log | Dengan data sebelum dan sesudah |
| 15 | Bahasa | Diganti oleh keputusan 21 |
| 16 | Perangkat | Desktop-first; 4 halaman dioptimalkan untuk HP |
| 17 | Data demo | Seed script realistis |
| 18 | Data pembelian | Tanggal beli, vendor (teks), akhir garansi; semua opsional |
| 19 | Batas waktu WO | Istilah "tenggat" = tanggal paling lambat WO selesai |
| 20 | Jenis WO | Satu WO satu jenis (EN 13306): Preventif dari maintenance plan, Korektif manual; checklist korektif opsional; WO lanjutan = Could |
| 21 | Penamaan | Nama entitas bahasa Inggris (Site, Room, Rack, Device, Device function, Cable, Maintenance plan, Work order, User, dst.); selebihnya bahasa Indonesia |
| 22 | Nomor WO | Otomatis `WO-0001`, permanen; judul WO korektif diisi Admin |
| 23 | WO untuk device Stok/Pensiun | Tidak boleh; device ke Stok/Pensiun membatalkan WO Terjadwal-nya |
| 24 | Notifikasi Admin | WO preventif tanpa teknisi; WO terlambat |
| 25 | Device tanpa rack | Device Aktif wajib punya room; rack opsional |
| 26 | IP management | Dipindah ke Could |

---

## 15. Lampiran C: Daftar field per entitas

Satu-satunya acuan field. Design Spec merujuk lampiran ini untuk isi form dan modal; Technical Spec merujuknya untuk skema database. Field baru ditambahkan di sini lebih dulu.

**Keterangan:** **W** = wajib diisi user; **O** = opsional; **S** = diisi sistem (tidak bisa diisi user).

### Site
| Field | Sifat | Keterangan |
|---|:---:|---|
| Nama | W | Unik |

### Room
| Field | Sifat | Keterangan |
|---|:---:|---|
| Nama | W | Unik di dalam site yang sama |
| Site | W | |

### Rack
| Field | Sifat | Keterangan |
|---|:---:|---|
| Nama | W | Unik di dalam room yang sama |
| Room | W | |
| Tinggi | W | Dalam U, bawaan 42 |

### Manufacturer
| Field | Sifat | Keterangan |
|---|:---:|---|
| Nama | W | Unik |

### Device function
| Field | Sifat | Keterangan |
|---|:---:|---|
| Nama | W | Unik |
| Kategori | W | IT atau Fasilitas |

### Model
| Field | Sifat | Keterangan |
|---|:---:|---|
| Manufacturer | W | |
| Nama | W | Unik untuk manufacturer yang sama |
| Tinggi | W | Dalam U; 0 untuk device 0U |
| Full-depth | W | Ya/tidak; tidak berlaku untuk 0U |
| Daya maksimum | O | Dalam watt |

### Port template (bagian dari model)
| Field | Sifat | Keterangan |
|---|:---:|---|
| Nama | W | Unik di dalam model yang sama |
| Jenis | W | Data, power inlet, atau power outlet |
| Tipe konektor | O | Misalnya RJ45, SFP+, C13, C14 |

### Device
| Field | Sifat | Keterangan |
|---|:---:|---|
| Asset tag | S | `DCM-0001`, permanen |
| Nama | W | Unik |
| Model | W | Tidak dapat diubah setelah dibuat (port sudah terbentuk dari model) |
| Device function | W | |
| Serial number | O | Unik bila diisi |
| Status | W | Stok, Aktif, Pensiun; Maintenance diatur sistem |
| Room | W bila Aktif | Kosong bila Stok/Pensiun (BR-05) |
| Rack | O | Hanya bila punya room; kosong = berdiri di lantai room |
| Sisi | W bila di rack dan bukan 0U | Depan atau belakang |
| Posisi U | W bila di rack dan bukan 0U | U terbawah yang ditempati |
| Tanggal beli | O | |
| Vendor | O | Teks |
| Akhir garansi | O | |

### Port (dibuat dari port template saat device dibuat)
| Field | Sifat | Keterangan |
|---|:---:|---|
| Device | S | |
| Nama, jenis, tipe konektor | S | Disalin dari port template |

### Cable
| Field | Sifat | Keterangan |
|---|:---:|---|
| Port A | W | |
| Port B | W | |
| Label | W | Unik |
| Tipe | W | Cat6, Fiber, DAC, atau Power |
| Warna | O | |
| Panjang | O | Dalam meter |

### Maintenance plan
| Field | Sifat | Keterangan |
|---|:---:|---|
| Judul | W | Disalin menjadi judul WO preventif |
| Device | W | Hanya device Aktif atau Maintenance |
| Interval | W | Angka + satuan (hari, minggu, bulan) |
| Tenggat berikutnya | W | Diisi user sebagai tenggat pertama; selanjutnya diperbarui sistem (BR-09) |
| Teknisi bawaan | O | Tersaring sesuai keahlian |
| Checklist | W | Minimal satu item; disalin ke setiap WO preventif |
| Aktif | S | Diubah lewat aksi aktifkan/nonaktifkan |

### Work order
| Field | Sifat | Keterangan |
|---|:---:|---|
| Nomor | S | `WO-0001`, permanen |
| Jenis | S | Preventif (dari cron) atau Korektif (dari form) |
| Judul | W (korektif) / S (preventif) | Preventif: disalin dari maintenance plan |
| Device | W (korektif) / S (preventif) | |
| Maintenance plan asal | S | Hanya untuk preventif |
| Deskripsi masalah | W (korektif) | Tidak ada pada preventif |
| Tenggat | W (korektif) / S (preventif) | |
| Teknisi | O | Wajib terisi sebelum WO dapat dimulai |
| Checklist | O (korektif) / S (preventif) | Item beserta status dicentang |
| Status | S | Terjadwal, Dikerjakan, Selesai, Dibatalkan |
| Catatan hasil | W saat menyelesaikan | |
| Alasan pembatalan | W saat membatalkan | |
| Waktu selesai | S | |
| Dibuat oleh, waktu dibuat | S | User Admin atau "Sistem" |

### User
| Field | Sifat | Keterangan |
|---|:---:|---|
| Nama | W | |
| Email | W | Unik, dipakai login |
| Password | W saat dibuat | Disimpan sebagai hash |
| Peran | W | Admin, Teknisi, atau Viewer |
| Keahlian | W bila Teknisi | IT, Fasilitas, atau Keduanya |
| Aktif | S | Diubah lewat aksi aktifkan/nonaktifkan |

### Notifikasi (dibuat sistem)
| Field | Sifat | Keterangan |
|---|:---:|---|
| Penerima | S | |
| Jenis | S | Penugasan, pengingat tenggat, WO tanpa teknisi, WO terlambat |
| WO terkait | S | |
| Waktu | S | |
| Sudah dibaca | S | |

### Audit log (dibuat sistem)
| Field | Sifat | Keterangan |
|---|:---:|---|
| Waktu, pelaku, aksi | S | Pelaku = user atau "Sistem" |
| Jenis dan identitas objek | S | |
| Data sebelum, data sesudah | S | |

---

## 16. Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 4 Okt 2026 | Draft awal dari 17 keputusan |
| 0.2 | 5 Okt 2026 | Tambah metrik M6 (WO dari HP < 2 menit); "Role" perangkat menjadi Fungsi Perangkat; matriks akses dipisah untuk Admin dan Teknisi; status Dipesan dihapus; aturan hapus device dan rencana (US-DEV-05, US-MP-01 AC4, BR-14); AC WO-04 AC6 diperjelas; BR-10 ditulis tanpa simbol; NFR-02 diperluas; asumsi skala diperjelas; tambah US-SIM-01 (Could); glosarium ditambah |
| 0.3 | 8 Okt 2026 | **Penamaan:** konvensi baru (bagian 2.1), nama entitas bahasa Inggris (Room, Rack, Cable, Device function, Maintenance plan, User), "jatuh tempo"/"tanggal target" diseragamkan menjadi "tenggat". **Baru:** Lampiran C daftar field per entitas; US-WO-06 nomor WO dan asal-usul WO; US-WO-07 WO lanjutan (Could); US-NOTIF-02 notifikasi Admin; US-NOTIF-03 pengelolaan notifikasi (dipisah dari NOTIF-01); BR-15 s.d. BR-17; device tanpa rack (US-DEV-02 AC8, BR-05). **Diperjelas:** glosarium garansi, vendor, preventif/korektif (EN 13306), nomor WO, tenggat; data pembelian opsional (US-DEV-01 AC5); serial number opsional; WO dan maintenance plan hanya untuk device Aktif/Maintenance, dan device ke Stok/Pensiun membatalkan WO Terjadwal-nya (US-DEV-03 AC3, AC5, BR-16); judul WO korektif wajib; checklist WO korektif opsional; WO tanpa teknisi tidak dapat dimulai; ganti teknisi (US-WO-03 AC3); pemindahan device (US-DEV-02 AC9); perubahan port template tidak memengaruhi device lama (US-CAT-02 AC4); hapus site dan model (US-LOC-01 AC3, US-CAT-02 AC5); tinggi rack tidak boleh lebih kecil dari isinya (US-RAK-01 AC4); cron mengejar hari yang terlewat (US-WO-01 AC4); BR-09 juga berlaku saat WO preventif dibatalkan. **Prioritas:** IP management dari kurung di Won't menjadi Could (penulisan lama ambigu); mode gelap dan pemindai QR di aplikasi masuk Could |
