# CarbonCoach - Repository Quality Report

This document reports on the engineering quality signals built into the CarbonCoach repository.

---

## 1. Architectural Integrity
- **Service Layer Pattern**: Thin routing controllers delegate all database, LLM, and calculation operations to dedicated service modules.
- **Strict Fetch Isolation**: Fetch calls are exclusively located in [api.ts](file:///y:/PW3/frontend/src/lib/api.ts). Frontend components consume data via state management hooks using React Query.
- **System Prompt Separation**: System instructions are stored as plain text templates, reducing model pollution and eliminating injection risks.

---

## 2. Strong Typing & Validation
- **Pydantic Schemas**: Enforce structure and length limits on all API inputs in [schemas.py](file:///y:/PW3/backend/app/models/schemas.py).
- **TypeScript**: Strict types define the application domains in [index.ts](file:///y:/PW3/frontend/src/types/index.ts).

---

## 3. High Accessibility (A11y)
- **Contrast and Touch Targets**: All interactive elements utilize min-height classes of `44px` for touch targets.
- **Screen Reader Hooks**: Containers specify `role="log"` and active `aria-live` flags for live-updates.
