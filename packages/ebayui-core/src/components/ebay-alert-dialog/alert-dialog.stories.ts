import { Story } from "@storybook/marko";
import { expect, userEvent, within } from "@storybook/test";
import { addRenderBodies } from "../../common/storybook/utils";
import Readme from "./README.md";
import Component from "./examples/default.marko";
import type { Input } from "./index.marko";
import code from "./examples/default.marko?raw";

const Template: Story<Input> = (args: Input) => ({
    input: addRenderBodies(args),
});

export default {
    title: "dialogs/ebay-alert-dialog",
    component: Component,
    parameters: {
        docs: {
            description: {
                component: Readme,
            },
        },
    },

    argTypes: {
        open: {
            type: "boolean",
            control: { type: "boolean" },
            description: "Whether dialog is open.",
            table: {
                disable: true,
            },
        },
        closeFocus: {
            control: { type: "text" },
            description:
                "An id for an element which will receive focus when the dialog closes. Defaults to the last clicked element before the dialog is opened",
        },
        confirm: {
            name: "@confirm",
            table: {
                category: "@attribute tags",
            },
            description: "Render body will be text for OK button",
        },
        header: {
            name: "@header",
            table: {
                category: "@attribute tags",
            },
        },
        confirmText: {
            control: { type: "text" },
            description: "Text for confirm button",
        },
        onOpen: {
            action: "on-open",
            description: "Triggered on dialog open",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "",
                },
            },
        },
        onConfirm: {
            action: "on-confirm",
            description: "Triggered on dialog confirm button click",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "",
                },
            },
        },
        onClose: {
            action: "on-close",
            description: "Triggered when dialog is closed",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "",
                },
            },
        },
    },
};

export const Default = Template.bind({});
Default.args = {
    header: {
        renderBody: `Alert!`,
    },
    confirm: {
        renderBody: `OK`,
    },
    renderBody: `You must acknowledge this alert to continue.`,
} as any;
Default.parameters = {
    docs: {
        source: {
            code,
        },
    },
};

Default.play = async ({
    canvasElement,
    step,
}: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
}) => {
    const canvas = within(canvasElement);

    await step("Open the alert dialog", async () => {
        await userEvent.click(canvas.getByRole("button", { name: "Open Alert Dialog" }));
    });

    await step("Verify dialog is visible and confirm button has focus", async () => {
        const dialog = canvas.getByRole("alertdialog");
        await expect(dialog).toBeInTheDocument();
        const confirmButton = canvas.getByRole("button", { name: "OK" });
        await expect(confirmButton).toHaveFocus();
    });

    await step("Click mask does not close the dialog", async () => {
        const dialog = canvas.getByRole("alertdialog");
        await userEvent.click(dialog);
        await expect(dialog).toBeInTheDocument();
        await expect(dialog).not.toHaveAttribute("hidden");
    });

    await step("Enter key on confirm button closes dialog", async () => {
        const confirmButton = canvas.getByRole("button", { name: "OK" });
        confirmButton.focus();
        await userEvent.keyboard("{Enter}");
        const dialog = canvas.queryByRole("alertdialog", { hidden: true });
        expect(dialog).toHaveAttribute("hidden");
    });

    await step("Focus is returned to the button that opened the dialog", async () => {
        const button = canvas.getByRole("button", { name: "Open Alert Dialog" });
        await expect(button).toHaveFocus();
    });
};
