"use client";

import * as React from "react";
import { parseCustomSkills } from "@/lib/domain";
import { useConfig } from "@/lib/store/useConfig";
import { buildPrompt } from "@/lib/prompt/builder";

/** Live markdown for the current Configuration (or the manual override). */
export function useGeneratedPrompt(): string {
  const selections = useConfig((s) => s.selections);
  const requirements = useConfig((s) => s.requirements);
  const mode = useConfig((s) => s.mode);
  const customSkillsRaw = useConfig((s) => s.customSkillsRaw);
  const manualEdit = useConfig((s) => s.manualEdit);

  return React.useMemo(() => {
    if (manualEdit !== null) return manualEdit;
    return buildPrompt({
      selections,
      requirements,
      mode,
      customSkills: parseCustomSkills(customSkillsRaw),
    });
  }, [selections, requirements, mode, customSkillsRaw, manualEdit]);
}

export function wordCount(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean);
  return markdown.trim() === "" ? 0 : words.length;
}
