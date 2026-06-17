# Security Policy

This document outlines the security policies, vulnerability reporting processes, and security architecture safeguards implemented in the **CarbonCoach** application.

## Supported Versions

Only the latest release version is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

We take the security of CarbonCoach seriously. If you find a security vulnerability, please do **not** open a public issue. Instead, report it using the following process:

1. **Email the Maintainers**: Send a detailed report to `security@carboncoach.example.com`.
2. **Details to Include**:
   * Description of the vulnerability.
   * Steps or script to reproduce the behavior (Proof of Concept).
   * Potential impact (e.g., privilege escalation, data leakage).
3. **Response Timeline**: We will acknowledge receipt of your report within 48 hours and provide an estimated resolution timeline.

---

## Security Controls

CarbonCoach is designed with defensive depth in mind. The following controls are built-in:

### 1. Input Validation and Sanitization
* **Layered Defense**: Input validation is enforced at both the HTTP entry points (via Pydantic schemas) and within the service layer before processing.
* **Control Character Filtering**: String inputs are sanitized to drop dangerous control characters (`\x00-\x1F\x7F-\x9F`) except standard formatted whitespaces like newlines and tabs.
* **Size Enforcement**: User prompts are capped at 2000 characters to prevent resource depletion attacks.

### 2. Prompt Injection Mitigation
* **Keyword Detection**: The application checks incoming chat messages for common prompt injection patterns, including:
  * `ignore previous instructions`
  * `system:`
  * `act as`
  * `you are now`
  * `forget previous instructions`
* **Defensive Action**: Matching requests are immediately aborted and return a `422 Unprocessable Content` response to prevent model manipulation.

### 3. Rate Limiting
* **IP-based Limits**: High-frequency endpoints like `/api/chat` are rate-limited using a sliding window algorithm (capped at 10 requests per minute per IP address) to prevent Denial of Service (DoS) and API abuse.

### 4. Security Headers Middleware
* All responses from the backend API include security-hardening HTTP headers:
  * `X-Content-Type-Options: nosniff` (Prevents MIME sniffing)
  * `X-Frame-Options: DENY` (Defends against clickjacking)
  * `Referrer-Policy: strict-origin-when-cross-origin` (Reduces referrer leakage)
  * `Permissions-Policy` (Restricts browser APIs)
  * `Content-Security-Policy` (Limits source origins for scripts, objects, and framing)

### 5. Supabase RLS (Row-Level Security)
* Database operations are secured using Supabase Row-Level Security policies, ensuring that user session assessments and actions are isolated and only readable/writeable by the session owner.
