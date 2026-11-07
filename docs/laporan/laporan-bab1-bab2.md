**LAPORAN PROJECT**

**DATA CENTER MANAGEMENT**

**Pengembangan Aplikasi atau Perangkat untuk Kebutuhan Data Center**

| | |
|---|---|
| Judul Project | SIRAMA: Sistem Informasi Rak, Aset & Maintenance untuk Ruang Server Kampus |
| Anggota / NIM | Haldrian Sunata (20241000112)<br>Calvin (20241000081)<br>Christian Leonardo (20241000079) |
| Dosen Pengampu | Dr. Yo Ceng Giap, M.Kom., CPS |
| Program Studi | Teknik Informatika |
| Fakultas | Fakultas Sains dan Teknologi |
| Universitas | Universitas Buddhi Dharma |

---

# BAB I PENDAHULUAN

## 1.1 Latar Belakang

Data center adalah fasilitas yang menampung perangkat teknologi informasi beserta infrastruktur pendukungnya agar layanan tetap berjalan tanpa henti. Standar ANSI/TIA-942-C menyebut cakupan infrastruktur data center meliputi arsitektur ruang, telekomunikasi, daya listrik, pendinginan, proteksi kebakaran, keamanan fisik, dan pemantauan [1]. Di lingkungan kampus, fungsi ini umumnya dijalankan oleh ruang server yang menampung server aplikasi akademik, basis data, perangkat jaringan, serta perangkat pendukung seperti PDU (*Power Distribution Unit*), UPS (*Uninterruptible Power Supply*), dan AC presisi (CRAC).

Gangguan pada data center lebih sering dipicu oleh faktor manusia dan prosedur daripada oleh kerusakan perangkat semata. Analisis tahunan Uptime Institute mencatat bahwa kesalahan manusia menjadi faktor dalam dua pertiga hingga empat perlima gangguan besar, dan pada gangguan akibat kesalahan manusia, staf yang tidak mengikuti prosedur menjadi bagian penyebab pada 58% kasus [2]. Kesalahan semacam ini mudah terjadi ketika informasi yang dibutuhkan teknisi, misalnya posisi perangkat, sambungan kabel, atau jadwal perawatan, tidak tersedia dengan akurat pada saat dibutuhkan.

Kondisi tersebut juga dihadapi pengelola ruang server kampus yang menjadi skenario project ini. Pencatatan aset dilakukan di spreadsheet yang terpisah dari jadwal maintenance, sehingga muncul empat persoalan operasional:

1. **Data aset tersebar dan tidak sinkron.** Posisi perangkat di rak (nomor U) dan sambungan kabel sering tidak sesuai dengan kondisi fisik, karena perubahan di ruang server tidak selalu diikuti pembaruan catatan. Akibatnya, mencari lokasi satu perangkat membutuhkan pengecekan langsung ke rak.
2. **Kapasitas rak sulit diketahui.** Sebelum memasang perangkat baru, pengelola tidak dapat langsung melihat slot U yang masih kosong dan perkiraan beban daya rak, sehingga berisiko memasang perangkat di posisi yang bertabrakan atau melebihi kapasitas.
3. **Maintenance dan garansi terlewat.** Jadwal perawatan preventif (misalnya pengecekan baterai UPS atau pembersihan filter CRAC) dan masa garansi perangkat tidak memiliki pengingat, sehingga baru diketahui setelah tenggatnya lewat.
4. **Dampak maintenance tidak diketahui sebelumnya.** Saat satu perangkat, misalnya switch atau PDU, perlu dimatikan untuk perawatan, tidak ada cara cepat mengetahui perangkat lain yang ikut terdampak. Padahal jalur daya dan jaringan di data center bersifat berantai: bila komponen hulu mati, komponen hilir ikut terdampak.

Perangkat lunak DCIM (*Data Center Infrastructure Management*) open source seperti NetBox sudah menyediakan pencatatan rak, perangkat, dan kabel sebagai *source of truth* infrastruktur [3]. Namun NetBox berfokus pada dokumentasi jaringan dan tidak memiliki modul maintenance bawaan yang menghubungkan data inventaris dengan jadwal perawatan dan penugasan teknisi. Celah inilah yang diisi project ini: sebuah aplikasi web bernama **SIRAMA (Sistem Informasi Rak, Aset & Maintenance)** yang menyatukan inventaris aset fisik ruang server dengan pengelolaan maintenance, dilengkapi analisis dampak (*impact analysis*) berbasis data kabel dan label QR code pada setiap perangkat.

