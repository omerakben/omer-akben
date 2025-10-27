"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, FileText } from "lucide-react";
import { useState } from "react";

type ResumeFormat = "resume" | "extended";

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
 * Split button for downloading resume in different formats.
 * Features:
 * - Primary action: Download standard resume
 * - Dropdown menu: Select format (Standard, Extended)
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

  const handleDownload = async (format: ResumeFormat) => {
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
    <div className={`flex ${className}`}>
      {/* Primary download button */}
      <Button
        variant={variant}
        size={size}
        onClick={() => handleDownload("resume")}
        disabled={isLoading}
        className="gap-2 rounded-r-none"
        aria-label="Download standard resume"
      >
        <Download className="w-4 h-4" />
        <span>{isLoading ? "Loading..." : "Resume"}</span>
      </Button>

      {/* Format selector dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={isLoading}
            className="rounded-l-none border-l-0 px-2"
            aria-label="Select resume format"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => handleDownload("resume")}
            className="gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <div>
              <div className="font-medium">Standard Resume</div>
              <div className="text-xs text-text-2">Optimized for ATS</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDownload("extended")}
            className="gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <div>
              <div className="font-medium">Extended Resume</div>
              <div className="text-xs text-text-2">Detailed version</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
