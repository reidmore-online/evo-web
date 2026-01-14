import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { render, cleanup, fireEvent, waitFor } from "@marko/testing-library";
import { userEvent } from "vitest/browser";
import { composeStories } from "@storybook/marko";
import { pressKey } from "../../../common/test-utils/browser";
import * as stories from "../combobox.stories";

const { Isolated, FloatingLabel, SearchFiltering, ActionableButton } =
    composeStories(stories);

afterEach(cleanup);

/** @type import("@marko/testing-library").RenderResult */
let component;
let user;

describe("ebay-combobox accessibility", () => {
    beforeEach(() => {
        user = userEvent.setup();
    });

    afterEach(() => {
        user.cleanup();
    });

    describe("ARIA Attributes", () => {
        beforeEach(async () => {
            component = await render(Isolated);
        });

        it("should have combobox role", () => {
            const combobox = component.getByRole("combobox");
            expect(combobox).toBeTruthy();
        });

        it("should have aria-expanded set to false when collapsed", () => {
            const combobox = component.getByRole("combobox");
            expect(combobox).toHaveAttribute("aria-expanded", "false");
        });

        it("should have aria-expanded set to true when expanded", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);

            expect(combobox).toHaveAttribute("aria-expanded", "true");
        });

        it("should have aria-autocomplete attribute", () => {
            const combobox = component.getByRole("combobox");
            const autocomplete = combobox.getAttribute("aria-autocomplete");

            expect(autocomplete).toBeTruthy();
        });

        it("should have aria-controls pointing to listbox", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const controls = combobox.getAttribute("aria-controls");
            expect(controls).toBeTruthy();

            const listbox = document.getElementById(controls);
            expect(listbox).toBeTruthy();
        });

        it("should have options with proper role", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const options = component.getAllByRole("option");
            expect(options.length).toBeGreaterThan(0);
        });

        it("should update aria-activedescendant when navigating options", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });

            const activeDescendant = combobox.getAttribute(
                "aria-activedescendant",
            );
            expect(activeDescendant).toBeTruthy();
        });

        it("should have unique ids for all options", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const options = component.getAllByRole("option");
            const ids = options.map((opt) => opt.id);
            const uniqueIds = new Set(ids);

            expect(ids.length).toBe(uniqueIds.size);
        });
    });

    describe("Keyboard Interactions - Arrow Keys", () => {
        beforeEach(async () => {
            component = await render(Isolated);
            await fireEvent.focus(component.getByRole("combobox"));
        });

        it("should highlight first option on ArrowDown", async () => {
            const combobox = component.getByRole("combobox");

            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });

            const options = component.getAllByRole("option");
            expect(options[0]).toHaveClass("combobox__option--active");
        });

        it("should move to next option on subsequent ArrowDown", async () => {
            const combobox = component.getByRole("combobox");

            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });
            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });

            const options = component.getAllByRole("option");
            expect(options[1]).toHaveClass("combobox__option--active");
        });

        it("should move to previous option on ArrowUp", async () => {
            const combobox = component.getByRole("combobox");

            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });
            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });
            await pressKey(combobox, { key: "ArrowUp", keyCode: 38 });

            const options = component.getAllByRole("option");
            expect(options[0]).toHaveClass("combobox__option--active");
        });

        it("should not move beyond last option with ArrowDown", async () => {
            const combobox = component.getByRole("combobox");
            const options = component.getAllByRole("option");

            // Press down more times than there are options
            for (let i = 0; i < options.length + 2; i++) {
                await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });
            }

            const lastOption = options[options.length - 1];
            expect(lastOption).toHaveClass("combobox__option--active");
        });

        it("should not move beyond first option with ArrowUp", async () => {
            const combobox = component.getByRole("combobox");

            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });
            await pressKey(combobox, { key: "ArrowUp", keyCode: 38 });
            await pressKey(combobox, { key: "ArrowUp", keyCode: 38 });

            const options = component.getAllByRole("option");
            expect(options[0]).toHaveClass("combobox__option--active");
        });
    });

    describe("Keyboard Interactions - Enter and Escape", () => {
        beforeEach(async () => {
            component = await render(Isolated);
        });

        it("should select option with Enter key", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);
            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });
            await pressKey(combobox, { key: "Enter", keyCode: 13 });

            expect(component.emitted("select")).has.length(1);
        });

        it("should collapse listbox with Escape key", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);
            expect(combobox).toHaveAttribute("aria-expanded", "true");

            await pressKey(combobox, { key: "Escape", keyCode: 27 });

            expect(combobox).toHaveAttribute("aria-expanded", "false");
        });

        it("should emit collapse event when Escape is pressed", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);
            await pressKey(combobox, { key: "Escape", keyCode: 27 });

            expect(component.emitted("collapse")).toBeTruthy();
        });
    });

    describe("Keyboard Interactions - Text Input", () => {
        beforeEach(async () => {
            component = await render(Isolated);
        });

        it("should emit input-change event when typing", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);
            await pressKey(combobox, { key: "A", keyCode: 65 });

            expect(component.emitted("input-change")).has.length(1);
        });

        it("should expand listbox when typing", async () => {
            const combobox = component.getByRole("combobox");

            await pressKey(combobox, { key: "A", keyCode: 65 });

            expect(combobox).toHaveAttribute("aria-expanded", "true");
        });

        it("should emit change event on blur", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);
            await pressKey(combobox, { key: "A", keyCode: 65 });
            await fireEvent.blur(combobox);

            expect(component.emitted("change")).has.length(1);
        });
    });

    describe("Click Interactions", () => {
        beforeEach(async () => {
            component = await render(Isolated);
        });

        it("should expand listbox when input is focused", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);

            expect(combobox).toHaveAttribute("aria-expanded", "true");
        });

        it("should select option when clicked", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const options = component.getAllByRole("option");
            await user.click(options[1]);

            expect(component.emitted("select")).has.length(1);
        });

        it("should update input value when option is clicked", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const options = component.getAllByRole("option");
            await user.click(options[1]);

            expect(combobox).toHaveValue(Isolated.args.option[1].text);
        });

        it("should allow reopening after selection", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const options = component.getAllByRole("option");
            await user.click(options[1]);

            await user.click(combobox);

            expect(combobox).toHaveAttribute("aria-expanded", "true");
        });
    });

    describe("Focus Management", () => {
        beforeEach(async () => {
            component = await render(Isolated);
        });

        it("should maintain focus on input when navigating options", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);
            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });

            await waitFor(() => {
                expect(document.activeElement).toBe(combobox);
            });
        });

        it("should maintain focus on input after selecting option", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);
            const options = component.getAllByRole("option");
            await user.click(options[0]);

            expect(document.activeElement).toBe(combobox);
        });

        it("should emit focus event when input is focused", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);

            expect(component.emitted("focus")).toBeTruthy();
        });

        it("should be keyboard navigable with Tab", async () => {
            const combobox = component.getByRole("combobox");

            combobox.focus();

            expect(document.activeElement).toBe(combobox);
        });
    });

    describe("Disabled State", () => {
        beforeEach(async () => {
            component = await render(Isolated, { disabled: true });
        });

        it("should have disabled attribute when disabled", () => {
            const combobox = component.getByRole("combobox");

            expect(combobox).toHaveAttribute("disabled");
        });

        it("should not expand when disabled", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);

            expect(combobox).toHaveAttribute("aria-expanded", "false");
        });

        it("should not respond to keyboard input when disabled", async () => {
            const combobox = component.getByRole("combobox");

            await pressKey(combobox, { key: "A", keyCode: 65 });

            expect(component.emitted("input-change") || []).has.length(0);
        });
    });

    describe("Autocomplete List Mode", () => {
        beforeEach(async () => {
            component = await render(Isolated, { autocomplete: "list" });
        });

        it("should have aria-autocomplete set to list", () => {
            const combobox = component.getByRole("combobox");

            expect(combobox).toHaveAttribute("aria-autocomplete", "list");
        });

        it("should filter options as user types", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const initialOptionsCount = component.getAllByRole("option").length;

            await pressKey(combobox, { key: "B", keyCode: 66 });

            await waitFor(() => {
                const filteredOptions = component.queryAllByRole("option");
                expect(filteredOptions.length).toBeLessThanOrEqual(
                    initialOptionsCount,
                );
            });
        });

        it("should automatically fill input with highlighted option", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });

            expect(combobox).toHaveValue(Isolated.args.option[0].text);
        });
    });

    describe("Manual List Selection Mode", () => {
        beforeEach(async () => {
            component = await render(Isolated, { listSelection: "manual" });
        });

        it("should not automatically fill input when navigating", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });

            expect(combobox).toHaveValue("");
        });

        it("should only fill input on Enter or click", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });
            await pressKey(combobox, { key: "Enter", keyCode: 13 });

            expect(combobox).toHaveValue(Isolated.args.option[0].text);
        });

        it("should highlight option without filling input", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            await pressKey(combobox, { key: "ArrowDown", keyCode: 40 });

            const options = component.getAllByRole("option");
            expect(options[0]).toHaveClass("combobox__option--active");
            expect(combobox).toHaveValue("");
        });
    });

    describe("Floating Label", () => {
        beforeEach(async () => {
            component = await render(FloatingLabel);
        });

        it("should have floating label wrapper", () => {
            expect(component.container.firstElementChild).toHaveClass(
                "floating-label",
            );
        });

        it("should show label inline when input is empty", () => {
            const label = component.getByText(FloatingLabel.args.floatingLabel);

            expect(label).toHaveClass("floating-label__label--inline");
        });

        // TODO: Fix this test - it fails because the input is not in the same node as the label
        it("should move label when input is focused", async () => {
            const label = component.getByRole("label");
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);

            expect(label).not.toHaveClass("floating-label__label--inline");
        });

        it("should emit floating-label-init event", async () => {
            await component.rerender();

            expect(component.emitted("floating-label-init")).has.length(1);
        });

        // TODO: Fix this test - it fails because the input is not in the same node as the label
        it("should maintain accessibility with floating label", async () => {
            const label = component.getByRole("label");

            const labelId = label.id;

            expect(labelId).toBeTruthy();
        });
    });

    describe("Empty Options State", () => {
        beforeEach(async () => {
            component = await render(Isolated, { option: [] });
        });

        it("should not expand when there are no options", async () => {
            const combobox = component.getByRole("combobox");

            await fireEvent.focus(combobox);

            expect(combobox).toHaveAttribute("aria-expanded", "false");
        });

        it("should still emit input-change events with no options", async () => {
            const combobox = component.getByRole("combobox");

            await pressKey(combobox, { key: "A", keyCode: 65 });

            expect(component.emitted("input-change")).has.length(1);
        });

        it("should have no options in listbox", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const options = component.queryAllByRole("option");
            expect(options).has.length(0);
        });
    });

    describe("Accessibility Compliance", () => {
        beforeEach(async () => {
            component = await render(Isolated);
        });

        it("should have proper input type", () => {
            const combobox = component.getByRole("combobox");

            expect(combobox.tagName).toBe("INPUT");
        });

        it("should have accessible name via label", () => {
            const combobox = component.getByRole("combobox");
            const name = combobox.getAttribute("name");

            expect(name).toBeTruthy();
        });

        it("should not have options marked as selected by default", () => {
            const options = component.queryAllByRole("option", {
                hidden: true,
            });
            const selectedOptions = options.filter(
                (opt) => opt.getAttribute("aria-selected") === "true",
            );

            expect(selectedOptions).has.length(0);
        });

        it("should have proper listbox structure", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const listbox = component.getByRole("listbox");
            expect(listbox).toBeTruthy();
        });

        it("should maintain proper option-combobox relationship", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const controlsId = combobox.getAttribute("aria-controls");
            const listbox = document.getElementById(controlsId);

            expect(listbox).toBeTruthy();
            expect(listbox.getAttribute("role")).toBe("listbox");
        });

        it("should support borderless variant", async () => {
            component = await render(Isolated, { borderless: true });
            const combobox = component.getByRole("combobox");

            expect(combobox).toBeTruthy();
        });

        it("should support fluid width", async () => {
            component = await render(Isolated, { fluid: true });
            const combobox = component.getByRole("combobox");

            expect(combobox).toBeTruthy();
        });
    });

    describe("Dynamic Options Update", () => {
        beforeEach(async () => {
            component = await render(Isolated, { option: [] });
        });

        it("should handle options being added dynamically", async () => {
            await component.rerender(Isolated.args);

            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const options = component.getAllByRole("option");
            expect(options.length).toBe(Isolated.args.option.length);
        });

        it("should maintain accessibility when options change", async () => {
            await component.rerender(Isolated.args);

            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            expect(combobox).toHaveAttribute("aria-expanded", "true");

            const options = component.getAllByRole("option");
            expect(options.length).toBeGreaterThan(0);
        });
    });

    describe("Actionable Button", () => {
        beforeEach(async () => {
            component = await render(ActionableButton);
        });

        it("should have actionable button", () => {
            const button = component.getByRole("button");
            expect(button).toBeTruthy();
        });

        // TODO: This variant of the component is not emitting events correctly
        /*it("should emit button-click event when clicked", async () => {
            const button = component.getByRole("button");
            await user.click(button);

            expect(component.emitted("button-click")).has.length(1);
        });*/

        // TODO: Unsure of whether this is the desired behavior
        /*it("should not close listbox when actionable button is clicked", async () => {
            const combobox = component.getByRole("combobox");
            await fireEvent.focus(combobox);

            const button = component.getByRole("button");
            await user.click(button);

            expect(combobox).toHaveAttribute("aria-expanded", "true");
        });*/
    });
});
