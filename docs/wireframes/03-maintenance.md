# 03. Maintenance

Rujukan: design.md HAL-13 s.d. HAL-19, MOD-07, MOD-08, KOM-36, KOM-37, KOM-38, KOM-44, KOM-46.

---

## HAL-13 Daftar work order

TPL-01, Admin.

```
Maintenance > Work order

Work order                                                      [# Buat WO korektif ]

[ Cari nomor WO, judul, device...    ]  [ Filter v ]
Filter: {Status: Terjadwal, Dikerjakan  x}

┌─────────┬──────────────────────────────┬─────────────┬───────────┬───────────────────┬─────────────┬──────────────────────────┐
│ Nomor   │ Judul                        │ Device      │ Jenis     │ Teknisi           │ Tenggat     │ Status                   │
├─────────┼──────────────────────────────┼─────────────┼───────────┼───────────────────┼─────────────┼──────────────────────────┤
│ WO-0010 │ Cek fisik srv-db-01          │ srv-db-01   │ Preventif │ Rina              │ 6 Okt 2026  │ {Dikerjakan} {Terlambat} │
│ WO-0014 │ Port 12 sw-tor-02 mati       │ sw-tor-02   │ Korektif  │ Rina              │ 9 Okt 2026  │ {Terjadwal}              │
│ WO-0012 │ Cek baterai ups-01           │ ups-01      │ Preventif │ Joko              │ 11 Okt 2026 │ {Terjadwal}              │
│ WO-0013 │ Bersihkan filter crac-01     │ crac-01     │ Preventif │ Belum ada teknisi │ 12 Okt 2026 │ {Terjadwal}              │
│ WO-0011 │ Update firmware sw-tor-01    │ sw-tor-01   │ Preventif │ Rina              │ 14 Okt 2026 │ {Terjadwal}              │
└─────────┴──────────────────────────────┴─────────────┴───────────┴───────────────────┴─────────────┴──────────────────────────┘
Menampilkan 1-5 dari 5 work order

  Filter: status, jenis, teknisi (termasuk "Belum ada teknisi"), hanya yang terlambat
```

---

## HAL-14 Form work order korektif (KOM-36 panel dampak)

Dibuka dari tombol "Buat WO korektif" di detail sw-tor-02, jadi device sudah terisi.

```
Maintenance > Work order > Buat WO korektif

Buat work order korektif
WO preventif dibuat otomatis dari _maintenance plan_.

  Judul
  [ Port 12 sw-tor-02 mati                                  ]

  Device
  [ sw-tor-02  (RK-A02 · U42)                              v]

  ┌─ (!) 6 device terhubung ke sw-tor-02 ────────────────────────────────┐
  │ Data (4)                                                             │
  │   _srv-web-03_   eth0      ⟷  sw-tor-02 port 1                       │
  │   _srv-app-01_   eth0      ⟷  sw-tor-02 port 2                       │
  │   _srv-app-02_   eth0      ⟷  sw-tor-02 port 3                       │
  │   _core-sw-01_   port 13   ⟷  sw-tor-02 port 49                      │
  │ Daya (2)                                                             │
  │   _pdu-a02-a_    outlet 1  ⟷  sw-tor-02 PSU1                         │
  │   _pdu-a02-b_    outlet 1  ⟷  sw-tor-02 PSU2                         │
  └──────────────────────────────────────────────────────────────────────┘
     ↑ muncul begitu device dipilih; tidak menghalangi penyimpanan

  Deskripsi masalah
  [ Port 12 tidak menyala sejak pagi. Server di port itu     ]
  [ dipindah sementara ke port 13.                           ]

  Tenggat
  [ 9 Okt 2026            ]

  Teknisi (opsional)
  [ Rina (IT)                                              v]
  Device kategori IT: menampilkan teknisi IT dan Keduanya.

  Checklist (opsional)                                      ← KOM-38 editor checklist
  ┌──────────────────────────────────────────────────┬──────────────┐
  │ [ Cek LED port dan log switch               ]    │ [^] [v] [x]  │
  │ [ Ganti transceiver/cable bila perlu        ]    │ [^] [v] [x]  │
  │ [ Kembalikan server ke port 12              ]    │ [^] [v] [x]  │
  └──────────────────────────────────────────────────┴──────────────┘
  [ + Tambah item ]

                                                  [ Batal ] [# Simpan work order ]
```

Sebelum device dipilih, kolom teknisi nonaktif dan panel dampak belum tampil. Device tanpa cable menampilkan panel abu-abu: *"Tidak ada device terhubung."*

