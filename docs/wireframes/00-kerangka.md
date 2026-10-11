# 00. Kerangka dan pola umum

Rujukan: design.md §5, §6, TPL-01 s.d. TPL-06, KOM-21 s.d. KOM-31.

---

## Kerangka desktop (Admin)

Sidebar KOM-26 di kiri, header KOM-27 di atas, breadcrumb KOM-29 di bawah header. Grup sidebar tertutup secara bawaan; grup yang berisi halaman aktif (di sini Inventaris) terbuka otomatis.

```
┌────────────────────────┬──────────────────────────────────────────────────────────────────────┐
│ [logo] SIRAMA          │ [ Cari nama, asset tag, serial number...      ]   Notif(2)   Andi v  │
│                        │                                                       Admin           │
│  [ikon] Dashboard      ├──────────────────────────────────────────────────────────────────────┤
│                        │ Inventaris > Lokasi > RK-A01                                         │
│  v Inventaris          │                                                                      │
│ ▌ [ikon] Lokasi        │ RK-A01                                       [ Ubah ] [...]           │
│    [ikon] Device       │                                                                      │
│    [ikon] Cable        │                                                                      │
│  > Maintenance         │                       (isi halaman)                                  │
│  > Katalog             │                                                                      │
│  > Administrasi        │                                                                      │
│                        │                                                                      │
│                        │                                                                      │
│ [<<] Ciutkan           │                                                                      │
└────────────────────────┴──────────────────────────────────────────────────────────────────────┘
  ▌ = menu aktif (latar air-soft, teks air, garis kiri air)
  v = grup terbuka, > = grup tertutup
```

### Perbedaan sidebar per peran

```
Admin                    Teknisi                  Viewer
──────────────           ──────────────           ──────────────
Dashboard                Dashboard                Dashboard
                         Tugas saya
> Inventaris             > Inventaris             > Inventaris
    Lokasi                   Lokasi                   Lokasi
    Device                   Device                   Device
    Cable                    Cable                    Cable
> Maintenance            > Maintenance            > Maintenance
    Work order               Work order               Work order
    Maintenance plan         Maintenance plan         Maintenance plan
    Kalender                 Kalender                 Kalender
> Katalog                > Katalog                > Katalog
    Manufacturer             Manufacturer             Manufacturer
    Model                    Model                    Model
    Device function          Device function          Device function
> Administrasi
    User
    Audit log

Header: Cari, Notif, Andi    Header: Cari, Notif, Rina   Header: Cari, Sari (tanpa Notif)
```

### Sidebar diciutkan (64 px)

```
┌─────┬───────────────────────────────────────────
│ [L] │ [ Cari ...            ]   Notif(2)  Andi v
│     ├───────────────────────────────────────────
│ [D] │
│ [I] │   (nama menu muncul sebagai keterangan
│ [M] │    saat ikon disorot)
│ [K] │
│ [A] │
│     │
│ [>>]│
└─────┴───────────────────────────────────────────
```

---

## Kerangka HP

Header ringkas di atas, bar navigasi bawah KOM-28 selalu terlihat. Isi bar berbeda per peran.

```
Teknisi                       Admin                         Viewer
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│ [≡]  [logo] SIRAMA       │  │ [≡]  [logo] SIRAMA       │  │ [≡]  [logo] SIRAMA       │
├──────────────────────────┤  ├──────────────────────────┤  ├──────────────────────────┤
│                          │  │                          │  │                          │
│                          │  │                          │  │                          │
│      (isi halaman)       │  │      (isi halaman)       │  │      (isi halaman)       │
│                          │  │                          │  │                          │
│                          │  │                          │  │                          │
├──────┬──────┬──────┬─────┤  ├──────┬──────┬──────┬─────┤  ├────────────┬─────────────┤
│[tgs] │[dsb] │[cari]│[ntf]│  │[dsb] │[wo]  │[cari]│[ntf]│  │   [dsb]    │   [cari]    │
│Tugas │Dash- │ Cari │Notif│  │Dash- │Work  │ Cari │Notif│  │ Dashboard  │    Cari     │
│  ▀▀  │board │      │  (1)│  │board │order │      │  (2)│  │    ▀▀▀     │             │
└──────┴──────┴──────┴─────┘  └──────┴──────┴──────┴─────┘  └────────────┴─────────────┘
  ▀▀ = tombol aktif (warna air)
```

