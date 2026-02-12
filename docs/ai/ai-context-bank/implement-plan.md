# AI Context Bank Implementation Plan

## SECTION 1: Assessment

### System Purpose
evo-web is eBay's design system monorepo containing three CSS/component libraries that share a common design philosophy: progressive enhancement and WCAG 2.2 AA accessibility compliance. The system provides 60+ UI components available in both Marko and React frameworks, built on top of a shared CSS foundation (Skin).

### Main Components/Modules

**Core Packages:**
- `@ebay/skin` (packages/skin/) - CSS framework with BEM methodology, SCSS modules, design tokens from @ebay/design-tokens
- `@ebay/ebayui-core` (packages/ebayui-core/) - Marko component library (92 components, ~1800 .marko files)
- `@ebay/ui-core-react` (packages/ebayui-core-react/) - React component library (83 components, ~1600 TS/TSX files)
- `packages/evo-marko/` - Documentation site (Marko-based)

**Shared Architecture:**
- Common CSS layer (Skin) used by both component libraries
- Makeup libraries (makeup-*) provide framework-agnostic accessibility patterns
- Shared design tokens and SVG icons
- Progressive enhancement: HTML (Bones) → CSS (Skin) → JS (MakeupJS)

### Hot Paths / Complexity Hotspots

**Component Development:**
- Marko components: 7-8 files per component (index.marko, component-browser.ts, marko-tag.json, style.ts, stories, tests)
- React components: 5-6 files per component (.tsx, types.ts, index.ts, tests, stories)
- Base/shared components in `packages/ebayui-core/src/components/components/` (ebay-dialog-base, ebay-notice-base, ebay-tooltip-base)

**Common Utilities:**
- `packages/ebayui-core/src/common/` - 17+ utility modules (event-utils, menu-utils, dropdown, dates, html-attributes, transition)
- `packages/ebayui-core-react/src/common/` - 10+ utility modules (component-utils, event-utils, tooltip-utils, floating-label-utils)

**Testing Infrastructure:**
- Marko: Vitest browser mode with Playwright for browser tests, Node environment for SSR tests
- React: Vitest with jsdom, @testing-library/react
- Storybook for both: interaction tests via play functions, visual regression with Percy

**Build Complexity:**
- Multi-stage builds: lint → typecheck → test → build
- Marko type checking via mtc
- React smoke tests for React 16/18/19 compatibility
- CSS compilation: SCSS → PostCSS → autoprefixing

### Testing Reality Today

**Marko Components:**
- Browser tests: `test.browser.js` using @marko/testing-library + Vitest browser mode (Playwright)
- Server tests: `test.server.js` for SSR validation
- Story-based tests: Storybook stories via composeStories, interaction tests in play functions
- Pattern: Given/When/Then with nested beforeEach blocks
- Coverage tracking enabled in CI

**React Components:**
- Unit tests: `__tests__/*.spec.tsx` using @testing-library/react + Vitest (jsdom)
- Story-based tests: Storybook stories via composeStory
- Pattern: Organized by component stories, ref testing, event callback testing
- Smoke tests: Cross-version React compatibility testing

**Shared Testing Patterns:**
- Test organization: Click Interactions, Keyboard Interactions, Focus Management, ARIA Attributes, Accessibility Compliance
- Accessibility testing: axe-core integration expected (per WCAG 2.2 requirements)
- Snapshot testing for visual regression
- Event testing: Custom event objects with originalEvent property

**Notable Gap:**
- No dedicated `accessibility.browser.js` files found in current components (mentioned in CLAUDE.md but not present)

### Integrations List

**External Dependencies:**
- **Design Tokens**: @ebay/design-tokens (v2+) for colors, spacing, typography
- **Makeup Libraries** (14+ packages): makeup-roving-tabindex, makeup-expander, makeup-keyboard-trap, makeup-active-descendant, makeup-typeahead, makeup-floating-label, makeup-focusables, makeup-key-emitter, makeup-prevent-scroll-keys, makeup-screenreader-trap
- **Build Tools**: Vite (build + dev), @marko/vite (Marko compilation), @vitejs/plugin-react
- **Testing**: Vitest, @vitest/browser (Playwright), @testing-library/react, @marko/testing-library
- **Storybook**: @storybook/marko-vite, @storybook/react-vite, interaction testing
- **Type Checking**: @marko/type-check (mtc), TypeScript
- **Floating UI**: @floating-ui/dom (Marko), @floating-ui/react (React) for tooltips/popovers
- **CSS**: PostCSS, autoprefixer, clean-css
- **Visual Regression**: Percy.io for screenshot comparison
- **Accessibility**: eBay MIND Patterns, WAI-ARIA Authoring Practices
- **Third-party**: HighCharts (for chart components - requires license), @google/model-viewer, shaka-player

