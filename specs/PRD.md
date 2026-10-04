# PRD: Server Room Asset & Maintenance Management System

| | |
|---|---|
| Versi | 0.1 (draft, menunggu review) |
| Tanggal | 4 Oktober 2026 |
| Sumber | [`intent/asset-maintenance.md`](../intent/asset-maintenance.md) |
| Tahap SDLC | Design |
| Dokumen berikutnya | `specs/design.md` (Design Spec), `specs/tech.md` (Technical Spec) |

---

## 1. Ringkasan

Aplikasi web untuk mengelola aset fisik ruang server data center kampus: lokasi dan rak, perangkat, perkabelan data dan listrik, serta jadwal maintenance. Pembeda utama dari tools inventaris seperti NetBox adalah **modul maintenance terjadwal** yang terhubung langsung dengan data inventaris, ditambah **impact analysis** (melihat perangkat terdampak sebelum maintenance) dan **QR code** pada label aset.

---

## 2. Glosarium

| Istilah | Arti |
|---|---|
| **Rak** | Lemari standar 19 inci tempat perangkat dipasang. Tingginya diukur dalam U. |
| **U (Rack Unit)** | Satuan tinggi rak, 1U = 4,45 cm. Rak standar 42U. Penomoran dari bawah (U1 paling bawah). |
| **Sisi rak** | Depan atau belakang. Perangkat half-depth hanya memakai satu sisi; full-depth memakai keduanya. |
| **0U** | Perangkat yang dipasang di samping rak tanpa memakai slot U, misalnya PDU vertikal. |
| **Device** | Setiap perangkat fisik yang dicatat: server, switch, patch panel, PDU, UPS, AC presisi (CRAC). |
| **Model (Device Type)** | Template perangkat, misalnya "Dell PowerEdge R650": tinggi U, kedalaman, daya, dan daftar port. |
| **Role** | Fungsi perangkat (Server, Switch, PDU, UPS, CRAC, dll.), masing-masing berkategori IT atau Fasilitas. |
| **Port** | Titik sambung pada perangkat. Jenisnya: data, power inlet (colokan masuk daya), power outlet (stopkontak keluar daya). |
| **Kabel** | Sambungan antara dua port. |
| **PDU** | Power Distribution Unit, "stopkontak cerdas" di rak yang membagi listrik ke perangkat. |
| **UPS** | Uninterruptible Power Supply, baterai cadangan saat listrik padam. |
| **CRAC** | Computer Room Air Conditioner, AC presisi ruang server. |
| **ToR (Top-of-Rack)** | Desain jaringan dengan satu switch di bagian atas setiap rak; server di rak itu disambung langsung ke switch tersebut. |
| **Patch panel** | Papan berisi port untuk merapikan kabel. Port depan tembus ke port belakang dengan nomor yang sama. |
| **Trace** | Menelusuri jalur kabel dari ujung ke ujung. |
| **Asset tag** | Kode unik permanen tiap device (misalnya `DCM-0001`), dicetak di QR. |
| **Rencana maintenance** | Jadwal berulang, misalnya "Cek baterai UPS-01 setiap 3 bulan". |
| **Work order (WO)** | Satu tugas maintenance untuk satu perangkat, ditugaskan ke teknisi. |
| **Preventif / Korektif** | Preventif = perawatan berkala terjadwal. Korektif = perbaikan saat ada kerusakan, termasuk penggantian unit. |
| **Cron** | Program yang berjalan otomatis sesuai jadwal (di sini: setiap hari pukul 07.00 WIB). |
| **Impact analysis** | Daftar perangkat yang ikut terdampak bila satu perangkat dimatikan atau di-maintenance. |
| **Audit log** | Catatan siapa mengubah apa, kapan, beserta data sebelum dan sesudahnya. |
| **MoSCoW** | Metode prioritas: Must (wajib), Should (penting, setelah Must), Could (bonus), Won't (tidak dikerjakan kali ini). |
| **Given/When/Then** | Format acceptance criteria: Given = kondisi awal, When = aksi, Then = hasil yang diharapkan. |

---

## 3. Masalah dan tujuan

