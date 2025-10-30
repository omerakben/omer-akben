import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import SiteStatus from "@/components/SiteStatus";
import { AppShell } from "@/components/app-shell";
import { createMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = createMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = cookies();
  const cachePref = (
    cookieStore.get("ozzy_cache_pref")?.value ?? "performance"
  ) as "performance" | "fresh";
  const acknowledgedBuildId = cookieStore.get("ozzy_wip_ack")?.value ?? null;

  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SiteStatus
          initialCachePref={cachePref}
          acknowledgedBuildId={acknowledgedBuildId}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
