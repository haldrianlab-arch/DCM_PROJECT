import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

import { PATH_HEADER } from "@/server/authz-constants";

/**
 * Proxy Next.js 16 (dulu middleware), tech.md §6.2 lapisan 1.
 * Hanya memeriksa ADA/TIDAKNYA cookie sesi lalu mengalihkan ke /login?next=... (US-AUTH-01
 * AC4, US-QR-02 AC2). Ini kenyamanan, bukan keamanan: keabsahan sesi dan peran dicek ulang
 * di halaman (requireUser/requireRole) dan di setiap server action (authorize).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const path = `${pathname}${search}`;

  if (!getSessionCookie(request)) {
    const login = new URL("/login", request.url);
    if (pathname !== "/") login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  // Teruskan path yang diminta agar requireUser bisa mengisi ?next= bila sesi ternyata kedaluwarsa.
  const forwarded = new Headers(request.headers);
  forwarded.set(PATH_HEADER, path);
  return NextResponse.next({ request: { headers: forwarded } });
}

export const config = {
  // Semua halaman kecuali login, endpoint API (auth, cron, QR), aset Next.js, dan berkas statis.
  matcher: ["/((?!login|api/|_next/|dev/|favicon|icon\.svg|.*\.[a-z0-9]+$).*)"],
};
