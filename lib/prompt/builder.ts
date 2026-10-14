import { CATEGORIES, CATEGORY_MAP, optionName } from "@/lib/data/catalog";
import type { ProjectConfiguration } from "@/lib/domain";
import { stackIntel } from "@/lib/prompt/stack-intel";

function picked(sel: Record<string, string[]>, categoryId: string): string {
  const ids = sel[categoryId] ?? [];
  if (ids.length === 0) return "—";
  return ids.map((id) => optionName(categoryId, id)).join(", ");
}

function featuresList(raw: string): string {
  const items = raw
    .split("\n")
    .map((l) => l.trim().replace(/^[-*\d.)\s]+/, ""))
    .filter(Boolean);
  if (items.length === 0) return "1. (Add main features in Project Requirements)";
  return items.map((item, i) => `${i + 1}. ${item}`).join("\n");
}

function section(title: string, body: string): string {
  return `## ${title}\n\n${body}`;
}

/** Deterministic markdown prompt built from a Configuration. No LLM involved. */
export function buildPrompt(config: ProjectConfiguration): string {
  const { selections: sel, requirements: r, mode } = config;
  const standard = mode === "standard" || mode === "production";
  const production = mode === "production";

  const projectLabel =
    sel["project-type"]?.[0] && sel["project-type"][0] !== "custom"
      ? optionName("project-type", sel["project-type"][0]).toLowerCase()
      : "web application";
  const nameLine = r.projectName.trim()
    ? ` ("${r.projectName.trim()}")`
    : "";

  const parts: string[] = [
    "You are a senior full-stack software engineer.",
    "",
    `Build a production-ready ${projectLabel}${nameLine}.`,
  ];

  const overview = [
    r.description.trim() ? r.description.trim() : "(No project description provided.)",
    r.targetUsers.trim() ? `\nTarget users: ${r.targetUsers.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  parts.push("", section("Project Overview", overview));

  const stackLines = CATEGORIES.filter(
    (c) =>
      c.id !== "project-type" &&
      c.id !== "ai-skills" &&
      (sel[c.id]?.length ?? 0) > 0,
  ).map((c) => `- ${c.title}: ${picked(sel, c.id)}`);
  const intel = stackIntel(sel);
  const loadTools = picked(sel, "load-testing");
  const stackBody =
    stackLines.length > 0
      ? stackLines.join("\n")
      : "(No technologies selected yet — pick a stack and it will be described here.)";
  parts.push(
    "",
    section(
      "Technology Stack",
      [...[stackBody], ...(intel.length > 0 ? ["", ...intel.map((n) => `> ${n}`)] : [])].join("\n"),
    ),
  );

  if (standard) {
    const archId = sel["architecture"]?.[0];
    parts.push(
      "",
      section(
        "Architecture",
        `Follow ${archId ? optionName("architecture", archId) : "a clean, layered architecture"}. Separate transport, business logic, and data access; keep framework code at the edges and business rules framework-free.`,
      ),
    );
  }

  const reqLines = [
    featuresList(r.mainFeatures),
    r.businessRequirements.trim()
      ? `\nBusiness rules:\n${r.businessRequirements.trim()}`
      : "",
    r.technicalRequirements.trim()
      ? `\nTechnical constraints:\n${r.technicalRequirements.trim()}`
      : "",
    r.additionalInstructions.trim()
      ? `\nAdditional instructions:\n${r.additionalInstructions.trim()}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
  parts.push("", section("Requirements", reqLines));

  if (standard) {
    const pickedSkills = sel["ai-skills"] ?? [];
    const extraSkills = config.customSkills.filter(
      (name) => !pickedSkills.includes(name),
    );
    if (pickedSkills.length > 0 || extraSkills.length > 0) {
      const skillOptions =
        CATEGORY_MAP["ai-skills"]?.options ?? [];
      const bullets = [
        ...pickedSkills.map((id) => {
          const found = skillOptions.find((o) => o.id === id);
          return `- /${id}${found?.description ? ` — ${found.description}` : ""}`;
        }),
        ...extraSkills.map((name) => `- /${name}`),
      ];
      parts.push(
        "",
        section(
          "Agent Skills",
          [
            "Use the following agent skills when their trigger matches the work at hand — invoke the skill instead of doing the corresponding work by hand.",
            "",
            ...bullets,
          ].join("\n"),
        ),
      );
    }
  }

  if (standard) {
    const testingTools = sel["testing"] ?? [];
    const deploymentTools = sel["deployment"] ?? [];
    parts.push(
      "",
      section(
        "Development Rules",
        "- Write idiomatic, typed code in the chosen language(s); no placeholders or TODO stubs.\n- Validate every input at the boundary; fail closed with clear error messages.\n- Keep functions small and side effects explicit; prefer pure helpers where possible.",
      ),
      "",
      section(
        "Code Quality",
        "- Format and lint cleanly; fix all warnings.\n- Name things after the domain (see requirements), not after frameworks.\n- Add focused comments only where the why is non-obvious.",
      ),
      "",
      section(
        "Testing",
        [
          testingTools.length > 0
            ? `- Cover business logic with unit tests (${testingTools.map((id) => optionName("testing", id)).join(", ")}).`
            : "- Cover business logic with unit tests.",
          "- Add at least one end-to-end happy path for the core user flow.",
          ...(loadTools === "—"
            ? []
            : [`- Load-test critical paths with ${loadTools}; gate releases on the budgets.`]),
          "- Tests must pass before declaring the work done.",
        ].join("\n"),
      ),
      "",
      section(
        "Deployment",
        `- Provide a reproducible deployment${deploymentTools.length > 0 ? ` (${deploymentTools.map((id) => optionName("deployment", id)).join(", ")})` : ""} with environment-based configuration.\n- Document required environment variables and secrets; never commit secrets.`,
      ),
    );
  }

  if (production) {
    const validationId = sel["validation"]?.[0];
    parts.push(
      "",
      section(
        "Security",
        "- Authenticate every request; authorize every action (deny by default).\n- Hash passwords with a memory-hard function; store only hashes.\n- Parameterize all queries; escape all output; enforce CSRF and rate limits on mutations.",
      ),
      "",
      section(
        "Validation & Error Handling",
        `- Validate with ${validationId ? optionName("validation", validationId) : "a schema validator"} at API boundaries and re-validate at the service layer.\n- Return typed errors with stable codes; map them to correct HTTP/gRPC statuses.\n- Never leak internals (stack traces, SQL) to clients; log them server-side with correlation IDs.`,
      ),
      "",
      section(
        "Logging & Observability",
        "- Emit structured logs (level, message, correlation id, key fields).\n- Expose health/readiness endpoints and basic metrics (latency, error rate).\n- Make the happy path traceable end-to-end in logs.",
      ),
      "",
      section(
        "CI/CD",
        "- Add a CI pipeline: install, lint, typecheck, test, build.\n- Block merges on red CI; keep the main branch always deployable.",
      ),
      "",
      section(
        "Performance & Scalability",
        [
          "- Avoid N+1 queries; paginate every list; index foreign keys and hot filters.",
          "- Cache read-heavy data with explicit invalidation; set timeouts on all outbound calls.",
          ...(loadTools === "—"
            ? []
            : [`- Prove budgets with ${loadTools} before scaling out.`]),
        ].join("\n"),
      ),
    );
  }

  parts.push(
    "",
    section(
      "Deliverables",
      "- Working code implementing every requirement above.\n- README with setup, scripts, and deployment steps.\n- Tests as specified; all green.",
    ),
  );

  if (production) {
    parts.push(
      "",
      "---",
      "",
      "Before implementing the project, analyze the requirements and propose the architecture. " +
        "If you are an AI coding agent (Claude Code, Cursor, Copilot, Codex): work file by file, " +
        "keep diffs reviewable, run the test suite after each change, and stop to ask when a " +
        "requirement is ambiguous rather than guessing.",
    );
  }

  return parts.join("\n");
}
