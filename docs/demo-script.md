# Naskah Demo SIRAMA (draf, sekitar 7 menit)

Dipakai untuk demo live UTS/UAS. Data seed diatur agar setiap adegan berjalan sesuai naskah (lihat PRD Lampiran A).

**Persiapan:** laptop (login Admin) dan HP (belum login), label QR sudah dicetak dan ditempel pada satu perangkat peraga atau kertas, database dikembalikan ke data seed sebelum demo.

| No | Adegan | Perangkat | Yang diperlihatkan | Referensi |
|---|---|---|---|---|
| 1 | Login sebagai Admin → dashboard | Laptop | Peta ruangan, 1 WO terlambat, 1 garansi hampir habis | US-DASH-01 |
| 2 | Buka RK-A02 → klik slot kosong → pasang server 2U di posisi yang bentrok | Laptop | Pratinjau merah dan penolakan yang menyebut device bentrok | US-DEV-02 |
| 3 | Pindah ke posisi kosong → simpan | Laptop | Device muncul di elevation, asset tag terbentuk | US-DEV-01 |
| 4 | Buat WO korektif untuk sw-tor-02 | Laptop | Panel dampak menampilkan server yang terhubung; daftar teknisi tersaring sesuai keahlian | US-IMP-02, US-WO-03 |
| 5 | Login sebagai Teknisi di HP | HP | Langsung mendarat di Tugas saya | design.md 5.3 |
| 6 | Pindai label QR | HP | Detail device versi HP terbuka | US-QR-02 |
| 7 | Mulai pekerjaan → lihat laptop | HP + laptop | Status device berubah menjadi Maintenance di elevation | US-WO-04 |
| 8 | Centang checklist, isi catatan → selesaikan | HP | Device kembali Aktif | US-WO-04 |
| 9 | Admin buka audit log | Laptop | Langkah-langkah di atas tercatat dengan data sebelum dan sesudah | US-AUD-01 |

**Cadangan bila ada kendala:** bila HP gagal memindai, buka tautan `/a/[asset-tag]` secara manual atau gunakan pencarian.