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
| Semester / Tahun Akademik | Ganjil 2026/2027 |

---

# BAB I PENDAHULUAN

## 1.1 Latar Belakang

Data center adalah fasilitas yang menampung perangkat teknologi informasi beserta infrastruktur pendukungnya agar layanan tetap berjalan tanpa henti. Standar ANSI/TIA-942-C menyebut cakupan infrastruktur data center meliputi arsitektur ruang, telekomunikasi, daya listrik, pendinginan, proteksi kebakaran, keamanan fisik, dan pemantauan [1]. Di lingkungan kampus, fungsi ini umumnya dijalankan oleh ruang server yang menampung server aplikasi akademik, basis data, perangkat jaringan, serta perangkat pendukung seperti PDU (*Power Distribution Unit*), UPS (*Uninterruptible Power Supply*), dan AC presisi (CRAC).

Gangguan pada data center tidak hanya dipicu oleh kerusakan perangkat. Analisis tahunan Uptime Institute tahun 2025 mencatat bahwa masalah daya listrik masih menjadi penyebab utama gangguan yang berdampak, dan pada gangguan besar yang melibatkan kesalahan manusia, 85% berasal dari staf yang tidak mengikuti prosedur atau dari prosedur itu sendiri yang bermasalah [2]. Kesalahan prosedural semacam ini mudah terjadi ketika informasi yang dibutuhkan teknisi, misalnya posisi perangkat, sambungan kabel, jalur daya, atau jadwal perawatan, tidak tersedia dengan akurat pada saat dibutuhkan.

Project ini mengambil skenario ruang server kampus berskala kecil yang dikelola oleh beberapa orang, dengan pencatatan aset di spreadsheet yang terpisah dari jadwal maintenance. Skenario ini disusun dari persoalan yang umum terjadi pada pengelolaan seperti itu, bukan dari observasi pada satu institusi tertentu. Dalam skenario tersebut, terdapat empat persoalan operasional:

1. **Data aset tersebar dan berisiko tidak sinkron.** Data perangkat, posisi di rak (nomor U), dan sambungan kabel tersimpan di beberapa berkas. Bila perubahan di ruang server tidak diikuti pembaruan semua berkas, catatan tidak lagi sesuai dengan kondisi fisik, dan mencari lokasi satu perangkat harus dipastikan langsung ke rak.
2. **Kapasitas rak sulit diketahui.** Sebelum memasang perangkat baru, pengelola tidak dapat langsung melihat slot U yang masih kosong dan perkiraan beban daya rak, sehingga berisiko memasang perangkat di posisi yang bertabrakan atau melebihi kapasitas.
3. **Maintenance dan garansi berisiko terlewat.** Jadwal perawatan preventif (misalnya pengecekan baterai UPS atau pembersihan filter CRAC) dan masa garansi perangkat tidak memiliki pengingat, sehingga dapat baru diketahui setelah tenggatnya lewat.
4. **Dampak maintenance tidak diketahui sebelumnya.** Saat satu perangkat perlu dimatikan untuk perawatan, tidak ada cara cepat mengetahui perangkat lain yang ikut terdampak. Padahal jalur daya bersifat berantai: bila UPS dimatikan, PDU yang disuplainya dan seluruh perangkat di belakang PDU tersebut ikut terdampak.

Perangkat lunak open source untuk persoalan ini sebenarnya sudah tersedia. NetBox adalah *source of truth* infrastruktur jaringan yang juga mencakup fungsi DCIM (*Data Center Infrastructure Management*), yaitu pencatatan site, rak, perangkat, kabel, dan jalur daya [3]. NetBox tidak memiliki modul maintenance bawaan, tetapi plugin komunitas seperti netbox-maintenance-device menambahkan maintenance plan berulang beserta riwayat pelaksanaannya [4]. GLPI menggabungkan manajemen aset TI dan helpdesk, termasuk pencatatan rak, posisi perangkat, PDU, serta relasi ketergantungan antaraset untuk melihat aset yang terdampak insiden [5]. Sistem-sistem tersebut bersifat umum dan luas, sehingga alur maintenance ruang server harus dirakit dari beberapa modul atau plugin, dan hubungan dampak di GLPI dicatat sebagai relasi terpisah dari data kabel.

Project ini membangun aplikasi web bernama **SIRAMA (Sistem Informasi Rak, Aset & Maintenance)** untuk ruang server kampus berskala kecil. SIRAMA menyatukan inventaris aset fisik dengan pengelolaan maintenance dalam satu alur: jadwal preventif yang menghasilkan work order otomatis, penugasan berdasarkan keahlian teknisi, checklist yang dikerjakan dari ponsel melalui label QR code, serta analisis dampak (*impact analysis*) yang dihitung langsung dari data kabel, termasuk penelusuran berantai pada jalur daya.

