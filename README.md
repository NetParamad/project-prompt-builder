[English](README.md) | [ไทย](README.th.md)

# Project Prompt Builder

Visually select your project stack and generate a paste-ready AI coding prompt.
Workflow: **Select → Configure → Generate → Copy**.

## Overview

Project Prompt Builder (PPB) is a single-page, fully client-side web app that turns
your technology picks and rough project notes into a coherent, deterministic Markdown
brief you can paste into an AI coding agent (Claude Code, Cursor, GitHub Copilot, Codex).

Developers starting a new project waste time translating stack choices into a brief
that an agent can act on. Ad-hoc prompts omit architecture, contradict themselves
(for example `sqlc` + MongoDB), and under-specify testing, deployment, and quality bars.
PPB addresses this by pairing a structured configurator with a rules engine that warns
about known-fragile combinations and a template pipeline that always produces the same
prompt for the same input.

There is **no LLM, no backend, and no database**. Everything runs in the browser and
persists to `localStorage`.

## Features

- **21 technology categories** with single-select radio cards and multi-select toggle cards.
- **12 named presets** plus a blank/custom option that seed the configuration (you can
  always tweak afterwards).
- **7 natural-language requirement fields**: project name, description, target users,
  main features, business requirements, technical requirements, and additional instructions.
- **3 prompt modes**: Basic, Standard, and Production (see below).
- **Live prompt preview** that updates as you configure, with word count, character count,
  an issue count, and an "Edited" badge when you have hand-edited the output.
- **Warn-only compatibility notes** that explain the concern and let you jump straight to
  the relevant category. Nothing blocks except the Database two-item cap.
- **Manual editing**: edit the generated prompt in place, save it, and reset back to the
  generated version at any time.
- **Search / filter** technologies by name or description.
- **Copy to clipboard** with a hidden-textarea fallback for restrictive environments.
- **Share links**: opening a URL with a `?c=` parameter (base64url JSON) applies the full
  configuration, overriding stored state. A link-encoding helper exists in `lib/share/codec.ts`;
  there is currently no UI button for generating one.
- **Dark / light theme** with OS preference detection and localStorage persistence.
- **Responsive layout**: two panes side by side on desktop, tab switcher with a sticky copy
  bar on mobile.
- **Persistence**: your configuration survives a refresh via the persisted zustand store.
- **SEO/GEO**: metadata, Open Graph and Twitter cards, JSON-LD `SoftwareApplication`, a
  `sitemap.xml`, a `robots.txt`, and `public/llms.txt` guidance for AI assistants.

## Tech stack

