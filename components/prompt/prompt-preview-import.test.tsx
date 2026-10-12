import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EMPTY_REQUIREMENTS } from "@/lib/domain";
import { useConfig } from "@/lib/store/useConfig";
import { PromptPreview } from "@/components/prompt/prompt-preview";

beforeEach(() => {
  useConfig.getState().clearAll();
});

function jsonFile(contents: string): File {
  return new File([contents], "config.json", { type: "application/json" });
}

describe("PromptPreview import", () => {
  it("imports a valid export file", async () => {
    const user = userEvent.setup();
    render(<PromptPreview />);
    await user.click(screen.getByRole("button", { name: "Import .json" }));

    fireEvent.change(screen.getByLabelText("Import JSON file"), {
      target: {
        files: [
          jsonFile(
            JSON.stringify({
              configuration: {
                selections: { frontend: ["react"] },
                requirements: { ...EMPTY_REQUIREMENTS, projectName: "Imp" },
                mode: "basic",
                customSkills: ["a-skill"],
              },
            }),
          ),
        ],
      },
    });

    await waitFor(() => {
      expect(useConfig.getState().requirements.projectName).toBe("Imp");
    });
    expect(useConfig.getState().selections["frontend"]).toEqual(["react"]);
    expect(useConfig.getState().mode).toBe("basic");
  });

  it("shows an inline error for garbage files", async () => {
    const user = userEvent.setup();
    render(<PromptPreview />);
    await user.click(screen.getByRole("button", { name: "Import .json" }));

    fireEvent.change(screen.getByLabelText("Import JSON file"), {
      target: { files: [jsonFile("definitely not json")] },
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not read/i);
    expect(useConfig.getState().requirements.projectName).toBe("");
  });

  it("asks before importing over manual edits", async () => {
    const user = userEvent.setup();
    useConfig.getState().setManualEdit("my precious edit");
    render(<PromptPreview />);
    await user.click(screen.getByRole("button", { name: "Import .json" }));

    fireEvent.change(screen.getByLabelText("Import JSON file"), {
      target: {
        files: [
          jsonFile(JSON.stringify({ selections: { frontend: ["vue"] } })),
        ],
      },
    });

    await user.click(
      await screen.findByRole("button", { name: "Import" }),
    );
    expect(useConfig.getState().selections["frontend"]).toEqual(["vue"]);
    expect(useConfig.getState().manualEdit).toBeNull();
  });
});
