# Hasil Review: Laporan Project SIRAMA, Bab I dan Bab II

Dokumen yang direview: `laporan-bab1-bab2.md` (versi 8 Nov 2026, 25 referensi).
Patokan: template laporan dan ketentuan tugas UTS/UAS Data Center Management, bukan standar jurnal.
Laporan tidak diubah; semua usulan ada di dokumen ini.

**Catatan kejujuran.** Laporan ini aku tulis sendiri, dan kelima kursi reviewer di bawah dijalankan oleh model yang sama dalam satu konteks, setelah membaca hasil kursi sebelumnya. Pemisahan peran membantu melihat dari sudut berbeda, tetapi ini bukan pemeriksaan independen dan risiko menilai karya sendiri terlalu lunak tetap ada. Untuk penilaian yang benar-benar independen, minta satu teman atau dosen membaca bagian 1.1 dan 2.4, karena di situlah temuan terberat berada.

Pemeriksaan sumber tambahan selama review:
- Siaran pers resmi Uptime Institute untuk Annual Outage Analysis 2025 (6 Mei 2025).
- Halaman PyPI plugin `netbox-maintenance-device` (versi 1.4.3, 21 Agu 2026).
- Artikel GLPI tentang manajemen rak.

---

## Ringkasan keputusan

**Keputusan: Revisi Mayor (hanya teks, sistem tidak perlu diubah).**

Struktur laporan sudah lengkap dan mengikuti template. Bab II kuat: standar yang dirujuk tepat, istilah konsisten, dan setiap teori dikaitkan ke fitur. Masalah utamanya ada di **klaim posisi project** (1.1 dan 2.4). Celah yang diklaim ("NetBox tidak punya modul maintenance") ternyata sudah diisi sebagian oleh plugin dan sistem lain, dan satu persoalan di latar belakang tidak benar-benar diselesaikan oleh desain SIRAMA. Keduanya bisa diperbaiki dengan menulis ulang beberapa paragraf, tanpa mengubah fitur.

| Tingkat | Jumlah | Contoh |
|---|---|---|
| CRITICAL (divalidasi) | 1 | Persoalan "data tidak sinkron" tidak terjawab oleh input manual |
| MAJOR | 6 | Celah NetBox, sumber Uptime sekunder, latar belakang berupa skenario, batasan jaringan |
| MINOR | 12 | Sampul, sitasi 2.1.2, ukuran tujuan, metadata EIA-310-E |

---

## 1. Penilai Kesesuaian (Dosen DCM)

**Kesan umum.** Laporan siap dibaca dan rapi. Semua sub-bab template ada, urutannya benar, dan jumlah referensi (25) jauh di atas minimum 10. Bahasa akademik baik dan konsisten.

**Kekuatan**
- 2.2 mengikuti instruksi "pilih hanya yang digunakan" dan secara eksplisit menyebut SNMP/MQTT tidak dipakai beserta alasannya.
- 2.4 memenuhi syarat minimal tiga referensi dan menulis perbedaan secara berbutir.
- Tujuan 1.3 disajikan dengan ukuran keberhasilan, sesuai permintaan template agar tujuan terukur.

**Temuan**

| ID | Tingkat | Lokasi | Temuan | Usulan |
|---|---|---|---|---|
| EIC-1 | MINOR | Sampul | Baris "Nama Kelompok" dan "Semester / Tahun Akademik" dari template tidak ada | Tambahkan, misalnya "Semester Ganjil 2026/2027" dan nama kelompok bila ada |
| EIC-2 | MAJOR | 1.4 | Template meminta batasan **jaringan** dan anggaran. Anggaran sengaja dihapus (keputusan tim), tetapi batasan jaringan sama sekali tidak dibahas | Tambah satu butir batasan jaringan (lihat R3-1) |
| EIC-3 | MINOR | 1.1 | Template meminta "kondisi awal dan dampak". Dampak belum dikuantifikasi (berapa lama mencari perangkat, berapa WO terlewat) | Tambah satu kalimat angka perkiraan atau hasil observasi (lihat DA-2) |
| EIC-4 | MINOR | 1.2 | Rumusan masalah 1 memuat target angka ("kurang dari 30 detik"). Target lebih tepat di 1.3 | Rumuskan sebagai pertanyaan saja; angka tetap di tabel 1.3 |
| EIC-5 | MINOR | Judul daftar pustaka | "(sementara, untuk Bab I dan Bab II)" sebaiknya dihapus pada versi yang dikumpulkan | Hapus keterangan dalam kurung |

