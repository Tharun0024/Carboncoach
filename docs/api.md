# CarbonCoach API

This document specifies the API endpoints for the CarbonCoach backend.

---

### `POST /api/chat`

Initiates or continues a chat conversation with the AI coach. The response is streamed over Server-Sent Events (SSE).

**Request Body:**
```json
{
  "content": "I didn't have time to bike to work this week.",
  "session_id": "user-session-abc-123"
}
```

**Response (Streaming SSE):**
The server pushes multiple `data` events. The stream is terminated by `data: [DONE]`.

```
data: {"chunk": "That's okay"}
data: {"chunk": ", sometimes life gets in the way."}
data: {"chunk": " Let's see if we can find a smaller action for next week."}
data: [DONE]
```

---

### `GET /api/assessments`

Retrieves a list of all historical carbon footprint assessments for the authenticated user.

**Example Response:**
```json
[
  {
    "id": "asmt_1",
    "created_at": "2025-01-15T10:00:00Z",
    "total_kg_co2e": 1250.5,
    "breakdown": {
      "transport": 600.0,
      "energy": 450.5,
      "food": 200.0
    }
  }
]
```

---

### `POST /api/assessments`

Creates a new carbon footprint assessment. This is typically called after the initial onboarding conversation.

**Request Body:**
```json
{
  "lifestyle_data": {
    "commute_km_per_week": 50,
    "commute_method": "car",
    "flights_per_year": 2,
    "diet_preference": "beef_eater"
  }
}
```

**Example Response:**
```json
{
  "id": "asmt_2",
  "created_at": "2025-01-22T11:30:00Z",
  "total_kg_co2e": 1195.0,
  "breakdown": {
    "transport": 550.0,
    "energy": 450.0,
    "food": 195.0
  }
}
```

---

### `GET /api/actions/current`

Retrieves the currently assigned action for the user.

**Example Response:**
```json
{
  "id": "act_123",
  "title": "Switch to plant-based meals for 2 days",
  "description": "Replace two beef or chicken meals with a plant-based alternative like lentils, beans, or tofu.",
  "potential_savings_kg_co2e": 5.4,
  "assigned_at": "2025-01-22T12:00:00Z",
  "status": "assigned"
}
```

---

### `POST /api/actions/assign`

Requests the AI to generate and assign the next best action for the user based on their latest assessment.

**Request Body:** (Empty)
```json
{}
```

**Example Response:**
```json
{
  "id": "act_124",
  "title": "Lower your thermostat by 1 degree",
  "description": "Reducing your heating by just one degree can save a surprising amount of energy over a week.",
  "potential_savings_kg_co2e": 10.2,
  "assigned_at": "2025-01-29T12:00:00Z",
  "status": "assigned"
}
```

---

### `PATCH /api/actions/{id}/complete`

Marks a specific action as either completed or skipped by the user.

**URL Parameter:**
- `id`: The ID of the action to update (e.g., `act_124`).

**Request Body:**
```json
{
  "status": "completed"
}
```

**Example Response:**
```json
{
  "id": "act_124",
  "status": "completed",
  "completed_at": "2025-02-05T09:00:00Z"
}
```
