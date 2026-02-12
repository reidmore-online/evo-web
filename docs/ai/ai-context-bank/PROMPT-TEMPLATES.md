# Prompt Templates

## Overview

This document provides prompt templates for common development tasks in evo-web. Each template follows the structure: ROLE → CONTEXT → REQUIREMENT → INSTRUCTIONS.

## Template 1: Feature Development - New Component

```
ROLE: You are an expert frontend developer working on eBay's design system.

CONTEXT:
I need to create a new component for the evo-web monorepo. Please review these context files:
- docs/ai/ai-context-bank/ARCHITECTURE.md
- docs/ai/ai-context-bank/contexts/00-system-coding-standards.md
- docs/ai/ai-context-bank/contexts/00-domain-accessibility-patterns.md
- docs/ai/ai-context-bank/contexts/01-domain-component-lifecycle.md
- docs/ai/ai-context-bank/contexts/02-domain-theming-styling.md

REQUIREMENT:
Create a new [Marko/React] component called ebay-{component-name} with the following features:
- {Feature 1}
- {Feature 2}
- {Feature 3}

The component must:
- Follow BEM naming conventions
- Meet WCAG 2.2 AA standards
- Support keyboard navigation
- Support RTL and dark mode
- Include comprehensive tests

INSTRUCTIONS:
1. Create the component file structure following ARCHITECTURE.md patterns
2. Implement the component with proper ARIA attributes
3. Add keyboard navigation using appropriate Makeup libraries
4. Create Storybook stories demonstrating all variants
5. Write browser and server tests (Marko) or jsdom tests (React)
6. Update component README with usage examples
7. Add accessibility documentation
8. Create a changeset describing the new feature
```

## Template 2: Bug Fix

```
ROLE: You are debugging an issue in the evo-web component library.

CONTEXT:
Please review these context files:
- docs/ai/ai-context-bank/contexts/03-system-repo-navigation.md
- docs/ai/ai-context-bank/contexts/01-domain-component-lifecycle.md
- docs/ai/ai-context-bank/contexts/02-system-error-handling-logging.md

REQUIREMENT:
Fix the following bug in [component-name]:
{Bug description}

Steps to reproduce:
1. {Step 1}
2. {Step 2}
3. {Step 3}

Expected behavior: {Description}
Actual behavior: {Description}

INSTRUCTIONS:
1. Locate the component using repo navigation patterns
2. Identify the root cause in component lifecycle or event handling
3. Implement the fix following coding standards
4. Add regression tests to prevent future occurrences
5. Update component tests if behavior changed
6. Create a changeset describing the bug fix (patch version)
7. Verify the fix doesn't break other component features
```

## Template 3: Refactoring

```
ROLE: You are refactoring code in the evo-web monorepo to improve maintainability.

CONTEXT:
Please review these context files:
- docs/ai/ai-context-bank/ARCHITECTURE.md
- docs/ai/ai-context-bank/contexts/00-system-coding-standards.md
- docs/ai/ai-context-bank/contexts/03-system-repo-navigation.md

REQUIREMENT:
Refactor [component/utility] to:
- {Refactoring goal 1}
- {Refactoring goal 2}
- {Refactoring goal 3}

Constraints:
- Maintain backward compatibility (no breaking changes)
- Preserve existing test coverage
- Follow established patterns

INSTRUCTIONS:
1. Analyze current implementation and identify improvements
2. Plan refactoring to maintain API compatibility
3. Update implementation following coding standards
4. Ensure all existing tests pass
5. Add tests for any new internal behaviors
6. Update documentation if public API enhanced
7. Create changeset (patch if internal, minor if new features)
```

## Template 4: Adding Tests

```
ROLE: You are adding test coverage to an existing evo-web component.

CONTEXT:
Please review these context files:
- docs/ai/ai-context-bank/contexts/01-system-testing-strategy.md
- docs/ai/ai-context-bank/contexts/00-domain-accessibility-patterns.md
- docs/ai/ai-context-bank/contexts/04-system-dependency-integration.md

REQUIREMENT:
Add comprehensive tests for [component-name] covering:
- Click interactions
- Keyboard interactions
- Focus management
- ARIA attributes
- Accessibility compliance (WCAG 2.2 AA)

INSTRUCTIONS:
1. Review existing tests to identify coverage gaps
2. Create test file(s) following organization patterns:
   - Marko: test.browser.js and/or test.server.js
   - React: __tests__/*.spec.tsx
3. Organize tests by interaction type (Click, Keyboard, Focus, ARIA, Accessibility)
4. Use Given/When/Then pattern with nested beforeEach blocks
5. Add Storybook interaction tests using play functions
6. Verify tests pass locally: npm test -w packages/{package-name}
7. Check coverage report to ensure improvement
```

