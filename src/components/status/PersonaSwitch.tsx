"use client";

import type { Persona } from "@/data/status";
import { cn } from "@/lib/utils";

interface PersonaSwitchProps {
  personas: Array<{ id: Persona; label: string }>;
  active: Persona;
  onChange: (persona: Persona) => void;
}

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
