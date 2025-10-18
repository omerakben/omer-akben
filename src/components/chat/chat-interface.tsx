"use client";

import type { UIMessage } from "ai";
import { AlertCircle, Bot, Send, User, X } from "lucide-react";
import { type FormEvent, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const suggestedQuestions = [
  "What problems do you solve with AI?",
  "Show me your best projects",
];

const followUpQuestions = [
  "Tell me more about your technical skills",
  "What's your recent work experience?",
];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestedQuestion = async (question: string) => {
    // Populate input field
    const event = {
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);

    // Auto-submit the form after a brief delay to ensure state update
    setTimeout(() => {
      const formEvent = new Event("submit", { bubbles: true, cancelable: true });
      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(formEvent);
      }
    }, 50);
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto h-full">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold text-text-1 mb-2">
          Chat with Ozzy
        </h1>
        <p className="text-text-2">
          Ask me anything about Omer&apos;s experience, skills, or projects
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4 flex-shrink-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            {onClearError && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearError}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Container */}
      <Card className="flex-1 overflow-y-auto p-4 mb-4 bg-surf-1 border-border-line min-h-0">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Bot className="w-16 h-16 text-brand-primary mb-4" />
              <h3 className="text-xl font-semibold text-text-1 mb-2">
                Welcome! I&apos;m Ozzy, Omer&apos;s AI assistant.
              </h3>
              <p className="text-text-2 max-w-md">
                Feel free to ask me about Omer&apos;s experience, skills, projects, or
                how to get in touch. I&apos;m here to help!
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-text-3">Or ask me:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              // Extract text from message parts (AI SDK uses parts array)
              const textContent = message.parts
                .filter((part) => part.type === "text")
                .map((part) => ("text" in part ? part.text : ""))
                .join("");

              const isLastAssistantMessage =
                message.role === "assistant" && index === messages.length - 1;

              return (
                <div key={message.id} className="space-y-2">
                  <div
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-brand-primary" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                        message.role === "user"
                          ? "bg-brand-primary text-white"
                          : "bg-surf-2 border border-border-line text-text-1"
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
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-surf-2 flex items-center justify-center">
                          <User className="w-5 h-5 text-text-2" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Follow-up questions after last assistant message */}
                  {isLastAssistantMessage && !isLoading && (
                    <div className="ml-11 space-y-2">
                      <p className="text-xs text-text-3 mb-1">Suggested questions:</p>
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
            })
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-brand-primary" />
                </div>
              </div>
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-surf-2 text-text-1">
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
      </Card>

      {/* Input Form */}
      <form onSubmit={onSubmit} className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={onInputChange}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-3 rounded-lg bg-surf-1 border border-border-line text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-brand-primary hover:bg-brand-primary/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
