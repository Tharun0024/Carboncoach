# CarbonCoach - Testing Strategy

This document describes the test architecture, goals, and commands for the CarbonCoach project.

---

## 1. Core Testing Goals
- **High Coverage**: Cover core calculation algorithms and state-transition logic in the backend, plus interaction flow and accessibility in the frontend.
- **Deterministic Runs**: Prevent flakiness by fully mocking the database layer (Supabase) and the LLM layer (Anthropic Claude).
- **Automation Ready**: Maintain configurations that integrate easily with GitHub Actions workflows.

---

## 2. Test Suites

### Backend Testing (Pytest)
Located in `backend/tests/`.
- **Unit Tests**: Focus on pure services ([footprint_service](file:///y:/PW3/backend/tests/unit/test_footprint_service.py) and [action_service](file:///y:/PW3/backend/tests/unit/test_action_service.py)).
- **Integration Tests**: Verify end-to-end API response, rate limits, and schema validations in [test_chat_endpoint](file:///y:/PW3/backend/tests/integration/test_chat_endpoint.py).
- **Run Command**:
  ```bash
  pytest backend/tests/
  ```

### Frontend Testing (Vitest)
Located in `frontend/tests/`.
- **Component & A11y Tests**: Verify core interactive components render cleanly and satisfy specific WCAG attributes.
- **Run Command**:
  ```bash
  npm run test
  ```
