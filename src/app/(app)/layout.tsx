import { BottomNav } from "@/components/sirama/bottom-nav";
import { Logo } from "@/components/sirama/logo";
import { MobileMenu } from "@/components/sirama/mobile-menu";
import { Sidebar } from "@/components/sirama/sidebar";
import { UserMenu } from "@/components/sirama/user-menu";
import { bottomNavFor, sidebarFor } from "@/domain/roles";
import { roleWithSkill } from "@/lib/labels";
import { requireUser } from "@/server/authz";

/**
 * Layout semua halaman setelah login (design.md §5.3-5.4). Wajib login: requireUser()
 * mengalihkan ke /login bila sesi tidak sah (US-AUTH-01 AC4). Menu dibentuk dari peran di
 * server, sehingga menu yang tidak berhak tidak pernah dikirim ke browser (US-AUTH-03 AC2).
 */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const nav = sidebarFor(user.role);
  const roleLabel = roleWithSkill(user.role, user.skill);

  return (
    <div className="flex min-h-dvh">
      <Sidebar nav={nav} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* KOM-27 Header desktop. Pencarian (KOM-31) dan lonceng (KOM-30) menyusul di PR 8 dan 11. */}
        <header className="sticky top-0 z-20 hidden h-header-height shrink-0 items-center justify-end border-b border-line bg-surface px-6 md:flex">
          <UserMenu name={user.name} roleLabel={roleLabel} />
        </header>

        {/* Header ringkas HP (design.md §5.4). */}
        <header className="sticky top-0 z-20 flex h-header-height-mobile shrink-0 items-center gap-1 border-b border-line bg-surface pr-4 pl-1 md:hidden">
          <MobileMenu nav={nav} name={user.name} roleLabel={roleLabel} />
          <Logo />
        </header>

        <div className="flex flex-1 flex-col pb-[calc(var(--spacing-bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>
      </div>

      <BottomNav items={bottomNavFor(user.role)} />
    </div>
  );
}
