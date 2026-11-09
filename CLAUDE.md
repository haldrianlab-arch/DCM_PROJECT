# CLAUDE.md

Aturan kerja untuk Claude Code di repo SIRAMA. Dibaca otomatis setiap sesi. Simpan tetap ringkas; detail ada di dokumen yang dirujuk.

## Proyek

SIRAMA (Sistem Informasi Rak, Aset & Maintenance): aplikasi web DCIM untuk ruang server kampus. Proyek UTS/UAS mata kuliah Data Center Management, Universitas Buddhi Dharma. Tim: Haldrian Sunata, Calvin, Christian Leonardo. Dikembangkan dengan AI-Native SDLC: kode ditulis terutama oleh Claude, tim meninjau PR dan preview.

Target UAS: rilis R1 (inventaris) dan R2 (maintenance), yaitu semua kebutuhan Must.

## Sumber kebenaran

Baca dokumen yang relevan sebelum mengerjakan fitur. Jangan menebak perilaku yang sudah ditulis di sana.

| Dokumen | Isi | Prioritas bila bertentangan |
|---|---|---|
| `specs/PRD.md` | User story, acceptance criteria (AC), aturan bisnis BR-xx, field per entitas (Lampiran C), data demo (Lampiran A) | 1 (perilaku) |
| `specs/design.md` | Halaman HAL-xx, komponen KOM-xx, modal MOD-xx, teks UI, sitemap (§5.1) | 2 (tampilan) |
| `specs/design-system/tokens.json` | Token warna, huruf, ukuran | Mengalahkan angka di design.md §4 |
| `specs/tech.md` | Stack, struktur kode, skema database, algoritma, pola server action, urutan PR (§15) | 3 (implementasi) |
| `docs/devlog.md` | Riwayat sesi dan keputusan | Konteks |

Bila menemukan pertentangan atau celah di dokumen, berhenti dan tanyakan. Jangan memutuskan sendiri lalu diam-diam mengubah kode.

## Cara bekerja dengan tim

- Bahasa percakapan: Indonesia. Tanpa emoji di mana pun (chat, kode, commit, UI).
- Untuk setiap keputusan yang belum ada di dokumen: beri pilihan ganda, trade-off tiap pilihan, dan rekomendasi. Tunggu jawaban.
- Bila user bilang "jangan lakukan perubahan dulu", jangan mengubah file apa pun.
- Jelaskan dengan bahasa yang bisa dipakai tim saat presentasi; anggota tim harus bisa menjelaskan kodenya.

## Alur satu PR

1. Ambil PR berikutnya dari `specs/tech.md` §15.
2. **Plan mode dulu:** tulis `plans/NN-nama.md` berisi tujuan, user story dan AC yang dicakup, berkas yang dibuat/diubah, tes yang akan ditulis, dan pertanyaan terbuka. Minta persetujuan sebelum menulis kode.
3. Buat branch `feat/NN-nama` dari `main`.
4. Tulis kode dan tes. Aturan BR wajib punya unit test sebelum fiturnya dianggap selesai.
5. Jalankan pemeriksaan lokal (lihat Perintah) sampai semua hijau.
6. Commit kecil dan bermakna. Buka PR berisi ringkasan, daftar AC yang dicakup, dan cara meninjau di preview.
7. Setelah merge: tambahkan entri sesi di `docs/devlog.md` (dikerjakan, keputusan, berikutnya) dan perbarui baris "Status saat ini".

**Kebiasaan sesi:**
- Satu sesi Claude Code untuk satu PR. Setelah PR selesai, tim memulai sesi baru atau `/clear`.
- Di awal sesi, baca baris "Status saat ini" dan entri terakhir `docs/devlog.md` untuk tahu posisi kerja.
- Sebelum sesi ditutup, walaupun PR belum selesai, tulis catatan singkat di devlog: apa yang sudah jadi, apa yang belum, dan langkah berikutnya, agar sesi lain (termasuk sesi diskusi di luar Claude Code) bisa melanjutkan.

**Definisi selesai:** semua AC terkait punya tes otomatis yang lulus, BR terkait punya unit test, `typecheck` dan `lint` bersih, CI hijau, dan sudah ditinjau di preview Vercel.

## Aturan kode

- Ikuti struktur di tech.md §3. `src/domain/` murni: tidak boleh mengimpor database, Next.js, atau React.
- Setiap server action: `requireRole`/`canWorkOn` → validasi Zod → `db.transaction` → aturan dari `domain/` → `writeAudit` dalam transaksi yang sama → `revalidatePath`. Hasil berbentuk `{ ok, ... }`, bukan throw untuk kesalahan user.
- Hak akses selalu dicek di server. Menyembunyikan tombol hanya pelengkap.
- Tanggal bisnis (tenggat, garansi, jadwal) bertipe `date` dalam WIB; selalu lewat `domain/dates.ts` dan terima `today` sebagai parameter. Jangan memakai `new Date()` langsung di logika bisnis.
- Status Maintenance tidak disimpan; pakai `effectiveStatus` (tech.md §5.3).
- Cable daya: port A = power outlet, port B = power inlet. Arah data dari port uplink (BR-22).
- Nomor asset tag dan WO hanya lewat `server/counters.ts`.
- UI: pakai komponen di `components/ui` dan token; tidak ada warna atau ukuran di luar token. Ikon Lucide. Teks UI sesuai design.md.
- Penamaan (PRD §2.1): nama entitas bahasa Inggris (Rack, Device, Cable, Work order), selebihnya bahasa Indonesia. Kode dan nama tabel bahasa Inggris.
- Format angka dan tanggal Indonesia lewat `lib/format.ts` (5.250 W; 1,5 m; 5 Okt 2026).
- Jangan menambah dependensi baru tanpa menyebut alasannya di rencana PR.
- Jangan menulis secret ke repo. Pakai `.env.local` (tidak di-commit) dan perbarui `.env.example`.

## Perintah

Diisi saat PR 1 (fondasi) selesai.

```
pnpm dev            # server lokal
pnpm typecheck
pnpm lint
pnpm test           # unit + integrasi
pnpm test:e2e       # Playwright
pnpm db:generate    # buat migrasi dari skema
pnpm db:migrate
pnpm db:seed        # kembalikan data demo (PRD Lampiran A)
```

## Commit

Format: `feat: ...`, `fix: ...`, `test: ...`, `docs: ...`, `chore: ...`, ringkas dalam bahasa Indonesia. Akhiri pesan commit dengan baris atribusi Co-Authored-By sesuai model yang dipakai.

## Area rawan (PRD §11)

Validasi posisi rack, cron (duplikasi dan zona waktu), status device dan WO, impact analysis (arah cable A/B). Tulis tes paling lengkap di sini dan sebutkan di PR bila menyentuhnya.