---

## 2. Reviewer 1: Metodologi (Dosen Rekayasa Perangkat Lunak)

**Kesan umum.** Rantai rumusan masalah ke tujuan ke batasan konsisten: lima rumusan memetakan ke tujuan 1 sampai 5, dan tujuan 6 menangani pengujian. Kelemahannya ada pada ukuran yang belum punya cara mengukur dan beberapa ukuran yang berbunyi lebih kuat dari yang bisa dibuktikan.

**Temuan**

| ID | Tingkat | Lokasi | Temuan | Usulan |
|---|---|---|---|---|
| R1-1 | MAJOR | 1.3 no. 1 dan 5 | Target "kurang dari 30 detik" dan "kurang dari 2 menit" tidak menyebut siapa yang mengukur, berapa kali, dan mulai dari titik mana (misalnya setelah login, dari dashboard) | Tambah kolom atau catatan "Cara mengukur": misalnya 5 percobaan oleh 3 anggota tim, diukur dengan stopwatch dari halaman dashboard, nilai median |
| R1-2 | MINOR | 1.3 no. 2 | "Pengujian otomatis untuk **setiap** kombinasi posisi" tidak realistis untuk ditulis apa adanya (tinggi perangkat x posisi U x sisi x kedalaman) | Ganti menjadi "pengujian otomatis untuk kasus batas: U paling bawah dan atas, tumpang tindih sebagian, sisi depan/belakang, half-depth, dan melebihi tinggi rak" |
| R1-3 | MINOR | 1.3 no. 3 | Tujuan berbunyi "memastikan tidak ada maintenance yang terlewat", padahal sistem hanya bisa membuat WO dan mengingatkan; pengerjaan tetap oleh manusia | Ubah menjadi "memastikan setiap maintenance terjadwal tercatat sebagai WO dan keterlambatan terlihat di dashboard" |
| R1-4 | MINOR | 1.3 no. 6 | "100% test case blackbox valid" bergantung pada test case yang ditulis sendiri, sehingga bisa dipenuhi dengan test case sedikit | Kaitkan ke cakupan: "setiap kebutuhan Must di PRD memiliki minimal satu test case, dan seluruhnya valid" |
| R1-5 | MINOR | 1.4 no. 1 | "Performa diuji sampai 20 rack dan 500 perangkat" tidak punya pasangan di tujuan dan tidak punya target (waktu muat berapa?) | Tambahkan target, misalnya halaman daftar device termuat kurang dari 2 detik pada data 500 perangkat, atau hapus kalimatnya |
| R1-6 | MINOR | 2.3.3 | Tabel AI-Native SDLC jelas, tetapi tidak dijelaskan bagaimana tim memeriksa hasil AI (siapa yang meninjau, kriteria lolos) | Satu kalimat: setiap pull request ditinjau minimal satu anggota tim dan semua tes harus lulus. Rincian di Bab III |

---

## 3. Reviewer 2: Bidang (Praktisi Infrastruktur Data Center)

**Kesan umum.** Teori domain ditulis dengan benar: definisi U menurut EIA-310-E, full/half-depth, 0U, TIA-606-D untuk administrasi kabel, EN 13306 untuk istilah maintenance, dan jalur daya redundan. Kelemahannya pada pemetaan sistem pembanding: laporan hanya membandingkan dengan NetBox tanpa plugin dan tiga sistem inventaris umum, padahal ada pembanding yang lebih dekat.

**Temuan**

