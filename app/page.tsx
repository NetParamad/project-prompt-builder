"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Configurator } from "@/components/configurator/configurator";
import { PromptPreview } from "@/components/prompt/prompt-preview";
import { copyText } from "@/lib/export/clipboard";
import { useGeneratedPrompt } from "@/lib/prompt/useGeneratedPrompt";
import { evaluateRules } from "@/lib/compat/rules";
import { useConfig } from "@/lib/store/useConfig";
import { cn } from "@/lib/utils";

type Pane = "configure" | "prompt";

export default function Home() {
  const [pane, setPane] = React.useState<Pane>("configure");
  const markdown = useGeneratedPrompt();
  const selections = useConfig((s) => s.selections);
  const [copied, setCopied] = React.useState(false);
  const issueCount = React.useMemo(
    () => evaluateRules(selections).length,
    [selections],
  );

  async function handleHeaderCopy() {
    setCopied(await copyText(markdown));
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-zinc-900 px-2 py-1 font-mono text-xs font-bold text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
              PPB
            </span>
            <span className="text-sm font-semibold">Project Prompt Builder</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" onClick={handleHeaderCopy}>
              {copied ? "Copied!" : "Copy prompt"}
            </Button>
          </div>
        </div>
        <nav
          aria-label="Primary"
          className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-1 px-4 pb-2 md:hidden"
        >
          {(["configure", "prompt"] as Pane[]).map((p) => (
            <Button
              key={p}
              variant={pane === p ? "default" : "secondary"}
              size="sm"
              onClick={() => setPane(p)}
              aria-pressed={pane === p}
            >
              {p === "configure" ? "Configure" : "Prompt"}
            </Button>
          ))}
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-4 p-4 md:grid-cols-[1fr_1fr]">
        <section
          aria-label="Configuration"
          className={cn(pane === "configure" ? "block" : "hidden", "md:block")}
        >
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Configurator />
            </CardContent>
          </Card>
        </section>

        <section
          aria-label="Generated prompt"
          className={cn(pane === "prompt" ? "block" : "hidden", "md:block")}
        >
          <Card className="md:sticky md:top-20">
            <CardHeader>
              <CardTitle>Generated prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <PromptPreview />
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="sticky bottom-0 z-10 border-t border-zinc-200 bg-white/90 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400" role="status">
            {issueCount === 0
              ? "Stack looks good"
              : `${issueCount} compatibility note${issueCount > 1 ? "s" : ""}`}
          </span>
          <Button size="sm" onClick={handleHeaderCopy}>
            {copied ? "Copied!" : "Copy prompt"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
