# 04. Katalog dan administrasi

Rujukan: design.md HAL-20 s.d. HAL-28, MOD-04, MOD-05, MOD-09, KOM-39, KOM-41, KOM-45.

---

## HAL-20 Daftar manufacturer dan MOD-04

```
Katalog > Manufacturer

Manufacturer                                              [# Tambah manufacturer ]

[ Cari manufacturer...             ]
┌──────────────┬──────────────┬─────┐
│ Nama         │ Jumlah model │     │
├──────────────┼──────────────┼─────┤
│ APC          │ 2            │[...]│
│ Cisco        │ 2            │[...]│
│ Dell         │ 1            │[...]│
│ HPE          │ 1            │[...]│
│ Vertiv       │ 1            │[...]│
└──────────────┴──────────────┴─────┘

MOD-04
┌──────────────────────────────┐
│ Tambah manufacturer      [x] │
├──────────────────────────────┤
│ Nama                         │
│ [ Synology                 ] │
├──────────────────────────────┤
│          [ Batal ] [# Simpan ]│
└──────────────────────────────┘
```

---

## HAL-21 Daftar device function dan MOD-05

```
Katalog > Device function

Device function                                        [# Tambah device function ]

┌──────────────┬───────────┬──────────────────┬───────────────┬─────┐
│ Nama         │ Kategori  │ Warna elevation  │ Jumlah device │     │
├──────────────┼───────────┼──────────────────┼───────────────┼─────┤
│ Server       │ IT        │ ▌[biru]          │ 12            │[...]│
│ Switch       │ IT        │ ▌[cokelat]       │ 5             │[...]│
│ Firewall     │ IT        │ ▌[cokelat]       │ 1             │[...]│
│ Storage      │ IT        │ ▌[hijau]         │ 1             │[...]│
│ Patch panel  │ IT        │ ▌[abu]           │ 1             │[...]│
│ PDU          │ Fasilitas │ ▌[merah bata]    │ 8             │[...]│
│ UPS          │ Fasilitas │ ▌[merah bata]    │ 1             │[...]│
│ CRAC         │ Fasilitas │ ▌[abu kebiruan]  │ 2             │[...]│
└──────────────┴───────────┴──────────────────┴───────────────┴─────┘

MOD-05
┌──────────────────────────────────────┐
│ Tambah device function           [x] │
├──────────────────────────────────────┤
│ Nama                                 │
│ [ Genset                           ] │
│                                      │
│ Kategori                             │
│ ( ) IT   (•) Fasilitas               │
│ Menentukan teknisi yang dapat        │
│ ditugaskan.                          │
├──────────────────────────────────────┤
│                  [ Batal ] [# Simpan ]│
└──────────────────────────────────────┘
```

---

## HAL-22 Daftar model

```
Katalog > Model

Model                                                              [# Tambah model ]

[ Cari model...                    ]  [ Manufacturer: semua v ]
┌──────────────┬────────────────────┬────────┬────────────┬──────────┬────────┬────────┐
│ Manufacturer │ Nama               │ Tinggi │ Full-depth │ Daya     │ Port   │ Device │
├──────────────┼────────────────────┼────────┼────────────┼──────────┼────────┼────────┤
│ Dell         │ PowerEdge R650     │ 2U     │ Ya         │ 800 W    │ 4      │ 8      │
│ HPE          │ ProLiant DL380 G11 │ 2U     │ Ya         │ 1000 W   │ 4      │ 4      │
│ Cisco        │ Catalyst C9300-48T │ 1U     │ Tidak      │ 350 W    │ 52     │ 4      │
│ APC          │ AP8941             │ 0U     │ —          │ —        │ 25     │ 8      │
│ APC          │ SRT10K             │ 6U     │ Ya         │ —        │ 7      │ 1      │
└──────────────┴────────────────────┴────────┴────────────┴──────────┴────────┴────────┘
  [...] per baris (Should): Duplikat model
```

---

## HAL-23 Form model (KOM-39 editor port template)

### Mode ubah, model sudah dipakai device

```
Katalog > Model > Dell PowerEdge R650 > Ubah

Ubah model

Spesifikasi
  Manufacturer
  [ Dell                                   v]
  Nama
  [ PowerEdge R650                         ]
  Tinggi                                  Daya maksimum (opsional)
  [ 2                    U ]              [ 800                  W ]
  [x] Full-depth                          (disembunyikan bila tinggi 0)

Port template
┌─ (!) Perubahan port template hanya berlaku untuk device yang dibuat setelah ini. ─┐
│     8 device yang sudah ada tidak berubah.                                        │
└───────────────────────────────────────────────────────────────────────────────────┘
┌────────────────────┬──────────────────────────────────────────┬────────────────┬─────┐
│ Nama               │ Jenis                                    │ Konektor (ops.)│     │
├────────────────────┼──────────────────────────────────────────┼────────────────┼─────┤
│ [ eth0           ] │ (•) Data ( ) Power inlet ( ) Power outlet │ [ RJ45       ] │ [x] │
│ [ eth1           ] │ (•) Data ( ) Power inlet ( ) Power outlet │ [ RJ45       ] │ [x] │
│ [ PSU1           ] │ ( ) Data (•) Power inlet ( ) Power outlet │ [ C14        ] │ [x] │
│ [ PSU1           ] │ ( ) Data (•) Power inlet ( ) Power outlet │ [ C14        ] │ [x] │
│ (!) Nama sudah dipakai di model ini.                                                │
└────────────────────┴──────────────────────────────────────────┴────────────────┴─────┘
[ + Tambah port ]
```

