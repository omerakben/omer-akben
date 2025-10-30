"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BUILD_DATE, BUILD_ID } from "@/lib/build";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BANNER_STORAGE_KEY = `ozzy_wip_banner_${BUILD_ID}`;
const TOAST_STORAGE_KEY = `ozzy_wip_whats_new_${BUILD_ID}`;

type CacheMode = "performance" | "fresh";

function formatBuildDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

async function clearBrowserCaches() {
  if (typeof window === "undefined") return;

  try {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }
  } catch (error) {
    console.error("Failed to clear Cache Storage", error);
  }

  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch (error) {
    console.error("Failed to clear storage", error);
  }
}

export default function SiteStatus({
  initialCachePref,
}: {
  initialCachePref: CacheMode;
}) {
  const router = useRouter();
  const [cachePref, setCachePref] = useState<CacheMode>(initialCachePref);
  const [showBanner, setShowBanner] = useState(true);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ackLoading, setAckLoading] = useState(false);
  const [cacheLoading, setCacheLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const buildDateLabel = useMemo(() => formatBuildDate(BUILD_DATE), []);
  const buildIdShort = BUILD_ID.slice(0, 7);

  useEffect(() => {
    const acknowledged = readCookie("ozzy_wip_ack") === BUILD_ID;
    setHasAcknowledged(acknowledged);
    setShowModal(!acknowledged);

    if (typeof window !== "undefined") {
      const bannerDismissed =
        window.localStorage.getItem(BANNER_STORAGE_KEY) === "dismissed";
      setShowBanner(!bannerDismissed);

      if (!window.localStorage.getItem(TOAST_STORAGE_KEY)) {
        window.localStorage.setItem(TOAST_STORAGE_KEY, "seen");
        toast("New build deployed", {
          description: `Build ${buildIdShort} shipped ${buildDateLabel}. Check out what's new on the status page.`,
          action: {
            label: "View",
            onClick: () => router.push("/status"),
          },
        });
      }
    }
  }, [buildDateLabel, buildIdShort, router]);

  const handleDismissBanner = useCallback(() => {
    setShowBanner(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(BANNER_STORAGE_KEY, "dismissed");
    }
  }, []);

  const handleAcknowledge = useCallback(async () => {
    try {
      setAckLoading(true);
      const response = await fetch("/api/preferences/wip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to store acknowledgement");
      }

      setHasAcknowledged(true);
      setShowModal(false);
      toast("Welcome aboard", {
        description: "Thanks for exploring in public!",
      });
      router.refresh();
    } catch (error) {
      toast("Could not save your acknowledgement", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setAckLoading(false);
    }
  }, [router]);

  const toggleCacheMode = useCallback(async () => {
    const nextMode: CacheMode = cachePref === "performance" ? "fresh" : "performance";
    try {
      setCacheLoading(true);
      const response = await fetch("/api/preferences/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        credentials: "include",
        body: JSON.stringify({ mode: nextMode }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cache preference");
      }

      setCachePref(nextMode);
      toast("Cache preference updated", {
        description:
          nextMode === "fresh"
            ? "Server components will re-render without cache"
            : "Performance mode uses short-term caching",
      });
      router.refresh();
    } catch (error) {
      toast("Unable to update cache preference", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setCacheLoading(false);
    }
  }, [cachePref, router]);

  const handleClearCache = useCallback(async () => {
    try {
      setClearLoading(true);
      await clearBrowserCaches();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(BANNER_STORAGE_KEY);
        window.localStorage.removeItem(TOAST_STORAGE_KEY);
      }

      const response = await fetch("/api/preferences/cache", {
        method: "DELETE",
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to clear preference cookies");
      }

      setHasAcknowledged(false);
      setShowModal(true);
      setShowBanner(true);
      toast("Cache cleared", {
        description: "Storage cleared. Reloading to refresh data.",
      });
      router.refresh();
    } catch (error) {
      toast("Unable to clear cache", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setClearLoading(false);
    }
  }, [router]);

  const modalOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        if (!hasAcknowledged) {
          setShowModal(true);
          return;
        }
        setShowModal(false);
      } else {
        setShowModal(true);
      }
    },
    [hasAcknowledged]
  );

  return (
    <>
      {showBanner && (
        <div className="sticky top-0 z-50 border-b border-border-line bg-gradient-to-r from-brand-primary/15 via-accent-primary/10 to-transparent backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3 text-sm text-text-2">
              <StatusPill status="beta" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="font-semibold text-text-1">
                  Under construction
                </span>
                <span className="hidden sm:inline text-text-3">•</span>
                <span>Shipping in public. Expect rapid changes.</span>
                <Link
                  href="/status"
                  className="text-brand-primary underline-offset-4 hover:underline"
                >
                  Status updates
                </Link>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={toggleCacheMode}
                disabled={cacheLoading}
              >
                {cacheLoading ? "Updating…" : cachePref === "performance" ? "Performance" : "Always fresh"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearCache}
                disabled={clearLoading}
              >
                {clearLoading ? "Clearing…" : "Clear cache"}
              </Button>
              <button
                type="button"
                aria-label="Dismiss site status banner"
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-full border border-border-line/60 text-text-3 transition hover:border-border-line hover:text-text-1",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                )}
                onClick={handleDismissBanner}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showModal} onOpenChange={modalOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Heads up! This build is still in progress.</DialogTitle>
            <DialogDescription>
              I&apos;m shipping in public. Before you explore, please acknowledge:
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 rounded-lg bg-surf-2/60 p-4 text-sm text-text-2">
            <li>• Pages may be placeholders or incomplete.</li>
            <li>• Features change rapidly as I iterate.</li>
            <li>• You can choose Performance (cached) or Always fresh data.</li>
          </ul>
          <div className="space-y-2 text-sm text-text-3">
            <p>
              Build <span className="font-mono text-text-2">{buildIdShort}</span> • {buildDateLabel}
            </p>
            <p>
              Want the details? Read the{' '}
              <Link
                href="/legal/cookies"
                className="text-brand-primary underline-offset-4 hover:underline"
              >
                cookie policy
              </Link>
              .
            </p>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleCacheMode}
              disabled={cacheLoading}
              className="order-2 sm:order-1"
            >
              {cachePref === "performance" ? "Switch to Always fresh" : "Switch to Performance"}
            </Button>
            <Button
              type="button"
              onClick={handleAcknowledge}
              disabled={ackLoading}
              className="order-1 sm:order-2"
            >
              {ackLoading ? "Saving…" : "I understand"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
