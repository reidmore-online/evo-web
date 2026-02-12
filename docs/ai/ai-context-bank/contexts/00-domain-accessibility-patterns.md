# Domain: Accessibility Patterns

## Purpose
Describes WCAG 2.2 AA compliance requirements, progressive enhancement approach, eBay MIND patterns, ARIA usage guidelines, keyboard navigation patterns, focus management, and roving tabindex implementation.

## WCAG 2.2 AA Compliance

**Requirement:** All components must meet WCAG 2.2 Level A and AA standards

**Testing:** Use axe-core via `@storybook/addon-a11y` or `@testing-library/jest-dom` for automated accessibility testing

**Key criteria:**
- Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- Keyboard accessibility for all interactive elements
- Screen reader compatibility with proper ARIA
- Focus visibility for keyboard users
- No keyboard traps (except intentional modal focus trapping)

## Progressive Enhancement Layers

**Layer 1 - Bones (HTML):** Semantic HTML5 provides baseline accessibility without JavaScript
**Layer 2 - Skin (CSS):** Visual styling via BEM classes, no semantic meaning in CSS
**Layer 3 - MakeupJS (JavaScript):** Enhanced interactions while maintaining HTML semantics

**Example:** A menu works as an unordered list without JS, gains keyboard navigation with JS

## eBay MIND Patterns

**Reference:** https://ebay.gitbooks.io/mindpatterns/content/

**Core patterns implemented:**
- Dialog (modal, non-modal, lightbox, panel, toast)
- Menu (action menu, radio menu, checkbox menu)
- Listbox (single-select, multi-select)
- Combobox (autocomplete, typeahead)
- Tabs (manual activation, automatic activation)
- Carousel (continuous, discrete)
- Accordion (expand/collapse)

**Pattern structure:** Each pattern defines HTML structure, ARIA attributes, keyboard interactions, and focus management

## ARIA Usage Guidelines

**Five Rules of ARIA:**
1. Always prefer native HTML (`<button>` over `<div role="button">`)
2. Don't change native semantics (`<button role="heading">` is wrong)
3. All interactive ARIA controls must be keyboard accessible
4. Don't use `role="presentation"` or `aria-hidden="true"` on focusable elements
5. All interactive elements must have accessible names

**ARIA for styling hooks:** Acceptable to use ARIA attributes as CSS selectors (specificity trade-off for accessibility safeguarding)

**Example:**
```css
[aria-expanded="true"] {
  /* Styling for expanded state */
}
```

## Keyboard Navigation Patterns

### Roving Tabindex (Lists/Menus)
**Implementation:** `makeup-roving-tabindex`
**Pattern:** Only one item has `tabindex="0"`, others have `tabindex="-1"`
**Navigation:** Arrow keys move focus, Home/End to first/last

**Example:**
```javascript
import RovingTabindex from 'makeup-roving-tabindex';
RovingTabindex.createLinear(menuEl, '[role="menuitem"]');
```

### Active Descendant (Comboboxes)
**Implementation:** `makeup-active-descendant`
**Pattern:** Input keeps focus, `aria-activedescendant` points to highlighted option
**Navigation:** Arrow keys change active descendant

### Tab Key Navigation
**Standard behavior:** Tab moves between interactive elements
**Within components:** Tab moves to next focusable element or exits component

## Focus Management

### Initial Focus
**Dialogs:** Focus first interactive element or designated element on open
**Menus/Listboxes:** Focus first item or previously selected item
**Comboboxes:** Focus input field

### Focus Trapping (Modals)
**Implementation:** `makeup-keyboard-trap`
**Pattern:** Tab cycles within dialog, Escape closes dialog
**Return focus:** On close, return focus to triggering element

**Example:**
```javascript
import KeyboardTrap from 'makeup-keyboard-trap';
const trap = KeyboardTrap.trap(dialogEl);
// On close:
trap.untrap();
triggerElement.focus();
```

### Focus Visibility
**Requirement:** Clear visual focus indicator for keyboard users
**Implementation:** CSS `:focus-visible` pseudo-class
**Avoid:** Removing focus outlines without providing alternative indication

## Screen Reader Support

**Accessible names:** All interactive elements need accessible names via:
- Visible text content
- `aria-label`
- `aria-labelledby`
- Associated `<label>` element

**State announcements:** Use ARIA states:
- `aria-expanded` (expandable widgets)
- `aria-selected` (selected items)
- `aria-checked` (checkboxes, radio buttons)
- `aria-pressed` (toggle buttons)
- `aria-disabled` (disabled elements)

**Live regions:** Use `aria-live` for dynamic content updates (toasts, notifications)

## Component-Specific Patterns

**Buttons:** Native `<button>` with proper type attribute
**Links:** `<a>` with valid href (not `#` or `javascript:void(0)`)
**Form controls:** Explicit labels with `for` and `id` association
**Icons:** Decorative icons have `aria-hidden="true"`, functional icons have accessible text

## RTL (Right-to-Left) Support

**CSS logical properties:** Use `margin-inline-start` instead of `margin-left`
**Directional selectors:** Use `[dir="rtl"]` when logical properties insufficient
**Keyboard navigation:** Arrow key direction reverses in RTL mode

## Dark Mode Support

**Requirement:** All components must work in dark mode
**Implementation:** CSS variables from design tokens
**Testing:** Verify sufficient contrast in both light and dark modes

## Non-goals
- Implementation details of specific Makeup libraries (see 04-system-dependency-integration.md)
- Testing strategy (see 01-system-testing-strategy.md)
- Component lifecycle patterns (see 01-domain-component-lifecycle.md)
- Coding standards for ARIA (see 00-system-coding-standards.md)