SIRAMA tidak menghilangkan kebutuhan memperbarui data secara manual. Yang diubah adalah kemudahan dan keterlacakan pembaruan tersebut: (a) seluruh data berada di satu sumber, sehingga satu perubahan cukup dicatat sekali; (b) label QR di setiap perangkat memungkinkan teknisi membuka dan memeriksa data perangkat langsung di depan rak; (c) audit log menunjukkan kapan dan oleh siapa data terakhir diubah; dan (d) validasi menolak data yang mustahil, misalnya dua perangkat di posisi U yang sama. Kesesuaian data dengan kondisi fisik tetap bergantung pada kedisiplinan pengguna, karena pembacaan otomatis dari perangkat berada di luar ruang lingkup project (lihat 1.4).

## 1.2 Rumusan Masalah

Berdasarkan latar belakang di atas, rumusan masalah project ini adalah:

1. Bagaimana membangun aplikasi web yang menyatukan data lokasi (site, room, rack), perangkat, dan sambungan kabel ruang server sehingga lokasi sebuah perangkat dapat ditemukan dengan cepat?
2. Bagaimana mencegah pencatatan pemasangan perangkat yang bertabrakan posisi U atau melebihi tinggi rak?
3. Bagaimana membuat work order maintenance preventif secara otomatis dari jadwal berulang dan mengirim pengingat kepada teknisi sebelum tenggat?
4. Bagaimana menampilkan perangkat yang terdampak sebelum sebuah perangkat di-maintenance, baik melalui sambungan data maupun rantai daya?
5. Bagaimana menyediakan akses informasi perangkat di ruang server melalui pemindaian QR code dari ponsel?

## 1.3 Tujuan Project

Tujuan project ini adalah membangun aplikasi SIRAMA dengan hasil terukur sebagai berikut:

| No | Tujuan | Ukuran keberhasilan |
|---|---|---|
| 1 | Menyediakan satu sumber data lokasi, perangkat, dan kabel ruang server | Lokasi perangkat (site, room, rack, posisi U) ditemukan dalam kurang dari 30 detik melalui pencarian atau pemindaian QR |
| 2 | Mencegah kesalahan pencatatan posisi perangkat | Tidak ada pemasangan bertabrakan atau melebihi tinggi rak yang lolos validasi, dibuktikan dengan pengujian otomatis pada kasus batas: U paling bawah dan paling atas, tumpang tindih sebagian, sisi depan dan belakang, perangkat half-depth, dan perangkat yang melebihi tinggi rak |
| 3 | Memastikan setiap maintenance terjadwal tercatat dan keterlambatannya terlihat | Work order preventif terbentuk otomatis 7 hari sebelum tenggat, pengingat terkirim kepada teknisi paling lambat 3 hari sebelum tenggat, dan work order yang melewati tenggat tampil di dashboard |
| 4 | Menampilkan dampak maintenance sebelum pekerjaan dimulai | 100% perangkat terdampak tampil pada analisis dampak: perangkat yang terhubung langsung melalui kabel data, dan seluruh perangkat di hilir rantai daya beserta status jalur cadangannya |
| 5 | Mempercepat pekerjaan teknisi di lapangan | Teknisi dapat menyelesaikan satu work order dari ponsel (membuka, memulai, mencentang checklist, menyelesaikan) dalam kurang dari 2 menit |
| 6 | Menghasilkan sistem yang teruji | Setiap kebutuhan prioritas utama memiliki minimal satu test case blackbox, dan seluruh test case berstatus valid saat demonstrasi |

Ukuran waktu pada tujuan 1 dan 5 diukur dengan prosedur yang sama: setiap anggota tim melakukan lima kali percobaan pada data demo, waktu dihitung dengan stopwatch sejak halaman dashboard (tujuan 1) atau daftar Tugas saya (tujuan 5) terbuka sampai informasi tampil atau work order berstatus Selesai, lalu diambil nilai median dari seluruh percobaan.

## 1.4 Batasan Project

Agar pengerjaan terarah dan dapat diselesaikan dalam waktu yang tersedia, project ini dibatasi sebagai berikut:

