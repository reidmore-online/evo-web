import { tagToString } from "../../common/storybook/storybook-code-source";
import {
    addRenderBodies,
    buildExtensionTemplate,
} from "../../common/storybook/utils";
import button, { type Input } from "./index.marko";
import Readme from "./README.md";
import ExpandButtonTemplate from "./examples/expand-button.marko";
import ExpandButtonTemplateCode from "./examples/expand-button.marko?raw";
import { Story } from "@storybook/marko";
import { expect, within, userEvent, waitFor } from "@storybook/test";

const Template: Story<Input> = (args: Input) => ({
    input: addRenderBodies(args),
});
// const Template = args =({ input: withRenderBody(args) })

export default {
    title: "buttons/ebay-button",
    component: button,
    parameters: {
        docs: {
            description: {
                component: Readme,
            },
        },
    },
    argTypes: {
        renderBody: {},
        href: {
            description: "url for link behaviour (switches to anchor tag)",
        },
        size: {
            options: ["large", "regular", "small"],
            description: "",
            table: {
                defaultValue: {
                    summary: "none",
                },
            },
            type: { category: "Options" },
        },
        priority: {
            options: ["primary", "secondary", "tertiary", "none"],
            description: "",

            table: {
                defaultValue: {
                    summary: "secondary",
                },
            },
            type: { category: "Options" },
        },
        fluid: {
            description: "button fills 100% width of container",
            table: {
                category: "Toggles",
                defaultValue: {
                    summary: "false",
                },
            },
        },
        borderless: {
            description: "Shows button without border.",
            table: {
                category: "Toggles",
                defaultValue: {
                    summary: "false",
                },
            },
        },
        bodyState: {
            description:
                "when state is loading, adds progress spinner. when user interacts with button, reset should be called to reset aria-live state. default is none",
            options: ["none", "loading", "reset", "expand"],
            control: { type: "select" },
            table: {
                defaultValue: {
                    summary: "none",
                },
            },
            type: { category: "Options" },
        },
        a11yText: {
            description: "aria label for button when bodyState === loading",
            table: {
                defaultValue: "",
            },
            control: { type: "text" },
            type: { category: "Options" },
        },
        disabled: {
            description: "",
            table: {
                category: "Toggles",
                defaultValue: {
                    summary: "false",
                },
            },
        },
        variant: {
            options: ["standard", "destructive", "form"],
            description:
                "transforms to a specific variant that styles in conjunction with priority",
            table: {
                defaultValue: {
                    summary: "standard",
                },
            },
            type: { category: "Options" },
        },
        partiallyDisabled: {
            description:
                "programmatically disabled, but remains keyboard focusable",
            table: {
                defaultValue: {
                    summary: "false",
                },
                category: "Toggles",
            },
        },
        transparent: {
            description:
                "transparent background color (overrides `priority` setting)",
            table: {
                defaultValue: {
                    summary: "false",
                },
                category: "Toggles",
            },
        },
        fixedHeight: {
            description: "fixes the height based on `size`",
            table: {
                defaultValue: {
                    summary: "false",
                },
                category: "Toggles",
            },
        },
        truncate: {
            description:
                "used in conjunction with `fixedHeight`; truncates text to single line with ellipsis when text overflows",
            table: {
                defaultValue: {
                    summary: "false",
                },
                category: "Toggles",
            },
        },
        onClick: {
            action: "on-click",
            description: "Triggered on click",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ originalEvent }",
                },
            },
        },
        onEscape: {
            action: "on-escape",
            description: "Triggered on escape key",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ originalEvent }",
                },
            },
        },
        onFocus: {
            action: "on-focus",
            description: "Triggered on focus",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ originalEvent }",
                },
            },
        },
        onBlur: {
            action: "on-blur",
            description: "Triggered on blur",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ originalEvent }",
                },
            },
        },
        spread: {
            control: {
                type: "object",
            },
            description: "Additional attributes being passed to component",
            table: {
                category: "Other",
            },
        },
    },
};

export const Default = Template.bind({});
Default.args = {
    renderBody: "Button",
    href: "",
    fluid: false,
    borderless: false,
    size: null,
    disabled: false,
    priority: null,
    partiallyDisabled: false,
    transparent: false,
    fixedHeight: false,
    truncate: false,
} as any;

Default.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-button", Default.args),
        },
    },
};

Default.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole("button");

    await step("Test click interaction", async () => {
        await userEvent.click(button);
        await expect(button).toBeInTheDocument();
    });

    await step("Test keyboard interaction - Space key", async () => {
        button.focus();
        await userEvent.keyboard(" ");
        await expect(button).toHaveFocus();
    });

    await step("Test keyboard interaction - Enter key", async () => {
        button.focus();
        await userEvent.keyboard("{Enter}");
        await expect(button).toHaveFocus();
    });

    await step("Test focus management", async () => {
        await userEvent.click(button);
        await expect(button).toHaveFocus();

        await userEvent.keyboard("{Tab}");
        await expect(button).not.toHaveFocus();
    });
};

export const Disabled: Story<Input> = Template.bind({});
Disabled.args = {
    renderBody: "Disabled Button",
    disabled: true,
} as any;