**CI/CD:**
- GitHub Actions: ci.yml (build, test, deploy), percy.yml (visual regression)
- Changesets for version management and publishing
- Codecov for coverage tracking
- GitHub Pages for documentation deployment

**Development:**
- Husky for git hooks
- lint-staged for pre-commit checks
- commitlint with conventional commits
- Prettier for code formatting
- ESLint + Stylelint

### Recommended Contexts

**System Contexts (6 files):**
1. **00-system-coding-standards.md** - BEM methodology, semantic HTML, component structure patterns, pass-through attributes, state management (Marko vs React)
2. **01-system-testing-strategy.md** - Dual testing setup (Marko browser+server, React jsdom), story-based testing, accessibility testing requirements, test organization patterns
3. **02-system-error-handling-logging.md** - Event patterns (custom event objects), error boundaries, console logging conventions
4. **03-system-repo-navigation.md** - Monorepo structure, package organization, component file structure, shared utilities location, base components
5. **04-system-dependency-integration.md** - Makeup libraries usage, Skin CSS integration, design tokens, Floating UI patterns, Storybook integration
6. **05-system-build-deployment.md** - Build workflows (lint→typecheck→test→build), Vite configuration, CSS compilation, changesets, CI/CD pipeline

**Domain Contexts (3 files):**
1. **00-domain-accessibility-patterns.md** - WCAG 2.2 AA compliance, progressive enhancement layers, MIND patterns, ARIA usage, keyboard navigation, focus management, roving tabindex patterns
2. **01-domain-component-lifecycle.md** - Marko component lifecycle (stateless by default, event-driven state sync), React hooks patterns, client-side hydration, SSR considerations
3. **02-domain-theming-styling.md** - BEM naming conventions, CSS variable usage, RTL support, dark mode, responsive breakpoints, Skin layer integration, design token application

### Risks: What Could Go Wrong

**If Context Bank is Wrong:**
1. **Accessibility violations** - Incorrect ARIA patterns, broken keyboard navigation, missing focus management
2. **Breaking changes** - Not understanding stateless Marko components, improper event handling
3. **Framework confusion** - Mixing Marko and React patterns, incorrect Makeup library usage
4. **CSS conflicts** - BEM violations, specificity issues, breaking Skin integration
5. **Testing gaps** - Missing browser vs server tests, incorrect test organization, no accessibility tests
6. **Build failures** - Wrong build order, missing type checks, CSS not regenerated
7. **Dependency misuse** - Incorrect Makeup library patterns, Floating UI integration errors
8. **Versioning errors** - Missing changesets, wrong semver bumps, breaking API changes

## SECTION 2: File Plan

```
docs/ai/ai-context-bank/
├── README.md
├── PROMPT-TEMPLATES.md
├── ARCHITECTURE.md
└── contexts/
    ├── 00-system-coding-standards.md
    ├── 01-system-testing-strategy.md
    ├── 02-system-error-handling-logging.md
    ├── 03-system-repo-navigation.md
    ├── 04-system-dependency-integration.md
    ├── 05-system-build-deployment.md
    ├── 00-domain-accessibility-patterns.md
    ├── 01-domain-component-lifecycle.md
    └── 02-domain-theming-styling.md
```

**Total: 9 context files** (1 ARCHITECTURE + 6 system + 3 domain, within the 9-file limit)

## IMPLEMENTATION ROADMAP

### Step 1: Create ARCHITECTURE.md
**Information Needed:**
- Monorepo package structure and boundaries
- Component data flow (props → events → state)
- Build and deployment flow
- Skin CSS → Marko/React integration
- Where new components should go