1. **Lokasi dan skala simulasi.** Sistem diuji dengan skenario ruang server satu kampus: satu site, satu room, dan empat rack 42U. Data demo berisi 34 perangkat (switch Top-of-Rack, core switch, firewall, server, storage, patch panel, PDU, satu UPS, dan dua CRAC), 46 kabel data dan daya, 19 maintenance plan, dan 16 work order. Data demo bersifat simulasi dan bukan data riil kampus. Performa diuji dengan data sampai 20 rack dan 500 perangkat, dengan target setiap halaman tampil dalam kurang dari 2 detik.
2. **Sumber data.** Data dimasukkan manual oleh Admin atau melalui skrip data awal (*seed*). Sistem tidak membaca data langsung dari perangkat fisik; discovery otomatis dan pemantauan *real-time* (misalnya melalui SNMP atau IPMI) tidak termasuk ruang lingkup.
3. **Pengguna.** Terdapat tiga peran: Admin (pengelola data center), Teknisi (dengan keahlian IT, Fasilitas, atau keduanya), dan Viewer (pimpinan atau pemantau). Satu pengguna memiliki tepat satu peran.
4. **Fitur.** Fitur yang dikerjakan meliputi inventaris lokasi, rack, perangkat, dan kabel; elevation rack; estimasi daya rack; maintenance plan dan work order beserta checklist dan notifikasi di dalam aplikasi; analisis dampak; label QR code; pencarian; dashboard; dan audit log. Analisis dampak menelusuri jalur daya secara berantai, sedangkan jalur data dibatasi pada perangkat yang terhubung langsung; penelusuran kabel yang menembus patch panel tidak dikerjakan. Notifikasi email, IPAM penuh, virtualisasi, dan sirkuit jaringan juga tidak dikerjakan.
5. **Platform dan protokol.** Aplikasi berbasis web yang diakses melalui HTTPS, dioptimalkan untuk desktop dan tidak rusak di ponsel. Empat halaman (detail perangkat, Tugas saya, detail work order, dan dashboard) dioptimalkan untuk layar ponsel 375 piksel.
6. **Jaringan.** Aplikasi di-host di cloud sehingga hanya dapat diakses dengan koneksi internet, melalui Wi-Fi kampus atau data seluler; tidak tersedia mode luring. Bila koneksi di ruang server tidak tersedia, perangkat tetap dapat dikenali dari asset tag yang tercetak pada label dan dicari setelah terhubung kembali.
7. **Teknologi.** Aplikasi dibangun dengan Next.js, Drizzle ORM, dan PostgreSQL (Neon), lalu di-deploy di Vercel dengan Vercel Cron Jobs sebagai penjadwal otomatis. Project tidak memerlukan perangkat keras tambahan.

## 1.5 Manfaat dan Luaran

**Manfaat bagi pengelola data center:**

1. **Admin** memiliki satu sumber data untuk lokasi, perangkat, kabel, dan riwayat perubahan (audit log), serta dapat melihat sisa kapasitas rak dan estimasi daya sebelum memasang perangkat baru.
2. **Teknisi** menerima daftar tugas yang jelas beserta checklist, dapat membuka informasi perangkat cukup dengan memindai label QR, dan mengetahui perangkat yang terdampak sebelum memulai pekerjaan.
3. **Pimpinan unit** dapat memantau utilisasi rak, work order yang terlambat, dan garansi yang hampir habis melalui dashboard tanpa mengubah data.
4. **Institusi** memperoleh jejak perawatan yang terdokumentasi, sehingga risiko gangguan akibat maintenance terlewat atau prosedur yang tidak diikuti diharapkan dapat berkurang.

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

Data center menjaga layanan TI tetap berjalan dengan menyediakan kebutuhan perangkat, di antaranya daya listrik yang stabil, pendinginan, konektivitas jaringan, dan keamanan fisik. ANSI/TIA-942-C, revisi ketiga standar infrastruktur data center yang diterbitkan pada Mei 2024, mengatur persyaratan dan rekomendasi perancangan data center untuk semua skala, mulai dari hyperscale sampai enterprise, termasuk aspek telekomunikasi, daya, pendinginan, proteksi kebakaran, keamanan fisik, dan pemantauan [1].

Dua jalur infrastruktur menjadi dasar fitur analisis dampak pada project ini:

- **Jalur daya:** sumber listrik → ATS/genset → UPS → PDU di rak → power supply perangkat. Perangkat dengan dua power supply yang tersambung ke dua PDU berbeda memiliki jalur daya cadangan (redundan).
- **Jalur jaringan:** penyedia internet → router/firewall → core switch → switch Top-of-Rack (ToR) → server.

Karena kedua jalur bersifat berantai, mematikan satu komponen hulu (misalnya UPS, PDU, atau switch ToR) berdampak pada komponen hilir yang terhubung dengannya.

### 2.1.2 Data Center Infrastructure Management (DCIM)

DCIM adalah kelompok perangkat lunak untuk mengelola infrastruktur fisik data center, yaitu perangkat TI, perangkat daya, sistem pendingin, dan ruang, dalam satu sistem terpadu. Seiring bertambahnya kebutuhan energi dan tuntutan ketersediaan layanan, kualitas DCIM menjadi faktor penting yang perlu dievaluasi dari sisi biaya energi, ketersediaan, dan sistem pengelolaannya [6].

Dalam laporan ini, fungsi DCIM dikelompokkan menjadi dua:

1. **Pemantauan (*monitoring*)**: membaca kondisi lingkungan dan daya secara *real-time* melalui sensor, misalnya suhu, kelembapan, dan beban listrik. Contohnya adalah sistem pemantauan data center berbasis sensor yang dikembangkan oleh Levy dan Hallstrom [7].
2. **Manajemen aset dan kapasitas**: mencatat lokasi perangkat, ruang rak, sambungan kabel, dan siklus hidup aset sebagai *source of truth*, seperti yang dilakukan NetBox [3].