| ID | Tingkat | Lokasi | Temuan | Bukti | Usulan |
|---|---|---|---|---|---|
| R2-1 | MAJOR | 1.1 paragraf terakhir, 2.4 butir 3 | Klaim "NetBox tidak memiliki modul maintenance bawaan" benar secara harfiah, tetapi menyesatkan sebagai celah. Plugin komunitas `netbox-maintenance-device` sudah menyediakan maintenance plan berulang per device, riwayat eksekusi, dan tampilan jatuh tempo/terlambat | PyPI, versi 1.4.3 (21 Agu 2026) | Akui plugin itu, lalu tunjukkan pembeda yang tetap berlaku: WO dengan penugasan berdasarkan keahlian teknisi, checklist, alur kerja di ponsel lewat QR, dan analisis dampak sebelum maintenance, dalam satu aplikasi yang sederhana untuk skala kampus |
| R2-2 | MAJOR | 2.4 | GLPI, sistem open source yang banyak dipakai kampus dan instansi di Indonesia, sudah punya manajemen rak dengan posisi U dan PDU sejak versi 9.3, serta relasi ketergantungan aset untuk melihat aset terdampak sejak 9.5, ditambah modul tiket. Ini pembanding paling dekat dan belum disebut | Artikel GLPI "Manage rack with GLPI" | Tambah GLPI ke tabel 2.4 (sebagai sistem, bukan penelitian) atau ke 1.1, dan jelaskan pembedanya |
| R2-3 | MAJOR | 2.4 butir 4 | "Validasi tabrakan posisi U ... tidak terdapat pada studi 1 sampai 4" benar terhadap empat studi itu, tetapi NetBox sendiri sudah menolak penempatan U yang bertabrakan dan punya penelusuran jalur kabel. Pembaca yang kenal NetBox akan menganggap ini klaim kebaruan yang berlebihan | Pengetahuan umum tentang NetBox; rujuk dokumentasi [3] | Tulis sebagai "mengikuti praktik DCIM seperti NetBox" lalu tekankan yang khas: indikator jalur daya cadangan dalam analisis dampak yang ditampilkan di form WO |
| R2-4 | MINOR | 2.4 no. 4 (Ratnam & Sarma) | Kajian kualitas DCIM, bukan sistem sejenis. Tetap sah sebagai rujukan teori di 2.1.2, tetapi lemah sebagai studi terkait | Pindahkan ke 2.1.2 saja, dan isi slot 2.4 dengan NetBox+plugin dan GLPI, atau dengan satu penelitian implementasi DCIM/manajemen rak bila ada |
| R2-5 | MINOR | 2.1.2 | Pembagian DCIM menjadi "dua kelompok" diberi rujukan [5] dan [3], tetapi kedua sumber itu tidak membuat pembagian tersebut ([5] tentang pemantauan, [3] dokumentasi NetBox) | Rumusan [5] dan [3] | Tulis "Dalam laporan ini, fungsi DCIM dikelompokkan menjadi dua", lalu rujuk masing-masing sumber hanya untuk contohnya |
| R2-6 | MINOR | 2.1.1 | "Empat kebutuhan utama" tidak dirujuk, sedangkan [1] menyebut cakupan yang lebih luas (termasuk proteksi kebakaran dan pemantauan) | 1.1 sendiri mengutip tujuh aspek dari [1] | Samakan dengan daftar dari [1] atau sebut "di antaranya" |
| R2-7 | MINOR | Pustaka [6] | Pada 2005, EIA/ECA-310-E diterbitkan oleh Electronic Components Association (ECA), bukan EIA. Perlu dicek ulang di halaman penerbit sebelum dikumpulkan | Belum diverifikasi dalam review ini | Periksa dan sesuaikan nama penerbit |

---

## 4. Reviewer 3: Sudut Pandang Pengelola TI Kampus

**Kesan umum.** Manfaat per peran (1.5) masuk akal dan sesuai kebutuhan nyata: teknisi di depan rak memang butuh informasi cepat, dan pimpinan memang butuh ringkasan tanpa hak ubah. Yang belum dipikirkan adalah kondisi lapangan dan ketergantungan pada layanan luar.

**Temuan**

| ID | Tingkat | Lokasi | Temuan | Usulan |
|---|---|---|---|---|
| R3-1 | MAJOR | 1.4 | Alur QR di ponsel membutuhkan internet. Ruang server sering bersinyal seluler lemah, dan saat terjadi gangguan jaringan kampus, aplikasi yang di-host di cloud justru tidak bisa dibuka ketika paling dibutuhkan | Tambahkan batasan jaringan: aplikasi membutuhkan koneksi internet (Wi-Fi kampus atau seluler); tidak ada mode luring. Sebut juga label QR tetap mencantumkan asset tag dalam teks agar bisa dicari manual |
| R3-2 | MAJOR | 2.2.4 | Vercel Schedules masih berstatus beta publik, tetapi laporan menyebutnya sebagai pengganti Cron Jobs tanpa catatan itu. Bila fitur beta berubah atau bermasalah menjelang demo, fitur WO otomatis ikut gagal | Sebut status beta secara terbuka dan cadangannya, misalnya endpoint yang sama dapat dijalankan manual oleh Admin atau dialihkan ke Vercel Cron Jobs |
| R3-3 | MINOR | 1.4 no. 6 | Data aset kampus disimpan di layanan cloud luar negeri (Neon, Vercel). Untuk project tugas tidak masalah, tetapi pengelola nyata akan menanyakannya | Satu kalimat batasan: data demo bukan data riil kampus; penerapan nyata perlu kebijakan penyimpanan data institusi |
| R3-4 | MINOR | 1.5 no. 4 | "Risiko gangguan ... dapat dikurangi" adalah dampak yang tidak diukur dalam project ini | Tulis sebagai manfaat yang diharapkan, bukan hasil |

