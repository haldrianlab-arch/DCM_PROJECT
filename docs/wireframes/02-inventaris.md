# 02. Inventaris

Rujukan: design.md HAL-06 s.d. HAL-12, MOD-01 s.d. MOD-03, KOM-32, KOM-33, KOM-35, KOM-36, KOM-40, KOM-41, KOM-43.

---

## HAL-06 Lokasi (KOM-35 pohon lokasi)

### Desktop, Admin

```
Lokasi                                 [ Tambah site ] [ Tambah room ] [# Tambah rack ]

v Kampus Utama  · 2 room                                                        [...]
  [ + Tambah room ]

  v Ruang Server Gedung A  · 4 rack · 3 device tanpa rack                       [...]
    [ + Tambah rack ]
    ┌──────────┬────────┬────────────┬──────────────────────────┬─────────────────────┬───────┐
    │ Nama     │ Tinggi │ U terpakai │ Utilisasi                │ Estimasi daya       │       │
    ├──────────┼────────┼────────────┼──────────────────────────┼─────────────────────┼───────┤
    │ RK-A01   │ 42U    │ 9U         │ ████░░░░░░░░░░░░  21%    │ 3.450 / 5.000 W 69% │ [...] │
    │ RK-A02   │ 42U    │ 7U         │ ███░░░░░░░░░░░░░  17%    │ 2.100 W             │ [...] │
    │ RK-A03   │ 42U    │ 8U         │ ███░░░░░░░░░░░░░  19%    │ 2.600 W             │ [...] │
    │ RK-A04   │ 42U    │ 10U        │ ████░░░░░░░░░░░░  24%    │ 3.000 W             │ [...] │
    └──────────┴────────┴────────────┴──────────────────────────┴─────────────────────┴───────┘
    "3.450 / 5.000 W 69%" bila rack punya kapasitas daya (Should); selain itu hanya estimasi.
    Tanpa rack:  ups-01 {Aktif}   crac-01 {Aktif}   crac-02 {Aktif}      

  v Ruang Server Gedung B  · 0 rack                                              [...]
    Belum ada rack.  [ + Tambah rack ]

  [...] berisi: Ubah, Hapus
  Pindah room ke site lain / rack ke room lain: lewat Ubah (ganti induk).
  Bila room di satu site lebih dari 5, room tertutup secara bawaan.
```

### Viewer dan Teknisi

Pohon yang sama tanpa tombol tambah dan tanpa `[...]`.

### Belum ada site sama sekali

```
Lokasi                         [# Tambah site ] [ Tambah room ] [ Tambah rack ]
                                                  (nonaktif)      (nonaktif)
                                         Tambahkan site terlebih dahulu.

                      [ikon gedung]
              Belum ada site tercatat.
                  [# Tambah site ]
```

---

## MOD-01 Site, MOD-02 Room, MOD-03 Rack

TPL-04. Satu modal per entitas, dipakai untuk tambah dan ubah.

```
MOD-01 (tambah)                    MOD-02 (dari "+ Tambah room" di baris site)
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ Tambah site              [x] │   │ Tambah room              [x] │
├──────────────────────────────┤   ├──────────────────────────────┤
│ Nama                         │   │ Nama                         │
│ [ Kampus Utama             ] │   │ [ Ruang Server Gedung B    ] │
│                              │   │                              │
│                              │   │ Site                         │
│                              │   │ [ Kampus Utama            v] │
│                              │   │   ↑ terisi otomatis,         │
│                              │   │     tetap bisa diganti       │
├──────────────────────────────┤   ├──────────────────────────────┤
│          [ Batal ] [# Simpan ]│   │          [ Batal ] [# Simpan ]│
└──────────────────────────────┘   └──────────────────────────────┘

MOD-03 (ubah, tinggi dikecilkan terlalu kecil)
┌──────────────────────────────────────────┐
│ Ubah rack                            [x] │
├──────────────────────────────────────────┤
│ Nama                                     │
│ [ RK-A01                               ] │
│                                          │
│ Room                                     │
│ [ Ruang Server Gedung A               v] │
│                                          │
│ (i) 9 device ikut pindah bila room       │
│     diganti.                             │
│                                          │
│ Tinggi                                   │
│ [ 38                               U ]   │
│ (!) Rack ini berisi device sampai U42.   │
│     Tinggi minimal 42U.                  │
│                                          │
│ Kapasitas daya (opsional)                │
│ [ 5000                             W ]   │
│ Dipakai untuk peringatan saat memasang   │
│ device. Kosongkan bila tidak diketahui.  │
├──────────────────────────────────────────┤
│                    [ Batal ] [# Simpan ] │
└──────────────────────────────────────────┘
```

