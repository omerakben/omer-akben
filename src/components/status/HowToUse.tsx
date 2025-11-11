"use client";

import { useEffect, useMemo, useState } from "react";

import type { HowToUse as HowToUseBlock, Persona } from "@/data/status";
import { posthog } from "@/lib/analytics/posthog-client";

interface HowToUseProps {
  persona: Persona;
  blocks: HowToUseBlock[];
}

export function HowToUse({ persona, blocks }: HowToUseProps) {
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const entry = useMemo(
    () => blocks.find((block) => block.persona === persona),
    [blocks, persona]
  );

  const prompts = entry?.prompts ?? [];

  useEffect(() => {
    setCopiedPrompt(null);
  }, [persona]);

  useEffect(() => {
    if (!copiedPrompt) {
      return;
    }

    const timeout = window.setTimeout(() => setCopiedPrompt(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [copiedPrompt]);

  const copyPrompt = async (prompt: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = prompt;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedPrompt(prompt);
      posthog.capture("status_page.prompt_copied", { persona });
    } catch (error) {
      console.error("[HowToUse] Failed to copy prompt", error);
    }
  };

  return (
    <div id={`persona-panel-${persona}`} role="tabpanel">
      <div className="space-y-3">
        {prompts.map((prompt) => (
          <article
            key={prompt}
            className="flex items-start justify-between gap-4 rounded-2xl border border-border-line bg-surf-1 p-4 shadow-sm"
          >
            <p className="flex-1 text-base text-text-1">{prompt}</p>
            <button
              className="rounded-full border border-border-line px-4 py-2 text-sm font-medium text-text-2 transition-all hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              onClick={() => copyPrompt(prompt)}
              type="button"
            >
              {copiedPrompt === prompt ? "Copied" : "Copy"}
            </button>
          </article>
        ))}
        {prompts.length === 0 ? (
          <p className="rounded-2xl border border-border-line bg-surf-1 p-4 text-sm text-text-2">
            Prompts for this persona are coming soon.
          </p>
        ) : null}
      </div>
      <span aria-live="polite" className="sr-only">
        {copiedPrompt ? "Prompt copied to clipboard" : ""}
      </span>
    </div>
  );
}
