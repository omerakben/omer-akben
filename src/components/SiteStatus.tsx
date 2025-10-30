"use client";

import { useCallback, useEffect, useState } from "react";

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";

type CachePref = "performance" | "fresh";

const WIP_ACK_COOKIE = "ozzy_wip_ack";

function getCookie(name: string) {
  if (typeof document === "undefined") {
    return undefined;
  }

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

async function clearBrowserCaches() {
  if (typeof window === "undefined") {
    return;
  }

  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    } catch (error) {
      console.warn("Failed to clear Cache Storage", error);
    }
  }

  try {
    window.localStorage?.clear();
    window.sessionStorage?.clear();
  } catch (error) {
    console.warn("Failed to clear web storage", error);
  }
}

interface SiteStatusProps {
  initialCachePref: CachePref;
}

type BannerState = "open" | "dismissed";

export default function SiteStatus({ initialCachePref }: SiteStatusProps) {
  const router = useRouter();
  const [cachePref, setCachePref] = useState<CachePref>(initialCachePref);
  const [bannerState, setBannerState] = useState<BannerState>("open");
  const [modalOpen, setModalOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const bannerKey = `ozzy_wip_banner_${BUILD_ID}`;
  const whatsNewKey = `ozzy_whats_new_${BUILD_ID}`;

  const handleWhatsNewToast = useCallback(() => {
    if (!isMounted) {
      return;
    }

    try {
      if (window.localStorage.getItem(whatsNewKey)) {
        return;
      }
    } catch (error) {
      console.warn("Unable to access localStorage for What's New state", error);
      return;
    }

    toast(
      "What's new this build",
      {
        description: `Build ${BUILD_ID.slice(0, 7)} shipped ${new Date(
          BUILD_DATE
        ).toLocaleString()}.`,
        action: {
          label: "View status",
          onClick: () => router.push("/status"),
        },
      }
    );

    try {
      window.localStorage.setItem(whatsNewKey, "seen");
    } catch (error) {
      console.warn("Unable to persist What's New state", error);
    }
  }, [router, whatsNewKey, isMounted]);

  useEffect(() => {
    setIsMounted(true);
    const ackCookie = getCookie(WIP_ACK_COOKIE);
    const hasAcknowledged = ackCookie === BUILD_ID;
    setAcknowledged(hasAcknowledged);

    if (!hasAcknowledged) {
      setModalOpen(true);
    } else {
      handleWhatsNewToast();
    }

    try {
      const storedState = window.localStorage.getItem(bannerKey) as
        | BannerState
        | null;
      if (storedState) {
        setBannerState(storedState);
      }
    } catch (error) {
      console.warn("Unable to read banner state", error);
    }
  }, [bannerKey, handleWhatsNewToast]);

  const persistBannerState = useCallback(
    (state: BannerState) => {
      setBannerState(state);
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(bannerKey, state);
      } catch (error) {
        console.warn("Unable to persist banner state", error);
      }
    },
    [bannerKey]
  );

  const acknowledgeWip = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/preferences/wip", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to acknowledge WIP state");
      }

      setAcknowledged(true);
      setModalOpen(false);
      handleWhatsNewToast();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving your preference.");
    } finally {
      setLoading(false);
    }
  }, [handleWhatsNewToast, router]);

  const updateCachePreference = useCallback(
    async (mode: CachePref) => {
      if (cachePref === mode) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/preferences/cache", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mode }),
        });

        if (!response.ok) {
          throw new Error("Failed to update cache preference");
        }

        setCachePref(mode);
        await new Promise((resolve) => setTimeout(resolve, 150));
        window.location.reload();
      } catch (error) {
        console.error(error);
        toast.error("Could not update cache preference.");
      } finally {
        setLoading(false);
      }
    },
    [cachePref]
  );

  const clearCache = useCallback(async () => {
    setClearLoading(true);
    try {
      const response = await fetch("/api/preferences/cache", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear preferences");
      }

      await clearBrowserCaches();
      setCachePref("performance");
      try {
        window.localStorage.removeItem(whatsNewKey);
      } catch (error) {
        console.warn("Unable to reset What's New state", error);
      }
      await new Promise((resolve) => setTimeout(resolve, 150));
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Unable to clear cache and preferences.");
    } finally {
      setClearLoading(false);
    }
  }, [whatsNewKey]);

  if (!isMounted && bannerState === "dismissed") {
    return null;
  }

  return (
    <>
      {bannerState === "open" && (
        <div className="sticky top-0 z-50 border-b border-border-line bg-gradient-to-r from-brand-primary/90 via-brand-primary/80 to-accent-primary/80 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-3">
              <span className="font-semibold uppercase tracking-wide">Under construction</span>
              <Link
                href="/status"
                className="inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4 sm:text-sm"
              >
                Shipping in public →
              </Link>
              <span className="text-xs sm:text-sm">
                Build {BUILD_ID.slice(0, 7)} · {new Date(BUILD_DATE).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1 text-xs sm:text-sm">
                <span className="px-2 text-white/80">Cache</span>
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    cachePref === "performance"
                      ? "bg-white text-brand-primary"
                      : "text-white/80 hover:text-white"
                  }`}
                  onClick={() => updateCachePreference("performance")}
                  disabled={loading || cachePref === "performance"}
                  aria-pressed={cachePref === "performance"}
                >
                  Performance
                </button>
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    cachePref === "fresh"
                      ? "bg-white text-brand-primary"
                      : "text-white/80 hover:text-white"
                  }`}
                  onClick={() => updateCachePreference("fresh")}
                  disabled={loading || cachePref === "fresh"}
                  aria-pressed={cachePref === "fresh"}
                >
                  Always fresh
                </button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={clearCache}
                disabled={clearLoading}
                className="bg-white/20 text-white hover:bg-white/30"
              >
                {clearLoading ? "Clearing…" : "Clear cache"}
              </Button>
              <button
                type="button"
                onClick={() => persistBannerState("dismissed")}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:text-white"
                aria-label="Dismiss status banner"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Work in Progress</DialogTitle>
            <DialogDescription>
              Build {BUILD_ID.slice(0, 7)} · {new Date(BUILD_DATE).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <ul className="list-disc space-y-2 pl-5 text-sm text-text-2">
            <li>Pages may be placeholders or incomplete.</li>
            <li>Features change as I iterate in public.</li>
            <li>You can choose Performance (cached) or Always fresh.</li>
          </ul>
          <p className="text-xs text-text-3">
            Learn more about cookies in the {" "}
            <Link href="/legal/cookies" className="font-medium underline">
              cookie policy
            </Link>
            .
          </p>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                persistBannerState("open");
                setModalOpen(false);
              }}
            >
              Explore later
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={cachePref === "fresh" ? "default" : "outline"}
                onClick={() => updateCachePreference("fresh")}
                disabled={loading}
              >
                Always fresh
              </Button>
              <Button
                type="button"
                onClick={acknowledgeWip}
                disabled={loading}
              >
                {acknowledged ? "Close" : "I understand"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
