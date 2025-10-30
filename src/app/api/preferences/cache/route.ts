import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "ozzy_cache_pref";
const ACK_COOKIE_NAME = "ozzy_wip_ack";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type CacheMode = "fresh" | "performance";

export async function POST(request: NextRequest) {
  let mode: CacheMode | null = null;

  try {
    const body = await request.json();
    if (body && (body.mode === "fresh" || body.mode === "performance")) {
      mode = body.mode;
    }
  } catch {
    mode = null;
  }

  if (!mode) {
    const response = NextResponse.json(
      { ok: false, error: "Invalid cache mode" },
      { status: 400 }
    );
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const store = cookies();
  store.set({
    name: COOKIE_NAME,
    value: mode,
    maxAge: COOKIE_MAX_AGE,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  const response = NextResponse.json({ ok: true, mode });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function DELETE() {
  const store = cookies();

  store.set({
    name: COOKIE_NAME,
    value: "",
    maxAge: 0,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  store.set({
    name: ACK_COOKIE_NAME,
    value: "",
    maxAge: 0,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  const response = NextResponse.json({ ok: true, cleared: true });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