**Masalah**
1. Data aset tersebar di spreadsheet dan terpisah dari jadwal maintenance.
2. Posisi perangkat dan sambungan kabel tidak sesuai kondisi fisik.
3. Jadwal perawatan dan masa garansi terlewat karena tidak ada pengingat.
4. Tidak ada cara cepat mengetahui perangkat yang terdampak saat satu perangkat di-maintenance.

**Tujuan produk**
- **T1.** Satu sumber data yang akurat untuk lokasi, perangkat, dan sambungan di ruang server.
- **T2.** Tidak ada maintenance yang terlewat tanpa diketahui.
- **T3.** Dampak maintenance diketahui sebelum pekerjaan dimulai.
- **T4.** Informasi aset dapat diakses di lapangan dengan memindai label.

---

## 4. Metrik sukses

| ID | Metrik | Target | Cara membuktikan |
|---|---|---|---|
| M1 | Waktu menemukan lokasi perangkat | < 30 detik | Demo: pencarian atau pindai QR → halaman detail menampilkan site, ruangan, rak, U |
| M2 | Pemasangan device bertabrakan yang lolos | 0% | Unit test + E2E untuk semua skenario tabrakan |
| M3 | Maintenance jatuh tempo tanpa pengingat | 0 | Tes cron: WO dan notifikasi terbentuk paling lambat H-3 |
| M4 | Kelengkapan impact analysis (satu lompatan) | 100% perangkat yang terhubung langsung tampil | Tes integrasi dengan data seed |
| M5 | Test case blackbox valid saat demo | 100% | Tabel Bab IV + laporan Playwright |

---

## 5. Persona

### Admin Data Center (Pak Andi, staf IT kampus)
Mengelola seluruh data: lokasi, rak, perangkat, kabel, pengguna, dan rencana maintenance. **Kebutuhan:** data rapi dan akurat, mudah melihat kapasitas rak, tahu siapa mengubah apa.

### Teknisi (Rina, teknisi IT; Joko, teknisi fasilitas)
Mengerjakan maintenance di ruang server, sering dari HP. **Kebutuhan:** daftar tugas yang jelas, checklist, dan akses cepat ke info perangkat di depan rak.

### Viewer (Bu Sari, kepala UPT TIK)
Memantau kondisi tanpa mengubah data. **Kebutuhan:** ringkasan utilisasi rak, maintenance yang terlambat, dan garansi yang hampir habis.

### Matriks hak akses

| Aksi | Admin | Teknisi | Viewer |
|---|:---:|:---:|:---:|
| Lihat semua data (lokasi, rak, device, kabel, maintenance, dashboard) | ✅ | ✅ | ✅ |
| Kelola lokasi, rak, katalog, device, port, kabel | ✅ | ❌ | ❌ |
| Kelola rencana maintenance, buat WO korektif, tugaskan WO | ✅ | ❌ | ❌ |
| Mulai, isi checklist, dan selesaikan WO **yang ditugaskan kepadanya** | ✅ | ✅ | ❌ |
| Batalkan WO | ✅ | ❌ | ❌ |
| Kelola pengguna | ✅ | ❌ | ❌ |
| Lihat audit log | ✅ | ❌ | ❌ |

---

## 6. Scope dan prioritas (MoSCoW)

| Prioritas | Fitur |
|---|---|
| **Must** | Login + role; manajemen pengguna; Site → Ruangan → Rak; elevation rak; katalog Manufacturer/Model/Role; device dengan validasi posisi; port otomatis dari model; kabel data dan daya; rencana maintenance berulang; WO preventif otomatis (cron) dan korektif manual; checklist; penugasan berdasarkan keahlian; notifikasi in-app; impact analysis satu lompatan; QR per device; pencarian; dashboard; audit log; seed data |
| **Should** | Cetak label QR massal (satu lembar A4); indikator jalur daya cadangan pada impact analysis; tampilan kalender maintenance |
| **Could** | Foto bukti maintenance (Cloudinary); trace kabel menembus patch panel; visual graf topologi; persetujuan WO; vendor eksternal; import CSV; notifikasi email; impact analysis berantai |
| **Won't** | IPAM penuh (cukup satu kolom IP management); virtualisasi; VPN; wireless; circuits; discovery otomatis; monitoring real-time (suhu, beban) |

