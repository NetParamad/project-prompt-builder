import type { ValidationIssue } from "@/lib/domain";
import { has, hasAny, type Selections } from "@/lib/selections";

interface Rule {
  id: string;
  when: (sel: Selections) => boolean;
  issue: (sel: Selections) => Omit<ValidationIssue, "level" | "ruleId"> & {
    level: ValidationIssue["level"];
  };
}

const NON_NODE_BACKENDS = ["go", "laravel", "dotnet"];
const NODE_BACKENDS = ["nodejs", "express", "nestjs"];

const RULES: Rule[] = [
  {
    id: "multi-db",
    when: (sel) => (sel["database"]?.length ?? 0) > 1,
    issue: () => ({
      level: "info",
      message: "Multiple databases selected — this is a multi-database architecture.",
      hint: "Designate one database as the system of record per entity and document which data lives where.",
      involved: ["database"],
    }),
  },
  {
    id: "sqlc-nodoc",
    when: (sel) =>
      has(sel, "orm", "sqlc") &&
      !hasAny(sel, "database", ["postgresql", "mysql", "sqlite"]),
    issue: () => ({
      level: "warn",
      message: "sqlc is SQL-oriented and does not work with the selected database.",
      hint: "Switch to PostgreSQL/MySQL, or pick a MongoDB ODM instead of sqlc.",
      involved: ["orm", "database"],
    }),
  },
  {
    id: "vercel-go",
    when: (sel) =>
      has(sel, "deployment", "vercel") && hasAny(sel, "backend", NON_NODE_BACKENDS),
    issue: () => ({
      level: "info",
      message: "Vercel hosts the frontend, but the non-Node backend needs separate deployment.",
      hint: "Deploy the API with Docker on a VPS or container service and point the frontend at its URL.",
      involved: ["deployment", "backend"],
    }),
  },
  {
    id: "betterauth-go",
    when: (sel) =>
      has(sel, "auth", "better-auth") &&
      hasAny(sel, "backend", NON_NODE_BACKENDS) &&
      !hasAny(sel, "backend", NODE_BACKENDS),
    issue: () => ({
      level: "warn",
      message: "Better Auth is TypeScript-first and fits awkwardly with a non-Node backend.",
      hint: "Use Custom JWT (or a backend-native session library) unless a Node layer owns auth.",
      involved: ["auth", "backend"],
    }),
  },
  {
    id: "go-orm-no-go",
    when: (sel) =>
      hasAny(sel, "orm", ["gorm", "sqlc"]) && !has(sel, "backend", "go"),
    issue: () => ({
      level: "warn",
      message: "A Go database tool is selected without a Go backend.",
      hint: "Add Go to Backend, or switch to Drizzle/Prisma for a TypeScript stack.",
      involved: ["orm", "backend"],
    }),
  },
  {
    id: "trpc-non-ts",
    when: (sel) =>
      has(sel, "api", "trpc") &&
      hasAny(sel, "backend", NON_NODE_BACKENDS) &&
      !hasAny(sel, "backend", NODE_BACKENDS),
    issue: () => ({
      level: "warn",
      message: "tRPC needs a TypeScript backend.",
      hint: "Add a Node backend, or use REST (OpenAPI) / GraphQL for this service boundary.",
      involved: ["api", "backend"],
    }),
  },
  {
    id: "supabase-orm",
    when: (sel) =>
      has(sel, "auth", "supabase-auth") &&
      hasAny(sel, "orm", ["prisma", "drizzle"]),
    issue: () => ({
      level: "info",
      message: "Supabase Auth pairs with Supabase Postgres — an extra ORM may be redundant.",
      hint: "Prefer the Supabase client directly, or keep the ORM only for migrations outside Supabase.",
      involved: ["auth", "orm", "database"],
    }),
  },
  {
    id: "k8s-no-docker",
    when: (sel) =>
      has(sel, "deployment", "kubernetes") && !has(sel, "deployment", "docker"),
    issue: () => ({
      level: "info",
      message: "Kubernetes selected without Docker — container images still need building.",
      hint: "Add Docker (or another OCI builder) to produce the images Kubernetes deploys.",
      involved: ["deployment"],
    }),
  },
];

/** Evaluates every rule against the selections. Warn-only; never throws. */
export function evaluateRules(sel: Selections): ValidationIssue[] {
  return RULES.filter((r) => {
    try {
      return r.when(sel);
    } catch {
      return false;
    }
  }).map((r) => ({ ...r.issue(sel), ruleId: r.id }));
}
