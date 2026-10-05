# Flowchart Sistem SIRAMA

Dokumen perancangan: **Flowchart Sistem** (deliverable mata kuliah).

Diturunkan dari [`specs/prd.md`](../../specs/prd.md) dan [`specs/design.md`](../../specs/design.md). Diagram ditulis dengan Mermaid sehingga tampil langsung di GitHub dan dapat direvisi sebagai teks. Untuk laporan, buka file ini di GitHub lalu ambil gambarnya, atau ekspor lewat [mermaid.live](https://mermaid.live).

| Kode | Alur | Aktor | Referensi PRD |
|---|---|---|---|
| F1 | Login dan pengalihan per peran | Semua | US-AUTH-01, US-QR-02 |
| F2 | Memasang device ke rak | Admin | US-DEV-02, US-DEV-03 |
| F3 | Menyambung kabel | Admin | US-CAB-01 |
| F4 | Pembuatan work order otomatis | Penjadwal harian (cron) | US-WO-01, US-NOTIF-01 |
| F5 | Mengerjakan work order | Teknisi | US-WO-04 |
| F6 | Memindai QR | Teknisi | US-QR-02 |

### F1. Login dan pengalihan per peran

```mermaid
flowchart TD
    A([Buka SIRAMA]) --> B{Sudah login?}
    B -- Ya --> E{Peran?}
    B -- Tidak --> C[Halaman login]
    C --> D{Email dan password benar, akun aktif?}
    D -- Tidak --> C1[Tampilkan pesan salah login] --> C
    D -- Ya --> F{Datang dari pindai QR?}
    F -- Ya --> G[Buka detail device yang dipindai]
    F -- Tidak --> E
    E -- Admin atau Viewer --> H[Dashboard]
    E -- Teknisi --> I[Tugas saya]
```

### F2. Memasang device ke rak

```mermaid
flowchart TD
    A([Admin klik slot kosong di elevation]) --> B["Form device terbuka, rak, sisi, dan posisi sudah terisi"]
    B --> C[Pilih model, isi identitas dan data pembelian]
    C --> D{"Status Aktif atau Maintenance?"}
    D -- Tidak --> D1[Tolak: hanya device aktif yang boleh menempati rak] --> C
    D -- Ya --> E{"Posisi + tinggi melebihi tinggi rak?"}
    E -- Ya --> E1[Tolak: melebihi tinggi rak] --> B
    E -- Tidak --> F{"Bertabrakan dengan device lain pada sisi yang sama?"}
    F -- Ya --> F1[Tolak dan sebutkan device yang bertabrakan] --> B
    F -- Tidak --> G[Simpan device, buat asset tag, bentuk port dari template model]
    G --> H[Catat audit log]
    H --> I([Elevation menampilkan device baru])
```

### F3. Menyambung kabel

```mermaid
flowchart TD
    A([Admin buka form kabel]) --> B[Pilih device dan port ujung A]
    B --> C["Daftar ujung B disaring: hanya port kosong dengan jenis cocok, bukan device yang sama"]
    C --> D[Pilih port ujung B, isi label, tipe, warna, panjang]
    D --> E{"Validasi server lulus?"}
    E -- Tidak --> E1[Tampilkan penyebab penolakan] --> D
    E -- Ya --> F[Simpan kabel dan catat audit log]
    F --> G([Kabel tampil di kedua port])
```

### F4. Pembuatan work order otomatis (cron harian)

```mermaid
flowchart TD
    A([Setiap hari 07.00 WIB]) --> B[Ambil semua rencana aktif]
    B --> C{"Ada rencana yang belum diperiksa?"}
    C -- Tidak --> Z([Selesai, catat hasil eksekusi])
    C -- Ya --> D{"Jatuh tempo 3 hari lagi atau kurang?"}
    D -- Tidak --> C
    D -- Ya --> E{"Sudah punya WO terbuka?"}
    E -- Ya --> C
    E -- Tidak --> F[Buat WO preventif berstatus Terjadwal, salin checklist]
    F --> G{"Ada teknisi default?"}
    G -- Ya --> H[Tugaskan dan kirim notifikasi]
    G -- Tidak --> I[Biarkan tanpa teknisi untuk ditugaskan Admin]
    H --> C
    I --> C
```

### F5. Teknisi mengerjakan work order

```mermaid
flowchart TD
    A([Teknisi buka Tugas saya]) --> B[Pilih WO]
    B --> C[Tekan Mulai pekerjaan]
    C --> D[Status WO Dikerjakan, status device Maintenance]
    D --> E[Kerjakan dan centang checklist]
    E --> F{"Semua item tercentang dan catatan hasil diisi?"}
    F -- Tidak --> E
    F -- Ya --> G[Tekan Selesaikan pekerjaan]
    G --> H[Status WO Selesai, waktu selesai dicatat]
    H --> I{"Masih ada WO lain yang Dikerjakan untuk device ini?"}
    I -- Ya --> J[Status device tetap Maintenance]
    I -- Tidak --> K[Status device kembali Aktif]
    J --> L{"WO preventif?"}
    K --> L
    L -- Ya --> M[Jatuh tempo berikutnya = jatuh tempo WO + interval]
    L -- Tidak --> N([Selesai])
    M --> N
```

### F6. Memindai QR

```mermaid
flowchart TD
    A([Teknisi memindai label dengan kamera HP]) --> B["Browser membuka tautan /a/asset-tag"]
    B --> C{Sudah login?}
    C -- Tidak --> D[Login] --> E
    C -- Ya --> E{"Asset tag ditemukan?"}
    E -- Tidak --> F([Halaman tidak ditemukan])
    E -- Ya --> G([Detail device versi HP: lokasi dan tugas aktif di atas])
```