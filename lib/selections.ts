export type Selections = Record<string, string[]>;

export function has(sel: Selections, category: string, option: string): boolean {
  return sel[category]?.includes(option) ?? false;
}

export function hasAny(sel: Selections, category: string, options: string[]): boolean {
  return options.some((o) => has(sel, category, o));
}

/** Backends sharing the Node.js runtime. */
export const NODE_BACKENDS = ["nodejs", "express", "nestjs", "nextjs"];

/** Backends needing their own runtime/service. */
export const NON_NODE_BACKENDS = ["go", "laravel", "dotnet", "spring-boot"];
