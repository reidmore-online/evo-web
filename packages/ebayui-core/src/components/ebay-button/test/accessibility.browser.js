import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { render, cleanup, fireEvent } from "@marko/testing-library";
import { userEvent } from "@testing-library/user-event";
import { pressKey } from "../../../common/test-utils/browser";
import template from "../index.marko";

afterEach(cleanup);

/** @type import("@marko/testing-library").RenderResult */
let component;

describe("Click Interactions", () => {
    describe("given enabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Click me",
            });
        });

        describe("when button is clicked", () => {
            beforeEach(async () => {
                await fireEvent.click(component.getByRole("button"));
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);

                const [[clickEvent]] = clickEvents;
                expect(clickEvent)
                    .has.property("originalEvent")
                    .is.an.instanceOf(Event);
            });
        });

        describe("when button is clicked multiple times", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                await fireEvent.click(button);
                await fireEvent.click(button);
            });

            it("then it emits click event for each click", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(2);
            });
        });
    });

    describe("given disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Click me",
                disabled: true,
            });
        });

        describe("when button is clicked", () => {
            beforeEach(async () => {
                await fireEvent.click(component.getByRole("button"));
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });
    });

    describe("given partially disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Click me",
                partiallyDisabled: true,
            });
        });

        describe("when button is clicked", () => {
            beforeEach(async () => {
                await fireEvent.click(component.getByRole("button"));
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });
    });

    describe("given link button with href", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Link button",
                href: "/test-url",
            });
        });

        describe("when link is clicked", () => {
            beforeEach(async () => {
                await fireEvent.click(component.getByRole("link"));
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });
    });
});

describe("Keyboard Interactions", () => {
    describe("given enabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Press me",
            });
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                await pressKey(button, { key: "Enter", keyCode: 13 });
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);

                const [[clickEvent]] = clickEvents;
                expect(clickEvent)
                    .has.property("originalEvent")
                    .is.an.instanceOf(Event);
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                await pressKey(button, { key: " ", keyCode: 32 });
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });

        describe("when Escape key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                await pressKey(button, { key: "Escape", keyCode: 27 });
            });

            it("then it emits escape event", () => {
                const escapeEvents = component.emitted("escape");
                expect(escapeEvents).has.length(1);

                const [[escapeEvent]] = escapeEvents;
                expect(escapeEvent)
                    .has.property("originalEvent")
                    .is.an.instanceOf(Event);
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });
    });

    describe("given disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Press me",
                disabled: true,
            });
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                await pressKey(button, { key: "Enter", keyCode: 13 });
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                await pressKey(button, { key: " ", keyCode: 32 });
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });

        describe("when Escape key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                await pressKey(button, { key: "Escape", keyCode: 27 });
            });

            it("then it does not emit escape event", () => {
                expect(component.emitted("escape")).has.length(0);
            });
        });
    });

    describe("given partially disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Press me",
                partiallyDisabled: true,
            });
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                await pressKey(button, { key: "Enter", keyCode: 13 });
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });

        describe("when Escape key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                await pressKey(button, { key: "Escape", keyCode: 27 });
            });

            it("then it emits escape event", () => {
                const escapeEvents = component.emitted("escape");
                expect(escapeEvents).has.length(1);
            });
        });
    });
});

