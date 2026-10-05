# Brief untuk Claude Design

Dipakai pada tahap Design untuk membuat mockup (alur playbook: mockup dibuat di Claude Design, diiterasi, lalu diekspor ke Claude Code). Mockup yang disetujui menjadi acuan perbandingan screenshot di tahap Test.

## Lampiran

1. `intent/asset-maintenance.md`
2. `specs/prd.md`
3. `specs/design.md`

## Prompt

```
Buat mockup aplikasi web SIRAMA (Sistem Informasi Rak, Aset & Maintenance)
berdasarkan design.md terlampir. Ikuti identitas visual di bagian 3 secara
persis: warna dasar, warna status, warna fungsi perangkat, dan tipografi
IBM Plex Sans. Antarmuka berbahasa Indonesia dengan istilah teknis bahasa
Inggris. Gunakan data realistis ruang server kampus dari PRD Lampiran A.
Setiap sketsa ASCII di design.md disertai deskripsi tertulis; jika keduanya
tampak berbeda, ikuti deskripsi tertulisnya.

Buat layar berikut secara berurutan:
1. Detail rak dengan elevation depan dan belakang (desktop) — bagian 7 dan 8.1
2. Dashboard (desktop dan HP) — bagian 7
3. Detail device: tab Ringkasan (desktop) dan versi HP — bagian 7
4. Form work order dengan panel dampak (desktop) — bagian 7 dan 8.2
5. Tugas saya dan detail work order dengan checklist (HP) — bagian 7 dan 8.3
6. Login (desktop dan HP) — bagian 7
7. Lembar cetak label QR A4 — bagian 8.4

Elevation rak adalah elemen paling khas; buat paling detail. Elemen lain
tenang dan rapi. Status selalu memakai warna, ikon, dan teks.
```

## Setelah mockup jadi

- Iterasi sampai disetujui; catat perubahan desain penting di `docs/devlog.md`.
- Bila mockup mengubah keputusan di `specs/design.md`, perbarui dokumen itu agar tetap menjadi sumber kebenaran.
- Ekspor ke Claude Code saat tahap Build.