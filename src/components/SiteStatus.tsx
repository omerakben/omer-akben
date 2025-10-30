"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, RefreshCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type CacheMode = "performance" | "fresh";

type ModeCopy = {
  title: string;
  description: string;
};

const MODE_COPY: Record<CacheMode, ModeCopy> = {
  performance: {
    title: "Performance",
    description: "Uses caching with background refresh (best for speed).",
  },
  fresh: {
    title: "Always fresh",
    description: "Always fetches the latest data from the server.",
  },
};

const BANNER_STORAGE_PREFIX = "ozzy_wip_banner";
const LAST_SEEN_BUILD_KEY = "ozzy_last_seen_build";

async function clearBrowserCaches() {
  if (typeof window === "undefined") return;

  if ("caches" in window) {
    try {
      const cacheNames = await window.caches.keys();
      await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
    } catch (error) {
      console.error("Failed to clear Cache Storage", error);
    }
  }

  try {
    window.localStorage.clear();
  } catch (error) {
    console.error("Failed to clear localStorage", error);
  }

  try {
    window.sessionStorage.clear();
  } catch (error) {
    console.error("Failed to clear sessionStorage", error);
  }
}

interface SiteStatusProps {
  initialCachePref: CacheMode;
  initialAcknowledged: boolean;
  buildId: string;
  buildDate: string;
}

export default function SiteStatus({
  initialCachePref,
  initialAcknowledged,
  buildId,
  buildDate,
}: SiteStatusProps) {
  const [cacheMode, setCacheMode] = useState<CacheMode>(initialCachePref);
  const [isModalOpen, setIsModalOpen] = useState(!initialAcknowledged);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const bannerStorageKey = useMemo(
    () => `${BANNER_STORAGE_PREFIX}_${buildId}`,
    [buildId]
  );

  useEffect(() => {
    setIsModalOpen(!initialAcknowledged);
  }, [initialAcknowledged]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = window.sessionStorage.getItem(bannerStorageKey);
    if (dismissed === "true") {
      setIsBannerVisible(false);
    }
  }, [bannerStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !initialAcknowledged) return;

    const lastSeenBuild = window.localStorage.getItem(LAST_SEEN_BUILD_KEY);
    if (lastSeenBuild !== buildId) {
      if (lastSeenBuild) {
        toast.info("What's new", {
          description: `Build ${buildId.slice(0, 7)} deployed on ${new Date(
            buildDate
          ).toLocaleString()}.`,
          duration: 6000,
        });
      }

      window.localStorage.setItem(LAST_SEEN_BUILD_KEY, buildId);
    }
  }, [buildId, buildDate, initialAcknowledged]);

  const handleAcknowledge = useCallback(async () => {
    try {
      const response = await fetch("/api/preferences/wip", {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to record acknowledgement");
      }

      toast.success("Thanks!", {
        description: "Preferences saved for this build.",
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Could not save acknowledgement.");
    }
  }, []);

  const handleToggleMode = useCallback(async () => {
    const nextMode: CacheMode = cacheMode === "performance" ? "fresh" : "performance";
    setIsUpdatingMode(true);

    try {
      const response = await fetch("/api/preferences/cache", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: nextMode }),
      });

      if (!response.ok) {
        throw new Error("Failed to update preference");
      }

      setCacheMode(nextMode);
      toast.success(`Caching set to ${MODE_COPY[nextMode].title}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Could not update cache preference.");
    } finally {
      setIsUpdatingMode(false);
    }
  }, [cacheMode]);

  const handleDismissBanner = useCallback(() => {
    setIsBannerVisible(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(bannerStorageKey, "true");
    }
  }, [bannerStorageKey]);

  const handleClearCache = useCallback(async () => {
    setIsClearing(true);
    try {
      const response = await fetch("/api/preferences/cache", {
        method: "DELETE",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to clear preferences");
      }

      await clearBrowserCaches();
      toast.success("Cache cleared. Reloading…");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Could not clear cache.");
    } finally {
      setIsClearing(false);
    }
  }, []);

  const modeDetails = MODE_COPY[cacheMode];

  return (
    <>
      {isBannerVisible && (
        <div className="sticky top-0 z-[60] w-full bg-gradient-to-r from-brand-primary/90 via-accent-primary/80 to-accent-primary/90 text-surf-0 shadow-lg">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-1 flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-start">
              <div className="flex items-center gap-2 font-semibold uppercase tracking-wide">
                <span className="rounded-full bg-surf-0/20 px-2 py-0.5 text-xs font-semibold">
                  Under construction
                </span>
                <Link
                  href="/status"
                  className="text-surf-0 underline-offset-4 hover:underline"
                >
                  View status
                </Link>
              </div>
              <div className="text-surf-0/90 sm:ml-4">
                {modeDetails.title}: {modeDetails.description}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className={cn(
                  "h-8 bg-surf-0/10 text-surf-0 hover:bg-surf-0/20 border border-surf-0/30",
                  isUpdatingMode && "pointer-events-none opacity-70"
                )}
                onClick={handleToggleMode}
                disabled={isUpdatingMode}
              >
                {isUpdatingMode ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCcw className="h-3.5 w-3.5" />
                )}
                <span className="ml-2 text-xs font-semibold">
                  {cacheMode === "performance" ? "Always fresh" : "Performance"}
                </span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-surf-0/40 bg-surf-0/10 text-surf-0 hover:bg-surf-0/20"
                onClick={handleClearCache}
                disabled={isClearing}
              >
                {isClearing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCcw className="h-3.5 w-3.5" />
                )}
                <span className="ml-2 text-xs font-semibold">Clear cache</span>
              </Button>
              <button
                type="button"
                onClick={handleDismissBanner}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-surf-0/30 text-surf-0 hover:bg-surf-0/20"
                aria-label="Dismiss site status banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg bg-surf-1">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Shipping in public (build {buildId.slice(0, 7)})
            </DialogTitle>
            <DialogDescription>
              Build date: {new Date(buildDate).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-text-2">
            <p className="text-text-1 font-medium">
              Before exploring, please note:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Some pages are still in progress or placeholders.</li>
              <li>Features may change rapidly as iterations ship.</li>
              <li>
                Choose <span className="font-semibold">Performance</span> for caching or
                <span className="font-semibold"> Always fresh</span> for live data.
              </li>
            </ul>
            <p>
              Review how cookies are used on the
              {" "}
              <Link
                href="/legal/cookies"
                className="text-brand-primary underline-offset-4 hover:underline"
              >
                cookies page
              </Link>
              .
            </p>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={handleClearCache}
              disabled={isClearing}
            >
              {isClearing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Clear & reset
            </Button>
            <Button onClick={handleAcknowledge}>I understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
