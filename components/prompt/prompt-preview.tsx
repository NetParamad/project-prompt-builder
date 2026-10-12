"use client";

import * as React from "react";
import { copyText } from "@/lib/export/clipboard";
import { useGeneratedPrompt, wordCount } from "@/lib/prompt/useGeneratedPrompt";
import { useConfig } from "@/lib/store/useConfig";
import { evaluateRules } from "@/lib/compat/rules";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ModeSwitch } from "@/components/prompt/mode-switch";
import { ValidationList } from "@/components/prompt/validation-list";

export function PromptPreview() {
  const markdown = useGeneratedPrompt();
  const selections = useConfig((s) => s.selections);
  const manualEdit = useConfig((s) => s.manualEdit);
  const setManualEdit = useConfig((s) => s.setManualEdit);
  const clearManualEdit = useConfig((s) => s.clearManualEdit);
  const clearAll = useConfig((s) => s.clearAll);

  const [copied, setCopied] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [confirmingClear, setConfirmingClear] = React.useState(false);

  const issues = React.useMemo(() => evaluateRules(selections), [selections]);
  const edited = manualEdit !== null;

  function startEditing() {
    setDraft(manualEdit ?? markdown);
    setEditing(true);
  }

  async function handleCopy() {
    setCopied(await copyText(markdown));
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ModeSwitch />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {wordCount(markdown)} words · {markdown.length} chars
          {issues.length > 0 && ` · ${issues.length} note${issues.length > 1 ? "s" : ""}`}
          {edited && " · Edited"}
        </span>
      </div>

      <ValidationList />

      {editing ? (
        <textarea
          aria-label="Edit prompt manually"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={20}
          className="max-h-[60vh] rounded-md border border-zinc-300 bg-white p-4 font-mono text-xs leading-relaxed outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      ) : (
        <pre
          aria-label="Generated prompt"
          className="max-h-[60vh] overflow-auto rounded-md bg-zinc-100 p-4 text-xs leading-relaxed whitespace-pre-wrap dark:bg-zinc-900"
        >
          {markdown}
        </pre>
      )}

      <div className="flex flex-col gap-2">
        {editing ? (
          <>
            <Button
              className="w-full"
              size="sm"
              onClick={() => {
                setManualEdit(draft);
                setEditing(false);
              }}
            >
              Save edits
            </Button>
            <Button className="w-full" size="sm" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button className="w-full" size="sm" variant="outline" onClick={startEditing}>
            Edit manually
          </Button>
        )}
        {edited && !editing && (
          <Button className="w-full" size="sm" variant="outline" onClick={clearManualEdit}>
            Reset edits
          </Button>
        )}
        <Button className="w-full" size="sm" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy to clipboard"}
        </Button>
        <Button className="w-full" size="sm" variant="outline" onClick={() => setConfirmingClear(true)}>
          Clear
        </Button>
      </div>
      <ConfirmDialog
        open={confirmingClear}
        title="Clear configuration?"
        description="This removes all selections, requirements, and edits. This cannot be undone."
        confirmLabel="Clear everything"
        onConfirm={() => {
          clearAll();
          setConfirmingClear(false);
        }}
        onClose={() => setConfirmingClear(false)}
      />
    </div>
  );
}
