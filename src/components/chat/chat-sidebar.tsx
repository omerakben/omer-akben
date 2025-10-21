"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { getFollowups } from "@/lib/followups";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Briefcase,
  ExternalLink,
  FileText,
  Github,
  GripVertical,
  Mail,
  MessageSquarePlus,
  Pin,
  PinOff,
  Send,
  Trash2,
  User,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatSidebarQuickActions } from "./chat-sidebar-quick-actions";
import { ChatSidebarWelcome } from "./chat-sidebar-welcome";
import { FollowupChips } from "./FollowupChips";

const suggestedQuestions = [
  "Tell me about yourself.",
  "Are you primarily a Software Engineer or an SDET?",
];

// Icon mapping for navigation links
const getIconComponent = (iconName?: string) => {
  const iconMap: Record<string, React.ElementType> = {
    briefcase: Briefcase,
    github: Github,
    "external-link": ExternalLink,
    "arrow-right": ArrowRight,
    "file-text": FileText,
    zap: Zap,
    mail: Mail,
  };
  return iconMap[iconName || "arrow-right"] || ArrowRight;
};

export function ChatSidebar() {
  const router = useRouter();
  const {
    isOpen,
    isPinned,
    width,
    threadId,
    closeSidebar,
    setPinned,
    setWidth,
    newChat,
    clearConversation,
  } = useChatSidebar();
  const [input, setInput] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string>("");
  const [isResizing, setIsResizing] = useState(false);
  const [currentFollowups, setCurrentFollowups] = useState<string[]>([]);
  const [recentlyShownFollowups, setRecentlyShownFollowups] = useState<
    string[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_INPUT_LENGTH = 2000; // Character limit for chat input

  const { messages, sendMessage, status, setMessages } = useChat({
    id: threadId,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ id, messages: outgoingMessages }) => {
        const lastMessage = outgoingMessages[outgoingMessages.length - 1];

        if (!lastMessage) {
          throw new Error("No message to send");
        }

        return {
          body: {
            chatId: id,
            message: lastMessage,
          },
        };
      },
    }),
    onError: (error) => {
      console.error("Chat error:", error);
      setError(
        error.message ||
          "Failed to send message. Please check your internet connection."
      );
    },
    onFinish: () => {
      setError(null); // Clear errors on success
      setLastFailedMessage(""); // Clear failed message on success
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setShowMessages(true);
    setError(null); // Clear previous errors

    try {
      await sendMessage({
        text: userMessage,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
      setLastFailedMessage(userMessage); // Save message for retry
      setInput(userMessage); // Restore input for user to retry
    }
  };

  const handleRetry = async () => {
    if (!lastFailedMessage.trim()) return;

    setError(null);
    setInput("");

    try {
      await sendMessage({
        text: lastFailedMessage,
      });
    } catch (err) {
      console.error("Error retrying message:", err);
      setError("Failed to send message. Please try again.");
      setInput(lastFailedMessage); // Restore input again
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    setShowMessages(true);
    setError(null); // Clear previous errors
    try {
      await sendMessage({
        text: question,
      });
    } catch (err) {
      console.error("Error sending suggested question:", err);
      setError("Failed to send message. Please try again.");
      setLastFailedMessage(question); // Save for retry
      setInput(question); // Show in input
    }
  };

  // Handle ESC key to close (only when unpinned)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isPinned) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isPinned, closeSidebar]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen) {
      const input = document.querySelector(
        "#chat-sidebar-input"
      ) as HTMLInputElement;
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
    }
  }, [isOpen]);

  // Auto-resize textarea based on content (safe implementation)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = "auto";
    // Set height to content or max 200px
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [input]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle resize drag
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setWidth]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/chat?chatId=${threadId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load chat history (${response.status})`);
        }

        const data: { messages?: UIMessage[] } = await response.json();
        if (!isMounted) {
          return;
        }

        const history = data.messages ?? [];
        setMessages(history);
        setShowMessages(history.length > 0);
        setCurrentFollowups([]);
        setRecentlyShownFollowups([]);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }
        console.error("[ChatSidebar] Failed to load chat history:", error);
      }
    };

    setMessages([]);
    setShowMessages(false);
    setCurrentFollowups([]);
    setRecentlyShownFollowups([]);
    fetchHistory();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [threadId, setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowMessages(true);
    }
  }, [messages]);

  // Generate dynamic follow-ups after each assistant message
  useEffect(() => {
    const generateFollowupsAsync = async () => {
      if (messages.length < 2) {
        setCurrentFollowups([]);
        return;
      }

      // Get last user and assistant messages
      const lastMessage = messages[messages.length - 1];
      const prevMessage = messages[messages.length - 2];

      // Only generate if last message is from assistant
      if (lastMessage.role !== "assistant") {
        setCurrentFollowups([]);
        return;
      }

      // Extract text content from messages
      const userText = prevMessage.parts
        .filter((part) => part.type === "text")
        .map((part) => ("text" in part ? part.text : ""))
        .join("");

      const assistantText = lastMessage.parts
        .filter((part) => part.type === "text")
        .map((part) => ("text" in part ? part.text : ""))
        .join("");

      if (!userText || !assistantText) {
        setCurrentFollowups([]);
        return;
      }

      try {
        const followups = await getFollowups(
          userText,
          assistantText,
          recentlyShownFollowups
        );
        setCurrentFollowups(followups);

        // Track these as recently shown
        setRecentlyShownFollowups((prev) => [...prev, ...followups].slice(-10)); // Keep last 10
      } catch (error) {
        console.error("[ChatSidebar] Failed to generate followups:", error);
        setCurrentFollowups([]);
      }
    };

    // Only generate when not loading
    if (!isLoading) {
      generateFollowupsAsync();
    }

    // Note: recentlyShownFollowups intentionally omitted from deps
    // It's updated within this effect via setRecentlyShownFollowups((prev) => ...)
    // and its current value is only needed for deduplication logic in getFollowups.
    // Including it would cause infinite re-renders since we modify it on every run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - only show when unpinned */}
          {!isPinned && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeSidebar}
            />
          )}

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ width: `${width}px` }}
            className="fixed top-0 right-0 h-full max-w-full bg-surf-0 shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-modal={!isPinned}
            aria-label="Chat with AI Ozzy"
          >
            {/* Resize Handle */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize transition-colors group ${
                isPinned ? "bg-brand-primary/50" : "hover:bg-brand-primary/50"
              }`}
              onMouseDown={() => setIsResizing(true)}
              aria-label="Resize sidebar"
            >
              <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity ${
                  isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <GripVertical aria-hidden="true" className="w-4 h-4 text-brand-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-border-line bg-surf-0">
              <div className="flex items-center gap-2">
                <Bot aria-hidden="true" className="w-5 h-5 text-brand-primary" />
                <span className="font-semibold text-text-1">AI Ozzy</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    newChat();
                    setMessages([]);
                    setShowMessages(false);
                    setCurrentFollowups([]);
                    setRecentlyShownFollowups([]);
                  }}
                  className="h-8 w-8 p-0"
                  title="New Chat"
                  aria-label="Start new chat"
                >
                  <MessageSquarePlus aria-hidden="true" className="w-4 h-4" />
                </Button>
                {showMessages && messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearConversation();
                      setMessages([]);
                      setShowMessages(false);
                      setCurrentFollowups([]);
                      setRecentlyShownFollowups([]);
                    }}
                    className="h-8 w-8 p-0"
                    title="Clear Conversation"
                    aria-label="Clear conversation"
                  >
                    <Trash2 aria-hidden="true" className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPinned(!isPinned)}
                  className="h-8 w-8 p-0"
                  title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                  aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                  aria-pressed={isPinned}
                >
                  {isPinned ? (
                    <PinOff aria-hidden="true" className="w-4 h-4" />
                  ) : (
                    <Pin aria-hidden="true" className="w-4 h-4" />
                  )}
                </Button>
                {!isPinned && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeSidebar}
                    className="h-8 w-8 p-0"
                    aria-label="Close sidebar"
                  >
                    <X aria-hidden="true" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="px-4 pt-4">
                <Alert variant="destructive" className="mb-2">
                  <AlertCircle aria-hidden="true" className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between gap-2">
                    <span className="flex-1">{error}</span>
                    <div className="flex items-center gap-1">
                      {lastFailedMessage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetry}
                          className="h-7 px-2 text-xs"
                        >
                          Retry
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setError(null)}
                        className="h-7 w-7 p-0"
                      >
                        <X aria-hidden="true" className="h-4 w-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {!showMessages ? (
                <>
                  {/* Welcome Message */}
                  <ChatSidebarWelcome />

                  {/* Quick Actions */}
                  <ChatSidebarQuickActions />

                  {/* Suggested Questions */}
                  <div className="px-4 py-3 space-y-3">
                    <p className="text-sm text-text-2">Or ask me:</p>
                    <div className="space-y-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestedQuestion(question)}
                          className="w-full text-left px-4 py-2 rounded-lg bg-surf-1 border border-border-line text-sm text-text-2 hover:border-brand-primary/50 hover:text-text-1 transition-all"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-4 py-4 space-y-4">
                  {messages.map((message, index) => {
                    const textContent = message.parts
                      .filter((part) => part.type === "text")
                      .map((part) => ("text" in part ? part.text : ""))
                      .join("");

                    const isLastAssistantMessage =
                      message.role === "assistant" &&
                      index === messages.length - 1;

                    return (
                      <div key={message.id} className="space-y-2">
                        <div
                          className={`flex gap-3 ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                                <Bot aria-hidden="true" className="w-4 h-4 text-brand-primary" />
                              </div>
                            </div>
                          )}
                          <div
                            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                              message.role === "user"
                                ? "bg-brand-primary text-white"
                                : "bg-surf-1 border border-border-line text-text-1"
                            }`}
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`underline hover:no-underline ${
                                      message.role === "user"
                                        ? "text-white"
                                        : "text-brand-primary"
                                    }`}
                                  >
                                    {children}
                                  </a>
                                ),
                                p: ({ children }) => (
                                  <p className="mb-2 last:mb-0">{children}</p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc ml-4 mb-2 space-y-1">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal ml-4 mb-2 space-y-1">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="ml-0">{children}</li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold">
                                    {children}
                                  </strong>
                                ),
                                h1: ({ children }) => (
                                  <h1 className="text-lg font-bold mb-2">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-base font-bold mb-2">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-sm font-bold mb-1">
                                    {children}
                                  </h3>
                                ),
                              }}
                            >
                              {textContent}
                            </ReactMarkdown>

                            {/* Navigation Links */}
                            {message.role === "assistant" &&
                              message.parts &&
                              (() => {
                                // Filter parts array for tool calls
                                const toolParts = message.parts.filter(
                                  (
                                    part
                                  ): part is typeof part & {
                                    type: string;
                                    result: unknown;
                                  } =>
                                    "type" in part &&
                                    "result" in part &&
                                    part.type ===
                                      "tool-provide_navigation_links"
                                );

                                if (toolParts.length === 0) return null;

                                return (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {toolParts.map(
                                      (toolPart, partIndex: number) => {
                                        const result = toolPart.result as {
                                          success: boolean;
                                          data?: {
                                            links: Array<{
                                              label: string;
                                              href: string;
                                              type: "internal" | "external";
                                            }>;
                                          };
                                        };
                                        if (
                                          !result.success ||
                                          !result.data?.links
                                        )
                                          return null;

                                        return result.data.links.map(
                                          (link, linkIndex) => {
                                            const Icon = getIconComponent();
                                            const isExternal =
                                              link.type === "external";

                                            return (
                                              <button
                                                key={`${partIndex}-${linkIndex}`}
                                                type="button"
                                                onClick={() => {
                                                  if (isExternal) {
                                                    window.open(
                                                      link.href,
                                                      "_blank",
                                                      "noopener,noreferrer"
                                                    );
                                                  } else {
                                                    closeSidebar();
                                                    router.push(link.href);
                                                  }
                                                }}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surf-2 border border-border-line text-xs text-text-2 hover:border-brand-primary/50 hover:text-text-1 hover:bg-surf-1 transition-all font-medium"
                                              >
                                                <div className="w-3.5 h-3.5 rounded-sm bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                                                  <Icon aria-hidden="true" className="w-2.5 h-2.5 text-brand-primary" />
                                                </div>
                                                <span>{link.label}</span>
                                                {isExternal && (
                                                  <ExternalLink aria-hidden="true" className="w-2.5 h-2.5" />
                                                )}
                                              </button>
                                            );
                                          }
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              })()}
                          </div>
                          {message.role === "user" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-surf-2 flex items-center justify-center">
                                <User aria-hidden="true" className="w-4 h-4 text-text-2" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Dynamic follow-up questions after last assistant message */}
                        {isLastAssistantMessage &&
                          !isLoading &&
                          currentFollowups.length > 0 && (
                            <div className="ml-11 mt-3">
                              <FollowupChips
                                followups={currentFollowups}
                                onSend={handleSuggestedQuestion}
                              />
                            </div>
                          )}
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                          <Bot aria-hidden="true" className="w-4 h-4 text-brand-primary" />
                        </div>
                      </div>
                      <div className="bg-surf-1 border border-border-line rounded-lg px-3 py-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-text-3 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-text-3 animate-bounce animate-delay-200" />
                          <span className="w-2 h-2 rounded-full bg-text-3 animate-bounce animate-delay-400" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="border-t border-border-line p-4 bg-surf-0">
              <form
                id="chat-sidebar-form"
                onSubmit={handleSubmit}
                className="space-y-2"
              >
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={textareaRef}
                    id="chat-sidebar-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      // Submit on Enter, new line on Shift+Enter
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                      }
                    }}
                    placeholder="Ask anything about me..."
                    className="flex-1 px-4 py-3 rounded-lg bg-surf-1 border border-border-line text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm resize-none overflow-y-auto min-h-[44px] max-h-[200px] chat-input-scrollbar"
                    disabled={isLoading}
                    rows={1}
                    maxLength={MAX_INPUT_LENGTH}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-brand-primary hover:bg-brand-primary/90 h-auto px-4 py-3"
                  >
                    <Send aria-hidden="true" className="w-4 h-4" />
                  </Button>
                </div>
                {/* Character counter */}
                {input.length > MAX_INPUT_LENGTH * 0.8 && (
                  <div className="flex justify-end">
                    <span
                      className={`text-xs ${
                        input.length >= MAX_INPUT_LENGTH
                          ? "text-destructive"
                          : "text-text-3"
                      }`}
                    >
                      {input.length} / {MAX_INPUT_LENGTH}
                    </span>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