Setelah disimpan:

```
                                        ┌───────────────────────────────────┐
                                        │ [ok] WO-0014 dibuat.              │
                                        └───────────────────────────────────┘
```

---

## HAL-15 Detail work order (KOM-37 checklist)

### HP, Teknisi, WO Terjadwal (sebelum dimulai)

```
┌──────────────────────────┐
│ < Tugas saya             │
│ WO-0012                  │
│ Cek baterai ups-01       │
│ {Terjadwal} · Preventif  │
│                          │
│ Device  _ups-01_         │
│ Lokasi  Gedung A · tanpa │
│         rack             │
│ Teknisi Joko             │
│ Tenggat 11 Okt 2026      │
│                          │
│ ┌──────────────────────┐ │
│ │ (!) 6 device         │ │
│ │ terhubung ke ups-01  │ │
│ │ Lihat daftar      v  │ │
│ └──────────────────────┘ │
│                          │
│ Checklist · 0 dari 5     │
│ ──────────────────────── │
│ [ ] Periksa panel indi-  │
│     kator, tidak ada     │
│     alarm aktif          │
│ [ ] Ukur tegangan setiap │
│     blok baterai         │
│ [ ] Periksa fisik bate-  │
│     rai: tidak mengge-   │
│     lembung atau bocor   │
│ [ ] Bersihkan debu pada  │
│     ventilasi UPS        │
│ [ ] Jalankan self-test   │
│ (terkunci sampai mulai)  │
│                          │
│ Dibuat dari maintenance  │
│ plan: _Cek baterai       │
│ ups-01_ (setiap 3 bulan) │
│ Dibuat oleh: Sistem      │
│ (jadwal otomatis),       │
│ 8 Okt 2026, 07.00 WIB    │
│                          │
├──────────────────────────┤
│ [#   Mulai pekerjaan   ] │  ← menempel di bawah
├──────┬──────┬──────┬─────┤
│Tugas │Dash- │ Cari │Notif│
└──────┴──────┴──────┴─────┘
```

### HP, Teknisi, WO Dikerjakan

```
┌──────────────────────────┐
│ < Tugas saya             │
│ WO-0012                  │
│ Cek baterai ups-01       │
│ {Dikerjakan} · Preventif │
│ ...                      │
│                          │
│ Checklist · 3 dari 5     │
│ █████████████░░░░░░░░░   │
│ [x] Periksa panel indi-  │
│     kator, tidak ada     │
│     alarm aktif          │
│ [x] Ukur tegangan setiap │
│     blok baterai         │
│ [x] Periksa fisik bate-  │
│     rai                  │
│ [ ] Bersihkan debu pada  │
│     ventilasi UPS        │
│ [ ] Jalankan self-test   │
│                          │
│ Catatan hasil            │
│ [                      ] │
│ [                      ] │
│                          │
├──────────────────────────┤
│ [  Selesaikan pekerjaan ]│  ← nonaktif (pudar)
│ 2 item belum dicentang;  │
│ catatan hasil kosong.    │
├──────┬──────┬──────┬─────┤
│Tugas │Dash- │ Cari │Notif│
└──────┴──────┴──────┴─────┘
```

### Desktop, Admin, WO tanpa teknisi

```
Maintenance > Work order > WO-0013

WO-0013                                              [ Ganti teknisi ] [! Batalkan ]
Bersihkan filter crac-01
{Terjadwal} · Preventif

┌─ (!) WO ini belum punya teknisi dan belum dapat dimulai. ─── [# Tugaskan teknisi ] ┐
└────────────────────────────────────────────────────────────────────────────────────┘

Device    _crac-01_ · Ruang Server Gedung A · tanpa rack
Teknisi   Belum ada teknisi
Tenggat   12 Okt 2026

┌─ Tidak ada device terhubung. ───────────────────────────────┐
└─────────────────────────────────────────────────────────────┘

Checklist · 0 dari 4  (terkunci sampai dimulai)
  [ ] Matikan unit sesuai prosedur
  [ ] Lepas dan bersihkan filter udara
  [ ] Periksa saluran pembuangan air kondensasi
  [ ] Nyalakan kembali, pastikan suhu keluaran normal

Dibuat dari maintenance plan: _Bersihkan filter crac-01_ (setiap 1 bulan)
Dibuat oleh: Sistem (jadwal otomatis), 9 Okt 2026, 07.00 WIB

                                                  [  Mulai pekerjaan  ]  ← nonaktif
```

