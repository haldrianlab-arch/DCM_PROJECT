import type { Role, Skill } from "@/domain/roles";

/**
 * Label tampilan bahasa Indonesia untuk nilai enum (tech.md §4.1: label tidak disimpan di
 * database). Nama peran mengikuti PRD §5: Admin, Teknisi, Viewer.
 */
export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  technician: "Teknisi",
  viewer: "Viewer",
};

export const SKILL_LABEL: Record<Skill, string> = {
  it: "IT",
  facility: "Fasilitas",
  both: "Keduanya",
};

/** "Teknisi · IT" untuk Teknisi, selain itu nama peran saja (wireframe MOD-10). */
export function roleWithSkill(role: Role, skill: Skill | null | undefined): string {
  return role === "technician" && skill
    ? `${ROLE_LABEL[role]} · ${SKILL_LABEL[skill]}`
    : ROLE_LABEL[role];
}