## 1.2 Rumusan Masalah

Berdasarkan latar belakang di atas, rumusan masalah project ini adalah:

1. Bagaimana membangun aplikasi web yang menyatukan data lokasi (site, room, rack), perangkat, dan sambungan kabel ruang server sehingga lokasi sebuah perangkat dapat ditemukan dalam waktu kurang dari 30 detik?
2. Bagaimana mencegah pencatatan pemasangan perangkat yang bertabrakan posisi U atau melebihi tinggi rak?
3. Bagaimana membuat work order maintenance preventif secara otomatis dari jadwal berulang dan mengirim pengingat kepada teknisi sebelum tenggat?
4. Bagaimana menampilkan seluruh perangkat yang terhubung langsung dengan sebuah perangkat sebelum perangkat tersebut di-maintenance?
5. Bagaimana menyediakan akses informasi perangkat di ruang server melalui pemindaian QR code dari ponsel?

## 1.3 Tujuan Project

Tujuan project ini adalah membangun aplikasi SIRAMA dengan hasil terukur sebagai berikut:

| No | Tujuan | Ukuran keberhasilan |
|---|---|---|
| 1 | Menyediakan satu sumber data lokasi, perangkat, dan kabel ruang server | Lokasi perangkat (site, room, rack, posisi U) ditemukan dalam kurang dari 30 detik melalui pencarian atau pemindaian QR |
| 2 | Mencegah kesalahan pencatatan posisi perangkat | 0% pemasangan bertabrakan atau melebihi tinggi rak yang lolos validasi, dibuktikan dengan pengujian otomatis untuk setiap kombinasi posisi |
| 3 | Memastikan tidak ada maintenance yang terlewat tanpa diketahui | Work order preventif terbentuk otomatis 7 hari sebelum tenggat, dan pengingat terkirim kepada teknisi paling lambat 3 hari sebelum tenggat |
| 4 | Menampilkan dampak maintenance sebelum pekerjaan dimulai | 100% perangkat yang terhubung langsung (satu lompatan) melalui kabel data maupun daya tampil pada analisis dampak |
| 5 | Mempercepat pekerjaan teknisi di lapangan | Teknisi dapat menyelesaikan satu work order dari ponsel (membuka, memulai, mencentang checklist, menyelesaikan) dalam kurang dari 2 menit |
| 6 | Menghasilkan sistem yang teruji | 100% test case blackbox berstatus valid saat demonstrasi |

## 1.4 Batasan Project

Agar pengerjaan terarah dan dapat diselesaikan dalam waktu yang tersedia, project ini dibatasi sebagai berikut:

1. **Lokasi dan skala simulasi.** Sistem diuji dengan skenario ruang server satu kampus: satu site, satu room, dan empat rack 42U. Data demo berisi 34 perangkat (switch Top-of-Rack, core switch, firewall, server, storage, patch panel, PDU, satu UPS, dan dua CRAC), 46 kabel data dan daya, 19 maintenance plan, dan 16 work order. Performa diuji sampai 20 rack dan 500 perangkat.
2. **Sumber data.** Data dimasukkan manual oleh Admin atau melalui skrip data awal (*seed*). Sistem tidak membaca data langsung dari perangkat fisik; discovery otomatis dan pemantauan *real-time* (misalnya melalui SNMP atau IPMI) tidak termasuk ruang lingkup.
3. **Pengguna.** Terdapat tiga peran: Admin (pengelola data center), Teknisi (dengan keahlian IT, Fasilitas, atau keduanya), dan Viewer (pimpinan atau pemantau). Satu pengguna memiliki tepat satu peran.
4. **Fitur.** Ruang lingkup mengikuti prioritas MoSCoW pada dokumen kebutuhan. Analisis dampak dibatasi satu lompatan (perangkat yang terhubung langsung). Notifikasi hanya di dalam aplikasi; notifikasi email, IPAM penuh, virtualisasi, dan sirkuit jaringan tidak dikerjakan.
5. **Platform dan protokol.** Aplikasi berbasis web yang diakses melalui HTTPS, dioptimalkan untuk desktop dan tidak rusak di ponsel. Empat halaman (detail perangkat, Tugas saya, detail work order, dan dashboard) dioptimalkan untuk layar ponsel 375 piksel.
6. **Teknologi.** Aplikasi dibangun dengan Next.js, Drizzle ORM, dan PostgreSQL (Neon), lalu di-deploy di Vercel dengan Vercel Schedules sebagai penjadwal otomatis. Project tidak memerlukan perangkat keras tambahan.
7. **Waktu.** Sistem harus siap didemonstrasikan secara langsung pada saat UTS dan UAS.

