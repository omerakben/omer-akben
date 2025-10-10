"use client";

import { useMemo } from "react";
import { useBrightness } from "@/lib/brightness-context";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrightnessControl() {
  const { brightness, setBrightness } = useBrightness();

  const modes = useMemo(() => ['-2', '-1', '0', '+1', '+2'] as const, []);

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-surf-1 border border-border-line rounded-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setBrightness('-2')}
        className="h-7 w-7 p-0 hover:bg-surf-2"
      >
        <Moon className="h-4 w-4" />
      </Button>
      {modes.map((mode) => (
        <Button
          key={mode}
          variant="ghost"
          size="sm"
          onClick={() => setBrightness(mode)}
          className={cn(
            "h-7 px-2 text-xs font-medium hover:bg-surf-2",
            brightness === mode && "bg-brand-primary text-surf-0 hover:bg-brand-primary"
          )}
        >
          {mode}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setBrightness('+2')}
        className="h-7 w-7 p-0 hover:bg-surf-2"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setBrightness('auto')}
        className={cn(
          "h-7 px-2 text-xs font-medium hover:bg-surf-2",
          brightness === 'auto' && "bg-brand-primary text-surf-0 hover:bg-brand-primary"
        )}
      >
        Auto
      </Button>
    </div>
  );
}
