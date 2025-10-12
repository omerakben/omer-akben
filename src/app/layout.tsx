import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ErrorBoundary } from "@/components/error-boundary";
import { BrightnessProvider } from "@/lib/brightness-context";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Omer Akben - Software Engineer & SDET",
  description:
    "Personal portfolio and recruiter-magnet site showcasing Omer 'Ozzy' Akben's work in AI and automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ErrorBoundary>
          <BrightnessProvider>
            <AppHeader />
            <main className="min-h-screen">{children}</main>
            <AppFooter />
            <Toaster richColors position="top-center" />
          </BrightnessProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
