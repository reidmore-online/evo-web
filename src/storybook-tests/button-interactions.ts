import { expect, within, userEvent } from "@storybook/test";

export const playDefault = (additionalTests) => async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);
    
    const button = canvas.getByRole("button");

    await step("Check initial button rendering", async () => {
        await expect(button).toBeInTheDocument();
        await expect(button).not.toBeDisabled();
    });
    
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

    if (additionalTests) {
        await additionalTests({ canvasElement, step });
    }
};
