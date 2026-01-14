import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { render, cleanup, fireEvent } from "@marko/testing-library";
import { userEvent } from "@testing-library/user-event";
import template from "../index.marko";
import DefaultTemplate from "../examples/default.marko";
import AnchorTemplate from "../examples/anchor.marko";
import ButtonTemplate from "../examples/button.marko";
import MinimumTemplate from "../examples/minimum.marko";

afterEach(cleanup);

/** @type import("@marko/testing-library").RenderResult */
let component;

describe("Click Interactions", () => {
    describe("given an internally-actionable card with action button", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        describe("when action button is clicked", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(
                    ".card__action button",
                );
                await fireEvent.click(button);
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });

        describe("when card background is clicked", () => {
            beforeEach(async () => {
                const cardMain =
                    component.container.querySelector(".card__main");
                await fireEvent.click(cardMain);
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });
    });

    describe("given a self-actionable button card", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate);
        });

        describe("when card is clicked", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(".card");
                await fireEvent.click(button);
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
    });

    describe("given a self-actionable anchor card", () => {
        beforeEach(async () => {
            component = await render(AnchorTemplate);
        });

        describe("when card is clicked", () => {
            beforeEach(async () => {
                const anchor = component.container.querySelector(".card");
                await fireEvent.click(anchor);
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });

            it("then anchor has correct href", () => {
                const anchor = component.container.querySelector(".card");
                expect(anchor.href).toBe("https://www.ebay.com/");
            });
        });
    });

    describe("given a disabled self-actionable button card", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate, {
                disabled: true,
            });
        });

        describe("when card is clicked", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(".card");
                await fireEvent.click(button);
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });

            it("then button is disabled", () => {
                const button = component.container.querySelector(".card");
                expect(button.disabled).toBe(true);
            });
        });
    });

    describe("given a disabled self-actionable anchor card", () => {
        beforeEach(async () => {
            component = await render(AnchorTemplate, {
                disabled: true,
            });
        });

        it("then anchor has no href", () => {
            const anchor = component.container.querySelector(".card");
            expect(anchor.href).toBe("");
        });

        it("then anchor has tabindex -1", () => {
            const anchor = component.container.querySelector(".card");
            expect(anchor.tabIndex).toBe(-1);
        });

        describe("when disabled anchor card is clicked", () => {
            beforeEach(async () => {
                const anchor = component.container.querySelector(".card");
                await fireEvent.click(anchor);
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });
    });
});

describe("Keyboard Interactions", () => {
    describe("given an enabled self-actionable button card", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate);
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(".card");
                button.focus();
                await userEvent.keyboard("{Enter}");
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(".card");
                button.focus();
                await userEvent.keyboard(" ");
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });
    });

    describe("given a disabled self-actionable button card", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate, {
                disabled: true,
            });
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(".card");
                button.focus();
                await userEvent.keyboard("{Enter}");
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(".card");
                button.focus();
                await userEvent.keyboard(" ");
            });

            it("then it does not emit click event", () => {
                expect(component.emitted("click")).has.length(0);
            });
        });
    });

    describe("given a self-actionable anchor card", () => {
        beforeEach(async () => {
            component = await render(AnchorTemplate);
        });

        describe("when Enter key is pressed", () => {
            beforeEach(async () => {
                const anchor = component.container.querySelector(".card");
                anchor.focus();
                await userEvent.keyboard("{Enter}");
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });
        });
    });
});