Di HP modal tampil layar penuh.

---

## HAL-07 Detail rack (KOM-32 elevation rack)

### Desktop, Admin

```
Inventaris > Lokasi > RK-A01

RK-A01                                  [ Cetak label semua device ] [ Ubah ] [...]
_Kampus Utama_ / _Ruang Server Gedung A_

42U · 9U terpakai · 33U kosong · 21%
Estimasi daya 3.450 / 5.000 W (69%)  ███████████░░░░░   (1 device tanpa data daya)

            Depan                                  Belakang
     ┌──────────────────────────────┐      ┌──────────────────────────────┐
 U42 │ .....                        │      │▌sw-tor-01          {Aktif}   │
 U41 │ ..... + Pasang di sini ..... │ ←    │ .....                        │
 U40 │▌srv-web-01                   │ slot │▌//// srv-web-01 //////////// │
 U39 │▌                    {Aktif}  │ ko-  │▌//////////////////////////// │
 U38 │▌srv-db-01                    │ song │▌//// srv-db-01 ///////////// │
 U37 │▌              {Maintenance}  │ di-  │▌//////////////////////////// │
 U36 │ .....                        │ sorot│ .....                        │
 U35 │▌core-sw-01          {Aktif}  │      │ .....                        │
 U34 │▌fw-01               {Aktif}  │      │ .....                        │
 U33 │ .....                        │      │ .....                        │
 U32 │ .....                        │      │ .....                        │
 U31 │▌srv-web-02                   │      │▌//// srv-web-02 //////////// │
 U30 │▌                    {Aktif}  │      │▌//////////////////////////// │
 U29 │ .....                        │      │ .....                        │
     │  ...                         │      │  ...                         │
 U2  │ .....                        │      │ .....                        │
 U1  │ .....                        │      │ .....                        │
     └──────────────────────────────┘      └──────────────────────────────┘

Terpasang 0U:   pdu-a01-a {Aktif}    pdu-a01-b {Aktif}

  ▌ = garis kiri warna device function (server biru, switch/firewall cokelat, dst.)
  //// = sisi lain device full-depth (berarsir, tanpa lencana)
  sw-tor-01 dan core-sw-01 half-depth: hanya tampil di satu sisi
```

### Keterangan saat blok disorot

```
 U38 │▌srv-db-01 ◄──┐
 U37 │▌             │
                    ┌──────────────────────────────┐
                    │ srv-db-01                    │
                    │ Dell PowerEdge R650          │
                    │ DCM-0007 · {Maintenance}     │
                    │ Klik untuk detail            │
                    └──────────────────────────────┘
```

### HP

```
┌──────────────────────────┐
│ < Lokasi                 │
│ RK-A01              [...]│
│ 42U · 9U terpakai · 21%  │
│                          │
│      Depan    Belakang   │
│    ┌────────┬────────┐   │
│ U42│ ...    │▌sw-tor │   │
│ U41│ ...    │ ...    │   │
│ U40│▌srv-web│▌/////// │   │
│ U39│▌   {v} │▌/////// │   │
│ U38│▌srv-db │▌/////// │   │
│ U37│▌   {~} │▌/////// │   │
│    │  ...   │  ...   │   │
│    └────────┴────────┘   │
│ {v} {~} = lencana versi  │
│ ringkas (ikon saja)      │
│                          │
│ Terpasang 0U             │
│ pdu-a01-a {Aktif}        │
│ pdu-a01-b {Aktif}        │
├──────┬──────┬──────┬─────┤
```

---

## HAL-08 Daftar device

TPL-01, Admin.

