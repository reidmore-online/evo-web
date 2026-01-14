import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { render, cleanup, waitFor, fireEvent } from "@marko/testing-library";
import { userEvent } from "vitest/browser";
import { pressKey } from "../../../common/test-utils/browser";
import template from "../index.marko";
import defaultTemplate from "../examples/default.marko";
import autoCollapsedTemplate from "../examples/autoCollapsed.marko";
import openedTemplate from "../examples/opened.marko";

afterEach(cleanup);

/** @type import("@marko/testing-library").RenderResult */
let component;

describe("Keyboard Interactions", () => {
    describe("given a default accordion with all panels closed", () => {
        beforeEach(async () => {
            component = await render(defaultTemplate);
        });

        describe("when Enter key is pressed on first panel", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                firstSummary.focus();
                await pressKey(firstSummary, { key: "Enter", keyCode: 13 });
            });

            it("then it expands the panel", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                });
            });

            it("then it emits toggle event", () => {
                const toggleEvents = component.emitted("toggle");
                expect(toggleEvents).has.length(1);

                const [[toggleEvent]] = toggleEvents;
                expect(toggleEvent).has.property("open", true);
                expect(toggleEvent).has.property("index", 0);
            });
        });

        describe("when Space key is pressed on first panel", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                firstSummary.focus();
                await pressKey(firstSummary, { key: " ", keyCode: 32 });
            });

            it("then it expands the panel", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                });
            });

            it("then it emits toggle event", () => {
                const toggleEvents = component.emitted("toggle");
                expect(toggleEvents).has.length(1);

                const [[toggleEvent]] = toggleEvents;
                expect(toggleEvent).has.property("open", true);
                expect(toggleEvent).has.property("index", 0);
            });
        });

        describe("when Tab key is pressed", () => {
            beforeEach(async () => {
                const summaries =
                    component.container.querySelectorAll(".details__summary");
                summaries[0].focus();
            });

            it("then focus moves to next panel header", async () => {
                const summaries =
                    component.container.querySelectorAll(".details__summary");
                const user = userEvent.setup();

                await user.tab();
                expect(document.activeElement).toBe(summaries[1]);
            });
        });

        describe("when Shift+Tab keys are pressed", () => {
            beforeEach(async () => {
                const summaries =
                    component.container.querySelectorAll(".details__summary");
                summaries[2].focus();
            });

            it("then focus moves to previous panel header", async () => {
                const summaries =
                    component.container.querySelectorAll(".details__summary");
                const user = userEvent.setup();

                await user.tab({ shift: true });
                expect(document.activeElement).toBe(summaries[1]);
            });
        });
    });

    describe("given an open panel", () => {
        beforeEach(async () => {
            component = await render(openedTemplate);
        });

        describe("when Enter key is pressed on open panel", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                firstSummary.focus();
                await pressKey(firstSummary, { key: "Enter", keyCode: 13 });
            });

            it("then it collapses the panel", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "false",
                    );
                });
            });

            it("then it emits toggle event", () => {
                const toggleEvents = component.emitted("toggle");
                expect(toggleEvents).has.length(1);

                const [[toggleEvent]] = toggleEvents;
                expect(toggleEvent).has.property("open", false);
            });
        });

        describe("when Space key is pressed on open panel", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                firstSummary.focus();
                await pressKey(firstSummary, { key: " ", keyCode: 32 });
            });

            it("then it collapses the panel", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "false",
                    );
                });
            });
        });
    });

    describe("given an auto-collapse accordion", () => {
        beforeEach(async () => {
            component = await render(autoCollapsedTemplate);
        });

        describe("when Enter key is pressed on second panel after first is open", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                firstSummary.focus();
                await pressKey(firstSummary, { key: "Enter", keyCode: 13 });

                await waitFor(() => {
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                });

                const user = userEvent.setup();
                await user.tab();

                const secondSummary = component.getByText("Item 2");
                await pressKey(secondSummary, { key: "Enter", keyCode: 13 });
            });

            it("then it opens second panel and closes first panel", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    const secondSummary = component.getByText("Item 2");
                    expect(secondSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "false",
                    );
                });
            });

            it("then it emits toggle event for second panel", () => {
                const toggleEvents = component.emitted("toggle");
                expect(toggleEvents.length).toBeGreaterThanOrEqual(2);

                const lastEvent = toggleEvents[toggleEvents.length - 1][0];
                expect(lastEvent).has.property("open", true);
                expect(lastEvent).has.property("index", 1);
            });
        });
    });
});