## Template 5: Code Review

```
ROLE: You are reviewing a pull request for the evo-web repository.

CONTEXT:
Please review these context files:
- docs/ai/ai-context-bank/contexts/00-system-coding-standards.md
- docs/ai/ai-context-bank/contexts/00-domain-accessibility-patterns.md
- docs/ai/ai-context-bank/contexts/02-domain-theming-styling.md
- docs/ai/ai-context-bank/contexts/01-system-testing-strategy.md

Also reference:
- .github/copilot-instructions.md (PR checklist)

REQUIREMENT:
Review PR #{number} for compliance with evo-web standards.

INSTRUCTIONS:
1. Check code follows BEM naming conventions
2. Verify WCAG 2.2 AA accessibility compliance:
   - Semantic HTML preferred over ARIA
   - Proper keyboard navigation
   - Sufficient color contrast
   - Focus management
3. Confirm CSS changes regenerated dist files
4. Verify tests added/updated appropriately
5. Check for RTL and dark mode support
6. Ensure Storybook stories included
7. Verify changeset created (if not docs-only)
8. Check conventional commit message format
9. Provide constructive feedback with examples
```

## Template 6: Build/CI Issue

```
ROLE: You are troubleshooting a build or CI failure in evo-web.

CONTEXT:
Please review these context files:
- docs/ai/ai-context-bank/contexts/05-system-build-deployment.md
- docs/ai/ai-context-bank/contexts/03-system-repo-navigation.md
- docs/ai/ai-context-bank/contexts/04-system-dependency-integration.md

REQUIREMENT:
Investigate and fix the following build/CI failure:
{Error message or failure description}

Build stage: {lint/typecheck/test/build/deploy}
Package: {skin/ebayui-core/ebayui-core-react/evo-marko}

INSTRUCTIONS:
1. Identify the failing build stage and package
2. Review build script order (lint → typecheck → test → build)
3. Check for:
   - Linting errors (ESLint, Stylelint, Prettier)
   - Type checking failures (mtc for Marko, tsc for React)
   - Test failures
   - Uncommitted dist file changes
4. Fix the root cause following established patterns
5. Verify fix locally: npm run build
6. Ensure CI will pass on next push
```

## Template 7: Accessibility Enhancement

```
ROLE: You are improving accessibility compliance in an evo-web component.

CONTEXT:
Please review these context files:
- docs/ai/ai-context-bank/contexts/00-domain-accessibility-patterns.md
- docs/ai/ai-context-bank/contexts/00-system-coding-standards.md
- docs/ai/ai-context-bank/contexts/01-domain-component-lifecycle.md

Also reference:
- eBay MIND Patterns: https://ebay.gitbooks.io/mindpatterns/content/
- Component accessibility docs: https://opensource.ebay.com/evo-web/components/{component}/accessibility

REQUIREMENT:
Improve accessibility for [component-name] to address:
- {Accessibility issue 1}
- {Accessibility issue 2}
- {Accessibility issue 3}

INSTRUCTIONS:
1. Review current ARIA implementation against MIND patterns
2. Implement semantic HTML improvements (prefer native elements)
3. Add/fix keyboard navigation patterns (use Makeup libraries)
4. Improve focus management (initial focus, trapping, return focus)
5. Add ARIA attributes only where necessary (follow Five Rules of ARIA)
6. Test with keyboard only (no mouse)
7. Add accessibility tests using axe-core
8. Update component accessibility documentation
9. Create changeset describing improvements
```

## Customizing Templates

When using these templates:
1. Replace `{placeholders}` with specific details
2. Add/remove context files based on task complexity
3. Adjust instructions for task-specific requirements
4. Include relevant issue/PR numbers for traceability
