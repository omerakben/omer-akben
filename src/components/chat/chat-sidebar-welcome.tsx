"use client";

import { Bot, Sparkles } from "lucide-react";

export function ChatSidebarWelcome() {
  return (
    <div className="px-4 py-6">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
            <Bot aria-hidden="true" className="w-5 h-5 text-brand-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-surf-1 rounded-lg px-4 py-3 border border-border-line">
            <p className="text-text-1 leading-relaxed">
              <Sparkles aria-hidden="true" className="inline w-4 h-4 text-brand-primary mr-1" />
              Hello! I&apos;m AI Ozzy (Omer&apos;s AI Twin). Ask me for project
              walkthroughs, stack details, contact details, or a resume
              download.
            </p>
          </div>
          <span className="text-xs text-text-3 mt-2 block">Just now</span>
        </div>
      </div>
    </div>
  );
}
