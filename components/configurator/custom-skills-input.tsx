"use client";

import { useConfig } from "@/lib/store/useConfig";

export function CustomSkillsInput() {
  const customSkillsRaw = useConfig((s) => s.customSkillsRaw);
  const setCustomSkillsRaw = useConfig((s) => s.setCustomSkillsRaw);

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">Custom skills (one per line)</span>
      <textarea
        value={customSkillsRaw}
        onChange={(e) => setCustomSkillsRaw(e.target.value)}
        placeholder={"my-team-skill\nreview-rules"}
        rows={2}
        className="resize-y rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-400"
      />
    </label>
  );
}
