"use client";

import type { Category } from "@/lib/domain";
import { OptionCard } from "@/components/configurator/option-card";

interface CategorySectionProps {
  category: Category;
  selected: string[];
  capped: boolean;
  onToggle: (optionId: string) => void;
}

export function CategorySection({ category, selected, capped, onToggle }: CategorySectionProps) {
  return (
    <section
      id={`category-${category.id}`}
      aria-label={category.title}
      className="flex animate-pane-in scroll-mt-24 flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{category.title}</h3>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {category.selection === "single"
            ? "Single"
            : category.maxSelections
              ? `Multi · max ${category.maxSelections}`
              : "Multi"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {category.options.map((option) => (
          <OptionCard
            key={option.id}
            id={option.id}
            name={option.name}
            description={option.description}
            selected={selected.includes(option.id)}
            onToggle={() => onToggle(option.id)}
          />
        ))}
      </div>
      {capped && (
        <p role="status" className="text-xs text-amber-800 dark:text-amber-400">
          {category.title} is capped at {category.maxSelections} — deselect one
          to pick another.
        </p>
      )}
    </section>
  );
}
