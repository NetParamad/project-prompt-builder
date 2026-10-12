import { describe, expect, it } from "vitest";
import { EMPTY_REQUIREMENTS } from "@/lib/domain";
import {
  decodeShareConfig,
  encodeShareConfig,
} from "@/lib/share/codec";

const FULL = {
  selections: {
    frontend: ["nextjs"],
    database: ["postgresql", "mongodb"],
    "ai-skills": ["tdd"],
  },
  requirements: {
    ...EMPTY_REQUIREMENTS,
    projectName: "ร้านอาหาร POS",
    mainFeatures: "ขาย\nสต็อก",
  },
  mode: "production" as const,
  customSkillsRaw: "my-skill",
};

describe("share codec", () => {
  it("round-trips the full configuration, including non-Latin text", () => {
    const decoded = decodeShareConfig(encodeShareConfig(FULL));
    expect(decoded).toEqual(FULL);
  });

  it("emits URL-safe output with no padding or reserved chars", () => {
    const param = encodeShareConfig(FULL);
    expect(param).not.toMatch(/[+/=]/);
  });

  it("returns null for garbage input", () => {
    expect(decodeShareConfig("!!!not-base64!!!")).toBeNull();
    expect(decodeShareConfig("")).toBeNull();
    expect(
      decodeShareConfig(
        btoa(JSON.stringify([1, 2, 3]))
          .replace(/\+/g, "-")
          .replace(/\//g, "_"),
      ),
    ).toBeNull();
  });

  it("sanitizes unknown ids, caps the database, and defaults the mode", () => {
    const decoded = decodeShareConfig(
      encodeShareConfig({
        selections: {
          frontend: ["nextjs", "react", "nope"],
          database: ["postgresql", "mongodb", "mysql"],
          "bogus-category": ["x"],
        },
        requirements: { projectName: "P" } as never,
        mode: "ultra" as never,
        customSkillsRaw: 42 as never,
      }),
    );
    expect(decoded).toEqual({
      selections: {
        frontend: ["nextjs"],
        database: ["postgresql", "mongodb"],
      },
      requirements: { ...EMPTY_REQUIREMENTS, projectName: "P" },
      mode: "standard",
      customSkillsRaw: "",
    });
  });
});
