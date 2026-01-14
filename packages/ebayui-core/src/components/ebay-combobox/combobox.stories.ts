import {
    addRenderBodies,
    buildExtensionTemplate,
} from "../../common/storybook/utils";
import { tagToString } from "../../common/storybook/storybook-code-source";
import Readme from "./README.md";
import Combobox from "./index.marko";
import type { Input } from "./component";
import SearchFilteringTemplate from "./examples/search-filtering.marko";
import SearchFilteringTemplateCode from "./examples/search-filtering.marko?raw";
import ActionableButtonTemplate from "./examples/actionable-button.marko";
import ActionableButtonTemplateCode from "./examples/actionable-button.marko?raw";
import { Story } from "@storybook/marko";
import { expect, within, userEvent, waitFor } from "@storybook/test";

const Template: Story<Input> = (args: Input) => ({
    input: addRenderBodies(args),
});

export default {
    title: "form input/ebay-combobox",
    component: Combobox,
    parameters: {
        docs: {
            description: {
                component: Readme,
            },
        },
    },

    argTypes: {
        name: {
            control: { type: "text" },
            description:
                "used for the `name` attribute of the `<input>` element",
        },
        borderless: {
            type: "boolean",
            control: { type: "boolean" },
            description: "whether button has borders ",
        },
        disabled: {
            type: "boolean",
            control: { type: "boolean" },
            description: "sets the disabled attribute of the input",
        },
        expanded: {
            control: { type: "boolean" },
            description: "sets whether the listbox is expanded",
        },
        autocomplete: {
            control: { type: "text" },
            description:
                "default is `none`; available values are `none` or `list`. For list, will automatically filter results while typing.",
        },
        listSelection: {
            control: { type: "text" },
            description:
                "default is `automatic`; available values are `automatic`, `manual`. If set to automatic will automatically fill in the input with the currently highlighted item when using the up/down keys.",
        },
        "floating-label": {
            control: { type: "text" },
            description:
                "The label to show on the combobox which moves up when focused",
        },
        fluid: {
            control: { type: "boolean" },
            type: "boolean",
            description:
                "If true, combobox will span the entire width of it's container",
        },
        option: {
            name: "@option",
            table: {
                category: "@attribute tags",
            },
        },
        text: {
            description: "string to use in the option",
            control: { type: "text" },
            table: {
                category: "@option attributes",
            },
        },
        sticky: {
            control: { type: "boolean" },
            type: "boolean",
            table: {
                category: "@option attributes",
            },
            description:
                "If true, the option will always be shown even if it does not match the filter",
        },
        strategy: {
            control: { type: "select" },
            options: ["absolute", "fixed"],
            table: {
                defaultValue: {
                    summary: "absolute",
                },
            },
            description:
                "Swap between fixed and absolute positioning strategy. Use fixed when dropdown is in contained in an overflow and needs to be visible as you scroll the screen.",
        },
        onCollapse: {
            action: "on-collapse",
            table: {
                category: "Events",
            },
            description: " collapsed content",
        },
        onExpand: {
            action: "on-expand",
            table: {
                category: "Events",
            },
            description: " expanded content",
        },
        onChange: {
            action: "on-change",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ el, index, selected }",
                },
            },

            description: "same as the `onChange` event, which fires on blur",
        },
        "onInput-change": {
            action: "on-input-change",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ el, index, selected }",
                },
            },
            description:
                "same as the `onInput` event, which fires with every keypress",
        },
        onSelect: {
            action: "on-select",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ el, index, selected }",
                },
            },
            description:
                "similar to a `<select>`, which fires when an option is clicked or selected",
        },
        "onFloating-label-init": {
            action: "on-floating-label-init",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ el, index, selected }",
                },
            },
            description: "when floating label finishes initializing",
        },
        onFocus: {
            action: "on-focus",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ el, index, selected }",
                },
            },

            description: "same as the `onFocus` event, which fires on focus",
        },
    },
};