## 1.5 Manfaat dan Luaran

**Manfaat bagi pengelola data center:**

1. **Admin** memiliki satu sumber data yang akurat untuk lokasi, perangkat, kabel, dan riwayat perubahan (audit log), serta dapat melihat sisa kapasitas rak dan estimasi daya sebelum memasang perangkat baru.
2. **Teknisi** menerima daftar tugas yang jelas beserta checklist, dapat membuka informasi perangkat cukup dengan memindai label QR, dan mengetahui perangkat yang terdampak sebelum memulai pekerjaan.
3. **Pimpinan unit** dapat memantau utilisasi rak, work order yang terlambat, dan garansi yang hampir habis melalui dashboard tanpa mengubah data.
4. **Institusi** memperoleh jejak perawatan yang terdokumentasi, sehingga risiko gangguan akibat maintenance terlewat atau prosedur yang tidak diikuti dapat dikurangi.

**Luaran project:**

1. Aplikasi web SIRAMA yang dapat didemonstrasikan dan diuji secara langsung.
2. Kode sumber di repositori GitHub beserta pengujian otomatis.
3. Dokumen perancangan: diagram arsitektur dan topologi, use case, flowchart, rancangan antarmuka (mockup), dan manual book singkat.
4. Dokumen proses pengembangan: dokumen intent, Product Requirements Document (PRD), Design Specification, design system, Technical Specification, dan catatan pengembangan (devlog).
5. Laporan project Bab I sampai Bab V, termasuk hasil pengujian blackbox.

---

# BAB II LANDASAN TEORI

## 2.1 Konsep Data Center Management

### 2.1.1 Data center dan infrastruktur pendukungnya

Data center menjaga layanan TI tetap berjalan dengan menyediakan empat kebutuhan utama perangkat: daya listrik yang stabil, pendinginan, konektivitas jaringan, dan keamanan fisik. ANSI/TIA-942-C, revisi ketiga standar infrastruktur data center yang diterbitkan pada Mei 2024, mengatur persyaratan dan rekomendasi perancangan data center untuk semua skala, mulai dari hyperscale sampai enterprise, termasuk aspek telekomunikasi, daya, pendinginan, proteksi kebakaran, keamanan fisik, dan pemantauan [1].

Dua jalur infrastruktur menjadi dasar fitur analisis dampak pada project ini:

- **Jalur daya:** sumber listrik → ATS/genset → UPS → PDU di rak → power supply perangkat. Perangkat dengan dua power supply yang tersambung ke dua PDU berbeda memiliki jalur daya cadangan (redundan).
- **Jalur jaringan:** penyedia internet → router/firewall → core switch → switch Top-of-Rack (ToR) → server.

Karena kedua jalur bersifat berantai, mematikan satu komponen hulu (misalnya PDU atau switch ToR) berdampak pada komponen hilir yang terhubung dengannya.

### 2.1.2 Data Center Infrastructure Management (DCIM)

DCIM adalah kelompok perangkat lunak untuk mengelola infrastruktur fisik data center, yaitu perangkat TI, perangkat daya, sistem pendingin, dan ruang, dalam satu sistem terpadu. Seiring bertambahnya kebutuhan energi dan tuntutan ketersediaan layanan, kualitas DCIM menjadi faktor penting yang perlu dievaluasi dari sisi biaya energi, ketersediaan, dan sistem pengelolaannya [4].

Secara umum fungsi DCIM terbagi menjadi dua kelompok:

1. **Pemantauan (*monitoring*)**: membaca kondisi lingkungan dan daya secara *real-time* melalui sensor, misalnya suhu, kelembapan, dan beban listrik [5].
2. **Manajemen aset dan kapasitas**: mencatat lokasi perangkat, ruang rak, sambungan kabel, dan siklus hidup aset sebagai *source of truth* [3].

Project ini berada pada kelompok kedua dan menambahkan pengelolaan maintenance yang terhubung langsung dengan data aset.

