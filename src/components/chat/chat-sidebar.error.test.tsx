import * as ChatSidebarContext from "@/lib/chat-sidebar-context";
import { render, screen } from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatSidebar } from "./chat-sidebar";

const sendMessage = vi.fn();
const setMessages = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: [
      {
        id: "user-1",
        role: "user",
        parts: [{ type: "text", text: "Tell me about yourself." }],
      },
    ],
    sendMessage,
    status: "error",
    setMessages,
    error: new Error('{"error":"Failed to process chat request"}'),
  }),
}));

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  motion: {
    div: ({
      children,
      ...props
    }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("ChatSidebar failed request UI", () => {
  beforeEach(() => {
    vi.spyOn(ChatSidebarContext, "useChatSidebar").mockReturnValue({
      isOpen: true,
      isPinned: false,
      width: 420,
      threadId: "test-thread",
      openSidebar: vi.fn(),
      closeSidebar: vi.fn(),
      toggleSidebar: vi.fn(),
      setPinned: vi.fn(),
      setWidth: vi.fn(),
      newChat: vi.fn(),
      clearConversation: vi.fn(),
      setThreadId: vi.fn(),
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ messages: [] }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("shows a visible error for a JSON 500 instead of an empty chat", async () => {
    render(<ChatSidebar />);

    expect(
      await screen.findByText("Failed to process chat request")
    ).toBeInTheDocument();
    expect(screen.getByText("Tell me about yourself.")).toBeInTheDocument();
  });
});
