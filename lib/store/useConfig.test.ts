import { beforeEach, describe, expect, it } from "vitest";
import { parseCustomSkills } from "@/lib/domain";
import { useConfig } from "@/lib/store/useConfig";

beforeEach(() => {
  useConfig.getState().clearAll();
});

describe("toggleOption", () => {
  it("single-select replaces the previous pick", () => {
    const s = useConfig.getState();
    expect(s.toggleOption("frontend", "nextjs")).toBe("selected");
    expect(s.toggleOption("frontend", "react")).toBe("selected");
    expect(useConfig.getState().selections["frontend"]).toEqual(["react"]);
  });

  it("single-select toggles off when re-picking", () => {
    const s = useConfig.getState();
    s.toggleOption("frontend", "nextjs");
    expect(useConfig.getState().toggleOption("frontend", "nextjs")).toBe(
      "deselected",
    );
    expect(useConfig.getState().selections["frontend"]).toEqual([]);
  });

  it("multi-select toggles independently", () => {
    const s = useConfig.getState();
    s.toggleOption("ui", "tailwind");
    s.toggleOption("ui", "shadcn");
    expect(useConfig.getState().selections["ui"]).toEqual([
      "tailwind",
      "shadcn",
    ]);
    s.toggleOption("ui", "tailwind");
    expect(useConfig.getState().selections["ui"]).toEqual(["shadcn"]);
  });

  it("database caps at two selections", () => {
    const s = useConfig.getState();
    s.toggleOption("database", "postgresql");
    s.toggleOption("database", "mongodb");
    expect(
      useConfig.getState().toggleOption("database", "mysql"),
    ).toBe("capped");
    expect(useConfig.getState().selections["database"]).toEqual([
      "postgresql",
      "mongodb",
    ]);
  });

  it("ignores unknown category or option", () => {
    expect(useConfig.getState().toggleOption("nope", "x")).toBe("ignored");
    expect(useConfig.getState().toggleOption("frontend", "x")).toBe("ignored");
  });
});

describe("requirements and mode", () => {
  it("setRequirement updates one field", () => {
    useConfig.getState().setRequirement("projectName", "Acme POS");
    expect(useConfig.getState().requirements.projectName).toBe("Acme POS");
  });

  it("clearAll resets everything", () => {
    const s = useConfig.getState();
    s.toggleOption("frontend", "nextjs");
    s.setRequirement("projectName", "x");
    s.setMode("production");
    s.setCustomSkillsRaw("my-skill");
    s.clearAll();
    const after = useConfig.getState();
    expect(after.selections).toEqual({});
    expect(after.requirements.projectName).toBe("");
    expect(after.mode).toBe("standard");
    expect(after.customSkillsRaw).toBe("");
  });
});

describe("custom skills", () => {
  it("stores raw text and parses one skill per line", () => {
    useConfig.getState().setCustomSkillsRaw("/tdd\nmy-team-skill\n");
    expect(useConfig.getState().customSkillsRaw).toBe("/tdd\nmy-team-skill\n");
    expect(
      parseCustomSkills(useConfig.getState().customSkillsRaw),
    ).toEqual(["tdd", "my-team-skill"]);
  });

  it("toggles ai-skills like any multi-select category", () => {
    useConfig.getState().toggleOption("ai-skills", "tdd");
    useConfig.getState().toggleOption("ai-skills", "code-review");
    expect(useConfig.getState().selections["ai-skills"]).toEqual([
      "tdd",
      "code-review",
    ]);
  });
});