### 2.1.3 Rak, rack unit, dan administrasi kabel

Perangkat data center dipasang di rak standar 19 inci. Tinggi rak dan perangkat diukur dalam **rack unit (U)**; menurut EIA-310-E, 1U setara 1,75 inci atau sekitar 4,45 cm [6]. Rak yang umum dipakai setinggi 42U, dan penomoran U dimulai dari bawah. Beberapa konsep penempatan yang dipakai dalam sistem ini:

- **Full-depth dan half-depth.** Perangkat full-depth menempati sisi depan dan belakang rak, sedangkan perangkat half-depth (misalnya switch ToR) hanya menempati satu sisi, sehingga dua perangkat half-depth dapat berbagi nomor U yang sama di sisi berbeda.
- **Perangkat 0U.** Perangkat yang dipasang di sisi rak tanpa memakai slot U, misalnya PDU vertikal.
- **Perangkat tanpa rak.** Perangkat besar yang berdiri di lantai ruangan, seperti UPS dan CRAC.
- **Elevation rak.** Gambar tampak depan dan belakang rak yang menunjukkan posisi setiap perangkat per U. Visualisasi ini menjadi cara utama melihat utilisasi dan sisa ruang rak.

Untuk kabel, ANSI/TIA-606-D mengatur sistem administrasi infrastruktur telekomunikasi, termasuk di lingkungan data center, yaitu cara memberi identitas dan mencatat kabel dan titik sambungnya [7]. Prinsip ini diterapkan dengan memberi setiap kabel label unik serta mencatat port di kedua ujungnya, sehingga jalur kabel dapat ditelusuri dari data.

### 2.1.4 Manajemen aset

ISO 55000:2024 mendefinisikan manajemen aset sebagai aktivitas terkoordinasi sebuah organisasi untuk mewujudkan nilai dari aset yang dimilikinya [8]. Dalam konteks ruang server, aset dikelola sepanjang siklus hidupnya: dibeli dan disimpan sebagai stok, dipasang dan aktif, menjalani maintenance, lalu dipensiunkan. Informasi pendukung seperti tanggal pembelian, vendor, dan akhir garansi menentukan kapan perangkat perlu diperbaiki, diklaim, atau diganti. Setiap aset diberi kode unik permanen (*asset tag*) agar dapat dirujuk secara konsisten, termasuk melalui label fisik.

### 2.1.5 Manajemen maintenance

Standar EN 13306:2017 membakukan istilah maintenance yang dipakai dalam project ini [9]:

- **Maintenance preventif**: dilakukan sebelum kerusakan terjadi, pada interval tertentu atau menurut kriteria yang ditetapkan, untuk mengurangi kemungkinan kegagalan fungsi.
- **Maintenance korektif**: dilakukan setelah kerusakan terdeteksi, untuk mengembalikan perangkat ke kondisi yang dapat menjalankan fungsinya.

Perangkat lunak yang mengelola kegiatan ini disebut **CMMS (*Computerized Maintenance Management System*)**. Modul inti CMMS meliputi data peralatan sebagai pusat informasi, modul work order yang disesuaikan dengan model operasional organisasi, dan modul maintenance preventif yang mencatat jadwal serta checklist pekerjaan [10]. SIRAMA menerapkan konsep ini dalam bentuk:

- **Maintenance plan**: jadwal preventif berulang untuk satu perangkat, misalnya "cek baterai UPS setiap 3 bulan".
- **Work order (WO)**: satu pekerjaan maintenance untuk satu perangkat, berjenis preventif (dibuat otomatis dari maintenance plan) atau korektif (dibuat manual), ditugaskan kepada teknisi yang keahliannya sesuai, dan dikerjakan dengan checklist.

### 2.1.6 Analisis dampak (*impact analysis*)

Analisis dampak adalah penentuan perangkat yang ikut terpengaruh bila sebuah perangkat dimatikan atau di-maintenance. Karena data kabel menyimpan hubungan antarport, perangkat yang terhubung langsung dapat dihitung dengan menelusuri kabel dari kedua arah sambungan. Pada jalur daya, perangkat yang memiliki dua power supply tersambung ke dua PDU berbeda tetap menyala bila salah satu PDU dimatikan, sedangkan perangkat dengan satu jalur daya ikut mati. Hasil analisis ini bersifat hipotesis ("bila dimatikan") dan dihitung ulang dari data kabel terkini setiap kali ditampilkan.