describe("Click Interactions", () => {
    describe("given a default accordion", () => {
        beforeEach(async () => {
            component = await render(defaultTemplate);
        });

        describe("when panel header is clicked", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                await fireEvent.click(firstSummary);
            });

            it("then it expands the panel", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                });
            });

            it("then it emits click event", () => {
                const clickEvents = component.emitted("click");
                expect(clickEvents).has.length(1);
            });

            it("then it emits toggle event", () => {
                const toggleEvents = component.emitted("toggle");
                expect(toggleEvents).has.length(1);

                const [[toggleEvent]] = toggleEvents;
                expect(toggleEvent).has.property("open", true);
            });
        });

        describe("when expanded panel header is clicked again", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                await fireEvent.click(firstSummary);

                await waitFor(() => {
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                });

                await fireEvent.click(firstSummary);
            });

            it("then it collapses the panel", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "false",
                    );
                });
            });

            it("then it emits two toggle events", () => {
                const toggleEvents = component.emitted("toggle");
                expect(toggleEvents).has.length(2);

                const [[firstEvent], [secondEvent]] = toggleEvents;
                expect(firstEvent).has.property("open", true);
                expect(secondEvent).has.property("open", false);
            });
        });
    });

    describe("given an auto-collapse accordion", () => {
        beforeEach(async () => {
            component = await render(autoCollapsedTemplate);
        });

        describe("when second panel is clicked after first is open", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                await fireEvent.click(firstSummary);

                await waitFor(() => {
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                });

                const secondSummary = component.getByText("Item 2");
                await fireEvent.click(secondSummary);
            });

            it("then it opens second panel and closes first panel", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    const secondSummary = component.getByText("Item 2");
                    expect(secondSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "false",
                    );
                });
            });

            it("then it emits toggle events", () => {
                const toggleEvents = component.emitted("toggle");
                expect(toggleEvents.length).toBeGreaterThanOrEqual(2);
            });
        });

        describe("when multiple panels are clicked in sequence", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                const secondSummary = component.getByText("Item 2");
                const thirdSummary = component.getByText("Item 3");

                await fireEvent.click(firstSummary);
                await waitFor(() => {
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                });

                await fireEvent.click(secondSummary);
                await waitFor(() => {
                    expect(secondSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                });

                await fireEvent.click(thirdSummary);
            });

            it("then only the last clicked panel remains open", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    const secondSummary = component.getByText("Item 2");
                    const thirdSummary = component.getByText("Item 3");

                    expect(thirdSummary).toHaveAttribute(
                        "aria-expanded",
                        "true",
                    );
                    expect(secondSummary).toHaveAttribute(
                        "aria-expanded",
                        "false",
                    );
                    expect(firstSummary).toHaveAttribute(
                        "aria-expanded",
                        "false",
                    );
                });
            });
        });
    });
});

describe("Focus Management", () => {
    describe("given a default accordion", () => {
        beforeEach(async () => {
            component = await render(defaultTemplate);
        });

        it("then all panel headers are keyboard focusable", () => {
            const summaries =
                component.container.querySelectorAll(".details__summary");
            summaries.forEach((summary) => {
                expect(summary.tabIndex).toBeGreaterThanOrEqual(0);
            });
        });

        describe("when panel header receives focus", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                firstSummary.focus();
            });

            it("then panel header has focus", () => {
                const firstSummary = component.getByText("Item 1");
                expect(document.activeElement).toBe(firstSummary);
            });
        });

        describe("when panel header is clicked", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                await fireEvent.click(firstSummary);
            });

            it("then focus remains on panel header", () => {
                const firstSummary = component.getByText("Item 1");
                expect(document.activeElement).toBe(firstSummary);
            });
        });

        describe("when panel is activated with keyboard", () => {
            beforeEach(async () => {
                const firstSummary = component.getByText("Item 1");
                firstSummary.focus();
                await pressKey(firstSummary, { key: "Enter", keyCode: 13 });
            });

            it("then focus remains on panel header", async () => {
                await waitFor(() => {
                    const firstSummary = component.getByText("Item 1");
                    expect(document.activeElement).toBe(firstSummary);
                });
            });
        });

        describe("when tabbing through accordion", () => {
            beforeEach(async () => {
                const summaries =
                    component.container.querySelectorAll(".details__summary");
                summaries[0].focus();
            });

            it("then focus moves through all panel headers in order", async () => {
                const summaries =
                    component.container.querySelectorAll(".details__summary");
                const user = userEvent.setup();

                expect(document.activeElement).toBe(summaries[0]);

                await user.tab();
                expect(document.activeElement).toBe(summaries[1]);

                await user.tab();
                expect(document.activeElement).toBe(summaries[2]);
            });
        });
    });
});

