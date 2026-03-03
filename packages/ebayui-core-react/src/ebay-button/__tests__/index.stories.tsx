import React from "react";
import { StoryFn, Meta } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { expect, within, userEvent } from "@storybook/test";
import { EbayButton, EbayButtonCell } from "../index";
import { EbayIconMenu20 } from "../../ebay-icon/icons/ebay-icon-menu-20";
import { EbayIconSettings16 } from "../../ebay-icon/icons/ebay-icon-settings-16";
import { EbayIconDelete16 } from "../../ebay-icon/icons/ebay-icon-delete-16";
import { EbayIconChevronDown12 } from "../../ebay-icon/icons/ebay-icon-chevron-down-12";
import { playDefault } from "../../../../../src/storybook-tests/button-interactions.ts";

const meta: Meta<typeof EbayButton> = {
    component: EbayButton,
    title: "buttons/ebay-button",
};

export default meta;

export const Default: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton
                onClick={action("clicked")}
                onEscape={action("escape pressed")}
                onBlur={action("blur")}
                onFocus={(e) => action("focus")(e)}
                onKeyDown={action("key down")}
            >
                Hello, I am a button!
            </EbayButton>
        </p>
        <p>
            <EbayButton href="https://ebay.com">Hello, I am a link!</EbayButton>
        </p>
    </>
);

Default.play = playDefault(async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify link button rendering", async () => {
        const link = canvas.getByRole("link");
        await expect(link).toBeInTheDocument();
        await expect(link).toHaveAttribute("href", "https://ebay.com");
    });

    await step("Test link is keyboard focusable", async () => {
        const link = canvas.getByRole("link");
        link.focus();
        await expect(link).toHaveFocus();
    });
});

export const Size: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton size="large">Large Button</EbayButton>
        </p>
        <p>
            <EbayButton href="https://ebay.com" size="large">
                Large Link
            </EbayButton>
        </p>
        <p>
            <EbayButton>Default Size Button</EbayButton>
        </p>
        <p>
            <EbayButton href="https://ebay.com">Default Size Link</EbayButton>
        </p>
    </>
);

export const Priority: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton priority="primary">Primary Button</EbayButton>
        </p>
        <p>
            <EbayButton priority="primary" href="https://ebay.com">
                Primary Link
            </EbayButton>
        </p>
        <p>
            <EbayButton priority="secondary">Secondary Button</EbayButton>
        </p>
        <p>
            <EbayButton priority="secondary" href="https://ebay.com">
                Secondary Link
            </EbayButton>
        </p>
        <p>
            <EbayButton>Secondary Button (Default)</EbayButton>
        </p>
        <p>
            <EbayButton href="https://ebay.com">Secondary Link (Default)</EbayButton>
        </p>
        <p>
            <EbayButton priority="tertiary">Tertiary Button</EbayButton>
        </p>
        <p>
            <EbayButton priority="tertiary" href="https://ebay.com">
                Tertiary Link
            </EbayButton>
        </p>
        <p>
            <EbayButton priority="none">Base Button</EbayButton>
        </p>
    </>
);

export const DestructiveVariant: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton priority="primary" variant="destructive">
                Primary Button
            </EbayButton>
        </p>
        <p>
            <EbayButton priority="primary" variant="destructive" href="https://ebay.com">
                Primary Link
            </EbayButton>
        </p>
        <p>
            <EbayButton priority="secondary" variant="destructive">
                Secondary Button
            </EbayButton>
        </p>
        <p>
            <EbayButton priority="secondary" variant="destructive" href="https://ebay.com">
                Secondary Link
            </EbayButton>
        </p>
        <p>
            <EbayButton priority="tertiary" variant="destructive">
                Tertiary Button
            </EbayButton>
        </p>
        <p>
            <EbayButton priority="tertiary" variant="destructive" href="https://ebay.com">
                Tertiary Link
            </EbayButton>
        </p>
    </>
);

export const Fluid: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton priority="primary" fluid>
                Primary Button
            </EbayButton>
        </p>
        <p>
            <EbayButton fluid>Secondary Button</EbayButton>
        </p>
        <p>
            <EbayButton fluid href="https://www.ebay.com">
                Link
            </EbayButton>
        </p>
    </>
);

