"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import StatusPill from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { BUILD_DATE, BUILD_ID, SHORT_BUILD_ID } from "@/lib/build";
import { cn } from "@/lib/utils";
import { Loader2, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const bannerDismissKey = (buildId: string) => `ozzy_banner_dismissed_${buildId}`;
const whatsNewKey = (buildId: string) => `ozzy_whats_new_${buildId}`;

type CachePreference = "performance" | "fresh";

interface SiteStatusProps {
  initialCachePref: CachePreference;
  acknowledgedBuildId: string | null;
}

const performanceDescription =
  "Caching via CDN (faster, may serve slightly older data).";
const freshDescription = "Always fetches the latest data (slower).";

export default function SiteStatus({
  initialCachePref,
  acknowledgedBuildId,
}: SiteStatusProps) {
  const [cachePref, setCachePref] = useState<CachePreference>(initialCachePref);
  const [hasAcknowledged, setHasAcknowledged] = useState(
    acknowledgedBuildId === BUILD_ID
  );
  const [isModalOpen, setIsModalOpen] = useState(!hasAcknowledged);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isUpdatingPref, setIsUpdatingPref] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  const preferenceLabel = useMemo(
    () => (cachePref === "performance" ? "Performance" : "Always fresh"),
    [cachePref]
  );
  const preferenceDescription =
    cachePref === "performance" ? performanceDescription : freshDescription;

  useEffect(() => {
    setCachePref(initialCachePref);
  }, [initialCachePref]);

  useEffect(() => {
    setHasAcknowledged(acknowledgedBuildId === BUILD_ID);
  }, [acknowledgedBuildId]);

  useEffect(() => {
    setIsModalOpen(!hasAcknowledged);
  }, [hasAcknowledged]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const key = bannerDismissKey(BUILD_ID);
    const dismissed = window.localStorage.getItem(key);
    setIsBannerVisible(dismissed !== "true");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const updateOffset = () => {
      const height =
        isBannerVisible && bannerRef.current
          ? bannerRef.current.getBoundingClientRect().height
          : 0;
      document.documentElement.style.setProperty(
        "--site-status-offset",
        `${height}px`
      );
    };

    updateOffset();

    if (typeof ResizeObserver === "undefined" || !bannerRef.current) {
      return () => {
        document.documentElement.style.setProperty("--site-status-offset", "0px");
      };
    }

    const observer = new ResizeObserver(updateOffset);
    observer.observe(bannerRef.current);

    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty("--site-status-offset", "0px");
    };
  }, [isBannerVisible]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (isModalOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }

    return undefined;
  }, [isModalOpen]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasAcknowledged) {
      return;
    }
    const key = whatsNewKey(BUILD_ID);
    if (window.localStorage.getItem(key) === "true") {
      return;
    }
    toast(
      "What\u2019s new",
      {
        description: `Build ${SHORT_BUILD_ID} deployed on ${BUILD_DATE}`,
      }
    );
    window.localStorage.setItem(key, "true");
  }, [hasAcknowledged]);

  const handleDismissBanner = useCallback(() => {
    setIsBannerVisible(false);
    if (typeof window === "undefined") {
      return;
    }
    const key = bannerDismissKey(BUILD_ID);
    try {
      window.localStorage.setItem(key, "true");
    } catch (error) {
      console.error("Failed to persist banner dismissal", error);
    }
  }, []);

  const updatePreference = useCallback(
    async (next: CachePreference) => {
      if (next === cachePref) {
        return;
      }
      setIsUpdatingPref(true);
      try {
        const response = await fetch("/api/preferences/cache", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          credentials: "include",
          body: JSON.stringify({ mode: next }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update preference (${response.status})`);
        }

        setCachePref(next);
        window.location.reload();
      } catch (error) {
        console.error(error);
        toast.error("Could not update cache preference. Please try again.");
      } finally {
        setIsUpdatingPref(false);
      }
    },
    [cachePref]
  );

  const clearAllCaches = useCallback(async () => {
    setIsClearing(true);
    try {
      const response = await fetch("/api/preferences/cache", {
        method: "DELETE",
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to clear preferences (${response.status})`);
      }

      if (typeof window !== "undefined") {
        if ("caches" in window) {
          const cacheNames = await window.caches.keys();
          await Promise.all(cacheNames.map((name) => window.caches.delete(name)));
        }
        window.localStorage.clear();
        window.sessionStorage.clear();
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Unable to clear local cache. Please try again.");
      setIsClearing(false);
    }
  }, []);

  const handleAcknowledge = useCallback(async () => {
    setIsAcknowledging(true);
    try {
      const response = await fetch("/api/preferences/wip", {
        method: "POST",
        cache: "no-store",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to acknowledge build (${response.status})`);
      }
      setHasAcknowledged(true);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Could not save your acknowledgement. Please retry.");
      setIsAcknowledging(false);
    }
  }, []);

  return (
    <>
      {isBannerVisible && (
        <div
          ref={bannerRef}
          className="sticky top-0 z-[60] border-b border-border-line/30 bg-[linear-gradient(120deg,var(--accent-primary),var(--brand-primary))] text-white shadow-lg"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold tracking-wide uppercase">Under construction</span>
              <StatusPill status="in-progress" label="Shipping in public" className="bg-white/15 text-white border-white/20" />
              <Link
                href="/status"
                className="text-xs font-medium underline-offset-4 hover:underline"
              >
                View status updates
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-xs text-white/90 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex flex-col gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 sm:flex-row sm:items-center sm:gap-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide">
                  Cache: {preferenceLabel}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "h-8 rounded-full border px-3 text-xs font-medium",
                      cachePref === "performance"
                        ? "bg-white text-surf-0"
                        : "bg-transparent text-white/80 border-transparent",
                      "hover:bg-white/80 hover:text-surf-0"
                    )}
                    aria-pressed={cachePref === "performance"}
                    onClick={() => updatePreference("performance")}
                    disabled={isUpdatingPref || cachePref === "performance"}
                  >
                    {isUpdatingPref && cachePref !== "performance" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    Performance
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "h-8 rounded-full border px-3 text-xs font-medium",
                      cachePref === "fresh"
                        ? "bg-white text-surf-0"
                        : "bg-transparent text-white/80 border-transparent",
                      "hover:bg-white/80 hover:text-surf-0"
                    )}
                    aria-pressed={cachePref === "fresh"}
                    onClick={() => updatePreference("fresh")}
                    disabled={isUpdatingPref || cachePref === "fresh"}
                  >
                    {isUpdatingPref && cachePref !== "fresh" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    Always fresh
                  </Button>
                </div>
                <p className="text-[11px] text-white/70 sm:ml-2 sm:w-48">
                  {preferenceDescription}
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 rounded-full border border-white/20 bg-white/10 px-3 text-xs font-medium text-white/90 hover:bg-white/20"
                  onClick={clearAllCaches}
                  disabled={isClearing || isUpdatingPref}
                >
                  {isClearing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  Clear cache
                </Button>
                <button
                  type="button"
                  onClick={handleDismissBanner}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                  aria-label="Dismiss site status banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-surf-0/80 backdrop-blur-xl">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-status-modal-title"
            className="w-full max-w-lg rounded-3xl border border-border-line bg-surf-0/95 p-8 text-left shadow-2xl"
          >
            <div className="mb-4 space-y-2">
              <StatusPill status="beta" label="Work in progress" />
              <h2
                id="site-status-modal-title"
                className="text-2xl font-semibold text-text-1"
              >
                Welcome to the public build
              </h2>
              <p className="text-sm text-text-2">
                Build <span className="font-mono text-brand-primary">{SHORT_BUILD_ID}</span> · {BUILD_DATE}
              </p>
            </div>
            <ul className="space-y-3 text-sm text-text-2">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
                Pages may be placeholders or incomplete as features roll out.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
                Features and copy can change rapidly while I iterate in public.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
                Choose between cached performance or always fresh responses anytime from the banner.
              </li>
            </ul>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-border-line/60 bg-surf-1/70 p-4 text-xs text-text-3">
                Your acknowledgement is stored in a cookie ({""}
                <code className="font-mono text-text-2">ozzy_wip_ack</code>{" "}
                ) so new deploys can re-prompt you.
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  onClick={handleAcknowledge}
                  disabled={isAcknowledging}
                  className="flex-1"
                >
                  {isAcknowledging ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  I understand
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 text-sm text-brand-primary hover:text-brand-primary"
                  asChild
                >
                  <Link href="/legal/cookies">Read about these cookies</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
