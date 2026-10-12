import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function openDialog(handlers: { onConfirm?: () => void; onClose?: () => void } = {}) {
  return render(
    <ConfirmDialog
      open
      title="Clear configuration?"
      description="This cannot be undone."
      confirmLabel="Clear everything"
      onConfirm={handlers.onConfirm ?? (() => {})}
      onClose={handlers.onClose ?? (() => {})}
    />,
  );
}

describe("ConfirmDialog", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <ConfirmDialog
        open={false}
        title="Clear configuration?"
        description="This cannot be undone."
        confirmLabel="Clear everything"
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("confirms and cancels via buttons", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    openDialog({ onConfirm, onClose });

    expect(
      screen.getByRole("alertdialog", { name: "Clear configuration?" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear everything" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  it("closes on Escape and backdrop click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    openDialog({ onClose });

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
    // Portal renders into document.body, outside the RTL container.
    const backdrop = document.body.querySelector('[aria-hidden="true"]');
    if (!backdrop) throw new Error("backdrop missing");
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("focuses the safe action first and traps Tab inside", async () => {
    const user = userEvent.setup();
    openDialog();

    const cancel = screen.getByRole("button", { name: "Cancel" });
    const confirm = screen.getByRole("button", { name: "Clear everything" });
    expect(cancel).toHaveFocus();

    await user.tab();
    expect(confirm).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
  });
});
