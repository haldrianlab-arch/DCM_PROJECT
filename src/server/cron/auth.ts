import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Cek header `Authorization: Bearer ${CRON_SECRET}` (tech.md §8).
 * Gagal tertutup: bila CRON_SECRET belum diisi, semua permintaan ditolak.
 * Dibandingkan lewat hash dengan timingSafeEqual agar waktu respons tidak membocorkan isi secret.
 */
export function isAuthorizedCron(
  authorization: string | null,
  secret: string | undefined,
): boolean {
  if (!secret || !authorization) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(authorization), digest(`Bearer ${secret}`));
}
