"use client";

import { Briefcase, Zap, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { Button } from "@/components/ui/button";

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
    <div className="px-4 py-3 space-y-3">
      <div className="flex items-center gap-2 text-brand-primary">
        <Zap className="w-4 h-4" />
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
                <Icon className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-text-1 font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
