import { getAuth } from "@/server/auth";

/** Tes integrasi auth butuh database dan password akun demo. */
export const canRunAuthTests = !!process.env.DATABASE_URL && !!process.env.SEED_PASSWORD;
export const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "";

/** Login lewat API Better Auth dan kembalikan header Cookie untuk permintaan berikutnya. */
export async function sessionHeaders(email: string, password = SEED_PASSWORD): Promise<Headers> {
  const { headers } = await getAuth().api.signInEmail({
    body: { email, password },
    returnHeaders: true,
  });
  const cookie = headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  return new Headers({ cookie });
}
