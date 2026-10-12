# Project Prompt Builder

A visual configurator that turns project choices and requirements into a paste-ready AI coding prompt.

## Language

**Category**:
A group of related options (e.g. Frontend, Database). Owns its selection rule.
_Avoid_: Stack group, section

**Option**:
A single pickable technology inside a Category (e.g. Next.js).
_Avoid_: Stack item, tech

**Configuration**:
The user's picks (one Category → option ids) plus requirements plus mode. The input to prompt generation.
_Avoid_: Stack, setup

**Preset**:
A named seed Configuration (e.g. Next.js SaaS). Applying replaces listed Categories; user can modify after.
_Avoid_: Template (templates build prompts, presets seed configs)

**Requirements**:
The seven natural-language project fields: name, description, target users, main features, business, technical, additional instructions.

**PromptMode**:
One of Basic / Standard / Production. Controls prompt depth; Production includes an AI-agent instruction block.
_Avoid_: Level, tier

**GeneratedPrompt**:
Deterministic markdown built from a Configuration. Never calls an LLM in MVP.
_Avoid_: Output text

**ValidationIssue**:
A warn/info finding about a Configuration (e.g. sqlc + MongoDB). Never blocks except the DB max-2 cap.
_Avoid_: Error (nothing errors except over-cap)

**Agent Skill**:
A named agent capability (e.g. tdd, code-review) picked from the AI Agent Skills Category. Rendered as a `## Agent Skills` section (Standard/Production only), never in the Technology Stack list.
_Avoid_: Plugin, tool

**Custom Skill**:
A free-text skill name typed by the user (one per line). Merged with picked Agent Skills in the prompt.
_Avoid_: Manual skill