## 2.2 Teknologi dan Standar Relevan

Bagian ini hanya membahas teknologi dan standar yang dipakai. Karena data dimasukkan manual, protokol pemantauan perangkat seperti SNMP dan MQTT tidak digunakan.

### 2.2.1 Aplikasi web dan HTTP

SIRAMA adalah aplikasi web yang diakses melalui peramban (*browser*) dengan protokol HTTPS, sehingga dapat dibuka dari komputer di ruang kerja maupun dari ponsel teknisi di depan rak tanpa instalasi aplikasi tambahan.

### 2.2.2 Next.js

Next.js adalah framework React untuk membangun aplikasi web *full-stack*. Next.js menyediakan *routing* berbasis berkas, *server components*, dan *server actions*, sehingga antarmuka dan logika sisi server (validasi, akses basis data, pemeriksaan hak akses) dapat ditulis dalam satu proyek [11]. Pemeriksaan hak akses yang dijalankan di sisi server membuat aturan bisnis tidak dapat dilewati dari sisi peramban.

### 2.2.3 PostgreSQL, Neon, dan Drizzle ORM

PostgreSQL adalah sistem basis data relasional open source yang mendukung transaksi, *constraint*, dan relasi antartabel [12]. Struktur data SIRAMA bersifat relasional (site memiliki room, room memiliki rack, rack memiliki device, device memiliki port, port terhubung melalui cable), sehingga basis data relasional menjadi pilihan yang sesuai. Neon menyediakan PostgreSQL sebagai layanan cloud *serverless* [13]. Drizzle ORM digunakan sebagai lapisan akses data bertipe TypeScript, sehingga skema tabel dan query diperiksa tipenya saat pengembangan [14].

### 2.2.4 Vercel dan Vercel Schedules

Vercel adalah platform hosting untuk aplikasi Next.js. Pekerjaan terjadwal dijalankan dengan **Vercel Schedules**, layanan penjadwal yang menggantikan Vercel Cron Jobs. Dibandingkan Cron Jobs yang hanya mengenal zona waktu UTC, Schedules mendukung zona waktu IANA untuk setiap jadwal, menyimpan riwayat eksekusi per jadwal, serta dapat diaktifkan, dinonaktifkan, atau dijalankan manual tanpa deploy ulang [15]. Jadwal ditulis dengan ekspresi cron lima kolom di berkas konfigurasi `vercel.json`, dan targetnya dapat berupa fungsi privat yang tidak memiliki alamat publik, sehingga hanya penjadwal Vercel yang dapat memanggilnya [15].

SIRAMA memakai satu jadwal harian dengan ekspresi `0 7 * * *` dan zona waktu `Asia/Jakarta`, yaitu pukul 07.00 WIB. Jadwal ini membuat work order preventif yang tenggatnya tinggal 7 hari dan mengirim pengingat untuk work order yang tenggatnya tinggal 3 hari. Schedules menjalankan jadwal di dalam rentang *jitter* hingga 15 menit [15]; selisih ini tidak berpengaruh karena aturan pembuatan work order dihitung per hari.

### 2.2.5 QR code

QR code adalah simbologi kode batang dua dimensi yang distandarkan dalam ISO/IEC 18004:2024 [16]. Setiap perangkat diberi label berisi QR code yang memuat alamat halaman detail perangkat beserta asset tag-nya. Teknisi cukup memindai label dengan kamera ponsel untuk membuka informasi perangkat, termasuk lokasi, sambungan kabel, dan riwayat maintenance.

### 2.2.6 Aspek keamanan

- **Role-Based Access Control (RBAC).** Hak akses diberikan berdasarkan peran pengguna, bukan per individu [17]. SIRAMA memakai tiga peran (Admin, Teknisi, Viewer) dengan matriks hak akses yang jelas, misalnya hanya Admin yang dapat mengubah data inventaris dan hanya teknisi yang ditugaskan yang dapat mengerjakan sebuah work order.
- **Least privilege.** Setiap pengguna hanya diberi akses sebatas yang dibutuhkan pekerjaannya [18]. Prinsip ini diterapkan antara lain dengan menyembunyikan menu yang tidak berhak diakses dan menolak aksi tanpa hak di sisi server.
- **Penyimpanan password.** Password disimpan dalam bentuk *hash* dengan algoritma yang dirancang khusus untuk password, sesuai rekomendasi OWASP [19].
- **Audit log.** Setiap pembuatan, perubahan, dan penghapusan data dicatat beserta pelaku, waktu, serta nilai sebelum dan sesudahnya, sehingga perubahan data dapat ditelusuri.