export const WithIcon: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            Form button:
            <br />
            <EbayButton aria-label="Menu button">
                <EbayIconMenu20 />
                <span>Button with icon</span>
            </EbayButton>
        </p>
        <p>
            Form fake-button (link):
            <br />
            <EbayButton href="#" variant="form" aria-label="Settings link">
                <EbayIconSettings16 />
                <span>Button with icon</span>
            </EbayButton>
        </p>
        <p>
            Delete button:
            <br />
            <EbayButton variant="destructive" aria-label="Destructive button">
                <EbayIconDelete16 />
                <span>Button with icon</span>
            </EbayButton>
        </p>
        <p>
            Expand button:
            <br />
            <EbayButton bodyState="expand" aria-label="Destructive button">
                <EbayIconSettings16 />
                <span>Expand button</span>
            </EbayButton>
        </p>
    </>
);

export const IconOnly: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            Form button:
            <br />
            <EbayButton variant="form" aria-label="Menu button">
                <EbayIconMenu20 />
            </EbayButton>
        </p>
        <p>
            Form fake-button (link):
            <br />
            <EbayButton href="#" variant="form" aria-label="Settings link">
                <EbayIconSettings16 />
            </EbayButton>
        </p>
        <p>
            Delete button:
            <br />
            <EbayButton variant="destructive" aria-label="Destructive button">
                <EbayIconDelete16 />
            </EbayButton>
        </p>
    </>
);

IconOnly.play = async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify icon-only buttons have accessible labels", async () => {
        const menuButton = canvas.getByLabelText("Menu button");
        const deleteButton = canvas.getByLabelText("Destructive button");
        await expect(menuButton).toBeInTheDocument();
        await expect(deleteButton).toBeInTheDocument();
    });

    await step("Test icon-only button is keyboard accessible", async () => {
        const menuButton = canvas.getByLabelText("Menu button");
        menuButton.focus();
        await expect(menuButton).toHaveFocus();
    });

    await step("Test icon-only button click interaction", async () => {
        const menuButton = canvas.getByLabelText("Menu button");
        await userEvent.click(menuButton);
        await expect(menuButton).toBeInTheDocument();
    });

    await step("Verify icon-only link has accessible label", async () => {
        const settingsLink = canvas.getByLabelText("Settings link");
        await expect(settingsLink).toBeInTheDocument();
        await expect(settingsLink).toHaveAttribute("href", "#");
    });
};

export const Transparent: StoryFn<typeof EbayButton> = () => (
    <div style={{ background: "rgba(66, 214, 205, 0.5)" }}>
        <p>
            <EbayButton>Default Button</EbayButton>
        </p>
        <p>
            <EbayButton transparent>Transparent Button</EbayButton>
        </p>
        <p>
            <EbayButton transparent priority="secondary" variant="destructive">
                Transparent Destructive Button
            </EbayButton>
        </p>
        <p>
            <EbayButton href="https://ebay.com" transparent>
                Transparent Link
            </EbayButton>
        </p>
    </div>
);

export const Disabled: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton priority="primary" disabled>
                Primary Button
            </EbayButton>
        </p>
        <p>
            <EbayButton disabled>Secondary Button</EbayButton>
        </p>
        <p>
            <EbayButton href="https://ebay.com" disabled>
                Link
            </EbayButton>
        </p>
    </>
);

Disabled.play = async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify disabled button state", async () => {
        const primaryButton = canvas.getByText("Primary Button");
        const secondaryButton = canvas.getByText("Secondary Button");
        await expect(primaryButton).toBeDisabled();
        await expect(secondaryButton).toBeDisabled();
    });

    await step("Test that click does not work when disabled", async () => {
        const button = canvas.getByText("Primary Button");
        await userEvent.click(button);
        await expect(button).toBeDisabled();
    });

    await step("Test keyboard interaction does not work when disabled", async () => {
        const button = canvas.getByText("Secondary Button");
        button.focus();
        await userEvent.keyboard(" ");
        await expect(button).not.toHaveFocus();
    });

    await step("Verify disabled link does not have href", async () => {
        const link = canvas.getByText("Link");
        await expect(link).not.toHaveAttribute("href");
    });
};

export const PartiallyDisabledButton: StoryFn<typeof EbayButton> = () => (
    <EbayButton priority="primary" partiallyDisabled>
        Hello, I am a button!
    </EbayButton>
);

PartiallyDisabledButton.play = playDefault(async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await step("Verify partially disabled state", async () => {
        await expect(button).not.toBeDisabled();
        await expect(button).toHaveAttribute("aria-disabled", "true");
    });
});

