"use client";

import { AnimatedBlobContainer } from "@/components/animated-blob-container";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { posthog } from "@/lib/analytics/posthog-client";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import {
  parseChatTransportError,
  shouldClearChatError,
  silentReplyErrorMessage,
  type ChatFinishEvent,
} from "@/lib/chat/error-utils";
import {
  getMessageText,
  hasVisibleAssistantContent,
} from "@/lib/chat/message-utils";
import type { FollowupSuggestionType } from "@/lib/schemas/followup-schema";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  GripVertical,
  Loader2,
  MessageSquarePlus,
  Pin,
  PinOff,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatSidebarQuickActions } from "./chat-sidebar-quick-actions";
import { ChatSidebarWelcome } from "./chat-sidebar-welcome";

const suggestedQuestions = [
  "Tell me about yourself.",
  "Are you primarily a Software Engineer or an SDET?",
];

const PIN_HINT_STORAGE_KEY = "sidebar_pin_hint_seen_v1";

export function ChatSidebar() {
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
  const pathname = usePathname();
  const [input, setInput] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string>("");
  const [isResizing, setIsResizing] = useState(false);
  const [currentFollowups, setCurrentFollowups] = useState<
    FollowupSuggestionType[]
  >([]);
  const [lastFollowupAction, setLastFollowupAction] = useState<string | null>(
    null
  );
  const [isHydratingThread, setIsHydratingThread] = useState(true);
  const [showPinHint, setShowPinHint] = useState(false);
  const [hasSeenPinHint, setHasSeenPinHint] = useState(true);
  const [pinHintReady, setPinHintReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<UIMessage[]>([]);
  const skipHydrationRef = useRef(false);
  const followupGenerationIdRef = useRef(0); // Track current generation to prevent race conditions
  const messagesContainerRef = useRef<HTMLDivElement>(null); // Track scroll container for smart auto-scroll
  const pendingUserMessageRef = useRef("");

  const markPinHintSeen = useCallback(
    (reason: "dismiss" | "pin" = "dismiss") => {
      setHasSeenPinHint(true);
      setShowPinHint(false);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PIN_HINT_STORAGE_KEY, "true");
        } catch (error) {
          console.error(
            "[ChatSidebar] Failed to persist pin hint state:",
            error
          );
        }
      }

      posthog.capture("sidebar.pin_hint", {
        action: reason,
      });
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(PIN_HINT_STORAGE_KEY) === "true";
      setHasSeenPinHint(stored);
    } catch (error) {
      console.error("[ChatSidebar] Failed to read pin hint state:", error);
    } finally {
      setPinHintReady(true);
    }
  }, []);

  useEffect(() => {
    if (!pinHintReady) return;

    if (isPinned) {
      if (!hasSeenPinHint) {
        markPinHintSeen("pin");
      }
      return;
    }

    if (hasSeenPinHint) {
      setShowPinHint(false);
      return;
    }

    if (typeof window === "undefined") return;

    const mediaMatch = window.matchMedia
      ? window.matchMedia("(min-width: 1024px)").matches
      : window.innerWidth >= 1024;

    if (!mediaMatch) {
      setShowPinHint(false);
      return;
    }

    const timer = window.setTimeout(() => setShowPinHint(true), 1200);
    return () => window.clearTimeout(timer);
  }, [hasSeenPinHint, isPinned, pinHintReady, markPinHintSeen]);

  useEffect(() => {
    if (showPinHint) {
      posthog.capture("sidebar.pin_hint.view");
    }
  }, [showPinHint]);

  const handlePinToggle = useCallback(() => {
    const nextPinned = !isPinned;
    setPinned(nextPinned);

    posthog.capture("sidebar.pin_toggle", {
      action: nextPinned ? "pin" : "unpin",
    });

    if (nextPinned && !hasSeenPinHint) {
      markPinHintSeen("pin");
    }
  }, [hasSeenPinHint, isPinned, markPinHintSeen, setPinned]);

  const dismissPinHint = useCallback(() => {
    if (!hasSeenPinHint) {
      markPinHintSeen("dismiss");
    } else {
      setShowPinHint(false);
    }
  }, [hasSeenPinHint, markPinHintSeen]);

  const MAX_INPUT_LENGTH = 2000; // Character limit for chat input
  const shouldShowPinHint = showPinHint && !isPinned;

  const {
    messages,
    sendMessage,
    status,
    setMessages,
    error: transportError,
  } = useChat({
    id: threadId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
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
    onError: (chatError) => {
      console.error("[ChatSidebar] Chat error:", chatError);

      if (chatError.name === "AbortError") {
        setError("The request was interrupted. Please try again.");
        if (pendingUserMessageRef.current) {
          setLastFailedMessage(pendingUserMessageRef.current);
        }
        return;
      }

      setError(parseChatTransportError(chatError));
      if (pendingUserMessageRef.current) {
        setLastFailedMessage(pendingUserMessageRef.current);
      }
    },
    onFinish: (event?: ChatFinishEvent) => {
      if (!shouldClearChatError(event)) {
        if (pendingUserMessageRef.current) {
          setLastFailedMessage(pendingUserMessageRef.current);
        }
        return;
      }

      // Leave pendingUserMessageRef set until messages settle. A tool-only
      // turn appends an empty assistant message; clearing here hid the error.
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (status === "error" && transportError) {
      setError(parseChatTransportError(transportError));
      if (pendingUserMessageRef.current) {
        setLastFailedMessage(pendingUserMessageRef.current);
      }
    }
  }, [status, transportError]);

  useEffect(() => {
    if (isHydratingThread || isLoading || status !== "ready" || transportError) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return;
    }

    if (lastMessage.role === "assistant") {
      if (hasVisibleAssistantContent(lastMessage)) {
        pendingUserMessageRef.current = "";
        return;
      }

      const lastUser = [...messages]
        .reverse()
        .find((message) => message.role === "user");
      const lastUserText =
        pendingUserMessageRef.current || getMessageText(lastUser);

      setError(silentReplyErrorMessage());
      if (lastUserText) {
        setLastFailedMessage(lastUserText);
      }
      return;
    }

    if (!pendingUserMessageRef.current) {
      return;
    }

    if (lastMessage.role !== "user") {
      pendingUserMessageRef.current = "";
      return;
    }

    setError(silentReplyErrorMessage());
    setLastFailedMessage(pendingUserMessageRef.current);
  }, [isHydratingThread, isLoading, messages, status, transportError]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isHydratingThread || !input.trim()) return;

    const userMessage = input.trim();
    pendingUserMessageRef.current = userMessage;

    setInput("");
    setLastFollowupAction(null);
    setShowMessages(true);
    setError(null); // Clear previous errors
    setLastFailedMessage(userMessage);

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
    if (isHydratingThread || !lastFailedMessage.trim()) return;

    setError(null);
    setInput("");
    pendingUserMessageRef.current = lastFailedMessage;

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

  const resetConversationState = useCallback(() => {
    setMessages([]);
    messagesRef.current = [];
    setShowMessages(false);
    setCurrentFollowups([]);
    setError(null);
    setLastFailedMessage("");
    setInput("");
    pendingUserMessageRef.current = "";
  }, [setMessages, setError, setLastFailedMessage, setInput]);

  const handleSuggestedQuestion = async (question: string) => {
    if (isHydratingThread) {
      return;
    }

    if (!question.trim()) {
      console.warn("[ChatSidebar] Empty question provided");
      return;
    }

    pendingUserMessageRef.current = question;
    setShowMessages(true);
    setError(null); // Clear previous errors
    setLastFailedMessage(question);
    setLastFollowupAction(question);

    try {
      await sendMessage({
        text: question,
      });
    } catch (err) {
      console.error("[ChatSidebar] Error sending suggested question:", err);

      // Extract meaningful error message
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.";

      setError(errorMessage);
      setLastFailedMessage(question); // Save for retry
      setInput(question); // Show in input for manual retry
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
    if (isOpen && !isHydratingThread) {
      // Schedule focus after component mounts and animation starts
      // Ref check happens inside timeout to ensure textarea is rendered
      // Only focus if not hydrating to avoid focusing disabled element
      setTimeout(() => {
        if (!isHydratingThread && textareaRef.current && !textareaRef.current.disabled) {
          textareaRef.current.focus();
        }
      }, 350); // Increased to allow for spring animation (damping: 25, stiffness: 300)
    }
  }, [isOpen, isHydratingThread]);

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

  // Auto-scroll to latest message during streaming.
  // Preserve manual reading position unless the user just sent a message or the
  // assistant is actively streaming a reply.
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    const lastMessage = messages[messages.length - 1];
    const shouldForceFollow = lastMessage?.role === "user" || isLoading;

    if (!shouldForceFollow && !isNearBottom) {
      return;
    }

    const timeoutId = setTimeout(
      () => scrollToBottom(shouldForceFollow ? "auto" : "smooth"),
      100
    );
    return () => clearTimeout(timeoutId);
  }, [isLoading, messages, scrollToBottom]);

  // Keep a mutable reference of the latest messages to avoid stale closures
  useEffect(() => {
    messagesRef.current = messages;
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

    const hydrateHistory = async () => {
      if (skipHydrationRef.current) {
        skipHydrationRef.current = false;
        setIsHydratingThread(false);
        return;
      }

      if (!threadId) {
        setIsHydratingThread(false);
        return;
      }

      setIsHydratingThread(true);

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

        messagesRef.current = history;
        setMessages(history);
        setShowMessages(history.length > 0);
        setCurrentFollowups([]);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }
        console.error("[ChatSidebar] Failed to load chat history:", error);
      } finally {
        if (isMounted) {
          setIsHydratingThread(false);
        }
      }
    };

    hydrateHistory();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [threadId, setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowMessages(true);
    }
  }, [messages.length]); // Re-run when message count changes

  // Generate dynamic follow-ups after each assistant message
  useEffect(() => {
    // Increment generation ID to track this specific generation
    followupGenerationIdRef.current += 1;
    const currentGenerationId = followupGenerationIdRef.current;

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
      const userText = getMessageText(prevMessage);
      const assistantText = getMessageText(lastMessage);

      if (!userText || !assistantText) {
        setCurrentFollowups([]);
        return;
      }

      try {
        // Call API endpoint to get structured follow-ups
        const response = await fetch("/api/suggest-followups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "user", content: userText },
              { role: "assistant", content: assistantText },
            ],
            context: {
              currentPath: pathname,
              lastAction: lastFollowupAction ?? undefined,
            },
          }),
        });

        // Check if this generation is still current before updating state
        // Prevents stale responses from overwriting newer ones
        if (currentGenerationId !== followupGenerationIdRef.current) {
          console.log(
            `[ChatSidebar] Ignoring stale follow-up response (gen ${currentGenerationId} vs current ${followupGenerationIdRef.current})`
          );
          return;
        }

        if (!response.ok) {
          console.warn(
            "[ChatSidebar] Follow-up API failed, clearing suggestions"
          );
          setCurrentFollowups([]);
          return;
        }

        const data = await response.json();

        // Double-check generation ID before final state update
        if (currentGenerationId !== followupGenerationIdRef.current) {
          return;
        }

        // Extract structured follow-ups from response
        if (
          data.suggested_followups &&
          Array.isArray(data.suggested_followups)
        ) {
          setCurrentFollowups(data.suggested_followups);
        } else {
          console.warn("[ChatSidebar] Invalid follow-up response format");
          setCurrentFollowups([]);
        }
      } catch (error) {
        console.error("[ChatSidebar] Failed to generate followups:", error);
        // Only clear followups if this generation is still current
        if (currentGenerationId === followupGenerationIdRef.current) {
          setCurrentFollowups([]);
        }
      }
    };

    // Only generate when not loading
    if (!isLoading) {
      generateFollowupsAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isLoading]); // Use messages.length to prevent infinite loop

  // Memoize processed messages with pre-extracted text content
  // This ensures each message maintains its own stable content during streaming
  // and prevents the bug where previous messages get overwritten by new streaming content
  const processedMessages = useMemo(
    () =>
      messages.map((msg) => ({
        message: msg,
        textContent: getMessageText(msg),
      })),
    [messages]
  );

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
                <GripVertical
                  aria-hidden="true"
                  className="w-4 h-4 text-brand-primary"
                />
              </div>
            </div>

            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-border-line bg-surf-0">
              <div className="flex items-center gap-2">
                <AnimatedBlobContainer
                  size={20}
                  className="rounded-full"
                  disableCenterDimming={true}
                  asIcon={true}
                />
                <span className="font-semibold text-text-1">AI Ozzy</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    skipHydrationRef.current = true;
                    newChat();
                    resetConversationState();
                  }}
                  className="h-11 w-11 p-2"
                  title="New Chat"
                  aria-label="Start new chat"
                  disabled={isHydratingThread}
                >
                  <MessageSquarePlus aria-hidden="true" className="w-4 h-4" />
                </Button>
                {showMessages && messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      skipHydrationRef.current = true;
                      clearConversation();
                      resetConversationState();
                    }}
                    className="h-11 w-11 p-2"
                    title="Clear Conversation"
                    aria-label="Clear conversation"
                    disabled={isHydratingThread}
                  >
                    <Trash2 aria-hidden="true" className="w-4 h-4" />
                  </Button>
                )}
                <div className="relative">
                  <div
                    className={cn(
                      "relative",
                      shouldShowPinHint &&
                        "pin-highlight inline-flex rounded-full"
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePinToggle}
                      className="h-11 w-11 p-2"
                      title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                      aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                      aria-pressed={isPinned}
                      aria-describedby={
                        shouldShowPinHint ? "pin-sidebar-hint" : undefined
                      }
                    >
                      {isPinned ? (
                        <PinOff aria-hidden="true" className="w-4 h-4" />
                      ) : (
                        <Pin aria-hidden="true" className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {shouldShowPinHint && (
                    <div
                      id="pin-sidebar-hint"
                      role="status"
                      className="pin-tooltip absolute right-0 top-14 w-64 rounded-2xl border border-brand-primary/40 bg-surf-2 p-4 text-left shadow-xl"
                    >
                      <p className="text-sm font-semibold text-text-1">
                        Pin Ozzy to stay in view
                      </p>
                      <p className="mt-1 text-xs text-text-2">
                        Keep the Projects page scrollable while Ozzy follows
                        along.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handlePinToggle}
                          className="rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white"
                        >
                          Pin now
                        </button>
                        <button
                          type="button"
                          onClick={dismissPinHint}
                          className="rounded-full border border-border-line px-3 py-1 text-xs font-medium text-text-2 hover:border-brand-primary hover:text-brand-primary"
                        >
                          Got it
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {!isPinned && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeSidebar}
                    className="h-11 w-11 p-2"
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
                          disabled={isHydratingThread}
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
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto scrollbar-vertical-gradient chat-scroll-smooth"
            >
              {isHydratingThread ? (
                <div className="px-4 py-10 flex flex-col items-center gap-3 text-text-2">
                  <Loader2
                    aria-hidden="true"
                    className="h-6 w-6 animate-spin"
                  />
                  <p className="text-sm">Loading conversation…</p>
                </div>
              ) : showMessages ? (
                <div className="px-4 py-4 space-y-4">
                  {processedMessages.map((item, index) => {
                    const isLastAssistantMessage =
                      item.message.role === "assistant" &&
                      index === messages.length - 1;
                    const hideEmptyAssistant =
                      item.message.role === "assistant" &&
                      !hasVisibleAssistantContent(item.message);

                    if (hideEmptyAssistant) {
                      return null;
                    }

                    return (
                      <ChatMessage
                        key={item.message.id}
                        message={item.message}
                        textContent={item.textContent}
                        isLastAssistantMessage={isLastAssistantMessage}
                        isLoading={isLoading}
                        currentFollowups={currentFollowups}
                        onSuggestedQuestion={handleSuggestedQuestion}
                        closeSidebar={closeSidebar}
                      />
                    );
                  })}
                  {isLoading &&
                    !hasVisibleAssistantContent(
                      messages[messages.length - 1]
                    ) && (
                    <div className="flex gap-3 justify-start">
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                          <AnimatedBlobContainer
                            size={16}
                            className="rounded-full"
                            disableCenterDimming={true}
                            asIcon={true}
                          />
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
              ) : (
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
                          className="w-full text-left px-3 py-1.5 rounded-full bg-surf-1 border border-border-line text-sm text-text-2 hover:border-brand-primary/50 hover:text-text-1 transition-all"
                          disabled={isHydratingThread}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Input Form */}
            <div className="border-t border-border-line p-4 bg-surf-0">
              <form
                id="chat-sidebar-form"
                onSubmit={handleSubmit}
                className="space-y-2"
              >
                <label htmlFor="chat-sidebar-input" className="sr-only">
                  Message Ozzy AI Assistant
                </label>
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={textareaRef}
                    id="chat-sidebar-input"
                    name="message"
                    value={input}
                    aria-label="Message Ozzy AI Assistant"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      // Submit on Enter, new line on Shift+Enter
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(
                          e as unknown as FormEvent<HTMLFormElement>
                        );
                      }
                    }}
                    placeholder={
                      isHydratingThread
                        ? "Loading previous messages..."
                        : "Ask anything about me..."
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-surf-1 border border-border-line text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm resize-none overflow-y-auto min-h-9 max-h-[200px] scrollbar-vertical-gradient"
                    disabled={isLoading || isHydratingThread}
                    rows={1}
                    maxLength={MAX_INPUT_LENGTH}
                  />
                  <Button
                    type="submit"
                    disabled={isHydratingThread || isLoading || !input.trim()}
                    className="bg-brand-primary text-white hover:bg-brand-primary/90 h-auto px-3 py-2"
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

              {/* AI Disclaimer */}
              <div className="pt-3 px-2 text-center">
                <p className="text-xs text-text-3">
                  Ozzy is an AI assistant and can make mistakes. Please verify
                  important information.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
