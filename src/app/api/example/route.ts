import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type CachePreference = "performance" | "fresh";

export async function GET(request: NextRequest) {
  const requestPref = request.cookies.get("ozzy_cache_pref")?.value;
  let fallbackPref: string | undefined;

  try {
    fallbackPref = cookies().get("ozzy_cache_pref")?.value;
  } catch {
    fallbackPref = undefined;
  }

  const pref = (requestPref ?? fallbackPref ?? "performance") as CachePreference;

  const response = NextResponse.json({ ok: true, pref, ts: Date.now() });
  response.headers.set(
    "Cache-Control",
    pref === "fresh"
      ? "no-store"
      : "s-maxage=60, stale-while-revalidate=120"
  );
  return response;
}
