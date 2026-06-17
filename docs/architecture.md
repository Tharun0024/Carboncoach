# CarbonCoach Architecture

## 1. System Overview
CarbonCoach is a web application designed to help users understand and reduce their personal carbon footprint. It consists of a Next.js frontend, a FastAPI backend, a Supabase database for data persistence, and Anthropic's Claude API for AI-driven coaching. The system is designed to be modular, scalable, and secure.

## 2. Component Breakdown

### Frontend
- **Technology:** Next.js 14, Tailwind CSS, shadcn/ui
- **Responsibilities:**
    - Rendering the user interface.
    - Handling all user interactions (chat, dashboards, etc.).
    - Communicating with the FastAPI backend via a RESTful API.
    - Managing client-side state and session information.

### Backend
- **Technology:** FastAPI (Python 3.11+)
- **Responsibilities:**
    - Providing a secure API for the frontend.
    - Orchestrating interactions with the Claude LLM.
    - Managing business logic for assessments, actions, and user progress.
    - Interfacing with the Supabase database to persist and retrieve user data.
    - Handling user authentication and authorization.

### Supabase
- **Technology:** PostgreSQL, GoTrue, PostgREST
- **Responsibilities:**
    - Storing all user-related data, including authentication info, footprint assessments, and action history.
    - Providing a scalable and secure data layer.
    - Utilizing Row-Level Security (RLS) to enforce data access policies at the database level.

### Claude
- **Technology:** Anthropic's Claude API
- **Responsibilities:**
    - Powering the conversational AI coach.
    - Processing user messages to determine intent.
    - Generating personalized responses, insights, and actions based on structured prompts.

## 3. Chat Service Intent Router
The core of the AI coaching experience is the Chat Service, which includes an intent router. When a user sends a message, the backend routes it to the appropriate flow based on its inferred intent.

```
   User Message
       ↓
+-----------------+
|  Intent Router  |
+-----------------+
   |
   ├─ extraction  (Onboarding, data gathering)
   |
   ├─ checkin     (Weekly progress update)
   |
   ├─ question    (User asks for help or information)
   |
   └─ excuse      (User explains why an action wasn't completed)
```

This design ensures that each type of conversation is handled by a specialized prompt and logic path, leading to more accurate and context-aware AI responses.

## 4. Data Flow
1.  **Onboarding:** The user engages in a conversation with the AI. The `extraction` flow gathers data about their lifestyle (e.g., travel habits, diet, energy use).
2.  **Footprint Generation:** The backend uses the extracted data and emission factors to calculate the user's initial carbon footprint. This assessment is stored in Supabase.
3.  **Action Assignment:** Based on the user's footprint, the `action_gen` flow identifies and assigns a high-impact, personalized weekly action.
4.  **Weekly Check-in:** The `checkin` flow initiates a conversation to see if the user completed their action, updating their progress and offering encouragement. This cycle repeats, creating a continuous loop of assessment, action, and feedback.

## 5. Security Overview
- **Supabase RLS:** Row-Level Security is enabled by default to ensure that users can only access their own data.
- **Rate Limiting:** The API implements rate limiting to prevent abuse and ensure service stability.
- **Input Validation:** All incoming data from the client is rigorously validated using Pydantic models to prevent common injection attacks.
- **Prompt Injection Protection:** The backend uses structured prompts and sanitizes user input before sending it to the LLM to mitigate the risk of prompt injection.
