import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const CACHE_MODES = ["fresh", "performance"] as const;
type CacheMode = (typeof CACHE_MODES)[number];

function setCachePrefCookie(mode: CacheMode) {
  cookies().set({
    name: "ozzy_cache_pref",
    value: mode,
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function noStoreResponse<T>(body: T, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const mode = payload?.mode as CacheMode | undefined;

    if (!mode || !CACHE_MODES.includes(mode)) {
      return noStoreResponse(
        { success: false, error: "Invalid cache mode" },
        { status: 400 }
      );
    }

    setCachePrefCookie(mode);
    return noStoreResponse({ success: true, mode });
  } catch {
    return noStoreResponse(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const store = cookies();
  store.delete("ozzy_cache_pref");
  store.delete("ozzy_wip_ack");

  return noStoreResponse({ success: true });
}
