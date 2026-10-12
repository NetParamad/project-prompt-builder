import { CATEGORY_MAP } from "@/lib/data/catalog";
import {
  EMPTY_REQUIREMENTS,
  type ProjectRequirements,
  type PromptMode,
  type RequirementKey,
} from "@/lib/domain";

export interface SharedConfig {
  selections: Record<string, string[]>;
  requirements: ProjectRequirements;
  mode: PromptMode;
  customSkillsRaw: string;
}

const MODES: PromptMode[] = ["basic", "standard", "production"];
const REQUIREMENT_KEYS = Object.keys(EMPTY_REQUIREMENTS) as RequirementKey[];

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(param: string): string {
  const base64 = param.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function sanitizeSelections(raw: unknown): Record<string, string[]> {
  if (typeof raw !== "object" || raw === null) return {};
  const out: Record<string, string[]> = {};
  for (const [categoryId, ids] of Object.entries(raw as Record<string, unknown>)) {
    const category = CATEGORY_MAP[categoryId];
    if (!category || !Array.isArray(ids)) continue;
    const known = (ids as unknown[]).filter(
      (id): id is string =>
        typeof id === "string" &&
        category.options.some((o) => o.id === id),
    );
    const limit =
      category.selection === "single"
        ? 1
        : (category.maxSelections ?? known.length);
    const picked = known.slice(0, limit);
    if (picked.length > 0) out[categoryId] = picked;
  }
  return out;
}

function sanitizeRequirements(raw: unknown): ProjectRequirements {
  const out = { ...EMPTY_REQUIREMENTS };
  if (typeof raw !== "object" || raw === null) return out;
  for (const key of REQUIREMENT_KEYS) {
    const value = (raw as Record<string, unknown>)[key];
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

/**
 * Validates an unknown value into a SharedConfig (the `?c=` payload shape).
 * Returns null when there is nothing usable.
 */
export function sanitizeSharedConfig(raw: unknown): SharedConfig | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }
  const record = raw as Record<string, unknown>;
  const mode: PromptMode = MODES.includes(record["mode"] as PromptMode)
    ? (record["mode"] as PromptMode)
    : "standard";
  return {
    selections: sanitizeSelections(record["selections"]),
    requirements: sanitizeRequirements(record["requirements"]),
    mode,
    customSkillsRaw:
      typeof record["customSkillsRaw"] === "string"
        ? record["customSkillsRaw"]
        : "",
  };
}
/** Encodes a Configuration into a URL-safe `?c=` param. */
export function encodeShareConfig(input: SharedConfig): string {
  return toBase64Url(
    JSON.stringify({
      selections: input.selections,
      requirements: input.requirements,
      mode: input.mode,
      customSkillsRaw: input.customSkillsRaw,
    }),
  );
}

/**
 * Decodes and sanitizes a `?c=` param. Returns null for garbage so callers
 * can silently fall back to stored state.
 */
export function decodeShareConfig(param: string): SharedConfig | null {
  if (!param) return null;
  try {
    return sanitizeSharedConfig(JSON.parse(fromBase64Url(param)));
  } catch {
    return null;
  }
}
