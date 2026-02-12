# Domain: Component Lifecycle

## Purpose
Describes Marko component lifecycle and state management, React hooks patterns, SSR considerations, client-side hydration, and event-driven state synchronization.

## Marko Component Lifecycle

### Stateless by Default

**Critical principle:** Passing new attributes to a Marko component resets its internal state

**Impact:** Components cannot maintain internal state across attribute changes from parent

**Example:**
```marko
<ebay-lightbox-dialog open=state.dialogOpen>
  <!-- If state.dialogOpen changes, internal state resets -->
</ebay-lightbox-dialog>
```

### State Persistence via Events

**Pattern:** Synchronize state in parent component using event handlers

**Implementation:**
```marko
class {
  onCreate() {
    this.state = { dialogIsOpen: false, selectedIndex: 0 };
  }

  handleDialogClose() {
    this.state.dialogIsOpen = false;
  }

  handleDialogOpen() {
    this.state.dialogIsOpen = true;
  }

  handleItemSelect(event) {
    this.state.selectedIndex = event.index;
  }
}

<ebay-lightbox-dialog
  open=state.dialogIsOpen
  on-open("handleDialogOpen")
  on-close("handleDialogClose")>
  <!-- Dialog content -->
</ebay-lightbox-dialog>
```

**Event objects:** Receive data via custom event objects (see 02-system-error-handling-logging.md)

### Component Lifecycle Hooks

**Server-side (always runs):**
- `onCreate()` - Component initialization
- `onInput()` - Processes input attributes
- `onRender()` - Before render

**Client-side (browser only):**
- `onMount()` - After component mounted to DOM
- `onUpdate()` - After component re-rendered
- `onDestroy()` - Before component removed from DOM

### Client-Side Behavior (component-browser.ts)

**Purpose:** Define browser-only behavior separately from SSR template

**Example:**
```typescript
export default class {
  onCreate() {
    this.rovingTabindex = null;
  }

  onMount() {
    // Initialize Makeup libraries
    this.rovingTabindex = RovingTabindex.createLinear(
      this.getEl('menu'),
      '[role="menuitem"]'
    );
  }

  onDestroy() {
    // Cleanup
    this.rovingTabindex?.destroy();
  }
}
```

**Key pattern:** Initialize third-party libraries in `onMount()`, cleanup in `onDestroy()`

## React Component Patterns

### Standard Hooks Usage

**State management:**
```typescript
const [open, setOpen] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(0);
```

**Effects for side effects:**
```typescript
useEffect(() => {
  // Mount behavior
  const instance = RovingTabindex.createLinear(ref.current, '[role="menuitem"]');

  return () => {
    // Cleanup
    instance?.destroy();
  };
}, [dependencies]);
```

**Refs for DOM access:**
```typescript
const menuRef = useRef<HTMLDivElement>(null);
```

### Controlled vs Uncontrolled

**Controlled:** Parent manages state via props
```tsx
<EbayDialog open={isOpen} onClose={() => setIsOpen(false)} />
```

**Uncontrolled:** Component manages internal state
```tsx
<EbayDialog defaultOpen={true} />
```

**Preference:** Support both patterns when appropriate

## SSR (Server-Side Rendering) Considerations

### Marko SSR

**Always SSR:** Marko components render on server by default
**Output:** HTML string with embedded hydration data
**Client hydration:** Browser executes `component-browser.ts` after HTML loads

**SSR-safe patterns:**
- Avoid `window`, `document`, `navigator` in onCreate/onInput/onRender
- Use `if (typeof window !== 'undefined')` for browser-only code
- Prefer lifecycle hooks (`onMount()`) for browser APIs

### React SSR

**Conditional SSR:** React components may or may not SSR depending on app setup
**Hydration mismatches:** Ensure server and client render same initial output
**useEffect safety:** Effects only run client-side, safe for browser APIs

## Client-Side Hydration

### Marko Hydration

**Process:**
1. Server sends rendered HTML
2. Browser loads JavaScript bundle
3. Marko attaches event listeners and runs `onMount()`
4. Component becomes interactive

**Flags:** Marko components use flags for conditional rendering; requires `<lasso-page/>` tag

### React Hydration

**Process:**
1. Server sends rendered HTML (if SSR enabled)
2. React hydrates existing DOM
3. Event listeners attached
4. Components become interactive

**Hydration errors:** Avoid content mismatches between server and client renders

## Event-Driven Architecture

### Marko Events

**Emission:**
```javascript
emit(this, 'change', { originalEvent: e, checked: e.target.checked });
```

**Subscription:**
```marko
<ebay-checkbox on-change("handleChange")>
```

**Handler:**
```javascript
handleChange(event) {
  // event = { originalEvent, checked }
  this.state.isChecked = event.checked;
}
```

### React Events

**Callback props:**
```typescript
interface Props {
  onChange?: (event: { originalEvent: ChangeEvent; checked: boolean }) => void;
}
```

**Invocation:**
```typescript
onChange?.({ originalEvent: e, checked: e.target.checked });
```

## Component Composition

**Marko:** Use `@tags` for nested component patterns
```marko
<ebay-menu>
  <@item>Option 1</@item>
  <@item>Option 2</@item>
</ebay-menu>
```

**React:** Use `children` prop and compound component pattern
```tsx
<EbayMenu>
  <EbayMenuItem>Option 1</EbayMenuItem>
  <EbayMenuItem>Option 2</EbayMenuItem>
</EbayMenu>
```

## Non-goals
- Testing patterns (see 01-system-testing-strategy.md)
- Error handling specifics (see 02-system-error-handling-logging.md)
- Build and deployment details (see 05-system-build-deployment.md)
- Accessibility implementation (see 00-domain-accessibility-patterns.md)
