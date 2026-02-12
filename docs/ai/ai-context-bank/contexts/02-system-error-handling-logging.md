# System: Error Handling & Logging

## Purpose
Defines event error handling patterns, custom event object structures, console logging conventions, event propagation patterns, and React error boundary usage.

## Custom Event Object Structure

**Standard event object pattern:**
```javascript
{
  originalEvent: Event,      // Native browser event (always included)
  el: HTMLElement,           // Target element (context-specific)
  index: number,             // Item index (lists, menus, tabs)
  checked: boolean,          // Checkbox/radio state
  checkedIndex: number,      // Selected item index (radio groups)
  value: string              // Input value (form controls)
}
```

**Key principle:** Always include `originalEvent` to preserve native event data for consumers who need access to preventDefault(), stopPropagation(), etc.

## Event Utilities

**Marko event utilities:** `packages/ebayui-core/src/common/event-utils/`
**React event utilities:** `packages/ebayui-core-react/src/common/event-utils/`

**Purpose:** Standardize event object creation and emission across components

**Example usage:**
```typescript
// Marko
import { emit } from '../../common/event-utils';
emit(component, 'change', { originalEvent: e, checked: e.target.checked });

// React
const handleChange = (e: ChangeEvent) => {
  onChange?.({ originalEvent: e, checked: e.target.checked });
};
```

## Console Logging

**Test configuration:** `onConsoleLog: () => true` in vite.config.mjs allows console statements in tests for debugging

**Production:** Avoid console.log in production code; use events for communication

**Development:** Console logging acceptable for debugging but should be removed before PR submission

## Event Propagation

**Marko:** Events emit upward to parent components via Marko's event system
**React:** Standard React synthetic event bubbling and callback pattern

**Stopping propagation:** Consumers can call `originalEvent.stopPropagation()` if needed

## Error Boundaries (React)

**Not currently standardized:** Error boundaries are component-specific
**Best practice:** Wrap dialog and modal components with error boundaries to prevent full app crashes

**Example pattern:**
```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

## Validation and Error States

**Form validation:** Components should support `invalid` or `error` attributes for validation states
**ARIA integration:** Use `aria-invalid`, `aria-describedby` for error messaging
**Visual feedback:** Leverage Skin CSS classes for error styling

## Event Handler Safety

**Always check for handler existence before calling:**
```javascript
// Marko
if (input.onChange) {
  emit(component, 'change', eventData);
}

// React
onChange?.(eventData);
```

**TypeScript optional chaining:** Use `?.` operator for safer callback invocation

## Debugging Support

**Browser DevTools:** All custom events should be inspectable in browser event listeners panel
**Component names:** Ensure components have meaningful names for debugging (displayName in React, component names in Marko)

## Non-goals
- Testing strategy details (see 01-system-testing-strategy.md)
- Component lifecycle management (see 01-domain-component-lifecycle.md)
- Accessibility error states (see 00-domain-accessibility-patterns.md)
- Build error handling and linting (see 05-system-build-deployment.md)