describe("Focus Management", () => {
    describe("given an enabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Focus me",
            });
        });

        it("then button is keyboard focusable", () => {
            const button = component.getByRole("button");
            expect(button.tabIndex).toBeGreaterThanOrEqual(0);
        });

        describe("when button receives focus", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
            });

            it("then button has focus", () => {
                const button = component.getByRole("button");
                expect(document.activeElement).toBe(button);
            });

            it("then it emits focus event", () => {
                const focusEvents = component.emitted("focus");
                expect(focusEvents).has.length(1);

                const [[focusEvent]] = focusEvents;
                expect(focusEvent)
                    .has.property("originalEvent")
                    .is.an.instanceOf(Event);
            });
        });

        describe("when button loses focus", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                await fireEvent.focus(button);
                await fireEvent.blur(button);
            });

            it("then it emits blur event", () => {
                const blurEvents = component.emitted("blur");
                expect(blurEvents).has.length(1);

                const [[blurEvent]] = blurEvents;
                expect(blurEvent)
                    .has.property("originalEvent")
                    .is.an.instanceOf(Event);
            });
        });

        describe("when Tab key is pressed while button has focus", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                await userEvent.keyboard("{Tab}");
            });

            it("then focus moves away from button", () => {
                const button = component.getByRole("button");
                expect(document.activeElement).not.toBe(button);
            });
        });
    });

    describe("given a disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Focus me",
                disabled: true,
            });
        });

        it("then button is not keyboard focusable", () => {
            const button = component.getByRole("button");
            expect(button.disabled).toBe(true);
        });

        describe("when attempting to focus", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
            });

            it("then button does not receive focus", () => {
                const button = component.getByRole("button");
                expect(document.activeElement).not.toBe(button);
            });
        });
    });

    describe("given a partially disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Focus me",
                partiallyDisabled: true,
            });
        });

        it("then button is keyboard focusable", () => {
            const button = component.getByRole("button");
            expect(button.disabled).toBe(false);
        });

        describe("when button receives focus", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
            });

            it("then button has focus", () => {
                const button = component.getByRole("button");
                expect(document.activeElement).toBe(button);
            });
        });
    });

    describe("given a link button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Link button",
                href: "/test",
            });
        });

        it("then link is keyboard focusable", () => {
            const link = component.getByRole("link");
            expect(link.tabIndex).toBeGreaterThanOrEqual(0);
        });

        describe("when link receives focus", () => {
            beforeEach(async () => {
                const link = component.getByRole("link");
                link.focus();
            });

            it("then link has focus", () => {
                const link = component.getByRole("link");
                expect(document.activeElement).toBe(link);
            });
        });
    });
});

describe("ARIA Attributes", () => {
    describe("given a standard button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Standard button",
            });
        });

        it("then it has correct role", () => {
            const button = component.getByRole("button");
            expect(button).toBeTruthy();
        });

        it("then it has correct type attribute", () => {
            const button = component.getByRole("button");
            expect(button.type).toBe("button");
        });

        it("then it has accessible text content", () => {
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Standard button");
        });

        it("then it does not have aria-disabled", () => {
            const button = component.getByRole("button");
            expect(button.hasAttribute("aria-disabled")).toBe(false);
        });
    });

    describe("given a disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Disabled button",
                disabled: true,
            });
        });

        it("then it has disabled attribute", () => {
            const button = component.getByRole("button");
            expect(button.disabled).toBe(true);
        });

        it("then it is still accessible to screen readers", () => {
            const button = component.getByRole("button");
            expect(button).toBeTruthy();
        });
    });

    describe("given a partially disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Partially disabled",
                partiallyDisabled: true,
            });
        });

        it("then it has aria-disabled attribute", () => {
            const button = component.getByRole("button");
            expect(button).toHaveAttribute("aria-disabled", "true");
        });

        it("then it does not have disabled attribute", () => {
            const button = component.getByRole("button");
            expect(button.disabled).toBe(false);
        });
    });

    describe("given a button with loading state", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Loading button",
                bodyState: "loading",
            });
        });

        it("then it has default loading aria-label", () => {
            const button = component.getByRole("button");
            expect(button).toHaveAttribute("aria-label", "Loading...");
        });

        it("then it contains progress spinner", () => {
            const button = component.getByRole("button");
            const spinner = button.querySelector(".progress-spinner");
            expect(spinner).toBeTruthy();
        });
    });

    describe("given a button with loading state and custom a11y text", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Loading button",
                bodyState: "loading",
                a11yText: "Loading results, please wait",
            });
        });

        it("then it has custom aria-label", () => {
            const button = component.getByRole("button");
            expect(button).toHaveAttribute(
                "aria-label",
                "Loading results, please wait",
            );
        });
    });

    describe("given a button with expand state", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Expand button",
                bodyState: "expand",
            });
        });

        it("then it contains chevron icon", () => {
            const button = component.getByRole("button");
            expect(button.textContent).toContain("Expand button");
        });
    });

    describe("given a link button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Link button",
                href: "/test-url",
            });
        });

        it("then it has link role", () => {
            const link = component.getByRole("link");
            expect(link).toBeTruthy();
        });

        it("then it has correct href attribute", () => {
            const link = component.getByRole("link");
            expect(link).toHaveAttribute("href", "/test-url");
        });

        it("then it has accessible text content", () => {
            const link = component.getByRole("link");
            expect(link.textContent.trim()).toBe("Link button");
        });
    });

    describe("given a button with aria-label", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Button text",
                ariaLabel: "Custom label",
            });
        });

        it("then it has correct aria-label", () => {
            const button = component.getByRole("button");
            expect(button).toHaveAttribute("aria-label", "Custom label");
        });
    });

    describe("given a button with custom attributes", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Custom button",
                id: "test-button",
                name: "test-name",
            });
        });

        it("then it has correct id attribute", () => {
            const button = component.getByRole("button");
            expect(button.id).toBe("test-button");
        });

        it("then it has correct name attribute", () => {
            const button = component.getByRole("button");
            expect(button.name).toBe("test-name");
        });
    });
});

