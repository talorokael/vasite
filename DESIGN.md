# Nature Inspired Skincare, Body & Beauty Products

## Mission
Create implementation-ready, token-driven UI guidance for Nature Inspired Skincare, Body & Beauty Products that is optimized for consistency, accessibility, and fast delivery across e-commerce storefront.

## Brand
- Product/brand: Nature Inspired Skincare, Body & Beauty Products
- URL: https://www.thebodyshop.com/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=Aktiv Grotesk`, `font.family.stack=Aktiv Grotesk`, `font.size.base=14px`, `font.weight.base=400`, `font.lineHeight.base=20px`
- Typography scale: `font.size.xs=0px`, `font.size.sm=11px`, `font.size.md=12px`, `font.size.lg=13px`, `font.size.xl=14px`, `font.size.2xl=16px`, `font.size.3xl=18px`, `font.size.4xl=19.2px`
- Color palette: `color.text.primary=#ffffff`, `color.text.secondary=#004236`, `color.text.tertiary=#373737`, `color.text.inverse=#131010`, `color.surface.base=#000000`, `color.surface.strong=#fafafa`
- Spacing scale: `space.1=5px`, `space.2=6px`, `space.3=7px`, `space.4=8px`, `space.5=9.6px`, `space.6=10px`, `space.7=10.5px`, `space.8=11.4px`
- Radius/shadow/motion tokens: `radius.xs=3px`, `radius.sm=999px` | `motion.duration.instant=250ms`, `motion.duration.fast=300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (646), buttons (212), inputs (21), lists (10), navigation (3).


## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
