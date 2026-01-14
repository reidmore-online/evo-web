import { buildExtensionTemplate } from "../../common/storybook/utils";
import Component from "./index.marko";
import Readme from "./README.md";
import DefaultTemplate from "./examples/default.marko";
import DefaultTemplateCode from "./examples/default.marko?raw";
import AnchorTemplate from "./examples/anchor.marko";
import AnchorTemplateCode from "./examples/anchor.marko?raw";
import ButtonTemplate from "./examples/button.marko";
import ButtonTemplateCode from "./examples/button.marko?raw";
import MinimumTemplate from "./examples/minimum.marko";
import MinimumTemplateCode from "./examples/minimum.marko?raw";
import { Story } from "@storybook/marko";
import type { Input } from "./index.marko";
import { expect, within, userEvent, waitFor } from "@storybook/test";

export default {
    title: "layout/ebay-card",
    component: Component,
    parameters: {
        docs: {
            description: {
                component: Readme,
            },
        },
    },

    argTypes: {
        renderBody: {
            control: { type: "text" },
        },
        layout: {
            control: { type: "select" },
            options: ["horizontal", "vertical"],
            description:
                "The layout of the card. The default is vertical. The horizontal option takes up more horizontal space and is better for displaying more information.",
        },
        href: {
            control: { type: "text" },
            description:
                "The URL to navigate to when the card is clicked. This can only be used in conjunction without a action element",
        },
        aspectRatio: {
            control: { type: "select" },
            options: ["16:9", "5:4", "default"],
            description: "The aspect ratio applied to the image.",
        },
        disabled: {
            control: { type: "boolean" },
            description: "True if the card is not clickable",
        },
        image: {
            name: "@image",
            table: {
                category: "@attribute tags",
            },
            description:
                "The top image tag. Will be passed as attributes to the <img> tag.",
        },
        title: {
            name: "@title",
            description: "The title element of the card",
            table: {
                category: "@attribute tags",
            },
        },
        action: {
            name: "@action",
            description: "The action element of the card",
            table: {
                category: "@attribute tags",
            },
        },
        overline: {
            name: "@overline",
            description:
                "The overline element of the card. This is generally used for signals rendered above the title.",
            table: {
                category: "@attribute tags",
            },
        },
        description: {
            name: "@description",
            description:
                'The description element of the card. This is to render a description below the title in tertiary element. Defaults to <p> tag (use "as" attribute to change).',
            table: {
                category: "@attribute tags",
            },
        },
        onClick: {
            action: "on-click",
            description: "Triggered when card is clicked",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "",
                },
            },
        },
    },
};

export const Default: Story<Input> = Object.assign(
    buildExtensionTemplate(DefaultTemplate, DefaultTemplateCode),
    {
        play: async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
            const canvas = within(canvasElement);

            await step("Verify internally-actionable card structure", async () => {
                const card = canvasElement.querySelector(".card");
                await expect(card).toBeTruthy();
                await expect(card?.tagName).toBe("SPAN");
                
                // Card container should not be focusable
                await expect((card as HTMLElement).tabIndex).toBe(-1);
            });

            await step("Verify card content elements", async () => {
                const image = canvasElement.querySelector(".card__media img") as HTMLImageElement;
                await expect(image).toBeTruthy();
                await expect(image.alt).toBe("Card");

                const title = canvasElement.querySelector(".card__title");
                await expect(title).toBeTruthy();
                await expect(title?.textContent).toContain("Authentic Rookie Cards");

                const description = canvasElement.querySelector(".card__description");
                await expect(description).toBeTruthy();

                const overline = canvasElement.querySelector(".card__overline");
                await expect(overline).toBeTruthy();
                await expect(overline?.textContent).toContain("Authenticity Guaranteed");
            });

            await step("Test action button interaction", async () => {
                const actionButton = canvasElement.querySelector(".card__action button") as HTMLButtonElement;
                await expect(actionButton).toBeTruthy();
                
                // Button should be focusable
                await expect(actionButton.tabIndex).toBe(0);
                
                // Click the action button
                await userEvent.click(actionButton);
            });

            await step("Test action button keyboard interaction", async () => {
                const actionButton = canvasElement.querySelector(".card__action button") as HTMLButtonElement;
                actionButton.focus();
                await expect(actionButton).toHaveFocus();
                
                await userEvent.keyboard("{Enter}");
            });
        },
    }
);

