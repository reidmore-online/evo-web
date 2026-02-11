# Project Context

## Overview

evo-web is a monorepo containing eBay's design system with three main packages:

- **@ebay/skin** - CSS library providing eBay's design tokens and styles
- **@ebay/ebayui-core** - Marko component library (60+ components)
- **@ebay/ui-core-react** - React component library (60+ components)

All packages share a common design philosophy: progressive enhancement and WCAG 2.2 AA accessibility compliance.

### Testing Philosophy

Tests are organized by interaction type and follow WCAG 2.2 accessibility standards:

- **Click Interactions** - Mouse/touch interactions
- **Keyboard Interactions** - Keyboard navigation (Arrow keys, Enter, Space, Escape, Tab, etc.)
- **Focus Management** - Focus trapping, roving tabindex, active descendant
- **ARIA Attributes** - Proper roles, states, and properties
- **Accessibility Compliance** - WCAG 2.2 Level A and AA using axe-core

#### Marko Component Tests

- Browser tests: `test.browser.js` - Use `@marko/testing-library` with Vitest browser mode (Playwright)
- Server tests: `test.server.js` - Test SSR output
- Accessibility tests: `accessibility.browser.js` - Dedicated accessibility test suites
- Storybook interaction tests: In `{component}.stories.ts` using `play` function

#### React Component Tests

- Unit tests: `__tests__/*.spec.tsx` - Use `@testing-library/react` and Vitest (jsdom)
- Test both simple interactions (single action) and complex interactions (multiple steps)

## Workspace Structure

This is an npm workspaces monorepo with packages in `packages/*`:

- `packages/skin/` - CSS (SCSS) modules using BEM methodology
- `packages/ebayui-core/` - Marko components built on top of Skin
- `packages/ebayui-core-react/` - React components built on top of Skin
- `packages/evo-marko/` - Documentation site (Marko-based)

## Common Commands

### Root Level

```bash
npm install                  # Install dependencies (also runs playwright install)
npm run build                # Build all packages (lint + typecheck + build)
npm run build:ci             # CI build without linting
npm test                     # Run tests in all packages
npm run lint                 # Lint root-level styles
npm start                    # Start dev server for documentation site
npm run deploy               # Build and prepare static site for deployment
npm run change               # Create a changeset for versioning
npm run version              # Update versions based on changesets
npm run release              # Publish all packages
```

### ebayui-core (Marko components)

Location: `packages/ebayui-core/`

```bash
npm test -w packages/ebayui-core                     # Run all tests (headless browser)
npm run test:browser -w packages/ebayui-core         # Run browser tests only
npm run test:server -w packages/ebayui-core          # Run server-side tests only
npm run test:watch -w packages/ebayui-core           # Watch mode
npm run coverage -w packages/ebayui-core             # Run tests with coverage
npm run update-snapshots -w packages/ebayui-core     # Update test snapshots
npm run lint -w packages/ebayui-core                 # Lint JS, LESS, and whitespace
npm run build -w packages/ebayui-core                # Build package
npm run start -w packages/ebayui-core                # Start Storybook on port 6006
npm run build:storybook -w packages/ebayui-core      # Build Storybook
mtc                                                   # Type check Marko files
```

### ebayui-core-react (React components)

Location: `packages/ebayui-core-react/`

```bash
npm test -w packages/ebayui-core-react               # Run all tests
npm run coverage -w packages/ebayui-core-react       # Run tests with coverage
npm run lint -w packages/ebayui-core-react           # Lint TypeScript and check formatting
npm run format -w packages/ebayui-core-react         # Auto-fix linting and formatting
npm run type:check -w packages/ebayui-core-react     # TypeScript type checking
npm run build -w packages/ebayui-core-react          # Build package (includes smoke tests)
npm run start -w packages/ebayui-core-react          # Start Storybook on port 9001
npm run build:storybook -w packages/ebayui-core-react # Build Storybook
npm run smoke-test -w packages/ebayui-core-react     # Run compatibility tests for React 16/18/19
```

### Skin (CSS)

Location: `packages/skin/`

```bash
npm test -w packages/skin                            # Build (build = test for Skin)
npm run build -w packages/skin                       # Build CSS and prepare distribution
npm run lint -w packages/skin                        # Lint SASS, CSS, and JS
npm run storybook -w packages/skin                   # Start Storybook
npm run build:storybook -w packages/skin             # Build Storybook
```

## Architecture & Key Concepts

### Component Structure

#### Marko Components (`packages/ebayui-core/src/components/ebay-{component}/`)

```
ebay-{component}/
├── index.marko              # Main component template
├── component-browser.ts     # Client-side behavior
├── marko-tag.json           # Component metadata and attributes
├── style.ts                 # Style imports
├── README.md                # Component documentation
├── {component}.stories.ts   # Storybook stories (also used for interaction tests)
├── examples/                # Example usage
└── test/
    ├── test.browser.js      # Browser-based unit tests (Vitest + Playwright)
    ├── test.server.js       # Server-side rendering tests
    ├── accessibility.browser.js  # Accessibility-focused tests
    └── __snapshots__/       # Test snapshots
```