## 2.3 Metode atau Arsitektur

### 2.3.1 Arsitektur client-server berbasis web

SIRAMA memakai arsitektur client-server tiga lapis:

1. **Lapisan presentasi (client):** peramban di komputer atau ponsel yang menampilkan antarmuka.
2. **Lapisan aplikasi (server):** fungsi Next.js yang berjalan di Vercel, berisi logika bisnis seperti validasi posisi rak, perhitungan analisis dampak, dan pemeriksaan hak akses.
3. **Lapisan data:** basis data PostgreSQL di Neon.

Selain permintaan dari pengguna, terdapat proses otomatis yang dipicu Vercel Schedules setiap hari pukul 07.00 WIB untuk membuat work order preventif dan notifikasi. Rincian arsitektur dan topologi dibahas pada Bab III.

### 2.3.2 Siklus hidup pengembangan perangkat lunak (SDLC)

SDLC (*Software Development Life Cycle*) adalah rangkaian tahapan pengembangan perangkat lunak dari perumusan kebutuhan sampai perawatan. Model klasik meliputi Waterfall yang berurutan, model inkremental, dan pendekatan Agile yang iteratif [20], [21]. Seluruh model ini memuat aktivitas dasar yang sama: spesifikasi, perancangan dan implementasi, validasi, serta evolusi perangkat lunak [20].

### 2.3.3 AI-Native SDLC

Project ini memakai **AI-Native SDLC**, panduan praktik yang diterbitkan Anthropic pada Agustus 2026 [22]. Panduan ini berangkat dari pengamatan bahwa asisten AI sudah dapat menulis kode dengan cepat, sehingga hambatan pengembangan berpindah ke langkah yang dikerjakan manusia, yaitu perencanaan, peninjauan, dan deployment. Karena itu, setiap tahap ditutup dengan menyimpan sebuah dokumen (*artifact*) di repositori yang menjadi masukan tahap berikutnya, sekaligus menjadi jejak audit [22].

| Tahap | Kegiatan | Artifact di project ini |
|---|---|---|
| Plan | Merumuskan masalah, tujuan, dan batasan | `intent/asset-maintenance.md` |
| Design | Mengubah intent menjadi spesifikasi | PRD, Design Specification, design system, mockup, Technical Specification |
| Build | Menyusun rencana per fitur sebelum kode ditulis, dengan aturan proyek yang dibaca AI setiap sesi | `plan.md` per fitur, `CLAUDE.md` |
| Test | Memberi AI cara memverifikasi hasil kerjanya sendiri melalui pengujian otomatis | Unit test, integration test, end-to-end test |
| Deploy | Peninjauan perubahan oleh AI dengan persetujuan akhir oleh manusia | Pull request, deployment Vercel |
| Maintain | Bug dan masukan menjadi intent baru | Intent baru |

Siklus ini berbentuk *loop*: temuan pada tahap Maintain kembali menjadi intent baru di tahap Plan. Manusia tetap bertanggung jawab atas keputusan yang membutuhkan penilaian, sementara perhatiannya berpindah ke peninjauan artifact [22]. Dibandingkan model klasik, perbedaan utamanya terletak pada dokumen spesifikasi yang ditulis cukup rinci untuk dibaca oleh AI, serta pengujian otomatis yang wajib lulus sebelum sebuah fitur dianggap selesai. Penerapan metode ini dijelaskan lebih lanjut pada Bab III.

## 2.4 Studi Terkait

Tabel berikut merangkum penelitian dan penerapan yang relevan dengan project ini.

