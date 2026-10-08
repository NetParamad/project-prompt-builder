import { describe, expect, it } from "vitest";
import { EMPTY_REQUIREMENTS, type ProjectConfiguration } from "@/lib/domain";
import { buildPrompt } from "@/lib/prompt/builder";

function config(
  selections: Record<string, string[]>,
  mode: ProjectConfiguration["mode"] = "standard",
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
});
