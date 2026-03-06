import React, { useState } from "react";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EbayMenuButton, EbayMenuButtonItem } from "../index";

const spy = vi.fn();

describe("<EbayMenuButton>", () => {
    beforeEach(() => {
        spy.mockClear();
    });

    describe("Click interactions", () => {
        it("should fire onExpand event when button is clicked", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton onExpand={spy}>
                    <EbayMenuButtonItem />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button"));
            expect(spy).toHaveBeenCalled();
        });

        it("should fire onCollapse event when button is clicked twice", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton onCollapse={spy}>
                    <EbayMenuButtonItem />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button");
            await user.click(button);
            await user.click(button);
            expect(spy).toHaveBeenCalled();
        });

        it("should fire onSelect event when menu item is clicked", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton onSelect={spy}>
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button"));
            const item = screen.getAllByRole("menuitem")[1];
            await user.click(item);
            expect(spy).toHaveBeenCalledWith(expect.any(Object), {
                index: 1,
                checked: [1],
            });
        });
    });

    describe('type="radio"', () => {
        it("should fire onChange event", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton type="radio" onChange={spy}>
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button"));
            const item = screen.getAllByRole("menuitemradio")[1];
            await user.click(item);
            expect(spy).toHaveBeenCalledWith(expect.any(Object), {
                index: 1,
                indexes: [1],
                checked: [1],
                checkedValues: ["second"],
            });
        });
    });

    describe('type="checkbox"', () => {
        it("should fire onChange event", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton type="checkbox" onChange={spy}>
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button"));
            const item = screen.getAllByRole("menuitemcheckbox")[1];
            await user.click(item);
            expect(spy).toHaveBeenCalledWith(expect.any(Object), {
                index: 1,
                indexes: [1],
                checked: [1],
                checkedValues: ["second"],
            });
        });
    });

    it("should update the checkboxes on click", async () => {
        const user = userEvent.setup();
        render(
            <EbayMenuButton type="checkbox" text="Open">
                <EbayMenuButtonItem value="first" />
                <EbayMenuButtonItem value="second" />
            </EbayMenuButton>,
        );

        await user.click(screen.getByRole("button", { name: /open/i }));

        const [firstCheck, secondCheck] = screen.getAllByRole("menuitemcheckbox");

        expect(firstCheck).toHaveAttribute("aria-checked", "false");
        expect(secondCheck).toHaveAttribute("aria-checked", "false");

        await user.click(firstCheck);
        expect(firstCheck).toHaveAttribute("aria-checked", "true");
        expect(secondCheck).toHaveAttribute("aria-checked", "false");

        await user.click(secondCheck);
        expect(firstCheck).toHaveAttribute("aria-checked", "true");
        expect(secondCheck).toHaveAttribute("aria-checked", "true");
    });

    it("should update the checked values when children checked are changed", async () => {
        const user = userEvent.setup();
        const TestCase = () => {
            const [checked, setChecked] = useState([false, true]);
            return (
                <>
                    <EbayMenuButton type="checkbox" text="Open">
                        <EbayMenuButtonItem value="first" checked={checked[0]} />
                        <EbayMenuButtonItem value="second" checked={checked[1]} />
                    </EbayMenuButton>

                    <button onClick={() => setChecked([true, false])}>Reset</button>
                </>
            );
        };

        render(<TestCase />);

        await user.click(screen.getByRole("button", { name: /open/i }));

        {
            const [firstCheck, secondCheck] = screen.getAllByRole("menuitemcheckbox");

            expect(firstCheck).toHaveAttribute("aria-checked", "false");
            expect(secondCheck).toHaveAttribute("aria-checked", "true");
        }

        await user.click(screen.getByText("Reset"));
        await user.click(screen.getByRole("button", { name: /open/i }));

        {
            const [firstCheck, secondCheck] = screen.getAllByRole("menuitemcheckbox");
            expect(firstCheck).toHaveAttribute("aria-checked", "true");
            expect(secondCheck).toHaveAttribute("aria-checked", "false");
        }
    });

    describe("Keyboard interactions", () => {
        it("should expand when Enter is pressed on button", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button", { name: /menu/i });
            button.focus();
            await user.keyboard("{Enter}");
            expect(button).toHaveAttribute("aria-expanded", "true");
            expect(screen.getByRole("menu")).toBeInTheDocument();
        });

        it("should expand when Space is pressed on button", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button", { name: /menu/i });
            button.focus();
            await user.keyboard(" ");
            expect(button).toHaveAttribute("aria-expanded", "true");
        });

        it("should move focus to first item when menu opens", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button", { name: /menu/i }));
            const firstItem = screen.getAllByRole("menuitem")[0];
            expect(firstItem).toHaveFocus();
        });

        it("should move focus with Arrow Down", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button", { name: /menu/i }));
            await user.keyboard("{ArrowDown}");
            const secondItem = screen.getAllByRole("menuitem")[1];
            expect(secondItem).toHaveFocus();
        });

        it("should activate item when Enter is pressed on focused item", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu" onSelect={spy}>
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button", { name: /menu/i });
            await user.click(button);
            await user.keyboard("{Enter}");
            expect(spy).toHaveBeenCalledWith(expect.any(Object), {
                index: 0,
                checked: [0],
            });
        });

        it("should activate item when Space is pressed on focused item", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu" onSelect={spy}>
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button", { name: /menu/i }));
            await user.keyboard(" ");
            expect(spy).toHaveBeenCalledWith(expect.any(Object), {
                index: 0,
                checked: [0],
            });
        });

        it("should collapse and return focus to button when Escape is pressed", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button", { name: /menu/i });
            await user.click(button);
            await user.keyboard("{Escape}");
            expect(button).toHaveAttribute("aria-expanded", "false");
            expect(button).toHaveFocus();
        });

        it("should move focus to next focusable when Tab is pressed from menu", async () => {
            const user = userEvent.setup();
            render(
                <>
                    <EbayMenuButton text="Menu">
                        <EbayMenuButtonItem value="first" />
                        <EbayMenuButtonItem value="second" />
                    </EbayMenuButton>
                    <button type="button">Next</button>
                </>,
            );
            const menuButton = screen.getByRole("button", { name: /menu/i });
            await user.click(menuButton);
            await user.keyboard("{Tab}");
            expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
        });
    });

    describe("Focus management", () => {
        it("when button receives focus it has focus", async () => {
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button", { name: /menu/i });
            button.focus();
            expect(button).toHaveFocus();
        });

        it("when menu opens focus moves to first menu item", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button", { name: /menu/i }));
            const firstItem = screen.getAllByRole("menuitem")[0];
            expect(firstItem).toHaveFocus();
        });

        it("when Escape is pressed focus returns to button", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button", { name: /menu/i });
            await user.click(button);
            await user.keyboard("{Escape}");
            expect(button).toHaveFocus();
        });
    });

    describe("ARIA attributes", () => {
        it("when collapsed button has aria-haspopup, aria-expanded false, and aria-controls", () => {
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button", { name: /menu/i });
            expect(button).toHaveAttribute("aria-haspopup", "true");
            expect(button).toHaveAttribute("aria-expanded", "false");
            const controlsId = button.getAttribute("aria-controls");
            expect(controlsId).toBeTruthy();
        });

        it("when expanded button has aria-expanded true", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button", { name: /menu/i });
            await user.click(button);
            expect(button).toHaveAttribute("aria-expanded", "true");
        });

        it("menu has role menu", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton text="Menu">
                    <EbayMenuButtonItem value="first" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button", { name: /menu/i }));
            expect(screen.getByRole("menu")).toBeInTheDocument();
        });

        it("radio items have role menuitemradio and aria-checked", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton type="radio" text="Menu">
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button", { name: /menu/i }));
            const items = screen.getAllByRole("menuitemradio");
            expect(items.length).toBeGreaterThan(0);
            expect(items[0]).toHaveAttribute("aria-checked");
        });

        it("checkbox items have role menuitemcheckbox and aria-checked", async () => {
            const user = userEvent.setup();
            render(
                <EbayMenuButton type="checkbox" text="Menu">
                    <EbayMenuButtonItem value="first" />
                    <EbayMenuButtonItem value="second" />
                </EbayMenuButton>,
            );
            await user.click(screen.getByRole("button", { name: /menu/i }));
            const items = screen.getAllByRole("menuitemcheckbox");
            expect(items.length).toBeGreaterThan(0);
            expect(items[0]).toHaveAttribute("aria-checked");
        });
    });

    describe("Disabled", () => {
        it("should not emit onChange when disabled item is clicked", async () => {
            const user = userEvent.setup();
            const spyCall = vi.fn();
            render(
                <EbayMenuButton type="radio" text="Open" onChange={spyCall}>
                    <EbayMenuButtonItem value="first" disabled />
                    <EbayMenuButtonItem value="second" />
                    <EbayMenuButtonItem value="third" />
                </EbayMenuButton>,
            );

            await user.click(screen.getByRole("button", { name: /open/i }));

            const itemFirst = screen.getAllByRole("menuitemradio")[0];
            await user.click(itemFirst);

            expect(spyCall).not.toHaveBeenCalled();

            const itemSecond = screen.getAllByRole("menuitemradio")[1];
            await user.click(itemSecond);

            expect(spyCall).toHaveBeenCalledWith(expect.any(Object), {
                index: 1,
                indexes: [1],
                checked: [1],
                checkedValues: ["second"],
            });
        });

        it("should not expand or call onExpand when button is disabled", async () => {
            const user = userEvent.setup();
            const onExpandSpy = vi.fn();
            render(
                <EbayMenuButton text="Menu" disabled onExpand={onExpandSpy}>
                    <EbayMenuButtonItem value="first" />
                </EbayMenuButton>,
            );
            const button = screen.getByRole("button", { name: /menu/i });
            expect(button).toBeDisabled();
            await user.click(button);
            expect(button).toHaveAttribute("aria-expanded", "false");
            expect(onExpandSpy).not.toHaveBeenCalled();
        });
    });
});