---

## 5. Devil's Advocate

**Argumen tandingan terkuat.** Persoalan nomor 1 di latar belakang adalah catatan yang tidak sinkron dengan kondisi fisik, karena perubahan tidak diikuti pembaruan catatan. SIRAMA tetap mengandalkan input manual (batasan 1.4 no. 2). Jadi penyebab yang sama, yaitu orang lupa memperbarui catatan, tetap bisa terjadi di SIRAMA. Memindahkan spreadsheet ke aplikasi web tidak dengan sendirinya membuat data sinkron. Ditambah lagi, celah "NetBox tidak punya maintenance" sudah diisi plugin, dan validasi U sudah ada di NetBox. Pembaca kritis bisa menyimpulkan: "Ini NetBox versi kecil dengan plugin maintenance, kenapa tidak pakai itu saja?"

**Temuan**

| ID | Tingkat | Lokasi | Temuan | Usulan |
|---|---|---|---|---|
| DA-1 | CRITICAL | 1.1 persoalan 1, 1.4 no. 2 | Celah logika antara masalah dan solusi: penyebab ketidaksinkronan (pembaruan manual yang terlewat) tidak dihilangkan oleh sistem yang juga diisi manual | Jelaskan mekanisme yang membuat pembaruan lebih mungkin terjadi: (a) satu sumber data menggantikan beberapa spreadsheet, (b) QR di rak membuat teknisi bisa membuka dan memeriksa data di tempat, (c) audit log menunjukkan kapan data terakhir diubah dan oleh siapa, (d) validasi menolak data yang mustahil. Lalu nyatakan batasnya: sinkron tetap bergantung pada disiplin pengguna, dan discovery otomatis di luar lingkup |
| DA-2 | MAJOR | 1.1 paragraf 3 | Empat persoalan ditulis seperti hasil observasi ("sering tidak sesuai", "baru diketahui setelah tenggatnya lewat"), padahal kalimat pembukanya menyebut "skenario project". Tidak ada wawancara, observasi, atau data | Pilih salah satu: (a) wawancarai singkat pengelola ruang server Universitas Buddhi Dharma dan kutip hasilnya, atau (b) tulis jujur sebagai skenario yang disusun dari persoalan umum di literatur [2], dengan kata kerja hipotetis |
| DA-3 | MAJOR | 1.1 paragraf 2, pustaka [2] | Angka Uptime dikutip dari berita The Register, bukan dari Uptime. Siaran pers resmi Uptime (6 Mei 2025) memuat angka yang berbeda: 85% gangguan besar akibat kesalahan manusia berasal dari staf yang tidak mengikuti prosedur **atau** dari prosedur yang cacat, dan porsi kegagalan mengikuti prosedur naik sepuluh poin persentase. Angka 58% dan "dua pertiga hingga empat perlima" tidak bisa dikonfirmasi dari siaran pers itu dalam review ini | Ganti [2] dengan siaran pers Uptime Institute (Business Wire, 6 Mei 2025), lalu kutip kalimat dan angka persis dari sumber itu. Bila tetap ingin 58%, pastikan angka itu ada di sumber primer |
| DA-4 | MAJOR | 1.1 paragraf terakhir dan 2.4 | Klaim celah dan kebaruan terlalu kuat (gabungan R2-1, R2-2, R2-3) | Ubah dari "belum ada" menjadi "tersedia secara terpisah atau lewat plugin pada sistem besar; SIRAMA menyatukannya dalam alur sederhana untuk ruang server kampus kecil". Jawab langsung pertanyaan "kenapa tidak pakai NetBox atau GLPI": tujuan pembelajaran mata kuliah, kebutuhan alur teknisi di ponsel, dan analisis dampak yang terpasang di form WO |
| DA-5 | MINOR | 2.3.3, pustaka [22] | Metode inti project bersumber dari satu artikel blog vendor, bukan publikasi ilmiah, dan vendor yang sama membuat alat AI yang dipakai | Tambah satu kalimat bahwa metode ini adalah panduan praktik industri yang baru, belum dievaluasi secara ilmiah, dan dipakai sebagai kerangka kerja, bukan sebagai klaim hasil |

