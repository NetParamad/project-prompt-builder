# Spec: project-prompt-builder MVP

Status: ready-for-agent

## Problem Statement

Developers starting a new project waste time translating stack choices and rough requirements into a coherent brief they can paste into an AI coding agent. Ad-hoc prompts omit architecture, contradict themselves (e.g. sqlc + MongoDB), and under-specify testing, deployment, and quality bars.

## Solution

A single-page visual configurator (Select → Configure → Generate → Copy) with 14 Categories of Options, 9 Presets, 7 Requirements fields, 3 PromptModes, a live GeneratedPrompt preview, warn-only ValidationIssues, and copy/export. All client-side, deterministic, no backend.

## User Stories

1. As a developer, I want to pick a Preset (e.g. Next.js SaaS), so that my Configuration is pre-filled and I can tweak it.
2. As a developer, I want single-select Categories (Frontend, Language, Database-primary, ORM, Auth, API, Architecture, PackageManager, ProjectType) to behave as radio-cards, so that I cannot pick contradictory primaries.
3. As a developer, I want multi-select Categories (Backend, UI, State, Validation-lib, Testing, Deployment, plus second Database) to toggle, so that polyglot stacks are expressible.
4. As a developer, I want Database capped at two Options with a multi-DB info notice, so that accidental triple-DB configs are prevented but intentional dual-DB is allowed.
5. As a developer, I want to fill 7 Requirements fields (name, description, target users, main features newline list, business, technical, additional), so that the prompt carries real project context.
6. As a developer, I want a live GeneratedPrompt preview that updates as I configure, so that I see prompt quality immediately.
7. As a developer, I want to switch PromptMode Basic/Standard/Production, so that I control prompt depth; Production adds security/observability/CI-CD plus an AI-agent instruction block.
8. As a developer, I want ValidationIssues shown inline with explanations (never blocking except DB cap), so that I can decide to keep unusual combos knowingly.
9. As a developer, I want Copy to clipboard, Clear, Regenerate (deterministic rebuild, confirm if manually edited), Export Markdown, Export JSON, so that handoff to agents is frictionless.
10. As a developer, I want to manually edit the prompt with an Edited badge and Reset, so that I can polish before copying.
11. As a developer, I want dark/light mode, responsive layout (tabs + sticky copy bar on mobile), keyboard-operable cards, so that the tool is usable everywhere.
12. As a returning user, I want my Configuration persisted to localStorage, so that refresh keeps my work.

## Implementation Decisions

- Modules: data layer (Categories + Options + Presets as structured data), zustand persisted store for Configuration, prompt pipeline (normalize → stack-intel → section builders → assemble by mode), compat rule engine (pure `evaluate` returning ValidationIssues), configurator UI (PresetBar, CategorySection, OptionCard, RequirementsForm), prompt panel (ModeSwitch, ValidationList, PromptPreview, OutputActions), export helpers.
- Key interfaces: `buildPrompt(config: ProjectConfiguration): string`; `evaluateRules(config): ValidationIssue[]`; store actions `toggleOption(categoryId, optionId)`, `applyPreset(presetId)`, `setRequirement(key, value)`, `setMode(mode)`, `clearAll()`. Data shapes per CONTEXT.md: Category, Option, Preset, Configuration, PromptMode, GeneratedPrompt, ValidationIssue.
- Technical clarifications: Next.js App Router + TS strict + Tailwind + shadcn/ui; zustand + persist middleware; no server components for state, no backend, deploy Vercel; `<pre>` preview in MVP (react-markdown deferred); Frontend single-select, Database max 2.
- Architecture: UI components dumb; all prompt/compat logic in `lib/` pure functions for testability. Seams: `buildPrompt` and `evaluateRules` are the two test seams.
- Preset apply semantics: replace listed Categories, leave others; seed Requirements where provided; toast confirmation.
- Regenerate semantics: deterministic rebuild from Configuration; if manual edit present, confirm-discard.

## Testing Decisions

- Good tests assert external behavior: given a Configuration fixture (e.g. Next+Go+Postgres+sqlc+Docker), `buildPrompt` output contains expected sections and stack-intel paragraphs (split deployment note), and does not contain contradictions; `evaluateRules` returns expected warn/info per rule.
- Modules tested: `lib/prompt/*` and `lib/compat/*` with fixture configs per Preset; store reducer transitions (toggle single vs multi, DB cap, preset apply, clear).
- Prior art: none yet (greenfield); use Vitest + Testing Library once scaffolded; keep UI tests to smoke (renders 14 sections, preset applies, copy writes clipboard mock).

## Out of Scope

Per-tool agent optimizers (Claude/Cursor/Copilot variants), share-via-URL, accounts/history, LLM polish/critique, custom user categories, org presets, analytics, i18n, Figma import, cost estimator, react-markdown rich preview.

## Further Notes

Prompt quality is the core value, not picker chrome. Stack-intel conditionals to implement first: nextjs+go split deployment, supabase implies postgres+auth, sqlc requires SQL DB, tRPC requires TS backend, better-auth is TS-first, prisma vs gorm/drizzle exclusivity hints. See docs/adr/0001–0004 and CONTEXT.md for locked vocabulary.
