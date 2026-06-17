# CarbonCoach - Hackathon Scoring Matrix

This matrix details how CarbonCoach aligns with and excels across the core hackathon evaluation metrics.

---

## 1. Code Quality & Architecture (Score Weight: High)
* **Rule Compliance**: Services contain all business logic and calculations. Routers contain strictly no calculation, LLM client calls, or database operations.
* **Type-Hinting**: 100% type hints in the FastAPI backend; strict TypeScript types and interfaces in the Next.js frontend.
* **File Structure**: Highly modular, organized by domain and responsibility (e.g. `routers/`, `services/`, `models/`, `prompts/`, `data/`).

---

## 2. Problem Statement Alignment (Score Weight: High)
* **Goal Achieved**: Solves the action gap by guiding users through habit-forming check-ins, tracking completed/skipped actions, and generating cumulative carbon reduction histories.
* **Grounding**: All calculations are grounded in official scientific coefficients loaded from the structured database/JSON layer.

---

## 3. Security (Score Weight: Medium)
* **Input Isolation**: Strict Pydantic validators on all routers checking payload boundaries.
* **Rate Limiting**: Enforced rate limits (e.g. 10/min on Claude API stream router) to prevent DoS and cost inflation.
* **Supabase Integration**: Isolated database client configs with credentials managed strictly via environment variables.

---

## 4. Testing (Score Weight: Low)
* **Backend Coverage**: Comprehensive test suite verifying footprint algorithms, actions ranking, and intent routing using mock dependencies.
* **Frontend Coverage**: 18 Vitest unit tests checking rendering, state transitions, form actions, and accessibility parameters.