**Files to Review:**
- `/packages/*/README.md` - Package overviews
- `/packages/ebayui-core/src/components/ebay-button/` - Example component structure
- `/packages/ebayui-core-react/src/ebay-button/` - React component structure
- `/packages/skin/src/sass/button/` - CSS module structure
- `/package.json` - Workspace configuration, build scripts
- `/.github/workflows/ci.yml` - CI/CD pipeline

**Patterns Discovered:**
- Three-layer architecture: Skin (CSS) → Component libraries (Marko/React) → Documentation
- Components are stateless by default in Marko, state managed via events
- Pass-through attributes to root/prominent element
- Base components in `components/components/` for shared dialog/notice/tooltip patterns
- Common utilities in `src/common/` directories

**Validation Checkpoint:**
- Verify component file structure matches documented patterns
- Confirm build order: skin → ebayui-core → ebayui-core-react → evo-marko
- Check that data flow diagram covers SSR and client-side hydration

### Step 2: Create 00-system-coding-standards.md
**Information Needed:**
- BEM naming conventions and usage
- Semantic HTML requirements
- Component API patterns (attributes, events)
- TypeScript/type checking requirements
- Code organization patterns

**Files to Review:**
- `/packages/skin/STYLEGUIDE.md` - BEM and CSS standards
- `/.github/copilot-instructions.md` - Code quality checklist
- `/packages/ebayui-core/src/components/ebay-button/index.marko` - Marko patterns
- `/packages/ebayui-core-react/src/ebay-button/button.tsx` - React patterns
- `/packages/ebayui-core/src/components/ebay-button/marko-tag.json` - Attribute definitions
- `/packages/ebayui-core-react/src/ebay-button/types.ts` - TypeScript types

**Patterns Discovered:**
- BEM double-dash for modifiers (btn--primary), double-underscore for nested (btn__cell)
- Semantic HTML5 elements preferred over ARIA
- Pass-through via html-attributes (Marko) or spread props (React)
- Event naming: on-{event} (Marko), on{Event} (React)
- Custom event objects with originalEvent property
- TypeScript required for React, mtc type checking for Marko

**Validation Checkpoint:**
- Compare against actual component implementations
- Verify event patterns match existing components
- Check BEM examples against Skin CSS files

### Step 3: Create 01-system-testing-strategy.md
**Information Needed:**
- Vitest browser mode configuration
- Test organization patterns (Given/When/Then)
- Story-based testing with composeStories
- Accessibility testing approach
- Coverage requirements

**Files to Review:**
- `/packages/ebayui-core/vite.config.mjs` - Vitest browser configuration
- `/packages/ebayui-core/src/components/ebay-button/test/test.browser.js` - Browser test patterns
- `/packages/ebayui-core/src/components/ebay-menu/test/test.browser.js` - Complex interaction tests
- `/packages/ebayui-core-react/src/ebay-button/__tests__/index.spec.tsx` - React test patterns
- `/packages/ebayui-core/src/components/ebay-button/button.stories.ts` - Storybook interaction tests
- `/.github/workflows/ci.yml` - CI test execution

**Patterns Discovered:**
- Two test modes for Marko: browser (Playwright) + server (Node)
- Given/When/Then with nested beforeEach blocks
- composeStories for importing Storybook stories as test fixtures
- @marko/testing-library for Marko, @testing-library/react for React
- Test organization by interaction type (Click, Keyboard, Focus, ARIA)
- Coverage enabled in CI, excluded: examples, stories, snapshots

**Validation Checkpoint:**
- Run existing tests to verify patterns work
- Check that test organization matches documented structure
- Verify Storybook integration with interaction tests

### Step 4: Create 02-system-error-handling-logging.md
**Information Needed:**
- Event error handling patterns
- Console logging conventions
- Error boundary usage (React)
- Event propagation patterns

**Files to Review:**
- `/packages/ebayui-core/src/common/event-utils/index.ts` - Event utilities
- `/packages/ebayui-core-react/src/common/event-utils/` - React event utilities
- `/packages/ebayui-core/src/components/ebay-menu/component.ts` - Event emission patterns
- Component implementations with error handling

**Patterns Discovered:**
- Custom event objects: { originalEvent, el, index, checked, checkedIndex }
- Event utility functions for standardization
- onConsoleLog: () => true in vite.config (allows console in tests)

