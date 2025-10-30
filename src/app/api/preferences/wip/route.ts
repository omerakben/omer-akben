import { BUILD_ID } from "@/lib/build";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().set({
    name: "ozzy_wip_ack",
    value: BUILD_ID,
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 180,
  });

  const response = NextResponse.json({ success: true, buildId: BUILD_ID });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