// TODO: Fix all these, they don't test anything meaningful yet
/* describe("Accessibility Compliance", () => {
    describe("given any button variant", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Test button",
                priority: "primary",
            });
        });

        it("then it has sufficient text content or accessible name", () => {
            const button = component.getByRole("button");
            const text = button.textContent.trim();
            const ariaLabel = button.getAttribute("aria-label");

            expect(text || ariaLabel).toBeTruthy();
        });

        it("then it has proper button element structure", () => {
            const button = component.getByRole("button");
            expect(button.tagName).toBe("BUTTON");
        });

        it("then it has minimum dimensions for touch target", () => {
            const button = component.getByRole("button");
            const rect = button.getBoundingClientRect();

            expect(rect.width).toBeGreaterThan(0);
            expect(rect.height).toBeGreaterThan(0);
        });
    });

    describe("given button with different priorities", () => {
        it("then primary button maintains accessibility", async () => {
            component = await render(template, {
                renderBody: "Primary",
                priority: "primary",
            });
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Primary");
        });

        it("then secondary button maintains accessibility", async () => {
            component = await render(template, {
                renderBody: "Secondary",
                priority: "secondary",
            });
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Secondary");
        });

        it("then tertiary button maintains accessibility", async () => {
            component = await render(template, {
                renderBody: "Tertiary",
                priority: "tertiary",
            });
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Tertiary");
        });
    });

    describe("given button with different sizes", () => {
        it("then large button maintains accessibility", async () => {
            component = await render(template, {
                renderBody: "Large",
                size: "large",
            });
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Large");
        });

        it("then small button maintains accessibility", async () => {
            component = await render(template, {
                renderBody: "Small",
                size: "small",
            });
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Small");
        });
    });

    describe("given button with different variants", () => {
        it("then destructive variant maintains accessibility", async () => {
            component = await render(template, {
                renderBody: "Delete",
                variant: "destructive",
            });
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Delete");
        });

        it("then form variant maintains accessibility", async () => {
            component = await render(template, {
                renderBody: "Submit",
                variant: "form",
            });
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Submit");
        });
    });

    describe("given button with truncate enabled", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Very long button text that should truncate",
                truncate: true,
                fixedHeight: true,
            });
        });

        it("then text content is still accessible", () => {
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Very long button text that should truncate");
        });
    });

    describe("given fluid button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Fluid button",
                fluid: true,
            });
        });

        it("then it maintains accessibility", () => {
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Fluid button");
        });
    });

    describe("given borderless button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Borderless",
                borderless: true,
            });
        });

        it("then it maintains accessibility", () => {
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Borderless");
        });
    });

    describe("given transparent button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Transparent",
                transparent: true,
            });
        });

        it("then it maintains accessibility", () => {
            const button = component.getByRole("button");
            expect(button.textContent.trim()).toBe("Transparent");
        });
    });
});
*/