### MOD-10 Menu navigasi HP

Dibuka dari `[≡]`, meluncur dari kiri. Isinya sama dengan sidebar.

```
┌──────────────────────┬───────┐
│ [logo] SIRAMA    [x] │░░░░░░░│
├──────────────────────┤░░░░░░░│
│ Dashboard            │░(isi ░│
│ Tugas saya           │░halam-│
│                      │░an,   │
│ v Inventaris         │░gelap)│
│     Lokasi           │░░░░░░░│
│     Device           │░░░░░░░│
│     Cable            │░░░░░░░│
│ > Maintenance        │░░░░░░░│
│ > Katalog            │░░░░░░░│
│                      │░░░░░░░│
├──────────────────────┤░░░░░░░│
│ Rina                 │░░░░░░░│
│ Teknisi · IT         │░░░░░░░│
│ Akun saya            │░░░░░░░│
│ [ Keluar ]           │░░░░░░░│
└──────────────────────┴───────┘
```

---

### Menu user di header (desktop)

```
                                              Notif(2)   Andi v
                                        ┌──────────────────────┐
                                        │ Andi                 │
                                        │ Admin                │
                                        ├──────────────────────┤
                                        │ Akun saya            │
                                        │ Keluar               │
                                        └──────────────────────┘
```

---

## Pola umum

### Breadcrumb (KOM-29)

```
Desktop:  Maintenance > Work order > WO-0014
HP:       < Work order
```

### Toast berhasil (KOM-22)

Pojok kanan bawah (HP: di atas bar bawah), hilang sendiri setelah 4 detik.

```
                                        ┌──────────────────────────────────┐
                                        │ [ok] Rack ditambahkan.  _Buka rack_ │
                                        └──────────────────────────────────┘
```

### Keadaan kosong (KOM-25)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                    [ikon cable]                          │
│               Belum ada cable tercatat.                  │
│                                                          │
│                  [# Tambah cable ]          ← hanya Admin │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Memuat (KOM-16)

```
┌──────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░    ░░░░░░░    ░░░░░░░░░░░░░    ░░░░░         │
│ ░░░░░░░░░░░░   ░░░░░░     ░░░░░░░░░░       ░░░░░░        │
│ ░░░░░░░░░      ░░░░░░░    ░░░░░░░░░░░░░    ░░░░          │
└──────────────────────────────────────────────────────────┘
```

### Field form dengan error (KOM-17)

```
Posisi U
[ U10                     v]
(!) Posisi U10-U11 bertabrakan dengan sw-tor-02. Pilih posisi lain.

Serial number (opsional)
[ 7XK92M3                  ]
Unik bila diisi.
```

### Bar cari dan filter (KOM-18)

```
[ Cari device...                    ]  [ Filter (2) v ]
Filter aktif:  {Status: Aktif  x}  {Rack: RK-A01  x}   _Hapus semua_
```

---

## HAL-29 Akses ditolak

TPL-06. Contoh: Teknisi membuka `/users`.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                       [ikon kunci]                       │
│                     Akses ditolak                        │
│        Halaman ini tidak tersedia untuk peran Anda.      │
│                                                          │
│                  _Kembali ke Tugas saya_                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## HAL-30 Tidak ditemukan

Contoh: QR berisi asset tag yang tidak terdaftar.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                      [ikon cari]                         │
│                Halaman tidak ditemukan                   │
│            Asset tag DCM-0999 tidak terdaftar.           │
│                                                          │
│                  _Kembali ke Dashboard_                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```