| No | Peneliti | Sistem dan metode | Hasil |
|---|---|---|---|
| 1 | Putra, Bisenna, dan Kartini (2018) [23] | Pengembangan sistem inventaris sarana prasarana kampus STMIK STIKOM Indonesia dengan label QR code yang dicetak dan dipindai melalui web service | Pengecekan inventaris satu ruang kelas turun dari sekitar 80,3 menit menjadi sekitar 38 menit; pengujian blackbox lulus untuk seluruh skenario |
| 2 | Ciptadi, Ilyas, dan Syahrir (2023) [24] | Sistem informasi inventarisasi aset Dinas Pendidikan dan Kebudayaan Kota Parepare dengan QR code dan metode Min-Max Stock, dikembangkan dengan model Waterfall | Pencatatan aset lebih cepat dan akurat, disertai peringatan saat stok mencapai batas minimum; pengujian blackbox dengan tiga peran pengguna berhasil |
| 3 | Muzayyin, Wiyono, dan Arif (2026) [25] | Sistem pengelolaan sarana prasarana berbasis web yang memadukan pencatatan aset, maintenance, mutasi aset, dan QR code, dengan metode Simple Additive Weighting (SAW) untuk prioritas maintenance | Pengujian blackbox berhasil; User Acceptance Testing dengan 15 responden menghasilkan skor 90,16% |
| 4 | Ratnam dan Sarma (2019) [4] | Kajian kualitas DCIM pada data center yang terus berkembang, dengan metode evaluasi dari sisi biaya energi, ketersediaan, dan sistem pengelolaan | Kualitas DCIM menentukan kemampuan data center memenuhi kebutuhan energi dan ketersediaan yang terus meningkat |

**Perbedaan project ini dengan studi terkait:**

1. **Domain data center.** Studi 1 sampai 3 menangani inventaris umum (sarana kelas, barang dinas, aset desa) yang tidak mengenal konsep rak, posisi U, kabel, dan jalur daya. SIRAMA memodelkan ruang server secara spesifik: hierarki site, room, rack, posisi U dengan sisi depan dan belakang, perangkat 0U dan tanpa rak, port, serta kabel data dan daya.
2. **Implementasi, bukan hanya evaluasi.** Studi 4 mengkaji cara menilai kualitas DCIM. SIRAMA membangun aplikasi DCIM yang dapat dipakai dan diuji langsung untuk skala ruang server kampus.
3. **Maintenance yang terhubung dengan inventaris.** NetBox kuat dalam dokumentasi infrastruktur tetapi tidak memiliki modul maintenance bawaan [3]. SIRAMA menghubungkan maintenance plan dan work order langsung dengan data perangkat, lengkap dengan pembuatan work order preventif otomatis, pengingat tenggat, penugasan berdasarkan keahlian teknisi, dan checklist.
4. **Pencegahan kesalahan.** SIRAMA memvalidasi tabrakan posisi U dan batas tinggi rak sebelum data disimpan, serta menampilkan perangkat terdampak sebelum maintenance dimulai melalui analisis dampak berbasis data kabel, termasuk indikator jalur daya cadangan. Fitur ini tidak terdapat pada studi 1 sampai 4.
5. **Akses lapangan.** Seperti studi 1 sampai 3, SIRAMA memakai QR code. Bedanya, QR code dipakai teknisi untuk membuka detail perangkat, sambungan kabel, dan tugas maintenance aktif di ponsel, bukan hanya untuk mendata barang masuk dan keluar.
6. **Metode pengembangan.** Studi 2 memakai model Waterfall. SIRAMA dikembangkan dengan AI-Native SDLC yang menjadikan dokumen spesifikasi dan pengujian otomatis sebagai bagian wajib setiap tahap.

---

# DAFTAR PUSTAKA (sementara, untuk Bab I dan Bab II)

[1] Telecommunications Industry Association, *ANSI/TIA-942-C: Telecommunications Infrastructure Standard for Data Centers*. Arlington, VA, USA: TIA, 2024.

[2] D. Robinson, "Human error and power glitches to blame for most outages," *The Register*, 7 Mei 2025. [Online]. Tersedia: https://www.theregister.com/2025/05/07/human_error_a_factor_in

[3] NetBox Labs, "NetBox documentation," 2026. [Online]. Tersedia: https://netboxlabs.com/docs/netbox/ (diakses 8 Nov 2026).

[4] V. S. Ratnam dan K. S. Sarma, "The quality of data center infrastructure management (DCIM)," *International Journal of Engineering and Advanced Technology (IJEAT)*, vol. 8, no. 6S3, hlm. 1817-1822, Sep. 2019, doi: 10.35940/ijeat.F1346.0986S319.

[5] M. Levy dan J. O. Hallstrom, "A reliable, non-invasive approach to data center monitoring and management," *Advances in Science, Technology and Engineering Systems Journal*, vol. 2, no. 3, hlm. 1577-1584, 2017, doi: 10.25046/aj0203196.