export const Anchor: Story<Input> = Object.assign(
    buildExtensionTemplate(AnchorTemplate, AnchorTemplateCode),
    {
        play: async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
            const canvas = within(canvasElement);

            await step("Verify self-actionable anchor card structure", async () => {
                const card = canvasElement.querySelector(".card") as HTMLAnchorElement;
                await expect(card).toBeTruthy();
                await expect(card.tagName).toBe("A");
                await expect(card.href).toBe("https://www.ebay.com/");
                await expect(card.tabIndex).toBe(0);
            });

            await step("Verify card is keyboard accessible", async () => {
                const card = canvasElement.querySelector(".card") as HTMLAnchorElement;
                card.focus();
                await expect(card).toHaveFocus();
            });

            await step("Test anchor card click interaction", async () => {
                const card = canvasElement.querySelector(".card") as HTMLAnchorElement;
                await userEvent.click(card);
            });

            await step("Test keyboard navigation - Enter key", async () => {
                const card = canvasElement.querySelector(".card") as HTMLAnchorElement;
                card.focus();
                await userEvent.keyboard("{Enter}");
            });

            await step("Test focus management - Tab navigation", async () => {
                const card = canvasElement.querySelector(".card") as HTMLAnchorElement;
                card.focus();
                await expect(card).toHaveFocus();
                
                await userEvent.keyboard("{Tab}");
                await expect(card).not.toHaveFocus();
            });
        },
    }
);

export const Button: Story<Input> = Object.assign(
    buildExtensionTemplate(ButtonTemplate, ButtonTemplateCode),
    {
        play: async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
            const canvas = within(canvasElement);

            await step("Verify self-actionable button card structure", async () => {
                const card = canvasElement.querySelector(".card") as HTMLButtonElement;
                await expect(card).toBeTruthy();
                await expect(card.tagName).toBe("BUTTON");
                await expect(card.type).toBe("button");
                await expect(card.disabled).toBe(false);
                await expect(card.tabIndex).toBe(0);
            });

            await step("Test button card click interaction", async () => {
                const card = canvasElement.querySelector(".card") as HTMLButtonElement;
                await userEvent.click(card);
            });

            await step("Test keyboard interaction - Enter key", async () => {
                const card = canvasElement.querySelector(".card") as HTMLButtonElement;
                card.focus();
                await expect(card).toHaveFocus();
                
                await userEvent.keyboard("{Enter}");
            });

            await step("Test keyboard interaction - Space key", async () => {
                const card = canvasElement.querySelector(".card") as HTMLButtonElement;
                card.focus();
                await userEvent.keyboard(" ");
            });

            await step("Test focus management", async () => {
                const card = canvasElement.querySelector(".card") as HTMLButtonElement;
                card.focus();
                await expect(card).toHaveFocus();
                
                // Tab away to remove focus
                await userEvent.keyboard("{Tab}");
                await expect(card).not.toHaveFocus();
            });
        },
    }
);

export const Minimum: Story<Input> = Object.assign(
    buildExtensionTemplate(MinimumTemplate, MinimumTemplateCode),
    {
        play: async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
            const canvas = within(canvasElement);

            await step("Verify minimum card has required elements", async () => {
                const card = canvasElement.querySelector(".card");
                await expect(card).toBeTruthy();

                const image = canvasElement.querySelector(".card__media img") as HTMLImageElement;
                await expect(image).toBeTruthy();
                await expect(image.alt).toBe("Card");

                const description = canvasElement.querySelector(".card__description");
                await expect(description).toBeTruthy();
            });

            await step("Verify minimum card does not have optional elements", async () => {
                const title = canvasElement.querySelector(".card__title");
                await expect(title).toBeFalsy();

                const overline = canvasElement.querySelector(".card__overline");
                await expect(overline).toBeFalsy();

                const action = canvasElement.querySelector(".card__action");
                await expect(action).toBeFalsy();
            });

            await step("Test minimum card is self-actionable", async () => {
                const card = canvasElement.querySelector(".card") as HTMLButtonElement;
                await expect(card.tagName).toBe("BUTTON");
                await expect(card.tabIndex).toBe(0);
                
                await userEvent.click(card);
            });
        },
    }
);
