"use client";

import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { AnimatedBlobContainer } from "@/components/animated-blob-container";
import { useEffect } from "react";

export function GlobalChatButton() {
  const { isOpen, openSidebar, newChat } = useChatSidebar();

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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openSidebar, newChat]);

  // Hide button when sidebar is already open
  if (isOpen) return null;

  return (
    <Button
      onClick={openSidebar}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-brand-primary hover:bg-brand-primary/90 z-40"
      aria-label="Open AI Ozzy chat (cmd/ctrl+K)"
    >
      <AnimatedBlobContainer
        size={24}
        className="rounded-full"
        disableCenterDimming={true}
        asIcon={true}
      />
    </Button>
  );
}
