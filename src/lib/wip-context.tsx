"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const MODAL_STORAGE_KEY = "wip_modal_dismissed";
const BANNER_STORAGE_PREFIX = "wip_banner_dismissed";

interface WIPContextType {
  isModalDismissed: boolean;
  isBannerDismissed: boolean;
  dismissModal: () => void;
  dismissBanner: () => void;
  isMounted: boolean;
  bannerVersionKey: string;
}

const WIPContext = createContext<WIPContextType | undefined>(undefined);

export function WIPProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  // SSR-safe defaults (assume dismissed to prevent flash)
  const [isModalDismissed, setIsModalDismissed] = useState(true);
  const [isBannerDismissed, setIsBannerDismissed] = useState(true);
  const [bannerVersionKey] = useState(
    () => process.env.NEXT_PUBLIC_GIT_SHA ?? "local"
  );
  const bannerStorageKey = useMemo(
    () => `${BANNER_STORAGE_PREFIX}:${bannerVersionKey}`,
    [bannerVersionKey]
  );

  // Load persisted state from localStorage on mount (hydration-safe)
  useEffect(() => {
    setIsMounted(true);

    if (typeof window === "undefined") return;

    try {
      // On first visit (null), show modal/banner (false)
      // After dismissal (true), keep hidden (true)
      const storedModal = localStorage.getItem(MODAL_STORAGE_KEY);
      const modalDismissed = storedModal === null ? false : storedModal === "true";

      const storedBanner = localStorage.getItem(bannerStorageKey);
      const bannerDismissed = storedBanner === null ? false : storedBanner === "true";

      setIsModalDismissed(modalDismissed);
      setIsBannerDismissed(bannerDismissed);
    } catch (error) {
      console.error("[WIPContext] Failed to load persisted state:", error);
    }
  }, [bannerStorageKey]);

  const dismissModal = useCallback(() => {
    setIsModalDismissed(true);

    try {
      localStorage.setItem(MODAL_STORAGE_KEY, "true");
    } catch (error) {
      console.error("[WIPContext] Failed to persist modal dismissal:", error);
    }
  }, []);

  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);

    try {
      localStorage.setItem(bannerStorageKey, "true");
    } catch (error) {
      console.error("[WIPContext] Failed to persist banner dismissal:", error);
    }
  }, [bannerStorageKey]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({
      isModalDismissed,
      isBannerDismissed,
      dismissModal,
      dismissBanner,
      isMounted,
      bannerVersionKey,
    }),
    [
      isModalDismissed,
      isBannerDismissed,
      dismissModal,
      dismissBanner,
      isMounted,
      bannerVersionKey,
    ]
  );

  return (
    <WIPContext.Provider value={contextValue}>
      {children}
    </WIPContext.Provider>
  );
}

export function useWIP() {
  const context = useContext(WIPContext);
  if (context === undefined) {
    throw new Error("useWIP must be used within WIPProvider");
  }
  return context;
}
