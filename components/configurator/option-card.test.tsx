import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OptionCard } from "@/components/configurator/option-card";

describe("OptionCard", () => {
  it("shows the vendored logo when one is mapped", () => {
    const { container } = render(
      <OptionCard id="react" name="React" selected={false} onToggle={() => {}} />,
    );
    expect(container.querySelector('img[src*="react.svg"]')).not.toBeNull();
  });

  it("inverts near-black logos on dark backgrounds", () => {
    const { container } = render(
      <OptionCard id="nextjs" name="Next.js" selected={false} onToggle={() => {}} />,
    );
    expect(container.querySelector(".dark\\:invert")).not.toBeNull();
  });

  it("falls back to a letter tile for unmapped options", () => {
    const { container } = render(
      <OptionCard id="pos" name="POS" selected={false} onToggle={() => {}} />,
    );
    expect(screen.getByText("P")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });

  it("falls back to a letter tile when the image fails to load", () => {
    const { container } = render(
      <OptionCard id="react" name="React" selected={false} onToggle={() => {}} />,
    );
    const img = container.querySelector("img");
    if (!img) throw new Error("logo img missing");
    fireEvent.error(img);
    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <OptionCard id="react" name="React" selected={false} onToggle={onToggle} />,
    );
    await user.click(screen.getByRole("button", { name: /react/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
