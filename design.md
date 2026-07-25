# Global Scholar Publications

## Mission
Create implementation-ready, token-driven UI guidance for Global Scholar Publications that is optimized for consistency, accessibility, and fast delivery across content site.

## Brand
- Product/brand: Global Scholar Publications
- URL: https://global-2cz3.vercel.app/
- Audience: readers and knowledge seekers
- Product surface: content site

## Style Foundations
- Visual style: structured, tokenized, content-first
- Main font style: `font.family.primary=Space Grotesk`, `font.family.stack=Space Grotesk, Space Grotesk Fallback, Geist, Geist Fallback, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=9.5px`, `font.size.sm=10px`, `font.size.md=10.5px`, `font.size.lg=11px`, `font.size.xl=11.5px`, `font.size.2xl=12px`, `font.size.3xl=12.5px`, `font.size.4xl=13px`
- Color palette: `color.text.primary=lab(3.00391 0.421643 -2.14076)`, `color.text.secondary=#0a0a0a`, `color.surface.base=#000000`, `color.text.inverse=#2f115d`, `color.surface.muted=#ffffff`, `color.surface.raised=lab(85.1236 -0.612259 -3.7138)`, `color.surface.strong=lab(97.6675 0.338405 0.00327826)`, `color.border.default=lab(90.7074 0.338435 0.00326633)`, `color.border.muted=#e2dff0`, `color.border.strong=#eceaf4`
- Spacing scale: `space.1=4px`, `space.2=5px`, `space.3=7px`, `space.4=8px`, `space.5=9px`, `space.6=10px`, `space.7=12px`, `space.8=14px`
- Radius/shadow/motion tokens: `radius.xs=3px`, `radius.sm=6px`, `radius.md=7px`, `radius.lg=8px`, `radius.xl=12px`, `radius.2xl=16px`, `radius.step7=18px`, `radius.step8=50px` | `shadow.1=rgba(47, 17, 93, 0.04) 0px 4px 18px 0px`, `shadow.2=rgba(0, 0, 0, 0.08) 0px 12px 36px 0px`, `shadow.3=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`, `shadow.4=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px` | `motion.duration.instant=150ms`, `motion.duration.fast=180ms`, `motion.duration.normal=200ms`, `motion.duration.slow=300ms`, `motion.duration.slower=350ms`, `motion.duration.step6=400ms`, `motion.duration.step7=700ms`

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
- Include known page component density: cards (154), links (80), buttons (60), lists (5), inputs (2), navigation (2).


## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