| Area          | Choice                                                                        |
| ------------- | ----------------------------------------------------------------------------- |
| Framework     | [Next.js](https://nextjs.org) 16.4.0 (App Router, Turbopack)                  |
| UI library    | [React](https://react.dev) 19.3.0                                             |
| Language      | TypeScript 5 (strict, `noEmit`)                                               |
| Styling       | [Tailwind CSS](https://tailwindcss.com) v4 with `@tailwindcss/turbopack`      |
| State         | [zustand](https://zustand-demo.pmnd.rs) 5 with the `persist` middleware       |
| Icons         | [lucide-react](https://lucide.dev)                                            |
| UI utilities  | `class-variance-authority`, `clsx`, `tailwind-merge` (`cn` helper)            |
| Testing       | [Vitest](https://vitest.dev) 5 + Testing Library + jsdom                      |
| Linting       | ESLint 9 with `eslint-config-next`                                            |

### Prompt modes

| Mode           | Contents                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------- |
| **Basic**      | Short prompt: role, project overview, technology stack with integration notes, requirements, deliverables. |
| **Standard**   | Adds architecture guidance, agent skills, development rules, code quality, testing, and deployment. |
| **Production** | Adds security, validation/error handling, logging/observability, CI/CD, and performance/scalability, plus a closing AI-agent instruction block. |

## Project structure

```
.
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout, fonts, metadata, JSON-LD, theme script
│   ├── page.tsx              # Main screen (configurator + prompt panes)
│   ├── globals.css           # Tailwind import, theme tokens, keyframe animations
│   ├── robots.ts             # robots.txt route
│   └── sitemap.ts            # sitemap.xml route
├── components/
│   ├── configurator/         # PresetBar, CategorySection, OptionCard, RequirementsForm,
│   │                         # CustomSkillsInput, and the Configurator shell
│   ├── prompt/               # ModeSwitch, ValidationList, PromptPreview
│   ├── ui/                   # Primitive Button, Card, ConfirmDialog
│   ├── shared-config-loader.tsx  # Applies a `?c=` Share Link on load
│   └── theme-toggle.tsx
├── lib/
│   ├── data/                 # catalog.ts (categories/options), presets.ts, logos.ts
│   ├── store/useConfig.ts    # Persisted zustand Configuration store
│   ├── prompt/               # builder.ts, stack-intel.ts, useGeneratedPrompt.ts
│   ├── compat/rules.ts       # Warn-only compatibility rule engine
│   ├── share/codec.ts        # base64url encode/decode + sanitizer for `?c=`
│   ├── export/clipboard.ts   # Clipboard copy with fallback
│   ├── domain.ts             # Shared domain types and helpers
│   ├── selections.ts         # Selection query helpers and backend runtime sets
│   ├── site.ts               # Canonical site URL resolution
│   └── utils.ts              # `cn` class-name helper
├── docs/
│   ├── adr/                  # Architecture Decision Records 0001–0004
│   └── agents/               # Issue-tracker, triage-label, and domain docs
├── public/
│   ├── logos/                # Vendored brand SVGs (light + optional dark variants)
│   └── llms.txt              # Guidance for AI assistants
├── scripts/fetch-logos.mjs   # Re-vendors brand SVGs from svgl.app
├── .scratch/                 # Local markdown issue tracker (specs and tickets)
├── CONTEXT.md                # Locked project vocabulary
└── AGENTS.md                 # Agent instructions for this repo
```

## Getting started

### Prerequisites

- Node.js (version compatible with Next.js 16)
- npm (a `package-lock.json` is committed)

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script              | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Development server (Turbopack)                      |
| `npm run build`     | Production build                                    |
| `npm run start`     | Serve the production build                          |
| `npm run test`      | Vitest suite (unit + component)                     |
| `npm run lint`      | ESLint                                              |
| `npm run typecheck` | `tsc --noEmit`                                      |
| `npm run fetch-logos` | Refresh vendored tech logos from svgl.app         |

## Environment variables

| Name                   | Purpose                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for metadata, sitemap, and share links. Falls back to `https://project-prompt-builder.vercel.app` when unset. |

See `.env.example` for the template. Never commit real secret values.

## Usage

1. **Select** — pick a preset (or start blank), then choose technologies. Single-select
   categories behave like radio buttons; multi-select categories toggle. Database is capped
   at two options.
2. **Configure** — fill in the seven requirement fields. Custom agent skills can be typed
   one per line (leading slashes are stripped).
3. **Generate** — the preview rebuilds deterministically on every change. Switch modes to
   control prompt depth.
4. **Copy** — copy the prompt, or edit it manually first. Clearing the configuration asks
   for confirmation.

### Categories and selection rules

- **Single-select**: Project Type, Frontend, Language, ORM/Database Tools, Cache,
  Authentication, Validation, API, Architecture, Package Manager.
- **Multi-select**: Backend, UI, State Management, Testing, Load Testing, Deployment,
  CI/CD, Observability, Message Queue, AI Agent Skills.
- **Multi-select capped at 2**: Database (a second pick is flagged as a multi-database
  architecture, not blocked).

### Share links

A Share Link is a URL whose `?c=` parameter holds the full Configuration as base64url JSON.
Opening it applies the Configuration, winning over stored state; invalid payloads are
ignored so stored state applies instead. Encoding is provided by `encodeShareConfig`, but no
UI currently exposes it.

### Persistence and theme

The configuration is stored under the localStorage key `ppb-config-v1` (selections,
requirements, mode, and custom skills). The theme preference is stored under `ppb-theme`.

## How it works

The prompt and compatibility logic live in `lib/` as pure functions so they can be tested
without the UI. The two main seams are:

- `buildPrompt(config)` in `lib/prompt/builder.ts` — deterministic template pipeline
  (normalize → stack-intel notes → section builders → assemble by mode). Never calls an LLM.
- `evaluateRules(selections)` in `lib/compat/rules.ts` — warn-only rule engine that returns
  `ValidationIssue[]` (e.g. `sqlc` with a non-SQL database, Vercel with a non-Node backend,
  tRPC without a Node backend).

UI components are kept dumb and render over these seams. See `CONTEXT.md` for the locked
vocabulary and `docs/adr/` for the recorded decisions.

## Testing

Tests are written with Vitest and Testing Library, running in a jsdom environment with
globals enabled and `@testing-library/jest-dom` set up (`vitest.setup.ts`). The `@` import
alias resolves to the repository root. Test files live next to the code they cover
(`*.test.ts` / `*.test.tsx`) across `lib/` and `components/`.

```bash
npm run test
```

## Deployment

```bash
npm run build
```

Deployable to Vercel as-is (no backend, no database). Set `NEXT_PUBLIC_SITE_URL` to the
canonical production URL for correct metadata and sitemap output.

## Notes

- **Domain vocabulary** is fixed in `CONTEXT.md` (Category, Option, Configuration, Preset,
  Requirements, PromptMode, GeneratedPrompt, ValidationIssue, Agent Skill, Custom Skill,
  Share Link).
- **Architecture decisions** are recorded in `docs/adr/` (0001–0004).
- **Issue tracking** is a local markdown tracker under `.scratch/`; see `docs/agents/`.
- **Logos** are vendored from [svgl.app](https://svgl.app); `npm run fetch-logos` refreshes
  them. Options without a logo render a letter tile.
- **Agent rules** for this repo are in `AGENTS.md`.

## Credits

Technology logos vendored from [svgl.app](https://svgl.app).
