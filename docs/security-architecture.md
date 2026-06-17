# Security Architecture

This document describes the layered defensive architecture of **CarbonCoach**, detailing how incoming requests are filtered and processed.

---

## 1. Request Filtering Pipeline

Every incoming request to the CarbonCoach backend undergoes a multi-layered verification process before reaching the business logic or external services:

```
    [ User Request ]
           │
           ▼
┌──────────────────────────────┐
│  SecurityHeadersMiddleware   │  <-- Set secure headers (CSP, Frame-Options, etc.)
└──────────┬───────────────────┘
           │ (Pass)
           ▼
┌──────────────────────────────┐
│        CORSMiddleware        │  <-- Verify origin constraints (e.g. localhost, frontend_url)
└──────────┬───────────────────┘
           │ (Pass)
           ▼
┌──────────────────────────────┐
│        SlowAPI Limiter       │  <-- Enforce rate limits (10/min for /api/chat)
└──────────┬───────────────────┘
           │ (Pass)
           ▼
┌──────────────────────────────┐
│       Pydantic Schema        │  <-- Validate structural bounds (UUID formats, lengths)
└──────────┬───────────────────┘
           │ (Pass)
           ▼
┌──────────────────────────────┐
│        Service Layer         │  <-- Router redirects call to Chat Service
└──────────┬───────────────────┘
           │
           ├─────────────────────────┐
           ▼                         ▼
  ┌─────────────────┐       ┌─────────────────┐
  │ sanitize_input  │       │  validate_chat  │  <-- Trim spaces, drop control chars,
  └─────────────────┘       └────────┬────────┘      validate constraints, check injections.
                                     │ (Pass)
                                     ▼
                            ┌─────────────────┐
                            │  Intent Router  │  <-- Route intent (extraction, checkin, etc.)
                            └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   LLM Client    │  <-- Formulate system prompt and stream response
                            └─────────────────┘
```

---

## 2. Component Defense Breakdown

### Middleware Layer
* **Security Headers**: Injected transparently using `SecurityHeadersMiddleware` (inherited from `BaseHTTPMiddleware`). Adds defense against Clickjacking, MIME-sniffing, and cross-site scripting (XSS).
* **CORS Policy**: Configured in `main.py` using FastAPI's standard middleware, ensuring only approved origins (e.g., local development environments and the production frontend URL) can read API responses.

### Rate Limiting Layer
* **Decorator Routing**: Individual endpoints are decorated with `@limiter.limit()`. If a user client exceeds limits, they receive `429 Too Many Requests`.
* **State Isolation**: Rate limit states are held in-memory via SlowAPI, avoiding database lookups for high-velocity request verification.

### Validation Layer
* **Centralized Exceptions**: If custom validation (`validators.py`) detects a problem, it raises a `ValueError`. This is caught globally in `main.py` and mapped to `422 Unprocessable Content` before response serialization.
* **Separation of Concerns**: Chat routing controllers in `chat.py` only delegate inputs to service layer handlers, remaining clean of validation details.

---

## 3. Database Row-Level Security (RLS)

CarbonCoach leverages **Supabase** as its database provider. All client operations utilize Row-Level Security policies to ensure complete tenant separation:

* **Assessments Isolation**:
  * Assessment data is tied to a user session UUID (`session_id`).
  * RLS policies restrict operations so clients can only select/insert assessments matching their active session UUID.
* **Actions Isolation**:
  * Actions are linked to specific users and their respective assessments.
  * Update operations (e.g., marking an action as completed or skipped) are gated by checks comparing the incoming session token/cookie with the target row owner.
