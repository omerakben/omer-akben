"use client";

import { BrandLogo } from "@/components/brand-logo";
import { BrightnessControl } from "@/components/brightness-control";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { LOGO_SIZE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Compass,
  FileUser,
  GraduationCap,
  Menu,
  MessageCircle,
  MessageSquare,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const routes = [
  { href: "/journey", label: "Journey", icon: Compass },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/skills", label: "Skills", icon: Zap },
  { href: "/credentials", label: "Credentials", icon: GraduationCap },
  { href: "/recruiter", label: "Recruiters", icon: FileUser },
  { href: "/contact", label: "Contact", icon: MessageSquare },
] as const;

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { openSidebar } = useChatSidebar();

  return (
    <header className="sticky top-0 z-50 border-b border-border-line bg-surf-0/80 backdrop-blur-lg">
      <div className="container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "flex items-center justify-center hover:opacity-90 transition-opacity lg:-ml-6 xl:-ml-10",
              LOGO_SIZE.className
            )}
          >
            <BrandLogo priority />
          </Link>

          {/* Desktop navigation + controls */}
          <div className="hidden md:flex flex-1 items-center gap-4">
            <nav className="flex flex-1 items-center gap-1">
              {routes.map((route, index) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "nav-item flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                      pathname === route.href
                        ? "text-brand-primary"
                        : "text-text-2 transition-colors hover:text-text-1",
                      index === 0 && "pl-0"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 lg:-mr-2 xl:-mr-6">
              <div className="hidden lg:block">
                <BrightnessControl />
              </div>

              <Button
                size="sm"
                onClick={openSidebar}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-[#2563EB] hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                Open Chat
              </Button>
            </div>
          </div>

          {/* Mobile actions */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Open chat"
              onClick={openSidebar}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="flex flex-col gap-4 mt-8">
                  {routes.map((route) => {
                    const Icon = route.icon;
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "nav-item flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium",
                          pathname === route.href
                            ? "text-brand-primary"
                            : "text-text-2 transition-colors hover:text-text-1"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {route.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
