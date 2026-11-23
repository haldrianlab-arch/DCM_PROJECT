/**
 * `pnpm test:evidence`: jalankan semua pemeriksaan lalu susun bukti testing di docs/testing/.
 *
 * Isi docs/testing/ (ditimpa setiap kali dijalankan):
 * - README.md       ringkasan hasil + tabel setiap tes (bahan tabel blackbox Bab IV)
 * - e2e/*.webm      video setiap tes E2E, nama mudah dibaca: NN-<judul>-<desktop|hp>.webm
 *
 * Urutan: typecheck → lint → format → Vitest (unit + integrasi) → build → seed → Playwright
 * (build produksi, desktop + HP 375 px) → seed ulang. Butuh .env.local berisi DATABASE_URL
 * (branch Neon `dev`) dan SEED_PASSWORD. Tabel auth di `dev` di-reset ke akun demo.
 */
import { execFileSync, execSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "docs", "testing");
const VIDEO_DIR = join(OUT, "e2e");
// Di luar test-results/: Playwright mengosongkan folder itu setiap kali mulai.
const TMP = mkdtempSync(join(tmpdir(), "sirama-evidence-"));

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (!process.env.DATABASE_URL || !process.env.SEED_PASSWORD) {
  console.error("DATABASE_URL dan SEED_PASSWORD wajib diisi di .env.local.");
  process.exit(1);
}

/** Jalankan perintah, tampilkan keluarannya, kembalikan lulus/gagal dan durasi. */
function run(label, command, env = {}) {
  console.log(`\n=== ${label}: ${command}`);
  const start = Date.now();
  const result = spawnSync(command, {
    shell: true,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  const seconds = Math.round((Date.now() - start) / 1000);
  return { label, command, ok: result.status === 0, seconds };
}

const checks = [];
checks.push(run("Typecheck", "pnpm typecheck"));
checks.push(run("Lint", "pnpm lint"));
checks.push(run("Format", "pnpm format:check"));
const vitestJson = join(TMP, "vitest.json");
checks.push(
  run(
    "Unit + integrasi (Vitest)",
    `pnpm exec vitest run --reporter=default --reporter=json --outputFile.json="${vitestJson}"`,
  ),
);
checks.push(run("Build produksi", "pnpm build"));
run("Seed akun demo", "pnpm db:seed");
const playwrightJson = join(TMP, "playwright.json");
checks.push(
  run("E2E (Playwright)", "pnpm exec playwright test --reporter=list,html,json", {
    CI: "1",
    PLAYWRIGHT_JSON_OUTPUT_FILE: playwrightJson,
  }),
);
run("Seed ulang akun demo", "pnpm db:seed");

// ---------------------------------------------------------------------------
// Baca hasil
// ---------------------------------------------------------------------------

const readJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null);
const vitest = readJson(vitestJson);
const playwright = readJson(playwrightJson);

const STATUS = {
  passed: "Lulus",
  failed: "Gagal",
  skipped: "Dilewati",
  pending: "Dilewati",
  todo: "Dilewati",
};
const label = (s) => STATUS[s] ?? s;

/** "US-AUTH-01 AC1, HAL-30" dari judul tes, untuk kolom "Mencakup". */
function coverage(...titles) {
  const text = titles.join(" ");
  const ids = new Set();
  const story = text.match(/US-[A-Z]+-\d+/g) ?? [];
  const ac = text.match(/\bAC\d+\b/g) ?? [];
  for (const s of story) ids.add(ac.length ? `${s} ${ac.join(", ")}` : s);
  for (const id of text.match(/\b(?:HAL|KOM|MOD|BR|NFR)-\d+\b/g) ?? []) ids.add(id);
  return [...ids].join("; ") || "—";
}

function slug(text) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/→/g, " ")
    .toLowerCase()
    .replace(/@kampus\.ac\.id/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
}

// ---------------------------------------------------------------------------
// PR asal setiap tes (urutan Build tech.md §15), dari riwayat git
// ---------------------------------------------------------------------------

const git = (...args) => {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
};
const MAIN = git("rev-parse", "--verify", "--quiet", "origin/main") ? "origin/main" : "main";
const branchPr = git("rev-parse", "--abbrev-ref", "HEAD").match(/^feat\/(\d+)-/)?.[1];

/**
 * Nomor PR sebuah commit. Di main, setiap PR di-squash menjadi satu commit berjudul
 * "PR N: ..." (CLAUDE.md). Commit yang belum di-merge milik branch feat/NN-nama saat ini.
 */
function prOfCommit(sha) {
  if (!sha) return null;
  const onMain = spawnSync("git", ["merge-base", "--is-ancestor", sha, MAIN]).status === 0;
  if (onMain) return git("log", "-1", "--format=%s", sha).match(/^PR (\d+):/)?.[1] ?? null;
  return branchPr ?? null;
}

