"use client";

import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { AnimatedBlobContainer } from "@/components/animated-blob-container";
import { useEffect, useState } from "react";

export function GlobalChatButton() {
  const { isOpen, openSidebar, newChat } = useChatSidebar();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Don't register keyboard shortcuts when sidebar is open
    if (isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // cmd/ctrl + K shortcut to open chat
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && !e.shiftKey) {
        e.preventDefault();
        openSidebar();
      }

      // cmd/ctrl + shift + N shortcut for new chat
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "N") {
        e.preventDefault();
        newChat();
        openSidebar(); // Also open sidebar if closed
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    setIsReady(true);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openSidebar, newChat]);

  // Hide button when sidebar is already open
  if (isOpen) return null;

  return (
    <Button
      onClick={openSidebar}
      disabled={!isReady}
      size="lg"
      variant="outline"
      className="fixed bottom-4 right-4 z-40 h-11 w-11 bg-surf-1 p-0 shadow-lg hover:bg-surf-2 md:bottom-6 md:right-6 md:h-14 md:w-14"
      aria-label="Open AI Ozzy chat (cmd/ctrl+K)"
    >
      {/* The orb renders at a fixed pixel size, so phones scale it down. */}
      <span className="flex scale-75 md:scale-100">
        <AnimatedBlobContainer
          size={36}
          className="rounded-full"
          disableCenterDimming={true}
          asIcon={true}
        />
      </span>
    </Button>
  );
}
