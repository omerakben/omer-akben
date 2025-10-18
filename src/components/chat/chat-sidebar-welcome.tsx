"use client";

import { Bot } from "lucide-react";

export function ChatSidebarWelcome() {
  return (
    <div className="px-4 py-6">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-surf-1 rounded-lg px-4 py-3 border border-border-line">
            <p className="text-text-1 leading-relaxed">
              👋 Hi! I&apos;m AI Ozzy (Omer&apos;s clone), personal guide to my portfolio.
              I know everything about my experience, projects, and skills. What
              would you like to explore?
            </p>
          </div>
          <span className="text-xs text-text-3 mt-2 block">Just now</span>
        </div>
      </div>
    </div>
  );
}
