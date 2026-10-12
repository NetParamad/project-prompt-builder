import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/site";

const KEY = "NEXT_PUBLIC_SITE_URL";

afterEach(() => {
  delete process.env[KEY];
});

describe("getSiteUrl", () => {
  it("falls back when unset", () => {
    expect(getSiteUrl()).toBe("https://project-prompt-builder.vercel.app");
  });

  it("strips trailing slashes and adds https", () => {
    process.env[KEY] = "example.com///";
    expect(getSiteUrl()).toBe("https://example.com");
    process.env[KEY] = "http://localhost:3000/";
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