**Validation Checkpoint:**
- Verify event object structure matches across components
- Check error handling in complex components (dialogs, menus)

### Step 5: Create 03-system-repo-navigation.md
**Information Needed:**
- Directory structure and organization
- Where to find components, utilities, tests
- Base/shared component location
- Documentation location

**Files to Review:**
- Directory listings from exploration
- `/packages/ebayui-core/src/components/components/` - Base components
- `/packages/ebayui-core/src/common/` - Common utilities
- `/packages/ebayui-core-react/src/common/` - React utilities

**Patterns Discovered:**
- Components: packages/{library}/src/components/ebay-{name}/
- Base components: packages/ebayui-core/src/components/components/
- Utilities: packages/{library}/src/common/
- Tests: src/components/ebay-{name}/test/ or __tests__/
- Stories: Co-located with components
- Documentation: packages/evo-marko/ (site), component README.md files

**Validation Checkpoint:**
- Navigate to 5+ components to verify structure consistency
- Locate utilities and verify organization

### Step 6: Create 04-system-dependency-integration.md
**Information Needed:**
- Makeup library usage patterns
- Floating UI integration
- Skin CSS import patterns
- Design token usage
- Storybook configuration

**Files to Review:**
- `/packages/ebayui-core/package.json` - Makeup dependencies
- `/packages/ebayui-core-react/package.json` - React dependencies
- `/packages/ebayui-core/src/components/ebay-menu/component.ts` - Makeup roving-tabindex usage
- `/packages/ebayui-core/src/components/ebay-combobox/component.ts` - Makeup typeahead usage
- Component style.ts files - Skin imports
- Storybook configuration files

**Patterns Discovered:**
- 14+ Makeup libraries for accessibility patterns
- Floating UI for tooltip/popover positioning
- Style imports: import "@ebay/skin/button" (Marko), CSS in dist (React)
- Design tokens via @ebay/design-tokens
- Storybook: @storybook/marko-vite, @storybook/react-vite

**Validation Checkpoint:**
- Verify Makeup library usage in 3+ components
- Check Floating UI integration in tooltip/infotip/tourtip
- Confirm Skin import patterns

### Step 7: Create 05-system-build-deployment.md
**Information Needed:**
- Build script order and dependencies
- Vite configuration
- CSS compilation process
- Changeset workflow
- CI/CD pipeline

**Files to Review:**
- `/package.json` - Root build scripts
- `/packages/ebayui-core/package.json` - Marko build scripts
- `/packages/ebayui-core-react/package.json` - React build scripts
- `/packages/skin/package.json` - CSS build scripts
- `/.github/workflows/ci.yml` - CI pipeline
- `/.changeset/README.md` - Changeset documentation

**Patterns Discovered:**
- Build order: lint → mtc/typecheck → test → build
- Skin builds first (CSS foundation)
- React includes smoke tests for v16/18/19
- Changesets for versioning: npm run change → merge PR
- CI: build → coverage → deploy (main only) → release (changesets)

**Validation Checkpoint:**
- Run build scripts to verify order
- Check changeset workflow documentation
- Verify CI pipeline stages

### Step 8: Create 00-domain-accessibility-patterns.md
**Information Needed:**
- WCAG 2.2 AA requirements
- eBay MIND patterns
- Progressive enhancement approach
- ARIA usage guidelines
- Keyboard navigation patterns
- Roving tabindex implementation

**Files to Review:**
- External: https://ebay.gitbooks.io/mindpatterns/content/
- External: https://w3c.github.io/aria-practices/
- External: https://opensource.ebay.com/evo-web/components/{component}/accessibility
- `/packages/skin/STYLEGUIDE.md` - Accessibility safeguards
- `/.github/copilot-instructions.md` - Accessibility checklist
- Component implementations with complex keyboard navigation (menu, tabs, carousel)

**Patterns Discovered:**
- Three layers: HTML (Bones) → CSS (Skin) → JS (MakeupJS)
- ARIA for styling hooks (accepted specificity trade-off)
- Roving tabindex via makeup-roving-tabindex
- Active descendant via makeup-active-descendant
- Keyboard trap via makeup-keyboard-trap
- Focus management critical for dialios, menus, tooltips

