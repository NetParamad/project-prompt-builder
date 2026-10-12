import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useConfig } from "@/lib/store/useConfig";
import { ValidationList } from "@/components/prompt/validation-list";

beforeEach(() => {
  useConfig.getState().clearAll();
});

describe("ValidationList", () => {
  it("clicking a warning scrolls to the involved category", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;
    try {
      const section = document.createElement("section");
      section.id = "category-backend";
      document.body.appendChild(section);
      try {
        useConfig.getState().toggleOption("backend", "go");
        useConfig.getState().toggleOption("backend", "express");
        render(<ValidationList />);

        const warnings = screen.getAllByRole("button", {
          name: /go to backend/i,
        });
        expect(warnings.length).toBeGreaterThan(0);
        await user.click(warnings[0]);
        expect(scrollIntoView).toHaveBeenCalledTimes(1);
      } finally {
        section.remove();
      }
    } finally {
      // @ts-expect-error jsdom has no scrollIntoView; restore the absence
      delete window.HTMLElement.prototype.scrollIntoView;
    }
  });
});