Project ini berada pada kelompok kedua dan menambahkan pengelolaan maintenance yang terhubung langsung dengan data aset.

### 2.1.3 Rak, rack unit, dan administrasi kabel

Perangkat data center dipasang di rak standar 19 inci. Tinggi rak dan perangkat diukur dalam **rack unit (U)**; menurut EIA-310-E, 1U setara 1,75 inci atau sekitar 4,45 cm [8]. Rak yang umum dipakai setinggi 42U. Dalam sistem ini, penomoran U dimulai dari bawah, mengikuti konvensi bawaan NetBox [3]. Beberapa konsep penempatan yang dipakai dalam sistem ini:

- **Full-depth dan half-depth.** Perangkat full-depth menempati sisi depan dan belakang rak, sedangkan perangkat half-depth (misalnya switch ToR) hanya menempati satu sisi, sehingga dua perangkat half-depth dapat berbagi nomor U yang sama di sisi berbeda.
- **Perangkat 0U.** Perangkat yang dipasang di sisi rak tanpa memakai slot U, misalnya PDU vertikal.
- **Perangkat tanpa rak.** Perangkat besar yang berdiri di lantai ruangan, seperti UPS dan CRAC.
- **Elevation rak.** Gambar tampak depan dan belakang rak yang menunjukkan posisi setiap perangkat per U. Visualisasi ini menjadi cara utama melihat utilisasi dan sisa ruang rak.

Untuk kabel, ANSI/TIA-606-D mengatur sistem administrasi infrastruktur telekomunikasi, termasuk di lingkungan data center, yaitu cara memberi identitas dan mencatat kabel dan titik sambungnya [9]. Prinsip ini diterapkan dengan memberi setiap kabel label unik serta mencatat port di kedua ujungnya, sehingga jalur kabel dapat ditelusuri dari data.

### 2.1.4 Manajemen aset

ISO 55000:2024 mendefinisikan manajemen aset sebagai aktivitas terkoordinasi sebuah organisasi untuk mewujudkan nilai dari aset yang dimilikinya [10]. Dalam konteks ruang server, aset dikelola sepanjang siklus hidupnya: dibeli dan disimpan sebagai stok, dipasang dan aktif, menjalani maintenance, lalu dipensiunkan. Informasi pendukung seperti tanggal pembelian, vendor, dan akhir garansi menentukan kapan perangkat perlu diperbaiki, diklaim, atau diganti. Setiap aset diberi kode unik permanen (*asset tag*) agar dapat dirujuk secara konsisten, termasuk melalui label fisik.

### 2.1.5 Manajemen maintenance

Standar EN 13306:2017 membakukan istilah maintenance yang dipakai dalam project ini [11]:

- **Maintenance preventif**: dilakukan sebelum kerusakan terjadi, pada interval tertentu atau menurut kriteria yang ditetapkan, untuk mengurangi kemungkinan kegagalan fungsi.
- **Maintenance korektif**: dilakukan setelah kerusakan terdeteksi, untuk mengembalikan perangkat ke kondisi yang dapat menjalankan fungsinya.

Perangkat lunak yang mengelola kegiatan ini disebut **CMMS (*Computerized Maintenance Management System*)**. Modul inti CMMS meliputi data peralatan sebagai pusat informasi, modul work order yang disesuaikan dengan model operasional organisasi, dan modul maintenance preventif yang mencatat jadwal serta checklist pekerjaan [12]. SIRAMA menerapkan konsep ini dalam bentuk:

- **Maintenance plan**: jadwal preventif berulang untuk satu perangkat, misalnya "cek baterai UPS setiap 3 bulan".
- **Work order (WO)**: satu pekerjaan maintenance untuk satu perangkat, berjenis preventif (dibuat otomatis dari maintenance plan) atau korektif (dibuat manual), ditugaskan kepada teknisi yang keahliannya sesuai, dan dikerjakan dengan checklist.

### 2.1.6 Analisis dampak (*impact analysis*)

Analisis dampak adalah penentuan perangkat yang ikut terpengaruh bila sebuah perangkat dimatikan atau di-maintenance. Karena data kabel menyimpan hubungan antarport, perangkat terdampak dapat dihitung dengan menelusuri kabel. SIRAMA menelusuri dua jenis sambungan dengan cara berbeda:

- **Jalur daya (berantai).** Kabel daya selalu menyambungkan port keluaran daya (*power outlet*) ke port masukan daya (*power inlet*), sehingga arah aliran daya jelas. Penelusuran dimulai dari outlet perangkat yang dimatikan, berlanjut ke perangkat yang disuplainya, lalu ke perangkat yang disuplai perangkat tersebut, dan seterusnya. Contohnya, mematikan UPS berdampak pada PDU yang disuplainya dan pada server di belakang PDU itu. Perangkat yang masih memiliki inlet lain yang tersambung ke sumber yang tidak terdampak ditandai tetap menyala melalui jalur cadangan, dan penelusuran tidak dilanjutkan melewati perangkat tersebut.
- **Jalur data (satu lompatan).** Kabel data tidak memiliki arah hulu dan hilir yang tercatat, sehingga SIRAMA hanya menampilkan perangkat yang terhubung langsung melalui kabel data. Pada data demo, server tersambung langsung ke switch ToR tanpa melewati patch panel, sehingga perangkat yang terdampak saat switch ToR dimatikan dapat ditampilkan dengan lengkap.