Disabled.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-button", Disabled.args),
        },
    },
};

Disabled.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole("button");

    await step("Test that click does not work when disabled", async () => {
        await userEvent.click(button);
        await expect(button).toBeDisabled();
    });

    await step("Test keyboard interaction does not work when disabled", async () => {
        button.focus();
        await userEvent.keyboard(" ");
        await expect(button).toBeDisabled();
    });
};

export const PartiallyDisabled: Story<Input> = Template.bind({});
PartiallyDisabled.args = {
    renderBody: "Partially Disabled",
    partiallyDisabled: true,
} as any;

PartiallyDisabled.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-button", PartiallyDisabled.args),
        },
    },
};

PartiallyDisabled.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole("button");

    await step("Verify partially disabled state", async () => {
        await expect(button).not.toBeDisabled();
        await expect(button).toHaveAttribute("aria-disabled", "true");
    });

    await step("Test that button is still focusable", async () => {
        button.focus();
        await expect(button).toHaveFocus();
    });

    await step("Test click interaction on partially disabled button", async () => {
        await userEvent.click(button);
        await expect(button).toHaveAttribute("aria-disabled", "true");
    });

    await step("Test keyboard interaction on partially disabled button", async () => {
        button.focus();
        await userEvent.keyboard(" ");
        await expect(button).toHaveFocus();
    });
};

export const LoadingState: Story<Input> = Template.bind({});
LoadingState.args = {
    renderBody: "Loading",
    bodyState: "loading",
    a11yText: "Loading, please wait",
} as any;

LoadingState.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-button", LoadingState.args),
        },
    },
};

LoadingState.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole("button");

    await step("Verify loading state and aria-label", async () => {
        await expect(button).toHaveAttribute("aria-label", "Loading, please wait");
        
        const spinner = button.querySelector(".progress-spinner");
        await expect(spinner).toBeInTheDocument();
    });

    await step("Test button is still interactive in loading state", async () => {
        button.focus();
        await expect(button).toHaveFocus();
    });
};

export const LinkButton: Story<Input> = Template.bind({});
LinkButton.args = {
    renderBody: "Link Button",
    href: "/test-link",
} as any;

LinkButton.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-button", LinkButton.args),
        },
    },
};

LinkButton.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const link = canvas.getByRole("link");

    await step("Test link is keyboard focusable", async () => {
        link.focus();
        await expect(link).toHaveFocus();
    });

    await step("Test focus management with Tab key", async () => {
        link.focus();
        await userEvent.keyboard("{Tab}");
        await expect(link).not.toHaveFocus();
    });
};

export const PrimaryButton: Story<Input> = Template.bind({});
PrimaryButton.args = {
    renderBody: "Primary Button",
    priority: "primary",
} as any;

PrimaryButton.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-button", PrimaryButton.args),
        },
    },
};

PrimaryButton.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole("button");

    await step("Test click interaction", async () => {
        await userEvent.click(button);
        await expect(button).toBeInTheDocument();
    });

    await step("Test keyboard navigation", async () => {
        button.focus();
        await expect(button).toHaveFocus();
        await userEvent.keyboard("{Tab}");
        await expect(button).not.toHaveFocus();
    });

    await step("Test keyboard interaction - Space key", async () => {
        button.focus();
        await userEvent.keyboard(" ");
        await expect(button).toHaveFocus();
    });
};

export const DestructiveButton: Story<Input> = Template.bind({});
DestructiveButton.args = {
    renderBody: "Delete",
    variant: "destructive",
    priority: "primary",
} as any;

DestructiveButton.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-button", DestructiveButton.args),
        },
    },
};

DestructiveButton.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole("button");

    await step("Test click interaction", async () => {
        await userEvent.click(button);
        await expect(button).toBeInTheDocument();
    });

    await step("Test keyboard interaction - Space key", async () => {
        button.focus();
        await userEvent.keyboard(" ");
        await expect(button).toHaveFocus();
    });
};

export const SmallButton: Story<Input> = Template.bind({});
SmallButton.args = {
    renderBody: "Small Button",
    size: "small",
} as any;

SmallButton.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-button", SmallButton.args),
        },
    },
};

SmallButton.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole("button");

    await step("Test click interaction", async () => {
        await userEvent.click(button);
        await expect(button).toBeInTheDocument();
    });

    await step("Test keyboard interaction - Space key", async () => {
        button.focus();
        await userEvent.keyboard(" ");
        await expect(button).toHaveFocus();
    });
};

export const LargeButton: Story<Input> = Template.bind({});
LargeButton.args = {
    renderBody: "Large Button",
    size: "large",
} as any;

LargeButton.parameters = {
    docs: {
        source: {
            code: tagToString("ebay-button", LargeButton.args),
        },
    },
};

LargeButton.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole("button");

    await step("Test click interaction", async () => {
        await userEvent.click(button);
        await expect(button).toBeInTheDocument();
    });

    await step("Test keyboard interaction - Space key", async () => {
        button.focus();
        await userEvent.keyboard(" ");
        await expect(button).toHaveFocus();
    });
};

export const ExpandButton = buildExtensionTemplate(
    ExpandButtonTemplate,
    ExpandButtonTemplateCode,
);
