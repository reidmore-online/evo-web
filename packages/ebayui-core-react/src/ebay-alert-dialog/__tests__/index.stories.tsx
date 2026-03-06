import React, { useState } from "react";
import { StoryFn, Meta } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import { action } from "storybook/actions";
import { EbayAlertDialog } from "../index";
import { EbayDialogHeader } from "../../ebay-dialog-base";
import { EbayButton } from "../../ebay-button";

const story = {
    component: EbayAlertDialog,
    title: "dialogs/ebay-alert-dialog",
} satisfies Meta<typeof EbayAlertDialog>;

const textParagraph = (
    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
    </p>
);

export const Default: StoryFn<typeof EbayAlertDialog> = () => {
    const [open, setOpen] = useState(true);
    const close = () => setOpen(false);
    return (
        <div>
            <button className="btn btn--secondary" onClick={() => setOpen(!open)}>
                Open Dialog
            </button>
            <p>Some outside content...</p>
            <EbayAlertDialog
                open={open}
                onOpen={() => action("onOpen")()}
                onConfirm={() => {
                    action("onConfirm")();
                    close();
                }}
                confirmText="Confirm"
                a11yCloseText="Close"
            >
                <EbayDialogHeader>Heading</EbayDialogHeader>
                {textParagraph}
                <p>
                    <a href="http://www.ebay.com">www.ebay.com</a>
                </p>
            </EbayAlertDialog>
        </div>
    );
};

Default.play = async ({
    canvasElement,
    step,
}: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
}) => {
    const canvas = within(canvasElement);

    await step("Verify dialog is visible and confirm button has focus", async () => {
        const dialog = canvas.getByRole("alertdialog");
        await expect(dialog).toBeInTheDocument();
        const confirmButton = canvas.getByRole("button", { name: "Confirm" });
        await expect(confirmButton).toHaveFocus();
    });

    await step("Click mask does not close the dialog", async () => {
        const dialog = canvas.getByRole("alertdialog");
        await userEvent.click(dialog);
        await expect(dialog).toBeInTheDocument();
    });

    await step("Enter key on confirm button closes dialog", async () => {
        const confirmButton = canvas.getByRole("button", { name: "Confirm" });
        confirmButton.focus();
        await userEvent.keyboard("{Enter}");
        await expect(confirmButton).not.toBeInTheDocument();
    });

    await step("Re-open dialog and Space key on confirm closes dialog", async () => {
        await userEvent.click(canvas.getByRole("button", { name: "Open Dialog" }));
        const confirmButton = await canvas.findByRole("button", { name: "Confirm" });
        await expect(confirmButton).toHaveFocus();
        await userEvent.keyboard(" ");
        expect(canvas.queryByRole("alertdialog")).toBeNull();
    });

    await step("Focus is returned to the button that opened the dialog", async () => {
        const button = canvas.getByRole("button", { name: "Open Dialog" });
        await expect(button).toHaveFocus();
    });
};

export const WithAnimation: StoryFn<typeof EbayAlertDialog> = () => {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
        <div>
            <button className="btn btn--secondary" onClick={() => setOpen(!open)}>
                Open Dialog
            </button>
            <p>Some outside content...</p>
            <EbayAlertDialog open={open} onConfirm={close} confirmText="Confirm" animated a11yCloseText="Close">
                <EbayDialogHeader>Heading</EbayDialogHeader>
                {textParagraph}
                <p>
                    <a href="http://www.ebay.com">www.ebay.com</a>
                </p>
            </EbayAlertDialog>
        </div>
    );
};

export const WithCustomConfirmButton: StoryFn<typeof EbayAlertDialog> = () => {
    const [open, setOpen] = useState(true);
    const close = () => setOpen(false);
    return (
        <div>
            <button className="btn btn--secondary" onClick={() => setOpen(!open)}>
                Open Dialog
            </button>
            <p>Some outside content...</p>
            <EbayAlertDialog
                open={open}
                confirm={
                    <EbayButton
                        variant="destructive"
                        onClick={() => {
                            action("onConfirm")();
                            close();
                        }}
                    >
                        Custom Confirm
                    </EbayButton>
                }
                a11yCloseText="Close"
            >
                <EbayDialogHeader>Heading</EbayDialogHeader>
                {textParagraph}
                <p>
                    <a href="http://www.ebay.com">www.ebay.com</a>
                </p>
            </EbayAlertDialog>
        </div>
    );
};

export default story;
