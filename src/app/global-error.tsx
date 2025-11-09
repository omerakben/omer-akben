"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Global Error Component
 *
 * Catches errors in the root layout and provides a fallback UI.
 * This is a last-resort error boundary that catches errors even in layout.tsx.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Capture error in Sentry for production monitoring
    Sentry.captureException(error);
    // Log critical error to console
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#0b1328",
            color: "#e4ecff",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Critical Error
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                marginBottom: "2rem",
                color: "#b5c1df",
              }}
            >
              A critical error occurred. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === "development" && error.message && (
              <pre
                style={{
                  marginBottom: "2rem",
                  padding: "1rem",
                  backgroundColor: "#121a35",
                  border: "1px solid #2b355c",
                  borderRadius: "0.5rem",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  overflow: "auto",
                  color: "#8998c0",
                }}
              >
                {error.message}
              </pre>
            )}
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#10b981",
                  color: "#0b1328",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#121a35",
                  color: "#e4ecff",
                  border: "1px solid #2b355c",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
