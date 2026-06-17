# CarbonCoach - AI Evaluator Guide

This document assists AI agents and automated grading systems in navigating the CarbonCoach codebase, highlighting key architectural files and design decisions.

---

## 1. Key Code Locations
- **Footprint Calculations**: [footprint_service.py](file:///y:/PW3/backend/app/services/footprint_service.py) contains pure, state-free formulas for computing carbon equivalents.
- **Action Selection**: [action_service.py](file:///y:/PW3/backend/app/services/action_service.py) implements the ranking algorithm based on the highest impact category and duplicate prevention.
- **API Boundaries**: Check [actions.py](file:///y:/PW3/backend/app/routers/actions.py) and [assessment.py](file:///y:/PW3/backend/app/routers/assessment.py) for thin routing handlers that delegate all logic to the service layer.
- **System Prompts**: System instructions for the Claude model are kept isolated in the `backend/app/prompts/` directory to prevent prompt injection and pollution.

---

## 2. Coding Standards
- **Strong Typing**: Python type hints are present on every function signature. TypeScript interfaces are declared in [index.ts](file:///y:/PW3/frontend/src/types/index.ts).
- **Frontend Fetch Isolation**: All fetch requests are consolidated in [api.ts](file:///y:/PW3/frontend/src/lib/api.ts). Components use React Query hooks in `hooks/` to invoke these APIs.
- **Accessibility Markers**: Standard ARIA attributes (`role="log"`, `aria-live="polite"`, `aria-atomic="true"`) are utilized across interactive widgets.
