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
import { userEvent } from "@testing-library/user-event";
import { composeStories } from "@storybook/marko";
import { fastAnimations } from "../../../common/test-utils/browser";
import * as stories from "../alert-dialog.stories";
import { addRenderBodies } from "../../../common/storybook/utils";
const { Default } = composeStories(stories);

beforeAll(() => fastAnimations.start());
afterAll(() => fastAnimations.stop());
afterEach(cleanup);

/** @type import("@marko/testing-library").RenderResult */
let component;
let user;

describe("accessibility", () => {
    describe("given an open alert dialog", () => {
        let sibling;

        beforeEach(async () => {
            user = userEvent.setup();
            sibling = document.body.appendChild(
                document.createElement("button"),
            );
            sibling.textContent = "Trigger";
            sibling.focus();
            component = await render(Default, {
                ...addRenderBodies(Default.args),
                open: true,
            });
        });

        afterEach(() => {
            if (sibling?.parentNode) {
                document.body.removeChild(sibling);
            }
        });

        describe("Click Interactions", () => {
            describe("when the confirm button is clicked", () => {
                beforeEach(async () => {
                    await fireEvent.click(
                        component.getByRole("button", { name: "OK" }),
                    );
                });

                it("then it emits confirm event", () => {
                    expect(component.emitted("confirm")).has.length(1);
                });
            });
        });

        describe("Keyboard Interactions", () => {
            describe("when Enter key is pressed on confirm button", () => {
                beforeEach(async () => {
                    const button = component.getByRole("button", {
                        name: "OK",
                    });
                    button.focus();
                    await user.keyboard("{Enter}");
                });

                it("then it emits confirm event", () => {
                    expect(component.emitted("confirm")).has.length(1);
                });
            });

            describe("when Space key is pressed on confirm button", () => {
                beforeEach(async () => {
                    const button = component.getByRole("button", {
                        name: "OK",
                    });
                    button.focus();
                    await user.keyboard(" ");
                });

                it("then it emits confirm event", () => {
                    expect(component.emitted("confirm")).has.length(1);
                });
            });

            describe("when Escape key is pressed", () => {
                beforeEach(async () => {
                    const button = component.getByRole("button", {
                        name: "OK",
                    });
                    button.focus();
                    await user.keyboard("{Escape}");
                });

                it("then dialog remains open", () => {
                    expect(
                        component.getByRole("alertdialog"),
                    ).not.toHaveAttribute("hidden");
                });

                it("then it does not emit close event", () => {
                    expect(component.emitted("close")).has.length(0);
                });
            });
        });

        describe("Focus Management", () => {
            it("then initial focus is on the confirm button", async () => {
                await waitFor(() => {
                    const button = component.getByRole("button", {
                        name: "OK",
                    });
                    expect(document.activeElement).toBe(button);
                });
            });
        });

        describe("ARIA Attributes", () => {
            it("then dialog has role alertdialog", () => {
                const dialog = component.getByRole("alertdialog");
                expect(dialog).toHaveAttribute("role", "alertdialog");
            });

            it("then dialog has aria-modal true", () => {
                const dialog = component.getByRole("alertdialog");
                expect(dialog).toHaveAttribute("aria-modal", "true");
            });

            it("then dialog has aria-labelledby referencing the header", () => {
                const dialog = component.getByRole("alertdialog");
                const labelledBy = dialog.getAttribute("aria-labelledby");
                expect(labelledBy).toBeTruthy();
                const labelEl = document.getElementById(labelledBy);
                expect(labelEl).toBeTruthy();
                expect(labelEl?.textContent).toContain("Alert!");
            });

            it("then confirm button has aria-describedby referencing main content", () => {
                const button = component.getByRole("button", { name: "OK" });
                const describedBy = button.getAttribute("aria-describedby");
                expect(describedBy).toBeTruthy();
                const mainEl = document.getElementById(describedBy);
                expect(mainEl).toBeTruthy();
                expect(mainEl?.textContent).toContain(
                    "You must acknowledge this alert to continue.",
                );
            });
        });
    });
});
