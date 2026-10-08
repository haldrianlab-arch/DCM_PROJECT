# Flowchart Sistem SIRAMA

Dokumen perancangan: **Flowchart Sistem** (deliverable mata kuliah).

Diturunkan dari [`specs/PRD.md`](../../specs/PRD.md) v0.3 dan [`specs/design.md`](../../specs/design.md) v0.3. Diagram ditulis dengan Mermaid sehingga tampil langsung di GitHub dan dapat direvisi sebagai teks. Untuk laporan, buka file ini di GitHub lalu ambil gambarnya, atau ekspor lewat [mermaid.live](https://mermaid.live).

| Kode | Alur | Aktor | Referensi PRD |
|---|---|---|---|
| F1 | Login dan pengalihan per peran | Semua | US-AUTH-01, US-QR-02 |
| F2 | Memasang device ke rack | Admin | US-DEV-01, US-DEV-02 |
| F3 | Menyambung cable | Admin | US-CAB-01 |
| F4 | Jadwal otomatis harian | Penjadwal harian (cron) | US-WO-01, US-NOTIF-01, US-NOTIF-02 |
| F5 | Mengerjakan work order | Teknisi | US-WO-04 |
| F6 | Memindai QR | Teknisi | US-QR-02 |

**Konvensi:** setiap belah ketupat menguji satu aturan dengan cabang Ya/Tidak. Semua penolakan pada form kembali ke satu langkah "Isi atau perbaiki form", karena form tetap terbuka dan user cukup memperbaiki kolom yang ditandai.

---

### F1. Login dan pengalihan per peran

```mermaid
flowchart TD
    A([Buka SIRAMA]) --> B{Sudah login?}
    B -- Ya --> E{Peran?}
    B -- Tidak --> C[Halaman login]
    C --> D{Email dan password benar, akun aktif?}
    D -- Tidak --> C1[Tampilkan pesan: Email atau password salah] --> C
    D -- Ya --> F{Login dipicu pindai QR?}
    F -- Ya --> G([Buka detail device yang dipindai])
    F -- Tidak --> E
    E -- Admin atau Viewer --> H([Dashboard])
    E -- Teknisi --> I([Tugas saya])
```

---

### F2. Memasang device ke rack

Pemeriksaan posisi dilakukan dua kali: di pratinjau sebelum menyimpan (mencegah kesalahan) dan saat menyimpan (karena isi rack bisa berubah oleh user lain selama form terbuka).

```mermaid
flowchart TD
    A([Admin klik slot kosong di elevation rack]) --> B["Form device terbuka: status Aktif; room, rack, sisi, dan posisi U terisi sesuai slot"]
    B --> C[Isi atau perbaiki form]
    C --> P{"Pratinjau: posisi melebihi tinggi rack atau bertabrakan?"}
    P -- Ya --> P1[Sorot merah di pratinjau dan sebut penyebabnya] --> C
    P -- Tidak --> S[Tekan Simpan device]
    S --> V1{"Identitas valid? Field wajib terisi, nama dan serial number belum dipakai"}
    V1 -- Tidak --> E[Tampilkan pesan di kolom yang salah] --> C
    V1 -- Ya --> V2{"Posisi masih dalam tinggi rack?"}
    V2 -- Tidak --> E
    V2 -- Ya --> V3{"Bebas tabrakan dengan device lain pada sisi yang sama?"}
    V3 -- Tidak --> E
    V3 -- Ya --> G[Simpan device, buat asset tag, bentuk port dari port template model]
    G --> H[Catat audit log]
    H --> I([Kembali ke detail rack; device tampil di elevation])
```

---

### F3. Menyambung cable

```mermaid
flowchart TD
    A([Admin buka form cable dari daftar cable atau tombol Sambungkan di port kosong]) --> B["Pilih device dan port Ujung A; hanya port yang belum tersambung ditampilkan"]
    B --> C["Ujung B disaring: bukan device yang sama, port belum tersambung, jenis cocok dengan Ujung A"]
    C --> D[Isi atau perbaiki form: Ujung B, label, tipe, warna, panjang]
    D --> S[Tekan Simpan cable]
    S --> V1{"Kedua port masih kosong?"}
    V1 -- Tidak --> E[Tampilkan pesan di kolom yang salah] --> D
    V1 -- Ya --> V2{"Jenis port cocok? data-data atau power inlet-power outlet"}
    V2 -- Tidak --> E
    V2 -- Ya --> V3{"Label belum dipakai cable lain?"}
    V3 -- Tidak --> E
    V3 -- Ya --> F[Simpan cable dan catat audit log]
    F --> G([Cable tampil di kedua port])
```

---

### F4. Jadwal otomatis harian

Berjalan setiap hari pukul 07.00 WIB. Bagian pertama membuat WO preventif; bagian kedua mengirim pengingat dan peringatan. Setiap notifikasi dikirim sekali per WO, sehingga menjalankan ulang di hari yang sama tidak menghasilkan WO atau notifikasi ganda.

```mermaid
flowchart TD
    A([Setiap hari 07.00 WIB]) --> B[Ambil semua maintenance plan aktif]
    B --> C{"Masih ada maintenance plan yang belum diperiksa?"}
    C -- Ya --> D{"Tenggat berikutnya 3 hari lagi atau kurang?"}
    D -- Tidak --> C
    D -- Ya --> E{"Sudah punya WO terbuka?"}
    E -- Ya --> C
    E -- Tidak --> F["Buat WO preventif berstatus Terjadwal: nomor WO baru; judul, tenggat, dan checklist dari maintenance plan"]
    F --> G{"Ada teknisi bawaan?"}
    G -- Ya --> H[Tugaskan teknisi dan kirim notifikasi penugasan] --> C
    G -- Tidak --> I[Kirim notifikasi WO belum punya teknisi ke semua Admin] --> C
    C -- Tidak --> J[Ambil semua WO terbuka]
    J --> K{"Masih ada WO yang belum diperiksa?"}
    K -- Tidak --> Z([Selesai; catat hasil eksekusi])
    K -- Ya --> L{"Tenggat 3 hari lagi atau kurang, punya teknisi, dan pengingat belum dikirim?"}
    L -- Ya --> M[Kirim pengingat tenggat ke teknisi] --> N
    L -- Tidak --> N{"Tenggat sudah lewat dan peringatan terlambat belum dikirim?"}
    N -- Ya --> O[Kirim notifikasi WO terlambat ke semua Admin] --> K
    N -- Tidak --> K
```

---

### F5. Mengerjakan work order

```mermaid
flowchart TD
    A([Teknisi buka Tugas saya]) --> B[Pilih WO]
    B --> C[Tekan Mulai pekerjaan]
    C --> D[Status WO menjadi Dikerjakan, status device menjadi Maintenance]
    D --> E[Kerjakan, centang checklist, isi catatan hasil]
    E --> F{"Semua item checklist tercentang dan catatan hasil terisi?"}
    F -- Tidak --> E
    F -- Ya --> G[Tekan Selesaikan pekerjaan]
    G --> H[Status WO menjadi Selesai, waktu selesai dicatat]
    H --> I{"Masih ada WO lain yang Dikerjakan untuk device ini?"}
    I -- Ya --> J[Status device tetap Maintenance]
    I -- Tidak --> K[Status device kembali Aktif]
    J --> L{"WO preventif?"}
    K --> L
    L -- Ya --> M[Tenggat berikutnya maintenance plan = tenggat WO + interval]
    L -- Tidak --> N([Selesai])
    M --> N
```

---

### F6. Memindai QR

```mermaid
flowchart TD
    A([Teknisi memindai label dengan kamera HP]) --> B["Browser membuka tautan /a/asset-tag"]
    B --> C{Sudah login?}
    C -- Tidak --> D[Login] --> E
    C -- Ya --> E{"Asset tag terdaftar?"}
    E -- Tidak --> F([Halaman tidak ditemukan])
    E -- Ya --> G([Detail device versi HP: lokasi dan tugas aktif di atas])
```
