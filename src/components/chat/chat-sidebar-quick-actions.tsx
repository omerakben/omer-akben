"use client";

import { Briefcase, Zap, FileText, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { Button } from "@/components/ui/button";
import { EmailActionButton } from "@/components/actions/EmailActionButton";
import { ResumeDownloadButton } from "@/components/actions/ResumeDownloadButton";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  href: string;
}

const quickActions: QuickAction[] = [
  { icon: Briefcase, label: "View Projects", href: "/projects" },
  { icon: Zap, label: "See Skills", href: "/skills" },
  { icon: FileText, label: "Get Resume", href: "/recruiter" },
];

export function ChatSidebarQuickActions() {
  const router = useRouter();
  const { closeSidebar } = useChatSidebar();

  const handleAction = (href: string) => {
    closeSidebar();
    router.push(href);
  };

  return (
    <div className="px-4 py-3 space-y-6">
      {/* Navigation Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-brand-primary">
          <Zap aria-hidden="true" className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Quick Actions</h3>
        </div>
        <div className="space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-surf-1 border-border-line hover:bg-surf-2 hover:border-brand-primary/50 transition-all"
                onClick={() => handleAction(action.href)}
              >
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Icon aria-hidden="true" className="w-4 h-4 text-brand-primary" />
                </div>
                <span className="text-text-1 font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Direct Contact Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-brand-primary">
          <Mail aria-hidden="true" className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Get in Touch</h3>
        </div>
        <div className="flex gap-2">
          <EmailActionButton
            variant="outline"
            size="default"
            className="flex-1"
          />
          <ResumeDownloadButton
            variant="outline"
            size="default"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
