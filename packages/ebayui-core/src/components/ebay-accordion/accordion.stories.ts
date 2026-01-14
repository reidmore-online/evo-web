import Accordion from "./index.marko";
import Readme from "./README.md";
import defaultTemplate from "./examples/default.marko";
import defaultTemplateCode from "./examples/default.marko?raw";
import openTemplate from "./examples/opened.marko";
import openTemplateCode from "./examples/opened.marko?raw";
import largeTemplate from "./examples/large.marko";
import largeTemplateCode from "./examples/large.marko?raw";
import autoCollapsedTemplate from "./examples/autoCollapsed.marko";
import autoCollapsedTemplateCode from "./examples/autoCollapsed.marko?raw";
import { expect, within, userEvent, waitFor } from "@storybook/test";
import { Story } from "@storybook/marko";

export default {
    title: "navigation & disclosure/ebay-accordion",
    component: Accordion,
    parameters: {
        docs: {
            description: {
                component: Readme,
            },
        },
    },

    argTypes: {
        size: {
            type: "options",
            description: "Size of the details",
            table: {
                defaultValue: {
                    summary: "regular",
                },
            },
            options: ["regular", "large"],
        },
        autoCollapse: {
            type: "boolean",
            description:
                "Whether accordion panels should be autocollapsed when another is opened",
            table: {
                defaultValue: {
                    summary: "false",
                },
            },
        },
        a11yRoleDescription: {
            type: "string",
            control: { type: "text" },
            description:
                "The localized role description to announce the component role for a11y users.",
            table: {
                defaultValue: {
                    summary: "accordion",
                },
            },
        },
        details: {
            name: "@details",
            description:
                "Represents an <ebay-details/> element to be used as part of the group. Allowed attributes are `open`, `as`, `text` and `renderBody`",
            table: {
                category: "@attribute tags",
            },
        },
        onToggle: {
            action: "on-toggle",
            description:
                "Triggered on toggle of details to control auto-collapse",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ originalEvent, open }",
                },
            },
        },
        onClick: {
            action: "on-click",
            description: "Triggered on click of details",
            table: {
                category: "Events",
                defaultValue: {
                    summary: "{ originalEvent }",
                },
            },
        },
    },
};

export const Default: Story<any> = (args: any) => ({
    input: args,
    component: defaultTemplate,
});

Default.parameters = {
    docs: {
        source: {
            code: defaultTemplateCode,
        },
    },
};

Default.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    await step("Verify initial collapsed state", async () => {
        const summaries = canvasElement.querySelectorAll(".details__summary");
        summaries.forEach((summary) => {
            expect(summary).toHaveAttribute("aria-expanded", "false");
        });
    });

    await step("Test click interaction to expand first panel", async () => {
        const firstPanel = canvas.getByText("Item 1");
        await userEvent.click(firstPanel);
        
        await waitFor(() => {
            expect(firstPanel).toHaveAttribute("aria-expanded", "true");
        });
    });

    await step("Test click interaction to collapse expanded panel", async () => {
        const firstPanel = canvas.getByText("Item 1");
        await userEvent.click(firstPanel);
        
        await waitFor(() => {
            expect(firstPanel).toHaveAttribute("aria-expanded", "false");
        });
    });

    await step("Test keyboard interaction - Enter key", async () => {
        const secondPanel = canvas.getByText("Item 2");
        secondPanel.focus();
        await userEvent.keyboard("{Enter}");
        
        await waitFor(() => {
            expect(secondPanel).toHaveAttribute("aria-expanded", "true");
        });
    });

    await step("Test keyboard interaction - Space key", async () => {
        const thirdPanel = canvas.getByText("Item 3");
        thirdPanel.focus();
        await userEvent.keyboard("{Space}");
        
        await waitFor(() => {
            expect(thirdPanel).toHaveAttribute("aria-expanded", "true");
        });
    });

    await step("Verify multiple panels can be open simultaneously", async () => {
        const secondPanel = canvas.getByText("Item 2");
        const thirdPanel = canvas.getByText("Item 3");
        
        expect(secondPanel).toHaveAttribute("aria-expanded", "true");
        expect(thirdPanel).toHaveAttribute("aria-expanded", "true");
    });

    await step("Test Tab navigation between panels", async () => {
        const firstPanel = canvas.getByText("Item 1");
        firstPanel.focus();
        
        await userEvent.keyboard("{Tab}");
        const secondPanel = canvas.getByText("Item 2");
        expect(secondPanel).toHaveFocus();
        
        await userEvent.keyboard("{Tab}");
        const thirdPanel = canvas.getByText("Item 3");
        expect(thirdPanel).toHaveFocus();
    });

    await step("Verify ARIA attributes", async () => {
        const accordion = canvasElement.querySelector(".accordion");
        expect(accordion).toHaveAttribute("aria-roledescription", "accordion");
        
        const summaries = canvasElement.querySelectorAll(".details__summary");
        summaries.forEach((summary) => {
            expect(summary).toHaveAttribute("aria-controls");
            const controlsId = summary.getAttribute("aria-controls");
            const content = canvasElement.querySelector(`#${controlsId}`);
            expect(content).toBeTruthy();
        });
    });
};

