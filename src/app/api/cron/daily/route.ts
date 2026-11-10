import { isAuthorizedCron } from "@/server/cron/auth";

/**
 * Cron harian, dipicu Vercel Cron Jobs (vercel.json, 0 0 * * * UTC = 07.00-07.59 WIB).
 * PR 1: hanya pemeriksaan CRON_SECRET. Langkah-langkah (tech.md §8) diisi di PR 11
 * lewat server/cron/daily.ts.
 */
export async function GET(request: Request) {
  if (!isAuthorizedCron(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return Response.json({ ok: false, message: "Tidak diizinkan." }, { status: 401 });
  }
  return Response.json({ ok: true, steps: [], message: "Belum ada langkah." });
}
