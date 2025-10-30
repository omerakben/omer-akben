import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const prefFromRequest = request.cookies.get("ozzy_cache_pref")?.value;
  let pref = prefFromRequest ?? "performance";

  if (!prefFromRequest) {
    try {
      pref = cookies().get("ozzy_cache_pref")?.value ?? "performance";
    } catch {
      pref = "performance";
    }
  }

  const res = NextResponse.json({ ok: true, pref, ts: Date.now() });
  res.headers.set(
    "Cache-Control",
    pref === "fresh" ? "no-store" : "s-maxage=60, stale-while-revalidate=120"
  );
  return res;
}
