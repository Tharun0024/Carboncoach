# Security Checklist

This checklist acts as a sign-off document for the security hardening controls implemented in the **CarbonCoach** application.

---

## 1. Input Validation & Sanitization
- [x] **Character Length Enforced**: Pydantic schema enforces chat request content length between 1 and 2000 characters.
- [x] **Custom Bound Checking**: Servicing layer double-checks that input length remains within bounds (raises `ValueError` on failure).
- [x] **Control Character Strip**: Inputs are filtered through `sanitize_input` removing ASCII control codes (`\x00-\x1F\x7F-\x9F`) except standard formatted whitespace (`\n`, `\r`, `\t`).
- [x] **Whitespace Collapsing**: Multiple consecutive horizontal spaces are compressed into a single space to normalize prompts.

---

## 2. Prompt Injection Mitigations
- [x] **Injection Signature Check**: User messages are scanned for adversarial keywords:
  - `ignore previous instructions`
  - `system:`
  - `act as`
  - `you are now`
  - `forget previous instructions`
- [x] **Immediate Interception**: Suspicious user messages are rejected at the service boundaries, never reaching downstream Claude models.
- [x] **Centralized 422 Conversion**: Validation `ValueError` exceptions are caught globally by the FastAPI exception handler and return a `422 Unprocessable Content` status code.

---

## 3. Web & HTTP Security Headers
- [x] **Anti-Clickjacking**: The response header `X-Frame-Options` is set to `DENY`.
- [x] **Strict Content-Security-Policy**: CSP specifies `default-src 'self'; frame-ancestors 'none'; object-src 'none';`.
- [x] **MIME Sniffing Block**: Header `X-Content-Type-Options` is set to `nosniff`.
- [x] **Referrer Control**: Referrers are restricted via `Referrer-Policy: strict-origin-when-cross-origin`.
- [x] **Capabilities Gate**: Permissions-Policy isolates device APIs (`geolocation`, `microphone`, `camera`).

---

## 4. API & Resource Protection
- [x] **API Rate Limiting**: The `/api/chat` route is limited to 10 requests per minute per IP using `slowapi`.
- [x] **Supabase Tenant RLS**: Row-Level Security policies isolate user records by anonymous `session_id` UUIDs.
- [x] **Secret Isolation**: Development, staging, and production secrets are managed exclusively through environment configurations (`.env`) and never committed to code repositories.

---

## 5. Security Testing Strategy
- [x] **Isolated Unit Verification**: Unit tests verify all prompt injection patterns in isolation without external API dependencies.
- [x] **Header Verification Coverage**: Middleware tests confirm headers are correctly output on API endpoints.
- [x] **No Leakage Policy**: Testing configuration overrides dependencies to block real Anthropic/Supabase network calls.
