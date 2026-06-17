# CarbonCoach Backend

This directory contains the FastAPI backend for the CarbonCoach application.

## Architecture Summary

The backend is built using FastAPI and follows a strict separation of concerns:

-   **`main.py`**: The entry point of the application. It initializes the FastAPI app, middleware (CORS, rate limiting), and registers the API routers.
-   **`config.py`**: Manages all environment variables and application settings using `pydantic-settings`.
-   **`database.py`**: Handles the database connection (Supabase client).
-   **`routers/`**: Contains the API endpoints. Routers are responsible for handling incoming requests, validating data, and calling the appropriate service layer functions. They contain no business or database logic.
-   **`services/`**: Holds the core business logic of the application.
    -   `footprint_service.py`: Pure functions for calculating carbon footprints.
    -   `action_service.py`: Logic for selecting and ranking user actions.
    -   `chat_service.py`: Manages AI chat interactions, including intent routing and streaming responses from the Claude API.
-   **`models/`**: Defines the data structures.
    -   `schemas.py`: Pydantic schemas for API request/response validation and data transfer objects (DTOs).
-   **`prompts/`**: Stores the structured text prompts used to interact with the Claude LLM.
-   **`data/`**: Contains static data files like emission factors and the action library.

## Setup and Installation

1.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    # On Windows: venv\Scripts\activate
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the `backend/` directory by copying the example:
    ```bash
    cp .env.example .env
    ```
    Then, fill in the required values in the `.env` file.

4.  **Run the development server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://127.0.0.1:8000`.

## Testing

The project includes a comprehensive test suite using `pytest`. Tests are separated into `unit` and `integration` categories.

- **Mocked Dependencies**: All external services, including the Claude API and Supabase, are fully mocked during testing. This ensures that tests are fast, deterministic, and do not require network access or real API keys.
- **Coverage**: The test suite is configured to generate a coverage report, helping to identify untested parts of the codebase.

To run the full test suite and generate a coverage report:
```bash
pytest backend/tests/ --cov=app
```

## Environment Variables

The following environment variables are required to run the application.

| Variable            | Description                               |
| ------------------- | ----------------------------------------- |
| `SUPABASE_URL`      | The URL of your Supabase project.         |
| `SUPABASE_KEY`      | The `anon` key for your Supabase project. |
| `ANTHROPIC_API_KEY` | Your API key for the Anthropic Claude API.|
| `RATE_LIMIT_ENABLED`| Set to `True` or `False` to toggle API rate limiting. |
| `FRONTEND_URL`      | The URL of the frontend application for CORS. |
