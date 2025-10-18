"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { Send, Bot, User } from "lucide-react";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { ChatSidebarHeader } from "./chat-sidebar-header";
import { ChatSidebarWelcome } from "./chat-sidebar-welcome";
import { ChatSidebarQuickActions } from "./chat-sidebar-quick-actions";
import { Button } from "@/components/ui/button";

const suggestedQuestions = [
  "What problems do you solve with AI?",
  "Show me your best projects",
];

export function ChatSidebar() {
  const { isOpen, closeSidebar } = useChatSidebar();
  const [input, setInput] = useState("");
  const [showMessages, setShowMessages] = useState(false);

  const { messages, sendMessage, status } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setShowMessages(true);

    try {
      await sendMessage({
        text: userMessage,
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    setShowMessages(true);
    try {
      await sendMessage({
        text: question,
      });
    } catch (err) {
      console.error("Error sending suggested question:", err);
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
                  {messages.map((message) => {
                    const textContent = message.parts
                      .filter((part) => part.type === "text")
                      .map((part) => ("text" in part ? part.text : ""))
                      .join("");

                    return (
                      <div
                        key={message.id}
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
                          <p className="whitespace-pre-wrap">{textContent}</p>
                        </div>
                        {message.role === "user" && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-surf-2 flex items-center justify-center">
                              <User className="w-4 h-4 text-text-2" />
                            </div>
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
