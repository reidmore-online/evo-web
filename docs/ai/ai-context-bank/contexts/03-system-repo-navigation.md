# System: Repository Navigation

## Purpose
Describes directory structure, component locations, shared utilities organization, base components, test locations, and documentation structure for efficient codebase navigation.

## Monorepo Structure

```
packages/
├── skin/                    # CSS framework (BEM, SCSS)
│   ├── src/sass/           # Component SCSS modules
│   ├── src/svg/            # Icon assets
│   └── dist/               # Compiled CSS (generated)
├── ebayui-core/            # Marko components
│   ├── src/components/     # Component implementations
│   ├── src/common/         # Shared utilities
│   └── dist/               # Built package (generated)
├── ebayui-core-react/      # React components
│   ├── src/ebay-*/         # Component directories
│   ├── src/common/         # React utilities
│   └── dist/               # Built package (generated)
├── evo-marko/              # Documentation site
└── evo-react/              # React documentation site
```

## Component Locations

**Marko components:** `packages/ebayui-core/src/components/ebay-{component}/`
**React components:** `packages/ebayui-core-react/src/ebay-{component}/`
**Skin CSS:** `packages/skin/src/sass/{component}/`

**Component naming:** All components use `ebay-` prefix in file system but NOT in documentation URLs (e.g., `ebay-button` → `/components/button`)

## Base Components (Shared Logic)

**Location:** `packages/ebayui-core/src/components/components/`

**Available base components:**
- `ebay-dialog-base` - Foundation for alert, confirm, lightbox, panel, toast dialogs
- `ebay-notice-base` - Foundation for inline, page, section notices
- `ebay-tooltip-base` - Foundation for tooltip, infotip, tourtip components

**When to use:** Extend base components when creating dialog, notice, or tooltip variants that share core accessibility and interaction patterns.

## Shared Utilities

### Marko Utilities
**Location:** `packages/ebayui-core/src/common/`

**Available modules:**
- `body-scroll` - Prevent body scroll during dialogs
- `dates` - Date formatting and localization
- `dropdown` - Dropdown positioning logic
- `event-utils` - Event emission helpers
- `html-attributes` - Pass-through attribute handling
- `menu-utils` - Menu keyboard navigation
- `transition` - CSS transition utilities
- `test-utils` - Testing helpers

### React Utilities
**Location:** `packages/ebayui-core-react/src/common/`

**Available modules:**
- `component-utils` - Component composition helpers
- `event-utils` - Event handling utilities
- `tooltip-utils` - Tooltip positioning logic
- `floating-label-utils` - Floating label animations

## Test Locations

### Marko Tests
```
src/components/ebay-{component}/test/
├── test.browser.js         # Browser tests (Playwright)
├── test.server.js          # SSR tests (Node)
└── __snapshots__/          # Test snapshots
```

### React Tests
```
src/ebay-{component}/__tests__/
└── *.spec.tsx              # Component tests (jsdom)
```

### Storybook Stories
- **Marko:** `src/components/ebay-{component}/{component}.stories.ts`
- **React:** `src/ebay-{component}/{component}.stories.tsx`

## Documentation Locations

**Component README:** Co-located with component (e.g., `packages/ebayui-core/src/components/ebay-button/README.md`)

**Documentation site pages:**
- Component overview: `packages/evo-marko/src/routes/components/{component}/+page.marko`
- Accessibility: `packages/evo-marko/src/routes/components/{component}/accessibility/+page.marko`
- CSS: `packages/evo-marko/src/routes/components/{component}/css/+page.marko`

**Public URLs:**
- Overview: `https://opensource.ebay.com/evo-web/components/{component}`
- Accessibility: `https://opensource.ebay.com/evo-web/components/{component}/accessibility`
- CSS: `https://opensource.ebay.com/evo-web/components/{component}/css`

## Configuration Files

**Root level:**
- `package.json` - Workspace configuration
- `tsconfig.json` - TypeScript base config
- `.eslintrc*` - Linting rules
- `.stylelintrc` - CSS/SCSS linting
- `vite.config.mjs` - Build configuration

**Package level:** Each package has its own `package.json`, build config, and test setup

## Build Artifacts (Generated, Do Not Edit)

- `dist/` directories - Compiled output
- `node_modules/` - Dependencies
- `_site/` - Built documentation site
- `__snapshots__/` - Test snapshots (update with npm script)

## Non-goals
- Build configuration details (see 05-system-build-deployment.md)
- Component architecture specifics (see ARCHITECTURE.md)
- Testing file structure details (see 01-system-testing-strategy.md)
- Dependency integration patterns (see 04-system-dependency-integration.md)
