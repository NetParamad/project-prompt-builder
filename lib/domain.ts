export type SelectionKind = "single" | "multiple";

export interface TechnologyOption {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  tags?: string[];
  compatibleWith?: string[];
  conflictsWith?: string[];
}

export interface Category {
  id: string;
  title: string;
  selection: SelectionKind;
  /** Max picks for multiple-select categories (e.g. database: 2). */
  maxSelections?: number;
  options: TechnologyOption[];
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  config: Partial<Record<string, string[]>>;
  requirements?: Partial<ProjectRequirements>;
}

export interface ProjectRequirements {
  projectName: string;
  description: string;
  targetUsers: string;
  mainFeatures: string;
  businessRequirements: string;
  technicalRequirements: string;
  additionalInstructions: string;
}

export type RequirementKey = keyof ProjectRequirements;

export type PromptMode = "basic" | "standard" | "production";

export interface ProjectConfiguration {
  selections: Record<string, string[]>;
  requirements: ProjectRequirements;
  mode: PromptMode;
  customSkills: string[];
}

export type ValidationLevel = "warn" | "info";

export interface ValidationIssue {
  level: ValidationLevel;
  ruleId: string;
  message: string;
  hint: string;
  involved: string[];
}

export interface GeneratedPrompt {
  markdown: string;
  warnings: ValidationIssue[];
  edited: boolean;
}
export const EMPTY_REQUIREMENTS: ProjectRequirements = {
  projectName: "",
  description: "",
  targetUsers: "",
  mainFeatures: "",
  businessRequirements: "",
  technicalRequirements: "",
  additionalInstructions: "",
};

/** Parses free-text custom skills: one per line, leading slashes stripped. */
export function parseCustomSkills(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim().replace(/^\/+/, ""))
    .filter(Boolean);
}
