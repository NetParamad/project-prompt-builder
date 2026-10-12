"use client";

import * as React from "react";
import { evaluateRules } from "@/lib/compat/rules";
import { CATEGORY_MAP } from "@/lib/data/catalog";
import { useConfig } from "@/lib/store/useConfig";
import { cn } from "@/lib/utils";

function scrollToCategory(categoryId: string) {
  const target = document.getElementById(`category-${categoryId}`);
  if (!target) return;
  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

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
      {issues.map((issue) => {
        const targetId = issue.involved[0];
        const targetTitle = targetId
          ? (CATEGORY_MAP[targetId]?.title ?? targetId)
          : null;
        return (
          <li key={issue.ruleId}>
            <button
              type="button"
              onClick={() => targetId && scrollToCategory(targetId)}
              title={targetTitle ? `Go to ${targetTitle}` : undefined}
              aria-label={
                targetTitle
                  ? `${issue.message} — go to ${targetTitle}`
                  : issue.message
              }
              className={cn(
                "animate-pane-in block w-full cursor-pointer rounded-md border p-2.5 text-left text-xs transition-all duration-150 hover:-translate-y-px hover:shadow-sm active:scale-[0.99]",
                issue.level === "warn"
                  ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40"
                  : "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40",
              )}
            >
              <span className="font-medium">
                {issue.level === "warn" ? "Warning" : "Note"}: {issue.message}
              </span>
              <span className="mt-0.5 block text-zinc-600 dark:text-zinc-300">
                {issue.hint}
                {targetTitle && ` → Jump to ${targetTitle}`}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
