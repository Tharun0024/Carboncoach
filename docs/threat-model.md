# Threat Model

This document identifies assets, potential threats, and corresponding mitigations within the **CarbonCoach** application architecture.

---

## 1. Asset Classification

We classify our system assets as follows:

| Asset ID | Asset Name | Description | Sensitivity |
| --- | --- | --- | --- |
| **A-01** | User Session ID | UUID mapping a user's anonymous session for footprint calculations. | Medium |
| **A-02** | Assessment Data | Lifestyle parameters (flights, commute, diet) and CO2e footprints. | Medium |
| **A-03** | Weekly Actions | Active and completed carbon-saving commitments assigned to users. | Low |
| **A-04** | LLM Prompts | System instructions guiding Claude's coaching behavior. | Medium |
| **A-05** | API Credentials | Supabase and Anthropic API keys used by the backend. | High |

---

## 2. Threat Analysis & Mitigations

We categorise threats based on potential impact vectors:

### Threat Category: Prompt Injection (Model Manipulation)
* **Threat Description**: Adversarial users input prompt-override sequences (e.g., "Ignore previous instructions") to hijack the LLM backend. This could leak internal system prompts or cause the bot to generate offensive/inappropriate responses.
* **Affected Assets**: **A-04** (LLM Prompts)
* **Mitigation**:
  * **Input Scanning**: Enforce `contains_prompt_injection` keyword filters in `validators.py` to block suspicious request payloads.
  * **Structured Framing**: Ensure LLM instructions are strictly placed within system prompt parameters separate from the user query.
  * **Haiku Model Constraints**: Use Claude 3 Haiku configured with strict context guidelines.

### Threat Category: API Abuse & Denial of Service (DoS)
* **Threat Description**: Bots or malicious clients flood chat or calculations endpoints to consume token limits, drive up infrastructure costs, or exhaust backend resources.
* **Affected Assets**: **A-05** (API Credentials)
* **Mitigation**:
  * **Rate Limiting**: Apply decorator-based rate limits (`10 requests/minute`) on the `/api/chat` endpoint using `slowapi`.
  * **Strict Payload Sizing**: Validate that incoming chat message bodies are between 1 and 2000 characters.

### Threat Category: Clickjacking & Frame Sniffing
* **Threat Description**: Attackers embed the CarbonCoach web page inside an invisible `<iframe>` on a malicious domain, tricking users into executing unintended actions.
* **Affected Assets**: **A-02** (Assessment Data), **A-03** (Weekly Actions)
* **Mitigation**:
  * **X-Frame-Options**: Set to `DENY` globally using the `SecurityHeadersMiddleware`.
  * **Content-Security-Policy**: Configured with `frame-ancestors 'none'` to block frame insertion.

### Threat Category: Cross-Site Scripting (XSS)
* **Threat Description**: Injection of malicious JavaScript into inputs, query parameters, or database storage that runs in the browser context of other users.
* **Affected Assets**: **A-01** (User Session ID)
* **Mitigation**:
  * **Input Sanitization**: Strip all hidden ASCII control characters (`\x00-\x1F\x7F-\x9F`) using `sanitize_input`.
  * **React Sanitization**: Leverage React's default safe string escaping during render cycles.
  * **Content-Security-Policy**: Enforce strict source restrictions (`default-src 'self'`).

### Threat Category: Referrer & Information Leakage
* **Threat Description**: Sensitive headers or URL session IDs leak to third-party services during cross-domain navigation.
* **Affected Assets**: **A-01** (User Session ID)
* **Mitigation**:
  * **Referrer Policy**: Enforce `strict-origin-when-cross-origin` on all responses.
  * **Secure REST boundaries**: Do not pass session tokens or UUIDs in URL query parameters; transmit them only in request body JSON schemas.
