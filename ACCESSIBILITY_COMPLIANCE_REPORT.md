# CarbonCoach — Accessibility Compliance Report

**Standard:** WCAG 2.1 Level AA  
**Last audited:** June 2026  
**Tools used:** axe-core (via jest-axe), manual keyboard & screen-reader testing

---

## Summary

CarbonCoach is designed to be fully accessible to users with visual, motor, and cognitive disabilities. Every interactive component has been built and tested against WCAG 2.1 AA success criteria.

---

## Perceivable

| Criterion | Status | Implementation |
|---|---|---|
| 1.1.1 Non-text Content | ✅ Pass | All chart components use `role="img"` with descriptive `aria-label`. `FootprintCard` includes a `aria-describedby` linked to a visually-hidden `<span>` providing chart data in plain text. |
| 1.3.1 Info and Relationships | ✅ Pass | Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<nav>`) structure every page. Heading hierarchy follows `<h1>` → `<h2>` without skipping levels. |
| 1.3.2 Meaningful Sequence | ✅ Pass | DOM order matches visual order. No CSS that reorders content in a confusing way. |
| 1.4.1 Use of Color | ✅ Pass | Chart categories use both color and text labels. Status badges combine color with text ("Completed", "Skipped"). |
| 1.4.3 Contrast (Minimum) | ✅ Pass | All text meets 4.5:1 contrast ratio against the dark `#020617` background. Slate-400 text on dark backgrounds exceeds AA minimum. |
| 1.4.11 Non-text Contrast | ✅ Pass | Interactive element borders and focus rings meet 3:1 contrast ratio. |

## Operable

| Criterion | Status | Implementation |
|---|---|---|
| 2.1.1 Keyboard | ✅ Pass | All interactive elements (buttons, links, chat input) are keyboard-focusable. Tab order follows logical reading sequence. |
| 2.1.2 No Keyboard Trap | ✅ Pass | No modal or component traps focus. Users can always Tab away. |
| 2.3.1 Three Flashes | ✅ Pass | No content flashes more than 3 times per second. |
| 2.4.1 Bypass Blocks | ✅ Pass | A skip-to-content link (`<a>`) is the first child of `<body>` in `layout.tsx`. Styled with `sr-only focus:not-sr-only` — visible only on keyboard focus. |
| 2.4.2 Page Titled | ✅ Pass | Each page has a descriptive `<title>` set via Next.js metadata. |
| 2.4.6 Headings and Labels | ✅ Pass | All sections have descriptive headings linked via `aria-labelledby`. |
| 2.5.5 Target Size | ✅ Pass | All clickable targets meet the recommended 44×44px minimum touch area. |

## Understandable

| Criterion | Status | Implementation |
|---|---|---|
| 3.1.1 Language of Page | ✅ Pass | `<html lang="en">` is set in `layout.tsx`. |
| 3.2.1 On Focus | ✅ Pass | No context changes occur on focus alone. |
| 3.3.1 Error Identification | ✅ Pass | Chat input validation errors are announced via `role="alert"` with `aria-live="assertive"`. |
| 3.3.2 Labels or Instructions | ✅ Pass | All form inputs have associated `<label>` elements. |

## Robust

| Criterion | Status | Implementation |
|---|---|---|
| 4.1.2 Name, Role, Value | ✅ Pass | Custom components expose correct ARIA roles. Chat log uses `role="log"` with `aria-live="polite"` and `aria-atomic="true"`. |

---

## Motion & Reduced Motion

All Framer Motion animations check the `useReducedMotion()` hook and set `duration: 0` when the user prefers reduced motion. Additionally, `globals.css` includes:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Testing Methodology

- **Automated:** jest-axe (axe-core) runs on every component during `npx vitest run`
- **Manual:** Keyboard-only navigation tested across all pages
- **Screen reader:** Verified with NVDA on Windows
- **Reduced motion:** Tested with `prefers-reduced-motion: reduce` media query enabled

---

## Components Audited

| Component | ARIA Attributes | Keyboard | Reduced Motion |
|---|---|---|---|
| `ChatInterface` | `role="log"`, `aria-live="polite"`, `aria-atomic="true"` | ✅ | ✅ |
| `FootprintCard` | `aria-describedby` → hidden data summary | ✅ | ✅ |
| `ImpactTimeline` | `role="img"`, `aria-label` (dynamic) | N/A (chart) | ✅ |
| `StreakBadge` | `aria-label` on badge | ✅ | ✅ |
| `ActionCard` | Semantic `<article>` with heading | ✅ | ✅ |
| `RegionalComparison` | Progress bars with text labels | N/A (display) | ✅ |
| Skip-to-content link | `sr-only focus:not-sr-only` | ✅ | N/A |
