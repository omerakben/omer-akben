"use client";

import { useEffect, useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { Send, Bot, User, AlertCircle, X, Briefcase, Zap, FileText, ExternalLink, ArrowRight, Github, Mail } from "lucide-react";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { ChatSidebarHeader } from "./chat-sidebar-header";
import { ChatSidebarWelcome } from "./chat-sidebar-welcome";
import { ChatSidebarQuickActions } from "./chat-sidebar-quick-actions";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";

const suggestedQuestions = [
  "What problems do you solve with AI?",
  "Show me your best projects",
];

// Follow-up questions that appear after AI responses
const followUpQuestions = [
  "Tell me more about your technical skills",
  "What's your recent work experience?",
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
  const { isOpen, closeSidebar } = useChatSidebar();
  const [input, setInput] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    onError: (error) => {
      console.error("Chat error:", error);
      setError(error.message || "Failed to send message. Please check your internet connection.");
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

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeSidebar]);

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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-surf-0 shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Chat with AI Ozzy"
          >
            {/* Header */}
            <ChatSidebarHeader />

            {/* Error Alert */}
            {error && (
              <div className="px-4 pt-4">
                <Alert variant="destructive" className="mb-2">
                  <AlertCircle className="h-4 w-4" />
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
                        <X className="h-4 w-4" />
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
                    // Debug logging
                    if (message.role === "assistant") {
                      console.log("🤖 Sidebar Assistant message:", {
                        id: message.id,
                        role: message.role,
                        parts: message.parts,
                        toolInvocations: (message as any).toolInvocations,
                      });
                    }

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
                                <Bot className="w-4 h-4 text-brand-primary" />
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
                                li: ({ children }) => <li>{children}</li>,
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
                            {message.role === "assistant" && message.parts && (() => {
                              // Filter parts array for tool calls
                              const toolParts = message.parts.filter((part: any) =>
                                part.type === "tool-provide_navigation_links" && part.result
                              );

                              if (toolParts.length === 0) return null;

                              return (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {toolParts.map((toolPart: any, partIndex: number) => {
                                    const result = toolPart.result as { success: boolean; data?: { links: Array<{ label: string; href: string; type: "internal" | "external" }> } };
                                    if (!result.success || !result.data?.links) return null;

                                    return result.data.links.map((link, linkIndex) => {
                                      const Icon = getIconComponent();
                                      const isExternal = link.type === "external";

                                      return (
                                        <button
                                          key={`${partIndex}-${linkIndex}`}
                                          type="button"
                                          onClick={() => {
                                            if (isExternal) {
                                              window.open(link.href, "_blank", "noopener,noreferrer");
                                            } else {
                                              closeSidebar();
                                              router.push(link.href);
                                            }
                                          }}
                                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surf-2 border border-border-line text-xs text-text-2 hover:border-brand-primary/50 hover:text-text-1 hover:bg-surf-1 transition-all font-medium"
                                        >
                                          <div className="w-3.5 h-3.5 rounded-sm bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-2.5 h-2.5 text-brand-primary" />
                                          </div>
                                          <span>{link.label}</span>
                                          {isExternal && <ExternalLink className="w-2.5 h-2.5" />}
                                        </button>
                                      );
                                    });
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                          {message.role === "user" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-surf-2 flex items-center justify-center">
                                <User className="w-4 h-4 text-text-2" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Follow-up questions after last assistant message */}
                        {isLastAssistantMessage && !isLoading && (
                          <div className="ml-11 space-y-2">
                            <p className="text-xs text-text-3 mb-1">
                              Suggested questions:
                            </p>
                            {followUpQuestions.map((question, qIndex) => (
                              <button
                                key={qIndex}
                                type="button"
                                onClick={() => handleSuggestedQuestion(question)}
                                className="w-full text-left px-3 py-2 rounded-lg bg-surf-1 border border-border-line text-xs text-text-2 hover:border-brand-primary/50 hover:text-text-1 hover:bg-surf-2 transition-all font-medium"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-brand-primary" />
                        </div>
                      </div>
                      <div className="bg-surf-1 border border-border-line rounded-lg px-3 py-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-text-3 animate-bounce" />
                          <span
                            className="w-2 h-2 rounded-full bg-text-3 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <span
                            className="w-2 h-2 rounded-full bg-text-3 animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
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
                className="flex gap-2"
              >
                <input
                  id="chat-sidebar-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about me..."
                  className="flex-1 px-4 py-3 rounded-lg bg-surf-1 border border-border-line text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-brand-primary hover:bg-brand-primary/90 h-auto px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
