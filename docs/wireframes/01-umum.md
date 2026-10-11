# 01. Halaman umum

Rujukan: design.md HAL-01 s.d. HAL-05, KOM-30, KOM-31, KOM-34, KOM-42.

---

## HAL-01 Login

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│                         ┌────────────────────────────────┐                       │
│                         │       [logo] SIRAMA            │                       │
│                         │  Sistem Informasi Rak, Aset    │                       │
│                         │        & Maintenance           │                       │
│                         │                                │                       │
│                         │  Email                         │                       │
│                         │  [ andi@kampus.ac.id         ] │                       │
│                         │                                │                       │
│                         │  Password                      │                       │
│                         │  [ ••••••••••          [lihat]] │                       │
│                         │                                │                       │
│                         │  [#          Masuk           ] │                       │
│                         └────────────────────────────────┘                       │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### HP, setelah login gagal

```
┌──────────────────────────┐
│                          │
│     [logo] SIRAMA        │
│                          │
│ ┌──────────────────────┐ │
│ │ (!) Email atau       │ │
│ │ password salah.      │ │
│ └──────────────────────┘ │
│                          │
│ Email                    │
│ [ rina@kampus.ac.id    ] │
│                          │
│ Password                 │
│ [ ••••••        [lihat]] │
│                          │
│ [#       Masuk         ] │
│                          │
└──────────────────────────┘
```

---

## HAL-02 Dashboard

### Desktop

```
Dashboard

Device per status
{Aktif 18}  {Maintenance 1}  {Stok 2}  {Pensiun 1}         ← klik: daftar device terfilter

Peta room
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Ruang Server Gedung A                                                                │
│                                                                                      │
│   ┌───┐     ┌───┐     ┌───┐     ┌───┐                                                │
│   │▒▒▒│     │▒▒▒│     │▒▒▒│     │▒▒▒│      ▒ = blok device (warna device function)   │
│   │   │     │   │     │   │     │▓▓▓│      kolom = elevation mini satu rack          │
│   │▓▓▓│     │▓▓▓│     │▓▓▓│     │▓▓▓│                                                │
│   │▓▓▓│     │▓▓▓│     │   │     │░░░│                                                │
│   │▓▓▓│     │   │     │▓▓▓│     │   │                                                │
│   │▓▓▓│     │▓▓▓│     │▓▓▓│     │░░░│                                                │
│   │   │     │   │     │   │     │   │                                                │
│   └───┘     └───┘     └───┘     └───┘                                                │
│   RK-A01    RK-A02    RK-A03    RK-A04                                               │
│    21%       17%       19%       24%                                                 │
│                                                                                      │
│   Tanpa rack:  ups-01 {Aktif}   crac-01 {Aktif}   crac-02 {Aktif}                    │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌─ Perlu perhatian ─────────────────────────────┐  ┌─ Garansi ──────────────────────────────┐
│ Terlambat                                     │  │ srv-db-01     habis 2 Okt 2026         │
│ WO-0010 Cek fisik srv-db-01     {Terlambat}   │  │               {Garansi habis}          │
│         tenggat 6 Okt · Rina                  │  │ sw-tor-03     habis 28 Okt 2026        │
│                                               │  │               {Garansi segera habis}   │
│ Tenggat 7 hari ke depan                       │  │ srv-app-02    habis 3 Nov 2026         │
│ WO-0012 Cek baterai ups-01      {Terjadwal}   │  │               {Garansi segera habis}   │
│         tenggat 11 Okt · Joko                 │  │                                        │
│ WO-0013 Bersihkan filter crac-01 {Terjadwal}  │  │                                        │
│         tenggat 12 Okt · Belum ada teknisi    │  │                                        │
│ WO-0011 Update firmware sw-tor-01 {Terjadwal} │  │                                        │
│         tenggat 14 Okt · Rina                 │  │                                        │
│                                 _Lihat semua_ │  │                          _Lihat semua_ │
└───────────────────────────────────────────────┘  └────────────────────────────────────────┘
```

### HP

```
┌──────────────────────────┐
│ [≡]  [logo] SIRAMA       │
├──────────────────────────┤
│ Dashboard                │
│                          │
│ Perlu perhatian          │
│ ┌──────────────────────┐ │
│ │ WO-0010 {Terlambat}  │ │
│ │ Cek fisik srv-db-01  │ │
│ │ tenggat 6 Okt · Rina │ │
│ ├──────────────────────┤ │
│ │ WO-0012 {Terjadwal}  │ │
│ │ Cek baterai ups-01   │ │
│ │ tenggat 11 Okt · Joko│ │
│ └──────────────────────┘ │
│              _Lihat semua│
│                          │
│ Device per status        │
│ {Aktif 18} {Maint. 1}    │
│ {Stok 2} {Pensiun 1}     │
│                          │
│ Peta room       geser -> │
│ ┌───┐ ┌───┐ ┌───┐ ┌──    │
│ │▓▓▓│ │▓▓▓│ │▓▓▓│ │▓▓    │
│ │▓▓▓│ │   │ │▓▓▓│ │      │
│ └───┘ └───┘ └───┘ └──    │
│ A01   A02   A03   A0     │
│                          │
│ Garansi                  │
│ srv-db-01 {Garansi habis}│
├──────┬──────┬──────┬─────┤
│Dash- │Work  │ Cari │Notif│
│board │order │      │  (2)│
└──────┴──────┴──────┴─────┘
```

### Database masih kosong (Admin)

```
Dashboard

Selamat datang di SIRAMA. Mulai dengan mencatat lokasi dan katalog:

  1. [x] Tambah site                    _Kampus Utama_
  2. [ ] Tambah room                    [# Tambah room ]
  3. [ ] Tambah rack
  4. [ ] Isi katalog (manufacturer, device function, model)
  5. [ ] Tambah device
```

---

## HAL-03 Tugas saya

### HP (Rina, Teknisi IT)

```
┌──────────────────────────┐
│ [≡]  [logo] SIRAMA       │
├──────────────────────────┤
│ Tugas saya               │
│                          │
│ Terlambat                │
│ ┌──────────────────────┐ │
│ │ WO-0010   {Terlambat}│ │
│ │ Cek fisik srv-db-01  │ │
│ │ RK-A01 · U37-U38     │ │
│ │ tenggat 6 Okt 2026   │ │
│ │Preventif {Dikerjakan}│ │
│ └──────────────────────┘ │
│                          │
│ Hari ini                 │
│ ┌──────────────────────┐ │
│ │ WO-0014              │ │
│ │ Port 12 sw-tor-02    │ │
│ │ mati                 │ │
│ │ RK-A02 · U42         │ │
│ │ tenggat 9 Okt 2026   │ │
│ │ Korektif {Terjadwal} │ │
│ └──────────────────────┘ │
│                          │
│ 7 hari ke depan          │
│ ┌──────────────────────┐ │
│ │ WO-0011              │ │
│ │ Update firmware      │ │
│ │ sw-tor-01            │ │
│ │ RK-A01 · U42         │ │
│ │ tenggat 14 Okt 2026  │ │
│ │Preventif {Terjadwal} │ │
│ └──────────────────────┘ │
├──────┬──────┬──────┬─────┤
│Tugas │Dash- │ Cari │Notif│
│ ▀▀   │board │      │  (1)│
└──────┴──────┴──────┴─────┘
```

### Tidak ada tugas

```
┌──────────────────────────┐
│ Tugas saya               │
│                          │
│       [ikon centang]     │
│     Tidak ada tugas.     │
│  Tugas baru akan muncul  │
│  di sini dan di          │
│  notifikasi.             │
└──────────────────────────┘
```

Di desktop isinya sama, kartu disusun dua atau tiga kolom per kelompok.

---

## HAL-04 Pencarian

### HP

```
┌──────────────────────────┐
│ [≡]  [logo] SIRAMA       │
├──────────────────────────┤
│ [ srv-db           [x] ] │
│                          │
│ 2 device                 │
│ ┌──────────────────────┐ │
│ │ srv-db-01   {Aktif}  │ │
│ │ DCM-0007             │ │
│ │ RK-A01 · U37-U38     │ │
│ ├──────────────────────┤ │
│ │ srv-db-02   {Aktif}  │ │
│ │ DCM-0015             │ │
│ │ RK-A03 · U20-U21     │ │
│ └──────────────────────┘ │
├──────┬──────┬──────┬─────┤
│Tugas │Dash- │ Cari │Notif│
│      │board │  ▀▀  │     │
└──────┴──────┴──────┴─────┘
```

### Desktop: pencarian global di header (KOM-31)

```
[ dcm-00                                      ]   Notif(2)   Andi v
┌──────────────────────────────────────────────┐
│ srv-web-01   DCM-0001   RK-A01 · U39-U40  {Aktif}       │
│ sw-tor-01    DCM-0002   RK-A01 · U42      {Aktif}       │
│ pdu-a01-a    DCM-0003   RK-A01 · 0U       {Aktif}       │
│ ...                                                     │
│ Tekan Enter untuk melihat semua hasil                   │
└──────────────────────────────────────────────┘
```

---

## HAL-05 Notifikasi

### Teknisi (Joko)

```
Notifikasi                                         [ Tandai semua sudah dibaca ]

● [tugas]  WO-0012 ditugaskan kepada Anda: Cek baterai ups-01           3 jam lalu
● [jam]    Tenggat WO-0012 tinggal 3 hari (11 Okt 2026)                 3 jam lalu
  [tugas]  WO-0009 ditugaskan kepada Anda: Bersihkan filter crac-02       5 hari lalu

  ● = belum dibaca (titik air, teks tebal)
```

### Admin (Andi)

```
Notifikasi                                         [ Tandai semua sudah dibaca ]

● [orang]  WO-0013 belum punya teknisi: Bersihkan filter crac-01        2 jam lalu
           ← klik: buka detail WO + MOD-08 Tugaskan teknisi
● (!)      WO-0010 terlambat sejak 6 Okt 2026                           2 jam lalu
```

### Lonceng di header (KOM-30)

```
                                         Notif(2)   Andi v
                     ┌─────────────────────────────────────┐
                     │ Notifikasi                          │
                     │ ● WO-0013 belum punya teknisi       │
                     │   2 jam lalu                        │
                     │ ● WO-0010 terlambat sejak 6 Okt     │
                     │   2 jam lalu                        │
                     │                       _Lihat semua_ │
                     └─────────────────────────────────────┘
```
