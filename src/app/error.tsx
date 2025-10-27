"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

/**
 * Error Component
 *
 * Next.js App Router error boundary for handling runtime errors.
 * Displays a user-friendly error message with recovery options.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry)
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/10 blur-xl rounded-full" />
            <AlertTriangle className="relative w-20 h-20 text-destructive" />
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-text-1">
            Oops! Something went wrong
          </h1>
          <p className="text-base text-text-2">
            An unexpected error occurred. Don&apos;t worry, this has been logged
            and we&apos;ll look into it.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <details className="mt-4 p-4 bg-surf-1 border border-border-line rounded-lg text-left">
              <summary className="cursor-pointer font-semibold text-text-1 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-xs text-text-3 overflow-auto whitespace-pre-wrap break-words">
                {error.message}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Help text */}
        <p className="text-sm text-text-3">
          If this problem persists, please{" "}
          <a
            href="/contact"
            className="text-brand-primary hover:underline font-medium"
          >
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
}
