"use client";

import { useWIP } from "@/lib/wip-context";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function WIPGateModal() {
  const pathname = usePathname();
  const { isModalDismissed, dismissModal, isMounted } = useWIP();
  const [isOpen, setIsOpen] = useState(false);

  // Only show modal on homepage and if not dismissed
  useEffect(() => {
    if (!isMounted) return;

    // Only show on homepage (/)
    const isHomepage = pathname === "/";
    const shouldShow = isHomepage && !isModalDismissed;

    setIsOpen(shouldShow);
  }, [pathname, isModalDismissed, isMounted]);

  const handleAcknowledge = () => {
    dismissModal();
    setIsOpen(false);
  };

  // Don't render until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome! Site Under Active Development</DialogTitle>
          <DialogDescription className="pt-2 space-y-2">
            <span className="block">
              Thanks for visiting! This portfolio is actively being built and
              improved. Some features are still works-in-progress.
            </span>
            <span className="block text-text-2">
              Found a bug or have feedback?{" "}
              <a
                href="mailto:me@omerakben.com"
                className="text-brand-primary hover:underline"
              >
                Let me know
              </a>
              .
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleAcknowledge} className="w-full sm:w-auto">
            Got it, let me explore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
