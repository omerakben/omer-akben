"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
  const [hasTrackedView, setHasTrackedView] = useState(false);

  const copy = useMemo(() => wipBannerCopy[variant], [variant]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const shouldShow = !isBannerDismissed && pathname !== statusHref;
    setIsVisible(shouldShow);
  }, [isBannerDismissed, isMounted, pathname, statusHref]);

  useEffect(() => {
    if (isVisible && !hasTrackedView) {
      posthog.capture("status_banner.view", {
        sha: bannerVersionKey,
        variant,
        icon,
        path: pathname,
      });
      setHasTrackedView(true);
    }

    if (!isVisible && hasTrackedView) {
      setHasTrackedView(false);
    }
  }, [bannerVersionKey, hasTrackedView, icon, isVisible, pathname, variant]);

  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleDismiss = () => {
    dismissBanner();
    posthog.capture("status_banner.dismiss", {
      sha: bannerVersionKey,
      variant,
      icon,
      path: pathname,
    });
  };

  const handleViewStatus = () => {
    dismissBanner();
    posthog.capture("status_banner.click_view_status", {
      sha: bannerVersionKey,
      variant,
      icon,
      path: pathname,
    });
  };

  if (!isMounted || !isVisible) {
    return null;
  }

  const renderIcon = () => {
    if (icon === "egg") {
      return (
        <span aria-hidden="true" className="text-lg">
          {"\uD83C\uDF73"}
        </span>
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
