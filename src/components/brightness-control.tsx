"use client";

import { useMemo } from "react";
import { useBrightness } from "@/lib/brightness-context";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrightnessControl() {
  const { brightness, setBrightness } = useBrightness();

  const modes = useMemo(() => ['-3', '-2', '-1', '0', '+1', '+2', '+3'] as const, []);

  // Determine if current brightness is dark mode (negative or 0) or light mode (positive)
  const isDarkMode = useMemo(() => {
    if (brightness === 'auto') return true; // Default assumption
    const numBrightness = parseInt(brightness);
    return numBrightness <= 0;
  }, [brightness]);

  // Adaptive hover background based on current brightness mode
  const hoverBg = isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10";

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-surf-1 border border-border-line rounded-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setBrightness('-3')}
        className={cn(
          "h-7 w-7 p-0 transition-colors",
          hoverBg
        )}
        aria-label="Set minimum brightness"
      >
        <Moon className="h-4 w-4 text-[#60A5FA] hover:text-[#3B82F6]" />
      </Button>
      {modes.map((mode) => (
        <Button
          key={mode}
          variant="ghost"
          size="sm"
          onClick={() => setBrightness(mode)}
          className={cn(
            "h-7 px-2 text-xs font-medium transition-colors",
            hoverBg,
            brightness === mode && "bg-brand-primary text-surf-0 hover:bg-brand-primary"
          )}
        >
          {mode}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setBrightness('+3')}
        className={cn(
          "h-7 w-7 p-0 transition-colors",
          hoverBg
        )}
        aria-label="Set maximum brightness"
      >
        <Sun className="h-4 w-4 text-[#F59E0B] hover:text-[#EF4444]" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setBrightness('auto')}
        className={cn(
          "h-7 px-2 text-xs font-medium transition-colors",
          hoverBg,
          brightness === 'auto' && "bg-brand-primary text-surf-0 hover:bg-brand-primary"
        )}
      >
        Auto
      </Button>
    </div>
  );
}
