"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { PRESETS } from "@/lib/data/presets";
import { useConfig } from "@/lib/store/useConfig";
import { Button } from "@/components/ui/button";

export function PresetBar() {
  const applyPreset = useConfig((s) => s.applyPreset);
  const [appliedId, setAppliedId] = React.useState<string | null>(null);

  function handleApply(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    applyPreset(preset);
    setAppliedId(id);
    window.setTimeout(() => {
      setAppliedId((current) => (current === id ? null : current));
    }, 2500);
  }

  return (
    <section aria-label="Presets" className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold">Start from a preset</h3>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.id}
            size="sm"
            variant={appliedId === preset.id ? "default" : "outline"}
            onClick={() => handleApply(preset.id)}
            title={preset.description}
          >
            {appliedId === preset.id && <Check aria-label="applied" />}
            {preset.name}
          </Button>
        ))}
      </div>
      {appliedId && (
        <p role="status" className="text-xs text-zinc-500 dark:text-zinc-400">
          Preset applied — tweak anything below.
        </p>
      )}
    </section>
  );
}
