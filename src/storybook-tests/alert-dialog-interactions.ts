import { expect, within, userEvent, waitFor } from "storybook/test";

export const playDefault = (additionalTests) => async ({ canvasElement, step }: { canvasElement: HTMLElement; step: (name: string, fn: () => Promise<void>) => Promise<void>; }) => {

    const canvas = within(canvasElement);

    await step("Open the alert dialog", async () => {
        await userEvent.click(canvas.getByRole("button", { name: "Open Alert Dialog" }));
    });
    
    await step("Verify dialog is visible and confirm button has focus", async () => {
        await waitFor(() => {
            const dialog = canvas.getByRole("alertdialog");
            expect(dialog).toBeInTheDocument();
        });
        await waitFor(() => {
            const confirmButton = canvas.getByRole("button", { name: "OK" });
            expect(confirmButton).toHaveFocus();
        });
    });
// unsure if this is actually clicking the mask, test with other dialog components
    await step("Click mask does not close the dialog", async () => { 
        const dialog = canvas.getByRole("alertdialog");
        const parent = canvas.parentElement;
        await userEvent.pointer({ target: parent, coords: { x: 1, y: 1 } });
        await expect(dialog).toBeInTheDocument();
        await expect(dialog).not.toHaveAttribute("hidden");
    });

    await step("Enter key on confirm button closes dialog", async () => {
        const confirmButton = canvas.getByRole("button", { name: "OK" });
        confirmButton.focus();
        await userEvent.keyboard("{Enter}");
        await waitFor(() => {
            const dialog = canvas.queryByRole("alertdialog", { hidden: true });
            expect(dialog).toHaveAttribute("hidden");
        });
    });

    await step("Focus is returned to the button that opened the dialog", async () => {
        await waitFor(() => {
            const button = canvas.getByRole("button", { name: "Open Alert Dialog" });
            expect(button).toHaveFocus();
        });
    });

    if (additionalTests) {
        await additionalTests({ canvasElement, step });
    }
};