export const Open: Story<any> = (args: any) => ({
    input: args,
    component: openTemplate,
});

Open.parameters = {
    docs: {
        source: {
            code: openTemplateCode,
        },
    },
};

Open.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    await step("Verify first panel is initially open", async () => {
        const firstPanel = canvas.getByText("Item 1");
        expect(firstPanel).toHaveAttribute("aria-expanded", "true");
    });

    await step("Verify other panels are initially closed", async () => {
        const secondPanel = canvas.getByText("Item 2");
        const thirdPanel = canvas.getByText("Item 3");
        
        expect(secondPanel).toHaveAttribute("aria-expanded", "false");
        expect(thirdPanel).toHaveAttribute("aria-expanded", "false");
    });

    await step("Test collapsing open panel with click", async () => {
        const firstPanel = canvas.getByText("Item 1");
        await userEvent.click(firstPanel);
        
        await waitFor(() => {
            expect(firstPanel).toHaveAttribute("aria-expanded", "false");
        });
    });

    await step("Test expanding multiple panels", async () => {
        const firstPanel = canvas.getByText("Item 1");
        const secondPanel = canvas.getByText("Item 2");
        
        await userEvent.click(firstPanel);
        await waitFor(() => {
            expect(firstPanel).toHaveAttribute("aria-expanded", "true");
        });
        
        await userEvent.click(secondPanel);
        await waitFor(() => {
            expect(secondPanel).toHaveAttribute("aria-expanded", "true");
        });
        
        // Both should remain open
        expect(firstPanel).toHaveAttribute("aria-expanded", "true");
        expect(secondPanel).toHaveAttribute("aria-expanded", "true");
    });

    await step("Test keyboard collapse of open panel", async () => {
        const firstPanel = canvas.getByText("Item 1");
        firstPanel.focus();
        await userEvent.keyboard("{Enter}");
        
        await waitFor(() => {
            expect(firstPanel).toHaveAttribute("aria-expanded", "false");
        });
    });
};

export const Large: Story<any> = (args: any) => ({
    input: args,
    component: largeTemplate,
});

Large.parameters = {
    docs: {
        source: {
            code: largeTemplateCode,
        },
    },
};

Large.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    await step("Verify large size class is applied", async () => {
        const accordion = canvasElement.querySelector(".accordion");
        expect(accordion?.classList.contains("accordion--large")).toBe(true);
    });

    await step("Test click interaction on large accordion", async () => {
        const firstPanel = canvas.getByText("Item 1");
        await userEvent.click(firstPanel);
        
        await waitFor(() => {
            expect(firstPanel).toHaveAttribute("aria-expanded", "true");
        });
    });

    await step("Verify accessibility features work with large size", async () => {
        const summaries = canvasElement.querySelectorAll(".details__summary");
        summaries.forEach((summary) => {
            expect(summary.tagName).toBe("BUTTON");
            expect(summary).toHaveAttribute("aria-expanded");
            expect(summary).toHaveAttribute("aria-controls");
        });
    });

    await step("Test keyboard interaction on large accordion", async () => {
        const secondPanel = canvas.getByText("Item 2");
        secondPanel.focus();
        await userEvent.keyboard("{Space}");
        
        await waitFor(() => {
            expect(secondPanel).toHaveAttribute("aria-expanded", "true");
        });
    });

    await step("Test focus management", async () => {
        const secondPanel = canvas.getByText("Item 2");
        await userEvent.click(secondPanel);
        expect(secondPanel).toHaveFocus();
    });
};

export const AutoCollapsed: Story<any> = (args: any) => ({
    input: args,
    component: autoCollapsedTemplate,
});

