import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { render, cleanup, waitFor } from "@marko/testing-library";
import { userEvent } from "@testing-library/user-event";
import template from "../index.marko";
import WithLabelTemplate from "../examples/WithLabel.marko";
import DisabledTemplate from "../examples/DisabledWithLabel.marko";

afterEach(cleanup);

/** @type import("@marko/testing-library").RenderResult */
let component;

describe("Keyboard Interactions", () => {
    describe("given enabled checkbox is unchecked", () => {
        beforeEach(async () => {
            component = await render(WithLabelTemplate, {
                htmlAttributes: { value: "test" },
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                const checkbox = component.getByRole("checkbox");
                checkbox.focus();
                await userEvent.keyboard(" ");
            });

            it("then it toggles to checked state", () => {
                expect(component.getByRole("checkbox")).has.property(
                    "checked",
                    true,
                );
            });

            it("then it emits change event", () => {
                const changeEvents = component.emitted("change");
                expect(changeEvents).has.length(1);

                const [[changeEvent]] = changeEvents;
                expect(changeEvent).has.property("checked", true);
                expect(changeEvent).has.property("value", "test");
            });
        });

        describe("when Space key is pressed twice", () => {
            beforeEach(async () => {
                const checkbox = component.getByRole("checkbox");
                checkbox.focus();
                await userEvent.keyboard(" ");
                await userEvent.keyboard(" ");
            });

            it("then it toggles back to unchecked state", () => {
                expect(component.getByRole("checkbox")).has.property(
                    "checked",
                    false,
                );
            });

            it("then it emits change event twice", () => {
                const changeEvents = component.emitted("change");
                expect(changeEvents).has.length(2);

                const [[firstEvent], [secondEvent]] = changeEvents;
                expect(firstEvent).has.property("checked", true);
                expect(secondEvent).has.property("checked", false);
            });
        });
    });

    describe("given enabled checkbox is checked", () => {
        beforeEach(async () => {
            component = await render(WithLabelTemplate, {
                checked: true,
                htmlAttributes: { value: "test" },
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                const checkbox = component.getByRole("checkbox");
                checkbox.focus();
                await userEvent.keyboard(" ");
            });

            it("then it toggles to unchecked state", () => {
                expect(component.getByRole("checkbox")).has.property(
                    "checked",
                    false,
                );
            });

            it("then it emits change event", () => {
                const changeEvents = component.emitted("change");
                expect(changeEvents).has.length(1);

                const [[changeEvent]] = changeEvents;
                expect(changeEvent).has.property("checked", false);
            });
        });
    });

    describe("given disabled checkbox is unchecked", () => {
        beforeEach(async () => {
            component = await render(DisabledTemplate, {
                htmlAttributes: { value: "test" },
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                const checkbox = component.getByRole("checkbox");
                checkbox.focus();
                await userEvent.keyboard(" ");
            });

            it("then it remains unchecked", () => {
                expect(component.getByRole("checkbox")).has.property(
                    "checked",
                    false,
                );
            });

            it("then it does not emit change event", () => {
                expect(component.emitted("change")).has.length(0);
            });
        });
    });

    describe("given disabled checkbox is checked", () => {
        beforeEach(async () => {
            component = await render(DisabledTemplate, {
                checked: true,
                htmlAttributes: { value: "test" },
            });
        });

        describe("when Space key is pressed", () => {
            beforeEach(async () => {
                const checkbox = component.getByRole("checkbox");
                checkbox.focus();
                await userEvent.keyboard(" ");
            });

            it("then it remains checked", () => {
                expect(component.getByRole("checkbox")).has.property(
                    "checked",
                    true,
                );
            });

            it("then it does not emit change event", () => {
                expect(component.emitted("change")).has.length(0);
            });
        });
    });

    describe("when keydown event is fired", () => {
        beforeEach(async () => {
            component = await render(WithLabelTemplate, {
                htmlAttributes: { value: "test" },
            });
            const checkbox = component.getByRole("checkbox");
            checkbox.focus();
            await userEvent.keyboard("a");
        });

        it("then it emits keydown event", () => {
            const keydownEvents = component.emitted("keydown");
            expect(keydownEvents).has.length(1);

            const [[keydownEvent]] = keydownEvents;
            expect(keydownEvent).has.property("value", "test");
            expect(keydownEvent)
                .has.property("originalEvent")
                .is.an.instanceOf(Event);
        });
    });
});