---

## 7. User stories dan acceptance criteria

Setiap acceptance criteria (AC) menjadi minimal satu test case blackbox di Bab IV.

### E1. Autentikasi dan pengguna

**US-AUTH-01 (Must)** Sebagai pengguna, saya ingin login dengan email dan password agar hanya orang berwenang yang bisa mengakses data.
- **AC1:** Given akun aktif, When login dengan email dan password benar, Then masuk ke dashboard.
- **AC2:** Given akun aktif, When password salah, Then muncul pesan "Email atau password salah" tanpa menyebut bagian mana yang salah.
- **AC3:** Given akun dinonaktifkan, When login dengan kredensial benar, Then login ditolak.
- **AC4:** Given belum login, When membuka halaman mana pun selain login, Then diarahkan ke halaman login.
- **AC5:** Tidak ada halaman pendaftaran mandiri.

**US-AUTH-02 (Must)** Sebagai Admin, saya ingin membuat dan mengelola akun agar setiap orang punya akses sesuai perannya.
- **AC1:** Given login sebagai Admin, When membuat pengguna dengan nama, email, password awal, role, dan keahlian (untuk Teknisi: IT / Fasilitas / Keduanya), Then akun tersimpan dan bisa dipakai login.
- **AC2:** Given email sudah terdaftar, When membuat pengguna dengan email yang sama, Then ditolak dengan pesan email sudah dipakai.
- **AC3:** Given pengguna ada, When Admin menonaktifkan akunnya, Then pengguna itu tidak bisa login lagi dan sesi aktifnya berakhir.
- **AC4:** Given login sebagai Teknisi atau Viewer, When membuka halaman kelola pengguna, Then akses ditolak.

**US-AUTH-03 (Must)** Sebagai sistem, saya harus menegakkan hak akses di sisi server, bukan hanya menyembunyikan tombol.
- **AC1:** Given login sebagai Teknisi, When mengirim permintaan hapus device langsung ke server (tanpa lewat tombol), Then permintaan ditolak.

### E2. Lokasi dan rak

**US-LOC-01 (Must)** Sebagai Admin, saya ingin mencatat site dan ruangan agar setiap rak punya lokasi jelas.
- **AC1:** Given login sebagai Admin, When membuat site "Kampus Utama" lalu ruangan "Ruang Server Gedung A" di dalamnya, Then keduanya tersimpan dengan relasi yang benar.
- **AC2:** Given ruangan masih berisi rak, When Admin menghapus ruangan itu, Then ditolak dengan pesan ruangan masih berisi rak.

**US-RAK-01 (Must)** Sebagai Admin, saya ingin mencatat rak beserta tingginya.
- **AC1:** When membuat rak dengan nama, ruangan, dan tinggi (default 42U), Then rak tersimpan.
- **AC2:** Given nama rak sudah ada di ruangan yang sama, When membuat rak dengan nama itu, Then ditolak.
- **AC3:** Given rak masih berisi device, When Admin menghapus rak, Then ditolak.

**US-RAK-02 (Must)** Sebagai pengguna, saya ingin melihat elevation rak (tampak depan dan belakang) agar tahu slot mana yang terisi dan kosong.
- **AC1:** Given rak berisi device, When membuka halaman rak, Then tampil dua kolom (depan dan belakang) dari U tertinggi ke U1, dengan device di posisinya masing-masing.
- **AC2:** Device full-depth tampil di kedua sisi; device half-depth hanya di sisinya.
- **AC3:** Ringkasan rak menampilkan jumlah U terpakai, U kosong, dan persentase utilisasi.
- **AC4:** Device 0U tampil di daftar terpisah "Terpasang 0U".
- **AC5:** Klik device di elevation membuka halaman detail device.

### E3. Katalog

**US-CAT-01 (Must)** Sebagai Admin, saya ingin mengelola manufacturer dan role.
- **AC1:** When membuat role, Then wajib memilih kategori IT atau Fasilitas.
- **AC2:** Given manufacturer atau role masih dipakai, When dihapus, Then ditolak.

