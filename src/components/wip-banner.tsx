"use client";

import { useWIP } from "@/lib/wip-context";
import { Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Banner, BannerDescription } from "./ui/banner";

export function WIPBanner() {
  const pathname = usePathname();
  const { isBannerDismissed, dismissBanner, isMounted } = useWIP();

  // Don't render until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return null;
  }

  // Only show on homepage (/)
  const isHomepage = pathname === "/";
  const shouldShow = isHomepage && !isBannerDismissed;

  if (!shouldShow) {
    return null;
  }

  return (
    <Banner
      variant="info"
      onDismiss={dismissBanner}
      className="flex items-center gap-3"
    >
      <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
      <BannerDescription className="flex-1">
        <span className="font-medium">Site under active development.</span> Some
        features are still being built.{" "}
        <Link
          href="/status"
          className="text-brand-primary hover:underline font-medium"
        >
          View status
        </Link>
      </BannerDescription>
    </Banner>
  );
}
