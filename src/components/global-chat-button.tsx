"use client";

import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { Bot } from "lucide-react";
import { useEffect } from "react";

export function GlobalChatButton() {
  const { openSidebar, newChat } = useChatSidebar();

  useEffect(() => {
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
  }, [openSidebar, newChat]);

  return (
    <Button
      onClick={openSidebar}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-brand-primary hover:bg-brand-primary/90 z-40"
      aria-label="Open AI Ozzy chat (cmd/ctrl+K)"
    >
      <Bot className="w-6 h-6" />
    </Button>
  );
}
