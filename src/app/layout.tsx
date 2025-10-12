import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ErrorBoundary } from "@/components/error-boundary";
import { BrightnessProvider } from "@/lib/brightness-context";
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
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      { url: "/favicon_io/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome",
        url: "/favicon_io/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/favicon_io/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
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
      </body>
    </html>
  );
}