describe("ARIA Attributes", () => {
    describe("given a default accordion", () => {
        beforeEach(async () => {
            component = await render(defaultTemplate);
        });

        it("then accordion container has aria-roledescription", () => {
            const accordion = component.container.querySelector(".accordion");
            expect(accordion).toHaveAttribute(
                "aria-roledescription",
                "accordion",
            );
        });

        it("then all panel headers have button role", () => {
            const summaries =
                component.container.querySelectorAll(".details__summary");
            summaries.forEach((summary) => {
                expect(summary.tagName).toBe("BUTTON");
            });
        });

        it("then collapsed panels have aria-expanded=false", () => {
            const summaries =
                component.container.querySelectorAll(".details__summary");
            summaries.forEach((summary) => {
                expect(summary).toHaveAttribute("aria-expanded", "false");
            });
        });

        it("then panel headers have aria-controls pointing to content", () => {
            const summaries =
                component.container.querySelectorAll(".details__summary");
            summaries.forEach((summary) => {
                const controlsId = summary.getAttribute("aria-controls");
                expect(controlsId).toBeTruthy();

                const content = component.container.querySelector(
                    `#${controlsId}`,
                );
                expect(content).toBeTruthy();
            });
        });

        it("then content regions have unique ids", () => {
            const contents =
                component.container.querySelectorAll(".details__content");
            const ids = Array.from(contents).map((el) => el.id);
            const uniqueIds = new Set(ids);
            expect(ids.length).toBe(uniqueIds.size);
            expect(ids.every((id) => id && id.length > 0)).toBe(true);
        });

        it("then panel headers have unique accessible names", () => {
            const summaries =
                component.container.querySelectorAll(".details__summary");
            const texts = Array.from(summaries).map((s) =>
                s.textContent.trim(),
            );
            const uniqueTexts = new Set(texts);
            expect(texts.length).toBe(uniqueTexts.size);
        });
    });

    describe("given an open accordion panel", () => {
        beforeEach(async () => {
            component = await render(openedTemplate);
        });

        it("then open panel has aria-expanded=true", () => {
            const firstSummary = component.getByText("Item 1");
            expect(firstSummary).toHaveAttribute("aria-expanded", "true");
        });

        it("then closed panels have aria-expanded=false", () => {
            const secondSummary = component.getByText("Item 2");
            const thirdSummary = component.getByText("Item 3");
            expect(secondSummary).toHaveAttribute("aria-expanded", "false");
            expect(thirdSummary).toHaveAttribute("aria-expanded", "false");
        });
    });

    describe("given custom aria-roledescription", () => {
        beforeEach(async () => {
            component = await render(template, {
                a11yRoleDescription: "custom accordion",
                details: [{ renderBody: () => "Test content 1" }],
            });
        });

        it("then accordion has custom aria-roledescription", () => {
            const accordion = component.container.querySelector(".accordion");
            expect(accordion).toHaveAttribute(
                "aria-roledescription",
                "custom accordion",
            );
        });
    });
});

describe("Accessibility Compliance", () => {
    describe("given a default accordion", () => {
        beforeEach(async () => {
            component = await render(defaultTemplate);
        });

        it("then accordion has semantic HTML structure", () => {
            const accordion = component.container.querySelector("ul.accordion");
            expect(accordion).toBeTruthy();

            const listItems = accordion.querySelectorAll("li");
            expect(listItems.length).toBeGreaterThan(0);

            const details = component.container.querySelectorAll(".details");
            expect(details.length).toBeGreaterThan(0);
        });

        it("then panel headers are keyboard accessible", () => {
            const summaries =
                component.container.querySelectorAll(".details__summary");
            summaries.forEach((summary) => {
                expect(summary.tabIndex).toBeGreaterThanOrEqual(0);
            });
        });

        it("then there are no duplicate interactive element labels", () => {
            const summaries =
                component.container.querySelectorAll(".details__summary");
            const labels = Array.from(summaries).map((s) =>
                s.textContent.trim(),
            );
            const uniqueLabels = new Set(labels);
            expect(labels.length).toBe(uniqueLabels.size);
        });

        it("then accordion maintains list semantics", () => {
            const accordion = component.container.querySelector(".accordion");
            // In some browsers list-style-type: none removes implicit list role
            // but our CSS uses ::marker instead to preserve semantics
            expect(accordion.tagName).toBe("UL");
        });
    });

    describe("given large size accordion", () => {
        beforeEach(async () => {
            component = await render(template, {
                size: "large",
                details: [
                    { renderBody: () => "Test content 1" },
                    { renderBody: () => "Test content 2" },
                ],
            });
        });

        it("then accordion has large class", () => {
            const accordion = component.container.querySelector(".accordion");
            expect(accordion.classList.contains("accordion--large")).toBe(true);
        });

        it("then all accessibility features still work", () => {
            const summaries =
                component.container.querySelectorAll(".details__summary");
            expect(summaries.length).toBe(2);

            summaries.forEach((summary) => {
                expect(summary.tagName).toBe("BUTTON");
                expect(summary).toHaveAttribute("aria-expanded");
                expect(summary).toHaveAttribute("aria-controls");
            });
        });
    });
});
