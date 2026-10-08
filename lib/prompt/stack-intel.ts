/** Stack-aware integration notes derived from a Configuration's selections. */

import { has, hasAny, type Selections } from "@/lib/selections";

/**
 * Returns conditional paragraphs explaining how the chosen technologies fit
 * together. Pure and deterministic — the prompt is assembled from these,
 * not by concatenating technology names.
 */
export function stackIntel(sel: Selections): string[] {
  const notes: string[] = [];

  const frontend = sel["frontend"]?.[0];
  const backends = sel["backend"] ?? [];
  const databases = sel["database"] ?? [];
  const orm = sel["orm"]?.[0];
  const auth = sel["auth"]?.[0];
  const api = sel["api"]?.[0];
  const deployments = sel["deployment"] ?? [];

  if (
    frontend === "nextjs" &&
    backends.some((b) => ["go", "laravel", "dotnet"].includes(b))
  ) {
    notes.push(
      "Architecture split: Next.js serves the frontend (App Router, server components where they add value), while the " +
        backends.join("/") +
        " service owns business logic behind a versioned API. Keep a typed client contract between them and do not leak backend internals into the frontend.",
    );
  }

  if (deployments.includes("vercel") && hasAny(sel, "backend", ["go", "laravel", "dotnet"])) {
    notes.push(
      "Deployment split: the frontend deploys to Vercel, but the non-Node backend cannot run on Vercel serverless functions — deploy it separately (Docker on a VPS or managed container service) and wire the frontend to its public URL via environment variables.",
    );
  }

  if (auth === "supabase-auth" && !has(sel, "database", "postgresql")) {
    notes.push(
      "Supabase Auth ships with Postgres — prefer PostgreSQL as the database unless you have a reason to run auth and data on different stores.",
    );
  }

  if (orm === "sqlc" && !hasAny(sel, "database", ["postgresql", "mysql", "sqlite"])) {
    notes.push(
      "sqlc generates type-safe code from SQL and is SQL-oriented: it does not work with MongoDB. Either switch the database to PostgreSQL/MySQL or pick an ODM for MongoDB.",
    );
  }

  if (api === "trpc" && !hasAny(sel, "backend", ["nodejs", "express", "nestjs"]) && backends.length > 0) {
    notes.push(
      "tRPC is TypeScript-only and needs a Node backend — with the current backend choice, prefer REST (OpenAPI) or GraphQL for the service boundary instead.",
    );
  }

  if (
    auth === "better-auth" &&
    !hasAny(sel, "backend", ["nodejs", "express", "nestjs"]) &&
    backends.length > 0
  ) {
    notes.push(
      "Better Auth is TypeScript-first: if the backend stays non-Node, issue/verify sessions with Custom JWT (or a Go session library) and keep Better Auth only if a Node/Next.js layer owns auth.",
    );
  }

  if (databases.length > 1) {
    notes.push(
      "Multi-database architecture: designate one database as the system of record per entity, document which data lives where, and never join across databases at query time — compose in the service layer instead.",
    );
  }

  if (has(sel, "ui", "tailwind") && has(sel, "ui", "shadcn")) {
    notes.push(
      "Style with Tailwind CSS tokens and compose UI from shadcn/ui primitives; keep one theme definition (CSS variables) shared by both so colors and radii stay consistent.",
    );
  }

  return notes;
}
