import { BUILD_ID } from "@/lib/build";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ acknowledged: true, buildId: BUILD_ID });

  response.cookies.set({
    name: "ozzy_wip_ack",
    value: BUILD_ID,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}
