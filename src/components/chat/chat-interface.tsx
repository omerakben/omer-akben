"use client";

import type { UIMessage } from "ai";
import { AlertCircle, Bot, Copy, RefreshCw, Send, User, X, Briefcase, Zap, FileText, ExternalLink, ArrowRight, Github, Mail } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const suggestedQuestions = [
  "Tell me about yourself.",
  "Are you primarily a Software Engineer or an SDET?",
];

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

interface ChatInterfaceProps {
  messages: UIMessage[];
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export function ChatInterface({
  messages,
  input,
  onInputChange,
  onSubmit,
  isLoading,
  error,
  onClearError,
}: ChatInterfaceProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [actionButtonsHovered, setActionButtonsHovered] = useState(false);

  // Auto-scroll to latest message with smooth animation
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSuggestedQuestion = async (question: string) => {
    // Populate input field
    const event = {
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);

    // Auto-submit after brief delay
    setTimeout(() => {
      const formEvent = new Event("submit", { bubbles: true, cancelable: true });
      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(formEvent);
      }
    }, 50);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  const handleRegenerateMessage = () => {
    toast.info("Regenerate feature coming soon");
    // TODO: Implement regenerate functionality
  };

  const handleViewProjects = () => {
    router.push("/projects");
  };

  const handleSeeSkills = () => {
    router.push("/skills");
  };

  const handleGetResume = () => {
    router.push("/recruiter");
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-shrink-0 px-6 pt-6"
          >
            <Alert variant="destructive" className="glass-message border border-destructive/30">
              <AlertCircle aria-hidden="true" className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                {onClearError && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearError}
                    className="h-6 w-6 p-0"
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-8 chat-scrollbar chat-scroll-smooth"
      >
        <div className="space-y-6">
          {/* Empty State with conditional header */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-brand-primary/20 flex items-center justify-center mb-6"
              >
                <Bot aria-hidden="true" className="w-10 h-10 text-brand-primary" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-text-1 mb-3"
              >
                Chat with Ozzy
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-text-2 text-lg max-w-2xl mb-8"
              >
                Ask me anything about Omer&apos;s experience, skills, or projects.
                I&apos;m here to help!
              </motion.p>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 mb-8 w-full max-w-md"
              >
                <div className="flex items-center gap-2 text-brand-primary justify-center">
                  <Zap aria-hidden="true" className="w-4 h-4" />
                  <h3 className="text-sm font-semibold">Quick Actions</h3>
                </div>
                <div className="flex flex-col gap-3">
                  <motion.button
                    type="button"
                    onClick={handleViewProjects}
                    className="w-full flex items-center gap-3 h-12 px-4 rounded-full bg-surf-1 border border-border-line hover:bg-surf-2 hover:border-brand-primary/50 transition-all"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase aria-hidden="true" className="w-4 h-4 text-brand-primary" />
                    </div>
                    <span className="text-text-1 font-medium">View Projects</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleSeeSkills}
                    className="w-full flex items-center gap-3 h-12 px-4 rounded-full bg-surf-1 border border-border-line hover:bg-surf-2 hover:border-brand-primary/50 transition-all"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap aria-hidden="true" className="w-4 h-4 text-brand-primary" />
                    </div>
                    <span className="text-text-1 font-medium">See Skills</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleGetResume}
                    className="w-full flex items-center gap-3 h-12 px-4 rounded-full bg-surf-1 border border-border-line hover:bg-surf-2 hover:border-brand-primary/50 transition-all"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText aria-hidden="true" className="w-4 h-4 text-brand-primary" />
                    </div>
                    <span className="text-text-1 font-medium">Get Resume</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Suggested Questions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 w-full max-w-md"
              >
                <p className="text-sm text-text-2 text-center">Or ask me:</p>
                <div className="flex flex-col gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-center px-4 py-2.5 rounded-full bg-surf-1 border border-border-line text-sm text-text-2 hover:border-brand-primary/50 hover:text-text-1 hover:bg-surf-2 transition-all font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              // Extract text from message parts
              const textContent = message.parts
                .filter((part) => part.type === "text")
                .map((part) => ("text" in part ? part.text : ""))
                .join("");

              const isLastAssistantMessage =
                message.role === "assistant" && index === messages.length - 1;
              const isUser = message.role === "user";

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                  onMouseEnter={() => setHoveredMessageId(message.id)}
                  onMouseLeave={() => {
                    // Keep buttons visible if hovering over them
                    if (!actionButtonsHovered) {
                      setHoveredMessageId(null);
                    }
                  }}
                >
                  <div
                    className={`flex gap-4 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                          <Bot aria-hidden="true" className="w-6 h-6 text-brand-primary" />
                        </div>
                      </motion.div>
                    )}

                    {/* Message Bubble */}
                    <div className="relative group max-w-[75%]">
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className={`relative rounded-2xl px-5 py-3 text-sm ${
                          isUser
                            ? "bg-brand-primary/90 text-white glass-message border border-brand-primary/30 shadow-lg"
                            : "bg-surf-1/80 border border-border-line/30 text-text-1 glass-message shadow-md"
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
                                  isUser ? "text-white" : "text-brand-primary"
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
                              <strong className="font-semibold">{children}</strong>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-lg font-bold mb-2">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-base font-bold mb-2">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-sm font-bold mb-1">{children}</h3>
                            ),
                          }}
                        >
                          {textContent}
                        </ReactMarkdown>

