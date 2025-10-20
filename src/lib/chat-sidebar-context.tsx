"use client";

import React, { createContext, useCallback, useContext, useState, useEffect } from "react";

const STORAGE_KEYS = {
  PINNED: 'sidebar_pinned',
  WIDTH: 'sidebar_width',
} as const;

const DEFAULT_WIDTH = 480; // px
const MIN_WIDTH = 320; // px
const MAX_WIDTH = 800; // px

interface ChatSidebarContextType {
  isOpen: boolean;
  isPinned: boolean;
  width: number;
  threadId: string;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setPinned: (pinned: boolean) => void;
  setWidth: (width: number) => void;
  newChat: () => void;
  clearConversation: () => void;
  setThreadId: (id: string) => void;
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
  const [isPinned, setIsPinnedState] = useState(false);
  const [width, setWidthState] = useState(DEFAULT_WIDTH);
  const [threadId, setThreadIdState] = useState(() => `thread-${Date.now()}`);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedPinned = localStorage.getItem(STORAGE_KEYS.PINNED);
      if (savedPinned !== null) {
        const isPinnedValue = savedPinned === 'true';
        setIsPinnedState(isPinnedValue);

        // If sidebar was pinned, it should be open on mount
        if (isPinnedValue) {
          setIsOpen(true);
        }
      }

      const savedWidth = localStorage.getItem(STORAGE_KEYS.WIDTH);
      if (savedWidth !== null) {
        const parsedWidth = parseInt(savedWidth, 10);
        if (!isNaN(parsedWidth) && parsedWidth >= MIN_WIDTH && parsedWidth <= MAX_WIDTH) {
          setWidthState(parsedWidth);
        }
      }
    } catch (error) {
      console.error('[ChatSidebar] Failed to load persisted state:', error);
    }
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
    // Only prevent body scroll when unpinned (pinned sidebar doesn't need this)
    if (!isPinned) {
      document.body.classList.add("overflow-hidden");
    }
  }, [isPinned]);

  const closeSidebar = useCallback(() => {
    // Don't close if pinned
    if (isPinned) return;

    setIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  }, [isPinned]);

  const toggleSidebar = useCallback(() => {
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }, [isOpen, openSidebar, closeSidebar]);

  const setPinned = useCallback((pinned: boolean) => {
    setIsPinnedState(pinned);

    try {
      localStorage.setItem(STORAGE_KEYS.PINNED, pinned.toString());
    } catch (error) {
      console.error('[ChatSidebar] Failed to persist pinned state:', error);
    }

    // If pinning, ensure sidebar is open and restore body scroll
    if (pinned) {
      setIsOpen(true);
      document.body.classList.remove("overflow-hidden");
    }
  }, []);

  const setWidth = useCallback((newWidth: number) => {
    // Clamp width to valid range
    const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
    setWidthState(clampedWidth);

    try {
      localStorage.setItem(STORAGE_KEYS.WIDTH, clampedWidth.toString());
    } catch (error) {
      console.error('[ChatSidebar] Failed to persist width:', error);
    }
  }, []);

  const newChat = useCallback(() => {
    // Generate new thread ID
    const newThreadId = `thread-${Date.now()}`;
    setThreadIdState(newThreadId);
  }, []);

  const clearConversation = useCallback(() => {
    // Keep same thread ID but signal for message clearing
    // The chat component will handle actual message clearing
    setThreadIdState(prev => `${prev}-cleared-${Date.now()}`);
  }, []);

  const setThreadId = useCallback((id: string) => {
    setThreadIdState(id);
  }, []);

  return (
    <ChatSidebarContext.Provider
      value={{
        isOpen,
        isPinned,
        width,
        threadId,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        setPinned,
        setWidth,
        newChat,
        clearConversation,
        setThreadId,
      }}
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