Hasil analisis ini bersifat hipotesis ("bila dimatikan") dan dihitung ulang dari data kabel terkini setiap kali ditampilkan.

## 2.2 Teknologi dan Standar Relevan

Bagian ini hanya membahas teknologi dan standar yang dipakai. Karena data dimasukkan manual, protokol pemantauan perangkat seperti SNMP dan MQTT tidak digunakan.

### 2.2.1 Aplikasi web dan HTTP

SIRAMA adalah aplikasi web yang diakses melalui peramban (*browser*) dengan protokol HTTPS, sehingga dapat dibuka dari komputer di ruang kerja maupun dari ponsel teknisi di depan rak tanpa instalasi aplikasi tambahan.

### 2.2.2 Next.js

Next.js adalah framework React untuk membangun aplikasi web *full-stack*. Next.js menyediakan *routing* berbasis berkas, *server components*, dan *server actions*, sehingga antarmuka dan logika sisi server (validasi, akses basis data, pemeriksaan hak akses) dapat ditulis dalam satu proyek [13]. Framework ini tidak otomatis mengamankan aplikasi: setiap operasi yang dilindungi tetap harus memeriksa sesi dan hak akses pengguna di sisi server. SIRAMA menjalankan pemeriksaan tersebut pada setiap server action dan route handler yang membaca data terbatas atau mengubah data, sehingga aturan akses tidak bergantung pada tampilan di peramban.

### 2.2.3 PostgreSQL, Neon, dan Drizzle ORM

PostgreSQL adalah sistem basis data relasional open source yang mendukung transaksi, *constraint*, dan relasi antartabel [14]. Struktur data SIRAMA bersifat relasional (site memiliki room, room memiliki rack, rack memiliki device, device memiliki port, port terhubung melalui cable), sehingga basis data relasional menjadi pilihan yang sesuai. Neon menyediakan PostgreSQL sebagai layanan cloud *serverless* [15]. Drizzle ORM digunakan sebagai lapisan akses data bertipe TypeScript, sehingga skema tabel dan query diperiksa tipenya saat pengembangan [16].

### 2.2.4 Vercel dan Vercel Cron Jobs

Vercel adalah platform hosting untuk aplikasi Next.js. Pekerjaan terjadwal dijalankan dengan **Vercel Cron Jobs**, yang tersedia di semua paket Vercel. Jadwal ditulis di berkas konfigurasi `vercel.json` berupa alamat endpoint dan ekspresi cron lima kolom; pada waktunya, Vercel mengirim permintaan HTTP GET ke endpoint tersebut pada deployment produksi [17]. Zona waktu ekspresi cron selalu UTC. Pada paket Hobby, setiap cron job hanya boleh berjalan sekali sehari dan dapat dipicu kapan saja dalam jam yang ditentukan [17].

Vercel juga menyediakan layanan penjadwal yang lebih baru, Vercel Schedules, dan dokumentasi Vercel menandai Cron Jobs sebagai fitur lama yang kelak dimigrasikan ke Schedules [17]. Per November 2026 Schedules masih berstatus beta publik, sehingga project ini memilih Cron Jobs yang sudah stabil.

SIRAMA memakai satu cron job harian dengan ekspresi `0 0 * * *` (pukul 00.00 UTC), yang pada paket Hobby berjalan antara pukul 07.00 dan 07.59 WIB. Jadwal ini membuat work order preventif yang tenggatnya tinggal 7 hari dan mengirim pengingat untuk work order yang tenggatnya tinggal 3 hari. Selisih waktu pemicuan tidak berpengaruh karena aturan pembuatan work order dihitung per hari. Endpoint cron dilindungi token rahasia yang disimpan sebagai *environment variable*, sehingga hanya penjadwal yang dapat menjalankannya.

### 2.2.5 QR code

QR code adalah simbologi kode batang dua dimensi yang distandarkan dalam ISO/IEC 18004:2024 [18]. Setiap perangkat diberi label berisi QR code yang memuat alamat halaman detail perangkat, ditambah asset tag dalam bentuk teks. Teknisi cukup memindai label dengan kamera ponsel untuk membuka informasi perangkat, termasuk lokasi, sambungan kabel, dan riwayat maintenance.

### 2.2.6 Aspek keamanan

