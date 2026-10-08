# Spesifikasi SIRAMA

Folder ini adalah keluaran **tahap Design** dalam AI-Native SDLC (Anthropic, 2026).

Playbook menghasilkan satu file `spec.md` yang menggabungkan kebutuhan dan desain. Proyek ini memecahnya menjadi tiga file agar sesuai dengan deliverable mata kuliah (laporan, dokumen perancangan, diagram). **Ketiga file bersama-sama berfungsi sebagai `spec.md`**: dibaca oleh tahap Build (plan mode Claude Code) dan menjadi acuan tahap Test.

| File | Menjawab | Status | Dipakai untuk |
|---|---|---|---|
| [`PRD.md`](PRD.md) | **Apa** yang dibangun dan bagaimana tahu sudah benar | v0.3 ⏳ review | Bab I, analisis kebutuhan, test case blackbox |
| [`design.md`](design.md) | **Bagaimana user mengalaminya** | v0.3 ⏳ review | Mockup Claude Design, build tampilan, manual book |
| `tech.md` | **Bagaimana dibangun** | Belum dibuat | Architecture & topology diagram, plan mode |

**Urutan:** `intent/asset-maintenance.md` → `PRD.md` → `design.md` → mockup di Claude Design → `tech.md` → tahap Build.

**Dokumen pendukung tahap Design** (di folder `docs/`):
- [`docs/diagrams/`](../docs/diagrams/): flowchart dan diagram use case (deliverable perancangan)
- [`docs/claude-design-brief.md`](../docs/claude-design-brief.md): prompt untuk membuat mockup
- [`docs/demo-script.md`](../docs/demo-script.md): naskah demo