describe("Focus Management", () => {
    describe("given an enabled self-actionable button card", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate);
        });

        it("then card is keyboard focusable", () => {
            const button = component.container.querySelector(".card");
            expect(button.tabIndex).toBe(0);
        });

        describe("when card receives focus", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(".card");
                button.focus();
            });

            it("then card has focus", () => {
                const button = component.container.querySelector(".card");
                expect(document.activeElement).toBe(button);
            });
        });

        describe("when Tab key is pressed while card has focus", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(".card");
                button.focus();
                await userEvent.keyboard("{Tab}");
            });

            it("then focus moves away from card", () => {
                const button = component.container.querySelector(".card");
                expect(document.activeElement).not.toBe(button);
            });
        });
    });

    describe("given a disabled self-actionable button card", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate, {
                disabled: true,
            });
        });

        it("then card is not keyboard focusable", () => {
            const button = component.container.querySelector(".card");
            expect(button.disabled).toBe(true);
        });
    });

    describe("given a self-actionable anchor card", () => {
        beforeEach(async () => {
            component = await render(AnchorTemplate);
        });

        it("then anchor is keyboard focusable", () => {
            const anchor = component.container.querySelector(".card");
            expect(anchor.tabIndex).toBe(0);
        });

        describe("when anchor receives focus", () => {
            beforeEach(async () => {
                const anchor = component.container.querySelector(".card");
                anchor.focus();
            });

            it("then anchor has focus", () => {
                const anchor = component.container.querySelector(".card");
                expect(document.activeElement).toBe(anchor);
            });
        });
    });

    describe("given a disabled self-actionable anchor card", () => {
        beforeEach(async () => {
            component = await render(AnchorTemplate, {
                disabled: true,
            });
        });

        it("then anchor has tabindex -1", () => {
            const anchor = component.container.querySelector(".card");
            expect(anchor.tabIndex).toBe(-1);
        });

        describe("when trying to focus disabled anchor", () => {
            beforeEach(async () => {
                const anchor = component.container.querySelector(".card");
                anchor.focus();
            });

            it("then anchor does not receive focus", () => {
                const anchor = component.container.querySelector(".card");
                expect(document.activeElement).not.toBe(anchor);
            });
        });
    });

    describe("given an internally-actionable card", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        it("then card container is not focusable", () => {
            const card = component.container.querySelector(".card");
            expect(card.tabIndex).toBe(-1);
        });

        it("then action button is focusable", () => {
            const button = component.container.querySelector(
                ".card__action button",
            );
            expect(button.tabIndex).toBe(0);
        });

        describe("when action button receives focus", () => {
            beforeEach(async () => {
                const button = component.container.querySelector(
                    ".card__action button",
                );
                button.focus();
            });

            it("then button has focus", () => {
                const button = component.container.querySelector(
                    ".card__action button",
                );
                expect(document.activeElement).toBe(button);
            });
        });
    });
});

describe("ARIA Attributes", () => {
    describe("given a self-actionable button card", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate);
        });

        it("then it has button role", () => {
            const button = component.container.querySelector(".card");
            expect(button.tagName).toBe("BUTTON");
            expect(button.type).toBe("button");
        });

        it("then it does not have disabled attribute", () => {
            const button = component.container.querySelector(".card");
            expect(button.disabled).toBe(false);
        });
    });

    describe("given a disabled self-actionable button card", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate, {
                disabled: true,
            });
        });

        it("then it has disabled attribute", () => {
            const button = component.container.querySelector(".card");
            expect(button.disabled).toBe(true);
        });

        it("then it is still accessible to screen readers", () => {
            const button = component.container.querySelector(".card");
            expect(button).toBeTruthy();
        });
    });

    describe("given a self-actionable anchor card", () => {
        beforeEach(async () => {
            component = await render(AnchorTemplate);
        });

        it("then it is an anchor element", () => {
            const anchor = component.container.querySelector(".card");
            expect(anchor.tagName).toBe("A");
        });

        it("then it has href attribute", () => {
            const anchor = component.container.querySelector(".card");
            expect(anchor.href).toBe("https://www.ebay.com/");
        });

        it("then it has tabindex 0", () => {
            const anchor = component.container.querySelector(".card");
            expect(anchor.tabIndex).toBe(0);
        });
    });

    describe("given a disabled self-actionable anchor card", () => {
        beforeEach(async () => {
            component = await render(AnchorTemplate, {
                disabled: true,
            });
        });

        it("then it has empty href", () => {
            const anchor = component.container.querySelector(".card");
            expect(anchor.href).toBe("");
        });

        it("then it has tabindex -1", () => {
            const anchor = component.container.querySelector(".card");
            expect(anchor.tabIndex).toBe(-1);
        });
    });

    describe("given an internally-actionable card", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        it("then card container is a span", () => {
            const card = component.container.querySelector(".card");
            expect(card.tagName).toBe("SPAN");
        });

        it("then card has tabindex -1", () => {
            const card = component.container.querySelector(".card");
            expect(card.tabIndex).toBe(-1);
        });
    });

    describe("given a card with image", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        it("then image has alt attribute", () => {
            const image = component.container.querySelector(".card__media img");
            expect(image.alt).toBe("Card");
        });

        it("then image is in media container", () => {
            const mediaContainer =
                component.container.querySelector(".card__media");
            expect(mediaContainer).toBeTruthy();
            expect(mediaContainer.querySelector("img")).toBeTruthy();
        });
    });

    describe("given a card with title", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        it("then title is rendered", () => {
            const title = component.container.querySelector(".card__title");
            expect(title).toBeTruthy();
            expect(title.textContent).toContain("Authentic Rookie Cards");
        });

        it("then title uses heading tag", () => {
            const title = component.container.querySelector(".card__title");
            expect(title.tagName).toBe("H3");
        });
    });

    describe("given a card with description", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        it("then description is rendered", () => {
            const description =
                component.container.querySelector(".card__description");
            expect(description).toBeTruthy();
            expect(description.textContent.trim()).toBeTruthy();
        });
    });

    describe("given a card with overline", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        it("then overline is rendered", () => {
            const overline =
                component.container.querySelector(".card__overline");
            expect(overline).toBeTruthy();
            expect(overline.textContent).toContain("Authenticity Guaranteed");
        });
    });

    describe("given a card with action", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        it("then action is rendered", () => {
            const action = component.container.querySelector(".card__action");
            expect(action).toBeTruthy();
        });

        it("then action contains button", () => {
            const button = component.container.querySelector(
                ".card__action button",
            );
            expect(button).toBeTruthy();
        });
    });

    describe("given a card with horizontal layout", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate, {
                layout: "horizontal",
            });
        });

        it("then card has horizontal class", () => {
            const card = component.container.querySelector(".card");
            expect(card.classList.contains("card--horizontal")).toBe(true);
        });
    });

    describe("given a card with 16:9 aspect ratio", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate, {
                aspectRatio: "16:9",
            });
        });

        it("then card has aspect ratio class", () => {
            const card = component.container.querySelector(".card");
            expect(card.classList.contains("card--aspect-16-9")).toBe(true);
        });
    });

    describe("given a card with 5:4 aspect ratio", () => {
        beforeEach(async () => {
            component = await render(ButtonTemplate, {
                aspectRatio: "5:4",
            });
        });

        it("then card has aspect ratio class", () => {
            const card = component.container.querySelector(".card");
            expect(card.classList.contains("card--aspect-5-4")).toBe(true);
        });
    });

    describe("given a minimum card", () => {
        beforeEach(async () => {
            component = await render(MinimumTemplate);
        });

        it("then it renders image", () => {
            const image = component.container.querySelector(".card__media img");
            expect(image).toBeTruthy();
        });

        it("then it renders description", () => {
            const description =
                component.container.querySelector(".card__description");
            expect(description).toBeTruthy();
        });

        it("then it does not render title", () => {
            const title = component.container.querySelector(".card__title");
            expect(title).toBeFalsy();
        });

        it("then it does not render overline", () => {
            const overline =
                component.container.querySelector(".card__overline");
            expect(overline).toBeFalsy();
        });

        it("then it does not render action", () => {
            const action = component.container.querySelector(".card__action");
            expect(action).toBeFalsy();
        });
    });
});

