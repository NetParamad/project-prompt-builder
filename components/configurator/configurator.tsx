"use client";

import * as React from "react";
import { CATEGORIES } from "@/lib/data/catalog";
import { useConfig } from "@/lib/store/useConfig";
import { CategorySection } from "@/components/configurator/category-section";
import { PresetBar } from "@/components/configurator/preset-bar";
import { RequirementsForm } from "@/components/configurator/requirements-form";

export function Configurator() {
  const selections = useConfig((s) => s.selections);
  const toggleOption = useConfig((s) => s.toggleOption);
  const [query, setQuery] = React.useState("");
  const [cappedId, setCappedId] = React.useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const visible = CATEGORIES.map((c) => ({
    category: c,
    options: q
      ? c.options.filter(
          (o) =>
            o.name.toLowerCase().includes(q) ||
            o.description?.toLowerCase().includes(q),
        )
      : c.options,
  })).filter((row) => row.options.length > 0);

  function handleToggle(categoryId: string, optionId: string) {
    const result = toggleOption(categoryId, optionId);
    setCappedId(result === "capped" ? categoryId : null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PresetBar />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter technologies…"
        aria-label="Filter technologies"
        className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-400"
      />
      {visible.map(({ category }) => (
        <CategorySection
          key={category.id}
          category={category}
          selected={selections[category.id] ?? []}
          capped={cappedId === category.id}
          onToggle={(optionId) => handleToggle(category.id, optionId)}
        />
      ))}
      {visible.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No technologies match “{query}”.
        </p>
      )}
      <RequirementsForm />
    </div>
  );
}