### Pola rentang (Should)

```
Port template
Tulis pola seperti port[1-48] untuk membuat banyak port sekaligus.
┌────────────────────┬──────────────────────────────────────────┬────────────────┬─────┐
│ [ port[1-48]     ] │ (•) Data ( ) Power inlet ( ) Power outlet │ [ RJ45       ] │ [x] │
│ (i) Akan menjadi 48 port: port1 sampai port48                                       │
│ [ uplink[1-4]    ] │ (•) Data ( ) Power inlet ( ) Power outlet │ [ SFP+       ] │ [x] │
│ (i) Akan menjadi 4 port: uplink1 sampai uplink4                                     │
│ [ PSU[1-2]       ] │ ( ) Data (•) Power inlet ( ) Power outlet │ [ C14        ] │ [x] │
│ (i) Akan menjadi 2 port: PSU1 sampai PSU2                                           │
└────────────────────┴──────────────────────────────────────────┴────────────────┴─────┘
Total: 54 port template.
```

### Duplikat model (Should)

```
Tambah model

┌─ (i) Salinan dari Dell PowerEdge R650. Ganti nama sebelum menyimpan. ────────────────┐
└──────────────────────────────────────────────────────────────────────────────────────┘
  Nama
  [ PowerEdge R650 (salinan)               ]   ← disorot
  (spesifikasi dan 4 port template ikut tersalin)

                                                         [ Batal ] [# Simpan model ]
```

---

## HAL-24 Detail model

```
Katalog > Model > Dell PowerEdge R650

Dell PowerEdge R650                                            [ Ubah ] [...]
                                                    [...]: Duplikat model (Should), Hapus

Spesifikasi
  Manufacturer      _Dell_
  Tinggi            2U, full-depth
  Daya maksimum     800 W

Port template
┌──────┬─────────────┬──────────┐
│ Nama │ Jenis       │ Konektor │
├──────┼─────────────┼──────────┤
│ eth0 │ Data        │ RJ45     │
│ eth1 │ Data        │ RJ45     │
│ PSU1 │ Power inlet │ C14      │
│ PSU2 │ Power inlet │ C14      │
└──────┴─────────────┴──────────┘

Device dengan model ini (8)
  _srv-web-01_  _srv-web-02_  _srv-db-01_  _srv-db-02_  _srv-app-01_  ...
```

---

## HAL-25 Daftar user

```
Administrasi > User

User                                                                 [# Tambah user ]

[ Cari nama atau email...          ]  [ Filter v ]
┌──────────┬──────────────────────┬─────────┬───────────┬──────────────┬─────┐
│ Nama     │ Email                │ Peran   │ Keahlian  │ Status       │     │
├──────────┼──────────────────────┼─────────┼───────────┼──────────────┼─────┤
│ Andi     │ andi@kampus.ac.id    │ Admin   │ —         │ [on] Aktif   │[...]│
│ Rina     │ rina@kampus.ac.id    │ Teknisi │ IT        │ [on] Aktif   │[...]│
│ Joko     │ joko@kampus.ac.id    │ Teknisi │ Fasilitas │ [on] Aktif   │[...]│
│ Dimas    │ dimas@kampus.ac.id   │ Teknisi │ Keduanya  │ [on] Aktif   │[...]│
│ Sari     │ sari@kampus.ac.id    │ Viewer  │ —         │ [on] Aktif   │[...]│
│ Budi     │ budi@kampus.ac.id    │ Teknisi │ IT        │ [off]Nonaktif│[...]│
└──────────┴──────────────────────┴─────────┴───────────┴──────────────┴─────┘
  [...] berisi: Ubah, Nonaktifkan/Aktifkan
```

---

## HAL-26 Form user

```
Administrasi > User > Tambah user

Tambah user

  Nama
  [ Dimas                                  ]

  Email
  [ dimas@kampus.ac.id                     ]

  Password awal
  [ ••••••••••                      [lihat]]

  Peran
  ( ) Admin   (•) Teknisi   ( ) Viewer

  Keahlian                                     ← hanya tampil bila peran Teknisi
  ( ) IT   ( ) Fasilitas   (•) Keduanya

                                                          [ Batal ] [# Simpan user ]
```

Mode ubah tidak menampilkan kolom password awal; sebagai gantinya ada tombol "Atur ulang password":

```
Ubah user

  Nama            [ Rina                          ]
  Email           [ rina@kampus.ac.id             ]
  Peran           ( ) Admin   (•) Teknisi   ( ) Viewer
  Keahlian        (•) IT   ( ) Fasilitas   ( ) Keduanya

  [ Atur ulang password ]
                                                          [ Batal ] [# Simpan user ]
```

