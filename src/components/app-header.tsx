"use client";

import { AnimatedBlobContainer } from "@/components/animated-blob-container";
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
  Download,
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
    <header className="sticky top-0 z-50 border-b-2 border-border-line bg-surf-0/95 backdrop-blur-lg">
      <div className="container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center gap-3">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "flex items-center justify-center hover:opacity-90 transition-opacity",
              LOGO_SIZE.className
            )}
            aria-label="Home"
          >
            <AnimatedBlobContainer
              size={64}
              disableCenterDimming={true}
              className="rounded-full"
              asIcon={true}
            />
          </Link>

          <span className="hidden xl:inline-block bg-synth-volt px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-synth-volt-fg">
            OMER.AKBEN
          </span>

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
                      "nav-item flex items-center gap-2 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide",
                      pathname === route.href
                        ? "text-brand-primary"
                        : "text-text-2 transition-colors hover:text-text-1",
                      index === 0 && "pl-0"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
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
                className="flex items-center gap-2 rounded-none border-2 border-border-line bg-synth-volt font-mono text-xs font-bold uppercase text-synth-volt-fg hover:opacity-90"
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
              className="h-11 w-11 p-0"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Open menu"
                  className="h-11 w-11 p-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-[min(100vw,360px)] flex-col gap-6 border-l-2 border-border-line bg-surf-0"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="font-mono text-xs font-bold text-synth-red">
                  {"// NAVIGATE"}
                </div>
                <nav className="flex flex-col border-2 border-border-line">
                  {routes.map((route) => {
                    const Icon = route.icon;
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "nav-item flex min-h-12 items-center gap-3 border-b-2 border-border-line px-4 font-mono text-sm font-bold uppercase tracking-wide last:border-b-0",
                          pathname === route.href
                            ? "bg-synth-volt text-synth-volt-fg"
                            : "bg-surf-1 text-text-1 transition-colors hover:bg-surf-2"
                        )}
                        aria-current={
                          pathname === route.href ? "page" : undefined
                        }
                      >
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        {route.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="flex flex-col gap-2.5">
                  <Button
                    size="lg"
                    className="h-12 w-full"
                    onClick={() => {
                      setOpen(false);
                      openSidebar();
                    }}
                  >
                    <MessageCircle aria-hidden="true" className="h-4 w-4" />
                    Ask AI Ozzy
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 w-full"
                  >
                    <a
                      href="/assets/Omer_Akben_Resume.pdf"
                      download="Omer_Akben_Resume.pdf"
                    >
                      <Download aria-hidden="true" className="h-4 w-4" />
                      Resume.PDF
                    </a>
                  </Button>
                </div>

                <div className="mt-auto space-y-2">
                  <div className="font-mono text-xs font-bold text-text-2">
                    LUMINOSITY
                  </div>
                  <BrightnessControl />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
