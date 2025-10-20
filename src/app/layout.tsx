"use client";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ErrorBoundary } from "@/components/error-boundary";
import { GlobalChatButton } from "@/components/global-chat-button";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SkipToContent } from "@/components/skip-to-content";
import { BrightnessProvider } from "@/lib/brightness-context";
import {
  ChatSidebarProvider,
  useChatSidebar,
} from "@/lib/chat-sidebar-context";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Layout container that applies right margin when sidebar is pinned
 * Handles hydration properly by waiting for client-side mount
 * All children (header, main, footer) naturally fit within this constraint
 */
function LayoutContainer({ children }: { children: React.ReactNode }) {
  const { isPinned, width } = useChatSidebar();
  // Initialize with 0 to match SSR, prevent hydration mismatch
  const [marginRight, setMarginRight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only apply margin after component mounts and we have client-side state
    if (!isMounted) return;

    if (isPinned) {
      setMarginRight(width);
    } else {
      setMarginRight(0);
    }
  }, [isPinned, width, isMounted]);

  return (
    <div
      className="transition-[margin-right] duration-300 ease-out"
      style={
        {
          "--sidebar-margin": `${marginRight}px`,
          marginRight: "var(--sidebar-margin)",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SkipToContent />
        <ErrorBoundary>
          <BrightnessProvider>
            <ChatSidebarProvider>
              <LayoutContainer>
                <AppHeader />
                <main id="main-content" className="min-h-screen">
                  {children}
                </main>
                <AppFooter />
              </LayoutContainer>
              <ScrollToTop />
              <ChatSidebar />
              <GlobalChatButton />
              <Toaster richColors position="top-center" />
              <Analytics />
            </ChatSidebarProvider>
          </BrightnessProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
