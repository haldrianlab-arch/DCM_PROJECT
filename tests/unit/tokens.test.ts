import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import tokens from "../../specs/design-system/tokens.json";

/**
 * tokens.json adalah sumber kebenaran token (CLAUDE.md). Tes ini memastikan
 * src/app/globals.css memuat setiap token dengan nilai yang sama.
 */
const css = readFileSync("src/app/globals.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

const declared = new Map<string, string>();
for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
  if (!declared.has(m[1])) declared.set(m[1], m[2]);
}

const norm = (v: string) =>
  v
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .trim()
    .toLowerCase();

function expectVar(name: string, value: string) {
  expect(declared.has(name), `${name} tidak ada di globals.css`).toBe(true);
  expect(norm(declared.get(name)!), name).toBe(norm(value));
}

const resolveAlias = (value: string) => value.replace(/^\{([\w-]+)\}$/, "var(--color-$1)");

describe("token design system di globals.css", () => {
  it.each(tokens.color.tokens.map((t) => [t.name, t.value]))("warna %s", (name, value) => {
    expectVar(`--color-${name}`, resolveAlias(value));
  });

  it("tidak ada warna literal di globals.css yang bukan token", () => {
    const names = new Set(tokens.color.tokens.map((t) => `--color-${t.name}`));
    const literal = [...declared].filter(
      ([k, v]) => k.startsWith("--color-") && /^(#|rgb)/.test(v.trim()),
    );
    for (const [k] of literal) expect(names.has(k), `${k} bukan token`).toBe(true);
  });

  it.each(tokens.radius.tokens.map((t) => [t.name, t.value]))("sudut %s", (name, value) => {
    expectVar(`--${name}`, value);
  });

  it.each(tokens.shadow.tokens.map((t) => [t.name, t.value]))("bayangan %s", (name, value) => {
    expectVar(name.startsWith("shadow-") ? `--${name}` : `--shadow-${name}`, value);
  });

  it.each(tokens.size.tokens.map((t) => [t.name, t.value]))("ukuran %s", (name, value) => {
    expectVar(name === "breakpoint-mobile" ? "--breakpoint-md" : `--spacing-${name}`, value);
  });

  it("skala jarak 4 px", () => {
    expectVar("--spacing", "4px");
    for (const t of tokens.spacing.tokens) {
      const n = Number(t.name.replace("space-", ""));
      expect(t.value, t.name).toBe(`${n * 4}px`);
    }
  });

  it.each(
    [...tokens.duration.tokens, ...tokens.opacity.tokens, ...tokens.blur.tokens].map((t) => [
      t.name,
      t.value,
    ]),
  )("%s", (name, value) => {
    expectVar(`--${name}`, value);
  });

  const styles = tokens.type.groups.flatMap((g) => g.styles) as Array<{
    name: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: number;
    letterSpacing?: string;
  }>;

  it.each(styles.map((s) => [s.name, s] as const))("gaya teks %s", (name, s) => {
    expectVar(`--text-${name}`, s.fontSize);
    expectVar(`--text-${name}--line-height`, s.lineHeight);
    expectVar(`--text-${name}--font-weight`, String(s.fontWeight));
    if (s.letterSpacing) expectVar(`--text-${name}--letter-spacing`, s.letterSpacing);
  });
});
