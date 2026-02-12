# System: Build & Deployment

## Purpose
Describes build script order, Vite configuration, CSS compilation process, changeset workflow, CI/CD pipeline, and package publishing.

## Build Script Order

**Critical sequence:** `lint → typecheck → test → build`

**Root level build:**
```bash
npm run build
# Runs: lint && mtc && build (skin → ebayui-core → evo-marko → ebayui-core-react)
```

**Package build order:**
1. **Skin** - CSS foundation must build first (SCSS → PostCSS → CSS)
2. **ebayui-core** - Marko components depend on Skin CSS
3. **ebayui-core-react** - React components depend on Skin CSS
4. **evo-marko** - Documentation site depends on all packages

## Type Checking

**Marko:** `mtc` (Marko Type Check) validates Marko templates
**React:** TypeScript type checking via `tsc --noEmit`
**Required:** Both must pass before build proceeds

## CSS Compilation (Skin)

**Pipeline:** SCSS → PostCSS → Autoprefixer → Clean-CSS → dist/

**Commands:**
```bash
npm run build -w packages/skin        # Full build
npm run lint -w packages/skin         # Lint SASS, CSS, JS
```

**Output:** `packages/skin/dist/` contains compiled CSS modules

**Important:** All CSS changes require regenerating dist files

## Vite Configuration

**Marko (vite.config.mjs):**
- Browser tests: Vitest browser mode with Playwright
- Server tests: Node environment for SSR
- Coverage: Enabled in CI, excluded: examples, stories, snapshots

**React (vite.config.ts):**
- Test environment: jsdom
- Build targets: Multiple for tree-shaking support
- Smoke tests: React 16/18/19 compatibility

## Changeset Workflow

**1. Create changeset:**
```bash
npm run change
# Interactive CLI prompts for version bump type and description
```

**2. Changeset types:**
- **major** - Breaking API changes
- **minor** - New features (backwards compatible)
- **patch** - Bug fixes (backwards compatible)

**3. Commit changeset:** Include `.changeset/*.md` file in PR

**4. Versioning (automated on main):**
```bash
npm run version
# Updates package.json versions and CHANGELOG.md
```

**5. Publishing (automated):**
```bash
npm run release
# Publishes to npm registry
```

## CI/CD Pipeline (.github/workflows/ci.yml)

### Build Job
**Runs on:** All PRs and pushes to main
**Steps:**
1. Checkout code
2. Setup Node.js 24
3. Install dependencies (`npm ci`)
4. Run build (`npm run build:ci`)
5. Upload coverage to Codecov
6. Check for uncommitted changes (fail if dist files not regenerated)

### Deploy Job
**Runs on:** Pushes to main only
**Steps:**
1. Install dependencies
2. Run `npm run deploy` (builds documentation site)
3. Upload artifact to GitHub Pages
4. Deploy to `https://opensource.ebay.com/evo-web/`

### Release Job
**Runs on:** Pushes to main (eBay org only)
**Steps:**
1. Install dependencies
2. Run `changesets/action`
3. Create release PR or publish packages
4. Update version numbers and CHANGELOG

## Package Publishing

**Skin:** Publishes `dist/` CSS files, SCSS sources
**ebayui-core:** Publishes `dist/`, `marko.json`, `browser.json`
**ebayui-core-react:** Publishes `dist/` with individual component builds for tree-shaking

**npm scripts:**
```bash
npm run release -w packages/skin
npm run release -w packages/ebayui-core
npm run release -w packages/ebayui-core-react
```

## Linting & Formatting

**Pre-commit hooks (Husky + lint-staged):**
- Prettier formatting for JS, CSS, MD, JSON
- Stylelint for CSS/SCSS
- Conventional commit message validation (commitlint)

**Manual commands:**
```bash
npm run lint                           # Root level CSS lint
npm run lint -w packages/ebayui-core   # JS, LESS, whitespace
npm run lint -w packages/ebayui-core-react  # TypeScript, formatting
```

## Storybook Build

**Marko:**
```bash
npm run build:storybook -w packages/ebayui-core
# Output: packages/ebayui-core/_site/
```

**React:**
```bash
npm run build:storybook -w packages/ebayui-core-react
# Output: packages/ebayui-core-react/_site/
```

**Integration:** Built Storybook sites copied to `_site/public/` during deployment

## Documentation Deployment

**Command:** `npm run deploy`
**Build tool:** `marko-run build` with static adapter
**Output:** `_site/public/` directory
**Hosting:** GitHub Pages

## Smoke Tests (React)

**Purpose:** Ensure React 16/18/19 compatibility
**Command:** `npm run smoke-test -w packages/ebayui-core-react`
**Run during:** `npm run build` in ebayui-core-react

## Non-goals
- Vite plugin configuration details (see package-specific vite.config files)
- Testing strategy specifics (see 01-system-testing-strategy.md)
- Repository navigation (see 03-system-repo-navigation.md)
- Dependency versions (see package.json files)