export const FloatingLabel = Template.bind({});
FloatingLabel.args = {
    name: "example1text",
    autocomplete: "list",
    value: "",
    option: [
        { text: "August Campaign" },
        { text: "4th of July Sale (paused)" },
        { text: "Basic Offer" },
        { text: "Basic Offer 2" },
        { text: "Basic Offer 3" },
        { text: "Basic Offer 4" },
    ],
    floatingLabel: "Default Label",
} as any;
FloatingLabel.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-combobox", FloatingLabel.args, {
                options: "option",
            }),
        },
    },
    expanded: {
        table: {
            category: "disabled",
        },
    },
};

FloatingLabel.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole("combobox");

    await step("Verify floating label initial state", async () => {
        const floatingLabelContainer = canvasElement.querySelector(".floating-label");
        await expect(floatingLabelContainer).toBeInTheDocument();
        
        const label = canvas.getByText("Default Label");
        await expect(label).toHaveClass("floating-label__label--inline");
    });

    await step("Test floating label moves on focus", async () => {
        await userEvent.click(combobox);
        
        await waitFor(() => {
            const label = canvas.getByText("Default Label");
            expect(label).not.toHaveClass("floating-label__label--inline");
        });
    });

    await step("Test combobox functionality with floating label", async () => {
        const options = canvas.getAllByRole("option");
        await userEvent.click(options[0]);
        
        await expect(combobox).toHaveValue("August Campaign");
        await expect(document.activeElement).toBe(combobox);
    });

    await step("Test label stays elevated with value", async () => {
        await userEvent.click(document.body);
        
        await waitFor(() => {
            const label = canvas.getByText("Default Label");
            expect(label).not.toHaveClass("floating-label__label--inline");
        });
    });

    await step("Test label returns to inline when cleared", async () => {
        await userEvent.click(combobox);
        await userEvent.clear(combobox);
        await userEvent.click(document.body);
        
        await waitFor(() => {
            const label = canvas.getByText("Default Label");
            expect(label).toHaveClass("floating-label__label--inline");
        });
    });
};

export const Isolated = Template.bind({});
Isolated.args = {
    name: "example1text",
    autocomplete: "list",
    option: [
        { text: "August Campaign", value: "1" },
        { text: "4th of July Sale (paused)", value: "2" },
        { text: "Basic Offer", value: "3" },
        { text: "Basic Offer 2", value: "4" },
        { text: "Basic Offer 3", value: "5" },
        { text: "Basic Offer 4", value: "6" },
    ],
} as any;
Isolated.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-combobox", Isolated.args, {
                options: "option",
            }),
        },
    },
    expanded: {
        table: {
            category: "disabled",
        },
    },
};

Isolated.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole("combobox");

    await step("Verify initial collapsed state", async () => {
        await expect(combobox).toHaveAttribute("aria-expanded", "false");
        await expect(combobox).toHaveValue("");
    });

    await step("Test focus expands listbox", async () => {
        await userEvent.click(combobox);
        await expect(combobox).toHaveAttribute("aria-expanded", "true");
        
        const options = canvas.getAllByRole("option");
        await expect(options.length).toBe(6);
    });

    await step("Test keyboard navigation with arrow keys", async () => {
        await userEvent.keyboard("{ArrowDown}");
        
        const options = canvas.getAllByRole("option");
        await expect(options[0]).toHaveClass("combobox__option--active");
        
        // In automatic mode, should fill input with highlighted option
        await expect(combobox).toHaveValue("August Campaign");
        
        await userEvent.keyboard("{ArrowDown}");
        await expect(options[1]).toHaveClass("combobox__option--active");
        await expect(combobox).toHaveValue("4th of July Sale (paused)");
        
        await userEvent.keyboard("{ArrowUp}");
        await expect(options[0]).toHaveClass("combobox__option--active");
    });

    await step("Test Enter key selects option", async () => {
        await userEvent.keyboard("{Enter}");
        await expect(combobox).toHaveValue("August Campaign");
    });

    await step("Test clicking option selects it", async () => {
        await userEvent.click(combobox);
        await waitFor(() => expect(combobox).toHaveAttribute("aria-expanded", "true"));
        
        const options = canvas.getAllByRole("option");
        await userEvent.click(options[2]);
        
        await expect(combobox).toHaveValue("Basic Offer");
        await expect(document.activeElement).toBe(combobox);
    });

    await step("Test Escape key collapses listbox", async () => {
        await userEvent.click(combobox);
        await expect(combobox).toHaveAttribute("aria-expanded", "true");
        
        await userEvent.keyboard("{Escape}");
        await expect(combobox).toHaveAttribute("aria-expanded", "false");
    });

    await step("Test typing filters options", async () => {
        await userEvent.clear(combobox);
        await userEvent.click(combobox);
        
        await userEvent.type(combobox, "Basic");
        
        await waitFor(async () => {
            const filteredOptions = canvas.queryAllByRole("option");
            await expect(filteredOptions.length).toBeLessThanOrEqual(4);
        });
    });
};

