import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

import SiteStatus from "@/components/SiteStatus";
import { AppShell } from "@/components/app-shell";
import { createMetadata } from "@/lib/metadata";
import { BUILD_DATE, BUILD_ID } from "@/lib/build";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = createMetadata({});

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const cachePref = (cookieStore.get("ozzy_cache_pref")?.value ?? "performance") as
    | "performance"
    | "fresh";
  const initialAcknowledged = cookieStore.get("ozzy_wip_ack")?.value === BUILD_ID;

  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SiteStatus
          initialCachePref={cachePref}
          initialAcknowledged={initialAcknowledged}
          buildId={BUILD_ID}
          buildDate={BUILD_DATE}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
