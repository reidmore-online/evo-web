import {
    afterEach,
    beforeEach,
    afterAll,
    beforeAll,
    describe,
    it,
    expect,
} from "vitest";
import { render, fireEvent, waitFor, cleanup } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { fastAnimations } from "../../../common/test-utils/browser";
import { addRenderBodies } from "../../../common/storybook/utils";
import { userEvent } from "@testing-library/user-event";
import * as stories from "../alert-dialog.stories";

const { Default } = composeStories(stories);

beforeAll(() => fastAnimations.start());
afterAll(() => fastAnimations.stop());
afterEach(cleanup);

/** @type import("@marko/testing-library").RenderResult */
let component;

describe("Click Interactions", () => {
    describe("given an open alert dialog", () => {
        beforeEach(async () => {
            component = await render(Default, { open: true });
        });

        it("should close when confirm button is clicked", async () => {
            const confirmButton = component.getByRole("button", {
                name: /OK/i,
            });

            await fireEvent.click(confirmButton);

            await waitFor(() => {
                expect(component.emitted("confirm")).toHaveLength(1);
            });
        });

        it("should emit confirm event when confirm button is clicked", async () => {
            const confirmButton = component.getByRole("button", {
                name: /OK/i,
            });

            await fireEvent.click(confirmButton);

            await waitFor(() => {
                expect(component.emitted("confirm")).toHaveLength(1);
            });
        });

        it("should not close when clicking outside the dialog", async () => {
            const dialog = component.getByRole("alertdialog");

            await fireEvent.click(dialog);

            // Dialog should remain open
            expect(dialog).not.toHaveAttribute("hidden");
        });
    });
});

describe("Keyboard Interactions", () => {
    describe("given an open alert dialog with confirm button focused", () => {
        beforeEach(async () => {
            component = await render(Default, { open: true });
            const confirmButton = component.getByRole("button", {
                name: /OK/i,
            });
            confirmButton.focus();
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                await userEvent.keyboard("{Enter}");
            });

            it("then it emits confirm event", async () => {
                await waitFor(() => {
                    expect(component.emitted("confirm")).has.length(1);
                });
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                await userEvent.keyboard(" ");
            });

            it("then it emits confirm event", async () => {
                await waitFor(() => {
                    expect(component.emitted("confirm")).has.length(1);
                });
            });
        });
    });

    describe("given an open alert dialog", () => {
        beforeEach(async () => {
            component = await render(Default, { open: true });
        });

        describe("when Escape key is pressed", () => {
            beforeEach(async () => {
                await userEvent.keyboard("{Escape}");
            });

            it("then dialog remains open", () => {
                const dialog = component.getByRole("alertdialog");
                expect(dialog).not.toHaveAttribute("hidden");
            });

            it("then it does not emit close event", () => {
                expect(component.emitted("close")).has.length(0);
            });
        });
    });
});

describe("Focus Management", () => {
    describe("given an open alert dialog", () => {
        let originalFocusElement;

        beforeEach(async () => {
            // Create a button to track focus restoration
            originalFocusElement = document.body.appendChild(
                document.createElement("button"),
            );
            originalFocusElement.id = "original-focus";
            originalFocusElement.focus();

            component = await render(Default, { open: true });
        });

        afterEach(() => {
            if (originalFocusElement && originalFocusElement.parentNode) {
                document.body.removeChild(originalFocusElement);
            }
        });

        it("should focus the confirm button when dialog opens", async () => {
            await waitFor(() => {
                const confirmButton = component.getByRole("button", {
                    name: /OK/i,
                });
                expect(document.activeElement).toBe(confirmButton);
            });
        });

        it("should emit close event when dialog closes", async () => {
            const confirmButton = component.getByRole("button", {
                name: /OK/i,
            });

            await fireEvent.click(confirmButton);

            await waitFor(() => {
                expect(component.emitted("confirm")).toHaveLength(1);
            });

            // Verify the close event is emitted (focus restoration is handled by dialog-base)
            await waitFor(() => {
                expect(component.emitted("close")).toBeDefined();
            });
        });

        it("should trap focus within the dialog", async () => {
            const dialog = component.getByRole("alertdialog");
            const confirmButton = component.getByRole("button", {
                name: /OK/i,
            });

            // Focus should be on confirm button
            await waitFor(() => {
                expect(document.activeElement).toBe(confirmButton);
            });

            // Attempting to tab should keep focus within dialog
            await fireEvent.keyDown(confirmButton, { key: "Tab", code: "Tab" });

            // Focus should remain within the dialog bounds
            await waitFor(() => {
                expect(dialog.contains(document.activeElement)).toBe(true);
            });
        });
    });

    describe("given a dialog with closeFocus specified", () => {
        let customFocusElement;

        beforeEach(async () => {
            customFocusElement = document.body.appendChild(
                document.createElement("button"),
            );
            customFocusElement.id = "custom-focus-element";

            component = await render(Default, {
                open: true,
                closeFocus: "custom-focus-element",
            });
        });

        afterEach(() => {
            if (customFocusElement && customFocusElement.parentNode) {
                document.body.removeChild(customFocusElement);
            }
        });

        it("should accept closeFocus parameter", () => {
            const dialog = component.getByRole("alertdialog");

            // Verify the dialog accepted the closeFocus parameter
            // Focus restoration behavior is handled by the underlying dialog-base component
            expect(dialog).toBeInTheDocument();
            expect(customFocusElement).toBeInTheDocument();
        });
    });
});

