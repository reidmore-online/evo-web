import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { EbayButton } from "../index";
import { EbayIcon } from "../../ebay-icon";

describe("ebay-button accessibility", () => {
    describe("Click Interactions", () => {
        describe("given enabled button", () => {
            let clickHandler: ReturnType<typeof vi.fn>;

            beforeEach(() => {
                clickHandler = vi.fn();
                render(<EbayButton onClick={clickHandler}>Click me</EbayButton>);
            });

            describe("when button is clicked", () => {
                beforeEach(() => {
                    fireEvent.click(screen.getByRole("button"));
                });

                it("then it emits click event", () => {
                    expect(clickHandler).toHaveBeenCalledTimes(1);
                });
            });

            describe("when button is clicked multiple times", () => {
                beforeEach(() => {
                    const button = screen.getByRole("button");
                    fireEvent.click(button);
                    fireEvent.click(button);
                });

                it("then it emits click event for each click", () => {
                    expect(clickHandler).toHaveBeenCalledTimes(2);
                });
            });
        });

        describe("given disabled button", () => {
            let clickHandler: ReturnType<typeof vi.fn>;

            beforeEach(() => {
                clickHandler = vi.fn();
                render(
                    <EbayButton onClick={clickHandler} disabled>
                        Click me
                    </EbayButton>,
                );
            });

            describe("when button is clicked", () => {
                beforeEach(() => {
                    fireEvent.click(screen.getByRole("button"));
                });

                it("then it does not emit click event", () => {
                    expect(clickHandler).not.toHaveBeenCalled();
                });
            });
        });

        describe("given partially disabled button", () => {
            let clickHandler: ReturnType<typeof vi.fn>;

            beforeEach(() => {
                clickHandler = vi.fn();
                render(
                    <EbayButton onClick={clickHandler} partiallyDisabled>
                        Click me
                    </EbayButton>,
                );
            });

            describe("when button is clicked", () => {
                beforeEach(() => {
                    fireEvent.click(screen.getByRole("button"));
                });

                it("then it emits click event", () => {
                    expect(clickHandler).toHaveBeenCalledTimes(1);
                });
            });
        });

        describe("given link button with href", () => {
            let clickHandler: ReturnType<typeof vi.fn>;

            beforeEach(() => {
                clickHandler = vi.fn();
                render(
                    <EbayButton onClick={clickHandler} href="/test-url">
                        Link button
                    </EbayButton>,
                );
            });

            describe("when link is clicked", () => {
                beforeEach(() => {
                    fireEvent.click(screen.getByRole("link"));
                });

                it("then it emits click event", () => {
                    expect(clickHandler).toHaveBeenCalledTimes(1);
                });
            });
        });
    });

    describe("Keyboard Interactions", () => {
        describe("given enabled button", () => {
            let clickHandler: ReturnType<typeof vi.fn>;
            let user: ReturnType<typeof userEvent.setup>;

            beforeEach(() => {
                clickHandler = vi.fn();
                user = userEvent.setup();
                render(<EbayButton onClick={clickHandler}>Press me</EbayButton>);
            });

            describe("when Enter key is pressed", () => {
                beforeEach(async () => {
                    const button = screen.getByRole("button");
                    button.focus();
                    await user.keyboard("{Enter}");
                });

                it("then it emits click event", () => {
                    expect(clickHandler).toHaveBeenCalledTimes(1);
                });
            });

            describe("when Space key is pressed", () => {
                beforeEach(async () => {
                    const button = screen.getByRole("button");
                    button.focus();
                    await user.keyboard(" ");
                });

                it("then it emits click event", () => {
                    expect(clickHandler).toHaveBeenCalledTimes(1);
                });
            });

            describe("when Escape key is pressed", () => {
                let escapeHandler: ReturnType<typeof vi.fn>;

                beforeEach(async () => {
                    escapeHandler = vi.fn();
                    render(
                        <EbayButton onClick={clickHandler} onEscape={escapeHandler}>
                            Press me
                        </EbayButton>,
                    );
                    const buttons = screen.getAllByRole("button");
                    const button = buttons[buttons.length - 1];
                    button.focus();
                    await user.keyboard("{Escape}");
                });

                it("then it emits escape event", () => {
                    expect(escapeHandler).toHaveBeenCalledTimes(1);
                });

                it("then it does not emit click event", () => {
                    expect(clickHandler).not.toHaveBeenCalled();
                });
            });
        });

        describe("given disabled button", () => {
            let clickHandler: ReturnType<typeof vi.fn>;
            let user: ReturnType<typeof userEvent.setup>;

            beforeEach(() => {
                clickHandler = vi.fn();
                user = userEvent.setup();
                render(
                    <EbayButton onClick={clickHandler} disabled>
                        Press me
                    </EbayButton>,
                );
            });

            describe("when Enter key is pressed", () => {
                beforeEach(async () => {
                    const button = screen.getByRole("button");
                    button.focus();
                    await user.keyboard("{Enter}");
                });

                it("then it does not emit click event", () => {
                    expect(clickHandler).not.toHaveBeenCalled();
                });
            });

            describe("when Space key is pressed", () => {
                beforeEach(async () => {
                    const button = screen.getByRole("button");
                    button.focus();
                    await user.keyboard(" ");
                });

                it("then it does not emit click event", () => {
                    expect(clickHandler).not.toHaveBeenCalled();
                });
            });

            describe("when Escape key is pressed", () => {
                let escapeHandler: ReturnType<typeof vi.fn>;

                beforeEach(async () => {
                    escapeHandler = vi.fn();
                    render(
                        <EbayButton onClick={clickHandler} onEscape={escapeHandler} disabled>
                            Press me
                        </EbayButton>,
                    );
                    const buttons = screen.getAllByRole("button");
                    const button = buttons[buttons.length - 1];
                    button.focus();
                    await user.keyboard("{Escape}");
                });

                it("then it does not emit escape event", () => {
                    expect(escapeHandler).not.toHaveBeenCalled();
                });
            });
        });

        describe("given partially disabled button", () => {
            let clickHandler: ReturnType<typeof vi.fn>;
            let user: ReturnType<typeof userEvent.setup>;

            beforeEach(() => {
                clickHandler = vi.fn();
                user = userEvent.setup();
                render(
                    <EbayButton onClick={clickHandler} partiallyDisabled>
                        Press me
                    </EbayButton>,
                );
            });

            describe("when Enter key is pressed", () => {
                beforeEach(async () => {
                    const button = screen.getByRole("button");
                    button.focus();
                    await user.keyboard("{Enter}");
                });

                it("then it emits click event", () => {
                    expect(clickHandler).toHaveBeenCalledTimes(1);
                });
            });

            describe("when Escape key is pressed", () => {
                let escapeHandler: ReturnType<typeof vi.fn>;

                beforeEach(async () => {
                    escapeHandler = vi.fn();
                    render(
                        <EbayButton onClick={clickHandler} onEscape={escapeHandler} partiallyDisabled>
                            Press me
                        </EbayButton>,
                    );
                    const buttons = screen.getAllByRole("button");
                    const button = buttons[buttons.length - 1];
                    button.focus();
                    await user.keyboard("{Escape}");
                });

                it("then it emits escape event", () => {
                    expect(escapeHandler).toHaveBeenCalledTimes(1);
                });
            });
        });
    });

    describe("Focus Management", () => {
        describe("given an enabled button", () => {
            let focusHandler: ReturnType<typeof vi.fn>;
            let blurHandler: ReturnType<typeof vi.fn>;

            beforeEach(() => {
                focusHandler = vi.fn();
                blurHandler = vi.fn();
                render(
                    <EbayButton onFocus={focusHandler} onBlur={blurHandler}>
                        Focus me
                    </EbayButton>,
                );
            });

            it("then button is keyboard focusable", () => {
                const button = screen.getByRole("button");
                expect(button.tabIndex).toBeGreaterThanOrEqual(0);
            });

            describe("when button receives focus", () => {
                beforeEach(() => {
                    const button = screen.getByRole("button");
                    button.focus();
                });

                it("then button has focus", () => {
                    const button = screen.getByRole("button");
                    expect(document.activeElement).toBe(button);
                });

                it("then it emits focus event", () => {
                    expect(focusHandler).toHaveBeenCalledTimes(1);
                });
            });

            describe("when button loses focus", () => {
                beforeEach(() => {
                    const button = screen.getByRole("button");
                    fireEvent.focus(button);
                    fireEvent.blur(button);
                });

                it("then it emits blur event", () => {
                    expect(blurHandler).toHaveBeenCalledTimes(1);
                });
            });

            describe("when Tab key is pressed while button has focus", () => {
                beforeEach(async () => {
                    const user = userEvent.setup();
                    const button = screen.getByRole("button");
                    button.focus();
                    await user.keyboard("{Tab}");
                });

                it("then focus moves away from button", () => {
                    const button = screen.getByRole("button");
                    expect(document.activeElement).not.toBe(button);
                });
            });
        });

        describe("given a disabled button", () => {
            beforeEach(() => {
                render(<EbayButton disabled>Focus me</EbayButton>);
            });

            it("then button is not keyboard focusable", () => {
                const button = screen.getByRole("button");
                expect(button).toBeDisabled();
            });

            describe("when attempting to focus", () => {
                beforeEach(() => {
                    const button = screen.getByRole("button");
                    button.focus();
                });

                it("then button does not receive focus", () => {
                    const button = screen.getByRole("button");
                    expect(document.activeElement).not.toBe(button);
                });
            });
        });

        describe("given a partially disabled button", () => {
            beforeEach(() => {
                render(<EbayButton partiallyDisabled>Focus me</EbayButton>);
            });

            it("then button is keyboard focusable", () => {
                const button = screen.getByRole("button");
                expect(button).not.toBeDisabled();
            });

            describe("when button receives focus", () => {
                beforeEach(() => {
                    const button = screen.getByRole("button");
                    button.focus();
                });

                it("then button has focus", () => {
                    const button = screen.getByRole("button");
                    expect(document.activeElement).toBe(button);
                });
            });
        });

        describe("given a link button", () => {
            beforeEach(() => {
                render(<EbayButton href="/test">Link button</EbayButton>);
            });

            it("then link is keyboard focusable", () => {
                const link = screen.getByRole("link");
                expect(link.tabIndex).toBeGreaterThanOrEqual(0);
            });

            describe("when link receives focus", () => {
                beforeEach(() => {
                    const link = screen.getByRole("link");
                    link.focus();
                });

                it("then link has focus", () => {
                    const link = screen.getByRole("link");
                    expect(document.activeElement).toBe(link);
                });
            });
        });
    });

    describe("ARIA Attributes", () => {
        describe("given a standard button", () => {
            beforeEach(() => {
                render(<EbayButton>Standard button</EbayButton>);
            });

            it("then it has correct role", () => {
                const button = screen.getByRole("button");
                expect(button).toBeInTheDocument();
            });

            it("then it has accessible text content", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Standard button");
            });

            it("then it does not have aria-disabled", () => {
                const button = screen.getByRole("button");
                expect(button).not.toHaveAttribute("aria-disabled");
            });
        });

        describe("given a disabled button", () => {
            beforeEach(() => {
                render(<EbayButton disabled>Disabled button</EbayButton>);
            });

            it("then it has disabled attribute", () => {
                const button = screen.getByRole("button");
                expect(button).toBeDisabled();
            });

            it("then it is still accessible to screen readers", () => {
                const button = screen.getByRole("button");
                expect(button).toBeInTheDocument();
            });
        });

        describe("given a partially disabled button", () => {
            beforeEach(() => {
                render(<EbayButton partiallyDisabled>Partially disabled</EbayButton>);
            });

            it("then it has aria-disabled attribute", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveAttribute("aria-disabled", "true");
            });

            it("then it does not have disabled attribute", () => {
                const button = screen.getByRole("button");
                expect(button).not.toBeDisabled();
            });
        });

        describe("given a button with loading state", () => {
            beforeEach(() => {
                render(<EbayButton bodyState="loading">Loading button</EbayButton>);
            });

            it("then it has aria-live attribute", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveAttribute("aria-live", "polite");
            });

            it("then it contains progress spinner", () => {
                const button = screen.getByRole("button");
                const spinner = button.querySelector(".progress-spinner");
                expect(spinner).toBeInTheDocument();
            });
        });

        describe("given a button with expand state", () => {
            beforeEach(() => {
                render(<EbayButton bodyState="expand">Expand button</EbayButton>);
            });

            it("then it contains the button text", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Expand button");
            });

            it("then it contains chevron icon", () => {
                const button = screen.getByRole("button");
                const svg = button.querySelector("svg");
                expect(svg).toBeInTheDocument();
            });
        });

        describe("given a link button", () => {
            beforeEach(() => {
                render(<EbayButton href="/test-url">Link button</EbayButton>);
            });

            it("then it has link role", () => {
                const link = screen.getByRole("link");
                expect(link).toBeInTheDocument();
            });

            it("then it has correct href attribute", () => {
                const link = screen.getByRole("link");
                expect(link).toHaveAttribute("href", "/test-url");
            });

            it("then it has accessible text content", () => {
                const link = screen.getByRole("link");
                expect(link).toHaveTextContent("Link button");
            });
        });

        describe("given a link button that is disabled", () => {
            beforeEach(() => {
                render(
                    <EbayButton href="/test-url" disabled>
                        Disabled link
                    </EbayButton>,
                );
            });

            it("then it does not have href attribute", () => {
                const link = screen.getByText("Disabled link");
                expect(link).not.toHaveAttribute("href");
            });
        });

        describe("given a button with aria-label", () => {
            beforeEach(() => {
                render(
                    <EbayButton aria-label="Custom label">
                        <EbayIcon name="menu24" />
                    </EbayButton>,
                );
            });

            it("then it has correct aria-label", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveAttribute("aria-label", "Custom label");
            });
        });

        describe("given a button with custom attributes", () => {
            beforeEach(() => {
                render(
                    <EbayButton id="test-button" name="test-name">
                        Custom button
                    </EbayButton>,
                );
            });

            it("then it has correct id attribute", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveAttribute("id", "test-button");
            });

            it("then it has correct name attribute", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveAttribute("name", "test-name");
            });
        });
    });

    describe("Accessibility Compliance", () => {
        describe("given any button variant", () => {
            beforeEach(() => {
                render(<EbayButton priority="primary">Test button</EbayButton>);
            });

            it("then it has sufficient text content or accessible name", () => {
                const button = screen.getByRole("button");
                const text = button.textContent?.trim();
                const ariaLabel = button.getAttribute("aria-label");

                expect(text || ariaLabel).toBeTruthy();
            });

            it("then it has proper button element structure", () => {
                const button = screen.getByRole("button");
                expect(button.tagName).toBe("BUTTON");
            });
        });

        describe("given button with different priorities", () => {
            it("then primary button maintains accessibility", () => {
                render(<EbayButton priority="primary">Primary</EbayButton>);
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Primary");
                expect(button).toHaveClass("btn--primary");
            });

            it("then secondary button maintains accessibility", () => {
                render(<EbayButton priority="secondary">Secondary</EbayButton>);
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Secondary");
                expect(button).toHaveClass("btn--secondary");
            });

            it("then tertiary button maintains accessibility", () => {
                render(<EbayButton priority="tertiary">Tertiary</EbayButton>);
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Tertiary");
                expect(button).toHaveClass("btn--tertiary");
            });
        });

        describe("given button with different sizes", () => {
            it("then large button maintains accessibility", () => {
                render(<EbayButton size="large">Large</EbayButton>);
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Large");
                expect(button).toHaveClass("btn--large");
            });

            it("then small button maintains accessibility", () => {
                render(<EbayButton size="small">Small</EbayButton>);
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Small");
                expect(button).toHaveClass("btn--small");
            });
        });

        describe("given button with different variants", () => {
            it("then destructive variant maintains accessibility", () => {
                render(<EbayButton variant="destructive">Delete</EbayButton>);
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Delete");
                expect(button).toHaveClass("btn--destructive");
            });

            it("then form variant maintains accessibility", () => {
                render(<EbayButton variant="form">Submit</EbayButton>);
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Submit");
                expect(button).toHaveClass("btn--form");
            });
        });

        describe("given button with truncate enabled", () => {
            beforeEach(() => {
                render(
                    <EbayButton truncate fixedHeight>
                        Very long button text that should truncate
                    </EbayButton>,
                );
            });

            it("then text content is still accessible", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Very long button text that should truncate");
            });

            it("then it has truncated class", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveClass("btn--truncated");
            });
        });

        describe("given fluid button", () => {
            beforeEach(() => {
                render(<EbayButton fluid>Fluid button</EbayButton>);
            });

            it("then it maintains accessibility", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Fluid button");
            });

            it("then it has fluid class", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveClass("btn--fluid");
            });
        });

        describe("given borderless button", () => {
            beforeEach(() => {
                render(<EbayButton borderless>Borderless</EbayButton>);
            });

            it("then it maintains accessibility", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Borderless");
            });

            it("then it has borderless class", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveClass("btn--borderless");
            });
        });

        describe("given transparent button", () => {
            beforeEach(() => {
                render(<EbayButton transparent>Transparent</EbayButton>);
            });

            it("then it maintains accessibility", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveTextContent("Transparent");
            });

            it("then it has transparent class", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveClass("btn--transparent");
            });
        });

        describe("given icon-only button", () => {
            beforeEach(() => {
                render(
                    <EbayButton aria-label="Menu">
                        <EbayIcon name="menu24" />
                    </EbayButton>,
                );
            });

            it("then it has accessible label", () => {
                const button = screen.getByRole("button");
                expect(button).toHaveAttribute("aria-label", "Menu");
            });

            it("then button is still accessible", () => {
                const button = screen.getByRole("button");
                expect(button).toBeInTheDocument();
            });
        });
    });
});
