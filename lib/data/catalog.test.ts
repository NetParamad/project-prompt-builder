import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/lib/data/catalog";

describe("catalog", () => {
  it("covers every planned category", () => {
    const ids = CATEGORIES.map((c) => c.id);
    for (const expected of [
      "project-type",
      "frontend",
      "backend",
      "language",
      "database",
      "orm",
      "auth",
      "ui",
      "state",
      "validation",
      "api",
      "testing",
      "deployment",
      "architecture",
      "ai-skills",
      "package-manager",
    ]) {
      expect(ids).toContain(expected);
    }
  });

  it("has unique option ids within each category and frontend is single-select", () => {
    for (const c of CATEGORIES) {
      const ids = c.options.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(c.options.length).toBeGreaterThan(0);
    }
    expect(
      CATEGORIES.find((c) => c.id === "frontend")?.selection,
    ).toBe("single");
    expect(
      CATEGORIES.find((c) => c.id === "database")?.maxSelections,
    ).toBe(2);
  });
});
