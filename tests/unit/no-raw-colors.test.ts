import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * CLAUDE.md: "tidak ada warna atau ukuran di luar token". Tes ini menolak warna literal,
 * nilai sembarang Tailwind berukuran (text-[13px], bg-[#fff]), palet bawaan Tailwind
 * (bg-zinc-50), dan ukuran teks bawaan (text-sm) di kode sumber.
 */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return sourceFiles(p);
    return /\.(tsx?|jsx?)$/.test(e.name) ? [p] : [];
  });
}

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white";
const PREFIX =
  "bg|text|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|accent|caret|divide";

const RULES: Array<[string, RegExp]> = [
  ["warna hex", /#[0-9a-fA-F]{3,8}\b/],
  ["fungsi warna", /\b(rgba?|hsla?|oklch|oklab)\(/],
  ["nilai sembarang berukuran atau berwarna", /-\[[^\]]*(\d(px|rem|em|%|vh|vw)|#)[^\]]*\]/],
  ["palet bawaan Tailwind", new RegExp(`(^|[\\s"'\`:])(${PREFIX})-(${PALETTE})(-\\d{2,3})?\\b`)],
  ["ukuran teks bawaan Tailwind", /(^|[\s"'`:])text-(xs|sm|base|lg|[2-9]?xl)\b/],
];

const files = sourceFiles("src");

describe("tidak ada warna atau ukuran di luar token", () => {
  it("ada berkas yang diperiksa", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s", (file) => {
    const lines = readFileSync(file, "utf8").split("\n");
    const problems: string[] = [];
    lines.forEach((line, i) => {
      for (const [label, re] of RULES) {
        if (re.test(line)) problems.push(`${file}:${i + 1} ${label}: ${line.trim()}`);
      }
    });
    expect(problems).toEqual([]);
  });
});
