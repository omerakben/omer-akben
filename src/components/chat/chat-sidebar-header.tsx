"use client";

import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { Bot, Maximize2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function ChatSidebarHeader() {
  const router = useRouter();
  const { closeSidebar } = useChatSidebar();

  const handleExpand = () => {
    closeSidebar();
    router.push("/chat");
  };

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-border-line">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-accent-primary flex items-center justify-center">
        <Bot aria-hidden="true" className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-1">AI Ozzy</h2>
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
        <Maximize2 aria-hidden="true" className="h-4 w-4 text-text-2" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={closeSidebar}
          className="h-8 w-8 p-0"
          title="Close chat"
        >
        <X aria-hidden="true" className="h-4 w-4 text-text-2" />
        </Button>
      </div>
    </div>
  );
}