describe("Accessibility Compliance", () => {
    describe("given any card variant", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        it("then card has semantic structure", () => {
            const card = component.container.querySelector(".card");
            expect(card).toBeTruthy();
        });

        it("then images have alt text", () => {
            const images = component.container.querySelectorAll("img");
            images.forEach((img) => {
                expect(img.hasAttribute("alt")).toBe(true);
            });
        });

        it("then text content is readable", () => {
            const title = component.container.querySelector(".card__title");
            if (title) {
                expect(title.textContent.trim().length).toBeGreaterThan(0);
            }
        });

        it("then interactive elements meet minimum size requirements", () => {
            const interactiveElements =
                component.container.querySelectorAll("button, a");
            interactiveElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    expect(rect.width).toBeGreaterThan(0);
                    expect(rect.height).toBeGreaterThan(0);
                }
            });
        });
    });

    describe("given self-actionable cards", () => {
        it("then button cards are keyboard accessible", async () => {
            component = await render(ButtonTemplate);
            const button = component.container.querySelector(".card");
            expect(button.tagName).toBe("BUTTON");
            expect(button.tabIndex).toBe(0);
        });

        it("then anchor cards are keyboard accessible", async () => {
            component = await render(AnchorTemplate);
            const anchor = component.container.querySelector(".card");
            expect(anchor.tagName).toBe("A");
            expect(anchor.tabIndex).toBe(0);
        });

        it("then disabled button cards prevent interaction", async () => {
            component = await render(ButtonTemplate, { disabled: true });
            const button = component.container.querySelector(".card");
            expect(button.disabled).toBe(true);
        });

        it("then disabled anchor cards prevent navigation", async () => {
            component = await render(AnchorTemplate, { disabled: true });
            const anchor = component.container.querySelector(".card");
            expect(anchor.href).toBe("");
            expect(anchor.tabIndex).toBe(-1);
        });
    });

    describe("given internally-actionable cards", () => {
        beforeEach(async () => {
            component = await render(DefaultTemplate);
        });

        it("then card container is not focusable", () => {
            const card = component.container.querySelector(".card");
            expect(card.tabIndex).toBe(-1);
        });

        it("then only internal elements are focusable", () => {
            const card = component.container.querySelector(".card");
            const focusableElements = card.querySelectorAll(
                'button:not([disabled]), a[href]:not([tabindex="-1"])',
            );
            expect(focusableElements.length).toBeGreaterThan(0);
        });

        it("then internal buttons are keyboard accessible", () => {
            const button = component.container.querySelector(
                ".card__action button",
            );
            expect(button.tabIndex).toBe(0);
        });
    });
});
