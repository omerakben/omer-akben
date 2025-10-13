"use client";

import { BrightnessControl } from "@/components/brightness-control";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import Image from "next/image";
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-line bg-surf-0/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center w-16 h-16 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/OA-logo.svg"
              alt="OA Logo"
              width={64}
              height={64}
              className="w-16 h-16"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "nav-item flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                    pathname === route.href
                      ? "text-brand-primary"
                      : "text-text-2 transition-colors hover:text-text-1"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {route.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Brightness Control + Open Chat + Mobile Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <BrightnessControl />
            </div>

            <Button
              size="sm"
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-brand-primary to-[#2563EB] hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Open Chat
            </Button>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
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
