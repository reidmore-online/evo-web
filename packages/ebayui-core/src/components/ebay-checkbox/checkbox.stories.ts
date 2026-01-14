import { tagToString } from "../../common/storybook/storybook-code-source";
import Readme from "./README.md";
import Checkbox from "./index.marko";
import GroupTemplate from "./examples/group.marko";
import WithLabelTemplate from "./examples/WithLabel.marko";
import DisabledTemplate from "./examples/DisabledWithLabel.marko";
import GroupCode from "./examples/group.marko?raw";
import WithLabelCode from "./examples/WithLabel.marko?raw";
import DisabledCode from "./examples/DisabledWithLabel.marko?raw";
import { Story } from "@storybook/marko";
import type { Input } from "./component-browser";
import { expect, within, userEvent, waitFor } from "@storybook/test";

const Template: Story<Input> = (args: Input) => ({ input: args });

export default {
    title: "form input/ebay-checkbox",
    component: Checkbox,
    parameters: {
        docs: {
            description: {
                component: Readme,
            },
        },
    },

    argTypes: {
        checked: {
            description: "if checked or not",
            table: {
                defaultValue: {
                    summary: "false",
                },
            },
            type: "boolean",
        },
        size: {
            options: ["regular", "large"],

            description:
                "Sets the checkbox icon. Default is regular. For mweb this should be set to large. (Note: The dimensions of the checkbox will not change, but only the icon)",
            table: {
                defaultValue: {
                    summary: "regular",
                },
            },
            type: { category: "Options" },
        },
        "icon-style": {
            options: ["rounded", "square"],
            description:
                "Will change the icon to be rounded or square (square being the legacy and deprecated version)",
            table: {
                defaultValue: {
                    summary: "rounded",
                },
            },
            type: { category: "Options" },
        },

        onChange: {
            action: "on-change",
            description: "Triggered on change",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ originalEvent, value, checked }",
                },
            },
        },
        onFocus: {
            action: "on-focus",
            description: "Triggered on focus",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ originalEvent, value }",
                },
            },
        },
        onKeydown: {
            action: "on-keydown",
            description: "Triggered on keydown",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ originalEvent, value }",
                },
            },
        },
    },
};

export const WithLabel: Story<Input> = (args: Input) => ({
    input: args,
    component: WithLabelTemplate,
});
WithLabel.args = {
    checked: false,
};

WithLabel.parameters = {
    docs: {
        source: {
            code: WithLabelCode,
        },
    },
};

WithLabel.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole("checkbox");
    
    await step("Check initial state and toggle functionality", async () => {
        // Test initial unchecked state
        await expect(checkbox).not.toBeChecked();
        
        // Test clicking checkbox toggles to checked
        await userEvent.click(checkbox);
        await expect(checkbox).toBeChecked();
        
        // Test clicking again toggles back to unchecked
        await userEvent.click(checkbox);
        await expect(checkbox).not.toBeChecked();
    });

    await step("Test label click interaction", async () => {
    // Test label click interaction
        const label = canvasElement.querySelector('label[for="checkbox"]') as HTMLElement;
        if (label) {
            await userEvent.click(label);
            await expect(checkbox).toBeChecked();
        }
    });

    await step("Test keyboard interaction - Space key", async () => {
        checkbox.focus();
        await userEvent.keyboard("{Space}");
        await expect(checkbox).toBeChecked();
    });

    await step("Test focus management", async () => {
        await userEvent.click(checkbox);
        await expect(checkbox).toHaveFocus();

        // Tab away to remove focus
        await userEvent.keyboard("{Tab}");
        await expect(checkbox).not.toHaveFocus();
    });
};

export const Disabled: Story<Input> = (args: Input) => ({
    input: args,
    component: DisabledTemplate,
});
Disabled.args = {
    checked: false,
};

Disabled.parameters = {
    docs: {
        source: {
            code: DisabledCode,
        },
    },
};

Disabled.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const checkbox = canvas.getByRole("checkbox");

    await step("Verify disabled state and interaction prevention", async () => {
        // Test initial disabled and unchecked state
        await expect(checkbox).toBeDisabled();
        await expect(checkbox).not.toBeChecked();
        
        // Test clicking disabled checkbox does not toggle
        await userEvent.click(checkbox);
        await expect(checkbox).not.toBeChecked();
    });
    
    await step("Test keyboard interaction on disabled checkbox", async () => {
        // Test keyboard interaction does not work when disabled
        checkbox.focus();
        await userEvent.keyboard(" ");
        await expect(checkbox).not.toBeChecked();
    });

    await step("Test label click on disabled checkbox", async () => {
        // Test label click does not toggle disabled checkbox
        const label = canvasElement.querySelector('label[for="checkbox"]') as HTMLElement;
        if (label) {
            await userEvent.click(label);
            await expect(checkbox).not.toBeChecked();
        }
    });
};

export const Group: Story<Input> = (args: Input) => ({
    input: args,
    component: GroupTemplate,
});

Group.args = {};
Group.parameters = {
    docs: {
        source: {
            code: GroupCode,
        },
    },
};

export const Isolated = Template.bind({});
Isolated.args = {
    checked: false,
};

Isolated.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-checkbox", Isolated.args),
        },
    },
};

Isolated.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const checkbox = canvas.getByRole("checkbox");

    await step("Basic rendering and interaction tests", async () => {
        // Test basic checkbox rendering and interaction
        await expect(checkbox).toBeInTheDocument();
        await expect(checkbox).not.toBeChecked();
    });

    await step("Test basic click interaction", async () => {
        await userEvent.click(checkbox);
        await expect(checkbox).toBeChecked();
    });

    await step("Test Space key toggle", async () => {
        checkbox.focus();
        await userEvent.keyboard(" ");
        await expect(checkbox).not.toBeChecked();
    });

    await step("Test keyboard focusability", async () => {
        // Test that checkbox is keyboard focusable
        await userEvent.tab();
        await waitFor(() => expect(checkbox).toHaveFocus());
    });
};
