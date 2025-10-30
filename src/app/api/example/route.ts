import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const pref = cookies().get("ozzy_cache_pref")?.value ?? "performance";
  const response = NextResponse.json({ ok: true, pref, ts: Date.now() });
  response.headers.set(
    "Cache-Control",
    pref === "fresh"
      ? "no-store"
      : "s-maxage=60, stale-while-revalidate=120"
  );
  return response;
}