AutoCollapsed.parameters = {
    docs: {
        source: {
            code: autoCollapsedTemplateCode,
        },
    },
};

AutoCollapsed.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    await step("Verify initial state - all panels closed", async () => {
        const summaries = canvasElement.querySelectorAll(".details__summary");
        summaries.forEach((summary) => {
            expect(summary).toHaveAttribute("aria-expanded", "false");
        });
    });

    await step("Test auto-collapse - open first panel", async () => {
        const firstPanel = canvas.getByText("Item 1");
        await userEvent.click(firstPanel);
        
        await waitFor(() => {
            expect(firstPanel).toHaveAttribute("aria-expanded", "true");
        });
    });

    await step("Test auto-collapse - open second panel closes first", async () => {
        const firstPanel = canvas.getByText("Item 1");
        const secondPanel = canvas.getByText("Item 2");
        
        await userEvent.click(secondPanel);
        
        await waitFor(() => {
            expect(secondPanel).toHaveAttribute("aria-expanded", "true");
            expect(firstPanel).toHaveAttribute("aria-expanded", "false");
        });
    });

    await step("Test auto-collapse - open third panel closes second", async () => {
        const secondPanel = canvas.getByText("Item 2");
        const thirdPanel = canvas.getByText("Item 3");
        
        await userEvent.click(thirdPanel);
        
        await waitFor(() => {
            expect(thirdPanel).toHaveAttribute("aria-expanded", "true");
            expect(secondPanel).toHaveAttribute("aria-expanded", "false");
        });
    });

    await step("Test auto-collapse with keyboard - Enter key", async () => {
        const firstPanel = canvas.getByText("Item 1");
        const thirdPanel = canvas.getByText("Item 3");
        
        firstPanel.focus();
        await userEvent.keyboard("{Enter}");
        
        await waitFor(() => {
            expect(firstPanel).toHaveAttribute("aria-expanded", "true");
            expect(thirdPanel).toHaveAttribute("aria-expanded", "false");
        });
    });

    await step("Test auto-collapse with keyboard - Space key", async () => {
        const firstPanel = canvas.getByText("Item 1");
        const secondPanel = canvas.getByText("Item 2");
        
        await userEvent.keyboard("{Tab}");
        expect(secondPanel).toHaveFocus();
        
        await userEvent.keyboard("{Space}");
        
        await waitFor(() => {
            expect(secondPanel).toHaveAttribute("aria-expanded", "true");
            expect(firstPanel).toHaveAttribute("aria-expanded", "false");
        });
    });

    await step("Test closing open panel doesn't open others", async () => {
        const secondPanel = canvas.getByText("Item 2");
        const firstPanel = canvas.getByText("Item 1");
        const thirdPanel = canvas.getByText("Item 3");
        
        await userEvent.click(secondPanel);
        
        await waitFor(() => {
            expect(secondPanel).toHaveAttribute("aria-expanded", "false");
            expect(firstPanel).toHaveAttribute("aria-expanded", "false");
            expect(thirdPanel).toHaveAttribute("aria-expanded", "false");
        });
    });

    await step("Verify ARIA attributes in auto-collapse mode", async () => {
        const accordion = canvasElement.querySelector(".accordion");
        expect(accordion).toHaveAttribute("aria-roledescription", "accordion");
        
        const summaries = canvasElement.querySelectorAll(".details__summary");
        summaries.forEach((summary) => {
            expect(summary).toHaveAttribute("aria-controls");
            expect(summary).toHaveAttribute("aria-expanded");
        });
    });

    await step("Test Tab navigation maintains auto-collapse behavior", async () => {
        const firstPanel = canvas.getByText("Item 1");
        const secondPanel = canvas.getByText("Item 2");
        const thirdPanel = canvas.getByText("Item 3");
        
        firstPanel.focus();
        await userEvent.keyboard("{Enter}");
        
        await waitFor(() => {
            expect(firstPanel).toHaveAttribute("aria-expanded", "true");
        });
        
        await userEvent.keyboard("{Tab}");
        expect(secondPanel).toHaveFocus();
        
        await userEvent.keyboard("{Tab}");
        expect(thirdPanel).toHaveFocus();
        
        await userEvent.keyboard("{Enter}");
        
        await waitFor(() => {
            expect(thirdPanel).toHaveAttribute("aria-expanded", "true");
            expect(firstPanel).toHaveAttribute("aria-expanded", "false");
        });
    });
};