[6] Electronic Industries Alliance, *EIA/ECA-310-E: Cabinets, Racks, Panels, and Associated Equipment*. Arlington, VA, USA: EIA, 2005.

[7] Telecommunications Industry Association, *ANSI/TIA-606-D: Administration Standard for Telecommunications Infrastructure*. Arlington, VA, USA: TIA, 2021.

[8] International Organization for Standardization, *ISO 55000:2024 Asset management: Vocabulary, overview and principles*. Geneva, Switzerland: ISO, 2024.

[9] European Committee for Standardization, *EN 13306:2017 Maintenance: Maintenance terminology*. Brussels, Belgium: CEN, 2017.

[10] K. Peng, "Computerized management systems," dalam *Equipment Management in the Post-Maintenance Era: Advancing in the Era of Smart Machines*, ed. ke-2. New York, NY, USA: Productivity Press, 2021, bab 9.

[11] Vercel, "Next.js documentation," 2026. [Online]. Tersedia: https://nextjs.org/docs (diakses 8 Nov 2026).

[12] The PostgreSQL Global Development Group, "PostgreSQL documentation," 2026. [Online]. Tersedia: https://www.postgresql.org/docs/ (diakses 8 Nov 2026).

[13] Neon, "Neon documentation," 2026. [Online]. Tersedia: https://neon.com/docs (diakses 8 Nov 2026).

[14] Drizzle Team, "Drizzle ORM documentation," 2026. [Online]. Tersedia: https://orm.drizzle.team/docs/overview (diakses 8 Nov 2026).

[15] Vercel, "Schedules," Vercel Documentation, 2026. [Online]. Tersedia: https://vercel.com/docs/schedules (diakses 8 Nov 2026).

[16] International Organization for Standardization dan International Electrotechnical Commission, *ISO/IEC 18004:2024 Information technology: Automatic identification and data capture techniques: QR Code bar code symbology specification*. Geneva, Switzerland: ISO, 2024.

[17] D. F. Ferraiolo dan D. R. Kuhn, "Role-based access controls," dalam *Proc. 15th National Computer Security Conference*, Baltimore, MD, USA, 1992, hlm. 554-563.

[18] Joint Task Force, *Security and Privacy Controls for Information Systems and Organizations*, NIST Special Publication 800-53 Rev. 5. Gaithersburg, MD, USA: NIST, 2020.

[19] OWASP Foundation, "Password storage cheat sheet," OWASP Cheat Sheet Series, 2026. [Online]. Tersedia: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html (diakses 8 Nov 2026).

[20] I. Sommerville, *Software Engineering*, ed. ke-10. Boston, MA, USA: Pearson, 2016.

[21] R. S. Pressman dan B. R. Maxim, *Software Engineering: A Practitioner's Approach*, ed. ke-9. New York, NY, USA: McGraw-Hill, 2020.

[22] L. Claxton, "The AI-native SDLC playbook," Claude Blog, Anthropic, 21 Agu 2026. [Online]. Tersedia: https://claude.com/blog/the-ai-native-sdlc-playbook (diakses 8 Nov 2026).

[23] I. N. T. A. Putra, I. K. A. Bisenna, dan K. S. Kartini, "Pengembangan sistem inventaris berbasis QR code menggunakan web service pada Bidang Sarana dan Prasarana STMIK STIKOM Indonesia," *Jurnal Nasional Pendidikan Teknik Informatika (JANAPATI)*, vol. 7, no. 3, hlm. 315-323, 2018.

[24] C. Ciptadi, M. Ilyas, dan Syahrir, "Perancangan aplikasi sistem informasi inventarisasi aset menggunakan QR code (studi kasus Dinas Pendidikan dan Kebudayaan Kota Parepare)," *Jurnal Teknologi Elekterika*, vol. 20, no. 2, hlm. 104-112, 2023.

[25] F. Muzayyin, S. Wiyono, dan Z. Arif, "Implementasi sistem pengelolaan sarana dan prasarana berbasis website dengan metode Simple Additive Weighting (SAW) untuk penentuan prioritas (studi kasus: Kelurahan Desa Bandasari)," *Journal of Information Technology and Computer Science (INTECOMS)*, vol. 9, no. 3, hlm. 575-589, 2026.
