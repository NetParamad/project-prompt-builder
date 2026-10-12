import type { Category } from "@/lib/domain";

function opt(
  categoryId: string,
  id: string,
  name: string,
  description?: string,
): { id: string; name: string; categoryId: string; description?: string } {
  return { id, name, categoryId, description };
}

export const CATEGORIES: Category[] = [
  {
    id: "project-type",
    title: "Project Type",
    selection: "single",
    options: [
      opt("project-type", "saas", "SaaS", "Multi-tenant web app with billing"),
      opt("project-type", "pos", "POS", "Point of sale for retail / restaurant"),
      opt("project-type", "ecommerce", "E-commerce", "Storefront with cart and checkout"),
      opt("project-type", "blog", "Blog", "Content site with posts"),
      opt("project-type", "portfolio", "Portfolio", "Personal showcase site"),
      opt("project-type", "api", "API", "Headless backend service"),
      opt("project-type", "mobile-app", "Mobile App", "Cross-platform mobile client"),
      opt("project-type", "custom", "Custom", "Something else entirely"),
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    selection: "single",
    options: [
      opt("frontend", "nextjs", "Next.js", "React framework with SSR / App Router"),
      opt("frontend", "react", "React", "SPA with Vite or CRA"),
      opt("frontend", "vue", "Vue", "Progressive SPA framework"),
      opt("frontend", "nuxt", "Nuxt", "Vue framework with SSR"),
      opt("frontend", "svelte", "Svelte", "Compiler-based UI"),
      opt("frontend", "sveltekit", "SvelteKit", "Svelte app framework"),
      opt("frontend", "astro", "Astro", "Content-focused islands"),
      opt("frontend", "angular", "Angular", "Full-featured SPA platform"),
    ],
  },
  {
    id: "backend",
    title: "Backend",
    selection: "multiple",
    options: [
      opt("backend", "go", "Go", "Stdlib / Chi / Gin API service"),
      opt("backend", "nodejs", "Node.js", "Plain Node runtime service"),
      opt("backend", "express", "Express", "Minimal Node framework"),
      opt("backend", "nestjs", "NestJS", "Opinionated TypeScript framework"),
      opt("backend", "laravel", "Laravel", "PHP full-stack framework"),
      opt("backend", "dotnet", ".NET", "ASP.NET Core API"),
    ],
  },
  {
    id: "language",
    title: "Language",
    selection: "single",
    options: [
      opt("language", "typescript", "TypeScript", "Typed JS superset"),
      opt("language", "javascript", "JavaScript", "Plain dynamic JS"),
      opt("language", "go-lang", "Go", "Static compiled backend language"),
      opt("language", "rust", "Rust", "Memory-safe systems language"),
      opt("language", "php", "PHP", "Server-rendered scripting"),
      opt("language", "csharp", "C#", ".NET language"),
    ],
  },
  {
    id: "database",
    title: "Database",
    selection: "multiple",
    maxSelections: 2,
    options: [
      opt("database", "postgresql", "PostgreSQL", "Relational, default pick"),
      opt("database", "mysql", "MySQL", "Relational, classic hosting"),
      opt("database", "mongodb", "MongoDB", "Document store"),
      opt("database", "sqlite", "SQLite", "Embedded file DB"),
    ],
  },
  {
    id: "orm",
    title: "ORM / Database Tools",
    selection: "single",
    options: [
      opt("orm", "drizzle", "Drizzle", "TS SQL toolkit"),
      opt("orm", "prisma", "Prisma", "TS ORM with migrations"),
      opt("orm", "gorm", "GORM", "Go ORM"),
      opt("orm", "sqlc", "sqlc", "SQL-first Go codegen"),
      opt("orm", "ef-core", "Entity Framework", ".NET ORM"),
    ],
  },
  {
    id: "message-queue",
    title: "Message Queue",
    selection: "multiple",
    options: [
      opt("message-queue", "kafka", "Kafka", "Distributed event streaming"),
      opt("message-queue", "rabbitmq", "RabbitMQ", "Classic message broker"),
      opt("message-queue", "nats", "NATS", "Lightweight messaging"),
      opt("message-queue", "sqs", "AWS SQS", "Managed cloud queue"),
      opt("message-queue", "pulsar", "Pulsar", "Multi-tenant streaming"),
    ],
  },
  {
    id: "cache",
    title: "Cache",
    selection: "single",
    options: [
      opt("cache", "redis", "Redis", "In-memory data store"),
      opt("cache", "valkey", "Valkey", "Open-source Redis fork"),
      opt("cache", "memcached", "Memcached", "Simple object cache"),
    ],
  },
  {
    id: "auth",
    title: "Authentication",
    selection: "single",
    options: [
      opt("auth", "better-auth", "Better Auth", "TS-first auth library"),
      opt("auth", "authjs", "Auth.js", "NextAuth-compatible auth"),
      opt("auth", "supabase-auth", "Supabase Auth", "Hosted auth + Postgres"),
      opt("auth", "clerk", "Clerk", "Hosted user management"),
      opt("auth", "custom-jwt", "Custom JWT", "Hand-rolled tokens"),
    ],
  },
  {
    id: "ui",
    title: "UI",
    selection: "multiple",
    options: [
      opt("ui", "tailwind", "Tailwind CSS", "Utility-first CSS"),
      opt("ui", "shadcn", "shadcn/ui", "Copy-paste Radix components"),
      opt("ui", "mui", "MUI", "Material React kit"),
      opt("ui", "bootstrap", "Bootstrap", "Classic CSS framework"),
      opt("ui", "radix", "Radix UI", "Unstyled primitives"),
    ],
  },
  {
    id: "state",
    title: "State Management",
    selection: "multiple",
    options: [
      opt("state", "zustand", "Zustand", "Minimal client store"),
      opt("state", "redux-toolkit", "Redux Toolkit", "Predictable global state"),
      opt("state", "tanstack-query", "TanStack Query", "Server-state cache"),
      opt("state", "jotai", "Jotai", "Atomic state"),
    ],
  },
  {
    id: "validation",
    title: "Validation",
    selection: "single",
    options: [
      opt("validation", "zod", "Zod", "TS schema validation"),
      opt("validation", "valibot", "Valibot", "Modular TS schemas"),
      opt("validation", "joi", "Joi", "JS object schemas"),
    ],
  },
  {
    id: "api",
    title: "API",
    selection: "single",
    options: [
      opt("api", "rest", "REST", "Resource JSON endpoints"),
      opt("api", "graphql", "GraphQL", "Typed query API"),
      opt("api", "trpc", "tRPC", "End-to-end typesafe TS API"),
    ],
  },
  {
    id: "testing",
    title: "Testing",
    selection: "multiple",
    options: [
      opt("testing", "vitest", "Vitest", "Fast Vite-native unit tests"),
      opt("testing", "jest", "Jest", "Classic JS test runner"),
      opt("testing", "playwright", "Playwright", "E2E browser tests"),
      opt("testing", "cypress", "Cypress", "E2E runner with UI"),
    ],
  },
  {
    id: "load-testing",
    title: "Load Testing",
    selection: "multiple",
    options: [
      opt("load-testing", "k6", "k6", "JS-scripted load tests"),
      opt("load-testing", "artillery", "Artillery", "Node load testing"),
      opt("load-testing", "locust", "Locust", "Python swarm testing"),
      opt("load-testing", "jmeter", "JMeter", "Classic Java load tool"),
      opt("load-testing", "gatling", "Gatling", "Scala-based load tests"),
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    selection: "multiple",
    options: [
      opt("deployment", "docker", "Docker", "Container images"),
      opt("deployment", "vercel", "Vercel", "Zero-config frontend hosting"),
      opt("deployment", "vps", "VPS", "Single VM host"),
      opt("deployment", "cloudflare", "Cloudflare", "Edge + Workers/Pages"),
      opt("deployment", "kubernetes", "Kubernetes", "Orchestrated containers"),
    ],
  },
  {
    id: "cicd",
    title: "CI/CD",
    selection: "multiple",
    options: [
      opt("cicd", "github-actions", "GitHub Actions", "Native GitHub automation"),
      opt("cicd", "gitlab-ci", "GitLab CI", "Integrated GitLab pipelines"),
      opt("cicd", "jenkins", "Jenkins", "Self-hosted classic"),
      opt("cicd", "argocd", "ArgoCD", "GitOps for Kubernetes"),
      opt("cicd", "circleci", "CircleCI", "Cloud CI pipelines"),
    ],
  },
  {
    id: "observability",
    title: "Observability",
    selection: "multiple",
    options: [
      opt("observability", "prometheus", "Prometheus", "Metrics + alerting"),
      opt("observability", "grafana", "Grafana", "Dashboards"),
      opt("observability", "opentelemetry", "OpenTelemetry", "Vendor-neutral traces"),
      opt("observability", "loki", "Loki", "Log aggregation"),
      opt("observability", "jaeger", "Jaeger", "Distributed tracing"),
      opt("observability", "datadog", "Datadog", "Hosted all-in-one"),
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    selection: "single",
    options: [
      opt("architecture", "clean", "Clean Architecture", "Ports, adapters, use cases"),
      opt("architecture", "mvc", "MVC", "Model-view-controller split"),
      opt("architecture", "feature-based", "Feature-based", "Colocate by feature slice"),
      opt("architecture", "layered", "Layered", "Handler → service → repo layers"),
    ],
  },
  {
    id: "ai-skills",
    title: "AI Agent Skills",
    selection: "multiple",
    options: [
      opt("ai-skills", "tdd", "tdd", "Test-driven development, red-green-refactor"),
      opt("ai-skills", "implement", "implement", "Build a ticket end to end"),
      opt("ai-skills", "implement-spec", "implement-spec", "Implement a specification in code"),
      opt("ai-skills", "code-review", "code-review", "Two-axis review: Standards + Spec"),
      opt("ai-skills", "grill-with-docs", "grill-with-docs", "Sharpen an idea, saves CONTEXT.md + ADRs"),
      opt("ai-skills", "grill-me", "grill-me", "Stateless sharpening interview"),
      opt("ai-skills", "triage", "triage", "Move issues through triage roles"),
      opt("ai-skills", "diagnosing-bugs", "diagnosing-bugs", "Tight-loop diagnosis + regression test"),
      opt("ai-skills", "research", "research", "Background reading against primary sources"),
      opt("ai-skills", "prototype", "prototype", "Throwaway program to answer a design question"),
      opt("ai-skills", "handoff", "handoff", "Portable handoff between sessions"),
      opt("ai-skills", "to-spec", "to-spec", "Turn a thread into a spec"),
      opt("ai-skills", "to-tickets", "to-tickets", "Split a spec into tracer-bullet tickets"),
      opt("ai-skills", "wayfinder", "wayfinder", "Decision map for huge foggy efforts"),
    ],
  },
  {
    id: "package-manager",
    title: "Package Manager",
    selection: "single",
    options: [
      opt("package-manager", "pnpm", "pnpm", "Fast content-addressable installs"),
      opt("package-manager", "npm", "npm", "Default Node registry client"),
      opt("package-manager", "yarn", "Yarn", "Classic alternative client"),
      opt("package-manager", "bun", "Bun", "All-in-one runtime + installer"),
    ],
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export function optionName(categoryId: string, optionId: string): string {
  return (
    CATEGORY_MAP[categoryId]?.options.find((o) => o.id === optionId)?.name ??
    optionId
  );
}