```
Inventaris > Device

Device                                                          [# Tambah device ]

[ Cari nama, asset tag, serial...      ]  [ Filter v ]
                                                      2 dipilih: [ Cetak label ]
┌───┬─────────────┬──────────┬───────────┬──────────────────┬───────────────────┬───────────────┬──────────────┬─────┐
│[ ]│ Nama        │ Asset tag│ Function  │ Model            │ Lokasi            │ Status        │ Akhir garansi│     │
├───┼─────────────┼──────────┼───────────┼──────────────────┼───────────────────┼───────────────┼──────────────┼─────┤
│[x]│ srv-web-01  │ DCM-0001 │ Server    │ Dell R650        │ RK-A01 · U39-U40  │ {Aktif}       │ 12 Mar 2028  │[...]│
│[x]│ sw-tor-01   │ DCM-0002 │ Switch    │ Cisco C9300-48T  │ RK-A01 · U42      │ {Aktif}       │ 1 Jun 2027   │[...]│
│[ ]│ pdu-a01-a   │ DCM-0003 │ PDU       │ APC AP8941       │ RK-A01 · 0U       │ {Aktif}       │ —            │[...]│
│[ ]│ srv-db-01   │ DCM-0007 │ Server    │ Dell R650        │ RK-A01 · U37-U38  │ {Maintenance} │ 2 Okt 2026 ▲ │[...]│
│[ ]│ ups-01      │ DCM-0020 │ UPS       │ APC SRT10K       │ Gedung A · tanpa  │ {Aktif}       │ 5 Jan 2027   │[...]│
│   │             │          │           │                  │ rack              │               │              │     │
│[ ]│ srv-app-03  │ DCM-0021 │ Server    │ HPE DL380 Gen11  │ —                 │ {Stok}        │ 20 Agu 2029  │[...]│
└───┴─────────────┴──────────┴───────────┴──────────────────┴───────────────────┴───────────────┴──────────────┴─────┘
Menampilkan 1-25 dari 23 device                                          < 1 >

  ▲ = tanggal berwarna merah (garansi habis) atau amber (segera habis)
  Filter: status, device function, room, rack (termasuk "Tanpa rack"), garansi
```

---

## HAL-09 Form device

### Desktop, dibuka dari slot kosong U41 di RK-A02, posisi bentrok

```
Inventaris > Device > Tambah device

Tambah device

Identitas
  Nama
  [ srv-app-04                         ]

  Model
  [ Dell PowerEdge R650 (2U, full-depth)   v]

  Device function
  [ Server                                 v]

  Serial number (opsional)
  [ 8HQ21L7                            ]

  Status
  ( ) Stok   (•) Aktif   ( ) Pensiun

Penempatan                                         Pratinjau RK-A02 · depan
  Room                                             ┌──────────────┐
  [ Ruang Server Gedung A               v]     U42 │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ sw-tor-02
                                               U41 │XXXXXXXXXXXXXX│ ← merah
  Rack (opsional)                              U40 │XXXXXXXXXXXXXX│ ← merah
  [ RK-A02                              v]     U39 │              │
                                               U38 │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
  Sisi                                         U37 │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
  (•) Depan   ( ) Belakang                         │     ...      │
                                                   └──────────────┘
  Posisi U                                         (!) U41-U42 bertabrakan
  [ U41                                 v]             dengan sw-tor-02
  (!) Posisi U41-U42 bertabrakan dengan                (full-depth tidak boleh
      sw-tor-02. Pilih posisi lain.                    berbagi U dengan device
                                                       di sisi belakang).

                                                   Estimasi daya rack:
                                                   2.100 W → 2.900 W
                                                   (tanpa kapasitas daya)

Pembelian & garansi
  Boleh dikosongkan bila data pembelian tidak tersedia.
  Tanggal beli (opsional)   Vendor (opsional)            Akhir garansi (opsional)
  [ 1 Sep 2026      ]       [ PT Mitra Solusi     ]      [ 1 Sep 2029      ]

                                                     [ Batal ] [# Simpan device ]
```

Setelah posisi diganti ke U39, sorotan pratinjau berubah warna `air` di U39-U40 dan pesan hilang.

Bila rack punya kapasitas daya dan pemasangan melewatinya (Should), di bawah pratinjau tampil peringatan amber, bukan merah, dan tombol Simpan tetap aktif:

```
  (!) Estimasi daya menjadi 5.250 W, melebihi
      kapasitas 5.000 W. Device tetap dapat
      disimpan.
```

### Variasi bagian Penempatan