#### React Components (`packages/ebayui-core-react/src/ebay-{component}/`)

```
ebay-{component}/
├── index.ts                 # Exports
├── {component}.tsx          # Main component
├── types.ts                 # TypeScript types
├── README.md                # Component documentation
└── __tests__/
    └── *.spec.tsx           # Tests using @testing-library/react
```

### Accessibility Resources

Components are built following:

- [eBay MIND Patterns](https://ebay.gitbooks.io/mindpatterns/content/) - eBay's accessibility patterns
- [WAI-ARIA Authoring Practices](https://w3c.github.io/aria-practices/) - W3C specifications
- Progressive enhancement layers: HTML (Bones) → CSS (Skin) → JS (MakeupJS)

Component documentation includes:

- Component overview: `https://opensource.ebay.com/evo-web/components/{component}`
- Accessibility page: `https://opensource.ebay.com/evo-web/components/{component}/accessibility`
- CSS page: `https://opensource.ebay.com/evo-web/components/{component}/css`

Note: Component names in URLs don't include the `ebay-` prefix (e.g., `ebay-button` → `/components/button`)

### Skin (CSS) Architecture

- Built with SCSS, outputs CSS
- Uses BEM (Block Element Modifier) naming convention
- Design tokens from `@ebay/design-tokens`
- PostCSS for autoprefixing and optimization
- Components in `packages/skin/src/sass/`
- SVG icons in `packages/skin/src/svg/`

### Makeup Libraries

Low-level JavaScript utilities for interactive behaviors (shared across Marko and React):

- `makeup-expander` - Expand/collapse widgets
- `makeup-roving-tabindex` - Keyboard navigation in lists
- `makeup-floating-label` - Floating label animations
- `makeup-keyboard-trap` - Focus trapping for modals
- `makeup-active-descendant` - Active descendant pattern for comboboxes
- `makeup-typeahead` - Typeahead/autocomplete behavior
- And many more in `node_modules/makeup-*`

These provide framework-agnostic accessibility patterns.

### State Management & Events

#### Marko Components

- Components are stateless by default - passing new attributes resets internal state
- To persist state, synchronize it in parent component via event handlers
- Events use Marko syntax: `on-{event}("handlerMethod")`
- Event handlers receive event objects with relevant data

#### React Components

- Standard React patterns with hooks
- Event handlers receive synthetic events or custom event objects
- Props control component behavior

### Pass-Through Attributes

Both Marko and React components support pass-through HTML attributes to the root or most prominent element (typically root or form control).

Marko (static): `<ebay-button id="my-id"/>`
Marko (dynamic): `<ebay-button html-attributes={ id: "my-id" }/>`
React: `<EbayButton id="my-id"/>`

## Development Workflow

### Creating Tests

When creating accessibility tests follow the specifications outlined in `testing.md`.

### Changesets

This repo uses changesets for version management:

- `npm run change` - Create a changeset describing your changes
- Changesets are committed with code changes
- On release, changesets determine version bumps (major/minor/patch)

### Versioning

- Follows strict Semantic Versioning
- MAJOR: Breaking API changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes (backwards compatible)

### Linting & Formatting

- ESLint for JavaScript/TypeScript
- Stylelint for CSS/SCSS
- Prettier for code formatting
- `lint-staged` runs on git commits via Husky
- Conventional commits enforced via commitlint

### Build Tools

- **Vite** - Build tool and dev server for React and testing
- **Marko Vite Plugin** - Marko compilation
- **Storybook** - Component development and documentation
- **Vitest** - Testing framework
  - Browser mode (Playwright) for Marko component tests
  - jsdom environment for React component tests
- **TypeScript** - Type checking for React components
- **Marko Type Check (mtc)** - Type checking for Marko components

### Browser Support

Uses `@ebay/browserslist-config` for browser targets. Components are tested cross-browser.

## Important Notes

- All components have `ebay-` prefix in file system but NOT in documentation URLs
- Skin (v19+) is required for both component libraries
- Marko components require `<lasso-page/>` for proper flag handling
- Global styles required: `@ebay/skin/global` and `@ebay/skin/marketsans`
- Marko v5.31.12+ required for ebayui-core
- React 19 supported (16.8+ in maintenance mode) for ebayui-core-react
- Some components (charts, 3d-viewer) require HighCharts® license for commercial use

## Package Publishing

All packages publish to npm:

- `@ebay/skin` → dist files from build process
- `@ebay/ebayui-core` → dist files, marko.json, browser.json
- `@ebay/ui-core-react` → dist files (builds to dist/ directory before publishing)

React package has special build targets for tree-shaking with individual component imports.
