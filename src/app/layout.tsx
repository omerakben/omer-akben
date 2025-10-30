import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import SiteStatus from "@/components/SiteStatus";
import { AppShell } from "@/components/app-shell";
import { createMetadata } from "@/lib/metadata";
import { cookies } from "next/headers";
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
  const cachePref = (cookies().get("ozzy_cache_pref")?.value ?? "performance") as
    | "performance"
    | "fresh";

  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SiteStatus initialCachePref={cachePref} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
