"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ClampLines = 4 | 5 | 6;

interface ExpandableQuoteProps {
  text: string;
  clampLines?: ClampLines;
  className?: string;
}

const clampClassByLines: Record<ClampLines, string> = {
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

const DEFAULT_CLAMP_LINES: ClampLines = 6;
const READ_MORE_THRESHOLD = 240;

export function ExpandableQuote({
  text,
  clampLines = DEFAULT_CLAMP_LINES,
  className,
}: ExpandableQuoteProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = useMemo(
    () => text.length > READ_MORE_THRESHOLD,
    [text]
  );
  const clampClass =
    !expanded && shouldTruncate ? clampClassByLines[clampLines] : undefined;

  return (
    <div className={cn("space-y-3", className)}>
      <p className={cn("text-text-2 italic", clampClass)}>
        &ldquo;{text}&rdquo;
      </p>
      {shouldTruncate ? (
        <Button
          aria-expanded={expanded}
          className="h-auto px-0 text-brand-primary hover:text-brand-primary"
          onClick={() => setExpanded((prev) => !prev)}
          type="button"
          variant="ghost"
        >
          {expanded ? "Read less" : "Read more"}
        </Button>
      ) : null}
    </div>
  );
}