```
Rack = "Tanpa rack (berdiri di lantai room)"     Model 0U (PDU) di rack
  Room                                             Room
  [ Ruang Server Gedung A      v]                  [ Ruang Server Gedung A      v]
  Rack (opsional)                                  Rack (opsional)
  [ Tanpa rack (berdiri di lantai room)  v]        [ RK-A02                     v]
  (Sisi dan Posisi U disembunyikan)                Device 0U dipasang tanpa posisi U.

Status = Stok atau Pensiun                       Mode ubah, device sedang Maintenance
  (Bagian Penempatan tidak ditampilkan)            Status
                                                   Maintenance (diatur oleh work order)
```

### Mode ubah: bagian atas

```
Ubah device
DCM-0007

Identitas
  Nama
  [ srv-db-01                          ]
  Model
  Dell PowerEdge R650
  Model tidak dapat diubah karena port sudah terbentuk.
```

---

## HAL-10 Detail device

### Desktop, Admin: tab Ringkasan

```
Inventaris > Device > srv-db-01

srv-db-01                                [ Ubah ] [ Unduh label ] [ Buat WO korektif ] [...]
DCM-0007 · {Maintenance} · {Garansi habis}                     [...]: Pindah ke stok,
                                                                      Pensiunkan, Hapus
                                                                      (nonaktif: sedang
                                                                       Maintenance)
 Ringkasan  │ Port & cable │ Maintenance │ Riwayat
────────────┴──────────────┴─────────────┴──────────────────────────────────────────────

Lokasi                                            ┌──────┐
  Site        Kampus Utama                        │▓▓▓▓▓▓│
  Room        Ruang Server Gedung A           U38 │██████│ ← device ini (garis air)
  Rack        _RK-A01_                        U37 │██████│
  Posisi      U37-U38 · depan                     │▓▓▓▓▓▓│
                                                  └──────┘
Spesifikasi
  Model             Dell PowerEdge R650 (2U, full-depth)
  Device function   Server (IT)
  Serial number     7XK92M3

Pembelian & garansi
  Tanggal beli      2 Okt 2023
  Vendor            PT Mitra Solusi
  Akhir garansi     2 Okt 2026  {Garansi habis}

QR code
  ┌────────┐
  │ ▓▓  ▓▓ │   /a/DCM-0007
  │  ▓▓▓▓  │
  │ ▓▓  ▓▓ │
  └────────┘
```

### Tab Port & cable (KOM-36 panel dampak di bawah)

```
 Ringkasan │ Port & cable │ Maintenance │ Riwayat
───────────┴──────────────┴─────────────┴──────────────────────────────────────────────

                                                                       [ Tambah port ]
┌─────────────────┬──────────────┬───────────┬────────────────────────┬────────┬─────────────────────┐
│ Port            │ Jenis        │ Konektor  │ Tersambung ke          │ Cable  │                     │
├─────────────────┼──────────────┼───────────┼────────────────────────┼────────┼─────────────────────┤
│ eth0            │ Data         │ RJ45      │ _sw-tor-01_ · port 3   │ C-0012 │ [...]               │
│ eth1            │ Data         │ RJ45      │ —                      │ —      │ [ Sambungkan ] [...]│
│ eth2  (manual)  │ Data         │ SFP+      │ —                      │ —      │ [ Sambungkan ] [...]│
│ PSU1            │ Power inlet  │ C14       │ _pdu-a01-a_ · outlet 4 │ C-0031 │ [...]               │
│ PSU2            │ Power inlet  │ C14       │ _pdu-a01-b_ · outlet 4 │ C-0032 │ [...]               │
└─────────────────┴──────────────┴───────────┴────────────────────────┴────────┴─────────────────────┘
  [...] port tersambung: Ubah cable, Lepas cable, Ubah port, Hapus port (ditolak: lepas cable dulu)
  [...] port kosong:     Ubah port, Hapus port
  (manual) = port ditambahkan Admin, bukan dari port template model (Should)

┌─ (!) 3 device terhubung ke srv-db-01 ───────────────────────────────────────────┐
│ Data (1)                                                                        │
│   _sw-tor-01_    port 3      ⟷   srv-db-01 eth0                                 │
│ Daya (2)                                                                        │
│   _pdu-a01-a_    outlet 4    ⟷   srv-db-01 PSU1                                 │
│   _pdu-a01-b_    outlet 4    ⟷   srv-db-01 PSU2                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Panel dampak untuk PDU, dengan indikator jalur daya cadangan (Should)

```
┌─ (!) 5 device terhubung ke pdu-a01-a ───────────────────────────────────────────────────┐
│ Daya (5)                                                                                │
│ Bila pdu-a01-a dimatikan:                                                               │
│   _srv-web-01_   PSU1   ⟷  pdu-a01-a outlet 1   [ok] Tetap menyala lewat jalur cadangan │
│   _srv-db-01_    PSU1   ⟷  pdu-a01-a outlet 4   [ok] Tetap menyala lewat jalur cadangan │
│   _core-sw-01_   PSU1   ⟷  pdu-a01-a outlet 6   [ok] Tetap menyala lewat jalur cadangan │
│   _fw-01_        PSU    ⟷  pdu-a01-a outlet 8   (!) Ikut mati, tanpa jalur cadangan     │
│   ...                                                    ↑ amber, bukan merah   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Tab Maintenance

