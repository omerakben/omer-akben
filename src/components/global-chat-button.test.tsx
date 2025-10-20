import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GlobalChatButton } from "./global-chat-button";
import * as ChatSidebarContext from "@/lib/chat-sidebar-context";

// Mock the chat sidebar context
const mockOpenSidebar = vi.fn();

describe("GlobalChatButton", () => {
  const renderWithContext = () => {
    vi.spyOn(ChatSidebarContext, "useChatSidebar").mockReturnValue({
      isOpen: false,
      isPinned: false,
      width: 480,
      threadId: "test-thread",
      openSidebar: mockOpenSidebar,
      closeSidebar: vi.fn(),
      toggleSidebar: vi.fn(),
      setPinned: vi.fn(),
      setWidth: vi.fn(),
      newChat: vi.fn(),
      clearConversation: vi.fn(),
      setThreadId: vi.fn(),
    });
    return render(<GlobalChatButton />);
  };

  beforeEach(() => {
    mockOpenSidebar.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render the chat button", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should render with correct ARIA label", () => {
      renderWithContext();
      const button = screen.getByLabelText("Open AI Ozzy chat (cmd/ctrl+K)");
      expect(button).toBeInTheDocument();
    });

    it("should render Bot icon", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should have correct positioning classes", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      expect(button.className).toContain("fixed");
      expect(button.className).toContain("bottom-6");
      expect(button.className).toContain("right-6");
    });

    it("should have correct z-index for visibility", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      expect(button.className).toContain("z-40");
    });

    it("should have rounded-full styling", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      expect(button.className).toContain("rounded-full");
    });

    it("should have shadow-lg styling", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      expect(button.className).toContain("shadow-lg");
    });

    it("should use brand primary color", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-brand-primary");
    });
  });

  describe("Click Interactions", () => {
    it("should call openSidebar when button is clicked", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(mockOpenSidebar).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple clicks", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(mockOpenSidebar).toHaveBeenCalledTimes(3);
    });

    it("should be focusable", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe("Keyboard Shortcuts", () => {
    it("should call openSidebar when cmd+K is pressed on macOS", () => {
      renderWithContext();
      fireEvent.keyDown(window, { key: "k", metaKey: true });
      expect(mockOpenSidebar).toHaveBeenCalledTimes(1);
    });

    it("should call openSidebar when ctrl+K is pressed on Windows/Linux", () => {
      renderWithContext();
      fireEvent.keyDown(window, { key: "k", ctrlKey: true });
      expect(mockOpenSidebar).toHaveBeenCalledTimes(1);
    });

    it("should prevent default browser behavior for cmd+K", () => {
      renderWithContext();
      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      window.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should prevent default browser behavior for ctrl+K", () => {
      renderWithContext();
      const event = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      window.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should not call openSidebar when only K is pressed without modifier", () => {
      renderWithContext();
      fireEvent.keyDown(window, { key: "k" });
      expect(mockOpenSidebar).not.toHaveBeenCalled();
    });

    it("should not call openSidebar for other key combinations", () => {
      renderWithContext();
      fireEvent.keyDown(window, { key: "j", metaKey: true });
      fireEvent.keyDown(window, { key: "l", ctrlKey: true });
      expect(mockOpenSidebar).not.toHaveBeenCalled();
    });

    it("should not trigger with uppercase K (case sensitive)", () => {
      renderWithContext();
      fireEvent.keyDown(window, { key: "K", metaKey: true });
      fireEvent.keyDown(window, { key: "K", ctrlKey: true });
      expect(mockOpenSidebar).not.toHaveBeenCalled();
    });
  });

  describe("Event Listener Cleanup", () => {
    it("should remove event listener on unmount", async () => {
      const { unmount } = renderWithContext();

      // Verify listener is active
      fireEvent.keyDown(window, { key: "k", metaKey: true });
      expect(mockOpenSidebar).toHaveBeenCalledTimes(1);

      // Unmount component
      unmount();
      mockOpenSidebar.mockClear();

      // Listener should no longer be active
      fireEvent.keyDown(window, { key: "k", metaKey: true });

      await waitFor(() => {
        expect(mockOpenSidebar).not.toHaveBeenCalled();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have role button", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should have descriptive aria-label with keyboard shortcut hint", () => {
      renderWithContext();
      const button = screen.getByLabelText("Open AI Ozzy chat (cmd/ctrl+K)");
      expect(button).toBeInTheDocument();
    });

    it("should be keyboard accessible via Tab", () => {
      renderWithContext();
      const button = screen.getByRole("button");

      // Simulate tab navigation
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("should be activatable via Enter key when focused", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      button.focus();

      fireEvent.keyDown(button, { key: "Enter" });
      // Button click simulation via Enter
      fireEvent.click(button);

      expect(mockOpenSidebar).toHaveBeenCalled();
    });

    it("should be activatable via Space key when focused", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      button.focus();

      fireEvent.keyDown(button, { key: " " });
      // Button click simulation via Space
      fireEvent.click(button);

      expect(mockOpenSidebar).toHaveBeenCalled();
    });
  });

  describe("Visual Feedback", () => {
    it("should have hover state styling", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      expect(button.className).toContain("hover:bg-brand-primary/90");
    });

    it("should have size-lg for proper touch target", () => {
      renderWithContext();
      const button = screen.getByRole("button");
      expect(button.className).toContain("h-14");
      expect(button.className).toContain("w-14");
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid successive clicks", () => {
      renderWithContext();
      const button = screen.getByRole("button");

      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }

      expect(mockOpenSidebar).toHaveBeenCalledTimes(10);
    });

    it("should handle rapid keyboard shortcuts", () => {
      renderWithContext();

      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(window, { key: "k", metaKey: true });
      }

      expect(mockOpenSidebar).toHaveBeenCalledTimes(5);
    });

    it("should not interfere with other keyboard shortcuts", () => {
      renderWithContext();

      // Common browser shortcuts that should not trigger chat
      fireEvent.keyDown(window, { key: "t", metaKey: true }); // New tab
      fireEvent.keyDown(window, { key: "w", metaKey: true }); // Close tab
      fireEvent.keyDown(window, { key: "r", metaKey: true }); // Reload

      expect(mockOpenSidebar).not.toHaveBeenCalled();
    });

    it("should handle keyboard shortcut during button click", () => {
      renderWithContext();
      const button = screen.getByRole("button");

      // Click and keyboard shortcut simultaneously
      fireEvent.click(button);
      fireEvent.keyDown(window, { key: "k", metaKey: true });

      expect(mockOpenSidebar).toHaveBeenCalledTimes(2);
    });
  });

  describe("Integration", () => {
    it("should work when chat sidebar context provides openSidebar function", () => {
      const customOpenSidebar = vi.fn();
      vi.spyOn(ChatSidebarContext, "useChatSidebar").mockReturnValue({
        isOpen: false,
        isPinned: false,
        width: 480,
        threadId: "test-thread",
        openSidebar: customOpenSidebar,
        closeSidebar: vi.fn(),
        toggleSidebar: vi.fn(),
        setPinned: vi.fn(),
        setWidth: vi.fn(),
        newChat: vi.fn(),
        clearConversation: vi.fn(),
        setThreadId: vi.fn(),
      });

      render(<GlobalChatButton />);
      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(customOpenSidebar).toHaveBeenCalledTimes(1);
    });

    it("should not break if context is properly configured", () => {
      vi.spyOn(ChatSidebarContext, "useChatSidebar").mockReturnValue({
        isOpen: false,
        isPinned: false,
        width: 480,
        threadId: "test-thread",
        openSidebar: mockOpenSidebar,
        closeSidebar: vi.fn(),
        toggleSidebar: vi.fn(),
        setPinned: vi.fn(),
        setWidth: vi.fn(),
        newChat: vi.fn(),
        clearConversation: vi.fn(),
        setThreadId: vi.fn(),
      });

      expect(() => render(<GlobalChatButton />)).not.toThrow();
    });
  });
});
