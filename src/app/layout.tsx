"use client";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ErrorBoundary } from "@/components/error-boundary";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SkipToContent } from "@/components/skip-to-content";
import { BrightnessProvider } from "@/lib/brightness-context";
import { ChatSidebarProvider } from "@/lib/chat-sidebar-context";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";

  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SkipToContent />
        <ErrorBoundary>
          <BrightnessProvider>
            <ChatSidebarProvider>
              <AppHeader />
              <main id="main-content" className="min-h-screen">{children}</main>
              {!isChatPage && <AppFooter />}
              <ScrollToTop />
              <ChatSidebar />
              <Toaster richColors position="top-center" />
              <Analytics />
            </ChatSidebarProvider>
          </BrightnessProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
