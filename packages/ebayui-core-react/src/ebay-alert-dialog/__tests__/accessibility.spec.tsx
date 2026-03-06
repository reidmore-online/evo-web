import React from "react";
import { vi } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EbayAlertDialog } from "../index";
import { EbayDialogHeader } from "../../ebay-dialog-base";

vi.mock("../../common/random-id");

const onConfirmSpy = vi.fn();
const onOpenSpy = vi.fn();
const onCloseSpy = vi.fn();

function renderOpenDialog() {
    return render(
        <EbayAlertDialog
            open
            confirmText="OK"
            onOpen={onOpenSpy}
            onConfirm={onConfirmSpy}
            onClose={onCloseSpy}
            a11yCloseText="Close Dialog"
        >
            <EbayDialogHeader>Alert Title</EbayDialogHeader>
            <p>You must acknowledge this alert to continue.</p>
        </EbayAlertDialog>,
    );
}

describe("EbayAlertDialog accessibility", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("given an open alert dialog", () => {
        beforeEach(() => {
            renderOpenDialog();
        });

        describe("Click Interactions", () => {
            it("when confirm button is clicked then onConfirm is called", async () => {
                const button = screen.getByRole("button", { name: "OK" });
                await userEvent.click(button);
                expect(onConfirmSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("Keyboard Interactions", () => {
            it("when Enter key is pressed on confirm button then onConfirm is called", async () => {
                const user = userEvent.setup();
                const button = screen.getByRole("button", { name: "OK" });
                button.focus();
                await user.keyboard("{Enter}");
                expect(onConfirmSpy).toHaveBeenCalledTimes(1);
            });

            it("when Space key is pressed on confirm button then onConfirm is called", async () => {
                const user = userEvent.setup();
                const button = screen.getByRole("button", { name: "OK" });
                button.focus();
                await user.keyboard(" ");
                expect(onConfirmSpy).toHaveBeenCalledTimes(1);
            });

            it("when Escape key is pressed then dialog does not close and onClose is not called", async () => {
                const user = userEvent.setup();
                const button = screen.getByRole("button", { name: "OK" });
                button.focus();
                await user.keyboard("{Escape}");
                expect(onCloseSpy).not.toHaveBeenCalled();
                expect(screen.getByRole("alertdialog")).toBeInTheDocument();
            });
        });

        describe("Focus Management", () => {
            it("then initial focus is on the confirm button", async () => {
                const button = screen.getByRole("button", { name: "OK" });
                expect(button).toHaveFocus();
            });
        });

        describe("ARIA Attributes", () => {
            it("then dialog has role alertdialog", () => {
                const dialog = screen.getByRole("alertdialog");
                expect(dialog).toHaveAttribute("role", "alertdialog");
            });

            it("then dialog has aria-modal true", () => {
                const dialog = screen.getByRole("alertdialog");
                expect(dialog).toHaveAttribute("aria-modal", "true");
            });

            it("then dialog has aria-labelledby referencing the header", () => {
                const dialog = screen.getByRole("alertdialog");
                const labelledBy = dialog.getAttribute("aria-labelledby");
                expect(labelledBy).toBeTruthy();
                const labelEl = document.getElementById(labelledBy!);
                expect(labelEl).toBeTruthy();
                expect(labelEl?.textContent).toContain("Alert Title");
            });

            it("then confirm button has aria-describedby referencing main content", () => {
                const button = screen.getByRole("button", { name: "OK" });
                const describedBy = button.getAttribute("aria-describedby");
                expect(describedBy).toBe("alert-dialog-main");
                const mainEl = document.getElementById(describedBy!);
                expect(mainEl).toBeTruthy();
                expect(mainEl?.textContent).toContain("You must acknowledge this alert to continue.");
            });
        });
    });
});