describe("Focus Management", () => {
    describe("given an enabled checkbox", () => {
        beforeEach(async () => {
            component = await render(WithLabelTemplate, {
                htmlAttributes: { value: "test" },
            });
        });

        it("then checkbox is keyboard focusable", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox.tabIndex).toBe(0);
        });

        describe("when checkbox receives focus", () => {
            beforeEach(async () => {
                const checkbox = component.getByRole("checkbox");
                checkbox.focus();
            });

            it("then checkbox has focus", () => {
                const checkbox = component.getByRole("checkbox");
                expect(document.activeElement).toBe(checkbox);
            });
        });

        describe("when Tab key is pressed while checkbox has focus", () => {
            beforeEach(async () => {
                const checkbox = component.getByRole("checkbox");
                checkbox.focus();
                await userEvent.keyboard("{Tab}");
            });

            it("then focus moves away from checkbox", () => {
                const checkbox = component.getByRole("checkbox");
                expect(document.activeElement).not.toBe(checkbox);
            });
        });
    });

    describe("given a disabled checkbox", () => {
        beforeEach(async () => {
            component = await render(DisabledTemplate, {
                htmlAttributes: { value: "test" },
            });
        });

        it("then checkbox is not keyboard focusable", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox.disabled).toBe(true);
        });
    });
});

describe("ARIA Attributes", () => {
    describe("given an unchecked checkbox", () => {
        beforeEach(async () => {
            component = await render(template, {
                htmlAttributes: { value: "test" },
            });
        });

        it("then it has correct role", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox).toBeTruthy();
        });

        it("then it has correct checked state", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox.checked).toBe(false);
        });

        it("then it has correct type attribute", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox.type).toBe("checkbox");
        });

        it("then SVG icons have aria-hidden", () => {
            const svgContainer =
                component.container.querySelector(".checkbox__icon");
            expect(svgContainer).toBeTruthy();
            expect(svgContainer.hasAttribute("hidden")).toBe(true);
        });
    });

    describe("given a checked checkbox", () => {
        beforeEach(async () => {
            component = await render(template, {
                checked: true,
                htmlAttributes: { value: "test" },
            });
        });

        it("then it has correct checked state", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox.checked).toBe(true);
        });
    });

    describe("given a disabled checkbox", () => {
        beforeEach(async () => {
            component = await render(template, {
                disabled: true,
                htmlAttributes: { value: "test" },
            });
        });

        it("then it has disabled attribute", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox.disabled).toBe(true);
        });

        it("then it is still accessible to screen readers", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox).toBeTruthy();
        });
    });

    describe("given checkbox with name attribute", () => {
        beforeEach(async () => {
            component = await render(template, {
                name: "test-name",
                htmlAttributes: { value: "test" },
            });
        });

        it("then it has correct name attribute", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox.name).toBe("test-name");
        });
    });

    describe("given checkbox with value attribute", () => {
        beforeEach(async () => {
            component = await render(template, {
                htmlAttributes: { value: "test-value" },
            });
        });

        it("then it has correct value attribute", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox.value).toBe("test-value");
        });
    });

    describe("given checkbox with id attribute", () => {
        beforeEach(async () => {
            component = await render(template, {
                id: "test-id",
                htmlAttributes: { value: "test" },
            });
        });

        it("then it has correct id attribute", () => {
            const checkbox = component.getByRole("checkbox");
            expect(checkbox.id).toBe("test-id");
        });
    });
});
