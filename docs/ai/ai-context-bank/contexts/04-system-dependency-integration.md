# System: Dependency Integration

## Purpose
Describes integration patterns for Makeup libraries, Skin CSS imports, design tokens, Floating UI, Storybook configuration, and other critical external dependencies.

## Makeup Libraries (Framework-Agnostic Accessibility)

**Purpose:** Low-level JavaScript utilities providing WCAG-compliant interaction patterns shared across Marko and React

**Core Makeup libraries (14+):**
- `makeup-roving-tabindex` - Keyboard navigation in lists/menus (Arrow keys)
- `makeup-expander` - Expand/collapse widgets
- `makeup-keyboard-trap` - Focus trapping for modals
- `makeup-active-descendant` - Active descendant pattern for comboboxes
- `makeup-typeahead` - Typeahead/autocomplete behavior
- `makeup-floating-label` - Floating label animations
- `makeup-focusables` - Query focusable elements
- `makeup-key-emitter` - Keyboard event standardization
- `makeup-prevent-scroll-keys` - Prevent scrolling on arrow/space keys
- `makeup-screenreader-trap` - Screen reader mode detection

**Usage pattern (Marko):**
```javascript
import RovingTabindex from 'makeup-roving-tabindex';

class {
  onCreate() {
    this.rovingTabindex = null;
  }

  onMount() {
    this.rovingTabindex = RovingTabindex.createLinear(
      this.getEl('menu'),
      '[role="menuitem"]'
    );
  }

  onDestroy() {
    this.rovingTabindex?.destroy();
  }
}
```

**Usage pattern (React):**
```typescript
import { useEffect, useRef } from 'react';
import RovingTabindex from 'makeup-roving-tabindex';

const Menu = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instance = RovingTabindex.createLinear(
      menuRef.current,
      '[role="menuitem"]'
    );
    return () => instance?.destroy();
  }, []);

  return <div ref={menuRef}>...</div>;
};
```

## Skin CSS Integration

### Marko Components
**Import in style.ts:**
```typescript
import "@ebay/skin/button";
import "@ebay/skin/icon";
```

**Global requirements:** Apps must load `@ebay/skin/global` and `@ebay/skin/marketsans`

### React Components
**Pre-compiled CSS:** Components consume CSS from dist directory
**No direct SCSS imports:** React package uses built CSS files

## Design Tokens

**Package:** `@ebay/design-tokens` (v2+)
**Provides:** Colors, spacing, typography, breakpoints as CSS variables

**Usage in SCSS:**
```scss
@import '@ebay/design-tokens/variables';

.component {
  color: var(--color-text-primary);
  padding: var(--spacing-200);
  font-family: var(--font-family-market-sans);
}
```

**CSS custom properties available in runtime:** Access tokens via `var(--token-name)`

## Floating UI

**Packages:**
- `@floating-ui/dom` - Marko components
- `@floating-ui/react` - React components

**Purpose:** Dynamic positioning for tooltips, infotips, tourtips, popovers

**Usage pattern (Marko):**
```javascript
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

onMount() {
  computePosition(referenceEl, floatingEl, {
    placement: 'bottom',
    middleware: [offset(8), flip(), shift({ padding: 8 })]
  }).then(({ x, y }) => {
    Object.assign(floatingEl.style, {
      left: `${x}px`,
      top: `${y}px`
    });
  });
}
```

## Storybook Integration

**Packages:**
- `@storybook/marko-vite` - Marko components
- `@storybook/react-vite` - React components
- `@storybook/addon-a11y` - Accessibility testing
- `@storybook/addon-docs` - Documentation generation

**Story format:** Component Story Format (CSF) 3.0

**Interaction testing:** Define `play` functions for automated interaction tests

**Visual regression:** Percy.io integration via `@percy/storybook`

## Testing Libraries

**Marko:**
- `@marko/testing-library` - DOM queries and user interactions
- `@vitest/browser` - Browser mode via Playwright
- `vitest` - Test runner

**React:**
- `@testing-library/react` - Component rendering and interactions
- `@testing-library/user-event` - User interaction simulation
- `vitest` - Test runner (jsdom environment)

## Build Tools

**Primary:** Vite for build and dev server
**Plugins:**
- `@marko/vite` - Marko compilation
- `@vitejs/plugin-react` - React support
- `vite-plugin-cjs-interop` - CommonJS interop

**CSS processing:**
- PostCSS with autoprefixer
- Clean-CSS for minification
- Sass for SCSS compilation

## Version Control

**Changesets:** `@changesets/cli` for version management
**Workflow:** Create changeset → merge PR → automatic versioning → publish

## Non-goals
- Build configuration details (see 05-system-build-deployment.md)
- Component-specific dependency usage (see component implementation files)
- Testing strategy (see 01-system-testing-strategy.md)
- Accessibility patterns (see 00-domain-accessibility-patterns.md)
