import {expect, within, userEvent, waitFor } from "storybook/test";

export const playDefault = (additionalTests) => async ({ canvasElement, step}: {canvasElement: HTMLElement, step: (name: string, fn: () => Promise<void>) => Promise<void>}) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    const user = userEvent.setup();

    await step("Test keyboard open - Enter key", async () => {
        button.focus();
        await user.keyboard("{Enter}");
        expect(button).toHaveAttribute("aria-expanded", "true");
        await waitFor(() => {
            const firstItem = canvas.getAllByRole("menuitem")[0];
            expect(firstItem).toHaveFocus();
        });
    });

    await step("Test Arrow Down navigation", async () => {
        await user.keyboard("{ArrowDown}");
        const secondItem = canvas.getAllByRole("menuitem", { hidden: true })[1];
        expect(secondItem).toHaveFocus();
    });

    await step("Test focus return on Escape", async () => {
        await user.keyboard("{Escape}");
        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(button).toHaveFocus();
    });

    await step("Test Tab moves focus away", async () => {
        await user.click(button);
        await user.keyboard("{Tab}");
        expect(button).toHaveAttribute("aria-expanded", "false");
    });
};