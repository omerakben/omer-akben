import { BUILD_ID } from "@/lib/build";
import { NextRequest, NextResponse } from "next/server";

type CacheMode = "fresh" | "performance";

const CACHE_COOKIE = "ozzy_cache_pref";
const WIP_COOKIE = "ozzy_wip_ack";

function createResponse(data: Record<string, unknown>) {
  const response = NextResponse.json(data);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const mode = (body?.mode ?? "performance") as CacheMode;

  if (mode !== "fresh" && mode !== "performance") {
    const response = createResponse({ ok: false, error: "Invalid mode" });
    response.status = 400;
    return response;
  }

  const response = createResponse({ ok: true, mode });
  response.cookies.set({
    name: CACHE_COOKIE,
    value: mode,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Preserve acknowledgement when switching preferences by re-setting cookie when present
  if (request.cookies.get(WIP_COOKIE)?.value === BUILD_ID) {
    response.cookies.set({
      name: WIP_COOKIE,
      value: BUILD_ID,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export async function DELETE() {
  const response = createResponse({ ok: true, cleared: true });

  response.cookies.delete(CACHE_COOKIE);
  response.cookies.delete(WIP_COOKIE);

  return response;
}