**US-CAT-02 (Must)** Sebagai Admin, saya ingin membuat model perangkat beserta template port agar tidak perlu mengisi spesifikasi berulang kali.
- **AC1:** When membuat model dengan manufacturer, nama, tinggi U (0 untuk 0U), full-depth ya/tidak, dan daya maksimum (watt), Then model tersimpan.
- **AC2:** When menambahkan template port (nama, jenis: data / power inlet / power outlet, tipe konektor), Then template tersimpan pada model.
- **AC3:** Given nama port sudah ada pada model yang sama, When menambahkan nama itu lagi, Then ditolak.

### E4. Device

**US-DEV-01 (Must)** Sebagai Admin, saya ingin mendaftarkan device dari sebuah model agar port-portnya terbentuk otomatis.
- **AC1:** When membuat device dengan nama, model, role, serial number, status, tanggal beli, vendor, dan akhir garansi, Then device tersimpan dan port-port dari template model terbentuk otomatis.
- **AC2:** Device baru otomatis mendapat asset tag berurutan (`DCM-0001`, `DCM-0002`, ...).
- **AC3:** Given nama atau serial number sudah dipakai device lain, When disimpan, Then ditolak.
- **AC4:** Asset tag tidak dapat diubah oleh siapa pun setelah dibuat.

**US-DEV-02 (Must)** Sebagai Admin, saya ingin memasang device ke rak pada posisi dan sisi tertentu dengan validasi otomatis.
- **AC1:** Given U10 sisi depan kosong, When memasang device half-depth 1U di U10 sisi depan, Then berhasil.
- **AC2:** Given device full-depth menempati U10, When memasang device apa pun di U10 sisi mana pun, Then ditolak dengan pesan yang menyebut device yang bertabrakan.
- **AC3:** Given device half-depth di U10 sisi belakang, When memasang device half-depth di U10 sisi depan, Then berhasil.
- **AC4:** Given device half-depth di U10 sisi belakang, When memasang device full-depth di U10, Then ditolak.
- **AC5:** Given rak 42U, When memasang device 2U di U42, Then ditolak karena melebihi tinggi rak.
- **AC6:** Given model 0U, When dipasang ke rak, Then tidak diminta posisi U dan tampil di daftar 0U.
- **AC7:** Given device 2U, When dipasang di U5, Then device menempati U5 dan U6 (posisi = U terbawah).

**US-DEV-03 (Must)** Sebagai Admin, saya ingin mengubah status device sesuai siklus hidupnya.
- **AC1:** Status yang tersedia: Dipesan, Stok, Aktif, Maintenance, Pensiun.
- **AC2:** Given device berstatus Dipesan, Stok, atau Pensiun, When dipasang ke rak, Then ditolak. Hanya device Aktif atau Maintenance yang boleh menempati rak.
- **AC3:** Given device terpasang di rak, When statusnya diubah menjadi Pensiun, Then posisi raknya dikosongkan, kabelnya dilepas, dan rencana maintenance aktifnya dinonaktifkan, setelah konfirmasi yang menyebutkan dampaknya.
- **AC4:** Status Maintenance tidak dapat dipilih manual; status ini hanya diatur otomatis oleh work order (lihat US-WO-04).

**US-DEV-04 (Must)** Sebagai pengguna, saya ingin melihat halaman detail device.
- **AC1:** Halaman menampilkan identitas (nama, asset tag, serial), model, role, status, lokasi lengkap (site, ruangan, rak, U, sisi), data pembelian dan garansi, daftar port beserta sambungannya, perangkat terhubung (impact analysis), rencana maintenance, riwayat WO, dan QR code.
- **AC2:** Given garansi berakhir dalam 30 hari atau kurang, Then tampil penanda "Garansi segera habis"; jika sudah lewat, tampil "Garansi habis".

### E5. Port dan kabel

