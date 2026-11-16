import { getAuth } from "@/server/auth";

/** Endpoint Better Auth (/api/auth/*): masuk, keluar, sesi, dan endpoint plugin admin. */
export function GET(request: Request) {
  return getAuth().handler(request);
}

export function POST(request: Request) {
  return getAuth().handler(request);
}
