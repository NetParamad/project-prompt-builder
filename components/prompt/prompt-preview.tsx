"use client";

import * as React from "react";
import { copyText } from "@/lib/export/clipboard";
import { downloadFile, slugify } from "@/lib/export/files";
import { parseCustomSkills } from "@/lib/domain";
import { encodeShareConfig } from "@/lib/share/codec";
import { useGeneratedPrompt, wordCount } from "@/lib/prompt/useGeneratedPrompt";
import { useConfig } from "@/lib/store/useConfig";
import { evaluateRules } from "@/lib/compat/rules";
import { Button } from "@/components/ui/button";
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
  const [shared, setShared] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");

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

  async function handleShare() {
    const state = useConfig.getState();
    const param = encodeShareConfig({
      selections: state.selections,
      requirements: state.requirements,
      mode: state.mode,
      customSkillsRaw: state.customSkillsRaw,
    });
    const url = `${window.location.origin}${window.location.pathname}?c=${param}`;
    setShared(await copyText(url));
    window.setTimeout(() => setShared(false), 2000);
  }

  function handleClear() {
    if (window.confirm("Clear the entire configuration?")) clearAll();
  }

  function handleRegenerate() {
    if (edited && !window.confirm("Discard your manual edits and rebuild?")) {
      return;
    }
    clearManualEdit();
    setEditing(false);
  }

  function exportMarkdown() {
    const name = useConfig.getState().requirements.projectName;
    downloadFile(`${slugify(name)}-prompt.md`, markdown, "text/markdown;charset=utf-8");
  }

  function exportJson() {
    const state = useConfig.getState();
    const name = state.requirements.projectName;
    downloadFile(
      `${slugify(name)}-prompt.json`,
      JSON.stringify(
        {
          configuration: {
            selections: state.selections,
            requirements: state.requirements,
            mode: state.mode,
            customSkills: parseCustomSkills(state.customSkillsRaw),
          },
          markdown,
          warnings: issues,
        },
        null,
        2,
      ),
      "application/json;charset=utf-8",
    );
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
          className="max-h-[60vh] rounded-md border border-zinc-300 bg-white p-4 font-mono text-xs leading-relaxed outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      ) : (
        <pre
          aria-label="Generated prompt"
          className="max-h-[60vh] overflow-auto rounded-md bg-zinc-100 p-4 text-xs leading-relaxed whitespace-pre-wrap dark:bg-zinc-900"
        >
          {markdown}
        </pre>
      )}

      <div className="flex flex-wrap gap-2">
        {editing ? (
          <>
            <Button
              size="sm"
              onClick={() => {
                setManualEdit(draft);
                setEditing(false);
              }}
            >
              Save edits
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" onClick={startEditing}>
            Edit manually
          </Button>
        )}
        {edited && !editing && (
          <Button size="sm" variant="outline" onClick={clearManualEdit}>
            Reset edits
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={handleRegenerate}>
          Regenerate
        </Button>
        <Button size="sm" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy to clipboard"}
        </Button>
        <Button size="sm" variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button size="sm" variant="ghost" onClick={exportMarkdown}>
          Export .md
        </Button>
        <Button size="sm" variant="ghost" onClick={exportJson}>
          Export .json
        </Button>
        <Button size="sm" variant="ghost" onClick={handleShare}>
          {shared ? "Link copied!" : "Copy share link"}
        </Button>
      </div>
    </div>
  );
}
