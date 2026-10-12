import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Configurator } from "@/components/configurator/configurator";
import { useConfig } from "@/lib/store/useConfig";

beforeEach(() => {
  useConfig.getState().clearAll();
});

const TITLES = [
  "Project Type",
  "Frontend",
  "Backend",
  "Language",
  "Database",
  "ORM / Database Tools",
  "Message Queue",
  "Cache",
  "Authentication",
  "UI",
  "State Management",
  "Validation",
  "API",
  "Testing",
  "Load Testing",
  "Deployment",
  "CI/CD",
  "Observability",
  "Architecture",
  "Package Manager",
];

describe("Configurator", () => {
  it("renders every category section", () => {
    render(<Configurator />);
    for (const title of TITLES) {
      expect(
        screen.getByRole("heading", { name: title }),
      ).toBeInTheDocument();
    }
  });

  it("applying a preset fills the store and stays editable", async () => {
    const user = userEvent.setup();
    render(<Configurator />);
    await user.click(screen.getByRole("button", { name: "Next.js + Go" }));
    expect(useConfig.getState().selections["frontend"]).toEqual(["nextjs"]);
    expect(useConfig.getState().selections["backend"]).toEqual(["go"]);

    const backend = screen.getByRole("region", { name: "Backend" });
    await user.click(within(backend).getByRole("button", { name: /Go/ }));
    expect(useConfig.getState().selections["backend"]).toEqual([]);
  });

  it("filters options by name", async () => {
    const user = userEvent.setup();
    render(<Configurator />);
    await user.type(
      screen.getByLabelText("Filter technologies"),
      "postgres",
    );
    expect(
      screen.getByRole("heading", { name: "Database" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Frontend" }),
    ).not.toBeInTheDocument();
  });
});
