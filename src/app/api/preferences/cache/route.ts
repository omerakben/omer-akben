import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type CacheMode = "performance" | "fresh";

function setCacheHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const body = await request.json().catch(() => null);

  const mode = body?.mode as CacheMode | undefined;

  if (mode !== "performance" && mode !== "fresh") {
    return setCacheHeaders(
      NextResponse.json({ error: "Invalid mode" }, { status: 400 })
    );
  }

  cookieStore.set({
    name: "ozzy_cache_pref",
    value: mode,
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return setCacheHeaders(NextResponse.json({ mode }));
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete("ozzy_cache_pref");
  cookieStore.delete("ozzy_wip_ack");

  return setCacheHeaders(NextResponse.json({ cleared: true }));
}
