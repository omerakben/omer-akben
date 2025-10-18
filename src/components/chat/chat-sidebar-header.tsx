"use client";

import { Bot, X, Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { Button } from "@/components/ui/button";

export function ChatSidebarHeader() {
  const router = useRouter();
  const { closeSidebar } = useChatSidebar();

  const handleExpand = () => {
    closeSidebar();
    router.push("/chat");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border-line">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-accent-primary flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-1">AI Ozzy</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-text-3">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpand}
          className="h-8 w-8 p-0"
          title="Expand to full screen"
        >
          <Maximize2 className="h-4 w-4 text-text-2" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={closeSidebar}
          className="h-8 w-8 p-0"
          title="Close chat"
        >
          <X className="h-4 w-4 text-text-2" />
        </Button>
      </div>
    </div>
  );
}
