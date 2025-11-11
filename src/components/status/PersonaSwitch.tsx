/**
 * Persona Switch Component
 *
 * Tab-style navigation for switching between different persona views.
 * Uses ARIA tab pattern for keyboard navigation and screen reader support.
 *
 * @module components/status/PersonaSwitch
 *
 * @example
 * ```tsx
 * <PersonaSwitch
 *   personas={[
 *     { id: "recruiters", label: "For Recruiters" },
 *     { id: "engineers", label: "For Engineers" }
 *   ]}
 *   active="recruiters"
 *   onChange={(persona) => setActive(persona)}
 * />
 * ```
 */

"use client";

import type { Persona } from "@/data/status";
import { cn } from "@/lib/utils";

/**
 * Props for the PersonaSwitch component
 */
interface PersonaSwitchProps {
  /** Available personas with IDs and labels */
  personas: Array<{ id: Persona; label: string }>;
  /** Currently active persona */
  active: Persona;
  /** Callback when persona selection changes */
  onChange: (persona: Persona) => void;
}

/**
 * Tab-style persona switcher with keyboard navigation
 *
 * Implements ARIA tablist pattern for accessible persona switching.
 * Active state is visually distinct with emerald background.
 *
 * @param props - Component props
 * @returns Rendered persona switcher with tab buttons
 */
export function PersonaSwitch({ personas, active, onChange }: PersonaSwitchProps) {
  return (
    <div
      aria-label="Select persona"
      className="flex flex-wrap items-center justify-center gap-2"
      role="tablist"
    >
      {personas.map((persona) => (
        <button
          key={persona.id}
          aria-controls={`persona-panel-${persona.id}`}
          aria-selected={active === persona.id}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
            active === persona.id
              ? "bg-emerald-700 text-white"
              : "bg-surf-1 text-text-2 hover:bg-surf-2"
          )}
          onClick={() => onChange(persona.id)}
          role="tab"
          type="button"
        >
          {persona.label}
        </button>
      ))}
    </div>
  );
}
