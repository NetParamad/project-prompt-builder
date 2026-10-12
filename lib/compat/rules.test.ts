import { describe, expect, it } from "vitest";
import { evaluateRules } from "@/lib/compat/rules";

function ids(sel: Record<string, string[]>): string[] {
  return evaluateRules(sel).map((i) => i.ruleId);
}

describe("evaluateRules", () => {
  it("flags multi-db as info", () => {
    const issues = evaluateRules({ database: ["postgresql", "mongodb"] });
    expect(ids({ database: ["postgresql", "mongodb"] })).toContain("multi-db");
    expect(issues.find((i) => i.ruleId === "multi-db")?.level).toBe("info");
  });

  it("warns on sqlc without a SQL database", () => {
    expect(ids({ orm: ["sqlc"], database: ["mongodb"] })).toContain("sqlc-nodoc");
    expect(ids({ orm: ["sqlc"], database: ["postgresql"] })).not.toContain(
      "sqlc-nodoc",
    );
  });

  it("infos vercel + go backend split", () => {
    expect(
      ids({ deployment: ["vercel"], backend: ["go"] }),
    ).toContain("vercel-go");
  });

  it("warns on better-auth with go-only backend", () => {
    expect(ids({ auth: ["better-auth"], backend: ["go"] })).toContain(
      "betterauth-go",
    );
    expect(
      ids({ auth: ["better-auth"], backend: ["go", "nestjs"] }),
    ).not.toContain("betterauth-go");
  });

  it("warns on gorm/sqlc without go backend", () => {
    expect(ids({ orm: ["gorm"], backend: ["nestjs"] })).toContain("go-orm-no-go");
    expect(ids({ orm: ["gorm"], backend: ["go"] })).not.toContain("go-orm-no-go");
  });

  it("warns on tRPC with non-TS backend", () => {
    expect(ids({ api: ["trpc"], backend: ["go"] })).toContain("trpc-non-ts");
  });

  it("infos supabase-auth with an extra ORM", () => {
    expect(
      ids({ auth: ["supabase-auth"], orm: ["prisma"] }),
    ).toContain("supabase-orm");
  });

  it("infos kubernetes without docker", () => {
    expect(ids({ deployment: ["kubernetes"] })).toContain("k8s-no-docker");
    expect(
      ids({ deployment: ["kubernetes", "docker"] }),
    ).not.toContain("k8s-no-docker");
  });

  it("infos a queue with nowhere to run", () => {
    expect(ids({ "message-queue": ["kafka"] })).toContain("mq-no-home");
    expect(
      ids({ "message-queue": ["kafka"], deployment: ["docker"] }),
    ).not.toContain("mq-no-home");
  });

  it("warns on express/nestjs without the node runtime", () => {
    expect(ids({ backend: ["go", "express"] })).toContain("express-no-node");
    expect(ids({ backend: ["go", "express"] })).toContain("mixed-runtimes");
    expect(ids({ backend: ["nodejs", "express"] })).not.toContain(
      "express-no-node",
    );
    expect(ids({ backend: ["nestjs"] })).toContain("nestjs-no-node");
    expect(ids({ backend: ["nodejs", "nestjs"] })).not.toContain(
      "nestjs-no-node",
    );
  });

  it("warns when backend and language runtimes disagree", () => {
    expect(
      ids({ backend: ["laravel"], language: ["typescript"] }),
    ).toContain("laravel-no-php");
    expect(ids({ backend: ["laravel"], language: ["php"] })).not.toContain(
      "laravel-no-php",
    );
    expect(ids({ backend: ["laravel"] })).not.toContain("laravel-no-php");
    expect(ids({ backend: ["dotnet"], language: ["go-lang"] })).toContain(
      "dotnet-no-csharp",
    );
    expect(ids({ backend: ["dotnet"], language: ["csharp"] })).not.toContain(
      "dotnet-no-csharp",
    );
  });

  it("warns on prisma without any node runtime", () => {
    expect(ids({ orm: ["prisma"], backend: ["go"] })).toContain(
      "ts-orm-no-runtime",
    );
    expect(
      ids({ orm: ["prisma"], backend: ["go"], frontend: ["nextjs"] }),
    ).not.toContain("ts-orm-no-runtime");
    expect(ids({ orm: ["prisma"] })).not.toContain("ts-orm-no-runtime");
  });
  it("returns nothing for a clean config", () => {
    expect(
      evaluateRules({
        frontend: ["nextjs"],
        backend: ["nodejs", "nestjs"],
        language: ["typescript"],
        database: ["postgresql"],
        orm: ["prisma"],
        deployment: ["docker"],
      }),
    ).toEqual([]);
  });
});