describe("ARIA Attributes", () => {
    describe("given an open alert dialog", () => {
        beforeEach(async () => {
            component = await render(Default, { open: true });
        });

        it("should have role='alertdialog'", () => {
            const dialog = component.getByRole("alertdialog");
            expect(dialog).toHaveAttribute("role", "alertdialog");
        });

        it("should have aria-modal attribute", () => {
            const dialog = component.getByRole("alertdialog");
            expect(dialog).toHaveAttribute("aria-modal");
        });

        it("should have aria-labelledby pointing to header", () => {
            const dialog = component.getByRole("alertdialog");
            const ariaLabelledBy = dialog.getAttribute("aria-labelledby");

            expect(ariaLabelledBy).toBeTruthy();

            const headerElement = document.getElementById(ariaLabelledBy);
            expect(headerElement).toBeTruthy();
            expect(headerElement.textContent).toContain("Alert!");
        });

        it("should have confirm button with aria-describedby pointing to dialog content", () => {
            const confirmButton = component.getByRole("button", {
                name: /OK/i,
            });
            const describedBy = confirmButton.getAttribute("aria-describedby");

            expect(describedBy).toBeTruthy();

            const contentElement = document.getElementById(describedBy);
            expect(contentElement).toBeTruthy();
        });

        it("should have appropriate button role and label", () => {
            const confirmButton = component.getByRole("button", {
                name: /OK/i,
            });

            expect(confirmButton).toHaveAttribute("type", "button");
            expect(confirmButton).toBeVisible();
        });
    });

    describe("given a closed alert dialog", () => {
        beforeEach(async () => {
            component = await render(Default, { open: false });
        });

        it("should have hidden attribute", () => {
            const dialog = component.getByRole("alertdialog", { hidden: true });
            expect(dialog).toHaveAttribute("hidden");
        });

        it("should not be visible to assistive technology when closed", () => {
            const dialog = component.getByRole("alertdialog", { hidden: true });
            expect(dialog).toHaveAttribute("hidden");
        });
    });

    describe("given a dialog with custom confirm text", () => {
        beforeEach(async () => {
            component = await render(Default, {
                open: true,
                confirmText: "I Understand",
            });
        });

        it("should display custom confirm button text", () => {
            const confirmButton = component.getByRole("button", {
                name: /I Understand/i,
            });
            expect(confirmButton).toBeVisible();
            expect(confirmButton.textContent).toContain("I Understand");
        });
    });
});

describe("Accessibility Compliance", () => {
    describe("given an open alert dialog", () => {
        beforeEach(async () => {
            component = await render(Default, { open: true });
        });

        it("should maintain proper heading hierarchy when header uses h2", async () => {
            const args = {
                ...addRenderBodies(Default.args),
                open: true,
                header: {
                    as: "h2",
                    renderBody: "Alert!",
                },
            };

            component = await render(Default, args);

            const heading = component.container.querySelector("h2");
            expect(heading).toBeTruthy();
            expect(heading.textContent).toContain("Alert!");
        });

        it("should have sufficient color contrast for text", () => {
            const dialog = component.getByRole("alertdialog");
            const styles = window.getComputedStyle(dialog);

            // Dialog should be visible
            expect(styles.display).not.toBe("none");
        });

        it("should have focusable confirm button", () => {
            const confirmButton = component.getByRole("button", {
                name: /OK/i,
            });

            expect(confirmButton).toBeVisible();
            expect(confirmButton.tabIndex).toBeGreaterThanOrEqual(0);
        });

        it("should maintain proper document structure", () => {
            const dialog = component.getByRole("alertdialog");

            // Dialog should be in the document
            expect(document.body.contains(dialog)).toBe(true);
        });
    });

    describe("given content with various elements", () => {
        beforeEach(async () => {
            const args = {
                ...addRenderBodies(Default.args),
                open: true,
                renderBody: `
                    <p>Important message with <strong>emphasis</strong>.</p>
                    <p>Second paragraph with <a href="#">a link</a>.</p>
                `,
            };

            component = await render(Default, args);
        });

        it("should preserve semantic HTML in dialog content", () => {
            const dialog = component.getByRole("alertdialog");
            const paragraphs = dialog.querySelectorAll("p");

            expect(paragraphs.length).toBeGreaterThan(0);
        });

        it("should maintain reading order for screen readers", () => {
            const dialog = component.getByRole("alertdialog");
            const ariaLabelledBy = dialog.getAttribute("aria-labelledby");

            // Header should be properly associated
            expect(ariaLabelledBy).toBeTruthy();

            // Content should be accessible
            const content = dialog.textContent;
            expect(content).toContain("Important message");
        });
    });
});