**US-CAB-01 (Must)** Sebagai Admin, saya ingin menyambungkan dua port dengan kabel.
- **AC1:** When memilih port A dan port B serta mengisi label, tipe kabel (Cat6, Fiber, DAC, Power), warna, dan panjang, Then kabel tersimpan dan tampil di kedua port.
- **AC2:** Given port sudah tersambung, When disambungkan lagi ke kabel lain, Then ditolak.
- **AC3:** When menyambung port data ke port power, Then ditolak.
- **AC4:** Kabel daya hanya boleh menyambung power inlet ke power outlet; inlet ke inlet atau outlet ke outlet ditolak.
- **AC5:** When menyambung dua port pada device yang sama, Then ditolak.
- **AC6:** Given label kabel sudah dipakai, When disimpan dengan label yang sama, Then ditolak.

**US-CAB-02 (Must)** Sebagai Admin, saya ingin melepas atau mengubah kabel.
- **AC1:** When kabel dihapus, Then kedua port kembali kosong.

### E6. Maintenance

**US-MP-01 (Must)** Sebagai Admin, saya ingin membuat rencana maintenance berulang untuk sebuah device.
- **AC1:** When membuat rencana dengan judul, device, interval (angka + satuan hari/minggu/bulan), tanggal jatuh tempo pertama, teknisi default (opsional), dan daftar checklist, Then rencana tersimpan dan aktif.
- **AC2:** Given device berstatus Pensiun, When membuat rencana untuknya, Then ditolak.
- **AC3:** Admin dapat menonaktifkan rencana; rencana nonaktif tidak menghasilkan WO baru.

**US-WO-01 (Must)** Sebagai sistem, saya harus membuat WO preventif otomatis agar tidak ada jadwal yang terlewat.
- **AC1:** Given rencana aktif jatuh tempo 3 hari lagi atau kurang dan belum punya WO terbuka, When cron harian berjalan, Then satu WO preventif dibuat dengan status Terjadwal, tanggal jatuh tempo dari rencana, checklist disalin dari rencana, dan teknisi default (jika ada).
- **AC2:** Given cron sudah berjalan hari ini, When cron dijalankan lagi, Then tidak ada WO ganda.
- **AC3:** Given rencana sudah punya WO yang belum Selesai atau Dibatalkan, When cron berjalan, Then tidak dibuat WO baru untuk rencana itu.

**US-WO-02 (Must)** Sebagai Admin, saya ingin membuat WO korektif secara manual saat ada kerusakan.
- **AC1:** When membuat WO dengan jenis Korektif, device, deskripsi masalah, tanggal target, dan teknisi, Then WO tersimpan dengan status Terjadwal.

**US-WO-03 (Must)** Sebagai Admin, saya ingin menugaskan WO hanya ke teknisi dengan keahlian yang sesuai.
- **AC1:** Given device ber-role kategori Fasilitas (misalnya CRAC), When memilih teknisi, Then daftar hanya berisi teknisi berkeahlian Fasilitas atau Keduanya.
- **AC2:** Given device ber-role kategori IT, When memilih teknisi, Then daftar hanya berisi teknisi berkeahlian IT atau Keduanya.

**US-WO-04 (Must)** Sebagai Teknisi, saya ingin memperbarui status WO yang ditugaskan kepada saya.
- **AC1:** Alur status: Terjadwal → Dikerjakan → Selesai. Admin dapat mengubah Terjadwal atau Dikerjakan menjadi Dibatalkan dengan alasan wajib diisi.
- **AC2:** Given WO Terjadwal, When teknisi menekan "Mulai", Then status menjadi Dikerjakan dan status device menjadi Maintenance.
- **AC3:** Given WO Dikerjakan dan semua item checklist dicentang, When teknisi menekan "Selesai" dan mengisi catatan hasil, Then status menjadi Selesai, waktu selesai tercatat, dan status device kembali Aktif.
- **AC4:** Given masih ada item checklist yang belum dicentang, When menekan "Selesai", Then ditolak.
- **AC5:** Given device punya dua WO berstatus Dikerjakan, When salah satunya selesai, Then status device tetap Maintenance sampai semua WO yang Dikerjakan selesai.
- **AC6:** Given WO ditugaskan ke teknisi lain, When teknisi ini mencoba memperbaruinya, Then ditolak.
- **AC7:** Given WO preventif Selesai, Then tanggal jatuh tempo berikutnya pada rencana = tanggal jatuh tempo WO tersebut + interval (bukan tanggal penyelesaian).

