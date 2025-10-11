"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Home, MessageSquare } from "lucide-react";
import { NotFoundIllustration } from "@/components/not-found-illustration";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const QUICK_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/journey", label: "Journey" },
  { href: "/skills", label: "Skills" },
  { href: "/credentials", label: "Credentials" },
] as const;

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto w-full py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Illustration */}
          <div className="relative flex items-center justify-center">
            <NotFoundIllustration />
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge
              variant="outline"
              className="bg-brand-primary/10 border-brand-primary/20 text-brand-primary"
            >
              Oops! Route Not Found
            </Badge>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-[40px] md:text-[56px] leading-[48px] md:leading-[64px] font-bold text-text-1">
                Hmm, this page seems to be missing...
              </h1>
              <p className="text-[16px] md:text-[18px] leading-[28px] text-text-2">
                Looks like you&apos;ve ventured into uncharted territory! The page
                you&apos;re looking for doesn&apos;t exist or may have been moved.
              </p>
            </div>

            {/* Feedback Text */}
            <p className="text-[16px] leading-[24px] text-text-2">
              If you think this is an error or have feedback, I&apos;d love to hear
              from you! Feel free to reach out through the contact page.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-brand-primary hover:bg-brand-primary/90">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Feedback to Omer
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 pt-4">
              <p className="text-[14px] leading-[20px] text-text-3">
                Or explore these pages:
              </p>
              <div className="flex flex-wrap gap-3 text-[14px] leading-[20px]">
                {QUICK_LINKS.map((link, index) => (
                  <Fragment key={link.href}>
                    <Link href={link.href} className="text-brand-primary hover:underline">
                      {link.label}
                    </Link>
                    {index < QUICK_LINKS.length - 1 && <span className="text-text-3">•</span>}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
