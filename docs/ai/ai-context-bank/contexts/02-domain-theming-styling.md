# Domain: Theming & Styling

## Purpose
Describes BEM methodology implementation, CSS variable usage, RTL support patterns, dark mode support, responsive breakpoints, Skin layer integration, and design token application.

## BEM (Block Element Modifier) Methodology

### Naming Convention

**Block:** Component root (e.g., `.btn`, `.menu`, `.dialog`)
**Element:** Child component (e.g., `.btn__cell`, `.menu__item`, `.dialog__header`)
**Modifier:** Variant or state (e.g., `.btn--primary`, `.menu--expanded`, `.dialog--lightbox`)

**Syntax:**
- Elements: `block__element` (double underscore)
- Modifiers: `block--modifier` (double dash)
- Combined: `block__element--modifier`

### BEM Rules

**Never chain modifiers:**
```css
/* Wrong */
.btn--large.btn--primary { }

/* Correct */
.btn--large-primary { }
/* Or use separate classes with proper specificity */
```

**No presentational names:**
```css
/* Wrong */
.btn--green { }

/* Correct */
.btn--secondary { }
```

**Don't combine classes:**
```css
/* Wrong - prevents cascade */
.btn-sec { }

/* Correct - allows composition */
.btn.btn--sec { }
```

### Specificity Management

**Keep specificity low:** Avoid over-nesting, prefer flat BEM structure
**ARIA as hooks:** Using ARIA for styling (e.g., `[aria-expanded="true"]`) is acceptable despite higher specificity
**Reason:** Safeguards against non-accessible markup

## CSS Variables (Design Tokens)

### Design Token Integration

**Source:** `@ebay/design-tokens` package provides CSS custom properties

**Import in SCSS:**
```scss
@import '@ebay/design-tokens/variables';

.component {
  color: var(--color-text-primary);
  background: var(--color-background-secondary);
  padding: var(--spacing-200);
  font-family: var(--font-family-market-sans);
  border-radius: var(--border-radius-50);
}
```

### Token Categories

**Colors:**
- `--color-text-primary`, `--color-text-secondary`
- `--color-background-primary`, `--color-background-secondary`
- `--color-border-default`, `--color-border-subtle`
- `--color-state-error`, `--color-state-success`

**Spacing:**
- `--spacing-50`, `--spacing-100`, `--spacing-200`, `--spacing-400`, etc.
- Based on 8px grid system

**Typography:**
- `--font-family-market-sans`
- `--font-size-12`, `--font-size-14`, `--font-size-16`, etc.
- `--line-height-tight`, `--line-height-normal`, `--line-height-loose`

**Breakpoints:**
- `--breakpoint-small: 320px`
- `--breakpoint-medium: 768px`
- `--breakpoint-large: 1024px`
- Full list: 320px, 512px, 768px, 1024px, 1280px, 1440px, 1680px, 1920px

## RTL (Right-to-Left) Support

### CSS Logical Properties

**Preferred approach:** Use logical properties for automatic RTL support

**Examples:**
```css
/* Wrong - hard-coded direction */
.component {
  margin-left: 8px;
  text-align: left;
}

/* Correct - logical properties */
.component {
  margin-inline-start: 8px;
  text-align: start;
}
```

**Logical property mapping:**
- `margin-left` → `margin-inline-start`
- `margin-right` → `margin-inline-end`
- `padding-left` → `padding-inline-start`
- `left` → `inset-inline-start`
- `text-align: left` → `text-align: start`

### Directional Selectors

**When logical properties insufficient:**
```css
.component {
  /* LTR default */
  transform: rotate(90deg);
}

[dir="rtl"] .component {
  /* RTL override */
  transform: rotate(-90deg);
}
```

### RTL Testing

**Storybook requirement:** All components must include RTL story
**Testing:** Verify layout, icons, and animations in both LTR and RTL modes

## Dark Mode Support

### Implementation

**Required:** All components must support dark mode via CSS variables

**Pattern:**
```css
.component {
  /* Light mode default via design tokens */
  background: var(--color-background-primary);
  color: var(--color-text-primary);
}

/* Dark mode handled by token values, not component CSS */
```

**Token switching:** Design tokens package handles dark mode value swapping

### Contrast Requirements

**WCAG compliance:** Verify sufficient contrast in both modes
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

## Responsive Design

### Breakpoint Strategy

**Mobile-first approach:** Base styles for smallest viewport, progressively enhance

**Media queries:**
```css
.component {
  /* Mobile (320px+) */
  display: block;
}

@media (min-width: 768px) {
  /* Tablet */
  .component {
    display: flex;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .component {
    display: grid;
  }
}
```

### Layout Tools

**CSS Grid:** For two-dimensional layouts
**Flexbox:** For one-dimensional layouts
**Avoid floats:** Prefer modern layout methods

## Skin Layer Integration

### Component Styles (Skin Package)

**Location:** `packages/skin/src/sass/{component}/`

**Structure:**
```
button/
├── _base.scss        # Core button styles
├── _primary.scss     # Primary variant
├── _secondary.scss   # Secondary variant
└── index.scss        # Public export
```

### Consuming Skin in Marko

**Import in component style.ts:**
```typescript
import "@ebay/skin/button";
import "@ebay/skin/icon";
```

**Required globals:** App must import:
```typescript
import "@ebay/skin/global";
import "@ebay/skin/marketsans";
```

### Consuming Skin in React

**Pre-compiled CSS:** React package uses built CSS from Skin dist/

**No direct SCSS:** Avoid SCSS compilation in React package

## CSS Architecture Principles

**Avoid over-specificity:** Fewer rules = faster style resolution
**Leverage cascade:** Use inheritance where appropriate
**Minimize nesting:** Keep SCSS nesting shallow (pseudo-selectors only preferred)
**No commented-out code:** Remove before committing
**Margin collapse:** Utilize CSS margin collapse for spacing

## Non-goals
- JavaScript styling patterns (see component implementations)
- Build process for CSS (see 05-system-build-deployment.md)
- Accessibility color contrast details (see 00-domain-accessibility-patterns.md)
- Component-specific styling patterns (see component CSS files)
