import React from "react";
import { screen, render } from "@testing-library/react";
import { composeStories } from "@storybook/react-vite";
import * as stories from "./index.stories";

const { Default, WithCustomConfirmButton } = composeStories(stories);

describe("EbayAlertDialog rendering", () => {
    it("should render the default story correctly", () => {
        render(<Default />);
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
        expect(screen.getByText(/Lorem ipsum dolor sit amet/)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "www.ebay.com" })).toBeInTheDocument();
    });

    it("should render the dialog with custom confirm button", () => {
        render(<WithCustomConfirmButton />);
        const buttonConfirm = screen.getByText("Custom Confirm");
        expect(buttonConfirm).toBeInTheDocument();
        expect(buttonConfirm).toHaveClass("btn--destructive");
    });
});
