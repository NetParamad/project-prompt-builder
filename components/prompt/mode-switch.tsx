"use client";

import type { PromptMode } from "@/lib/domain";
import { useConfig } from "@/lib/store/useConfig";
import { Button } from "@/components/ui/button";

const MODES: { id: PromptMode; label: string; hint: string }[] = [
  { id: "basic", label: "Basic", hint: "Short prompt for simple projects" },
  { id: "standard", label: "Standard", hint: "Detailed project specification" },
  { id: "production", label: "Production", hint: "Full production brief + agent block" },
];

export function ModeSwitch() {
  const mode = useConfig((s) => s.mode);
  const setMode = useConfig((s) => s.setMode);

  return (
    <div role="group" aria-label="Prompt mode" className="flex gap-1">
      {MODES.map((m) => (
        <Button
          key={m.id}
          size="sm"
          variant={mode === m.id ? "default" : "secondary"}
          onClick={() => setMode(m.id)}
          aria-pressed={mode === m.id}
          title={m.hint}
        >
          {m.label}
        </Button>
      ))}
    </div>
  );
}