**US-WO-05 (Must)** Sebagai pengguna, saya ingin melihat WO yang terlambat.
- **AC1:** Given tanggal jatuh tempo sudah lewat dan status bukan Selesai atau Dibatalkan, Then WO ditandai "Terlambat" di semua tampilan. Penanda dihitung saat ditampilkan, tidak disimpan sebagai status.
- **AC2:** Daftar WO dapat difilter berdasarkan status, jenis, teknisi, dan terlambat.
- **AC3:** Teknisi memiliki tampilan "Tugas saya" yang hanya menampilkan WO miliknya.

**US-NOTIF-01 (Must)** Sebagai Teknisi, saya ingin menerima notifikasi di aplikasi.
- **AC1:** When WO ditugaskan kepada saya, Then saya menerima notifikasi.
- **AC2:** Given WO saya jatuh tempo 3 hari lagi, When cron harian berjalan, Then saya menerima notifikasi pengingat (sekali per WO).
- **AC3:** Ikon lonceng menampilkan jumlah notifikasi belum dibaca; notifikasi dapat ditandai sudah dibaca.

**US-CAL-01 (Should)** Sebagai pengguna, saya ingin melihat WO dalam tampilan kalender bulanan.

**US-PHOTO-01 (Could)** Sebagai Teknisi, saya ingin mengunggah foto bukti saat menyelesaikan WO (Cloudinary).

### E7. Impact analysis

**US-IMP-01 (Must)** Sebagai pengguna, saya ingin melihat perangkat yang terhubung langsung ke sebuah device.
- **AC1:** Given device punya kabel ke device lain, When membuka halaman detailnya, Then tampil daftar perangkat terhubung, dikelompokkan menjadi Data dan Daya, beserta port asal dan port tujuan.
- **AC2:** Given device tidak punya kabel, Then tampil "Tidak ada perangkat terhubung".

**US-IMP-02 (Must)** Sebagai Admin, saya ingin melihat dampak sebelum menyimpan WO.
- **AC1:** Given device punya perangkat terhubung, When membuat atau menjadwalkan WO untuknya, Then sebelum disimpan tampil peringatan berisi daftar perangkat terdampak dan jumlahnya.
- **AC2:** Admin tetap dapat menyimpan WO setelah melihat peringatan.

**US-IMP-03 (Should)** Sebagai Admin, saya ingin tahu apakah perangkat terdampak masih punya jalur daya cadangan.
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
- **AC1:** When memilih beberapa device (atau semua device dalam satu rak) lalu memilih "Cetak label", Then tampil halaman siap cetak berisi label tersusun dalam grid di kertas A4.

### E9. Dashboard dan pencarian

**US-DASH-01 (Must)** Sebagai pengguna, saya ingin melihat ringkasan kondisi ruang server.
- **AC1:** Dashboard menampilkan: jumlah device per status; utilisasi setiap rak (% U terpakai); WO jatuh tempo 7 hari ke depan; WO terlambat; device dengan garansi habis dalam 30 hari.
- **AC2:** Setiap angka atau item dapat diklik menuju daftar terkait.

**US-SRCH-01 (Must)** Sebagai pengguna, saya ingin mencari device dengan cepat.
- **AC1:** When mengetik sebagian nama, asset tag, atau serial number di kolom pencarian, Then tampil device yang cocok beserta lokasinya.

### E10. Audit log

**US-AUD-01 (Must)** Sebagai Admin, saya ingin melihat riwayat perubahan data.
- **AC1:** Setiap pembuatan, perubahan, dan penghapusan pada lokasi, rak, model, device, kabel, rencana maintenance, WO, dan pengguna tercatat dengan: waktu, pengguna, aksi, jenis dan identitas objek, data sebelum, dan data sesudah.
- **AC2:** Audit log dapat difilter berdasarkan pengguna, jenis objek, dan rentang tanggal.
- **AC3:** Audit log tidak dapat diubah atau dihapus melalui aplikasi.
- **AC4:** Halaman detail device menampilkan riwayat perubahan device itu.

