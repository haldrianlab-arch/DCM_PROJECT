# 05. Dialog konfirmasi (MOD-06)

Rujukan: design.md MOD-06, TPL-05, §6.3. Satu komponen dengan banyak varian; angka di dalam kalimat diambil dari data nyata.

---

## Pensiunkan device

Varian "Pindahkan ke stok" sama persis, hanya judul dan tombolnya yang berbeda.

```
┌──────────────────────────────────────────────────────┐
│ Pensiunkan srv-web-02?                           [x] │
├──────────────────────────────────────────────────────┤
│ Posisi U30-U31 di RK-A01 akan dikosongkan, 3 cable   │
│ dilepas, 1 maintenance plan dinonaktifkan, dan       │
│ WO-0016 (Terjadwal) dibatalkan.                      │
├──────────────────────────────────────────────────────┤
│                       [ Batal ] [! Pensiunkan ]      │
└──────────────────────────────────────────────────────┘
```

## Hapus device (belum punya riwayat WO)

```
┌──────────────────────────────────────────────────────┐
│ Hapus srv-app-04?                                [x] │
├──────────────────────────────────────────────────────┤
│ Device, 4 port, dan 0 cable dihapus permanen.        │
├──────────────────────────────────────────────────────┤
│                            [ Batal ] [! Hapus ]      │
└──────────────────────────────────────────────────────┘
```

## Lepas cable

```
┌──────────────────────────────────────────────────────┐
│ Lepas cable C-0012?                              [x] │
├──────────────────────────────────────────────────────┤
│ Sambungan srv-db-01 · eth0 dan sw-tor-01 · port 3    │
│ diputus. Kedua port menjadi kosong.                  │
├──────────────────────────────────────────────────────┤
│                      [ Batal ] [! Lepas cable ]      │
└──────────────────────────────────────────────────────┘
```

## Nonaktifkan maintenance plan

Varian "Aktifkan" memakai tombol utama (`[# Aktifkan ]`), bukan merah.

```
┌──────────────────────────────────────────────────────┐
│ Nonaktifkan "Update firmware sw-tor-01"?         [x] │
├──────────────────────────────────────────────────────┤
│ Tidak ada WO baru yang dibuat. 1 WO terbuka          │
│ (WO-0011) tetap ada.                                 │
├──────────────────────────────────────────────────────┤
│                      [ Batal ] [! Nonaktifkan ]      │
└──────────────────────────────────────────────────────┘
```

## Hapus maintenance plan (belum punya riwayat WO)

```
┌──────────────────────────────────────────────────────┐
│ Hapus "Cek fisik server srv-app-04"?             [x] │
├──────────────────────────────────────────────────────┤
│ Maintenance plan dihapus permanen.                   │
├──────────────────────────────────────────────────────┤
│                            [ Batal ] [! Hapus ]      │
└──────────────────────────────────────────────────────┘
```

## Nonaktifkan user

```
┌──────────────────────────────────────────────────────┐
│ Nonaktifkan Rina?                                [x] │
├──────────────────────────────────────────────────────┤
│ Rina tidak dapat login dan sesinya berakhir.         │
│ 3 WO terbuka miliknya perlu ditugaskan ulang.        │
├──────────────────────────────────────────────────────┤
│                      [ Batal ] [! Nonaktifkan ]      │
└──────────────────────────────────────────────────────┘
```

## Hapus master data (site, room, rack, manufacturer, device function, model)

```
┌──────────────────────────────────────────────────────┐
│ Hapus room Ruang Server Gedung B?                [x] │
├──────────────────────────────────────────────────────┤
│ Room dihapus permanen.                               │
├──────────────────────────────────────────────────────┤
│                            [ Batal ] [! Hapus ]      │
└──────────────────────────────────────────────────────┘
```

---

## Varian informasi (aksi ditolak aturan)

Tidak ada tombol merah, hanya "Mengerti".

```
┌──────────────────────────────────────────────────────┐
│ srv-db-01 tidak dapat dihapus                    [x] │
├──────────────────────────────────────────────────────┤
│ Device ini punya riwayat work order. Ubah statusnya  │
│ menjadi Pensiun.                                     │
├──────────────────────────────────────────────────────┤
│                                    [# Mengerti ]     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Ruang Server Gedung A tidak dapat dihapus        [x] │
├──────────────────────────────────────────────────────┤
│ Room ini masih berisi 4 rack dan 3 device.           │
├──────────────────────────────────────────────────────┤
│                                    [# Mengerti ]     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Server tidak dapat dihapus                       [x] │
├──────────────────────────────────────────────────────┤
│ Device function ini masih dipakai 12 device.         │
├──────────────────────────────────────────────────────┤
│                                    [# Mengerti ]     │
└──────────────────────────────────────────────────────┘
```

## Konfirmasi buang perubahan (meninggalkan form yang sudah diubah)

```
┌──────────────────────────────────────────────────────┐
│ Buang perubahan?                                 [x] │
├──────────────────────────────────────────────────────┤
│ Perubahan pada form ini belum disimpan.              │
├──────────────────────────────────────────────────────┤
│              [ Kembali ke form ] [! Buang ]          │
└──────────────────────────────────────────────────────┘
```
