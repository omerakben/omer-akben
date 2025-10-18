"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

interface ChatSidebarContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const ChatSidebarContext = createContext<ChatSidebarContextType | undefined>(
  undefined
);

export function ChatSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
    // Prevent body scroll when sidebar is open
    // Using CSS class for better accessibility and predictability
    document.body.classList.add("overflow-hidden");
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
    // Restore body scroll
    document.body.classList.remove("overflow-hidden");
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }, [isOpen, openSidebar, closeSidebar]);

  return (
    <ChatSidebarContext.Provider
      value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}
    >
      {children}
    </ChatSidebarContext.Provider>
  );
}

export function useChatSidebar() {
  const context = useContext(ChatSidebarContext);
  if (context === undefined) {
    throw new Error("useChatSidebar must be used within ChatSidebarProvider");
  }
  return context;
}
