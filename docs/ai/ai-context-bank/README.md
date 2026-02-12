# AI Context Bank

## Overview

This directory contains focused context files designed to help AI assistants understand the evo-web codebase architecture, patterns, and standards. Each file is 250-500 words and owns specific knowledge domains without duplication.

## When to Use This Context Bank

**Use when:**
- Starting a new task in the evo-web repository
- Understanding component architecture or patterns
- Implementing new features following established conventions
- Debugging issues related to build, testing, or accessibility
- Reviewing PRs for compliance with project standards

**Don't use when:**
- Working on trivial changes that don't require architectural knowledge
- Looking for implementation details of specific components (use component READMEs instead)

## Context Selection Guide

### For New Component Development

**Required contexts:**
1. `ARCHITECTURE.md` - Understand where components belong
2. `00-system-coding-standards.md` - API patterns and naming conventions
3. `00-domain-accessibility-patterns.md` - WCAG compliance requirements
4. `01-domain-component-lifecycle.md` - State management patterns
5. `02-domain-theming-styling.md` - BEM and CSS patterns

**Optional contexts:**
6. `01-system-testing-strategy.md` - Test organization
7. `04-system-dependency-integration.md` - Makeup libraries and Floating UI

### For Bug Fixes

**Required contexts:**
1. `03-system-repo-navigation.md` - Find relevant files
2. `01-domain-component-lifecycle.md` - Understand state and lifecycle
3. `02-system-error-handling-logging.md` - Event patterns

**Optional contexts:**
4. `01-system-testing-strategy.md` - Add regression tests
5. `00-domain-accessibility-patterns.md` - If accessibility-related

### For Refactoring

**Required contexts:**
1. `ARCHITECTURE.md` - System boundaries
2. `00-system-coding-standards.md` - Maintain consistency
3. `03-system-repo-navigation.md` - Locate shared utilities

**Optional contexts:**
4. `04-system-dependency-integration.md` - Dependency changes
5. `01-system-testing-strategy.md` - Update tests

### For Adding Tests

**Required contexts:**
1. `01-system-testing-strategy.md` - Test organization and infrastructure
2. `00-domain-accessibility-patterns.md` - Accessibility test requirements

**Optional contexts:**
3. `01-domain-component-lifecycle.md` - Component behavior to test
4. `04-system-dependency-integration.md` - Storybook integration

### For Build/CI Issues

**Required contexts:**
1. `05-system-build-deployment.md` - Build scripts and CI pipeline
2. `03-system-repo-navigation.md` - Config file locations

**Optional contexts:**
3. `04-system-dependency-integration.md` - Dependency issues

### For Code Review

**Required contexts:**
1. `00-system-coding-standards.md` - Code quality standards
2. `00-domain-accessibility-patterns.md` - Accessibility compliance
3. `02-domain-theming-styling.md` - CSS/BEM compliance

**Optional contexts:**
4. `ARCHITECTURE.md` - Architectural alignment
5. `01-system-testing-strategy.md` - Test coverage

## Ownership Map

**ARCHITECTURE.md** - Package structure, build flows, component file layouts, integration boundaries

**System Contexts:**
- `00-system-coding-standards.md` - BEM, HTML, TypeScript, API patterns, responsive breakpoints
- `01-system-testing-strategy.md` - Vitest config, test organization, story-based testing, coverage
- `02-system-error-handling-logging.md` - Custom events, error boundaries, console logging
- `03-system-repo-navigation.md` - Directory structure, component locations, documentation paths
- `04-system-dependency-integration.md` - Makeup libraries, Skin CSS, design tokens, Floating UI, Storybook
- `05-system-build-deployment.md` - Build order, Vite, CSS compilation, changesets, CI/CD

**Domain Contexts:**
- `00-domain-accessibility-patterns.md` - WCAG 2.2, progressive enhancement, MIND patterns, ARIA, keyboard nav, focus management
- `01-domain-component-lifecycle.md` - Marko stateless pattern, React hooks, SSR, hydration, events
- `02-domain-theming-styling.md` - BEM implementation, CSS variables, RTL, dark mode, Skin integration

## Contributing to Context Bank

**When adding content:**
1. Check ownership map - does it belong in an existing file?
2. Avoid duplication - reference other context files instead
3. Keep within 250-500 word limit
4. Update "Non-goals" section to prevent scope creep
5. Update this README ownership map

**When updating content:**
1. Maintain word count limits
2. Preserve existing structure
3. Cross-reference related contexts
4. Update modification date

## Related Documentation

- `/CLAUDE.md` - Project-wide Claude Code instructions
- `/packages/*/README.md` - Package-specific documentation
- `/.github/copilot-instructions.md` - PR review checklist
- `/packages/skin/STYLEGUIDE.md` - CSS/BEM style guide
- Component READMEs - Individual component documentation
