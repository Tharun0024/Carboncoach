# Frontend Testing Strategy

## Purpose
The frontend testing suite is designed to ensure the stability, correct user interaction, and high accessibility compliance of the CarbonCoach components. It covers:
* **Component Testing**: Verifies that components render correctly with standard props and mock configurations.
* **Accessibility Testing**: Explicitly checks crucial ARIA roles, live regions, labels, and focus targets.
* **Interaction Testing**: Verifies that user inputs (text inputs, button clicks) update states and invoke triggers appropriately.

## Coverage
We explicitly test three core UI pillars:
* **[ChatInterface](file:///y:/PW3/frontend/tests/ChatInterface.test.tsx)**: Message logs, streaming indicators, inputs, and button states.
* **[ActionCard](file:///y:/PW3/frontend/tests/ActionCard.test.tsx)**: Card details, skipped/completed status, and user-action forms.
* **[FootprintCard](file:///y:/PW3/frontend/tests/FootprintCard.test.tsx)**: Visual charts, legends, data parsing, and labels.

## Accessibility Coverage
Our tests target WCAG 2.1 compliance and verify specific attributes:
* **`aria-live`**: Ensures chat logs use `polite` and streaming text uses `assertive` for screen readers.
* **`aria-label`**: Verifies descriptive summaries on charts and readable cues on all active buttons.
* **`role="log"`**: Asserts correct container role mapping on conversation displays.

## Testing Philosophy
* **Deterministic**: All tests run without side effects.
* **No Network Calls**: All services and APIs are mocked (network boundaries are not crossed).
* **Isolated Components**: Hooks and sub-elements are mocked at test boundaries to ensure rapid, isolated checks.
