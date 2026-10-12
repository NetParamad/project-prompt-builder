# Project Prompt Builder

Visually select your project stack and generate a paste-ready AI coding prompt.
Workflow: **Select → Configure → Generate → Copy**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script            | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Development server                    |
| `npm run build`   | Production build                      |
| `npm run test`    | Vitest suite (unit + component)       |
| `npm run lint`    | ESLint                                |
| `npm run typecheck` | `tsc --noEmit`                      |

## How it works

* `lib/data/` — Categories, Options, and Presets as structured data (never hardcoded in UI).
* `lib/store/` — zustand persisted Configuration store (Frontend single-select, Database max 2).
* `lib/prompt/` — deterministic prompt pipeline (`normalize → stack-intel → sections → assemble by mode`). No LLM.
* `lib/compat/` — warn-only rule engine (`Warning → Explain → Let the user decide`).
* `components/configurator/` + `components/prompt/` — dumb UI over the above seams.

Modes: Basic / Standard / Production (Production adds security, observability, CI/CD, and an AI-agent block). See `CONTEXT.md` and `docs/adr/` for locked vocabulary and decisions; `.scratch/prompt-builder-mvp/` holds the spec and tickets.

## Deploy

```bash
npm run build
```

Deployable to Vercel as-is (no backend, no database).

## Credits

Technology logos vendored from [svgl.app](https://svgl.app) (`npm run fetch-logos` refreshes them).
