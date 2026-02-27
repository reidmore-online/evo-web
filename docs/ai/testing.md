# Testing

## Instructions

You are a QA tester writing comprehensive unit and end to end tests for the evo-web ebayui-core and ebayui-core-react component libraries that cover all documented interactions, accessibility requirements, and component behaviours. There are multiple packages within the project, each with their own set of components.

These tests will use testing-library and Storybook Interactions. The accessibility standard for testing is WCAG 2.2 levels A and AA. All components have the prefix `ebay-` in the file system, but do not use this prefix when looking up the component in URLs, for example, ebay-button documentation is found at https://opensource.ebay.com/evo-web/components/button.

## Documentation

All components in the library are documented, when writing a test for a component, review the following resources to determine what tests to create:

- Component overview page: https://opensource.ebay.com/evo-web/components/{component}
- Component accessibility page: https://opensource.ebay.com/evo-web/components/{component}/accessibility
- Component CSS page: https://opensource.ebay.com/evo-web/components/{component}/css
- Component tests:
  - Location for ebayui-core: `src/components/{component}/test/test.*.js`
  - Location for ebayui-core-react: `src/{component}/__tests__/*.spec.tsx`

## Project Structure

/packages
    /ebayui-core
        /src
            /components
                /ebay-{component}
                    /test
    /ebayui-core-react
        /src
            /ebay-{component}
                /**tests**
/src
    /storybook-tests

## Tests

Determine supported interactions by reading the component's accessibility documentation page before writing any tests. Each component should have the following types of tests and should be grouped in these types:

- Click Interactions
- Keyboard Interactions
- Focus Management
- ARIA Attributes

Tests should include the disabled state of a component if one is present.

Two types of tests should be created for each component: unit and end to end tests. Unit tests should be created for simple interaction tests, end to end tests should be created for more complex interactions. A simple interaction test is one that tests a single action and the result of that action, such as a click or keyboard button press and the event it fires. A complex interaction test would require multiple steps or interactions to be tested, such as opening a dialog and confirming where focus lands.

An example of a simple interaction test would be:

```
describe("when Space key is pressed", () => {
    beforeEach(async () => {
        const checkbox = component.getByRole("checkbox");
        checkbox.focus();
        await userEvent.keyboard(" ");
    });

    it("then it toggles to checked state", () => {
        expect(component.getByRole("checkbox")).toBeChecked();
    });

    it("then it emits change event", () => {
        const changeEvents = component.emitted("change");
        expect(changeEvents).has.length(1);

        const [[changeEvent]] = changeEvents;
        expect(changeEvent).has.property("checked", true);
    });
});
```

An example of a complex interaction test would be:

```
describe("given disabled checkbox is initially checked", () => {
    beforeEach(async () => {
        component = await render(Disabled, {
            checked: true,
        });
    });

    it("then it renders in checked state", () => {
        expect(component.getByRole("checkbox")).has.property("checked", true);
    });

    describe("when checkbox is clicked", () => {
        beforeEach(async () => {
            await fireEvent.click(component.getByRole("checkbox"));
        });

        it("then it remains checked", () => {
            expect(component.getByRole("checkbox")).has.property("checked", true);
        });

        it("then it does not emit change event", () => {
            expect(component.emitted("change")).has.length(0);
        });
    });
});
```

New unit test files will be created in the `/src/components/{component}/test/` folder with the name `accessibility.browser.js`. Do not duplicate any of the existing unit tests in the other `test.*.js` files.

New end to end test files will be created as part of the component storybook file (`/src/components/{component}/{component}.stories.ts`) using the `play` function documented here: https://storybook.js.org/docs/writing-tests/interaction-testing

### Creating tests

Analysis: 1. Review component documentation first (overview, accessibility, CSS pages). 2. Determine which framework you are working in, Marko or React, by checking the file extension and directory path. 3. Check existing test files in the directory to avoid duplication: - For `ebayui-core`: `src/{component}/test/test.browser.js` and `{component}/test/test.server.js` - For `ebayui-core-react`: `src/{component}/__tests__/index.spec.tsx`, `{component}/__tests__/index.stories.tsx`, `{component}/__tests__/render.spec.tsx` 4. Create a test plan for the component that outlines the different tests that need to be written and ask for clarification if there are questions. Separate test plans by unit tests and interaction tests. - For interaction tests, if there are repeated tests for different component variants, plan to create a shared test file that can be referenced by all variants.

Generation: 1. Once the test plan is approved, generate the unit tests according to plan for each framework: - For Marko: Create `accessibility.browser.js` in `packages/ebayui-core/src/components/{component}/test/` - For React: Create tests in `packages/ebayui-core-react/src/{component}/__tests__/accessibility.spec.tsx` 2. Once the unit tests are created, move on to the interaction tests for each framework: - For shared tests: Create a new `src/storybook-tests/{component}-interactions.ts` file containing the tests. - For Marko: Add interaction tests to the `packages/ebayui-core/src/components/{component}/{component}.stories.ts` file - For React: Add interaction tests to the `packages/ebayui-core-react/src/{component}/__tests__/index.stories.tsx` file 2. Organize tests by type (Click, Keyboard, Focus, ARIA). 3. Test both enabled and disabled states. 4. Use `beforeEach` blocks for nested test setup (given/when/then pattern). 5. Use `@testing-library/user-event`'s `userEvent` library over `pressKey` for keyboard tests.

### Test constraints

- Do not create duplicate tests for the same component in the same framework.
- Do not create tests for ARIA properties or accessibility interactions that are not documented.

### Test examples

#### Keyboard test

Unit test:

```
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
```

Interaction test:

```
Default.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("button");

    await step("Test keyboard interaction - Enter key", async () => {
        button.focus();
        await userEvent.keyboard("{Enter}");
        await expect(button).toHaveFocus();
    });
};
```

#### Focus test

Unit test:

```
        describe("when button receives focus", () => {
            beforeEach(async () => {
                const button = component.getByRole("button");
                button.focus();
            });

            it("then button has focus", () => {
                const button = component.getByRole("button");
                expect(document.activeElement).toBe(button);
            });

            it("then it emits focus event", () => {
                const focusEvents = component.emitted("focus");
                expect(focusEvents).has.length(1);

                const [[focusEvent]] = focusEvents;
                expect(focusEvent)
                    .has.property("originalEvent")
                    .is.an.instanceOf(Event);
            });
        });
```

Interaction test:

```
Default.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("button");
    await step("Test focus management", async () => {
        await userEvent.click(button);
        await expect(button).toHaveFocus();

        await userEvent.keyboard("{Tab}");
        await expect(button).not.toHaveFocus();
    });
};
```

#### ARIA test

Unit test:

```
describe("given a standard button", () => {
        beforeEach(async () => {
            component = await render(template, {
                renderBody: "Standard button",
            });
        });

        it("then it has correct role", () => {
            const button = component.getByRole("button");
            expect(button).toBeTruthy();
        });
};
```

Interaction test:

```
LoadingState.play = async ({ canvasElement, step }: { canvasElement: HTMLElement; step: any }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("button");

    await step("Verify loading state and aria-label", async () => {
        await expect(button).toHaveAttribute("aria-label", "Loading, please wait");

        const spinner = button.querySelector(".progress-spinner");
        await expect(spinner).toBeInTheDocument();
    });

    await step("Test button is still interactive in loading state", async () => {
        button.focus();
        await expect(button).toHaveFocus();
    });
};
```

## File and locator naming

The `ebayui` project has some naming quirks, so the base component page may not be `default`, check the `/src/components/{component}.stories.ts` file for each component when creating the test to determine the best name for each locator.
