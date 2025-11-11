"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { WIP_STATUS_ROUTE, wipBannerCopy } from "@/data/wip";
import { posthog } from "@/lib/analytics/posthog-client";
import { useWIP } from "@/lib/wip-context";

export type WipBannerVariant = "neutral" | "playful";
export type WipBannerIcon = "info" | "egg";

interface WIPBannerProps {
  variant?: WipBannerVariant;
  icon?: WipBannerIcon;
  statusHref?: string;
}

export function WIPBanner({
  variant = "neutral",
  icon = "info",
  statusHref = WIP_STATUS_ROUTE,
}: WIPBannerProps) {
  const pathname = usePathname();
  const { isBannerDismissed, dismissBanner, isMounted, bannerVersionKey } =
    useWIP();
  const [isVisible, setIsVisible] = useState(false);
  const hasTrackedViewRef = useRef(false);

  const copy = useMemo(() => wipBannerCopy[variant], [variant]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const shouldShow = !isBannerDismissed && pathname !== statusHref;
    setIsVisible(shouldShow);
  }, [isBannerDismissed, isMounted, pathname, statusHref]);

  useEffect(() => {
    if (isVisible && !hasTrackedViewRef.current) {
      posthog.capture("status_banner.view", {
        sha: bannerVersionKey,
        variant,
        icon,
        path: pathname,
      });
      hasTrackedViewRef.current = true;
    }
  }, [bannerVersionKey, icon, isVisible, pathname, variant]);

  const handleDismiss = useCallback(() => {
    dismissBanner();
    posthog.capture("status_banner.dismiss", {
      sha: bannerVersionKey,
      variant,
      icon,
      path: pathname,
    });
  }, [bannerVersionKey, dismissBanner, icon, pathname, variant]);

  const handleViewStatus = useCallback(() => {
    dismissBanner();
    posthog.capture("status_banner.click_view_status", {
      sha: bannerVersionKey,
      variant,
      icon,
      path: pathname,
    });
  }, [bannerVersionKey, dismissBanner, icon, pathname, variant]);

  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleDismiss, isVisible]);

  if (!isMounted || !isVisible) {
    return null;
  }

  const renderIcon = () => {
    if (icon === "egg") {
      // Cooking pot icon (replaces emoji per CLAUDE.md rule)
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          role="presentation"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 11h18M3 11a2 2 0 012-2h14a2 2 0 012 2M3 11v6a2 2 0 002 2h14a2 2 0 002-2v-6M8 15h8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M9 9V6a3 3 0 013-3v0a3 3 0 013 3v3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      );
    }

    return (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        role="presentation"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <line
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
          x1="12"
          x2="12"
          y1="8"
          y2="12"
        />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    );
  };

  return (
    <aside
      aria-label="Site status banner"
      aria-live="polite"
      className="sticky top-0 z-40 w-full border-b border-border-line bg-surf-1 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <div className="flex flex-1 items-center gap-3 text-sm text-text-2">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-border-line bg-surf-0 text-text-1">
            {renderIcon()}
          </div>
          <p className="flex-1 text-left leading-relaxed">
            <span className="sr-only">Site status: </span>
            <strong className="font-semibold text-text-1">
              {copy.prefix}
            </strong>{" "}
            <span className="text-text-2">{copy.main} </span>
            <Link
              className="inline-flex items-center rounded-full border border-brand-primary px-4 py-1.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              href={statusHref}
              onClick={handleViewStatus}
            >
              View status
            </Link>
          </p>
        </div>
        <button
          aria-label="Dismiss site status banner"
          className="grid h-10 w-10 place-items-center rounded-full border border-transparent text-text-2 transition-colors hover:border-border-line hover:bg-surf-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          onClick={handleDismiss}
          type="button"
        >
          <span aria-hidden="true">{"\u00D7"}</span>
        </button>
      </div>
    </aside>
  );
}
