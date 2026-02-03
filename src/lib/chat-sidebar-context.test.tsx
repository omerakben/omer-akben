import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import {
  ChatSidebarProvider,
  useChatSidebar,
} from "./chat-sidebar-context";

describe("ChatSidebarProvider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("Thread ID Generation", () => {
    it("generates unique thread ID when localStorage is empty", () => {
      // Create a test component to access the context
      function TestComponent() {
        const { threadId } = useChatSidebar();
        return <div data-testid="thread-id">{threadId}</div>;
      }

      render(
        <ChatSidebarProvider>
          <TestComponent />
        </ChatSidebarProvider>
      );

      const threadId = screen.getByTestId("thread-id").textContent;

      // Should NOT be the old hard-coded default
      expect(threadId).not.toBe("thread-main");

      // Should match pattern thread-[uuid] or thread-[timestamp]-[random]
      expect(threadId).toMatch(/^thread-/);
    });

    it("generates different IDs across multiple instances", () => {
      const ids = new Set<string>();

      function TestComponent() {
        const { threadId } = useChatSidebar();
        // Only collect non-empty IDs (skip initial empty state)
        if (threadId) {
          ids.add(threadId);
        }
        return null;
      }

      // Create multiple instances
      for (let i = 0; i < 10; i++) {
        localStorage.clear();
        const { unmount } = render(
          <ChatSidebarProvider>
            <TestComponent />
          </ChatSidebarProvider>
        );
        unmount();
      }

      // All IDs should be unique
      expect(ids.size).toBe(10);

      // None should be the old default
      ids.forEach((id) => {
        expect(id).not.toBe("thread-main");
      });
    });

    it("persists thread ID to localStorage on first mount", () => {
      function TestComponent() {
        const { threadId } = useChatSidebar();
        return <div data-testid="thread-id">{threadId}</div>;
      }

      render(
        <ChatSidebarProvider>
          <TestComponent />
        </ChatSidebarProvider>
      );

      const threadId = screen.getByTestId("thread-id").textContent;
      const storedId = localStorage.getItem("chat_thread_id");

      // Should be stored in localStorage
      expect(storedId).toBe(threadId);
      expect(storedId).not.toBe("thread-main");
    });

    it("reuses existing thread ID from localStorage", () => {
      const existingId = "thread-existing-123";
      localStorage.setItem("chat_thread_id", existingId);

      function TestComponent() {
        const { threadId } = useChatSidebar();
        return <div data-testid="thread-id">{threadId}</div>;
      }

      render(
        <ChatSidebarProvider>
          <TestComponent />
        </ChatSidebarProvider>
      );

      const threadId = screen.getByTestId("thread-id").textContent;

      // Should reuse the existing ID
      expect(threadId).toBe(existingId);
    });

    it("newChat() generates fresh unique ID", () => {
      function TestComponent() {
        const { threadId, newChat } = useChatSidebar();
        return (
          <div>
            <div data-testid="thread-id">{threadId}</div>
            <button onClick={newChat} data-testid="new-chat-btn">
              New Chat
            </button>
          </div>
        );
      }

      const { rerender } = render(
        <ChatSidebarProvider>
          <TestComponent />
        </ChatSidebarProvider>
      );

      const initialId = screen.getByTestId("thread-id").textContent;

      // Click new chat button
      act(() => {
        screen.getByTestId("new-chat-btn").click();
      });

      // Force re-render to see the updated ID
      rerender(
        <ChatSidebarProvider>
          <TestComponent />
        </ChatSidebarProvider>
      );

      const newId = localStorage.getItem("chat_thread_id");

      // New ID should be different from initial
      expect(newId).not.toBe(initialId);
      expect(newId).not.toBe("thread-main");
      expect(newId).toMatch(/^thread-/);
    });
  });
});
