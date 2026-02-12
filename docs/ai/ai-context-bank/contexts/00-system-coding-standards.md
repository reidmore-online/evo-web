# System: Coding Standards

## Purpose
Defines code organization, naming conventions, semantic HTML requirements, TypeScript/type checking standards, and API patterns for attributes and events across Marko and React components.

## BEM Naming Conventions

**Double-dash for modifiers:** `.btn--primary`, `.btn--large`
**Double-underscore for nested elements:** `.btn__cell`, `.btn__text`

**Rules:**
- Never chain BEM modifiers (e.g., `.btn--large.btn--primary`)
- Avoid ambiguous class names (use `.btn--large` not `.large`)
- No presentational names (use `.btn--secondary` not `.btn--green`)
- Don't combine classes (use `.btn .btn--sec` not `.btn-sec`)
- Use CSS logical properties or `[dir="rtl"]` selectors for RTL support

## Semantic HTML Requirements

**Always prefer native HTML over ARIA:** Use semantic HTML5 elements (`<button>`, `<nav>`, `<main>`, `<section>`) before adding ARIA roles.

**Five Rules of ARIA:**
1. Use native HTML if available
2. Don't change native semantics with ARIA
3. Interactive elements must be keyboard accessible
4. Don't use `role="presentation"` or `aria-hidden="true"` on focusable elements
5. All interactive elements must have accessible names

**Additional Requirements:**
- Never use `<i>` for icons; use `<svg>`
- Every `<img>` must have `alt` attribute (can be empty string for decorative images)
- Don't wrap inputs with labels; use explicit `for` and `id` attributes
- Use `disabled` HTML property, not `.disabled` class
- Leverage ARIA for styling hooks (accepted specificity trade-off for accessibility safeguarding)

## Component API Patterns

### Marko Components

**Attribute definitions in marko-tag.json:**
```json
{
  "@text": "string",
  "@type": "string",
  "@on-change": "function"
}
```

**Event naming:** `on-{event}` (e.g., `on-change`, `on-open`, `on-close`)

**Custom event objects include:**
- `originalEvent`: Native browser event
- Additional properties: `el`, `index`, `checked`, `checkedIndex` (context-specific)

**Pass-through attributes:**
- Static: `<ebay-button id="my-button"/>`
- Dynamic: `<ebay-button html-attributes={ id: "my-id" }/>`
- Applied to most prominent tag (usually root or form control)

### React Components

**TypeScript types in types.ts:**
```typescript
export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
```

**Event naming:** `on{Event}` (e.g., `onChange`, `onOpen`, `onClose`)

**Pass-through attributes:** Standard React props spread to root element

## Type Checking Requirements

**Marko:** Run `mtc` (Marko Type Check) for type validation
**React:** TypeScript required; enforce strict mode in tsconfig.json
**Both:** Type checks must pass before build

## Code Organization Patterns

**Component structure:** See ARCHITECTURE.md for file layout
**Shared utilities:** Place in `src/common/` directory
**Base components:** Extend from `packages/ebayui-core/src/components/components/` (dialog-base, notice-base, tooltip-base)

**Import order:**
1. External dependencies
2. Internal cross-package imports
3. Local component imports
4. Style imports (last)

## Responsive Breakpoints

**Standard breakpoints:** 320px, 512px, 768px, 1024px, 1280px, 1440px, 1680px, 1920px

Use CSS Grid or Flexbox for responsive layouts.

## Non-goals
- Testing patterns (see 01-system-testing-strategy.md)
- Accessibility implementation details (see 00-domain-accessibility-patterns.md)
- Build and deployment configuration (see 05-system-build-deployment.md)
- Component lifecycle patterns (see 01-domain-component-lifecycle.md)
- CSS theming and styling specifics (see 02-domain-theming-styling.md)
