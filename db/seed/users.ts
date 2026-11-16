import { hashPassword } from "better-auth/crypto";

import type { Role, Skill } from "../../src/domain/roles";
import type { getDb } from "../../src/server/db/client";
import { account, session, user, verification } from "../../src/server/db/schema";

/**
 * Akun demo PRD Lampiran A: 1 Admin, 2 Teknisi (IT dan Fasilitas), 1 Viewer (persona PRD §5).
 * Email mengikuti pola wireframe HAL-01 (andi@kampus.ac.id).
 */
export const DEMO_USERS: ReadonlyArray<{
  name: string;
  email: string;
  role: Role;
  skill: Skill | null;
}> = [
  { name: "Andi", email: "andi@kampus.ac.id", role: "admin", skill: null },
  { name: "Rina", email: "rina@kampus.ac.id", role: "technician", skill: "it" },
  { name: "Joko", email: "joko@kampus.ac.id", role: "technician", skill: "facility" },
  { name: "Sari", email: "sari@kampus.ac.id", role: "viewer", skill: null },
];

type Db = ReturnType<typeof getDb>;

/**
 * Kosongkan tabel auth lalu buat akun demo (NFR-08). Satu transaksi: gagal di tengah jalan
 * berarti tidak ada yang berubah. Password di-hash dengan fungsi yang sama dengan Better Auth,
 * jadi akun bisa langsung dipakai login.
 */
export async function seedUsers(db: Db, password: string): Promise<void> {
  if (password.length < 8) throw new Error("SEED_PASSWORD minimal 8 karakter.");
  const hash = await hashPassword(password);

  await db.transaction(async (tx) => {
    await tx.delete(session);
    await tx.delete(verification);
    await tx.delete(account);
    await tx.delete(user);

    for (const demo of DEMO_USERS) {
      const [created] = await tx
        .insert(user)
        .values({ ...demo, emailVerified: true })
        .returning({ id: user.id });
      await tx.insert(account).values({
        userId: created.id,
        accountId: created.id,
        providerId: "credential",
        password: hash,
      });
    }
  });
}
