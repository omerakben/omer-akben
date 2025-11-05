"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEYS = {
  MODAL_DISMISSED: "wip_modal_dismissed",
  BANNER_DISMISSED: "wip_banner_dismissed",
} as const;

interface WIPContextType {
  isModalDismissed: boolean;
  isBannerDismissed: boolean;
  dismissModal: () => void;
  dismissBanner: () => void;
  isMounted: boolean;
}

const WIPContext = createContext<WIPContextType | undefined>(undefined);

export function WIPProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  // SSR-safe defaults (assume dismissed to prevent flash)
  const [isModalDismissed, setIsModalDismissed] = useState(true);
  const [isBannerDismissed, setIsBannerDismissed] = useState(true);

  // Load persisted state from localStorage on mount (hydration-safe)
  useEffect(() => {
    setIsMounted(true);

    if (typeof window === "undefined") return;

    try {
      // On first visit (null), show modal/banner (false)
      // After dismissal (true), keep hidden (true)
      const storedModal = localStorage.getItem(STORAGE_KEYS.MODAL_DISMISSED);
      const modalDismissed = storedModal === null ? false : storedModal === "true";

      const storedBanner = localStorage.getItem(STORAGE_KEYS.BANNER_DISMISSED);
      const bannerDismissed = storedBanner === null ? false : storedBanner === "true";

      setIsModalDismissed(modalDismissed);
      setIsBannerDismissed(bannerDismissed);
    } catch (error) {
      console.error("[WIPContext] Failed to load persisted state:", error);
    }
  }, []);

  const dismissModal = useCallback(() => {
    setIsModalDismissed(true);

    try {
      localStorage.setItem(STORAGE_KEYS.MODAL_DISMISSED, "true");
    } catch (error) {
      console.error("[WIPContext] Failed to persist modal dismissal:", error);
    }
  }, []);

  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);

    try {
      localStorage.setItem(STORAGE_KEYS.BANNER_DISMISSED, "true");
    } catch (error) {
      console.error("[WIPContext] Failed to persist banner dismissal:", error);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({
      isModalDismissed,
      isBannerDismissed,
      dismissModal,
      dismissBanner,
      isMounted,
    }),
    [isModalDismissed, isBannerDismissed, dismissModal, dismissBanner, isMounted]
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
