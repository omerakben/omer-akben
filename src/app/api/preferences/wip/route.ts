import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { BUILD_ID } from "@/lib/build";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function POST() {
  const cookieStore = cookies();

  cookieStore.set({
    name: "ozzy_wip_ack",
    value: BUILD_ID,
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const response = NextResponse.json({ acknowledged: true, buildId: BUILD_ID });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