                        {/* Navigation Links */}
                        {!isUser && message.parts && (() => {
                          // Filter parts array for tool calls
                          const toolParts = message.parts.filter((part): part is typeof part & { type: string; result: unknown } =>
                            'type' in part && 'result' in part && part.type === "tool-provide_navigation_links"
                          );

                          if (toolParts.length === 0) return null;

                          return (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {toolParts.map((toolPart, partIndex: number) => {
                                const result = toolPart.result as { success: boolean; data?: { links: Array<{ label: string; href: string; type: "internal" | "external" }> } };
                                if (!result.success || !result.data?.links) return null;

                                return result.data.links.map((link, linkIndex) => {
                                  const Icon = getIconComponent();
                                  const isExternal = link.type === "external";

                                  return (
                                    <motion.button
                                      key={`${partIndex}-${linkIndex}`}
                                      type="button"
                                      onClick={() => {
                                        if (isExternal) {
                                          window.open(link.href, "_blank", "noopener,noreferrer");
                                        } else {
                                          router.push(link.href);
                                        }
                                      }}
                                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surf-2/80 border border-border-line/50 text-xs text-text-2 hover:border-brand-primary/50 hover:text-text-1 hover:bg-surf-1/80 transition-all font-medium"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <div className="w-4 h-4 rounded-sm bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Icon aria-hidden="true" className="w-3 h-3 text-brand-primary" />
                                      </div>
                                      <span>{link.label}</span>
                                      {isExternal && <ExternalLink aria-hidden="true" className="w-3 h-3" />}
                                    </motion.button>
                                  );
                                });
                              })}
                            </div>
                          );
                        })()}

                        {/* Message Actions */}
                        {!isUser && hoveredMessageId === message.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-2 right-2 flex gap-1"
                            onMouseEnter={() => setActionButtonsHovered(true)}
                            onMouseLeave={() => {
                              setActionButtonsHovered(false);
                              setHoveredMessageId(null);
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyMessage(textContent)}
                              className="h-7 px-2 bg-surf-2/90 glass-message border border-border-line/50 hover:bg-surf-1/90 text-text-2"
                              title="Copy message"
                            >
                              <Copy aria-hidden="true" className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRegenerateMessage}
                              className="h-7 px-2 bg-surf-2/90 glass-message border border-border-line/50 hover:bg-surf-1/90 text-text-2"
                              title="Regenerate response"
                            >
                              <RefreshCw aria-hidden="true" className="w-3.5 h-3.5" />
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <div className="w-10 h-10 rounded-full bg-surf-2 flex items-center justify-center">
                          <User aria-hidden="true" className="w-6 h-6 text-text-2" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Follow-up questions after last assistant message */}
                  {isLastAssistantMessage && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="ml-14 space-y-2"
                    >
                      <p className="text-xs text-text-3 mb-2">Suggested questions:</p>
                      {followUpQuestions.map((question, qIndex) => (
                        <motion.button
                          key={qIndex}
                          type="button"
                          onClick={() => handleSuggestedQuestion(question)}
                          className="block w-full text-left px-3 py-2 rounded-lg glass-message bg-surf-1/60 border border-border-line/40 text-xs text-text-2 hover:border-brand-primary/50 hover:text-text-1 hover:bg-surf-2/60 transition-all font-medium"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {question}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Enhanced Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-4 justify-start"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <Bot aria-hidden="true" className="w-6 h-6 text-brand-primary" />
                </div>
              </div>
              <div className="max-w-[75%] rounded-2xl px-5 py-4 bg-surf-1/80 text-text-1 glass-message border border-border-line/30 shadow-md">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full bg-brand-primary/70"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input */}
      <div className="flex-shrink-0 px-6 pb-6 pt-4">
        <form onSubmit={onSubmit} className="relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={onInputChange}
              placeholder="Ask me anything..."
              className="w-full px-5 py-4 pr-14 rounded-2xl glass-input bg-surf-1/80 border border-border-line/50 text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all shadow-lg"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-brand-primary hover:bg-brand-primary/90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <Send aria-hidden="true" className="w-4 h-4" />
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