```
 Ringkasan │ Port & cable │ Maintenance │ Riwayat
───────────┴──────────────┴─────────────┴──────────────────────────────────────────────

WO terbuka
┌─────────────────────────────────────────────┐
│ WO-0010                {Dikerjakan}{Terlambat}│
│ Cek fisik srv-db-01                         │
│ RK-A01 · U37-U38 · tenggat 6 Okt 2026       │
│ Preventif                                   │
└─────────────────────────────────────────────┘

Maintenance plan aktif                                  [ Tambah maintenance plan ]
  _Cek fisik server srv-db-01_    setiap 3 bulan    tenggat berikutnya 6 Okt 2026

Riwayat WO
┌─────────┬───────────────────────────┬───────────┬────────┬─────────────┬────────────┐
│ Nomor   │ Judul                     │ Jenis     │ Teknisi│ Tenggat     │ Status     │
├─────────┼───────────────────────────┼───────────┼────────┼─────────────┼────────────┤
│ WO-0010 │ Cek fisik srv-db-01       │ Preventif │ Rina   │ 6 Okt 2026  │{Dikerjakan}│
│ WO-0004 │ Cek fisik srv-db-01       │ Preventif │ Rina   │ 6 Jul 2026  │ {Selesai}  │
│ WO-0002 │ RAM error, ganti DIMM B2  │ Korektif  │ Rina   │ 20 Mei 2026 │ {Selesai}  │
└─────────┴───────────────────────────┴───────────┴────────┴─────────────┴────────────┘
```

### Tab Riwayat

```
┌──────────────────────┬────────┬───────┬────────────────────────────────────┐
│ Waktu                │ Pelaku │ Aksi  │ Ringkasan                          │
├──────────────────────┼────────┼───────┼────────────────────────────────────┤
│ 9 Okt 2026, 08.12    │ Sistem │ Ubah  │ Status: Aktif → Maintenance        │
│ 3 Sep 2026, 10.40    │ Andi   │ Ubah  │ Posisi: U35-U36 → U37-U38          │
│ 2 Okt 2023, 09.00    │ Andi   │ Buat  │ Device dibuat                      │
└──────────────────────┴────────┴───────┴────────────────────────────────────┘
  klik baris → MOD-09 Detail audit
```

### HP, hasil pindai QR (Rina)

```
┌──────────────────────────┐
│ < Device                 │
│ srv-db-01                │
│ DCM-0007                 │
│ {Maintenance}            │
│ {Garansi habis}          │
│                          │
│ ┌──────────────────────┐ │
│ │ RK-A01 · U37-U38     │ │  ← KOM-43 kartu lokasi,
│ │ · depan              │ │    teks besar
│ │ Kampus Utama /       │ │
│ │ Ruang Server Gedung A│ │
│ │ _Buka rack_          │ │
│ └──────────────────────┘ │
│                          │
│ Tugas aktif              │
│ ┌──────────────────────┐ │
│ │ WO-0010 {Dikerjakan} │ │  ← KOM-42 kartu WO
│ │ {Terlambat}          │ │
│ │ Cek fisik srv-db-01  │ │
│ │ tenggat 6 Okt 2026   │ │
│ └──────────────────────┘ │
│                          │
│ > Detail                 │  ← blok buka-tutup,
│ > Port & cable           │    semua tertutup
│ > Maintenance            │
│ > Riwayat                │
├──────┬──────┬──────┬─────┤
│Tugas │Dash- │ Cari │Notif│
└──────┴──────┴──────┴─────┘
```

