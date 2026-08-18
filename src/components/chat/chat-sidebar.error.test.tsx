import * as ChatSidebarContext from "@/lib/chat-sidebar-context";
import { render, screen } from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatSidebar } from "./chat-sidebar";

const sendMessage = vi.fn();
const setMessages = vi.fn();

const chatState: {
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    parts: Array<{ type: "text"; text: string }>;
  }>;
  status: "ready" | "error" | "submitted" | "streaming";
  error: Error | undefined;
} = {
  messages: [
    {
      id: "user-1",
      role: "user",
      parts: [{ type: "text", text: "Tell me about yourself." }],
    },
  ],
  status: "error",
  error: new Error('{"error":"Failed to process chat request"}'),
};

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
    messages: chatState.messages,
    sendMessage,
    status: chatState.status,
    setMessages,
    error: chatState.error,
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
    chatState.messages = [
      {
        id: "user-1",
        role: "user",
        parts: [{ type: "text", text: "Tell me about yourself." }],
      },
    ];
    chatState.status = "error";
    chatState.error = new Error('{"error":"Failed to process chat request"}');

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
      vi.fn().mockImplementation(async () => ({
        ok: true,
        json: async () => ({ messages: chatState.messages }),
      }))
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

  it("shows a Retry error instead of a blank bubble for an empty assistant turn", async () => {
    chatState.status = "ready";
    chatState.error = undefined;
    chatState.messages = [
      {
        id: "user-tuel",
        role: "user",
        parts: [{ type: "text", text: "What is Tuel?" }],
      },
      {
        id: "assistant-empty",
        role: "assistant",
        parts: [{ type: "text", text: "" }],
      },
    ];

    render(<ChatSidebar />);

    expect(
      await screen.findByText("Ozzy did not return a reply. Please try again.")
    ).toBeInTheDocument();
    expect(await screen.findByText("What is Tuel?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(
      screen.queryByText((_, element) => {
        return (
          element?.classList.contains("chat-message") === true &&
          element.textContent?.trim() === ""
        );
      })
    ).not.toBeInTheDocument();
  });
});
