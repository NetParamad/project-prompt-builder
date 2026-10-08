"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  name: string;
  description?: string;
  selected: boolean;
  onToggle: () => void;
}

export function OptionCard({ name, description, selected, onToggle }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-500",
        selected
          ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
          : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600",
      )}
    >
      <span className="flex w-full items-center justify-between gap-2 font-medium">
        {name}
        {selected && <Check aria-label="selected" />}
      </span>
      {description && (
        <span
          className={cn(
            "text-xs",
            selected
              ? "text-zinc-300 dark:text-zinc-600"
              : "text-zinc-500 dark:text-zinc-400",
          )}
        >
          {description}
        </span>
      )}
    </button>
  );
}