### MOD-11 Port (Should)

```
Tambah port                                  Ubah port (port tersambung)
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│ Tambah port ke srv-db-01         [x] │     │ Ubah port eth0                   [x] │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│ Nama                                 │     │ Nama                                 │
│ [ eth2                             ] │     │ [ eth0                             ] │
│                                      │     │                                      │
│ Jenis                                │     │ Jenis                                │
│ (•) Data ( ) Power inlet             │     │ Data (terkunci)                      │
│ ( ) Power outlet                     │     │ Jenis tidak dapat diubah selama port │
│                                      │     │ tersambung cable.                    │
│ Tipe konektor (opsional)             │     │                                      │
│ [ SFP+                             ] │     │ Tipe konektor (opsional)             │
│                                      │     │ [ RJ45                             ] │
│ Perubahan hanya berlaku untuk device │     │                                      │
│ ini. Model dan device lain tidak     │     │ Perubahan hanya berlaku untuk device │
│ berubah.                             │     │ ini.                                 │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│                  [ Batal ] [# Simpan ]│     │                  [ Batal ] [# Simpan ]│
└──────────────────────────────────────┘     └──────────────────────────────────────┘
```

---

## HAL-11 Daftar cable

```
Inventaris > Cable

Cable                                                            [# Tambah cable ]

[ Cari label atau device...          ]  [ Filter v ]
┌────────┬────────┬──────────────┬───────────────────────┬───────────────────────────┬─────────┬─────┐
│ Label  │ Tipe   │ Warna        │ Ujung A               │ Ujung B                   │ Panjang │     │
├────────┼────────┼──────────────┼───────────────────────┼───────────────────────────┼─────────┼─────┤
│ C-0012 │ Cat6   │ (●) Biru     │ srv-db-01 · eth0      │ sw-tor-01 · port 3        │ 1 m     │[...]│
│ C-0031 │ Power  │ (●) Hitam    │ srv-db-01 · PSU1      │ pdu-a01-a · outlet 4      │ 1,5 m   │[...]│
│ C-0040 │ Fiber  │ (●) Kuning   │ sw-tor-01 · port 49   │ core-sw-01 · port 12      │ 3 m     │[...]│
│ C-0041 │ DAC    │ —            │ sw-tor-02 · port 49   │ core-sw-01 · port 13      │ —       │[...]│
└────────┴────────┴──────────────┴───────────────────────┴───────────────────────────┴─────────┴─────┘
  [...] berisi: Ubah, Lepas cable
```

---

## HAL-12 Form cable (KOM-40 pemilih port)

Dibuka dari tombol "Sambungkan" di port eth1 srv-db-01, jadi Ujung A sudah terisi.

```
Inventaris > Cable > Tambah cable

Tambah cable

Sambungan
  Ujung A                                     Ujung B
  Device                                      Device
  [ srv-db-01  (RK-A01 · U37-U38)      v]     [ sw-tor-01  (RK-A01 · U42)       v]
  Port                                        Port
  [ eth1 · Data · RJ45                 v]     [ Pilih port                       v]
                                              ┌──────────────────────────────────┐
                                              │ port 4    Data · RJ45            │
                                              │ port 5    Data · RJ45            │
                                              │ ...                              │
                                              │ port 24   Data · RJ45            │
                                              ├──────────────────────────────────┤
                                              │ 21 port disembunyikan:           │
                                              │ port 1-3, 6-20 sudah tersambung; │
                                              │ PSU1, PSU2 jenis tidak cocok     │
                                              └──────────────────────────────────┘
Atribut
  Label
  [ C-0045                 ]

  Tipe
  (•) Cat6   ( ) Fiber   ( ) DAC   ( ) Power

  Warna (opsional)                Panjang (opsional)
  [ Biru                   ]      [ 1                  m ]

                                                      [ Batal ] [# Simpan cable ]
```

Bila kedua ujung adalah port daya, tipe otomatis menjadi Power. Form ini tidak punya tombol lepas cable.
