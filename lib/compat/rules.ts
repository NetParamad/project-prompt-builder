import type { ValidationIssue } from "@/lib/domain";
import {
  has,
  hasAny,
  NODE_BACKENDS,
  NON_NODE_BACKENDS,
  type Selections,
} from "@/lib/selections";

interface Rule {
  id: string;
  when: (sel: Selections) => boolean;
  issue: (sel: Selections) => Omit<ValidationIssue, "level" | "ruleId"> & {
    level: ValidationIssue["level"];
  };
}

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
  {
    id: "mq-no-home",
    when: (sel) =>
      (sel["message-queue"]?.length ?? 0) > 0 &&
      !hasAny(sel, "deployment", ["docker", "kubernetes", "vps"]),
    issue: () => ({
      level: "info",
      message: "A message queue is selected but nowhere to run it.",
      hint: "Add Docker, Kubernetes, or a VPS to host the broker — or switch to a managed queue.",
      involved: ["message-queue", "deployment"],
    }),
  },
  {
    id: "express-no-node",
    when: (sel) =>
      has(sel, "backend", "express") && !has(sel, "backend", "nodejs"),
    issue: () => ({
      level: "warn",
      message: "Express runs on the Node.js runtime, which is not selected.",
      hint: "Add Node.js to Backend — or drop Express if the API is Go/PHP/.NET.",
      involved: ["backend"],
    }),
  },
  {
    id: "nestjs-no-node",
    when: (sel) =>
      has(sel, "backend", "nestjs") && !has(sel, "backend", "nodejs"),
    issue: () => ({
      level: "warn",
      message: "NestJS runs on the Node.js runtime, which is not selected.",
      hint: "Add Node.js to Backend — or drop NestJS if the API is Go/PHP/.NET.",
      involved: ["backend"],
    }),
  },
  {
    id: "laravel-no-php",
    when: (sel) =>
      has(sel, "backend", "laravel") &&
      (sel["language"]?.length ?? 0) > 0 &&
      !has(sel, "language", "php"),
    issue: () => ({
      level: "warn",
      message: "Laravel is PHP, but the Language is not PHP.",
      hint: "Set Language to PHP — or drop Laravel for a backend matching the language.",
      involved: ["backend", "language"],
    }),
  },
  {
    id: "dotnet-no-csharp",
    when: (sel) =>
      has(sel, "backend", "dotnet") &&
      (sel["language"]?.length ?? 0) > 0 &&
      !has(sel, "language", "csharp"),
    issue: () => ({
      level: "warn",
      message: ".NET is C#, but the Language is not C#.",
      hint: "Set Language to C# — or drop .NET for a backend matching the language.",
      involved: ["backend", "language"],
    }),
  },
  {
    id: "ts-orm-no-runtime",
    when: (sel) =>
      hasAny(sel, "orm", ["prisma", "drizzle"]) &&
      (sel["backend"]?.length ?? 0) > 0 &&
      !hasAny(sel, "backend", NODE_BACKENDS) &&
      !hasAny(sel, "frontend", ["nextjs", "nuxt", "sveltekit"]),
    issue: () => ({
      level: "warn",
      message: "Prisma/Drizzle need a Node.js runtime, which is nowhere in the stack.",
      hint: "Add a Node backend (or a Next.js/Nuxt layer) — or switch to a backend-native tool like sqlc/GORM.",
      involved: ["orm", "backend", "frontend"],
    }),
  },
  {
    id: "spring-no-java",
    when: (sel) =>
      has(sel, "backend", "spring-boot") &&
      (sel["language"]?.length ?? 0) > 0 &&
      !has(sel, "language", "java"),
    issue: () => ({
      level: "warn",
      message: "Spring Boot is Java, but the Language is not Java.",
      hint: "Set Language to Java — or drop Spring Boot for a backend matching the language.",
      involved: ["backend", "language"],
    }),
  },
  {
    id: "mixed-runtimes",
    when: (sel) =>
      hasAny(sel, "backend", NON_NODE_BACKENDS) &&
      hasAny(sel, "backend", NODE_BACKENDS),
    issue: () => ({
      level: "warn",
      message: "Mixed runtimes in one Backend — that is two services, not one.",
      hint: "Run each runtime as its own service behind a versioned API contract; share nothing except the contract.",
      involved: ["backend"],
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
