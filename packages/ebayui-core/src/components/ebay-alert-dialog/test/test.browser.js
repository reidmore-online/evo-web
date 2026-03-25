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
import { userEvent } from "vitest/browser";
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

describe("<ebay-alert-dialog>", () => {
    describe("given a closed dialog", () => {
        beforeEach(async () => {
            component = await render(Default);
        });

        it("then it should be hidden in the DOM", () => {
            expect(
                component.getByRole("alertdialog", { hidden: true }),
            ).toHaveAttribute("hidden");
        });

        describe("when the dialog is opened via prop change", () => {
            it("then it should emit the open event", async () => {
                await component.rerender(
                    Object.assign({}, addRenderBodies(Default.args), {
                        open: true,
                    }),
                );
                await waitFor(() =>
                    expect(component.emitted("open")).has.length(1),
                );
            });
        });
    });

    describe("given an open dialog", () => {
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

        it("then it should be visible in the DOM", () => {
            expect(component.getByRole("alertdialog")).not.toHaveAttribute(
                "hidden",
            );
        });

        describe("when the confirm button is clicked", () => {
            it("then it should emit the confirm event", async () => {
                await fireEvent.click(
                    component.getByRole("button", { name: "OK" }),
                );
                expect(component.emitted("confirm")).has.length(1);
            });
        });

        describe("when Enter key is pressed on the confirm button", () => {
            it("then it should emit the confirm event", async () => {
                const button = component.getByRole("button", { name: "OK" });
                button.focus();
                await user.keyboard("{Enter}");
                expect(component.emitted("confirm")).has.length(1);
            });
        });

        describe("when Space key is pressed on the confirm button", () => {
            it("then it should emit the confirm event", async () => {
                const button = component.getByRole("button", { name: "OK" });
                button.focus();
                await user.keyboard(" ");
                expect(component.emitted("confirm")).has.length(1);
            });
        });

        describe("when Escape key is pressed", () => {
            it("then it should not close the dialog", async () => {
                const button = component.getByRole("button", { name: "OK" });
                button.focus();
                await user.keyboard("{Escape}");
                expect(component.getByRole("alertdialog")).not.toHaveAttribute(
                    "hidden",
                );
                expect(component.emitted("close")).has.length(0);
            });
        });

        describe("accessibility", () => {
            describe("when the dialog opens", () => {
                it("then it should focus on the confirm button", async () => {
                    await waitFor(() => {
                        const button = component.getByRole("button", {
                            name: "OK",
                        });
                        expect(document.activeElement).toBe(button);
                    });
                });
            });

            it("then it should have role alertdialog", () => {
                const dialog = component.getByRole("alertdialog");
                expect(dialog).toHaveAttribute("role", "alertdialog");
            });

            it("then it should have aria-modal set to true", () => {
                const dialog = component.getByRole("alertdialog");
                expect(dialog).toHaveAttribute("aria-modal", "true");
            });

            it("then it should have aria-labelledby referencing the header", () => {
                const dialog = component.getByRole("alertdialog");
                const labelledBy = dialog.getAttribute("aria-labelledby");
                expect(labelledBy).toBeTruthy();
                const labelEl = document.getElementById(labelledBy);
                expect(labelEl).toBeTruthy();
                expect(labelEl?.textContent).toContain("Alert!");
            });

            it("then it should have aria-describedby on the confirm button referencing main content", () => {
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
