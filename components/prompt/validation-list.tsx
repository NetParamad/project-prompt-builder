"use client";

import * as React from "react";
import { evaluateRules } from "@/lib/compat/rules";
import { useConfig } from "@/lib/store/useConfig";
import { cn } from "@/lib/utils";

export function ValidationList() {
  const selections = useConfig((s) => s.selections);
  const issues = React.useMemo(() => evaluateRules(selections), [selections]);

  if (issues.length === 0) {
    return (
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        No compatibility issues — this stack fits together.
      </p>
    );
  }

  return (
    <ul aria-label="Compatibility notes" className="flex flex-col gap-2">
      {issues.map((issue) => (
        <li
          key={issue.ruleId}
          className={cn(
            "animate-pane-in rounded-md border p-2.5 text-xs",
            issue.level === "warn"
              ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40"
              : "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40",
          )}
        >
          <p className="font-medium">
            {issue.level === "warn" ? "Warning" : "Note"}: {issue.message}
          </p>
          <p className="mt-0.5 text-zinc-600 dark:text-zinc-300">{issue.hint}</p>
        </li>
      ))}
    </ul>
  );
}
