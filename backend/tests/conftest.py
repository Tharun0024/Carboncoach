import pytest
from unittest.mock import MagicMock, AsyncMock
from fastapi.testclient import TestClient
import json
import os

# Mock settings globally at import time to prevent Pydantic ValidationErrors when .env is absent.
from unittest.mock import patch
mock_settings = {
    "supabase_url": "http://mock-supabase.com",
    "supabase_key": "mock-key",
    "anthropic_api_key": "mock-anthropic-key",
    "rate_limit_enabled": True,
    "frontend_url": "http://localhost:3000"
}
patch("app.config.get_settings", lambda: MagicMock(**mock_settings)).start()

from app.main import app
from app.database import get_supabase_client
from app.config import get_settings

# --- Fixtures for Mocking Dependencies ---

@pytest.fixture(scope="session")
def test_app():
    """Yield a TestClient for the FastAPI app."""
    with TestClient(app) as client:
        yield client

@pytest.fixture(autouse=True)
def override_dependencies(monkeypatch):
    """Mocks dependencies for all tests, preventing real network calls."""
    monkeypatch.setattr("app.config.get_settings", lambda: MagicMock(**mock_settings))
    
    # Mock Supabase client
    mock_supabase = MagicMock()
    monkeypatch.setattr("app.database.get_supabase_client", lambda: mock_supabase)
    
    # Mock Anthropic client
    mock_anthropic_client = MagicMock()
    mock_anthropic_client.messages.stream = MagicMock()
    monkeypatch.setattr("app.services.chat_service.AsyncAnthropic", lambda api_key: mock_anthropic_client)


@pytest.fixture
def mock_supabase_client(monkeypatch):
    """Provides a fresh MagicMock for Supabase for per-test configuration."""
    mock_supabase = MagicMock()
    monkeypatch.setattr("app.database.get_supabase_client", lambda: mock_supabase)
    return mock_supabase

@pytest.fixture
def mock_anthropic(monkeypatch):
    """Provides a fresh AsyncMock for Anthropic for per-test configuration."""
    mock_anthropic_client = MagicMock()
    mock_anthropic_client.messages.stream = MagicMock()
    monkeypatch.setattr("app.services.chat_service.AsyncAnthropic", lambda api_key: mock_anthropic_client)
    return mock_anthropic_client


# --- Fixtures for Test Data ---

@pytest.fixture(scope="session")
def emission_factors():
    """Load emission factors from the project's JSON file."""
    path = os.path.join(os.path.dirname(__file__), '..', 'app', 'data', 'emission_factors.json')
    with open(path, 'r') as f:
        return json.load(f)

@pytest.fixture(scope="session")
def actions_library():
    """Load the actions library from the project's JSON file."""
    path = os.path.join(os.path.dirname(__file__), '..', 'app', 'data', 'actions_library.json')
    with open(path, 'r') as f:
        return json.load(f)

@pytest.fixture
def urban_commuter():
    """Test data for a user with a high transport footprint."""
    return {
        "commute_km_per_week": 280,
        "commute_method": "car",
        "flights_per_year_short": 4,
        "electricity_kwh_per_month": 350,
        "diet_type": "omnivore",
    }

@pytest.fixture
def student():
    """Test data for a user with a lower, more varied footprint."""
    return {
        "commute_km_per_week": 20,
        "commute_method": "public_transit",
        "flights_per_year_short": 1,
        "electricity_kwh_per_month": 120,
        "diet_type": "vegetarian",
    }

@pytest.fixture
def chennai_commuter():
    """Test data for a typical Chennai commuter using rickshaws, metro, and LPG."""
    return {
        "auto_rickshaw_km_per_week": 28,
        "metro_km_per_week": 42,
        "car_km_per_week": 0,
        "flights_per_year": 1,
        "electricity_kwh_per_month": 180,
        "lpg_kg_per_month": 12,
        "diet_type": "non_vegetarian",
        "primary_meal": "dal_rice",
        "shopping_level": "low"
    }

