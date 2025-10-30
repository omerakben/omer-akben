import { BUILD_ID } from "@/lib/build";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "ozzy_wip_ack";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST() {
  const store = cookies();

  store.set({
    name: COOKIE_NAME,
    value: BUILD_ID,
    maxAge: COOKIE_MAX_AGE,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  const response = NextResponse.json({ ok: true, build: BUILD_ID });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
