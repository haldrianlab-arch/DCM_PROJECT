import { redirect } from "next/navigation";

import { homePathFor } from "@/domain/roles";
import { requireUser } from "@/server/authz";

/** `/` mengalihkan ke halaman awal sesuai peran (design.md §5.1, §5.2). */
export default async function RootPage() {
  const user = await requireUser();
  redirect(homePathFor(user.role));
}
