# Brief untuk Claude Design

Dipakai pada tahap Design untuk membuat mockup (alur playbook: mockup dibuat di Claude Design, diiterasi, lalu diekspor ke Claude Code). Mockup yang disetujui menjadi acuan perbandingan screenshot di tahap Test.

## Lampiran

1. `intent/asset-maintenance.md`
2. `specs/PRD.md`
3. `specs/design.md`

## Prompt

```
Buat mockup aplikasi web SIRAMA (Sistem Informasi Rak, Aset & Maintenance)
berdasarkan design.md terlampir. Ikuti identitas visual di §4 secara
persis: warna dasar, warna status, warna device function, tipografi IBM Plex
Sans, dan ikon Lucide (tanpa emoji). Ikuti penamaan di §1.3: nama entitas
bahasa Inggris (Rack, Device, Cable, Work order, ...), selebihnya bahasa
Indonesia. Gunakan data realistis ruang server kampus dari PRD Lampiran A,
dan field form sesuai PRD Lampiran C.

Setiap komponen khusus punya bagian "Wajib" dan "Bebas" (§1.2). Ikuti bagian
Wajib persis; bagian Bebas dan hal yang tidak disebut silakan dikreasikan
selama konsisten dengan §4 dan §6.

Buat layar berikut secara berurutan:
1. HAL-07 Detail rack dengan KOM-32 elevation (desktop)
2. HAL-02 Dashboard dengan KOM-34 peta room (desktop dan HP)
3. HAL-10 Detail device: tab Ringkasan dan tab Port & cable (desktop), versi HP
4. HAL-14 Form work order korektif dengan KOM-36 panel dampak (desktop)
5. HAL-03 Tugas saya dan HAL-15 Detail work order dengan KOM-37 (HP)
6. HAL-09 Form device dengan KOM-33 pratinjau, termasuk kondisi bentrok (desktop)
7. HAL-06 Lokasi dengan KOM-35 pohon lokasi (desktop)
8. HAL-01 Login (desktop dan HP)
9. HAL-28 Lembar cetak label QR A4 dengan KOM-41

Elevation rack adalah elemen paling khas; buat paling detail. Elemen lain
tenang dan rapi. Status selalu memakai warna, ikon, dan teks.
```

## Setelah mockup jadi

- Iterasi sampai disetujui; catat perubahan desain penting di `docs/devlog.md`.
- Bila mockup mengubah keputusan di `specs/design.md`, perbarui dokumen itu agar tetap menjadi sumber kebenaran.
- Ekspor ke Claude Code saat tahap Build.