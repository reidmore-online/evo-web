import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { render, cleanup, fireEvent } from "@marko/testing-library";
import { userEvent } from "@testing-library/user-event";
import { createRenderBody } from "../../../common/test-utils/shared";
import template from "../index.marko";

afterEach(cleanup);

/** @type import("@marko/testing-library").RenderResult */
let component;

describe("Click Interactions", () => {
    describe("given enabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: createRenderBody("Click me"),
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
                renderBody: createRenderBody("Click me"),
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
                renderBody: createRenderBody("Click me"),
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
                renderBody: createRenderBody("Link button"),
                href: "#",
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
                renderBody: createRenderBody("Press me"),
            });
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                const user = userEvent.setup();
                await user.keyboard("{Enter}");
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
                const user = userEvent.setup();
                await user.keyboard(" ");
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });
    });

    describe("given disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: createRenderBody("Press me"),
                disabled: true,
            });
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                const user = userEvent.setup();
                await user.keyboard("{Enter}");
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                const user = userEvent.setup();
                await user.keyboard(" ");
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });
    });

    describe("given partially disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: createRenderBody("Press me"),
                partiallyDisabled: true,
            });
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
                const user = userEvent.setup();
                await user.keyboard("{Enter}");
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });
    });
});

describe("Focus Management", () => {
    describe("given an enabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: createRenderBody("Focus me"),
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
                renderBody: createRenderBody("Focus me"),
                disabled: true,
            });
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
                renderBody: createRenderBody("Focus me"),
                partiallyDisabled: true,
            });
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
                renderBody: createRenderBody("Link button"),
                href: "#",
            });
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
                renderBody: createRenderBody("Standard button"),
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
    });

    describe("given a disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: createRenderBody("Disabled button"),
                disabled: true,
            });
        });

        it("then it has disabled attribute", () => {
            const button = component.getByRole("button");
            expect(button.disabled).toBe(true);
        });

        it("then it does not have aria-disabled", () => {
            const button = component.getByRole("button");
            expect(button.hasAttribute("aria-disabled")).toBe(false);
        });
    });

    describe("given a partially disabled button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: createRenderBody("Partially disabled"),
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
                renderBody: createRenderBody("Loading button"),
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
                renderBody: createRenderBody("Loading button"),
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
                renderBody: createRenderBody("Expand button"),
                bodyState: "expand",
            });
        });

        it("then it contains chevron icon", () => {
            const button = component.getByRole("button");
            const svg = button.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });
    });

    describe("given a link button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: createRenderBody("Link button"),
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
                renderBody: createRenderBody("Button text"),
                ariaLabel: "Custom label",
            });
        });

        it("then it has correct aria-label", () => {
            const button = component.getByRole("button");
            expect(button).toHaveAttribute("aria-label", "Custom label");
        });
    });
});

describe("Accessibility and Usability", () => {
    describe("given a button with default dimensions", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: createRenderBody("A button"),
            });
        });

        it("has the minimum touch target dimensions", () => {
            const button = component.getByRole("button");
            const rect = button.getBoundingClientRect();
            expect(rect.width).toBeGreaterThan(24);
            expect(rect.height).toBeGreaterThan(24);
        });
    });
});