**Validation Checkpoint:**
- Review 3+ complex components for accessibility patterns
- Verify ARIA usage matches MIND patterns
- Check keyboard navigation implementations

### Step 9: Create 01-domain-component-lifecycle.md
**Information Needed:**
- Marko component lifecycle and state management
- React hooks patterns
- SSR considerations
- Client-side hydration
- Event-driven state synchronization

**Files to Review:**
- `/packages/ebayui-core/README.md` - Stateless component explanation
- `/packages/ebayui-core/src/components/ebay-lightbox-dialog/` - State sync example
- React component implementations with hooks
- Component-browser.ts files for client-side behavior

**Patterns Discovered:**
- Marko: Stateless by default, passing new attributes resets state
- State persistence: Synchronize via event handlers in parent
- Events: on-{event} handlers receive event objects
- React: Standard hooks patterns
- Client-side hydration: component-browser.ts for Marko components

**Validation Checkpoint:**
- Verify state sync patterns in dialog components
- Check client-side behavior implementation
- Confirm SSR + hydration flow

### Step 10: Create 02-domain-theming-styling.md
**Information Needed:**
- BEM methodology details
- CSS variable usage
- RTL support patterns
- Dark mode support
- Responsive breakpoints
- Design token application

**Files to Review:**
- `/packages/skin/STYLEGUIDE.md` - BEM guidelines
- Skin SCSS files for CSS variable usage
- Component styles for RTL support
- `/.github/copilot-instructions.md` - Responsive breakpoints (320px, 512px, 768px, 1024px, 1280px, 1440px, 1680px, 1920px)
- Design token usage examples

**Patterns Discovered:**
- BEM: block--modifier, block__element
- CSS variables for colors, spacing, typography
- RTL via CSS logical properties or [dir="rtl"] selectors
- Dark mode support required
- 8 responsive breakpoints defined

**Validation Checkpoint:**
- Review Skin CSS for BEM compliance
- Check RTL implementation in 2+ components
- Verify design token usage

### Step 11: Create README.md
**Information Needed:**
- Context selection guidance
- Ownership map
- Usage instructions
- Contribution guidelines

**Validation Checkpoint:**
- Ensure ownership map matches actual context files
- Verify selection guidance is clear

### Step 12: Create PROMPT-TEMPLATES.md
**Information Needed:**
- Common task types
- Required context files per task
- Template structure (ROLE → CONTEXT → REQUIREMENT → INSTRUCTIONS)

**Task Types:**
- Feature development (new component)
- Bug fix
- Refactor
- Add tests
- Code review

**Validation Checkpoint:**
- Test templates with example scenarios
- Ensure context file references are accurate

### Step 13: Deduplication Review
**Activities:**
- Review all context files for overlapping content
- Identify canonical owners
- Create rewrite rules
- Final validation pass

**Validation Checkpoint:**
- No concept appears in multiple files
- All cross-references use file paths
- Non-goals sections are complete

## Timeline Estimate
- Steps 1-7 (System contexts): 3-4 hours
- Steps 8-10 (Domain contexts): 2-3 hours
- Steps 11-13 (Meta files + review): 1-2 hours
- **Total: 6-9 hours** for complete implementation

## Dependencies
- ARCHITECTURE.md must be created first (referenced by all others)
- System contexts can be created in parallel
- Domain contexts should follow system contexts
- README and PROMPT-TEMPLATES last

---

## Critical Files for Implementation

1. **/packages/ebayui-core/src/components/ebay-button/** - Reference component demonstrating all Marko patterns (template, client-side behavior, tests, stories, type definitions)

2. **/packages/ebayui-core-react/src/ebay-button/** - Reference component demonstrating all React patterns (TypeScript types, hooks, tests, stories, component composition)

3. **/packages/ebayui-core/src/components/ebay-menu/component.ts** - Complex component showing Makeup library integration (roving-tabindex, typeahead, keyboard navigation)

4. **/.github/copilot-instructions.md** - Code quality checklist, PR requirements, accessibility standards, package-specific guidelines

5. **/packages/skin/STYLEGUIDE.md** - BEM methodology, CSS standards, accessibility safeguards, HTML/ARIA usage guidelines