export const ManualSelection = Template.bind({});
ManualSelection.args = {
    name: "manualtext",
    autocomplete: "list",
    listSelection: "manual",
    option: [
        { text: "August Campaign", value: "1" },
        { text: "4th of July Sale (paused)", value: "2" },
        { text: "Basic Offer", value: "3" },
        { text: "Basic Offer 2", value: "4" },
    ],
} as any;
ManualSelection.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-combobox", ManualSelection.args, {
                options: "option",
            }),
        },
    },
};

ManualSelection.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole("combobox");

    await step("Verify manual selection mode behavior", async () => {
        await userEvent.click(combobox);
        await expect(combobox).toHaveAttribute("aria-expanded", "true");
    });

    await step("Test arrow keys don't auto-fill in manual mode", async () => {
        await userEvent.keyboard("{ArrowDown}");
        
        const options = canvas.getAllByRole("option");
        await expect(options[0]).toHaveClass("combobox__option--active");
        
        // In manual mode, input should NOT be filled automatically
        await expect(combobox).toHaveValue("");
        
        await userEvent.keyboard("{ArrowDown}");
        await expect(options[1]).toHaveClass("combobox__option--active");
        await expect(combobox).toHaveValue("");
    });

    await step("Test Enter key fills input in manual mode", async () => {
        await userEvent.keyboard("{Enter}");
        await expect(combobox).toHaveValue("4th of July Sale (paused)");
    });

    await step("Test clicking option works in manual mode", async () => {
        await userEvent.click(combobox);
        await waitFor(() => expect(combobox).toHaveAttribute("aria-expanded", "true"));
        
        const options = canvas.getAllByRole("option");
        await userEvent.click(options[2]);
        
        await expect(combobox).toHaveValue("Basic Offer");
    });
};

export const Disabled = Template.bind({});
Disabled.args = {
    name: "disabledtext",
    disabled: true,
    autocomplete: "list",
    option: [
        { text: "August Campaign", value: "1" },
        { text: "4th of July Sale (paused)", value: "2" },
        { text: "Basic Offer", value: "3" },
    ],
} as any;
Disabled.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-combobox", Disabled.args, {
                options: "option",
            }),
        },
    },
};

Disabled.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole("combobox");

    await step("Verify disabled state", async () => {
        await expect(combobox).toBeDisabled();
        await expect(combobox).toHaveAttribute("aria-expanded", "false");
    });

    await step("Test disabled combobox doesn't expand on focus", async () => {
        await userEvent.click(combobox);
        await expect(combobox).toHaveAttribute("aria-expanded", "false");
    });

    await step("Test disabled combobox doesn't respond to keyboard", async () => {
        await userEvent.keyboard("{ArrowDown}");
        
        const options = canvas.queryAllByRole("option");
        await expect(options.length).toBe(0);
    });

    await step("Test disabled combobox doesn't allow typing", async () => {
        const initialValue = (combobox as HTMLInputElement).value;
        await userEvent.type(combobox, "test");
        
        await expect(combobox).toHaveValue(initialValue);
    });
};

export const SearchFiltering = buildExtensionTemplate(
    SearchFilteringTemplate,
    SearchFilteringTemplateCode,
);

export const ActionableButton = buildExtensionTemplate(
    ActionableButtonTemplate,
    ActionableButtonTemplateCode,
);
