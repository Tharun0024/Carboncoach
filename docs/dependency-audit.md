# Dependency Audit

This document audits the software libraries and dependencies used in the **CarbonCoach** application, detailing version constraints, safety implications, and risk mitigations.

---

## 1. Backend Dependencies

Backend requirements are specified in `backend/requirements.txt` and managed in a python virtual environment.

| Package | Version Range | Security Assessment | Mitigation Strategy |
| --- | --- | --- | --- |
| **fastapi** | `>=0.100.0,<0.111.0` | Provides structural routing. High performance. Minor CVEs addressed in modern ranges. | Regular dependency audits via `pip-audit`. |
| **uvicorn** | `>=0.22.0` | Light-weight ASGI server. Vulnerable to HTTP request smuggling if outdated. | Strict port isolation; bind only to trusted interfaces (e.g. `127.0.0.1`). |
| **pydantic** | `>=2.0.0,<3.0.0` | Core schema validation. V2 is memory-safe and runs natively in Rust. | Ensure type constraints (`UUID4`, `min_length`) are strictly declared. |
| **slowapi** | `>=0.1.9` | In-memory rate limiting wrapper around `limits`. | Configure storage limit sizes to avoid memory exhaustion during heavy loads. |
| **anthropic** | `>=0.18.0` | SDK for calling Claude APIs. Transport secured over HTTPS. | API keys must be injected via environment variables; never commit raw keys to version control. |
| **supabase** | `>=2.3.0` | Python client for Supabase DB access. | Force SSL connections for all database communications. |

---

## 2. Frontend Dependencies

Frontend packages are defined in `frontend/package.json` and resolved via npm.

| Package | Version Range | Security Assessment | Mitigation Strategy |
| --- | --- | --- | --- |
| **next** | `14.1.0` | Core React framework. Prone to routing or SSR vulnerability if unpatched. | Avoid using unstable experimental features. Standardize static builds. |
| **react** / **react-dom** | `18.2.0` | View layout framework. Built-in HTML output escaping (prevents XSS). | Avoid using `dangerouslySetInnerHTML` unless explicitly sanitized. |
| **uuid** | `^9.0.1` | Generates secure random session IDs. | Pin versions and import typings cleanly (`@types/uuid`). |
| **@tanstack/react-query** | `^5.22.2` | Data fetching state manager. | Implement error-state wrappers to avoid leaking API call internals to users. |

---

## 3. Best Practices & Policy

1. **Secret Scanning**: Credentials and sensitive keys (such as `SUPABASE_KEY` or `ANTHROPIC_API_KEY`) are stored exclusively in `.env` files and loaded via environment variables at runtime. They must **never** be committed to Git.
2. **Automated Auditing**:
   * For the Python backend: Run `pip-audit` to inspect dependencies.
   * For the React/Next frontend: Run `npm audit` to check for node package vulnerabilities.
3. **No Network Dependency in Testing**: All mock-ups and mocks in `tests/conftest.py` ensure that test suites do not make external calls, protecting secrets and sandboxing CI runs.
