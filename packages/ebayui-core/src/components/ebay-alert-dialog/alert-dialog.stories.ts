import { Story } from "@storybook/marko";
import { addRenderBodies } from "../../common/storybook/utils";
import Readme from "./README.md";
import Component from "./examples/default.marko";
import type { Input } from "./index.marko";
import code from "./examples/default.marko?raw";
import { expect, within, userEvent, waitFor } from "@storybook/test";

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

Default.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    await step("Open the alert dialog", async () => {
        const openButton = canvas.getByRole("button", { name: /Open Alert Dialog/i });
        await userEvent.click(openButton);
        
        // Wait for dialog to open
        await waitFor(async () => {
            const dialog = canvas.getByRole("alertdialog");
            await expect(dialog).toBeVisible();
        });
    });

    await step("Verify initial focus on confirm button", async () => {
        const confirmButton = canvas.getByRole("button", { name: /OK/i });
        await waitFor(() => expect(confirmButton).toHaveFocus());
    });

    await step("Verify ARIA attributes", async () => {
        const dialog = canvas.getByRole("alertdialog");
        
        // Check role
        await expect(dialog).toHaveAttribute("role", "alertdialog");
        
        // Check aria-modal
        await expect(dialog).toHaveAttribute("aria-modal");
        
        // Check aria-labelledby points to header
        const ariaLabelledBy = dialog.getAttribute("aria-labelledby");
        expect(ariaLabelledBy).toBeTruthy();
        const headerElement = canvasElement.querySelector(`#${ariaLabelledBy}`);
        expect(headerElement).toBeTruthy();
        expect(headerElement?.textContent).toContain("Alert!");
    });

    await step("Verify confirm button has aria-describedby", async () => {
        const confirmButton = canvas.getByRole("button", { name: /OK/i });
        const describedBy = confirmButton.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        const contentElement = canvasElement.querySelector(`#${describedBy}`);
        expect(contentElement).toBeTruthy();
    });

    await step("Test Escape key does not close dialog", async () => {
        await userEvent.keyboard("{Escape}");
        
        // Dialog should still be visible
        const dialog = canvas.getByRole("alertdialog");
        await expect(dialog).toBeVisible();
    });

    await step("Test clicking outside dialog does not close it", async () => {
        const dialog = canvas.getByRole("alertdialog");
        
        // Try clicking the dialog backdrop (outside the content area)
        await userEvent.click(dialog);
        
        // Dialog should still be visible
        await expect(dialog).toBeVisible();
    });

    await step("Test keyboard activation with Space key", async () => {
        const confirmButton = canvas.getByRole("button", { name: /OK/i });
        confirmButton.focus();
        
        await userEvent.keyboard(" ");
        
        // Dialog should close
        await waitFor(() => {
            const dialogs = canvas.queryAllByRole("alertdialog", { hidden: true });
            expect(dialogs.length).toBe(0);
        });
    });
};

export const CustomConfirmText = Template.bind({});
CustomConfirmText.args = {
    header: {
        renderBody: `Important Notice`,
    },
    confirm: {
        renderBody: `I Understand`,
    },
    renderBody: `Please read this important information carefully.`,
} as any;
CustomConfirmText.parameters = {
    docs: {
        source: {
            code,
        },
    },
};

CustomConfirmText.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    await step("Open dialog with custom confirm text", async () => {
        const openButton = canvas.getByRole("button", { name: /Open Alert Dialog/i });
        await userEvent.click(openButton);
        
        await waitFor(async () => {
            const dialog = canvas.getByRole("alertdialog");
            await expect(dialog).toBeVisible();
        });
    });

    await step("Verify custom confirm button text", async () => {
        const confirmButton = canvas.getByRole("button", { name: /I Understand/i });
        await expect(confirmButton).toBeVisible();
        expect(confirmButton.textContent).toContain("I Understand");
    });

    await step("Test Enter key activation", async () => {
        const confirmButton = canvas.getByRole("button", { name: /I Understand/i });
        confirmButton.focus();
        
        await userEvent.keyboard("{Enter}");
        
        // Dialog should close
        await waitFor(() => {
            const dialogs = canvas.queryAllByRole("alertdialog", { hidden: true });
            expect(dialogs.length).toBe(0);
        }, { timeout: 2000 });
    });
};

export const FocusTrap = Template.bind({});
FocusTrap.args = {
    header: {
        renderBody: `Focus Management Test`,
    },
    confirm: {
        renderBody: `Acknowledge`,
    },
    renderBody: `This dialog tests focus trapping behavior.`,
} as any;
FocusTrap.parameters = {
    docs: {
        source: {
            code,
        },
    },
};

FocusTrap.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    await step("Open dialog and verify focus trap", async () => {
        const openButton = canvas.getByRole("button", { name: /Open Alert Dialog/i });
        await userEvent.click(openButton);
        
        await waitFor(async () => {
            const dialog = canvas.getByRole("alertdialog");
            await expect(dialog).toBeVisible();
        });
    });

    await step("Verify focus remains trapped in dialog", async () => {
        const confirmButton = canvas.getByRole("button", { name: /Acknowledge/i });
        const dialog = canvas.getByRole("alertdialog");
        
        // Confirm button should have initial focus
        await waitFor(() => expect(confirmButton).toHaveFocus());
        
        // Try to tab - focus should remain within dialog
        await userEvent.keyboard("{Tab}");
        
        // Active element should still be within the dialog
        await waitFor(() => {
            expect(dialog.contains(document.activeElement)).toBe(true);
        });
    });

    await step("Close dialog and verify", async () => {
        const confirmButton = canvas.getByRole("button", { name: /Acknowledge/i });
        await userEvent.click(confirmButton);
        
        await waitFor(() => {
            const dialogs = canvas.queryAllByRole("alertdialog", { hidden: true });
            expect(dialogs.length).toBe(0);
        }, { timeout: 2000 });
    });
};
