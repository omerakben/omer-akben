import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { createMetadata } from "@/lib/metadata";
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
  // Get nonce for CSP (though layout.tsx doesn't currently use inline scripts/styles)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nonce = (await headers()).get("x-nonce") || "";

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Resource hints for performance optimization */}
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
      </head>
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
