"use client";

import { Sparkles } from "lucide-react";
import { memo } from "react";
import { useRouter } from "next/navigation";
import type { FollowupSuggestionType } from "@/lib/schemas/followup-schema";
import { executeFollowupAction } from "@/lib/followups/action-mapper";

interface FollowupChipsProps {
  /**
   * Array of follow-up suggestions to display
   * Can be either string[] (legacy) or FollowupSuggestionType[] (new)
   */
  followups: string[] | FollowupSuggestionType[];
  /**
   * Callback to send the selected question
   */
  onSend: (question: string) => void;
  /**
   * Optional className for container styling
   */
  className?: string;
}

/**
 * FollowupChips Component
 *
 * Displays 2-4 dynamic follow-up questions after each assistant message.
 * Features:
 * - Auto-send on click with optional action execution
 * - Supports both string[] (legacy) and FollowupSuggestionType[] (new)
 * - Action mapper integration for tool execution
 * - Full keyboard navigation support
 * - ARIA compliant for screen readers
 *
 * Memoized to prevent unnecessary re-renders when follow-ups haven't changed
 */
export const FollowupChips = memo(function FollowupChips({
  followups,
  onSend,
  className = "",
}: FollowupChipsProps) {
  const router = useRouter();

  if (!followups || followups.length === 0) {
    return null;
  }

  // Normalize followups to FollowupSuggestionType[]
  const normalizedFollowups: Array<{ label: string; suggestion?: FollowupSuggestionType }> = followups.map(
    (item) => {
      if (typeof item === "string") {
        // Legacy string format
        return { label: item };
      } else {
        // New FollowupSuggestionType format
        return { label: item.label, suggestion: item };
      }
    }
  );

  const handleClick = async (
    label: string,
    suggestion?: FollowupSuggestionType
  ) => {
    // Execute action if suggestion has action type
    if (suggestion && suggestion.action !== "none") {
      try {
        const actionExecuted = await executeFollowupAction(
          suggestion.action,
          suggestion.args,
          router
        );

        // If action was executed and it's not a conversational action,
        // don't send the message (navigation actions handle flow)
        if (
          actionExecuted &&
          !["collect_contact", "provide_nav"].includes(suggestion.action)
        ) {
          console.log("[FollowupChips] Action executed, skipping message send");
          return;
        }
      } catch (error) {
        console.error("[FollowupChips] Action execution failed:", error);
        // Continue to send message even if action fails
      }
    }

    // Send message to chat
    onSend(label);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    label: string,
    suggestion?: FollowupSuggestionType
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(label, suggestion);
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`}
      role="group"
      aria-label="Suggested follow-up questions"
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 text-text-2 text-xs">
        <Sparkles aria-hidden="true" className="w-3.5 h-3.5" />
        <span>Continue the conversation:</span>
      </div>

      {/* Chips */}
      <div className="flex flex-col gap-2">
        {normalizedFollowups.map((item, index) => (
          <button
            key={`${item.label}-${index}`}
            onClick={() => handleClick(item.label, item.suggestion)}
            onKeyDown={(e) => handleKeyDown(e, item.label, item.suggestion)}
            className="group relative flex items-start gap-2 px-4 py-3 rounded-lg
                     bg-surf-1 hover:bg-surf-2
                     border border-border-line hover:border-brand-primary/50
                     text-text-1 text-sm text-left
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surf-0
                     animate-in fade-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
            aria-label={`Send follow-up question: ${item.label}`}
            type="button"
          >
            {/* Chip number indicator */}
            <span
              className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center
                           rounded-full bg-brand-primary/10 text-brand-primary text-xs font-medium
                           group-hover:bg-brand-primary group-hover:text-surf-0
                           transition-colors duration-200"
            >
              {index + 1}
            </span>

            {/* Question text */}
            <span className="flex-1 leading-relaxed">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if followups content or className changes
  // Note: onSend is excluded from comparison as it should be stable via useCallback in parent
  if (prevProps.className !== nextProps.className) {
    return false;
  }

  if (prevProps.followups.length !== nextProps.followups.length) {
    return false;
  }

  // Deep comparison for both string[] and FollowupSuggestionType[]
  return prevProps.followups.every((prev, i) => {
    const next = nextProps.followups[i];

    // Both strings
    if (typeof prev === "string" && typeof next === "string") {
      return prev === next;
    }

    // Both objects (FollowupSuggestionType)
    if (typeof prev === "object" && typeof next === "object") {
      return (
        prev.label === next.label &&
        prev.intent === next.intent &&
        prev.action === next.action &&
        JSON.stringify(prev.args) === JSON.stringify(next.args)
      );
    }

    // Type mismatch
    return false;
  });
});