const fileCache = new Map();
/** PR yang pertama menambahkan judul tes ini; bila judul memuat nilai variabel, PR berkasnya. */
function prOfTest(file, title) {
  const exact = git("log", "--reverse", "--format=%H", "-S", title, "--", file).split("\n")[0];
  if (exact) return prOfCommit(exact);
  if (!fileCache.has(file)) {
    const added = git("log", "--reverse", "--format=%H", "--diff-filter=A", "--", file);
    fileCache.set(file, prOfCommit(added.split("\n")[0]));
  }
  return fileCache.get(file);
}
const prLabel = (n) => (n ? `PR ${Number(n)}` : "—");

// Playwright: satu baris per tes, kolom desktop dan HP.
const e2eRows = [];
function walk(suite, parents) {
  const titles = suite.title && !suite.title.endsWith(".ts") ? [...parents, suite.title] : parents;
  for (const spec of suite.specs ?? []) {
    const file = `tests/e2e/${suite.file ?? spec.file}`.replace(/\\/g, "/");
    const row = {
      file,
      pr: prOfTest(file, spec.title),
      group: titles.join(" › "),
      title: spec.title,
      runs: {},
    };
    for (const t of spec.tests ?? []) {
      const last = t.results?.at(-1);
      const video = last?.attachments?.find((a) => a.name === "video" && a.path);
      row.runs[t.projectName] = {
        status: t.status === "skipped" ? "skipped" : (last?.status ?? "skipped"),
        flaky: t.status === "flaky",
        seconds: last ? (last.duration / 1000).toFixed(1) : "",
        video: video?.path,
      };
    }
    e2eRows.push(row);
  }
  for (const child of suite.suites ?? []) walk(child, titles);
}
for (const suite of playwright?.suites ?? []) walk(suite, []);

rmSync(VIDEO_DIR, { recursive: true, force: true });
mkdirSync(VIDEO_DIR, { recursive: true });
e2eRows.forEach((row, i) => {
  row.no = String(i + 1).padStart(2, "0");
  for (const [project, r] of Object.entries(row.runs)) {
    // Tes yang dilewati tidak menguji apa pun; videonya kosong dan tidak disimpan.
    if (r.status === "skipped" || !r.video || !existsSync(r.video)) continue;
    const name = `${row.no}-${slug(`${row.group} ${row.title}`)}-${project}.webm`;
    copyFileSync(r.video, join(VIDEO_DIR, name));
    r.file = `e2e/${name}`;
  }
});

// Vitest: dikelompokkan per berkas.
const vitestFiles = (vitest?.testResults ?? []).map((f) => {
  const file = relative(ROOT, f.name).replace(/\\/g, "/");
  return {
    file,
    tests: f.assertionResults.map((a) => ({
      group: a.ancestorTitles.join(" › "),
      title: a.title,
      status: a.status,
      ms: Math.round(a.duration ?? 0),
      pr: prOfTest(file, a.title),
    })),
  };
});

// ---------------------------------------------------------------------------
// Tulis README
// ---------------------------------------------------------------------------

const count = (items, status) => items.filter((s) => s === status).length;
const eStatuses = e2eRows.flatMap((r) => Object.values(r.runs).map((x) => x.status));
const unitFiles = vitestFiles.filter((f) => f.file.startsWith("tests/unit"));
const integFiles = vitestFiles.filter((f) => f.file.startsWith("tests/integration"));
const statusesOf = (files) => files.flatMap((f) => f.tests.map((t) => t.status));

const sha = execSync("git rev-parse --short HEAD").toString().trim();
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
const when = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
}).format(new Date());

const cell = (r) => {
  if (!r) return "—";
  const text = `${label(r.status)}${r.flaky ? " (ulang)" : ""}`;
  return r.file ? `${text}, [video](${r.file})` : text;
};

const lines = [];
lines.push("# Bukti testing SIRAMA", "");
lines.push(
  "Dibuat otomatis oleh `pnpm test:evidence` (`scripts/test-evidence.mjs`). Jangan diubah manual; jalankan ulang perintahnya.",
  "",
);
lines.push("| | |", "|---|---|");
lines.push(`| Waktu | ${when} WIB |`);
lines.push(`| Commit | \`${sha}\` (branch \`${branch}\`) |`);
lines.push(`| Node | ${process.version} |`);
lines.push("| Database | Neon branch `dev` (akun demo dari `pnpm db:seed`) |");
lines.push(
  "| E2E | Build produksi (`next start`), Chromium desktop 1280 x 720 dan HP 375 x 812 |",
  "",
);

lines.push("## Ringkasan", "");
lines.push("| Pemeriksaan | Hasil | Durasi |", "|---|---|---|");
for (const c of checks)
  lines.push(`| ${c.label} | ${c.ok ? "Lulus" : "Gagal"} | ${c.seconds} detik |`);
lines.push("");
lines.push("| Jenis tes | Jumlah | Lulus | Gagal | Dilewati |", "|---|---|---|---|---|");
const summary = (name, list) =>
  `| ${name} | ${list.length} | ${count(list, "passed")} | ${count(list, "failed")} | ${list.length - count(list, "passed") - count(list, "failed")} |`;
