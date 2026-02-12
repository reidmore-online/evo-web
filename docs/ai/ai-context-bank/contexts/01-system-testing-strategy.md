# System: Testing Strategy

## Purpose
Describes the dual testing infrastructure (Marko browser+server, React jsdom), test organization patterns, story-based testing, accessibility testing requirements, and coverage tracking.

## Testing Infrastructure

### Marko Components (Vitest Browser Mode + Playwright)

**Two test environments:**
1. **Browser tests** (`test.browser.js`): Vitest browser mode with Playwright for DOM interactions
2. **Server tests** (`test.server.js`): Node environment for SSR validation

**Configuration:** `packages/ebayui-core/vite.config.mjs`
```javascript
test: {
  projects: [
    { name: "browser", browser: { provider: playwright() } },
    { name: "server", environment: "node" }
  ]
}
```

**Testing library:** `@marko/testing-library` for DOM queries and user interactions

### React Components (Vitest + jsdom)

**Environment:** jsdom for lightweight DOM simulation
**Testing library:** `@testing-library/react` for component rendering and interactions
**Additional:** Smoke tests for React 16/18/19 compatibility

## Test Organization Pattern

**Organize by interaction type:**
- Click Interactions
- Keyboard Interactions
- Focus Management
- ARIA Attributes
- Accessibility Compliance

**Given/When/Then with nested beforeEach:**
```javascript
describe('Click Interactions', () => {
  describe('Given button is enabled', () => {
    let component;
    beforeEach(async () => {
      component = await render('<ebay-button>Click me</ebay-button>');
    });

    describe('When user clicks button', () => {
      beforeEach(async () => {
        await component.getByRole('button').click();
      });

      it('Then emits click event', () => {
        expect(eventSpy).toHaveBeenCalledWith({ originalEvent: expect.any(Event) });
      });
    });
  });
});
```

## Story-Based Testing

**Storybook integration:** Import stories as test fixtures via `composeStories` (Marko) or `composeStory` (React)

**Marko example:**
```javascript
import * as stories from '../button.stories';
const { Primary } = composeStories(stories);

it('renders primary variant', async () => {
  await render(Primary);
  expect(screen.getByRole('button')).toHaveClass('btn--primary');
});
```

**Interaction tests:** Define in `{component}.stories.ts` using `play` function for visual regression and interaction testing

## Accessibility Testing

**Required:** WCAG 2.2 Level A and AA compliance
**Tool:** axe-core integration expected (via @storybook/addon-a11y or @testing-library/jest-dom)

**Test categories:**
- Keyboard navigation (Arrow keys, Enter, Space, Escape, Tab)
- Focus management (initial focus, focus trapping, roving tabindex)
- ARIA attributes (roles, states, properties)
- Screen reader compatibility

**Both enabled and disabled states must be tested.**

## Coverage Requirements

**Enabled in CI:** Coverage tracking via Codecov
**Excluded from coverage:**
- `src/**/examples`
- `src/**/*.stories.ts`
- `src/**/__snapshots__`
- `src/components/ebay-icon/icons/`

**Reporters:** json-summary, html, cobertura, lcov

## Snapshot Testing

**Purpose:** Visual regression and HTML structure validation
**Update command:** `npm run update-snapshots -w packages/ebayui-core`

## Running Tests

**Marko:**
```bash
npm test -w packages/ebayui-core                     # All tests
npm run test:browser -w packages/ebayui-core         # Browser only
npm run test:server -w packages/ebayui-core          # Server only
npm run test:watch -w packages/ebayui-core           # Watch mode
npm run coverage -w packages/ebayui-core             # With coverage
```

**React:**
```bash
npm test -w packages/ebayui-core-react               # All tests
npm run coverage -w packages/ebayui-core-react       # With coverage
npm run smoke-test -w packages/ebayui-core-react     # React version compatibility
```

## Non-goals
- Specific component test implementations (see component test files)
- Accessibility pattern details (see 00-domain-accessibility-patterns.md)
- Error handling patterns (see 02-system-error-handling-logging.md)
- Build and CI configuration (see 05-system-build-deployment.md)