### Desktop, WO Selesai (korektif)

```
WO-0002
RAM error, ganti DIMM B2
{Selesai} · Korektif

Device    _srv-db-01_ · RK-A01 · U37-U38
Teknisi   Rina
Tenggat   20 Mei 2026
Masalah   Log iDRAC menunjukkan error memori di DIMM B2.

Checklist · 3 dari 3 (hanya dibaca)
  [x] Ganti DIMM B2
  [x] Jalankan memtest
  [x] Pantau log 24 jam

Catatan hasil
  DIMM B2 diganti dengan modul dari stok. Memtest lulus, log bersih.
Selesai 19 Mei 2026, 15.20 WIB

Dibuat oleh: Andi, 18 Mei 2026, 09.05 WIB
```

WO Dibatalkan menampilkan alasan pembatalan di tempat catatan hasil.

---

## MOD-07 Batalkan work order

```
┌──────────────────────────────────────────────────┐
│ Batalkan WO-0011?                            [x] │
├──────────────────────────────────────────────────┤
│ Tenggat berikutnya maintenance plan "Update      │
│ firmware sw-tor-01" dihitung ulang menjadi       │
│ 14 Apr 2027.                                     │
│                                                  │
│ Alasan                                           │
│ [ Firmware sudah diperbarui bersama upgrade      │
│   core switch.                                 ] │
├──────────────────────────────────────────────────┤
│                [ Kembali ] [! Batalkan WO ]      │
│                            (nonaktif sampai      │
│                             alasan terisi)       │
└──────────────────────────────────────────────────┘
```

Bila WO berstatus Dikerjakan, kalimat dampak menambahkan: *"Status srv-db-01 kembali Aktif."* (bila tidak ada WO lain yang Dikerjakan untuk device itu).

---

## MOD-08 Tugaskan atau ganti teknisi

```
┌──────────────────────────────────────────────────┐
│ Tugaskan teknisi untuk WO-0013               [x] │
├──────────────────────────────────────────────────┤
│ Teknisi                                          │
│ [ Pilih teknisi                                v]│
│   ┌────────────────────────────────────────┐     │
│   │ Joko        Fasilitas                  │     │
│   │ Dimas       Keduanya                   │     │
│   └────────────────────────────────────────┘     │
│ Device kategori Fasilitas: menampilkan teknisi   │
│ Fasilitas dan Keduanya.                          │
├──────────────────────────────────────────────────┤
│                         [ Batal ] [# Simpan ]    │
└──────────────────────────────────────────────────┘
```

---

## HAL-16 Daftar maintenance plan

```
Maintenance > Maintenance plan

Maintenance plan                                        [# Tambah maintenance plan ]

[ Cari judul atau device...          ]  [ Filter v ]
┌──────────────────────────────────┬─────────────┬──────────────────┬──────────────────┬───────────────┬─────────────┐
│ Judul                            │ Device      │ Interval         │ Tenggat berikut. │ Teknisi bawaan│ Status      │
├──────────────────────────────────┼─────────────┼──────────────────┼──────────────────┼───────────────┼─────────────┤
│ Cek baterai ups-01               │ ups-01      │ setiap 3 bulan   │ 11 Okt 2026      │ Joko          │ [on] Aktif  │
│ Bersihkan filter crac-01         │ crac-01     │ setiap 1 bulan   │ 12 Okt 2026      │ —             │ [on] Aktif  │
│ Update firmware sw-tor-01        │ sw-tor-01   │ setiap 6 bulan   │ 14 Okt 2026      │ Rina          │ [on] Aktif  │
│ Cek fisik server srv-db-01       │ srv-db-01   │ setiap 3 bulan   │ 6 Okt 2026       │ Rina          │ [on] Aktif  │
│ Cek fisik server srv-old-01      │ srv-old-01  │ setiap 3 bulan   │ 1 Mar 2026       │ Rina          │ [off]Nonaktif│
└──────────────────────────────────┴─────────────┴──────────────────┴──────────────────┴───────────────┴─────────────┘

  Status Aktif/Nonaktif memakai ikon + teks, bukan lencana status device.
```

---

## HAL-17 Form maintenance plan