lines.push(summary("Unit (Vitest)", statusesOf(unitFiles)));
lines.push(summary("Integrasi (Vitest + Neon)", statusesOf(integFiles)));
lines.push(summary("E2E (Playwright, desktop + HP)", eStatuses));
lines.push("");
lines.push(
  'Tes E2E yang "Dilewati" sengaja hanya dijalankan di satu ukuran layar (misalnya sidebar hanya ada di desktop, bar bawah hanya di HP).',
  "",
);

// Jumlah tes per PR asal.
const perPr = new Map();
const tally = (pr, kind) => {
  const key = pr ? Number(pr) : 0;
  const entry = perPr.get(key) ?? { unit: 0, integrasi: 0, e2e: 0 };
  entry[kind] += 1;
  perPr.set(key, entry);
};
for (const f of unitFiles) for (const t of f.tests) tally(t.pr, "unit");
for (const f of integFiles) for (const t of f.tests) tally(t.pr, "integrasi");
for (const r of e2eRows) tally(r.pr, "e2e");
lines.push("## Tes per PR", "");
lines.push(
  'Kolom **PR** di setiap tabel menunjukkan PR (urutan Build di `specs/tech.md` §15) yang pertama menambahkan tes itu, atau yang terakhir mengganti judulnya. Ditentukan otomatis dari riwayat git: commit di `main` dibaca dari judul squash merge "PR N: ...", commit yang belum di-merge dari nama branch `feat/NN-...`.',
  "",
);
lines.push("| PR | Unit | Integrasi | Skenario E2E |", "|---|---|---|---|");
for (const [pr, e] of [...perPr].sort((a, b) => a[0] - b[0])) {
  lines.push(`| ${prLabel(pr)} | ${e.unit} | ${e.integrasi} | ${e.e2e} |`);
}
lines.push("");

lines.push("## Jenis pemeriksaan", "");
lines.push("| Jenis | Alat | Yang dibuktikan | Bukti |", "|---|---|---|---|");
lines.push(
  "| Typecheck | TypeScript (`tsc`) | Tipe data konsisten di seluruh kode | Baris Ringkasan |",
);
lines.push("| Lint | ESLint | Pola kode berbahaya, aturan `src/domain/` murni | Baris Ringkasan |");
lines.push("| Format | Prettier | Penulisan kode seragam | Baris Ringkasan |");
lines.push(
  "| Unit | Vitest | Fungsi murni (aturan bisnis, peran, token) tanpa database | Tabel Unit di bawah |",
);
lines.push(
  "| Integrasi | Vitest + Neon | Kode server dengan database sungguhan (login, hak akses, seed) | Tabel Integrasi di bawah |",
);
lines.push(
  "| E2E (blackbox) | Playwright | Aplikasi dipakai seperti user di browser | Tabel E2E + video |",
);
lines.push("");

lines.push("## E2E (Playwright)", "");
lines.push('Satu baris = satu skenario. Klik "video" untuk melihat rekamannya.', "");
lines.push(
  "| No | PR | Kelompok | Skenario | Mencakup | Desktop | HP 375 px |",
  "|---|---|---|---|---|---|---|",
);
for (const r of e2eRows) {
  lines.push(
    `| ${r.no} | ${prLabel(r.pr)} | ${r.group} | ${r.title.replace(/\|/g, "\\|")} | ${coverage(r.group, r.title)} | ${cell(r.runs.desktop)} | ${cell(r.runs.hp)} |`,
  );
}
lines.push("");

const testTable = (files) => {
  for (const f of files) {
    lines.push(`### \`${f.file}\``, "");
    lines.push("| PR | Kelompok | Tes | Hasil | Durasi |", "|---|---|---|---|---|");
    for (const t of f.tests) {
      lines.push(
        `| ${prLabel(t.pr)} | ${t.group} | ${t.title.replace(/\|/g, "\\|")} | ${label(t.status)} | ${t.ms} ms |`,
      );
    }
    lines.push("");
  }
};
lines.push("## Integrasi (Vitest + database Neon)", "");
testTable(integFiles);
lines.push("## Unit (Vitest)", "");
testTable(unitFiles);

lines.push("## Cara membuat ulang", "");
lines.push("```", "pnpm test:evidence", "```", "");
lines.push(
  "Butuh `.env.local` berisi `DATABASE_URL` (branch Neon `dev`) dan `SEED_PASSWORD`. Laporan HTML Playwright lengkap ada di `playwright-report/` (tidak di-commit): buka dengan `pnpm exec playwright show-report`. Di CI, laporan yang sama tersedia sebagai artefak `playwright-report` pada setiap run GitHub Actions (disimpan 14 hari).",
  "",
);

writeFileSync(join(OUT, "README.md"), lines.join("\n"));
rmSync(TMP, { recursive: true, force: true });

const failed = checks.filter((c) => !c.ok);
console.log(`\nBukti testing ditulis ke ${relative(ROOT, OUT)}/ (${e2eRows.length} skenario E2E).`);
if (failed.length) {
  console.error(`Gagal: ${failed.map((c) => c.label).join(", ")}`);
  process.exit(1);
}
