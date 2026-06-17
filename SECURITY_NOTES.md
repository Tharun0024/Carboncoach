# CarbonCoach Security Notes

This document outlines the security strategies and considerations for the CarbonCoach project.

## 1. Input Validation
- **Backend**: All incoming request data is validated by FastAPI using Pydantic schemas defined in `app/models/schemas.py`. This enforces types, lengths, and formats, preventing common data-based attacks.
- **Frontend**: User input is validated on the client-side to provide immediate feedback, but the backend validation is the canonical source of truth.

## 2. Rate Limiting
- **Strategy**: The backend uses the `slowapi` library to enforce rate limits on sensitive or expensive endpoints.
- **Implementation**: The `/api/chat` endpoint is limited to 10 requests per minute per IP address. This helps prevent DoS attacks and abuse of the LLM API.

## 3. Prompt Injection Defense
- **Strategy**: We treat all user input as potentially hostile. User-provided content is never directly formatted into system prompts.
- **Implementation**:
    - System prompts are loaded from read-only `.txt` files.
    - User input (`user_message`) is passed to the LLM in the designated `user` role of the conversation, separate from the `system` role.
    - The backend does not construct prompts by concatenating strings with user input.

## 4. Supabase Row-Level Security (RLS)
- **Strategy**: RLS is the primary mechanism for data isolation, ensuring users can only access their own data.
- **Implementation**:
    - RLS policies must be enabled on all tables containing user-specific data (e.g., `assessments`, `user_actions`).
    - Policies will be written to check that the `user_id` in the row matches the `auth.uid()` of the authenticated user making the request.
    - The Supabase `anon` key exposed to the public has limited read/write access, governed strictly by these RLS policies.

## 5. Secret Management
- **Strategy**: No secrets are ever committed to the Git repository.
- **Implementation**:
    - **Backend**: Secrets (`SUPABASE_KEY`, `ANTHROPIC_API_KEY`) are loaded from a `.env` file (which is in `.gitignore`) into the application settings via `pydantic-settings`.
    - **Frontend**: Public keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are stored in `.env.local` and exposed to the browser with the `NEXT_PUBLIC_` prefix.
    - **Production**: Secrets will be injected as environment variables by the hosting providers (Railway, Vercel).

## 6. Authentication Approach (Future)
- **Strategy**: Authentication will be handled by Supabase Auth.
- **Implementation Plan**:
    1. The frontend will use the `supabase-js` library to handle user sign-up, sign-in, and session management.
    2. On successful login, Supabase provides a JWT.
    3. This JWT will be sent in the `Authorization` header of every request to our FastAPI backend.
    4. The backend will have a security dependency that validates the JWT against the Supabase project's JWT secret.
    5. The validated user ID from the token will be used for all database queries, replacing the current placeholder user IDs.