---

## 8. Aturan bisnis

| ID | Aturan |
|---|---|
| BR-01 | Posisi device = U terbawah yang ditempati. Device setinggi H di posisi P menempati U P sampai P+H-1. |
| BR-02 | P+H-1 tidak boleh melebihi tinggi rak, dan P minimal 1. |
| BR-03 | Device full-depth menempati sisi depan dan belakang. Device half-depth hanya menempati sisi yang dipilih. Dua device bertabrakan bila rentang U-nya beririsan dan ada sisi yang sama-sama ditempati. |
| BR-04 | Device 0U tidak punya posisi U dan tidak dihitung dalam utilisasi. |
| BR-05 | Hanya device berstatus Aktif atau Maintenance yang boleh menempati rak. |
| BR-06 | Satu port hanya boleh punya satu kabel. Kabel data: data ↔ data. Kabel daya: power inlet ↔ power outlet. |
| BR-07 | Asset tag dibuat otomatis, berurutan, unik, dan tidak dapat diubah. |
| BR-08 | Satu rencana maintenance hanya boleh punya satu WO terbuka (Terjadwal atau Dikerjakan) pada satu waktu. |
| BR-09 | Jatuh tempo berikutnya = jatuh tempo WO yang diselesaikan + interval. |
| BR-10 | "Terlambat" = jatuh tempo < hari ini dan status bukan Selesai/Dibatalkan. Dihitung, tidak disimpan. |
| BR-11 | Device berstatus Maintenance selama ada minimal satu WO Dikerjakan untuknya; kembali Aktif saat tidak ada lagi. |
| BR-12 | Teknisi yang dapat ditugaskan harus memiliki keahlian yang cocok dengan kategori role device (atau Keduanya). |
| BR-13 | Semua tanggal dan jadwal memakai zona waktu WIB (Asia/Jakarta). Cron berjalan pukul 07.00 WIB. |
| BR-14 | Penghapusan data yang masih dirujuk data lain ditolak (misalnya rak berisi device, model yang dipakai device). |

---

## 9. Kebutuhan non-fungsional

| ID | Kategori | Kebutuhan |
|---|---|---|
| NFR-01 | Bahasa | Antarmuka berbahasa Indonesia; istilah teknis tetap dalam bahasa Inggris (rak, U, port, PDU, work order). |
| NFR-02 | Perangkat | Desktop-first. Halaman detail aset (tujuan QR), "Tugas saya", dan detail WO wajib nyaman di HP (lebar 375px). |
| NFR-03 | Browser | Chrome dan Edge versi terbaru di desktop; Chrome Android dan Safari iOS di HP. |
| NFR-04 | Keamanan | Password disimpan dalam bentuk hash. Hak akses diperiksa di server untuk setiap aksi. Tidak ada halaman yang dapat diakses tanpa login selain halaman login. |
| NFR-05 | Performa | Dengan data seed, setiap halaman tampil kurang dari 2 detik. |
| NFR-06 | Keandalan | Cron idempoten: dijalankan berulang kali di hari yang sama tidak menghasilkan WO atau notifikasi ganda. |
| NFR-07 | Keterujian | Setiap AC bertanda Must memiliki minimal satu tes otomatis. Aturan BR-01 s.d. BR-03 dan BR-08 s.d. BR-11 memiliki unit test. |
| NFR-08 | Data demo | Tersedia seed script yang mengembalikan database ke data demo standar dengan satu perintah. |

---

## 10. Asumsi

1. Data dimasukkan manual oleh Admin atau lewat seed; tidak ada pembacaan otomatis dari perangkat.
2. Skala: satu site kampus, satu sampai beberapa ruangan, sampai 20 rak dan 500 device.
3. Desain jaringan di data demo memakai pola Top-of-Rack, sehingga server tersambung langsung ke switch tanpa melewati patch panel.
4. Penggantian unit dicatat sebagai WO korektif; Admin mengubah device lama menjadi Pensiun dan mendaftarkan unit baru secara manual.
5. Satu pengguna memiliki tepat satu role.