export const Truncated: StoryFn<typeof EbayButton> = () => (
    <div>
        <p>
            <EbayButton truncate style={{ maxWidth: "200px" }}>
                Hello, I am a button! this is a long text
            </EbayButton>
        </p>
        <p>
            <EbayButton size="large" truncate style={{ maxWidth: "200px" }}>
                Hello, I am a BIG button! this is a long text
            </EbayButton>
        </p>
        <p>
            <EbayButton href="https://ebay.com" truncate style={{ maxWidth: "200px" }}>
                Hello, I am a link! this is a long text
            </EbayButton>
        </p>
    </div>
);

export const FlexButton: StoryFn<typeof EbayButton> = () => (
    <EbayButton priority="primary" fluid>
        <EbayButtonCell style={{ justifyContent: "space-between" }}>
            <span>Select</span>
            <span style={{ display: "inline-flex" }}>
                <span>Any</span>
                <EbayIconChevronDown12 />
            </span>
        </EbayButtonCell>
    </EbayButton>
);

export const LoadingButton: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton bodyState="loading" />
        </p>
        <p>
            <EbayButton priority="primary" bodyState="loading" />
        </p>
        <p>
            <EbayButton priority="tertiary" bodyState="loading" />
        </p>
        <p>
            <EbayButton variant="form" bodyState="loading" />
        </p>
        <p>
            <EbayButton variant="destructive" bodyState="loading" />
        </p>
    </>
);

LoadingButton.play = async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify loading state with aria-live attribute", async () => {
        const buttons = canvas.getAllByRole("button");
        buttons.forEach((button) => {
            expect(button).toHaveAttribute("aria-live", "polite");
        });
    });

    await step("Verify progress spinner is present", async () => {
        const buttons = canvas.getAllByRole("button");
        const firstButton = buttons[0];
        const spinner = firstButton.querySelector(".progress-spinner");
        await expect(spinner).toBeInTheDocument();
    });

    await step("Test button is still interactive in loading state", async () => {
        const buttons = canvas.getAllByRole("button");
        const firstButton = buttons[0];
        firstButton.focus();
        await expect(firstButton).toHaveFocus();
    });
};

export const ExpandButton: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton priority="primary" bodyState="expand">
                Primary expand button
            </EbayButton>{" "}
            <EbayButton priority="primary" bodyState="expand" aria-expanded="true">
                Expanded button
            </EbayButton>
        </p>
        <p>
            <EbayButton bodyState="expand">Expand button</EbayButton>
        </p>
        <p>
            <EbayButton priority="tertiary" bodyState="expand">
                Tertiary expand button
            </EbayButton>
        </p>
        <p>
            <EbayButton variant="form" bodyState="expand">
                Form expand button
            </EbayButton>{" "}
            <EbayButton variant="form" bodyState="expand" />{" "}
            <EbayButton variant="form" bodyState="expand" aria-expanded />
        </p>
        <p>
            <EbayButton priority="primary" bodyState="expand" borderless>
                Borderless expand button
            </EbayButton>
        </p>
    </>
);

export const SplitButton: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton priority="primary" split="start">
                Primary split start button
            </EbayButton>
            <EbayButton priority="primary" split="end">
                Primary split end button
            </EbayButton>
        </p>
        <p>
            <EbayButton split="start">Split start button</EbayButton>
            <EbayButton split="end">Split end button</EbayButton>
        </p>
        <p>
            <EbayButton priority="tertiary" split="start">
                Tertiary split start button
            </EbayButton>
            <EbayButton priority="tertiary" split="end">
                Tertiary split end button
            </EbayButton>
        </p>
        <p>
            <EbayButton priority="primary" split="start">
                Primary Split button
            </EbayButton>
            <EbayButton priority="primary" bodyState="expand" split="end" />
        </p>
        <p>
            <EbayButton split="start">Split button</EbayButton>
            <EbayButton bodyState="expand" split="end" />
        </p>
        <p>
            <EbayButton priority="tertiary" split="start">
                Tertiary split button
            </EbayButton>
            <EbayButton priority="tertiary" bodyState="expand" split="end" />
        </p>
    </>
);

export const FormButton: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton variant="form">Form button</EbayButton>
        </p>
    </>
);

export const BorderlessButton: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton borderless>Borderless button</EbayButton>
        </p>
    </>
);

export const FixedHeight: StoryFn<typeof EbayButton> = () => (
    <>
        <p>
            <EbayButton fixedHeight>Fixed height button</EbayButton>
        </p>
        <p>
            <EbayButton fixedHeight size="large">
                Fixed height large button
            </EbayButton>
        </p>
    </>
);
