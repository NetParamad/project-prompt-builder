"use client";

import * as React from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { LOGO_DARK_VARIANTS, LOGO_TITLES } from "@/lib/data/logos";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  id: string;
  name: string;
  description?: string;
  selected: boolean;
  onToggle: () => void;
}

function OptionLogo({ id, name }: { id: string; name: string }) {
  const [failed, setFailed] = React.useState(false);
  const hasLogo = !failed && id in LOGO_TITLES;
  const hasDark = LOGO_DARK_VARIANTS.has(id);

  if (!hasLogo) {
    return (
      <span
        aria-hidden="true"
        className="flex size-5 shrink-0 items-center justify-center rounded bg-zinc-200 text-[11px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="relative block size-5 shrink-0">
      <Image
        src={`/logos/${id}.svg`}
        alt=""
        loading="lazy"
        width={20}
        height={20}
        onError={() => setFailed(true)}
        className={cn("size-5", hasDark && "dark:hidden")}
      />
      {hasDark && (
        <Image
          src={`/logos/${id}-dark.svg`}
          alt=""
          loading="lazy"
          width={20}
          height={20}
          onError={() => setFailed(true)}
          className="hidden size-5 dark:block"
        />
      )}
    </span>
  );
}

export function OptionCard({ id, name, description, selected, onToggle }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left text-sm transition-all duration-150 outline-none hover:-translate-y-px hover:shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-500 active:scale-[0.98]",
        selected && "animate-card-pop",
        selected
          ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
          : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600",
      )}
    >
      <span className="flex w-full items-center justify-between gap-2 font-medium">
        <span className="flex min-w-0 items-center gap-2">
          <OptionLogo id={id} name={name} />
          <span className="truncate">{name}</span>
        </span>
        {selected && <Check aria-label="selected" className="animate-check-in" />}
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
