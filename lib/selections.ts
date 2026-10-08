export type Selections = Record<string, string[]>;

export function has(sel: Selections, category: string, option: string): boolean {
  return sel[category]?.includes(option) ?? false;
}

export function hasAny(sel: Selections, category: string, options: string[]): boolean {
  return options.some((o) => has(sel, category, o));
}