---

## 11. Risiko dan area rawan

Area berikut paling mungkin salah tanpa terlihat, sehingga wajib diuji paling lengkap dan direview dengan cermat saat tahap Build.

| ID | Area | Kenapa rawan | Mitigasi |
|---|---|---|---|
| R1 | Validasi posisi rak (BR-01 s.d. BR-03) | Banyak kombinasi: tinggi, sisi, kedalaman, batas rak | Unit test untuk setiap kombinasi pada US-DEV-02 |
| R2 | Cron pembuatan WO (US-WO-01) | Duplikasi WO, salah zona waktu, gagal diam-diam | Idempotensi (BR-08), tes dengan tanggal yang dikendalikan, log hasil setiap eksekusi |
| R3 | Sinkronisasi status device (BR-11) | Beberapa WO bersamaan bisa membuat status salah | Tes khusus untuk AC5 pada US-WO-04 |
| R4 | Query impact analysis (US-IMP) | Arah kabel dua sisi (A↔B) mudah terlewat sebelah | Tes integrasi dengan seed: hasil harus sama dari sisi mana pun |
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

**Lokasi:** Site "Kampus Utama" → Ruangan "Ruang Server Gedung A" → 4 rak 42U: `RK-A01` s.d. `RK-A04`.

**Perangkat (sekitar 20):**
- Setiap rak: 1 switch ToR (half-depth, sisi belakang, U42), 2 PDU 0U (PDU-A dan PDU-B), 3-4 server full-depth.
- `RK-A01` juga berisi core switch dan firewall; `RK-A04` berisi patch panel dan storage.
- Infrastruktur fasilitas (tanpa posisi rak, ruangan saja): 1 UPS, 2 CRAC.

**Kabel (sekitar 40):** setiap server ke switch ToR (data); setiap server dengan dua power inlet ke PDU-A dan PDU-B (daya, redundan); switch ToR ke core switch.

**Rencana maintenance:** cek baterai UPS (3 bulan), bersihkan filter CRAC (1 bulan), update firmware switch (6 bulan), cek fisik server (3 bulan). Data diatur agar saat demo ada WO jatuh tempo minggu ini, satu WO terlambat, dan satu device dengan garansi habis bulan ini.

**Pengguna:** 1 Admin; 2 Teknisi (IT dan Fasilitas); 1 Viewer.

---

## 14. Lampiran B: Riwayat keputusan

| No | Keputusan | Pilihan |
|---|---|---|
| 1 | Format kebutuhan | User story + Given/When/Then |
| 2 | Posisi rak | U + sisi depan/belakang + full-depth; 0U tanpa posisi |
| 3 | Input perangkat | Template model dengan template port |
| 4 | Model kabel | Port ke port langsung; trace patch panel = Could |
| 5 | Sambungan listrik | Data dan daya dalam satu model port/kabel |
| 6 | Identitas aset | Nama + asset tag otomatis + serial number |
| 7 | Jadwal maintenance | Rencana berulang + WO otomatis (cron) + checklist; foto Cloudinary = Could |
| 8 | Status WO | Terjadwal → Dikerjakan → Selesai/Dibatalkan; Terlambat dihitung; status device tersinkron |
| 9 | Objek maintenance | Semua device; penugasan berdasarkan kategori role (IT/Fasilitas) dan keahlian teknisi; vendor = Could |
| 10 | Hak akses | Admin kelola data; Teknisi mengerjakan WO; Viewer melihat |
| 11 | Login | Email + password, akun dibuat Admin |
| 12 | Akses QR | Wajib login; cetak massal = Should |
| 13 | Impact analysis | Di detail device + saat membuat WO; graf = Could |
| 14 | Audit log | Dengan data sebelum dan sesudah |
| 15 | Bahasa | Indonesia + istilah teknis Inggris |
| 16 | Perangkat | Desktop-first; 3 halaman wajib mobile |
| 17 | Data demo | Seed script realistis |
| — | Jenis maintenance | Preventif (otomatis) dan Korektif (manual, termasuk penggantian unit) |