**Pemeriksaan lain yang lolos.** Tidak ditemukan sumber yang dipakai berlawanan dengan isinya selain DA-3 dan R2-5. Definisi EN 13306 dan ISO 55000 sesuai. Studi 1 sampai 3 diringkas sesuai isi abstraknya. Tidak ada generalisasi berlebihan pada hasil, karena Bab I-II memang belum melaporkan hasil.

---

## 6. Keputusan Editorial

**Keputusan: Revisi Mayor.**

**Putusan atas temuan CRITICAL.** DA-1 **divalidasi**. Ini celah logika yang nyata: laporan menjanjikan penyelesaian masalah sinkronisasi tanpa menjelaskan mekanismenya, dan dosen DCM kemungkinan besar akan menanyakannya saat presentasi. Perbaikannya cukup berupa teks (mekanisme dan batasannya), tanpa mengubah fitur. Laporan tidak boleh dianggap siap kumpul sebelum DA-1 dijawab.

**Konsensus.** Kelima kursi sepakat bahwa struktur, cakupan teori, dan jumlah referensi sudah baik. Empat kursi (R2, R3, DA, dan Penilai) menunjuk masalah yang sama dari arah berbeda: laporan menggambarkan konteks dan celah dengan lebih pasti daripada yang didukung bukti.

**Perbedaan pendapat.** R2 menilai Ratnam & Sarma cukup dipindah ke 2.1.2, sedangkan DA tidak mempersoalkannya. Diputuskan mengikuti R2 (MINOR), karena template 2.4 meminta studi yang dapat dibandingkan, dan GLPI atau NetBox dengan plugin lebih tepat mengisi slot itu.

**Alasan bukan Revisi Minor.** Temuan R2-1, R2-2, DA-1, dan DA-4 menyentuh klaim inti project, yaitu kenapa SIRAMA perlu dibuat. Meskipun cara memperbaikinya sederhana, bagian yang berubah adalah argumen utama Bab I dan 2.4.

---

## 7. Revision Roadmap

Urutan di bawah adalah urutan pengerjaan yang disarankan, dimulai dari yang mengubah argumen. Pilihan apa yang dikerjakan tetap keputusan tim.

| No | Temuan | Bagian | Pekerjaan | Perkiraan |
|---|---|---|---|---|
| 1 | DA-1 | 1.1, 1.4 | Tambah paragraf mekanisme pembaruan data dan batasnya | 20 menit |
| 2 | DA-2, EIC-3 | 1.1 | Putuskan: wawancara singkat pengelola ruang server, atau ubah ke bahasa skenario | 15 menit (atau 1 jam dengan wawancara) |
| 3 | DA-3 | 1.1, [2] | Ganti sumber ke siaran pers Uptime dan sesuaikan angka | 15 menit |
| 4 | R2-1, R2-2, R2-3, DA-4 | 1.1, 2.4 | Tulis ulang klaim celah; tambah plugin NetBox dan GLPI; ubah butir pembeda 3 dan 4 | 45 menit |
| 5 | R2-4 | 2.1.2, 2.4 | Pindahkan Ratnam & Sarma | 10 menit |
| 6 | R3-1, EIC-2 | 1.4 | Tambah butir batasan jaringan | 10 menit |
| 7 | R3-2 | 2.2.4 | Sebut status beta Vercel Schedules dan cadangannya | 10 menit |
| 8 | R1-1 s.d. R1-5 | 1.3, 1.4 | Tambah cara mengukur dan rapikan ukuran tujuan | 30 menit |
| 9 | Sisanya (MINOR) | Sampul, 1.2, 2.1.1, 2.1.2, 2.3.3, pustaka | Perbaikan kecil dan pengecekan metadata [6] | 30 menit |

Total perkiraan sekitar 3 jam, tanpa perubahan pada aplikasi, PRD, maupun mockup.

---

## Sumber yang diperiksa selama review

- [Uptime Announces Annual Outage Analysis Report 2025](https://www.businesswire.com/news/home/20250506733553/en/Uptime-Announces-Annual-Outage-Analysis-Report-2025), Business Wire, 6 Mei 2025
- [netbox-maintenance-device](https://pypi.org/project/netbox-maintenance-device/), PyPI
- [Manage rack with GLPI](https://www.glpi-project.org/en/manage-rack-with-glpi), GLPI Project
