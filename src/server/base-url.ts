/**
 * URL dasar aplikasi untuk Better Auth (tech.md §6.1, §13).
 *
 * - Lokal dan produksi: BETTER_AUTH_URL.
 * - Preview Vercel: URL berganti setiap deploy, jadi diambil dari variabel bawaan Vercel.
 *
 * Nilai dari environment variable bisa saja ditulis tidak lengkap (tanpa `https://`, ada spasi,
 * tanda kutip, atau garis miring di akhir). Fungsi ini merapikannya; bila tetap tidak valid,
 * nilai itu diabaikan dan dipakai URL bawaan Vercel, agar build produksi tidak gagal karena
 * salah ketik. Pelajaran deploy produksi PR 2 (devlog sesi 14).
 */

type Env = Record<string, string | undefined>;

/** "dcmproject.vercel.app" → "https://dcmproject.vercel.app"; nilai rusak → null. */
export function normalizeOrigin(raw: string | undefined): string | null {
  if (!raw) return null;
  let value = raw
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) {
    const local = /^(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(value);
    value = `${local ? "http" : "https"}://${value}`;
  }
  try {
    const url = new URL(value);
    if (!url.hostname || /\s/.test(url.hostname)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** URL dasar yang dipakai Better Auth; undefined bila tidak ada sumber yang valid. */
export function resolveBaseUrl(env: Env = process.env): string | undefined {
  // Produksi: domain utama (dcmproject.vercel.app), bukan alamat per branch git.
  const production =
    env.VERCEL_ENV === "production" ? normalizeOrigin(env.VERCEL_PROJECT_PRODUCTION_URL) : null;
  return (
    normalizeOrigin(env.BETTER_AUTH_URL) ??
    production ??
    normalizeOrigin(env.VERCEL_BRANCH_URL) ??
    normalizeOrigin(env.VERCEL_URL) ??
    normalizeOrigin(env.VERCEL_PROJECT_PRODUCTION_URL) ??
    undefined
  );
}

/** Alamat yang dipercaya Better Auth untuk permintaan login (cek origin). */
export function resolveTrustedOrigins(env: Env = process.env): string[] {
  const candidates = [
    env.BETTER_AUTH_URL,
    env.VERCEL_URL,
    env.VERCEL_BRANCH_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL,
  ];
  const origins = candidates.map(normalizeOrigin).filter((o): o is string => o !== null);
  return [...new Set(origins)];
}