- **Role-Based Access Control (RBAC).** Hak akses diberikan berdasarkan peran pengguna, bukan per individu [19]. SIRAMA memakai tiga peran (Admin, Teknisi, Viewer) dengan matriks hak akses yang jelas, misalnya hanya Admin yang dapat mengubah data inventaris dan hanya teknisi yang ditugaskan yang dapat mengerjakan sebuah work order.
- **Least privilege.** Setiap pengguna hanya diberi akses sebatas yang dibutuhkan pekerjaannya [20]. Prinsip ini diterapkan dengan menyembunyikan menu yang tidak berhak diakses dan, yang lebih penting, menolak aksi tanpa hak di sisi server.
- **Penyimpanan password.** Password disimpan dalam bentuk *hash* dengan algoritma yang dirancang khusus untuk password, sesuai rekomendasi OWASP [21].
- **Audit log.** Setiap pembuatan, perubahan, dan penghapusan data dicatat beserta pelaku, waktu, serta nilai sebelum dan sesudahnya, sehingga perubahan data dapat ditelusuri.

## 2.3 Metode atau Arsitektur

### 2.3.1 Arsitektur client-server berbasis web

SIRAMA memakai arsitektur client-server tiga lapis:

1. **Lapisan presentasi (client):** peramban di komputer atau ponsel yang menampilkan antarmuka.
2. **Lapisan aplikasi (server):** fungsi Next.js yang berjalan di Vercel, berisi logika bisnis seperti validasi posisi rak, perhitungan analisis dampak, dan pemeriksaan hak akses.
3. **Lapisan data:** basis data PostgreSQL di Neon.

Selain permintaan dari pengguna, terdapat proses otomatis yang dipicu Vercel Cron Jobs setiap pagi untuk membuat work order preventif dan notifikasi. Rincian arsitektur dan topologi dibahas pada Bab III.

### 2.3.2 Siklus hidup pengembangan perangkat lunak (SDLC)

SDLC (*Software Development Life Cycle*) adalah rangkaian tahapan pengembangan perangkat lunak dari perumusan kebutuhan sampai perawatan. Model klasik meliputi Waterfall yang berurutan, model inkremental, dan pendekatan Agile yang iteratif [22], [23]. Seluruh model ini memuat aktivitas dasar yang sama: spesifikasi, perancangan dan implementasi, validasi, serta evolusi perangkat lunak [22].

### 2.3.3 AI-Native SDLC

Project ini memakai **AI-Native SDLC**, panduan praktik yang diterbitkan Anthropic pada Agustus 2026 [24]. Panduan ini berangkat dari pengamatan bahwa asisten AI sudah dapat menulis kode dengan cepat, sehingga hambatan pengembangan berpindah ke langkah yang dikerjakan manusia, yaitu perencanaan, peninjauan, dan deployment. Karena itu, setiap tahap ditutup dengan menyimpan sebuah dokumen (*artifact*) di repositori yang menjadi masukan tahap berikutnya, sekaligus menjadi jejak audit [24].

| Tahap | Kegiatan | Artifact di project ini |
|---|---|---|
| Plan | Merumuskan masalah, tujuan, dan batasan | `intent/asset-maintenance.md` |
| Design | Mengubah intent menjadi spesifikasi | PRD, Design Specification, design system, mockup, Technical Specification |
| Build | Menyusun rencana per fitur sebelum kode ditulis, dengan aturan proyek yang dibaca AI setiap sesi | `plan.md` per fitur, `CLAUDE.md` |
| Test | Memberi AI cara memverifikasi hasil kerjanya sendiri melalui pengujian otomatis | Unit test, integration test, end-to-end test |
| Deploy | Peninjauan perubahan oleh AI dengan persetujuan akhir oleh manusia | Pull request, deployment Vercel |
| Maintain | Bug dan masukan menjadi intent baru | Intent baru |

Siklus ini berbentuk *loop*: temuan pada tahap Maintain kembali menjadi intent baru di tahap Plan. Manusia tetap bertanggung jawab atas keputusan yang membutuhkan penilaian, sementara perhatiannya berpindah ke peninjauan artifact [24]. Dibandingkan model klasik, perbedaan utamanya terletak pada dokumen spesifikasi yang ditulis cukup rinci untuk dibaca oleh AI, serta pengujian otomatis yang wajib lulus sebelum sebuah fitur dianggap selesai. Pada project ini, setiap pull request ditinjau oleh minimal satu anggota tim sebelum digabungkan.

AI-Native SDLC adalah panduan praktik industri yang masih baru dan belum dievaluasi dalam penelitian ilmiah. Karena itu, project ini memakainya sebagai kerangka kerja pengembangan, bukan sebagai klaim bahwa metode ini lebih unggul daripada model klasik. Penerapannya dijelaskan lebih lanjut pada Bab III.

## 2.4 Studi Terkait

Tabel berikut merangkum penelitian dan sistem yang relevan dengan project ini.

