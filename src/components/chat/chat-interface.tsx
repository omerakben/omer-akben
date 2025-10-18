"use client";

import type { UIMessage } from "ai";
import { AlertCircle, Bot, Send, User, X } from "lucide-react";
import { type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const handleSuggestedQuestion = (question: string) => {
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
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-text-1 mb-2">
          Chat with Ozzy
        </h1>
        <p className="text-text-2">
          Ask me anything about Omer&apos;s experience, skills, or projects
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
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
      <Card className="flex-1 overflow-y-auto p-4 mb-4 bg-surf-1 border-border-line">
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
                <p className="text-sm text-text-3">Try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion("Tell me about yourself")}
                  >
                    Tell me about yourself
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion("What are your key skills?")}
                  >
                    What are your key skills?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion("Show me your projects")}
                  >
                    Show me your projects
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              // Extract text from message parts (AI SDK uses parts array)
              const textContent = message.parts
                .filter((part) => part.type === "text")
                .map((part) => ("text" in part ? part.text : ""))
                .join("");

              return (
                <div
                  key={message.id}
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
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-brand-primary text-white"
                        : "bg-surf-2 text-text-1"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{textContent}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-surf-2 flex items-center justify-center">
                        <User className="w-5 h-5 text-text-2" />
                      </div>
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
        </div>
      </Card>

      {/* Input Form */}
      <form onSubmit={onSubmit} className="flex gap-2">
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
