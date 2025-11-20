"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

type ResumeFormat = "resume";

interface ResumeDownloadButtonProps {
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Button variant
   */
  variant?: "default" | "outline" | "ghost";
  /**
   * Button size
   */
  size?: "default" | "sm" | "lg";
}

/**
 * ResumeDownloadButton Component
 *
 * Button for downloading professional resume (unified format).
 * Features:
 * - Single unified professional resume (PDF, 2 pages, 88KB)
 * - Loading states during download
 * - Accessible with ARIA labels
 * - Error handling with user feedback
 */
export function ResumeDownloadButton({
  className = "",
  variant = "default",
  size = "default",
}: ResumeDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (format: ResumeFormat = "resume") => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/tools/download-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) {
        throw new Error("Failed to get resume download link");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Download failed");
      }

      // Trigger download
      const link = document.createElement("a");
      link.href = data.data.url;
      link.download = data.data.filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("[ResumeDownload] Error:", error);
      alert("Failed to download resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => handleDownload()}
      disabled={isLoading}
      className={`gap-2 ${className}`}
      aria-label="Download professional resume"
    >
      <Download className="w-4 h-4" />
      <span>{isLoading ? "Downloading..." : "Download Resume"}</span>
    </Button>
  );
}