| No | Peneliti atau sistem | Sistem dan metode | Hasil atau kemampuan |
|---|---|---|---|
| 1 | Putra, Bisenna, dan Kartini (2018) [25] | Pengembangan sistem inventaris sarana prasarana kampus STMIK STIKOM Indonesia dengan label QR code yang dicetak dan dipindai melalui web service | Pengecekan inventaris satu ruang kelas turun dari sekitar 80,3 menit menjadi sekitar 38 menit; pengujian blackbox lulus untuk seluruh skenario |
| 2 | Ciptadi, Ilyas, dan Syahrir (2023) [26] | Sistem informasi inventarisasi aset Dinas Pendidikan dan Kebudayaan Kota Parepare dengan QR code dan metode Min-Max Stock, dikembangkan dengan model Waterfall | Pencatatan aset lebih cepat dan akurat, disertai peringatan saat stok mencapai batas minimum; pengujian blackbox dengan tiga peran pengguna berhasil |
| 3 | Muzayyin, Wiyono, dan Arif (2026) [27] | Sistem pengelolaan sarana prasarana berbasis web yang memadukan pencatatan aset, maintenance, mutasi aset, dan QR code, dengan metode Simple Additive Weighting (SAW) untuk prioritas maintenance | Pengujian blackbox berhasil; User Acceptance Testing dengan 15 responden menghasilkan skor 90,16% |
| 4 | NetBox dengan plugin netbox-maintenance-device [3], [4] | Sistem open source *source of truth* infrastruktur yang mencakup site, rak, perangkat, kabel, dan jalur daya; plugin komunitas menambahkan maintenance plan berulang | Pemodelan infrastruktur lengkap; plugin mencatat jadwal, riwayat pelaksanaan, serta maintenance yang akan datang dan terlambat |
| 5 | GLPI [5] | Sistem open source manajemen aset TI dan helpdesk dengan modul rak (posisi perangkat dan PDU) dan relasi ketergantungan antaraset | Aset yang terdampak insiden dapat ditampilkan berdasarkan relasi ketergantungan yang dicatat pengguna |

**Perbedaan project ini dengan studi dan sistem terkait:**

1. **Domain data center.** Studi 1 sampai 3 menangani inventaris umum (sarana kelas, barang dinas, aset desa) yang tidak mengenal konsep rak, posisi U, kabel, dan jalur daya. SIRAMA memodelkan ruang server secara spesifik: hierarki site, room, rack, posisi U dengan sisi depan dan belakang, perangkat 0U dan tanpa rak, port, serta kabel data dan daya.
2. **Maintenance dalam satu alur dengan inventaris.** Pada NetBox, maintenance tersedia melalui plugin terpisah, sedangkan studi 3 belum mengenal struktur ruang server. SIRAMA menyatukan maintenance plan, work order preventif otomatis, pengingat tenggat, penugasan berdasarkan keahlian teknisi (IT atau Fasilitas), dan checklist dalam satu aplikasi tanpa pemasangan plugin.
3. **Analisis dampak dari data kabel.** Pada GLPI, hubungan dampak dicatat sebagai relasi ketergantungan yang terpisah dari data sambungan fisik. SIRAMA menghitung perangkat terdampak langsung dari data kabel, menelusuri rantai daya secara berantai beserta status jalur cadangan, dan menampilkannya di form work order sebelum pekerjaan dimulai.
4. **Validasi posisi rak.** Validasi tabrakan posisi U dan batas tinggi rak merupakan praktik umum DCIM yang juga dilakukan NetBox [3]. SIRAMA menerapkan praktik yang sama, dilengkapi pratinjau posisi pada form perangkat. Fitur ini tidak terdapat pada studi 1 sampai 3.
5. **Akses lapangan.** Seperti studi 1 sampai 3, SIRAMA memakai QR code. Bedanya, QR code dipakai teknisi untuk membuka detail perangkat, sambungan kabel, dan tugas maintenance aktif di ponsel, bukan hanya untuk mendata barang masuk dan keluar.
6. **Skala dan metode pengembangan.** NetBox dan GLPI dirancang sebagai platform umum yang luas, sedangkan SIRAMA sengaja dibatasi pada kebutuhan ruang server kampus kecil. Studi 2 memakai model Waterfall, sedangkan SIRAMA dikembangkan dengan AI-Native SDLC yang menjadikan dokumen spesifikasi dan pengujian otomatis sebagai bagian wajib setiap tahap.

---

# DAFTAR PUSTAKA

[1] Telecommunications Industry Association, *ANSI/TIA-942-C: Telecommunications Infrastructure Standard for Data Centers*. Arlington, VA, USA: TIA, 2024.

[2] Uptime Institute, "Uptime announces Annual Outage Analysis Report 2025," *Business Wire*, 6 Mei 2025. [Online]. Tersedia: https://www.businesswire.com/news/home/20250506733553/en/Uptime-Announces-Annual-Outage-Analysis-Report-2025

[3] NetBox Labs, "NetBox documentation." Diakses: 8 Nov 2026. [Online]. Tersedia: https://netboxlabs.com/docs/netbox/

[4] D. Godoy, "netbox-maintenance-device," versi 1.4.3, Python Package Index, 21 Agu 2026. [Online]. Tersedia: https://pypi.org/project/netbox-maintenance-device/

