import { describe, expect, it } from "vitest";
import { CATEGORY_MAP } from "@/lib/data/catalog";
import { PRESETS } from "@/lib/data/presets";

describe("presets", () => {
  it("every referenced option id exists in the catalog", () => {
    for (const preset of PRESETS) {
      expect(preset.name.trim().length).toBeGreaterThan(0);
      for (const [categoryId, optionIds] of Object.entries(preset.config)) {
        const category = CATEGORY_MAP[categoryId];
        expect(category, `${preset.id}: unknown category ${categoryId}`).toBeDefined();
        for (const optionId of optionIds ?? []) {
          const found = category.options.some((o) => o.id === optionId);
          expect(found, `${preset.id}: unknown option ${categoryId}/${optionId}`).toBe(true);
        }
      }
    }
  });

  it("covers the real-world popular stacks", () => {
    const ids = PRESETS.map((p) => p.id);
    for (const expected of ["t3-stack", "laravel-fullstack", "dotnet-react"]) {
      expect(ids).toContain(expected);
    }
  });
});