### MOD-12 Atur ulang password

```
┌──────────────────────────────────────────────────┐
│ Atur ulang password Rina?                    [x] │
├──────────────────────────────────────────────────┤
│ Password lama tidak berlaku dan Rina akan keluar │
│ dari semua perangkat.                            │
│                                                  │
│ Password baru                                    │
│ [ ••••••••••                            [lihat]] │
├──────────────────────────────────────────────────┤
│              [ Batal ] [! Atur ulang password ]  │
└──────────────────────────────────────────────────┘
```

---

## HAL-31 Akun saya (Should)

```
Akun saya

Nama        Rina
Email       rina@kampus.ac.id
Peran       Teknisi · IT

Ganti password
  Password lama
  [ ••••••••                       [lihat]]
  (!) Password lama salah.

  Password baru
  [ ••••••••••                     [lihat]]

  Ulangi password baru
  [ ••••••••••                     [lihat]]

                                                        [# Simpan password ]
```

---

## HAL-27 Audit log dan MOD-09 Detail audit (KOM-45)

```
Administrasi > Audit log

Audit log

[ Pelaku: semua v ]  [ Jenis objek: semua v ]  [ 1 Okt 2026 - 9 Okt 2026 ]
┌──────────────────────┬────────┬───────┬──────────────┬──────────────────────────┐
│ Waktu                │ Pelaku │ Aksi  │ Jenis objek  │ Objek                    │
├──────────────────────┼────────┼───────┼──────────────┼──────────────────────────┤
│ 9 Okt 2026, 09.41    │ Andi   │ Buat  │ Work order   │ WO-0014                  │
│ 9 Okt 2026, 09.30    │ Andi   │ Buat  │ Device       │ srv-app-04               │
│ 9 Okt 2026, 08.12    │ Rina   │ Ubah  │ Work order   │ WO-0010                  │
│ 9 Okt 2026, 08.12    │ Sistem │ Ubah  │ Device       │ srv-db-01                │
│ 9 Okt 2026, 07.00    │ Sistem │ Buat  │ Work order   │ WO-0013                  │
└──────────────────────┴────────┴───────┴──────────────┴──────────────────────────┘
                     klik baris ↓

                                   ┌─ MOD-09 Detail audit ────────────────────────[x]┐
                                   │ 9 Okt 2026, 08.12 WIB · Sistem · Ubah            │
                                   │ Device _srv-db-01_                               │
                                   │                                                  │
                                   │ Field     │ Sebelum      │ Sesudah               │
                                   │ ──────────┼──────────────┼────────────────────── │
                                   │ Status    │ [Aktif]      │ [Maintenance]         │
                                   │           │  merah pucat │  hijau pucat          │
                                   │ Nama      │ srv-db-01    │ srv-db-01             │
                                   │ Rack      │ RK-A01       │ RK-A01                │
                                   │ Posisi U  │ 37           │ 37                    │
                                   │ ...                                              │
                                   └──────────────────────────────────────────────────┘
                                     Panel samping dari kanan (HP: dari bawah).
                                     Field yang berubah ditaruh paling atas.
```

---

## HAL-28 Cetak label (Should, KOM-41 label QR)

### Label tunggal

```
┌──────────────────────────────────────┐   ~63,5 × 33,9 mm, hitam putih
│ ┌──────────┐                         │
│ │ ▓▓ ▓ ▓▓▓ │   DCM-0007              │   ← asset tag, paling besar
│ │ ▓ ▓▓▓ ▓▓ │   srv-db-01             │   ← nama device
│ │ ▓▓▓ ▓ ▓▓ │   SIRAMA                │   ← wordmark, paling kecil
│ └──────────┘                         │
└──────────────────────────────────────┘
  QR berisi tautan /a/DCM-0007
```

### Halaman cetak

```
Inventaris > Device > Cetak label

Cetak label · 9 device · 1 lembar                       [ Batal ] [# Cetak ]

  ┌─────────────────── A4 ───────────────────┐
  │ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
  │ │[QR] 0001 │ │[QR] 0002 │ │[QR] 0003 │   │
  │ │srv-web-01│ │sw-tor-01 │ │pdu-a01-a │   │
  │ └──────────┘ └──────────┘ └──────────┘   │
  │ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
  │ │[QR] 0004 │ │[QR] 0005 │ │[QR] 0006 │   │
  │ │pdu-a01-b │ │core-sw-01│ │fw-01     │   │
  │ └──────────┘ └──────────┘ └──────────┘   │
  │ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
  │ │[QR] 0007 │ │[QR] 0008 │ │[QR] 0009 │   │
  │ │srv-db-01 │ │srv-web-02│ │sto-01    │   │
  │ └──────────┘ └──────────┘ └──────────┘   │
  │                                          │
  │  ... grid 3 kolom × 8 baris = 24 label   │
  └──────────────────────────────────────────┘

  Saat dicetak: sidebar, header, dan tombol disembunyikan.
```