```
Maintenance > Maintenance plan > Tambah maintenance plan

Tambah maintenance plan

  Judul
  [ Cek baterai ups-01                                      ]

  Device
  [ ups-01  (Ruang Server Gedung A · tanpa rack)           v]

  ┌─ (!) 6 device terhubung ke ups-01 ───────────────────────────────────┐
  │ Daya (6)                                                             │
  │   _pdu-a01-a_   inlet    ⟷  ups-01 outlet 1                          │
  │   _pdu-a02-a_   inlet    ⟷  ups-01 outlet 2                          │
  │   ...                                                                │
  └──────────────────────────────────────────────────────────────────────┘
     ↑ ditampilkan di sini karena WO preventif nanti dibuat otomatis
       tanpa form; inilah kesempatan Admin melihat dampaknya

  Interval
  [ 3          ]   ( ) Hari   ( ) Minggu   (•) Bulan

  Tenggat pertama
  [ 11 Okt 2026          ]
  WO preventif dibuat otomatis 7 hari sebelum tenggat.
  Teknisi diingatkan 3 hari sebelum tenggat.

  Teknisi bawaan (opsional)
  [ Joko (Fasilitas)                                       v]
  Device kategori Fasilitas: menampilkan teknisi Fasilitas dan Keduanya.

  Checklist                                                  ← minimal satu item
  ┌──────────────────────────────────────────────────┬──────────────┐
  │ [ Periksa panel indikator, tidak ada alarm  ]    │ [^] [v] [x]  │
  │ [ Ukur tegangan setiap blok baterai         ]    │ [^] [v] [x]  │
  │ [ Periksa fisik baterai                     ]    │ [^] [v] [x]  │
  │ [ Bersihkan debu pada ventilasi UPS         ]    │ [^] [v] [x]  │
  │ [ Jalankan self-test UPS                    ]    │ [^] [v] [x]  │
  └──────────────────────────────────────────────────┴──────────────┘
  [ + Tambah item ]

                                         [ Batal ] [# Simpan maintenance plan ]
```

Mode ubah: label "Tenggat pertama" menjadi "Tenggat berikutnya".

---

## HAL-18 Detail maintenance plan

```
Maintenance > Maintenance plan > Cek baterai ups-01

Cek baterai ups-01                                       [ Ubah ] [...]
[on] Aktif                                                [...]: Nonaktifkan, Hapus

Device              _ups-01_
Interval            setiap 3 bulan
Tenggat berikutnya  11 Okt 2026
Teknisi bawaan      Joko

Checklist
  1. Periksa panel indikator, tidak ada alarm
  2. Ukur tegangan setiap blok baterai
  3. Periksa fisik baterai
  4. Bersihkan debu pada ventilasi UPS
  5. Jalankan self-test UPS

Work order yang dihasilkan
┌─────────┬─────────────┬─────────┬─────────────┐
│ Nomor   │ Tenggat     │ Teknisi │ Status      │
├─────────┼─────────────┼─────────┼─────────────┤
│ WO-0012 │ 11 Okt 2026 │ Joko    │ {Terjadwal} │
│ WO-0005 │ 11 Jul 2026 │ Joko    │ {Selesai}   │
│ WO-0001 │ 11 Apr 2026 │ Joko    │ {Selesai}   │
└─────────┴─────────────┴─────────┴─────────────┘
```

---

## HAL-19 Kalender (Should, KOM-46)

```
Maintenance > Kalender

Kalender                   [ < ]  Oktober 2026  [ > ]  [ Hari ini ]
                           [ Teknisi: semua v ]  [ Jenis: semua v ]

┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Sen      │ Sel      │ Rab      │ Kam      │ Jum      │ Sab      │ Min      │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│        5 │        6 │        7 │        8 │   9 ◄hari│       10 │       11 │
│          │ {WO-0010}│          │          │ {WO-0014}│          │ {WO-0012}│
│          │  merah   │          │          │  ungu    │          │  ungu    │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│       12 │       13 │       14 │       15 │       16 │       17 │       18 │
│ {WO-0013}│          │ {WO-0011}│          │          │          │┌╌╌╌╌╌╌╌╌┐│
│          │          │          │          │          │          │╎Filter  ╎│
│          │          │          │          │          │          │╎crac-02 ╎│
│          │          │          │          │          │          │└╌╌╌╌╌╌╌╌┘│
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
  {WO-xxxx}  = WO yang sudah ada, berwarna status; klik → detail WO
  ┌╌╌╌╌┐     = tenggat maintenance plan yang belum menjadi WO ("terjadwal
  └╌╌╌╌┘       otomatis"), bergaris putus-putus tanpa warna; klik → detail plan
  Lebih dari 3 label dalam satu tanggal: "+n lainnya".
```
