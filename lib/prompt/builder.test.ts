import { describe, expect, it } from "vitest";
import { EMPTY_REQUIREMENTS, type ProjectConfiguration } from "@/lib/domain";
import { buildPrompt } from "@/lib/prompt/builder";

function config(
  selections: Record<string, string[]>,
  mode: ProjectConfiguration["mode"] = "standard",
  customSkills: string[] = [],
): ProjectConfiguration {
  return {
    selections,
    requirements: {
      ...EMPTY_REQUIREMENTS,
      projectName: "Acme POS",
      description: "POS for a small restaurant.",
      mainFeatures: "Orders\nPayments",
    },
    mode,
    customSkills,
  };
}

const NEXT_GO: Record<string, string[]> = {
  "project-type": ["pos"],
  frontend: ["nextjs"],
  backend: ["go"],
  language: ["typescript"],
  database: ["postgresql"],
  orm: ["sqlc"],
  auth: ["custom-jwt"],
  api: ["rest"],
  deployment: ["docker"],
};

describe("buildPrompt", () => {
  it("names the stack instead of concatenating ids", () => {
    const md = buildPrompt(config(NEXT_GO));
    expect(md).toContain("Next.js");
    expect(md).toContain("PostgreSQL");
    expect(md).not.toMatch(/\bnextjs\b/);
    expect(md).toContain("1. Orders\n2. Payments");
  });

  it("emits the Next+Go split note via stack intel", () => {
    const md = buildPrompt(config(NEXT_GO));
    expect(md).toContain("Architecture split");
  });

  it("basic mode omits Testing/Deployment sections", () => {
    const md = buildPrompt(config(NEXT_GO, "basic"));
    expect(md).not.toContain("## Testing");
    expect(md).not.toContain("## Deployment");
    expect(md).toContain("## Requirements");
  });

  it("production mode adds Security and the agent block", () => {
    const md = buildPrompt(config(NEXT_GO, "production"));
    expect(md).toContain("## Security");
    expect(md).toContain("## CI/CD");
    expect(md).toContain("AI coding agent");
  });

  it("handles an empty configuration without crashing", () => {
    const md = buildPrompt(config({}, "basic"));
    expect(md).toContain("You are a senior full-stack software engineer.");
  });

  it("renders picked skills as an Agent Skills section in standard mode", () => {
    const md = buildPrompt(config({ "ai-skills": ["tdd", "code-review"] }));
    expect(md).toContain("## Agent Skills");
    expect(md).toContain("/tdd");
    expect(md).toContain("/code-review");
    expect(md).not.toContain("- AI Agent Skills:");
  });

  it("omits the Agent Skills section in basic mode", () => {
    const md = buildPrompt(
      config({ "ai-skills": ["tdd"] }, "basic"),
    );
    expect(md).not.toContain("## Agent Skills");
  });

  it("merges custom skills and dedupes picked ones", () => {
    const md = buildPrompt(
      config({ "ai-skills": ["tdd"] }, "standard", ["tdd", "my-skill"]),
    );
    expect(md).toContain("/my-skill");
    expect(md.match(/\/tdd/g)?.length).toBe(1);
  });

  it("lists infra categories in the stack and mentions load tools", () => {
    const sel = {
      ...NEXT_GO,
      "message-queue": ["kafka"],
      cache: ["redis"],
      "load-testing": ["k6"],
    };
    const md = buildPrompt(config(sel, "production"));
    expect(md).toContain("- Message Queue: Kafka");
    expect(md).toContain("- Cache: Redis");
    expect(md).toContain("k6");
  });
});
