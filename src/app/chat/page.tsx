"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { messages, sendMessage, status } = useChat({
    onError: (error) => {
      console.error("Chat error:", error);
      setError(error.message || "Failed to send message. Please try again.");
    },
    onFinish: () => {
      // Clear any previous errors on successful completion
      setError(null);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setError(null); // Clear errors before sending

    try {
      await sendMessage({ text: userMessage });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div
      className="h-[calc(100vh-4rem)] w-full"
      style={{
        background: `linear-gradient(to bottom, var(--chat-gradient-from), var(--chat-gradient-to))`,
      }}
    >
      <ChatInterface
        messages={messages}
        input={input}
        onInputChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={status === "streaming"}
        error={error}
        onClearError={() => setError(null)}
      />
    </div>
  );
}