[5] GLPI Project, "Manage rack with GLPI." Diakses: 8 Nov 2026. [Online]. Tersedia: https://www.glpi-project.org/en/manage-rack-with-glpi

[6] V. S. Ratnam dan K. S. Sarma, "The quality of data center infrastructure management (DCIM)," *International Journal of Engineering and Advanced Technology (IJEAT)*, vol. 8, no. 6S3, hlm. 1817-1822, Sep. 2019, doi: 10.35940/ijeat.F1346.0986S319.

[7] M. Levy dan J. O. Hallstrom, "A reliable, non-invasive approach to data center monitoring and management," *Advances in Science, Technology and Engineering Systems Journal*, vol. 2, no. 3, hlm. 1577-1584, 2017, doi: 10.25046/aj0203196.

[8] Electronic Industries Alliance, *EIA/ECA-310-E: Cabinets, Racks, Panels, and Associated Equipment*. Arlington, VA, USA: EIA, 2005.

[9] Telecommunications Industry Association, *ANSI/TIA-606-D: Administration Standard for Telecommunications Infrastructure*. Arlington, VA, USA: TIA, 2021.

[10] International Organization for Standardization, *ISO 55000:2024 Asset management: Vocabulary, overview and principles*. Geneva, Switzerland: ISO, 2024.

[11] European Committee for Standardization, *EN 13306:2017 Maintenance: Maintenance terminology*. Brussels, Belgium: CEN, 2017.

[12] K. Peng, "Computerized management systems," dalam *Equipment Management in the Post-Maintenance Era: Advancing in the Era of Smart Machines*, ed. ke-2. New York, NY, USA: Productivity Press, 2021, bab 9.

[13] Vercel, "Next.js documentation." Diakses: 8 Nov 2026. [Online]. Tersedia: https://nextjs.org/docs

[14] The PostgreSQL Global Development Group, "PostgreSQL documentation." Diakses: 8 Nov 2026. [Online]. Tersedia: https://www.postgresql.org/docs/

[15] Neon, "Neon documentation." Diakses: 8 Nov 2026. [Online]. Tersedia: https://neon.com/docs

[16] Drizzle Team, "Drizzle ORM documentation." Diakses: 8 Nov 2026. [Online]. Tersedia: https://orm.drizzle.team/docs/overview

[17] Vercel, "Cron jobs," Vercel Documentation. Diakses: 8 Nov 2026. [Online]. Tersedia: https://vercel.com/docs/schedules/cron-jobs

[18] International Organization for Standardization dan International Electrotechnical Commission, *ISO/IEC 18004:2024 Information technology: Automatic identification and data capture techniques: QR Code bar code symbology specification*. Geneva, Switzerland: ISO, 2024.

[19] D. F. Ferraiolo dan D. R. Kuhn, "Role-based access controls," dalam *Proc. 15th National Computer Security Conference*, Baltimore, MD, USA, 1992, hlm. 554-563.

[20] Joint Task Force, *Security and Privacy Controls for Information Systems and Organizations*, NIST Special Publication 800-53 Rev. 5. Gaithersburg, MD, USA: NIST, 2020.

[21] OWASP Foundation, "Password storage cheat sheet," OWASP Cheat Sheet Series. Diakses: 8 Nov 2026. [Online]. Tersedia: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

[22] I. Sommerville, *Software Engineering*, ed. ke-10. Boston, MA, USA: Pearson, 2016.

[23] R. S. Pressman dan B. R. Maxim, *Software Engineering: A Practitioner's Approach*, ed. ke-9. New York, NY, USA: McGraw-Hill, 2020.

[24] L. Claxton, "The AI-native SDLC playbook," Claude Blog, Anthropic, 21 Agu 2026. [Online]. Tersedia: https://claude.com/blog/the-ai-native-sdlc-playbook

[25] I. N. T. A. Putra, I. K. A. Bisenna, dan K. S. Kartini, "Pengembangan sistem inventaris berbasis QR code menggunakan web service pada Bidang Sarana dan Prasarana STMIK STIKOM Indonesia," *Jurnal Nasional Pendidikan Teknik Informatika (JANAPATI)*, vol. 7, no. 3, hlm. 315-323, 2018, doi: 10.23887/janapati.v7i3.16658.

[26] C. Ciptadi, M. Ilyas, dan Syahrir, "Perancangan aplikasi sistem informasi inventarisasi aset menggunakan QR code (studi kasus Dinas Pendidikan dan Kebudayaan Kota Parepare)," *Jurnal Teknologi Elekterika*, vol. 20, no. 2, hlm. 104-112, 2023.

[27] F. Muzayyin, S. Wiyono, dan Z. Arif, "Implementasi sistem pengelolaan sarana dan prasarana berbasis website dengan metode Simple Additive Weighting (SAW) untuk penentuan prioritas (studi kasus: Kelurahan Desa Bandasari)," *Journal of Information Technology and Computer Science (INTECOMS)*, vol. 9, no. 3, hlm. 575-589, 2026.
