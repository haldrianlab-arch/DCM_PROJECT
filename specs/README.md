# Spesifikasi SIRAMA

Folder ini adalah keluaran **tahap Design** dalam AI-Native SDLC (Anthropic, 2026).

Playbook menghasilkan satu file `spec.md` yang menggabungkan kebutuhan dan desain. Proyek ini memecahnya menjadi tiga file agar sesuai dengan deliverable mata kuliah (laporan, dokumen perancangan, diagram). **Ketiga file bersama-sama berfungsi sebagai `spec.md`**: dibaca oleh tahap Build (plan mode Claude Code) dan menjadi acuan tahap Test.

| File | Menjawab | Status | Dipakai untuk |
|---|---|---|---|
| [`prd.md`](prd.md) | **Apa** yang dibangun dan bagaimana tahu sudah benar | v0.2 ✅ disetujui | Bab I, analisis kebutuhan, test case blackbox |
| [`design.md`](design.md) | **Bagaimana pengguna mengalaminya** | v0.1 ⏳ review | Use case, flowchart, mockup Claude Design, manual book |
| `tech.md` | **Bagaimana dibangun** | Belum dibuat | Architecture & topology diagram, plan mode |

**Urutan:** `intent/asset-maintenance.md` → `prd.md` → `design.md` → mockup di Claude Design → `tech.md` → tahap Build.